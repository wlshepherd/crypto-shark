import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Coin {
  item: {
    id: string;
    name: string;
    symbol: string;
    price_btc: number;
    large: string;
  };
}

const TrendingCoins: React.FC = () => {
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>([]);
  const [btcToUsd, setBtcToUsd] = useState<number>(0);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        setTrendingCoins(response.data.coins);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    };

    const fetchBtcToUsd = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        setBtcToUsd(response.data.bitcoin.usd);
      } catch (error) {
        console.error('Error fetching BTC to USD rate:', error);
      }
    };

    fetchTrendingCoins();
    fetchBtcToUsd();
  }, []);

  return (
    <div className="small-box">
      <div className="small-box-header"><p>Trending Cryptocurrencies</p></div>
      <div className="small-box-content scrollable">
        {trendingCoins.length > 0 ? (
          <ul>
            {trendingCoins.map((coin) => (
              <li key={coin.item.id}>
                <img src={coin.item.large} alt={coin.item.name} width="10" height="1" />
                <span>{coin.item.name} ({coin.item.symbol}): ${(coin.item.price_btc * btcToUsd).toFixed(14)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins;
