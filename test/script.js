// fetch("./gameData1.json")
	// .then(function(resp){
		// return resp.json();
	// })
	// .then(function(data) {
		// //console.log(data);
		// //testFunction(data);
		// console.log(data);
	// })
// ;
fetch("./gameData.json")
	.then(function(resp){
		return resp.json();
	})
	.then(function(data) {
		//console.log(data);
		testFunction(data);
		console.log(data);
	})
;

function myFunction(item, index) {
  document.getElementById("demo").innerHTML += index + ":" + item + "<br>";
}

let testFunction = function(data) {
	let count = 0;
	let help = data['graphData'];
	
	console.log(typeof(help));
	
	//let ent = help.entries();
	
	for(link in help) {
		console.log(help[link]);
		if(count < help[link]['edgeStartNode'])
		{
			
			count = help[link]['edgeStartNode'];
		}
	}
	
	console.log(count);
	
	let myList = [];
	
	for(let i = 0; i <= count; i++)
	{
		myList.push(i);
	}
	
	console.log(myList);
	
	let svg = d3.select("#test")
		.append('g')
	;
	
	let circles = svg.selectAll('circle')
		.data(myList)
		.enter()
	;
	
	let mod = 3.6;
	let xmod = 100;
	let ymod = 100
	
	circles.append('circle')
		.attr('cx', d => d * xmod + 100)
		.attr('cy', d => d%mod * ymod + 100)
		.attr('r', 1)
	;
	
	let lines = svg.selectAll('path')
		.data(Object.values(help))
		.enter()
	;
	
	console.log(Object.values(help));
	
	lines.append('path')
		.attr('d', d => { 
		
			console.log(d['edgeStarteight'], d['edgeEndeight']);
			let bump = 0;
			if(d['edgeStartNode'] < d['edgeEndNode'])
			{
				bump = Math.abs(d['edgeEndNode']%mod + 200+d['edgeStartNode']%mod)/2 + d['edgeWeight'] * 20;
			} else {
				bump = -Math.abs(d['edgeEndNode']%mod + 200+d['edgeStartNode']%mod)/2 + d['edgeWeight'] * 20;
			}
		
			return `M ${d['edgeStartNode'] * xmod + 100} ${d['edgeStartNode']%mod*ymod + 100} 
			Q ${Math.abs(d['edgeEndNode']*xmod + 200 +d['edgeStartNode']*xmod)/2} ${bump}
			${d['edgeEndNode']*xmod + 100} ${d['edgeEndNode']%mod * ymod + 100}`;
		})
		.attr('fill', 'none')
		.attr('stroke-width', '2')
		.attr('stroke', 'black')
	;
	
	
		
	// let ratio = 3.141592 * 2 / (data['graphData']['edges'].length - 1);
	// let centery = true;
	// let centerx = true;
	
	// console.log(ratio);
	// svg.append('circle')
		// .attr('cx', d => (d[0] * 30 + d[1] * 30 + d[2] * 20))
		// .attr('cy', d => d[1] * 30 + d[0] * 100 + d[0] * 10)
		// .attr('r', 10)
	// ;
	
	// svg.append('circle')
		// .attr('cx', (d,i) => Math.cos(i * ratio) * 300 + 350)
		// .attr('cy', (d,i) => Math.sin(i * ratio) * 300 + 350)
		// .attr('r', 10)
	// ;
	
	// svg.append('circle')
		// .attr('cx', (d,i) => d[0] * 100 + d[2] * 10 + 100)
		// .attr('cy', (d,i) => d[2] * 10 + 10)//+ d[2] + 100)
		// .attr('r', 10)
	// ;
	
	// svg.append('circle')
		// .attr('cx', (d,i) => {
			// if(centerx)
			// {
				// centerx = false;
				// return 350;
			// }
			// else
			// {
				// return Math.cos(i * ratio) * 300 + 350;
			// }
		// })
		// .attr('cy', (d,i) => {
			// if(centery)
			// {
				// centery = false;
				// return 350;
			// }
			// else
			// {
				// return Math.sin(i * ratio) * 300 + 350;
			// }
		// })
		// .attr('r', 10)
	// ;
}
