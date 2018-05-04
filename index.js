//Promise = require("bluebird");
const fs = require("fs");

/*
const set_pairs = [
	[[2,5,12,25],[10,3,-3,-1]],
	[[2,5,12,25],[3,10,-2,-5]],
	[[2,5,12,25],[3,7,-8,-4]],
	[[2,5,12,25,55,125],[5,2,-4,-3,-2,-1]],
	[[2,5,12,25,55,125],[4,9,-9,-6,-3,-2]],
	[[2,5,12,25,55,125],[2,6,-1,-3,-4,-6]]
]
*/
let set_pairs = [];
for(let loop = 0; loop < 500; loop++) {
	let count = 3+parseInt(Math.random()*3);
	let indexes = [];
	let power = [];
	let sum = 0;
	for(let i = 0; i < count; i++) {
		let rand = 2+parseInt(Math.random()*8);
		sum += rand+sum;
		indexes.push(sum);
		power.push(parseInt(Math.random()*20-10));
	}
	set_pairs.push([indexes,power]);
}
//set_pairs.push([[4,11,24],[8,9,1]]);
//set_pairs.push([[2,6,18],[4,3,1]]);

let indexes = [2,5,12,25,55,125];
let power = [5,2,-2,-2,-2,-2];

let btc = 0.0;
let wallet = 0.0;
//let pairs = ["BCH","ETH","BTCD","XRP","EMC2","GAME","DOGE","DGB","LTC"];
let pairs = ["BTCD"];
//let pairs = ["BCH","ETH"];
let results = {};
for(let pair of pairs) {
	results[pair] = [];
}

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
			wallet=btc/alldata[index][1]*0.9975;
			btc=0;
		}
	}else {
		if(wallet>0) {
			btc=wallet*alldata[index][1]*0.9975;
			wallet=0;
		}
	}
	//console.log((alldata[index][0]-alldata[0][0])/(1000*60*5)+"\t"+parseInt(alldata[index][1]*100000)+"\t"+parseInt(btc+wallet*alldata[index][1]));
	//console.log(parseInt(btc+wallet*alldata[index][1]));

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

let calcAllTime = (index,pair,start_index=-10000,end_index=-1) => {
	//console.log("time,price,btc")
	let alldata = require(`./chart/${pair}`).sort((a,b)=>a[0]-b[0]).slice(start_index,end_index);
	//let alldata = require(`./chart/${pair}`).sort((a,b)=>a[0]-b[0]);
	alldata.reduce((current,next,index) => calcOneTime(pair,index,alldata), null);
	//console.log("btc,wallet=",btc,wallet);
	let final_btc = btc+wallet*alldata[alldata.length-1][1];
	//console.log(indexes,power,pair,final_btc);
	//results[pair].push({index:index,pair,final_btc:final_btc,start:start_index,end:end_index});
	results[pair].push({index:index,pair,final_btc:final_btc});
}

let calcAll = (start_index,end_index) => {
	console.log("start "+start_index+" end "+end_index);
	for(let pair of pairs) {
		results[pair] = [];
	}
	new_pairs = [];
	pairs.map(pair => {
		set_pairs.map((set_pair,index)=>{
			indexes = set_pair[0];
			power = set_pair[1];
			btc = 50.0;
			wallet = 0.0;
			calcAllTime(index,pair,start_index,end_index)
		});
		let result = results[pair];
		result.sort((a,b)=>b.final_btc-a.final_btc);
		for(let rank = 0; rank < 25; rank++) {
			console.log(set_pairs[result[rank].index],result[rank]);
			new_pairs.push(set_pairs[result[rank].index]);
		}
		console.log();
		for(let rank = result.length-1; rank > result.length-26; rank--) {
			//console.log(set_pairs[result[rank].index],result[rank]);
			new_pairs.push(set_pairs[result[rank].index]);
		}
		console.log();
	});
	set_pairs = new_pairs;
}

calcAll(-25000,-12500);
calcAll(-12500,-7500);
calcAll(-7500,-2500);
calcAll(-2500,-500);
