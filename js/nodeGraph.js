/** Class implementing the tree view. */
class NodeGraph {
    /**
     * Creates a Tree Object
     */
    constructor() {
		console.log('node graph');
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
  createGraph(data, time) {
	  let count = 0;
	let help = data['graphData'];
	
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
		.attr('id', (d,i) => 'link#' + Object.keys(help)[i] )
		.attr('fill', 'none')
		// .attr('stroke-width', '2')
		.attr('stroke', 'black')
	;
	
	this.updateGraph(0, 'players');
  };

  /**
   * Updates the link colors based on the attribute selected.  Updates the widths
   * of each link based on the percentage of players that are on that link and which
   * team has the majority.
   *
   * @param time: specific time of the simulation.  
   *        variable: selected variable.
   */
	updateGraph(time, variable) {
		console.log('updateGraph');
	}

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {
    
  }
}