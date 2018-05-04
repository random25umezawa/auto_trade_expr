Promise = require("bluebird");
const fs = require("fs");

const indexes = [2,5,12,25,55,125];
const power = [5,2,-2,-2,-2,-2];

let btc = 0.0;
let wallet = 0.0;
let pairs = ["BCH"];

let calcOneTime = (pair,index,alldata) => {
	if(index<indexes[2]) return;
	let d = [];
	for(let one_index of indexes) {
		if(index-one_index>=0) d.push(alldata[index-one_index][1]-alldata[index][1]);
	}
	let buy_power = 0.0
	for(let i = 0; i < d.length; i++) {
		buy_power += d[i]*power[i];
	}
	if(buy_power>0) {
		if(btc>0) {
			wallet=btc/alldata[index][1];
			btc=0;
		}
	}else {
		if(wallet>0) {
			btc=wallet*alldata[index][1];
			wallet=0;
		}
	}
	//console.log((alldata[index][0]-alldata[0][0])/(1000*60*5)+"\t"+parseInt(alldata[index][1]*100000)+"\t"+parseInt(btc+wallet*alldata[index][1]));
	console.log(parseInt(btc+wallet*alldata[index][1]));

	/*
	console.log(d.map(data=>{
		let num = parseInt(data*10000000)
		let str = "     "+Math.abs(num);
		if(num<0) {
			str = "-"+str.slice(-5);
		}else {
			str = str.slice(-6);
		}
		return str;
	}).join(","));
	*/
}

let calcAllTime = pair => {
	//console.log("time,price,btc")
	let alldata = require(`./chart/${pair}`).sort((a,b)=>a[0]-b[0]);
	alldata.reduce((current,next,index) => calcOneTime(pair,index,alldata), null);
	//console.log("btc,wallet=",btc,wallet);
}

pairs.map(pair => {
	btc = 50.0;
	wallet = 10.0;
	calcAllTime(pair)
});
