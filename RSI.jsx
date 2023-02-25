import React, { useState, useEffect } from 'react';
import ccxt from 'ccxt';
import { RSI } from 'technicalindicators';
import { green, red } from 'ansicolor';

const CoinRSI = () => {
  const [rsi, setRsi] = useState(null);
  const coin = 'BTC/USDT';
  const timeframe = '1M';
  const exchangeId = 'binance';
  const exchange = new ccxt[exchangeId]({
    'apiKey': 'KVNYDJ2bBIFLFsr0P9fCpXDNAF6B1QugZ0rLqcyUMwOK2KwtaH3oWJ8XUZvy3vIr',
    'secret': 'GNjRmDqxAZfgX1wQ5BBJGduwlcE22Np0as9DZr4dArtN22bUHhbpVfEB9K0Gy8XY',
    'enableRateLimit': true,
    'options': {
      'defaultType': 'margin',
    },
  });

  useEffect(() => {
    const fetchRSI = async () => {
      const closeValues = [];
      const historyObject = await exchange.fetchOHLCV(coin, timeframe);
      for (let i = 0; i < historyObject.length; i++) {
        closeValues.push(historyObject[i][4]);
      }
      const result = RSI.calculate({ values: closeValues, period: 50 });
      const lastRsi = result[result.length - 1];
      setRsi(lastRsi);
    };
    fetchRSI();
  }, []);

  return (
    <>
      {rsi !== null &&
        <div>
          <p>___ {coin} ___</p>
          <p>{red('RSI:')} {green(rsi)}</p>
        </div>
      }
    </>
  );
};

export default CoinRSI;
