import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/Dashboard.scss';
import TrendingCoins from './components/TrendingCrypto';
import BitcoinChart from './components/BitcoinChart';
import EthereumChart from './components/EthereumChart';
import Footer from './components/Footer';
import CryptoDoughnutChart from './components/CryptoDoughnutChart';
import CryptoConverter from './components/CryptoConverter';
import Layout from './Layout'; 

const Dashboard: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState('bitcoin');

  return (
    <div className="Main">
      <div className="box-container">
        <div className="chart-container">
          <div className="box">
            <div className="box-header">
              <p>Performance Chart (Last 365 Days)</p>
              <div className="chart-menu">
                <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                </select>
              </div>
            </div>
            {selectedChart === 'bitcoin' ? <BitcoinChart /> : <EthereumChart />}
          </div>
          <div className="portfolio-calculator-container">
            <div className="portfolio-box">
              <div className="portfolio-box-header"><p>My Portfolio</p></div>
              <div className="portfolio-box-content">
                <CryptoDoughnutChart />
              </div>
            </div>
            <div className="calculator-box">
              <div className="calculator-box-header"><p>Conversion Calculator</p></div>
              <div className="calculator-box-content">
                <CryptoConverter />
              </div>
            </div>
          </div>
        </div>
        <TrendingCoins />
      </div>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Router basename="/repo">
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
