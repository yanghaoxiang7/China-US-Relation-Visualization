// 测试函数，不用在意
function work(DATA){
	let word = get_top_words(DATA, '2020/1/1', '2020/1/2', stopwords, 10);
	//console.log(word);
}

// 一个set，停用词
var stopwords;

/*
* tokenize: 将字符串划分为单词列表
* 参数：s，字符串，代表一篇文章；stopwords，一个set，代表停用词；
* 返回：一个数组Array，为去除标点符号、转为全小写、按空格和回车等划分后的单词列表；
*/

function tokenize(s){
	words = s.split(/[\s.]+/g)
		.map(d => d.replace(/[.,$:;/%"()\?!\+&-]+/g, ""))
		.map(d => d.replace(/'\S*/g, ""))
        .map(d => d.replace(/[0-9]+/g, ""))
        .map(d => d.replace(/<\S+>/g, ""))
		.map(d => d.toLowerCase())
		.filter(d => d.length > 0);
	return words;
}

/*
* get_idf: 计算给定时间内的文章的所有单词的tf-idf值；
* 参数：DATA，原数据；from, to：起始时间，两端均包含；类型为字符串，例如 '2020/1/1'；stopwords，停用词；
* 返回：一个有两项数据的map，其中"tf_idf"返回一个计算了tf_idf的map，"idf"返回一个计算了idf的map；具体可看get_top_words
*/

function get_idf(DATA, from, to, stopwords){
	let numDocs = 0;
	let fromDate = new Date(from);
	let toDate = new Date(to);
    //console.log(fromDate);
    //console.log(toDate);

	let wordDic = {}, idf = {}, tf = {}, tf_idf = {};

	function work(s){
		if(s.length <= 0) return;
		numDocs++;
		doc = tokenize(s, stopwords);
		//let doc = s;
		let nWords = doc.length;
		doc = doc.filter(d => !stopwords.has(d));
		docSet = new Set(doc);

		if(doc.length <= 0) return;

		for(let word of docSet){
			if(!wordDic[word])
				wordDic[word] = 1;
			else wordDic[word]++;
		}

		for(let i in doc){
			word = doc[i];
			if(!tf[word])
				tf[word] = 1 / nWords;
			else tf[word] += 1 / nWords;
		}
	}

	let nrow = DATA.length;
	let sample_step = 5;
	for(let _i = 0; _i < nrow; _i += sample_step){
		let i = _i;
		if(i >= nrow) continue;
		let nowDate = new Date(DATA[i]['date']);
		if(nowDate > toDate || nowDate < fromDate) continue;
        //console.log(nowDate);

		let headline = DATA[i]['headline'];
		let abstract = DATA[i]['abstract'];

		//console.log(DATA[i]['tokenize'])

		//let tokenized = JSON.parse(DATA[i]['tokenize']);

		//work(tokenized);

		work(headline + " " + abstract);
	}

	for(let word in wordDic){
		idf[word] = Math.log(numDocs / (wordDic[word] + 1));
		tf_idf[word] = idf[word] * tf[word];
	}

	return {"tf_idf": tf_idf, "idf": idf};
}

/*
* get_top_words: 计算给定时间内的具有最大的tf_idf值的单词列表，可以直接输入到词云；
* 参数：DATA，原数据；from, to：起始时间，两端均包含；类型为字符串，例如 '2020/1/1'；stopwords，停用词；k，返回前k大单词；
* 返回：一个长为k的数组，每项结构为[words, weight]，其中weight为这个单词的tf_idf值；
*/

function get_top_words(DATA, from, to, stopwords, k){
	let tf_idf = get_idf(DATA, from, to, stopwords)["tf_idf"];
	let wordArray = Object.keys(tf_idf).map(d => [d, tf_idf[d]]).sort((a,b) => b[1] - a[1]);
	let result = new Array();
	for(let i = 0; i < k; ++i)
		result[i] = {"text": wordArray[i][0], "value": wordArray[i][1]};
	return result;
}


function hahaha(from, to, k) {
	d3.json('data/stopwords.json').then(function(DATA){
		stopwords = new Set(DATA["stopwords"]);
        //console.log(stopwords)
        d3.csv('data/merged.csv').then(function(DATA){
            result = get_top_words(DATA,from,to,stopwords,k);
            //console.log(result)
            return result;
        });
	});
}
