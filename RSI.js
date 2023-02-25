'use strict';
const ccxt = require('ccxt');
const { green, red } = require('ansicolor');
const RSI = require('technicalindicators').RSI;
const coin = 'BTC/USDT';
const timeframe = '1M';

const exchangeId = 'binance'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass({
        'apiKey': 'KVNYDJ2bBIFLFsr0P9fCpXDNAF6B1QugZ0rLqcyUMwOK2KwtaH3oWJ8XUZvy3vIr',
        'secret': 'GNjRmDqxAZfgX1wQ5BBJGduwlcE22Np0as9DZr4dArtN22bUHhbpVfEB9K0Gy8XY',
        'enableRateLimit': true,
        'options': {
            'defaultType': 'margin',
        },
    });

async function RSI_function(closeValues, period) {
    var inputRSI = { values: closeValues, period: period };
    const result = RSI.calculate(inputRSI);
    var size = Object.keys(result).length;
    console.log(red("RSI: "), green(result[size - 1]));
};

(async function () {
    const closeValues = [];
    const historyObject = await exchange.fetch_ohlcv(coin, timeframe);
    var size = Object.keys(historyObject).length;
    for (var x = 0; x < size; x++) { closeValues[x] = historyObject[x][4]; } // [x][4] this returns only close values
    console.log("___", coin, "___");
    RSI_function(closeValues, 50);
})();