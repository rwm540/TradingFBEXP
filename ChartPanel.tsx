import React, { useEffect, useRef } from 'react';
// FIX: Separated value and type imports from 'lightweight-charts' to resolve
// potential module resolution issues with type definitions.
import { createChart, CrosshairMode } from 'lightweight-charts';
// FIX: Import CandlestickData directly from lightweight-charts instead of a non-existent export from ../types.
import type {
    IChartApi,
    ISeriesApi,
    UTCTimestamp,
    CandlestickData,
} from 'lightweight-charts';
// FIX: Import the 'Currency' type from the central 'types.ts' file instead of defining it locally.
import type { Currency } from './types';


interface ChartPanelProps {
    selectedPair: Currency;
    livePrice: number | null;
}

const generateInitialData = (initialPrice: number, count: number): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let price = initialPrice;
    const now = Math.floor(Date.now() / 1000);
    const timeStep = 15 * 60; // 15-minute candles

    for (let i = 0; i < count; i++) {
        const time = (now - (count - i) * timeStep) as UTCTimestamp;
        const open = price;
        const fluctuation = (Math.random() - 0.5) * (price * 0.01);
        const close = open + fluctuation;
        const high = Math.max(open, close) + Math.random() * (price * 0.005);
        const low = Math.min(open, close) - Math.random() * (price * 0.005);
        price = close;
        data.push({ time, open, high, low, close });
    }
    return data;
};

const ChartPanel: React.FC<ChartPanelProps> = ({ selectedPair, livePrice }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const lastCandleRef = useRef<CandlestickData | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const isInitialMountRef = useRef(true);

    const initialPriceMap: { [key: string]: number } = {
        'EUR/USD': 1.0885, 'GBP/USD': 1.27, 'USD/JPY': 157.0, 'AUD/USD': 0.66, 'USD/CAD': 1.37
    };
    const getInitialPrice = (pairValue: string) => initialPriceMap[pairValue] || 1.0 + (Math.random() * 0.5);

    const loadChartData = (chart: IChartApi) => {
        if (candlestickSeriesRef.current) {
            chart.removeSeries(candlestickSeriesRef.current);
        }

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350',
            borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a',
        });
        candlestickSeriesRef.current = candlestickSeries;

        const initialPrice = getInitialPrice(selectedPair.value);
        const initialData = generateInitialData(initialPrice, 100);
        candlestickSeries.setData(initialData);
        chart.timeScale().fitContent();

        if (initialData.length > 0) {
            lastCandleRef.current = initialData[initialData.length - 1];
        } else {
            lastCandleRef.current = null;
        }
    };

    // Effect for creating and initializing the chart once.
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartContainer = chartContainerRef.current;
        
        // The container needs a moment to get its final size in a complex flex layout.
        // A timeout of 0 pushes this to the end of the event queue, after layout is calculated.
        const timerId = setTimeout(() => {
            if (!chartContainer) return;
            
            const chart = createChart(chartContainer, {
                layout: { background: { color: '#161B22' }, textColor: 'rgba(255, 255, 255, 0.9)' },
                grid: { vertLines: { color: '#2B2B43' }, horzLines: { color: '#2B2B43' } },
                crosshair: { mode: CrosshairMode.Normal },
                rightPriceScale: { borderColor: '#485158' },
                timeScale: { borderColor: '#485158', timeVisible: true, secondsVisible: false },
            });
            chartRef.current = chart;

            const resizeObserver = new ResizeObserver(entries => {
                if (!entries || entries.length === 0) { return; }
                const { width, height } = entries[0].contentRect;
                chart.resize(width, height);
            });
            resizeObserver.observe(chartContainer);
            resizeObserverRef.current = resizeObserver;

            loadChartData(chart);
        }, 0);

        return () => {
            clearTimeout(timerId);
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect for handling selected pair change by updating the series
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            return;
        }
        
        if (!chartRef.current) return;
        loadChartData(chartRef.current);
    }, [selectedPair]);

    // Effect for updating the chart with the live price from props
    useEffect(() => {
        if (!candlestickSeriesRef.current || !lastCandleRef.current || livePrice === null) {
            return;
        }

        const updatedCandle: CandlestickData = {
            ...lastCandleRef.current,
            close: livePrice,
            high: Math.max(lastCandleRef.current.high, livePrice),
            low: Math.min(lastCandleRef.current.low, livePrice),
        };

        candlestickSeriesRef.current.update(updatedCandle);
        lastCandleRef.current = updatedCandle;

    }, [livePrice]);

    return (
        <div className="bg-[#161B22] p-4 rounded-lg border border-gray-700 h-full w-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-wrap">
                <h2 className="text-white font-semibold text-lg">{selectedPair.label}</h2>
                <div className="flex space-x-2 text-sm text-gray-400">
                    <button className="hover:text-white px-2 py-1">1m</button>
                    <button className="hover:text-white px-2 py-1">5m</button>
                    <button className="text-white font-bold bg-gray-700 rounded px-2 py-1">15m</button>
                    <button className="hover:text-white px-2 py-1">1H</button>
                    <button className="hover:text-white px-2 py-1">4H</button>
                    <button className="hover:text-white px-2 py-1">1D</button>
                </div>
            </div>
            <div ref={chartContainerRef} className="flex-grow w-full" />
        </div>
    );
};

export default ChartPanel;