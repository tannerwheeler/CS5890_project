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
	
	for(let i = 0; i <= count; i++)
	{
		myList.push(i);
	}
	
	//console.log(myList);
	
	let svg = d3.select("#nodeGraph")
		.select('svg')
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
		.attr('r', 2)
	;
	
	let lines = svg.selectAll('path')
		.data(Object.values(help))
		.enter()
	;
	
	console.log(Object.keys(help));
	
	lines.append('path')
		.attr('d', d => { 
		
			//console.log(d['edgeStarteight'], d['edgeEndeight']);
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
		.attr('id', (d,i) => 'link_' + Object.keys(help)[i] )
		.attr('fill', 'none')
		// .attr('stroke-width', '2')
		.attr('stroke', 'black')
	;
	
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
		
		console.log(this.variable, this.time, this.team);
		let list = Object.keys(this.data['graphData']);
		
		let linkData = {};
		
		if(this.variable == 'players')
		{	
			for(let i=0; i < list.length; i++)
			{
				//console.log(list[i]);
				linkData[list[i]] = {'redTeam' : 0, 'blueTeam' : 0};
			}
			
			for(let key in this.data['playerData'])
			{
				//console.log(key);
				let edge = this.data['playerData'][key][this.time]['player_edge'];
				//linkData[key[this.time]['player_edge']]++;
				
				if(this.data['playerData'][key][this.time]['player_team'] == 1 && (this.team == 1 || this.team == 0))
				{
					linkData[edge];
					linkData[edge]['redTeam']++;
				}
				else if(this.data['playerData'][key][this.time]['player_team'] == -1 && (this.team == -1 || this.team == 0))
				{
					linkData[edge]['blueTeam']++;
				}
			}
			
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						if(foo['redTeam'] > foo['blueTeam'])
						{
							return 'red';
						}
						else if(foo['redTeam'] < foo['blueTeam'])
						{
							return 'blue';
						}
						else
						{
							return 'green';
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
				;
			}
		}
		
		if(this.variable == 'health')
		{
			console.log('Health');
		}
		
		if(this.variable == 'fuel')
		{
			console.log('Fuel');
		}
		
		if(this.variable == 'reward')
		{
			console.log('Reward');
		}
		
		console.log(linkData);
		
		
	}

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {
    
  }
}