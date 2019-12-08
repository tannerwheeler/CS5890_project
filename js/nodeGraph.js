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
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
  createGraph(time) {

    //initialize function parameters
	  let nodes = {};
	  let links = [];
	  let graph = {};
	  graph.nodes = [];
	  graph.links = [];
	  let help = this.data['graphData'];
	  let svgHeight = 1000;
	  let svgWidth = 1000;
	  let edgeStrokeWidth = 3;
	  let nodeCircleRadius = 5;

    //format link data
    for(const property in help){
      let link = help[property];
      let tempLink = {};
      tempLink.source = link.edgeStartNode;
      tempLink.target = link.edgeEndNode;
      tempLink.value= link.edgeWeight;
      graph.links.push(tempLink);
    }

	  //format node data
    graph.links.forEach(function(link){

      if(graph.nodes.filter( e => e.id === link.source).length <= 0)
      {
        graph.nodes.push({id:link.source});
      }

      if(graph.nodes.filter( e => e.id === link.target).length <= 0)
      {
        graph.nodes.push({id:link.target});
      }
    });


	  //define svg container
	  let svg = d3.select("#nodeGraph")
	  	.select('svg')
      .attr("height",svgHeight)
      .attr("width",svgWidth)
	  ;




    //define graphical link elements
    let link = svg.append("g")
      .attr("class","links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .style("stroke-width",edgeStrokeWidth)
      .style("stroke","black")
    ;

    //define graphical node elements
    let node = svg.append("g")
      .attr("class","nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g")
    ;

    //define circle elements for each node
    let circles = node.append("circle")
      .attr('r',nodeCircleRadius)
      .attr("fill","black")
    ;

    let simulation= d3.forceSimulation();

    //add nodes to simulation
    simulation
      .nodes(graph.nodes)
      .on("tick", ticked)
    ;

    //define link forces
    let distFunc = function(link_i, i, link){return link_i.value;};
    let linkForce = d3.forceLink(graph.links);
    linkForce.initialize(graph.nodes);
    linkForce.distance(distFunc);
    linkForce.strength(0.1);

    //define link forces to simulation
    simulation.force("link",linkForce);
    simulation.force("charge", d3.forceManyBody().strength(-4000));
    simulation.force("center", d3.forceCenter(svgWidth/2, svgHeight/2));





    function ticked(){
      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      link.attr('x1', function(d) {return d.source.x; })
          .attr('y1', function(d) {return d.source.y; })
          .attr('x2', function(d) {return d.target.x; })
          .attr('y2', function(d) {return d.target.y; })
    }

    function dragstarted(d){
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d){
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d){
      if(!d3.event.active) simulation.alplhaTarget(0);
      d.fx = null;
      d.fy = null;
    }
	  this.updateGraph(0, 'current');
  };


  /**
   * Updates the link colors based on the attribute selected.  Updates the widths
   * of each link based on the percentage of players that are on that link and which
   * team has the majority.
   *
   * @param time: specific time of the simulation. (send -1 if you don't want to change the time).
   *        variable: selected variable. (send 'current' if you don't want to change the variable).
   */
	updateGraph(time, variable) {
		if(variable != 'current')
		{
			this.variable = variable;
		}

		if(time != -1)
		{
			this.time = time;
		}

		console.log(this.variable, time);
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

				if(this.data['playerData'][key][this.time]['player_team'] == 1)
				{
					linkData[edge];
					linkData[edge]['redTeam']++;
				}
				else if(this.data['playerData'][key][this.time]['player_team'] == -1)
				{
					linkData[edge]['blueTeam']++;
				}
			}
		}

		console.log(linkData);

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

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {

  }
}
