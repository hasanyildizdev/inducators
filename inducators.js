'use strict';
const { green, red } = require('ansicolor');
const ccxt = require('ccxt');
const RSI = require('technicalindicators').RSI;
const SMA = require('technicalindicators').SMA;
const EMA = require('technicalindicators').EMA;
const Stochastic = require('technicalindicators').Stochastic;
const BB = require('technicalindicators').BollingerBands;
const ADL = require('technicalindicators').ADL;
const ATR = require('technicalindicators').ATR
const ADX = require('technicalindicators').ADX;
const MACD = require('technicalindicators').MACD;

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
    console.log(red("Stochastic: "), green(JSON.stringify(result[size - 1])));
}

async function BB_function(closeValues, period,stdDev){
    var input = {
        period : period, 
        values : closeValues,
        stdDev : stdDev
        }
    const result = BB.calculate(input);
    var size = Object.keys(result).length;
    console.log(red("BB: "), green(JSON.stringify(result[size - 1])));
}

async function ADL_function(closeValues, highValues, lowValues,valumeValues){
    let input = {
        high : highValues,
        low  : lowValues, 
        close : closeValues, 
        volume : valumeValues
    }
    const result = ADL.calculate(input);
    var size = Object.keys(result).length;
    console.log(red("ADL: "), green(result[size-1]));
}

async function ATR_function(closeValues,highValues,lowValues,period){
    var input = {
        high : highValues, 
        low  : lowValues, 
        close :closeValues, 
        period : period
    }
    const result = ATR.calculate(input);
    var size = Object.keys(result).length;
    console.log(red("ATR: "), green(Math.round(result[size - 1])));
}

async function ADX_function(closeValues,highValues,lowValues,period){
    var input = {
        close :closeValues, 
        high : highValues, 
        low  : lowValues, 
        period : period
    }
    const result = ADX.calculate(input);
    var size = Object.keys(result).length;
    console.log(red("ADX: "), green(JSON.stringify(result[size - 1])));
}

async function MACD_function(closeValues){
    var macdInput = {
        values            :closeValues, 
        fastPeriod        : 12,
        slowPeriod        : 26,
        signalPeriod      : 9 ,
        SimpleMAOscillator: false,
        SimpleMASignal    : false
      }
    const result = MACD.calculate(macdInput);
    var size = Object.keys(result).length;
    console.log(red("MACD: "), green(JSON.stringify(result[size - 1])));
}
 
(async function () {
    const closeValues = [];
    const highValues = [];
    const lowValues = [];
    const valumeValues = [];
    const historyObject = await exchange.fetch_ohlcv(coin, timeframe);
    var size = Object.keys(historyObject).length;
    for (var x = 0; x < size; x++) { closeValues[x] = historyObject[x][4]; } // [x][4] this returns only close values
    for (var x = 0; x < size; x++) { lowValues[x] = historyObject[x][3]; } // [x][4] this returns only low values
    for (var x = 0; x < size; x++) { highValues[x] = historyObject[x][2]; } // [x][4] this returns only high values
    for (var x = 0; x < size; x++) { valumeValues[x] = historyObject[x][5]; } // [x][4] this returns only valume values
    console.log("___", coin, "___");
    RSI_function(closeValues, 50);
    SMA_function(closeValues, 20);
    EMA_function(closeValues, 20);
    Stochastic_function(closeValues, highValues, lowValues, 14, 3);
    BB_function(closeValues,14,2);
    ADL_function(closeValues, highValues, lowValues,valumeValues);
    ATR_function(closeValues, highValues, lowValues, 14);
    ADX_function(closeValues, highValues, lowValues, 14);
    MACD_function(closeValues);
})();