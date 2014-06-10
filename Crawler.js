var Crawler = function() {
	
	var me = this;
	
	return {
		/*
		list of public variables
		listOfNodes:- stores the integer that has been most recently visited and the contains an array of integers parsed from the pattern on that visited URL
		rootValue:- the integer visited
		visitedNodes:- the list of integers that have been accessed and parsed
		nodeMap:- its the list of order of integers visited
		count:- increased every time a request is made
		*/
		listOfNodes: {},
		rootValue: '',
		visitedNodes: [],
		nodeMap: [],
		count: '',
		/*
		returns the content from a URL
		*/
		sendForInfo: function(value) {
			var me = this;
			if (me.visitedNodes.indexOf(value) === -1) {
				me.count++;
				me.visitedNodes.push(value);
				me.rootValue = value;
			}
			if (me.count == 300) {
				throw "Count reached 300";
			}
			var xhr, url;
			if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
			else xhr = new ActiveXObject("Microsot.XMLHTTP");
			
			url = 'GetInfo.php?int_val=' + value;
			xhr.open('GET', url, false);
			xhr.onreadystatechange = function() {
				if (xhr.readyState ===4 && xhr.status ===200) {

				} else {console.log('ouchies');}
			}
			xhr.send();

			return xhr.responseText;
		},
		/*
		initializes the Crawler with the starting integer value
		*/
		init: function(startInteger) {
			var me = this;
			me.count = 0;
			return this.sendForInfo(startInteger);
		},
		/*
		start crawling depending on content
		*/
		startCrawling: function(content) {
			var me = this;
			if (content == 'GOAL') {
				console.log('HIT the GOAL');
				return;
			} else if (content == 'DEADEND') {
				console.log('HiT the DEADEND');
				return;
			} else {
				/*
				checks whether the current integer already has an array of integers populated or not 
				*/
				if (me.listOfNodes[me.rootValue] === undefined) {
					me.listOfNodes[me.rootValue] = [];
					me.nodeMap.push(me.rootValue);
					me.buildList(content.split("\n"));
					me.iterate(me.listOfNodes, me.rootValue);
				}
			}
		},
		/*
		populates listOfNodes depending on the integer value and the parsed integers under it
		*/
		buildList: function(patterns) {
			var me = this;
			patterns.forEach(function(element, index) {
				var intVal = this.Crawler.Eval.evaluate(element);
				me.listOfNodes[me.rootValue].push(intVal);
			});
		},
		/*
		iterate through the array of integers accessed from the root integer
		*/
		iterate: function(list, parent) {
			var me = this;
			var newList = list[parent];
			console.log(parent);
			console.log(newList);
			newList.forEach(function(element, index, arr) {
				if (me.visitedNodes.indexOf(element) === -1) {
					me.startCrawling(me.sendForInfo(element));
				}
			});
		}
	};
};
/*
This part checks for the pattern and evaluates it
*/
Crawler.Eval = {
	checkOperation: function(str) {
		switch (str.match(/[a-z]+/g)[0]) {
			case "add":
				var ints = str.match(/\d+/g),
					res = 0;
				ints.forEach(function(elem, ind, arr) {
					res += parseInt(elem);
				});
				return ""+res+"";
			case "subtract":
				var ints = str.match(/\d+/g),
					res = 0;
				res = ints[0] - ints[1];
				return ""+res+"";
			case "multiply":
				var ints = str.match(/\d+/g),
					res = 1;
				ints.forEach(function(elem, ind, arr) {
					res = res*parseInt(elem);
				});
				return ""+res+"";
			case "abs":
				var ints = str.match(/\d+/g), res;
				res = Math.abs(parseInt(ints[0]));
				return ""+res+"";
		}
	},
	evaluate: function(patt) {
		var incoming = patt;
		var m, result, re = new RegExp(/([a-z]+)\(([^()]+)\)/g);
		if (parseInt(patt) % 1 === 0) { return patt; }
		else {
			m = incoming.match(re);
			for (var i = 0; i<m.length; i++) {
				incoming = incoming.replace(m[i], this.checkOperation(m[i]));
			}
		}
		result = this.evaluate(incoming);
		return result;
	}
};