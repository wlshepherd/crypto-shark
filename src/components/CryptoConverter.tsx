import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CryptoConverter.scss'; 

const CryptoConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [cryptoType, setCryptoType] = useState<string>('bitcoin');
  const [conversionDirection, setConversionDirection] = useState<string>('cryptoToCurrency');
  const [convertedValue, setConvertedValue] = useState<string>('0');
  const [currencyType, setCurrencyType] = useState<string>('usd');

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoType}&vs_currencies=usd,gbp`);
        const data = response.data[cryptoType];
        const usdRate = data.usd;
        const gbpRate = data.gbp;

        if (conversionDirection === 'cryptoToCurrency') {
          if (currencyType === 'usd') {
            setConvertedValue((amount * usdRate).toFixed(2));
          } else {
            setConvertedValue((amount * gbpRate).toFixed(2));
          }
        } else {
          if (currencyType === 'usd') {
            setConvertedValue((amount / usdRate).toFixed(6));
          } else {
            setConvertedValue((amount / gbpRate).toFixed(6));
          }
        }
      } catch (error) {
        console.error('Error fetching the conversion rate:', error);
      }
    };

    if (amount > 0) {
      fetchConversionRate();
    } else {
      setConvertedValue('0'); 
    }
  }, [amount, cryptoType, conversionDirection, currencyType]);

  return (
    <div className="crypto-converter">
      <form>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))}/>
        </div>
        <div>
          <label htmlFor="conversionDirection">Convert:</label>
          <select id="conversionDirection" value={conversionDirection} onChange={(e) => setConversionDirection(e.target.value)}>
            <option value="cryptoToCurrency">Crypto to Currency</option>
            <option value="currencyToCrypto">Currency to Crypto</option>
          </select>
        </div>
        <div>
          <label htmlFor="cryptoType">Cryptocurrency:</label>
          <select id="cryptoType" value={cryptoType} onChange={(e) => setCryptoType(e.target.value)}>
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
          </select>
        </div>
        <div>
          <label htmlFor="currencyType">Currency:</label>
          <select id="currencyType" value={currencyType} onChange={(e) => setCurrencyType(e.target.value)}>
            <option value="usd">USD</option>
            <option value="gbp">GBP</option>
          </select>
        </div>
      </form>
      <div>
        <p>{conversionDirection === 'cryptoToCurrency' ? `Value: ${convertedValue} ${currencyType.toUpperCase()}` : `Value: ${convertedValue} ${cryptoType.toUpperCase()}`}</p>
      </div>
    </div>
  );
};

export default CryptoConverter;
