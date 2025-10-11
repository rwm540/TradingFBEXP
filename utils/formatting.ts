export const formatPrice = (pair: string, price: number): string => {
    if (price === null || price === undefined) return '...';

    // Stocks & Indices & Major Cryptos (high value)
    if (price > 10) {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    // Forex & Low-price Cryptos
    return price.toFixed(5);
};

export const formatDuration = (seconds: number): string => {
    if (seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDisplayDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${seconds / 60}m`;
    if (seconds < 86400) return `${seconds / 3600}H`;
    return `${seconds / 86400}D`;
};
