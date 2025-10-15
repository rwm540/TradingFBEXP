

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import type { Currency, Trade, NewOrderRequest, AssetType, OptionTrade, NewOptionOrderRequest, WalletAsset, TradingCurrency, StakingPool, UserStake, LotteryPool, UserLotteryTicket, WalletTransaction, UserProfile } from './types';
import { currencyPairs, cryptoPairs, stockSymbols, commodityPairs, initialAssetsData, allTradablePairs, initialStakingPools, initialLotteryPools } from './constants';
import type { OrderConfirmationDetails } from './components/ConfirmationModal';
import type { OptionConfirmationDetails } from './components/OptionConfirmationModal';

// --- Lazy Loaded Components ---
const ChartPanel = React.lazy(() => import('./components/ChartPanel'));
const TradePanel = React.lazy(() => import('./components/TradePanel'));
const HistoryPanel = React.lazy(() => import('./components/HistoryPanel'));
const FundWalletModal = React.lazy(() => import('./components/FundWalletModal'));
const AlertModal = React.lazy(() => import('./components/AlertModal'));
const ConfirmationModal = React.lazy(() => import('./components/ConfirmationModal'));
const TradeOptionPanel = React.lazy(() => import('./components/TradeOptionPanel'));
const OptionHistoryPanel = React.lazy(() => import('./components/OptionHistoryPanel'));
const OptionConfirmationModal = React.lazy(() => import('./components/OptionConfirmationModal'));
const WalletModal = React.lazy(() => import('./components/WalletModal'));
const ConnectWalletModal = React.lazy(() => import('./components/ConnectWalletModal'));
const StakingPage = React.lazy(() => import('./components/StakingPage'));
const LotteryPage = React.lazy(() => import('./components/LotteryPage'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const TradeHistoryPage = React.lazy(() => import('./components/TradeHistoryPage'));
const OptionHistoryPage = React.lazy(() => import('./components/OptionHistoryPage'));
const StakingHistoryPage = React.lazy(() => import('./components/StakingHistoryPage'));
const LotteryHistoryPage = React.lazy(() => import('./components/LotteryHistoryPage'));
const WalletHistoryPage = React.lazy(() => import('./components/WalletHistoryPage'));
const ProfilePage = React.lazy(() => import('./components/ProfilePage'));


export type TradingMode = 'demo' | 'live';
export type View = 'trade' | 'tradeOption' | 'stacking' | 'lottery' | 'wallet' | 'tradeHistory' | 'optionHistory' | 'stakingHistory' | 'lotteryHistory' | 'walletHistory' | 'profile';

function App() {
  const [view, setView] = useState<View>('trade');
  const [tradingMode, setTradingMode] = useState<TradingMode>('demo');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- User Profile State ---
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'User One',
    firstName: 'User',
    lastName: 'One',
    email: 'user.one@example.com',
    profilePicture: null, // Will store a Base64 string
  });
  
  // Load user profile from localStorage on initial mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
    }
  }, []);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  }, [userProfile]);


  // --- Multi-Currency Balances ---
  const initialDemoBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    initialAssetsData.forEach(asset => {
        if (asset.symbol === 'USD' || asset.symbol === 'UT') {
            balances[asset.symbol] = 10000;
        } else {
            balances[asset.symbol] = asset.priceUSD > 0 ? 10000 / asset.priceUSD : 0;
        }
    });
    return balances;
  }, []);

  const [demoBalances, setDemoBalances] = useState<Record<string, number>>(initialDemoBalances);
  const [walletAssets, setWalletAssets] = useState<WalletAsset[]>(initialAssetsData);
  const [selectedTradingCurrency, setSelectedTradingCurrency] = useState<TradingCurrency>('USD');

  const [selectedPair, setSelectedPair] = useState<Currency>(allTradablePairs[0]);
  
  const [livePrices, setLivePrices] = useState<Map<string, number>>(new Map());

  // Refs for accessing latest state in async callbacks to prevent stale state issues.
  const livePricesRef = useRef(livePrices);
  useEffect(() => {
    livePricesRef.current = livePrices;
  }, [livePrices]);
  
  const tradingModeRef = useRef(tradingMode);
  useEffect(() => {
    tradingModeRef.current = tradingMode;
  }, [tradingMode]);

  // Standard Trades
  const [demoOrders, setDemoOrders] = useState<Trade[]>([]);
  const [liveOrders, setLiveOrders] = useState<Trade[]>([]);
  const [demoHistory, setDemoHistory] = useState<Trade[]>([]);
  const [liveHistory, setLiveHistory] = useState<Trade[]>([]);
  
  // Option Trades
  const [demoOptionOrders, setDemoOptionOrders] = useState<OptionTrade[]>([]);
  const [liveOptionOrders, setLiveOptionOrders] = useState<OptionTrade[]>([]);
  const [demoOptionHistory, setDemoOptionHistory] = useState<OptionTrade[]>([]);
  const [liveOptionHistory, setLiveOptionHistory] = useState<OptionTrade[]>([]);

  // Staking
  const [stakingPools, setStakingPools] = useState<StakingPool[]>(initialStakingPools);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  
  // Lottery
  const [lotteryPools, setLotteryPools] = useState<LotteryPool[]>(initialLotteryPools);
  const [userLotteryTickets, setUserLotteryTickets] = useState<UserLotteryTicket[]>([]);

  // Wallet Transactions
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] = useState(false);
  
  const [confirmationInfo, setConfirmationInfo] = useState<{
    isOpen: boolean;
    order: OrderConfirmationDetails | null;
  }>({ isOpen: false, order: null });

  const [optionConfirmationInfo, setOptionConfirmationInfo] = useState<{
    isOpen: boolean;
    order: OptionConfirmationDetails | null;
  }>({ isOpen: false, order: null });

  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: '',
  });
  
  const liveBalancesFromWallet = useMemo(() => 
    walletAssets.reduce((acc, asset) => {
        acc[asset.symbol] = asset.balance;
        return acc;
    }, {} as Record<string, number>), 
  [walletAssets]);

  const balances = tradingMode === 'demo' ? demoBalances : liveBalancesFromWallet;
  const balance = balances[selectedTradingCurrency] ?? 0;
  
  // Getters for standard trades
  const openOrders = tradingMode === 'demo' ? demoOrders : liveOrders;
  const tradeHistory = tradingMode === 'demo' ? demoHistory : liveHistory;
  
  // Getters for option trades
  const openOptionOrders = tradingMode === 'demo' ? demoOptionOrders : liveOptionOrders;
  const optionTradeHistory = tradingMode === 'demo' ? demoOptionHistory : liveOptionHistory;

  const twelveDataWsRef = useRef<WebSocket | null>(null);
  const finnhubWsRef = useRef<WebSocket | null>(null);

  const { finnhubSymbolMap, reverseFinnhubSymbolMap } = useMemo(() => {
    const fwdMap = new Map<string, string>();
    const revMap = new Map<string, string>();

    stockSymbols.forEach(p => {
        let finnhubSymbol: string;
        switch(p.value) {
            // Use ETF tickers for indices as they are more reliably supported for live data
            case 'US100/USD': finnhubSymbol = 'QQQ'; break; // Invesco QQQ Trust (NASDAQ 100)
            case 'US500/USD': finnhubSymbol = 'SPY'; break; // SPDR S&P 500 ETF Trust
            case 'US30/USD':  finnhubSymbol = 'DIA'; break; // SPDR Dow Jones Industrial Average ETF
            default: finnhubSymbol = p.value.split('/')[0];
        }
        fwdMap.set(p.value, finnhubSymbol);
        revMap.set(finnhubSymbol, p.value);
    });

    return { finnhubSymbolMap: fwdMap, reverseFinnhubSymbolMap: revMap };
  }, []);

  const { finnhubSymbols, twelveDataSymbols } = useMemo(() => {
    const allOpenOrders = [...demoOrders, ...liveOrders, ...demoOptionOrders, ...liveOptionOrders];
    const uniquePairs = new Set(allOpenOrders.map(order => order.pair));
    uniquePairs.add(selectedPair.value);
    const symbols = Array.from(uniquePairs);

    const finnhub: string[] = [];
    const twelveData: string[] = [];
    
    const stockValues = new Set(stockSymbols.map(p => p.value));

    symbols.forEach(s => {
      if (stockValues.has(s)) {
        finnhub.push(s);
      } else { // Forex and Crypto pairs fall back to Twelve Data
        twelveData.push(s);
      }
    });

    return { finnhubSymbols: finnhub, twelveDataSymbols: twelveData };
  }, [demoOrders, liveOrders, demoOptionOrders, liveOptionOrders, selectedPair]);

  // WebSocket for Twelve Data (Forex & Crypto)
  useEffect(() => {
    if (twelveDataWsRef.current) {
        twelveDataWsRef.current.close();
    }
    
    if (twelveDataSymbols.length === 0) return;

    console.log('[Debug] Subscribing to Twelve Data symbols:', twelveDataSymbols);
    const apiKey = "467b7dd6f3794630b573c59613400a92";
    const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`);
    twelveDataWsRef.current = ws;

    ws.onopen = () => {
        console.log('[Debug] Connected to Twelve Data WebSocket.');
        ws.send(JSON.stringify({
            action: 'subscribe',
            params: {
                symbols: twelveDataSymbols.join(','),
            },
        }));
    };

    ws.onmessage = (event) => {
        console.log('[Debug] Received from Twelve Data:', event.data);
        try {
            const data = JSON.parse(event.data);
            if (data.event === 'price' && data.symbol && typeof data.price === 'number') {
                setLivePrices(currentPrices => {
                    const newPrices = new Map(currentPrices);
                    newPrices.set(data.symbol, data.price);
                    return newPrices;
                });
            }
        } catch (error) {
            console.error("[Error] Failed to parse Twelve Data message:", event.data, error);
        }
    };

    ws.onerror = (event) => {
        console.error('[Error] Twelve Data WebSocket error occurred. See event object below for details.');
        console.error(event);
    };

    ws.onclose = (event) => {
        console.log(`[Debug] Disconnected from Twelve Data WebSocket. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
    };

    return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            ws.close();
        }
        twelveDataWsRef.current = null;
    };
  }, [twelveDataSymbols]);

  // WebSocket for Finnhub (Stocks)
  useEffect(() => {
    if (finnhubWsRef.current) {
        finnhubWsRef.current.close();
    }

    const symbolsToSubscribe = finnhubSymbols.map(s => finnhubSymbolMap.get(s)).filter(Boolean) as string[];
    if (symbolsToSubscribe.length === 0) return;

    console.log('[Debug] Subscribing to Finnhub symbols:', symbolsToSubscribe);
    const finnhubApiKey = "sandbox_c1v3b6a3v3j48d246c2g";
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${finnhubApiKey}`);
    finnhubWsRef.current = ws;

    ws.onopen = () => {
        console.log('[Debug] Connected to Finnhub WebSocket.');
        symbolsToSubscribe.forEach(symbol => {
            ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol }));
        });
    };

    ws.onmessage = (event) => {
        console.log('[Debug] Received from Finnhub:', event.data);
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'trade' && data.data && Array.isArray(data.data)) {
                data.data.forEach((trade: { p: number; s: string }) => {
                    const appSymbol = reverseFinnhubSymbolMap.get(trade.s);
                    console.log(`[Debug] Finnhub trade for ${trade.s}, maps to app symbol: ${appSymbol}`);
                    if (appSymbol) {
                        setLivePrices(currentPrices => {
                            const newPrices = new Map(currentPrices);
                            newPrices.set(appSymbol, trade.p);
                            return newPrices;
                        });
                    }
                });
            } else if (data.type === 'ping') {
                ws.send(JSON.stringify({ type: 'pong' }));
            }
        } catch (error) {
            console.error("[Error] Failed to parse Finnhub message:", event.data, error);
        }
    };
    
    ws.onerror = (event) => {
        // Log a descriptive message and then the event object itself for inspection.
        // This prevents the browser from coercing the event object into the unhelpful "[object Object]" string.
        console.error('[Error] Finnhub WebSocket error occurred. See event object below for details.');
        console.error(event);
    };

    ws.onclose = (event) => {
        console.log(`[Debug] Disconnected from Finnhub WebSocket. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
    };

    return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            ws.close();
        }
        finnhubWsRef.current = null;
    };
  }, [finnhubSymbols, finnhubSymbolMap, reverseFinnhubSymbolMap]);


  const handleViewChange = (newView: View) => {
    if (newView === 'wallet') {
        setIsWalletModalOpen(true);
    } else {
        setView(newView);
    }
  };

  const handleModeChange = (mode: TradingMode) => {
    if (mode === 'live' && !isWalletConnected) {
      setAlertInfo({
          isOpen: true,
          title: 'Wallet Not Connected',
          message: 'Please connect your wallet to use live trading.'
      });
      return;
    }
    setTradingMode(mode);
  };
  
  const showAlert = (title: string, message: string) => {
    setAlertInfo({ isOpen: true, title, message });
  };

  const handleConnectWallet = () => {
    setIsConnectWalletModalOpen(true);
  };
  
  const handleWalletConnected = (account: string) => {
    setIsConnectWalletModalOpen(false);
    setIsWalletConnected(true);
    if (tradingMode === 'demo') {
        setTradingMode('live');
    }
    showAlert('Connection Successful', `Connected to wallet.\nAccount: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`);
  };

  const handleDisconnectWallet = () => {
      setIsWalletConnected(false);
      setTradingMode('demo'); // Revert to demo for safety
  };

  const addWalletTransaction = (transaction: Omit<WalletTransaction, 'id' | 'timestamp'>) => {
    if(tradingMode === 'live') { // Only log transactions for live mode
        setWalletTransactions(prev => [{
            id: `${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            ...transaction
        }, ...prev]);
    }
  };

  // --- Profile Logic ---
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    showAlert('Profile Updated', 'Your profile information has been successfully saved.');
  };

  const handleChangePassword = (current: string, newPass: string) => {
    // In a real app, you'd validate the current password against a backend.
    // For this simulation, we'll just show a success message.
    console.log(`Password change attempt: current=${current.substring(0,1)}..., new=${newPass.substring(0,1)}...`);
    showAlert('Password Changed', 'Your password has been successfully updated.');
  };

  // --- Standard Trading Logic ---
  const handlePlaceOrder = (orderRequest: NewOrderRequest) => {
    const currentBalance = balances[orderRequest.currency] ?? 0;
    
    if (tradingMode === 'live' && currentBalance <= 0) {
        setAlertInfo({ 
            isOpen: true, 
            title: 'Account Balance Low', 
            message: `Your live ${orderRequest.currency} balance in your wallet is zero. Please fund your wallet to place a trade.` 
        });
        return;
    }
    if (orderRequest.margin < 1 || isNaN(orderRequest.margin)) {
        setAlertInfo({ isOpen: true, title: 'Invalid Margin', message: 'Please enter a valid margin amount of at least 1.00.' });
        return;
    }
    const price = livePrices.get(orderRequest.pair);
    if(!price) {
        setAlertInfo({ isOpen: true, title: 'Price Error', message: 'Live price not available for this pair. Please try again shortly.' });
        return;
    }
    if(orderRequest.margin > currentBalance) {
        setAlertInfo({ isOpen: true, title: 'Insufficient Funds', message: `You do not have enough funds to place this order.\n\nRequired: ${orderRequest.margin.toFixed(2)} ${orderRequest.currency}\nAvailable: ${currentBalance.toFixed(2)} ${orderRequest.currency}` });
        return;
    }
    const amount = (orderRequest.margin * orderRequest.leverage) / price;
    const positionValue = orderRequest.margin * orderRequest.leverage;
    setConfirmationInfo({ isOpen: true, order: { ...orderRequest, price, amount, positionValue }});
  };

  const handleConfirmOrder = () => {
    if (!confirmationInfo.order) return;
    const confirmedOrder = confirmationInfo.order;
    setConfirmationInfo({ isOpen: false, order: null });
    setIsLoading(true);

    setTimeout(() => {
        const newOrder: Trade = {
          id: `${Date.now()}-${Math.random()}`, pair: confirmedOrder.pair, type: confirmedOrder.type,
          price: confirmedOrder.price, amount: confirmedOrder.amount, margin: confirmedOrder.margin,
          leverage: confirmedOrder.leverage, time: new Date().toLocaleTimeString(), status: 'Open',
          currency: confirmedOrder.currency,
        };
        if (tradingMode === 'demo') {
          setDemoOrders(prev => [...prev, newOrder]);
          setDemoBalances(prev => ({ ...prev, [newOrder.currency]: (prev[newOrder.currency] || 0) - newOrder.margin }));
        } else {
          setLiveOrders(prev => [...prev, newOrder]);
          // Deduct margin directly from wallet
          setWalletAssets(prev => prev.map(asset => 
            asset.symbol === newOrder.currency ? { ...asset, balance: asset.balance - newOrder.margin } : asset
          ));
          addWalletTransaction({
            type: 'Trade Margin',
            description: `Margin for ${newOrder.type} ${newOrder.pair}`,
            amount: -newOrder.margin,
            currency: newOrder.currency,
          });
        }
        setIsLoading(false);
        const [baseCurrency] = newOrder.pair.split('/');
        setAlertInfo({ isOpen: true, title: 'Order Placed Successfully', message: `Your ${newOrder.type} order for ${newOrder.amount.toFixed(4)} ${baseCurrency} on ${newOrder.pair} has been placed.` });
    }, 1500);
  };

  const handleCloseConfirmation = () => setConfirmationInfo({ isOpen: false, order: null });

  const handleCloseOrder = (tradeId: string) => {
    const orders = tradingMode === 'demo' ? demoOrders : liveOrders;
    const orderToClose = orders.find(o => o.id === tradeId);
    if (!orderToClose) return;

    const closePrice = livePricesRef.current.get(orderToClose.pair);
    if (!closePrice) {
        setAlertInfo({ isOpen: true, title: 'Price Error', message: 'Could not fetch the current price to close the order. Please try again.' });
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        let pnlInQuoteCurrency = 0;
        if (orderToClose.type === 'Buy') {
            pnlInQuoteCurrency = (closePrice - orderToClose.price) * orderToClose.amount;
        } else {
            pnlInQuoteCurrency = (orderToClose.price - closePrice) * orderToClose.amount;
        }

        const [, quoteCurrency] = orderToClose.pair.split('/');
        
        let pnlInUSD = 0;
        const quoteAssetPriceUSD = walletAssets.find(a => a.symbol === quoteCurrency)?.priceUSD ?? 0;

        if (quoteCurrency === 'USD') {
            pnlInUSD = pnlInQuoteCurrency;
        } else if (quoteAssetPriceUSD > 0) {
            pnlInUSD = pnlInQuoteCurrency * quoteAssetPriceUSD;
        } else {
            console.warn(`Could not find live conversion rate for ${quoteCurrency} to USD.`);
            pnlInUSD = 0; // Or handle error appropriately
        }
        
        const marginCurrency = orderToClose.currency;
        const marginAssetPriceUSD = walletAssets.find(a => a.symbol === marginCurrency)?.priceUSD ?? 1;
        const pnlInTradeCurrency = marginAssetPriceUSD > 0 ? pnlInUSD / marginAssetPriceUSD : 0;
        
        const closedOrder: Trade = { 
            ...orderToClose, 
            status: 'Closed', 
            closePrice: closePrice, 
            closeTime: new Date().toLocaleTimeString(), 
            pnl: pnlInQuoteCurrency, 
            pnlInUSD,
            pnlInTradeCurrency
        };
        
        if (tradingMode === 'demo') {
            setDemoOrders(prev => prev.filter(o => o.id !== tradeId));
            setDemoHistory(prev => [closedOrder, ...prev]);
            setDemoBalances(prev => ({
                ...prev,
                [closedOrder.currency]: (prev[closedOrder.currency] || 0) + closedOrder.margin + pnlInTradeCurrency
            }));
        } else {
            setLiveOrders(prev => prev.filter(o => o.id !== tradeId));
            setLiveHistory(prev => [closedOrder, ...prev]);
            // Add margin and P/L directly back to wallet
            setWalletAssets(prev => prev.map(asset =>
                asset.symbol === closedOrder.currency ? { ...asset, balance: asset.balance + closedOrder.margin + pnlInTradeCurrency } : asset
            ));
            addWalletTransaction({
                type: 'Trade P/L',
                description: `P/L from ${closedOrder.type} ${closedOrder.pair}`,
                amount: pnlInTradeCurrency + closedOrder.margin, // Return margin + P/L
                currency: closedOrder.currency,
            });
        }

        setIsLoading(false);
        setAlertInfo({ 
            isOpen: true, 
            title: 'Order Closed Successfully', 
            message: `Your ${closedOrder.type} order for ${closedOrder.pair} was closed.\n\nP/L: ${pnlInUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` 
        });
    }, 1500);
  };
  
  // --- Option Trading Logic ---
  const handlePlaceOptionOrder = (orderRequest: NewOptionOrderRequest) => {
    const currentBalance = balances[orderRequest.currency] ?? 0;

    if (tradingMode === 'live' && currentBalance <= 0) {
        setAlertInfo({ 
            isOpen: true, 
            title: 'Account Balance Low', 
            message: `Your live ${orderRequest.currency} balance in your wallet is zero. Please fund your wallet to place a trade.` 
        });
        return;
    }
    if (orderRequest.amount < 1 || isNaN(orderRequest.amount)) {
      setAlertInfo({ isOpen: true, title: 'Invalid Amount', message: 'Please enter a valid amount of at least 1.00.' });
      return;
    }
    const price = livePrices.get(orderRequest.pair);
    if (!price) {
      setAlertInfo({ isOpen: true, title: 'Price Error', message: 'Live price not available for this pair. Please try again shortly.' });
      return;
    }
    if (orderRequest.amount > currentBalance) {
      setAlertInfo({ isOpen: true, title: 'Insufficient Funds', message: `You do not have enough funds to place this trade.\n\nRequired: ${orderRequest.amount.toFixed(2)} ${orderRequest.currency}\nAvailable: ${currentBalance.toFixed(2)} ${orderRequest.currency}` });
      return;
    }
    const profit = orderRequest.amount * (orderRequest.profitPercentage / 100);
    const payout = orderRequest.amount + profit;
    setOptionConfirmationInfo({ isOpen: true, order: { ...orderRequest, entryPrice: price, payout, profit } });
  };

  const resolveOptionTrade = (orderToResolve: OptionTrade, wasDemoTrade: boolean) => {
      const currentLivePrices = livePricesRef.current;
      const currentTradingMode = tradingModeRef.current;

      const closePrice = currentLivePrices.get(orderToResolve.pair);
      let isWin = false;
      if (closePrice) {
          if (orderToResolve.type === 'Buy' && closePrice > orderToResolve.entryPrice) isWin = true;
          else if (orderToResolve.type === 'Sell' && closePrice < orderToResolve.entryPrice) isWin = true;
      }

      const profit = isWin ? orderToResolve.amount * (orderToResolve.profitPercentage / 100) : -orderToResolve.amount;
      const payout = isWin ? orderToResolve.amount + profit : 0;

      const resolvedTrade: OptionTrade = { ...orderToResolve, status: isWin ? 'Won' : 'Lost', closePrice: closePrice, payout: payout, profit: profit };
    
      if (wasDemoTrade) {
          setDemoOptionOrders(prev => prev.filter(o => o.id !== resolvedTrade.id));
          setDemoOptionHistory(prev => [resolvedTrade, ...prev]);
          if (isWin) {
              setDemoBalances(prev => ({
                ...prev,
                [resolvedTrade.currency]: (prev[resolvedTrade.currency] || 0) + payout
              }));
          }
      } else {
          setLiveOptionOrders(prev => prev.filter(o => o.id !== resolvedTrade.id));
          setLiveOptionHistory(prev => [resolvedTrade, ...prev]);
          if (isWin) {
              setWalletAssets(prev => prev.map(asset =>
                asset.symbol === resolvedTrade.currency ? { ...asset, balance: asset.balance + payout } : asset
              ));
              addWalletTransaction({
                type: 'Option Payout',
                description: `Won ${resolvedTrade.type} option on ${resolvedTrade.pair}`,
                amount: payout,
                currency: resolvedTrade.currency,
              });
          }
      }
      
      const tradeCurrencyPriceUSD = walletAssets.find(a => a.symbol === resolvedTrade.currency)?.priceUSD ?? 1;
      const profitInUSD = (profit * tradeCurrencyPriceUSD).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

      if ((wasDemoTrade && currentTradingMode === 'demo') || (!wasDemoTrade && currentTradingMode === 'live')) {
          setAlertInfo({ 
              isOpen: true, 
              title: `Option ${isWin ? 'Won' : 'Lost'}`, 
              message: `Your ${resolvedTrade.type} option for ${resolvedTrade.pair} expired.\n\nResult: ${resolvedTrade.status}\nProfit/Loss: ${profitInUSD}` 
          });
      }
  };

  const handleConfirmOptionOrder = () => {
    if (!optionConfirmationInfo.order) return;
    const confirmedOrder = optionConfirmationInfo.order;
    const wasDemoTrade = tradingMode === 'demo'; // Capture mode at time of confirmation
    setOptionConfirmationInfo({ isOpen: false, order: null });
    setIsLoading(true);
    setTimeout(() => {
      const openTime = Date.now();
      const newOption: OptionTrade = {
        id: `${openTime}-${Math.random()}`, pair: confirmedOrder.pair, type: confirmedOrder.type,
        entryPrice: confirmedOrder.entryPrice, amount: confirmedOrder.amount, duration: confirmedOrder.duration,
        profitPercentage: confirmedOrder.profitPercentage,
        openTime: openTime, expiryTime: openTime + confirmedOrder.duration * 1000, status: 'Active',
        currency: confirmedOrder.currency,
      };
      
      if (wasDemoTrade) {
        setDemoOptionOrders(prev => [...prev, newOption]);
        setDemoBalances(prev => ({ ...prev, [newOption.currency]: (prev[newOption.currency] || 0) - newOption.amount }));
      } else {
        setLiveOptionOrders(prev => [...prev, newOption]);
        setWalletAssets(prev => prev.map(asset =>
            asset.symbol === newOption.currency ? { ...asset, balance: asset.balance - newOption.amount } : asset
        ));
        addWalletTransaction({
            type: 'Option Stake',
            description: `${newOption.type} option on ${newOption.pair}`,
            amount: -newOption.amount,
            currency: newOption.currency
        });
      }
      setIsLoading(false);
      // Pass the full trade object and its mode to prevent stale state issues on resolution
      setTimeout(() => resolveOptionTrade(newOption, wasDemoTrade), confirmedOrder.duration * 1000);
      setAlertInfo({ isOpen: true, title: 'Option Trade Placed', message: `Your ${newOption.type} option for ${newOption.pair} has been placed. It will expire in ${newOption.duration} seconds.` });
    }, 1500);
  };

  const handleCloseOptionConfirmation = () => setOptionConfirmationInfo({ isOpen: false, order: null });

  // --- Staking Logic ---
  const handleStake = (poolId: string, amount: number, currency: string) => {
    const pool = stakingPools.find(p => p.id === poolId);
    const currentBalance = balances[currency] ?? 0;

    if (!pool) {
        showAlert('Error', 'Staking pool not found.');
        return;
    }
    if (Date.now() > pool.endDate) {
        showAlert('Staking Closed', 'The staking period for this pool has already ended.');
        return;
    }
    if (amount <= 0 || isNaN(amount)) {
        showAlert('Invalid Amount', 'Please enter an amount greater than 0.');
        return;
    }
    if (amount < 1) {
        showAlert('Invalid Amount', 'Minimum staking amount is 1.00.');
        return;
    }
    if (amount > currentBalance) {
        showAlert('Insufficient Funds', `You do not have enough ${currency} to stake this amount.`);
        return;
    }
    const remainingNeeded = pool.totalGoal - pool.currentAmount;
    if (amount > remainingNeeded) {
        showAlert('Amount Too High', `This pool only needs ${remainingNeeded.toLocaleString()} ${currency} more. Please stake a smaller amount.`);
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        // Update balances
        if (tradingMode === 'demo') {
            setDemoBalances(prev => ({...prev, [currency]: (prev[currency] || 0) - amount}));
        } else {
            setWalletAssets(prev => prev.map(asset =>
                asset.symbol === currency ? {...asset, balance: asset.balance - amount} : asset
            ));
            addWalletTransaction({
                type: 'Staking Deposit',
                description: `Staked in "${pool.title}"`,
                amount: -amount,
                currency: currency,
            });
        }

        // Update pool progress
        setStakingPools(prev => prev.map(p =>
            p.id === poolId ? {...p, currentAmount: p.currentAmount + amount} : p
        ));

        // Record user stake
        setUserStakes(prev => [...prev, {
            id: `${Date.now()}-${Math.random()}`,
            poolId,
            amount,
            currency,
            stakedAt: Date.now()
        }]);

        setIsLoading(false);
        showAlert('Staking Successful', `You have successfully staked ${amount.toLocaleString()} ${currency} in "${pool.title}".`);
    }, 1500);
  };

  const handleWithdrawAll = (stakeId: string) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake) {
        showAlert('Error', 'Could not find your stake.');
        return;
    }
    
    const pool = stakingPools.find(p => p.id === stake.poolId);
    if (!pool) {
        showAlert('Error', 'Could not find the associated staking pool.');
        return;
    }
    
    const isPoolExpired = Date.now() > pool.endDate;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    
    // For active pools, enforce a 24-hour lock. Bypass for expired pools.
    if (!isPoolExpired && (Date.now() - stake.stakedAt < ONE_DAY_MS)) {
        showAlert('Withdrawal Locked', 'You can only withdraw your stake after 24 hours.');
        return;
    }

    // For expired pools, profit calculation is capped at the end date.
    const effectiveEndTime = isPoolExpired ? pool.endDate : Date.now();
    const daysStaked = Math.floor((effectiveEndTime - stake.stakedAt) / ONE_DAY_MS);
    const profit = daysStaked > 0 ? stake.amount * (pool.dailyROI / 100) * daysStaked : 0;
    
    const totalReturn = stake.amount + profit;
    const fee = totalReturn * 0.00002; // 0.002% fee
    const finalAmount = totalReturn - fee;

    setIsLoading(true);
    setTimeout(() => {
        // Restore balance
        if (tradingMode === 'demo') {
            setDemoBalances(prev => ({ ...prev, [stake.currency]: (prev[stake.currency] || 0) + finalAmount }));
        } else {
            setWalletAssets(prev => prev.map(asset => 
                asset.symbol === stake.currency ? { ...asset, balance: asset.balance + finalAmount } : asset
            ));
            addWalletTransaction({
                type: 'Staking Withdrawal',
                description: `Withdraw from "${pool.title}"`,
                amount: finalAmount,
                currency: stake.currency
            });
        }

        // Remove stake from user's list
        setUserStakes(prev => prev.filter(s => s.id !== stakeId));
        
        // Update pool's current amount
        setStakingPools(prev => prev.map(p => 
            p.id === stake.poolId ? { ...p, currentAmount: p.currentAmount - stake.amount } : p
        ));

        setIsLoading(false);
        showAlert('Withdrawal Successful', 
            `Successfully withdrew ${stake.amount.toLocaleString()} ${stake.currency} principal and ${profit.toLocaleString()} ${stake.currency} profit.\n\nFee: ${fee.toLocaleString()} ${stake.currency}\nReturned: ${finalAmount.toLocaleString()} ${stake.currency}`
        );
    }, 1500);
  };

  const handleWithdrawProfit = (stakeId: string) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake) {
        showAlert('Error', 'Could not find your stake.');
        return;
    }
    
    const pool = stakingPools.find(p => p.id === stake.poolId);
    if (!pool) {
        showAlert('Error', 'Could not find the associated staking pool.');
        return;
    }
    
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const lastClaimTime = stake.lastProfitWithdrawalAt || stake.stakedAt;
    
    if (Date.now() - lastClaimTime < ONE_DAY_MS) {
        showAlert('Not Ready', 'You can withdraw profits once every 24 hours.');
        return;
    }

    const daysSinceLastClaim = Math.floor((Date.now() - lastClaimTime) / ONE_DAY_MS);
    
    if (daysSinceLastClaim < 1) {
          showAlert('Not Ready', 'A full day has not passed since your last withdrawal or initial stake.');
        return;
    }
    
    const profit = stake.amount * (pool.dailyROI / 100) * daysSinceLastClaim;
    const fee = profit * 0.00002; // 0.002% fee
    const finalProfit = profit - fee;

    setIsLoading(true);
    setTimeout(() => {
        // Add final profit to balance
        if (tradingMode === 'demo') {
            setDemoBalances(prev => ({ ...prev, [stake.currency]: (prev[stake.currency] || 0) + finalProfit }));
        } else {
            setWalletAssets(prev => prev.map(asset => 
                asset.symbol === stake.currency ? { ...asset, balance: asset.balance + finalProfit } : asset
            ));
             addWalletTransaction({
                type: 'Staking Withdrawal',
                description: `Profit from "${pool.title}"`,
                amount: finalProfit,
                currency: stake.currency
            });
        }

        // Update stake with new withdrawal time
        setUserStakes(prev => prev.map(s => 
            s.id === stakeId ? { ...s, lastProfitWithdrawalAt: Date.now() } : s
        ));

        setIsLoading(false);
        showAlert('Profit Withdrawn', 
            `Successfully withdrew profits.\n\nGross Profit: ${profit.toLocaleString()} ${stake.currency}\nFee: ${fee.toLocaleString()} ${stake.currency}\nNet Received: ${finalProfit.toLocaleString()} ${stake.currency}`
        );
    }, 1500);
  };

  // --- Lottery Logic ---
  const handleBuyTickets = (poolId: string, ticketCount: number, paymentCurrency: string) => {
    const pool = lotteryPools.find(p => p.id === poolId);
    const currentBalance = balances[paymentCurrency] ?? 0;

    if (!pool) {
        showAlert('Error', 'Lottery pool not found.');
        return;
    }
    if (pool.status === 'completed') {
        showAlert('Lottery Closed', 'The ticket sales for this lottery have ended.');
        return;
    }
    if (ticketCount <= 0 || isNaN(ticketCount) || !Number.isInteger(ticketCount)) {
        showAlert('Invalid Amount', 'Please enter a valid number of tickets.');
        return;
    }
    const ticketsAvailable = pool.totalTickets - pool.ticketsSold;
    if (ticketCount > ticketsAvailable) {
        showAlert('Not Enough Tickets', `Only ${ticketsAvailable.toLocaleString()} tickets are left for this lottery.`);
        return;
    }

    // 1. Calculate total cost in the pool's native currency
    const totalCostInPoolCurrency = ticketCount * pool.ticketPrice;

    // 2. Get asset data for conversion
    const paymentAsset = walletAssets.find(a => a.symbol === paymentCurrency);
    const poolAsset = walletAssets.find(a => a.symbol === pool.currency);

    if (!paymentAsset || !poolAsset || paymentAsset.priceUSD <= 0 || poolAsset.priceUSD <= 0) {
        showAlert('Conversion Error', `Could not determine the value of currencies for conversion.`);
        return;
    }

    // 3. Convert cost to payment currency
    const totalCostInUSD = totalCostInPoolCurrency * poolAsset.priceUSD;
    const costInPaymentCurrency = totalCostInUSD / paymentAsset.priceUSD;

    // 4. Check balance
    if (costInPaymentCurrency > currentBalance) {
        showAlert(
            'Insufficient Funds', 
            `You need ${costInPaymentCurrency.toFixed(6)} ${paymentCurrency} (worth ${totalCostInPoolCurrency.toLocaleString()} ${pool.currency}) to buy ${ticketCount} tickets.`
        );
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        // 5. Deduct converted cost from balance
        if (tradingMode === 'demo') {
            setDemoBalances(prev => ({ ...prev, [paymentCurrency]: (prev[paymentCurrency] || 0) - costInPaymentCurrency }));
        } else {
            setWalletAssets(prev => prev.map(asset => 
                asset.symbol === paymentCurrency ? { ...asset, balance: asset.balance - costInPaymentCurrency } : asset
            ));
             addWalletTransaction({
                type: 'Lottery Purchase',
                description: `${ticketCount} ticket(s) for "${pool.title}"`,
                amount: -costInPaymentCurrency,
                currency: paymentCurrency
            });
        }

        // Update pool ticket count
        setLotteryPools(prev => prev.map(p => 
            p.id === poolId ? { ...p, ticketsSold: p.ticketsSold + ticketCount } : p
        ));

        // Update user's ticket record
        setUserLotteryTickets(prev => {
            const existingEntry = prev.find(t => t.poolId === poolId);
            if (existingEntry) {
                return prev.map(t => t.poolId === poolId ? { ...t, numberOfTickets: t.numberOfTickets + ticketCount } : t);
            } else {
                return [...prev, { poolId, numberOfTickets: ticketCount }];
            }
        });

        setIsLoading(false);
        showAlert('Tickets Purchased', `You have successfully bought ${ticketCount.toLocaleString()} tickets for the "${pool.title}" lottery.`);
    }, 1500);
  };

    // --- Lottery Draw Logic ---
    useEffect(() => {
        const drawLottery = (poolId: string) => {
            const pool = lotteryPools.find(p => p.id === poolId);
            if (!pool || pool.status === 'completed') return;

            // Calculate prize pool
            const totalRevenue = pool.ticketsSold * pool.ticketPrice;
            const totalPrizePool = totalRevenue / 2;
            const prizePerWinner = pool.numberOfWinners > 0 ? totalPrizePool / pool.numberOfWinners : 0;
            
            const userTicketEntry = userLotteryTickets.find(t => t.poolId === poolId);
            
            // --- New Weighted Winner Selection Logic ---
            let userWins = 0;
            if (userTicketEntry && userTicketEntry.numberOfTickets > 0) {
                let remainingUserTickets = userTicketEntry.numberOfTickets;
                let remainingTotalTickets = pool.ticketsSold;

                // Simulate drawing a winner for each available prize
                for (let i = 0; i < pool.numberOfWinners; i++) {
                    if (remainingTotalTickets <= 0) break; // Stop if no tickets are left to draw

                    const winningTicketNumber = Math.floor(Math.random() * remainingTotalTickets) + 1;

                    if (winningTicketNumber <= remainingUserTickets) {
                        // A user's ticket was drawn
                        userWins++;
                        remainingUserTickets--;
                    }
                    
                    remainingTotalTickets--; // A ticket is removed from the pool
                }
            }
            const userIsWinner = userWins > 0;
            const totalWinnings = prizePerWinner * userWins;
            
            if (userIsWinner) {
                // Update user balance
                const currency = pool.currency;
                if (tradingMode === 'demo') {
                    setDemoBalances(prev => ({ ...prev, [currency]: (prev[currency] || 0) + totalWinnings }));
                } else {
                    setWalletAssets(prev => prev.map(asset => 
                        asset.symbol === currency ? { ...asset, balance: asset.balance + totalWinnings } : asset
                    ));
                     addWalletTransaction({
                        type: 'Lottery Win',
                        description: `Won in "${pool.title}"`,
                        amount: totalWinnings,
                        currency: currency
                    });
                }
                // Mark user as winner and store number of wins
                setUserLotteryTickets(prev => prev.map(t => t.poolId === poolId ? { ...t, winsCount: userWins } : t));
            }

            // Update pool status
            setLotteryPools(prev => prev.map(p => 
                p.id === poolId ? { 
                    ...p, 
                    status: 'completed', 
                    totalPrizePool, 
                    prizePerWinner 
                } : p
            ));
            
            // Only show an alert if the user participated in this specific lottery
            if (userTicketEntry && userTicketEntry.numberOfTickets > 0) {
                const resultMessage = userIsWinner 
                    ? `Congratulations! You won ${userWins} time${userWins > 1 ? 's' : ''}, for a total of ${totalWinnings.toLocaleString()} ${pool.currency}!`
                    : `The draw for "${pool.title}" is complete. Better luck next time.`;

                showAlert(`Lottery Ended: "${pool.title}"`, resultMessage);
            }
        };

        const interval = setInterval(() => {
            const now = Date.now();
            lotteryPools.forEach(pool => {
                if (pool.status === 'active') {
                    const isTimeUp = pool.type === 'time' && pool.drawDate && now >= pool.drawDate;
                    const areTicketsSoldOut = pool.type === 'ticket' && pool.ticketsSold >= pool.totalTickets;
                    if (isTimeUp || areTicketsSoldOut) {
                        drawLottery(pool.id);
                    }
                }
            });
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);

    }, [lotteryPools, userLotteryTickets, tradingMode, demoBalances, walletAssets]);


  // --- Wallet and Funding ---
  const handleFundWallet = (amount: number) => {
      setIsFundModalOpen(false);
      setIsLoading(true);
      setTimeout(() => {
          // Fund the USD asset in the wallet directly
          setWalletAssets(prev => prev.map(asset => 
            asset.symbol === 'USD' ? { ...asset, balance: asset.balance + amount } : asset
          ));
          addWalletTransaction({
            type: 'Deposit',
            description: 'Funds added to wallet',
            amount: amount,
            currency: 'USD'
          });
          setIsLoading(false);
          setAlertInfo({ isOpen: true, title: 'Funds Added', message: `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been successfully added to your wallet.` });
      }, 1500);
  };

  const handleSwapAssets = (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
    setWalletAssets(prevAssets =>
        prevAssets.map(asset => {
            if (asset.symbol === fromSymbol) {
                return { ...asset, balance: asset.balance - fromAmount };
            }
            if (asset.symbol === toSymbol) {
                return { ...asset, balance: asset.balance + toAmount };
            }
            return asset;
        })
    );
     addWalletTransaction({
        type: 'Swap',
        description: `Swapped ${fromAmount.toFixed(4)} ${fromSymbol} for ${toAmount.toFixed(4)} ${toSymbol}`,
        amount: toAmount, // Log the received amount
        currency: toSymbol,
    });
    setAlertInfo({
        isOpen: true,
        title: 'Swap Successful',
        message: `Successfully swapped ${fromAmount.toFixed(4)} ${fromSymbol} for ${toAmount.toFixed(4)} ${toSymbol}!`
    });
  };

  const closeAlert = () => setAlertInfo({ isOpen: false, title: '', message: '' });
  
  const livePriceForSelected = livePrices.get(selectedPair.value) ?? null;
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const totalBalanceUSD = useMemo(() => {
    // Per user request, the sidebar balance should always reflect the live wallet total.
    return walletAssets.reduce((total, asset) => total + (asset.balance * asset.priceUSD), 0);
  }, [walletAssets]);

  const renderCurrentView = () => {
    switch(view) {
        case 'trade':
        case 'tradeOption':
            return (
                <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Main Content: Chart and History */}
                    <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4">
                        <div className="flex-grow h-[60vh] lg:h-auto lg:flex-auto">
                            <ChartPanel 
                                key={selectedPair.value}
                                selectedPair={selectedPair}
                            />
                        </div>
                        <div className="lg:h-[30vh]">
                            {view === 'trade' ? (
                                <HistoryPanel 
                                    openOrders={openOrders} 
                                    tradeHistory={tradeHistory}
                                    livePrices={livePrices}
                                    onCloseOrder={handleCloseOrder}
                                    walletAssets={walletAssets}
                                />
                            ) : (
                                <OptionHistoryPanel
                                    openOptionOrders={openOptionOrders}
                                    optionTradeHistory={optionTradeHistory}
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Side Panel: Trade Panel */}
                    <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-4 h-full">
                        <div className="h-full">
                            {view === 'trade' ? (
                                <TradePanel 
                                    selectedPair={selectedPair}
                                    onPairChange={setSelectedPair}
                                    livePrice={livePriceForSelected}
                                    tradingMode={tradingMode}
                                    balance={balance}
                                    isWalletConnected={isWalletConnected}
                                    onPlaceOrder={handlePlaceOrder}
                                    onConnectWallet={handleConnectWallet}
                                    onFundClick={() => setIsFundModalOpen(true)}
                                    selectedTradingCurrency={selectedTradingCurrency}
                                />
                            ) : (
                                <TradeOptionPanel
                                    selectedPair={selectedPair}
                                    onPairChange={setSelectedPair}
                                    livePrice={livePriceForSelected}
                                    tradingMode={tradingMode}
                                    balance={balance}
                                    isWalletConnected={isWalletConnected}
                                    onPlaceOptionOrder={handlePlaceOptionOrder}
                                    onConnectWallet={handleConnectWallet}
                                    onFundClick={() => setIsFundModalOpen(true)}
                                    selectedTradingCurrency={selectedTradingCurrency}
                                />
                            )}
                        </div>
                    </div>
                </main>
            );
        case 'stacking':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <StakingPage 
                        pools={stakingPools}
                        userStakes={userStakes}
                        onStake={handleStake}
                        onWithdrawAll={handleWithdrawAll}
                        onWithdrawProfit={handleWithdrawProfit}
                        balance={balance}
                        selectedTradingCurrency={selectedTradingCurrency}
                        tradingMode={tradingMode}
                        isWalletConnected={isWalletConnected}
                        onConnectWallet={handleConnectWallet}
                    />
                </main>
            );
        case 'lottery':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <LotteryPage
                      pools={lotteryPools}
                      userTickets={userLotteryTickets}
                      onBuyTickets={handleBuyTickets}
                      balance={balance}
                      selectedTradingCurrency={selectedTradingCurrency}
                      tradingMode={tradingMode}
                      isWalletConnected={isWalletConnected}
                      onConnectWallet={handleConnectWallet}
                    />
                </main>
            );
        case 'tradeHistory':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <TradeHistoryPage tradeHistory={tradeHistory} />
                </main>
            );
        case 'optionHistory':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <OptionHistoryPage optionTradeHistory={optionTradeHistory} />
                </main>
            );
        case 'stakingHistory':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <StakingHistoryPage userStakes={userStakes} stakingPools={stakingPools} />
                </main>
            );
        case 'lotteryHistory':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <LotteryHistoryPage userLotteryTickets={userLotteryTickets} lotteryPools={lotteryPools} />
                </main>
            );
        case 'walletHistory':
             return (
                <main className="flex-grow p-4 lg:p-6">
                    <WalletHistoryPage transactions={walletTransactions} />
                </main>
            );
        case 'profile':
            return (
                <main className="flex-grow p-4 lg:p-6">
                    <ProfilePage 
                        userProfile={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                        onChangePassword={handleChangePassword}
                    />
                </main>
            );
        default:
             return <main className="flex-grow p-4"><div className="text-center text-gray-500">Coming Soon</div></main>;
    }
  };


  return (
    <div className="bg-[#0D1117] text-white min-h-screen flex flex-col">
      <LoadingSpinner isOpen={isLoading} />
      <Suspense fallback={null}>
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            onViewChange={handleViewChange}
            totalBalanceUSD={totalBalanceUSD}
            userProfile={userProfile}
            tradeHistoryCount={tradeHistory.length}
            optionHistoryCount={optionTradeHistory.length}
            stakingHistoryCount={userStakes.length}
            lotteryHistoryCount={userLotteryTickets.length}
            walletHistoryCount={walletTransactions.length}
          />
      </Suspense>
      <Header 
        tradingMode={tradingMode}
        onModeChange={handleModeChange}
        isWalletConnected={isWalletConnected}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        balances={balances}
        selectedTradingCurrency={selectedTradingCurrency}
        onCurrencyChange={setSelectedTradingCurrency}
        view={view}
        onViewChange={handleViewChange}
        onToggleSidebar={toggleSidebar}
      />
      <Suspense fallback={<LoadingSpinner isOpen={true} />}>
        {renderCurrentView()}
      </Suspense>

      <Suspense fallback={null}>
        <ConfirmationModal 
          isOpen={confirmationInfo.isOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmOrder}
          order={confirmationInfo.order}
        />
        <OptionConfirmationModal 
          isOpen={optionConfirmationInfo.isOpen}
          onClose={handleCloseOptionConfirmation}
          onConfirm={handleConfirmOptionOrder}
          order={optionConfirmationInfo.order}
        />
        <FundWalletModal 
          isOpen={isFundModalOpen}
          onClose={() => setIsFundModalOpen(false)}
          onFund={handleFundWallet}
        />
        <AlertModal 
          isOpen={alertInfo.isOpen}
          onClose={closeAlert}
          title={alertInfo.title}
          message={alertInfo.message}
        />
        {isWalletModalOpen && (
            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                walletAssets={walletAssets}
                onSwapAssets={handleSwapAssets}
            />
        )}
        {isConnectWalletModalOpen && (
            <ConnectWalletModal
                isOpen={isConnectWalletModalOpen}
                onClose={() => setIsConnectWalletModalOpen(false)}
                onConnectSuccess={handleWalletConnected}
                showAlert={showAlert}
            />
        )}
      </Suspense>
    </div>
  );
}

export default App;