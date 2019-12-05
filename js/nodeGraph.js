/** Class implementing the tree view. */
class NodeGraph {
    /**
     * Creates a Tree Object
     */
    constructor(dataset) {
		console.log('node graph');
		this.data = dataset;
		this.variable = 'players';
		this.time = 0;
		this.team = 0;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
  createGraph(time) {
	  let count = 0;
	let help = this.data['graphData'];
	
	//console.log(help);
	
	//let ent = help.entries();
	
	for(let link in help) {
		//console.log(help[link]);
		if(count < help[link]['edgeStartNode'])
		{
			
			count = help[link]['edgeStartNode'];
		}
	}
	
	//console.log(count);
	
	let myList = [];
	let myList2 = [];
	
	for(let i = 0; i <= count; i++)
	{
		myList.push(i);
	}
	
	for(let i = 0; i <= count; i++)
	{
		myList2.push({'x' : i+1, 'y' : 0});
	}
	
	for(let i = 0; i <= count; i++)
	{
		myList2.push({'x' : 0, 'y' : i+1});
	}
	
	console.log(myList2);
	
	let svg = d3.select("#nodeGraph")
		.select('svg')
		.append('g')
	;
	
	let squares = svg.selectAll('circle')
		.data(myList2)
		.enter()
	;
	
	squares.append('circle')
		.attr('cx', d => d.x * 65 + 25)
		.attr('cy', d => d.y * 65 + 25)
		.attr('r', d => 25)
		.attr('width', d => 60)
		.attr('height', d => 60)
	;
	
	squares.append('text')
		.attr('x', d => d.x * 65 + 15)
		.attr('y', d => d.y * 65 + 25)
		.text(d => {
			if(d.x != 0)
			{
				return d.x - 1;
			}
			else
			{
				return d.y - 1;
			}
		})
		.style('fill', 'white')
	;
	
	let matrix = svg.selectAll('g')
		.data(Object.values(help))
		.enter()
	;
	
	matrix.append('g').append('rect')
		.attr('x', d => d.edgeEndNode * 65 + 60)
		.attr('y', d => d.edgeStartNode * 65 + 60)
		.attr('width', d => 60)
		.attr('height', d => 60)
		.attr('id', (d,i) => 'link_' + Object.keys(help)[i] )
	;
	
	// let circles = svg.selectAll('circle')
		// .data(myList)
		// .enter()
	// ;
	
	// let mod = 3.6;
	// let xmod = 100;
	// let ymod = 100
	
	// circles.append('circle')
		// .attr('cx', d => d * xmod + 100)
		// .attr('cy', d => d%mod * ymod + 100)
		// .attr('r', 2)
	// ;
	
	// let lines = svg.selectAll('path')
		// .data(Object.values(help))
		// .enter()
	// ;
	
	// console.log(Object.keys(help));
	
	// lines.append('path')
		// .attr('d', d => { 
		
			// //console.log(d['edgeStarteight'], d['edgeEndeight']);
			// let bump = 0;
			// if(d['edgeStartNode'] < d['edgeEndNode'])
			// {
				// bump = Math.abs(d['edgeEndNode']%mod + 200+d['edgeStartNode']%mod)/2 + d['edgeWeight'] * 20;
			// } else {
				// bump = -Math.abs(d['edgeEndNode']%mod + 200+d['edgeStartNode']%mod)/2 + d['edgeWeight'] * 20;
			// }
		
			// return `M ${d['edgeStartNode'] * xmod + 100} ${d['edgeStartNode']%mod*ymod + 100} 
			// Q ${Math.abs(d['edgeEndNode']*xmod + 200 +d['edgeStartNode']*xmod)/2} ${bump}
			// ${d['edgeEndNode']*xmod + 100} ${d['edgeEndNode']%mod * ymod + 100}`;
		// })
		// .attr('id', (d,i) => 'link_' + Object.keys(help)[i] )
		// .attr('fill', 'none')
		// // .attr('stroke-width', '2')
		// .attr('stroke', 'black')
	// ;
	
	this.updateGraph(0, 'current', 0);
  };

  /**
   * Updates the link colors based on the attribute selected.  Updates the widths
   * of each link based on the percentage of players that are on that link and which
   * team has the majority.
   *
   * @param time: specific time of the simulation. (send -1 if you don't want to change the time). 
   *        variable: selected variable. (send 'current' if you don't want to change the variable).
   *		team: selected team. (send 0 if you don't want a specific team.  Send 1000 if you don't want to change the team.)
   */
	updateGraph(time, variable, team) {
		if(variable != 'current')
		{
			this.variable = variable;
		}
		
		if(time != -1)
		{
			this.time = time;
		}
		
		if(team != 1000)
		{
			this.team = team;
		}
		
		let teamSvg = d3.select('#whichTeam');
		
		if(this.team == 1)
			teamSvg.html('Team 1');
		else if(this.team == -1)
			teamSvg.html('Team 2');
		else
			teamSvg.html('Both Teams');
		
		console.log(this.variable, this.time, this.team);
		let list = Object.keys(this.data['graphData']);
		
		let linkData = {};
		
		let domain = [0, 8.33, 16.66, 24.99, 33.32, 41.65, 50, 58.33, 66.66, 74.99, 83.32, 91.65, 100];

		//Color range for global color scale
		let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];
		
		//variable domain
		let cdomain = [0, 20, 40, 60, 80, 100];
		//health range
		let hrange = ["none","#D4EFDF","#A9DFBF","#7DCEA0","#52BE80","#27AE60"];
		//fuel range
		let frange = ["none","#F6DDCC","#EDBB99","#E59866","#DC7633","#D35400"];
		//reward range
		let rrange = ["none","#E8DAEF","#D2B4DE","#BB8FCE","#A569BD","#8E44AD"];

		//ColorScale be used for percentage of team
		let colorScale = d3.scaleQuantile()
			.domain(domain)
			.range(range);
			
		//can be used for percentage of health
		let colorScaleH = d3.scaleQuantile()
			.domain(cdomain)
			.range(hrange)
		;
		// can be used for percentage of fuel
		let colorScaleF = d3.scaleQuantile()
			.domain(cdomain)
			.range(frange)
		;
		//can be used for percentage of reward
		let colorScaleR = d3.scaleQuantile()
			.domain(cdomain)
			.range(rrange)
		;
		
		for(let i=0; i < list.length; i++)
		{
			//console.log(list[i]);
			linkData[list[i]] = {'redTeam' : 0, 'blueTeam' : 0, 'rh' : 0, 'bh' : 0, 'rf' : 0, 'bf' : 0, 'rr' : 0, 'br' : 0};
		}
		
		let rhtotal = 0;
		let rftotal = 0;
		let rrtotal = 0;
		
		let bhtotal = 0;
		let bftotal = 0;
		let brtotal = 0;
		
		for(let key in this.data['playerData'])
		{
			//console.log(key);
			let edge = this.data['playerData'][key][this.time]['player_edge'];
			//linkData[key[this.time]['player_edge']]++;
				
			if(this.data['playerData'][key][this.time]['player_team'] == 1 && (this.team == 1 || this.team == 0))
			{
				linkData[edge]['redTeam']++;
				linkData[edge]['rh'] += this.data['playerData'][key][this.time]['health'];
				linkData[edge]['rf'] += this.data['playerData'][key][this.time]['fuel'];
				linkData[edge]['rr'] += this.data['playerData'][key][this.time]['reward'];
				
				rhtotal += this.data['playerData'][key][this.time]['health'];
				rftotal += this.data['playerData'][key][this.time]['fuel'];
				rrtotal += this.data['playerData'][key][this.time]['reward'];
			}
			else if(this.data['playerData'][key][this.time]['player_team'] == -1 && (this.team == -1 || this.team == 0))
			{
				linkData[edge]['blueTeam']++;
				linkData[edge]['bh'] += this.data['playerData'][key][this.time]['health'];
				linkData[edge]['bf'] += this.data['playerData'][key][this.time]['fuel'];
				linkData[edge]['br'] += this.data['playerData'][key][this.time]['reward'];
				
				bhtotal += this.data['playerData'][key][this.time]['health'];
				bftotal += this.data['playerData'][key][this.time]['fuel'];
				brtotal += this.data['playerData'][key][this.time]['reward'];
			}
		}
		
		if(this.variable == 'players')
		{	
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				//console.log(foo);
				
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						if(foo['redTeam'] > foo['blueTeam'])
						{
							return '#860308';
						}
						else if(foo['redTeam'] < foo['blueTeam'])
						{
							return '063e78';
						}
						else
						{
							return '#229954';
						}
					})
					.style('stroke-width', d => {
						if(foo['redTeam'] > foo['blueTeam'])
						{
							let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							if(.5 < scale < .75)
								return 3;
							if(.75 < scale <= 1.0)
								return 4;
						}
						else if(foo['redTeam'] < foo['blueTeam'])
						{
							let scale = foo['blueTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							if(.5 < scale < .75)
								return 3;
							if(.75 < scale <= 1.0)
								return 4;
						}
						else
						{
							let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							if(scale == .5)
								return 2;
							else
								return 1;
						}
					})
					.style('fill', d => 
					{
						if(true)//only should happen in matrix view.
						{
							if(foo['redTeam'] != foo['blueTeam'])
							{
								return colorScale((foo['redTeam']/(foo['redTeam'] + foo['blueTeam']))*100);
							}
							else
							{
								if(foo['redTeam'] != 0)
									return '#229954';
								else
									return 'none';
							}
						}
						else
						{
							return 'none';
						}
					})
					.on('mouseover', function(d,i) {
						console.log(foo);
						d3.select(this)
							.append('title')
							.text(function(d,i) { 
								//console.log(foo);
								return 'red: ' + foo['redTeam'] + ', blue: ' + foo['blueTeam'] + ' incorrect';
							})
						;
					})
				;
			}
		}
		
		//populating colors for Health
		if(this.variable == 'health')
		{
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				//console.log(foo);
				
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#27AE60';
					})
					// .style('stroke-width', d => {
						// if(foo['redTeam'] > foo['blueTeam'])
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else if(foo['redTeam'] < foo['blueTeam'])
						// {
							// let scale = foo['blueTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(scale == .5)
								// return 2;
							// else
								// return 1;
						// }
					// })
					.style('fill', d => 
					{
						if(true)//only should happen in matrix view.
						{
							if(this.team == 1)
							{
								if(rhtotal != 0)
									return colorScaleH((foo['rh']/(rhtotal))*100);
								else	
									return 'none';
							}
							else
							{
								if(bhtotal != 0)
									return colorScaleH((foo['bh']/(bhtotal))*100);
								else	
									return 'none';
							}
						}
						else
						{
							return 'none';
						}
					})
					.on('mouseover', function(d,i) {
						d3.select(this)
							.append('title')
							.text(function(d,i) { 
								//console.log(foo);
								return 'red: ' + foo['rh'].toFixed(2) + ', blue: ' + foo['bh'].toFixed(2) + ' incorrect';
							})
						;
					})
				;
			}
		}
		
		//populating colors for Fuel
		if(this.variable == 'fuel')
		{
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				//console.log(foo);
				
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#D35400';
					})
					// .style('stroke-width', d => {
						// if(foo['redTeam'] > foo['blueTeam'])
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else if(foo['redTeam'] < foo['blueTeam'])
						// {
							// let scale = foo['blueTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(scale == .5)
								// return 2;
							// else
								// return 1;
						// }
					// })
					.style('fill', d => 
					{
						if(true)//only should happen in matrix view.
						{
							if(this.team == 1)
							{
								if(rftotal != 0)
									return colorScaleF((foo['rf']/(rftotal))*100);
								else	
									return 'none';
							}
							else
							{
								if(bftotal != 0)
									return colorScaleF((foo['bf']/(bftotal))*100);
								else	
									return 'none';
							}
						}
						else
						{
							return 'none';
						}
					})
					.on('mouseover', function(d,i) {
						d3.select(this)
							.append('title')
							.text(function(d,i) { 
								//console.log(foo);
								return 'red: ' + foo['rf'].toFixed(2) + ', blue: ' + foo['bf'].toFixed(2) + ' incorrect';
							})
						;
					})
				;
			}
		}
		
		//populating the colors for Reward
		if(this.variable == 'reward')
		{
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				//console.log(foo);
				
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#8E44AD';
					})
					// .style('stroke-width', d => {
						// if(foo['redTeam'] > foo['blueTeam'])
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else if(foo['redTeam'] < foo['blueTeam'])
						// {
							// let scale = foo['blueTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(.5 < scale < .75)
								// return 3;
							// if(.75 < scale <= 1.0)
								// return 4;
						// }
						// else
						// {
							// let scale = foo['redTeam'] / (foo['redTeam'] + foo['blueTeam']);
							
							// if(scale == .5)
								// return 2;
							// else
								// return 1;
						// }
					// })
					.style('fill', d => 
					{
						if(true)//only should happen in matrix view.
						{
							if(this.team == 1)
							{
								if(rrtotal != 0)
									return colorScaleR((foo['rr']/(rrtotal))*100);
								else
									return 'none';
							}
							else
							{
								if(brtotal != 0)
									return colorScaleR((foo['br']/(brtotal))*100);
								else
									return 'none';
							}
						}
						else
						{
							return 'none';
						}
					})
					.on('mouseover', function(d,i) {
						d3.select(this)
							.append('title')
							.text(function(d,i) { 
								console.log(foo);
								return 'red: ' + foo['rr'].toFixed(2) + ', blue: ' + foo['br'].toFixed(2) + ' incorrect';
							})
						;
					})
				;
			}
		}
	}

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {
    
  }
}