const ccxt = require("ccxt");
//const poloniex = new ccxt.poloniex(require("./credential.json"));
const poloniex = new ccxt.poloniex();
poloniex.timeout = 25000;
Promise = require("bluebird");
const fs = require("fs");

const checkFileExist = path => {
	try{
		fs.statSync(path);
		return true;
	}catch(error) {
		return false;
	}
}

poloniex.loadMarkets()
.then(result => Object.keys(result).filter(pair=>(pair.indexOf("/BTC")>=0&&!checkFileExist(`chart/${pair.substr(0,pair.indexOf("/BTC"))}.json`))))
.then(pairs =>
	Promise.map(pairs,pair => {
		console.log("START",pair);
		return poloniex.fetchOHLCV (pair, timeframe = '5m', undefined, undefined)
		.then(result => {
			fs.writeFileSync(`chart/${pair.substr(0,pair.indexOf("/BTC"))}.json`,JSON.stringify(result));
			//console.log(JSON.stringify(result,null,"\t"));
			console.log("END",pair);
			return Promise.delay(100);
		})
	},{concurrency:1})
)

/*
poloniex.loadMarkets()
.then(result => {
	console.log(poloniex.id,Object.keys(result));
})
*/
/*
poloniex.fetchTicker("ETH/BTC")
.then(result => {
	console.log(JSON.stringify(result,null,"\t"));
})
*/
/*
poloniex.fetchOHLCV ("ETH/BTC", timeframe = '5m', undefined, undefined)
.then(result => {
	console.log(JSON.stringify(result,null,"\t"));
})
*/
