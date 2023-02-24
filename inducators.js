'use strict';
const { green, red } = require('ansicolor');
const ccxt = require('ccxt');
var RSI = require('technicalindicators').RSI;
const SMA = require('technicalindicators').SMA
const EMA = require('technicalindicators').EMA
const Stochastic = require('technicalindicators').Stochastic

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

async function SMA_function(closeValues, period) {
    const result = SMA.calculate({ period: period, values: closeValues });
    var size = Object.keys(result).length;
    console.log(red("SMA: "), green(Math.round(result[size - 1])));
}

async function EMA_function(closeValues, period) {
    const result = EMA.calculate({ period: period, values: closeValues });
    var size = Object.keys(result).length;
    console.log(red("EMA: "), green(Math.round(result[size - 1])));
}

async function Stochastic_function(closeValues, highValues, lowValues, period, signalPeriod) {
        let input = {
            high: highValues,
            low: lowValues,
            close: closeValues,
            period: period,
            signalPeriod: signalPeriod
          };
        const result = Stochastic.calculate(input);
        var size = Object.keys(result).length;
        console.log(red("Stochastic: "), green(JSON.stringify(result[size-1]))); 
}

(async function () {
    const closeValues = [];
    const highValues = [];
    const lowValues = [];
    const historyObject = await exchange.fetch_ohlcv(coin, timeframe);
    var size = Object.keys(historyObject).length;
    for (var x = 0; x < size; x++) { closeValues[x] = historyObject[x][4]; } // [x][4] this returns only close values
    for (var x = 0; x < size; x++) { lowValues[x] = historyObject[x][3]; } // [x][4] this returns only low values
    for (var x = 0; x < size; x++) { highValues[x] = historyObject[x][2]; } // [x][4] this returns only high values
    console.log("___", coin, "___");
    RSI_function(closeValues,50);
    SMA_function(closeValues,20);
    EMA_function(closeValues,20);
    Stochastic_function(closeValues, highValues, lowValues, 14, 3);
})();