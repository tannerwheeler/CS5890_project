class MapLink {

	constructor(data) {
		console.log('maplink');

		this.data = data;

	}

	updateMapLinks(links)
	{
		let graphs = [];

		let keys = Object.keys(links);

		for(let i in links)
		{
			graphs.push(links[i]);
		}

		//console.log(graphs);

		let maxLength = 0;

		for(let i=0; i < keys.length; i++)
		{
			let newMax = this.data['graphData'][keys[i]]['edgeWeight'];

			if(newMax > maxLength)
				maxLength = newMax;
		}

		let positionScale = d3.scaleLinear()
			.domain([0, maxLength])
			.range([20, 460]);

		//console.log(maxLength);

		let region = d3.select('#mapLinks');

		region.selectAll('svg').remove();

		let graphSize = 120

		let svg = region.append('svg')
			.attr('width', 500)
			.attr('height', graphs.length * graphSize)
			.selectAll('g')
			.data(graphs)
			.enter();

		let graph = svg.append('g')
			.attr('id', (d,i) => 'map_' + keys[i])
		;

		let keySpace = 200;

		graph.append('circle')
			.attr('cx', keySpace)
			.attr('cy', 10)
			.attr('r', 4)
			.attr('fill', 'orange')
		;

		graph.append('text')
			.attr('x', keySpace + 5)
			.attr('y', 15)
			.html('= item');

		graph.append('circle')
			.attr('cx', keySpace + 100)
			.attr('cy', 10)
			.attr('r', 4)
			.attr('fill', 'red')
		;

		graph.append('text')
			.attr('x', keySpace + 105)
			.attr('y', 15)
			.html('= Team 1');

		graph.append('circle')
			.attr('cx', keySpace + 200)
			.attr('cy', 10)
			.attr('r', 4)
			.attr('fill', 'blue')
		;

		graph.append('text')
			.attr('x', keySpace + 205)
			.attr('y', 15)
			.html('= Team 2');

		graph.append('text')
			.attr('x', 5)
			.attr('y', (d,i) => graphSize * i + 20)
			.html((d,i) => 'Edge Key: ' + keys[i])
		;

		graph.append('rect')
			.attr('x', positionScale(0))
			.attr('y', (d,i) => i * graphSize + graphSize/2 - 5)
			.attr('height', 10)
			.attr('width', (d,i) => positionScale(this.data['graphData'][keys[i]]['edgeWeight']))
		;

		graph.append('circle')
			.attr('cx', 10)
			.attr('cy', (d,i) => i * graphSize + graphSize/2)
			.attr('r', 10)
			.style('fill', 'none')
			.style('stroke-width', 1)
			.style('stroke', '#000000')
		;

		graph.append('circle')
			.attr('cx', (d,i) => positionScale(this.data['graphData'][keys[i]]['edgeWeight']) + 30)
			.attr('cy', (d,i) => i * graphSize + graphSize/2)
			.attr('r', 10)
			.style('fill', 'none')
			.style('stroke-width', 1)
			.style('stroke', '#000000')
		;

		graph.append('text')
			.attr('x', 5)
			.attr('y', (d,i) => i * graphSize + graphSize/2+5)
			.html((d,i) => this.data['graphData'][keys[i]]['edgeEndNode'])
		;

		graph.append('text')
			.attr('x', (d,i) => positionScale(this.data['graphData'][keys[i]]['edgeWeight']) + 25)
			.attr('y', (d,i) => i * graphSize + graphSize/2+5)
			.html((d,i) => this.data['graphData'][keys[i]]['edgeStartNode'])
		;

		for(let i in links)
		{
			let map = d3.select('#map_'+i);

			let pos = keys.indexOf(i);

			let playergroup = map.append('g');
			let itemgroup = map.append('g');

			let players = playergroup.selectAll('circle')
				.data(links[i]['players'])
				.enter()
			;

			players.append('circle')
				.attr('cx', (d,i) => positionScale(d['player_pos']))
				.attr('cy', (d,i) => {
					if(d['player_team'] == 1)
						return pos * graphSize + graphSize/2 - 7;
					else
						return pos * graphSize + graphSize/2 + 7;
				})
				.attr('r', 5)
				.attr('fill', (d,i) => {
					if(d['player_team'] == 1)
						return 'red';
					else
						return 'blue';
				})
				.attr('stroke-width', 2)
				.attr('stroke', '#ffffff')
			;

			let items = itemgroup.selectAll('circle')
				.data(links[i]['items'])
				.enter()
			;

			items.append('circle')
				.attr('cx', (d,i) => positionScale(d['item_pos']))
				.attr('cy', (d,i) => {
					//console.log(d);
					return pos * graphSize + graphSize/2;
				})
				.attr('r', 5)
				.attr('fill', (d,i) => {
					return 'orange';
				})
				.attr('stroke-width', 2)
				.attr('stroke', (d,i) => {
					if(d['item_team'] == 1)
						return 'red';
					else if(d['item_team'] == -1)
						return 'blue';
					else
						return '#ffffff';
				})
			;
		}

		let tickDiff = Math.floor(maxLength/10);
		let tickLoc = d3.range(0, maxLength,tickDiff)

		let xAxis = d3.axisBottom(positionScale)
			.tickValues(tickLoc);

		Object.size = function(obj) {
			let size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

		if(Object.size(links) == 0)
		{
			let td = d3.select('#mapLinkScale');
			td.selectAll('svg').remove();
			td.selectAll('text').remove();
			td.append('text')
				.html('Click a link edge to view it and click it again to remove it.');
		}
		else
		{
			let td = d3.select('#mapLinkScale');
			td.selectAll('text').remove();
			td.selectAll('svg').remove();

			td.append('svg')
				.attr('width', 500)
				.attr('height', 50)
				.append('g');

			td.select('svg').append('text')
				.attr('x', 200)
				.attr('y', 20)
				.html('Link Size');

			td.selectAll('g')
				.attr('transform',`translate(${0}, ${25})`)
				.attr("id","xAxisMapLink")
				.call(xAxis)
				.selectAll("text")
				.attr("transform","translate(0,5)rotate(0)")
			;
		}
	}
}


/*

Hey so the problem I found was on link 10 time 0.
The item is at position 11.something, but the edge is only of
length 10.

The other thing I was thinking we could do style wise was add a highlighted color
for the time bar if it is the current time.  This would mean adding a class and css to
change the color only for the current time.

*/
