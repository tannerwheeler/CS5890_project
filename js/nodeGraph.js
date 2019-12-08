/** Class implementing the tree view. */
class NodeGraph {
    /**
     * Creates a Tree Object
     */

    constructor(dataset, timeStamp, mapLink) {
		console.log('node graph');
		this.data = dataset;
		this.variable = 'players';
		this.time = 0;
		this.team = 0;
		this.key = timeStamp;
		this.links = mapLink;
		this.mapLinks = {};
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
	  let thisGraph = this;

    //format link data
    for(const property in help){
      let link = help[property];
      let tempLink = {};
      tempLink.source = link.edgeStartNode;
      tempLink.target = link.edgeEndNode;
      tempLink.value= link.edgeWeight;
      tempLink.tannersSpecialNumber = property;
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

    //record maximum node value for later
    let maxNodeValue = d3.max(graph.nodes, d => d.id);

    //insert artificial node points in between each set of real nodes

      graph.links.forEach(function(link){
        let newNodeID = d3.max(graph.nodes, d => d.id) + 1;
        let link1 = {"source" : link.source, "target" : newNodeID,   "value" : link.value*0.5, "isNew" : true};
        let link2 = {"source" : newNodeID,   "target" : link.target, "value" : link.value*0.5, "isNew" : true};
        let newNode = {"id": newNodeID, "isNew" : true, "source" : link.source, "target" : link.target};
        graph.nodes.push(newNode);
        graph.links.push(link1);
        graph.links.push(link2);
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
      .selectAll("path")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("id",d => 'link_' + d.tannersSpecialNumber)
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
      .attr('r',d => d.isNew?0:nodeCircleRadius)
      .attr("fill","black")
    ;

    let simulation= d3.forceSimulation();

    //add nodes to simulation
    simulation
      .nodes(graph.nodes)
      .on("tick", ticked.bind(this))
    ;

    //define link forces
    let distFunc = function(link_i, i, link){return link_i.value;};
    let linkForce = d3.forceLink(graph.links);
    linkForce.initialize(graph.nodes);
    linkForce.distance(distFunc);
    linkForce.strength(0.1);

    //define link forces to simulation
    simulation.force("link",linkForce);
    simulation.force("charge", d3.forceManyBody().strength(-2000));
    simulation.force("center", d3.forceCenter(svgWidth/2, svgHeight/2-150));





    function ticked(){
      let helperVar = [];
      node.attr("transform", d => {
        let temp = {};
        temp.x = d.x;
        temp.y = d.y;
        temp.id = d.id;
        temp.source = d.source;
        temp.target = d.target;
        helperVar.push(temp);
        return "translate(" + d.x + "," + d.y + ")";
      });

      link.attr('d', d => {
        let source = d.source.index;
        let target = d.target.index;
        if(!d.isNew)
        {
          let tempNode =helperVar.filter( t => {
            return t.source === source && t.target === target
          });
          let  temp = tempNode[0];
          for(let i =0; i<helperVar.length; i++)
          {
            if(helperVar[i] === tempNode[0])
            {
              helperVar.splice(i,1);
            }
          }
          return "M " + d.source.x + " " + d.source.y + " Q " + temp.x+ " " + temp.y+ " " + d.target.x + " " + d.target.y;
        }
        else{
          return "";
        }
      })


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
	  this.updateGraph(0, 'current', 0);
  };




populateLinkData(list)
{
  let linkData = {
    'tbh' : 0, 'tbf' : 0, 'tbr' : 0,
    'trh' : 0, 'trf' : 0, 'trr' : 0,
	'players': [], 'items': []};

  for(let i=0; i < list.length; i++)
  {
    linkData[list[i]] = {'redTeam' : 0, 'blueTeam' : 0,
      'rh' : 0, 'bh' : 0, 'rf' : 0,
      'bf' : 0, 'rr' : 0, 'br' : 0,
	  'players': [], 'items': []};
  }

  //iterate over each player in the graph, and record to which edge the player corresponds
  for(let key in this.data['playerData'])
  {
    //define the current player's edge id
    let edge = this.data['playerData'][key][this.time]['player_edge'];

	linkData[edge]['players'].push(this.data['playerData'][key][this.time]);

    //identify to which team the current player corresponds ??: why the second check?
    if(this.data['playerData'][key][this.time]['player_team'] === 1 && (this.team === 1 || this.team === 0))
    {
      //update linkData to reflect the current running total for red statistics ??: why have rhtotal if we are keeping things in linkData[edge]['redTeam']?
      linkData[edge]['redTeam']++;
      linkData[edge]['rh'] += this.data['playerData'][key][this.time]['health'];
      linkData[edge]['rf'] += this.data['playerData'][key][this.time]['fuel'];
      linkData[edge]['rr'] += this.data['playerData'][key][this.time]['reward'];

      //update total values
      linkData['trh'] += this.data['playerData'][key][this.time]['health'];
      linkData['trf'] += this.data['playerData'][key][this.time]['fuel'];
      linkData['trr'] += this.data['playerData'][key][this.time]['reward'];
    }
    else if(this.data['playerData'][key][this.time]['player_team'] === -1 && (this.team === -1 || this.team === 0))
    {
      //update linkData to reflect the current running total for blue statistics
      linkData[edge]['blueTeam']++;
      linkData[edge]['bh'] += this.data['playerData'][key][this.time]['health'];
      linkData[edge]['bf'] += this.data['playerData'][key][this.time]['fuel'];
      linkData[edge]['br'] += this.data['playerData'][key][this.time]['reward'];

      //update total values
      linkData['tbh'] += this.data['playerData'][key][this.time]['health'];
      linkData['tbf'] += this.data['playerData'][key][this.time]['fuel'];
      linkData['tbr'] += this.data['playerData'][key][this.time]['reward'];
    }
  }

  for(let key in this.data['itemData'])
  {
	  let edge = this.data['itemData'][key][this.time]['edge'];

	  linkData[edge]['items'].push(this.data['itemData'][key][this.time]);
  }

  return linkData;
}

calcStrokeIndicator(linkData, list, i, colorScale)
{
  if(this.variable === 'players')
  {
    let foo = linkData[list[i]];
    let redValue = foo['redTeam'];
    let bluValue = foo['blueTeam'];
    let indicator = (redValue - bluValue)/(redValue + bluValue + 0.00001) * 100;
    indicator = (indicator === 0)?0:(indicator > 0)?100:-100;
    return colorScale(indicator);
  }

}

calcFillIndicator(linkData,list,i,colorScale)
{
  if(this.variable === 'players')
  {
    let foo = linkData[list[i]];
    let redValue = foo['redTeam'];
    let bluValue = foo['blueTeam'];
    let indicator = 0;

	  if(redValue + bluValue != 0)
    {
      indicator = (redValue - bluValue)/(redValue + bluValue) * 100;
      return colorScale(indicator);
    }
	  else
    {
      return "#229954";
    }
  }
}

calcTitle(linkData, list, i)
{
  if(this.variable === 'players')
  {
    let foo = linkData[list[i]];
    return 'red: ' + foo['redTeam'] + ', blue: ' + foo['blueTeam'];
  }
}

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

    //set input variables if needed
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

	let mapTime = d3.select('#currentMapTime');

	mapTime.html('Current Time = ' + this.time);

    //select header svg ??
    let teamSvg = d3.select('#whichTeam');

    //set header value based on selection
    if(this.team == 1)
      teamSvg.html('Team 1');
    else if(this.team == -1)
      teamSvg.html('Team 2');
    else
      teamSvg.html('Both Teams');

    //get list of key values
    let list = Object.keys(this.data['graphData']);


    //define color range and domain for team colors
    let domain = [-100, -40, -0.1, 0, 0.1, 40, 100];
    let range = ["#2980B9","#5499C7","#ffffff","#229954","#ffffff","#CD6155","#C0392B"];

    //define domain for health, fuel, and reward
    let cdomain = [0,50,100];

    //define health range
    let hrange = ["#E9F7EF","#7DCEA0","#27AE60"];

    //define fuel range
    let frange = ["#FBEEE6","#E59866","#D35400"];

    //define reward range
    let rrange = ["#F4ECF7","#A569BD","#8E44AD"];

    //ColorScale be used for percentage of team
    let colorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);

    //can be used for percentage of health
    let colorScaleH = d3.scaleLinear()
      .domain(cdomain)
      .range(hrange)
    ;
    // can be used for percentage of fuel
    let colorScaleF = d3.scaleLinear()
      .domain(cdomain)
      .range(frange)
    ;
    //can be used for percentage of reward
    let colorScaleR = d3.scaleLinear()
      .domain(cdomain)
      .range(rrange)
    ;

    //initialize link data variable
    let linkData = this.populateLinkData(list);
	//console.log(linkData);


    if(this.variable === 'players')
    {
	  this.key.updateKey(colorScale, this.variable);

      for(let i=0; i < list.length; i++)
      {
        let foo = linkData[list[i]];
		let g = d3.select('#link_'+list[i]).on('click', d => {
			if(this.mapLinks[list[i]])
			{
				delete this.mapLinks[list[i]];
			}
			else
			{
				this.mapLinks[list[i]] = linkData[list[i]];
			}

			this.links.updateMapLinks(this.mapLinks);
		  });

        let path = d3.select('#link_' + list[i])
          .style('stroke', this.calcFillIndicator(linkData,list,i,colorScale))
          .style('stroke-width', 4)
          .style('fill', 'none')
          .on('mouseover', (d,i) => {
            d3.select('#link_' + list[i]).selectAll('title').remove();
            d3.select('#link_' + list[i])
              .select('title')
              .text(this.calcTitle(linkData,list,i))
            ;
          })
        ;
      }
    }

    //populating colors for Health
    if(this.variable === 'health')
    {
	  this.key.updateKey(colorScaleH, this.variable);

      for(let i=0; i < list.length; i++)
      {
        let foo = linkData[list[i]];

        let path = d3.select('#link_' + list[i])
          .style('stroke', d => {
            if(this.team === 1)
            {
              let currRedHealth = foo['rh'];
              let totalBlueHealth = linkData['tbh'];
              let totalRedHealth = linkData['trh'];
              let totalHealth = totalBlueHealth + totalRedHealth;
              let scaleValue = currRedHealth/(totalHealth + 0.00001) * 100;
              return colorScaleH(scaleValue);
            }
            else
            {
              let currBlueHealth = foo['bh'];
              let totalBlueHealth = linkData['tbh'];
              let totalRedHealth = linkData['trh'];
              let totalHealth = totalBlueHealth + totalRedHealth;
              let scaleValue = currBlueHealth/(totalHealth+ 0.00001)*100;
              return colorScaleH(scaleValue);
            }
          })
          .style('fill', 'none')
          .on('mouseover', function(d,i) {
            d3.select(this)
              .append('title')
              .text(function(d,i) {
                //console.log(foo);
                return 'red health: ' + foo['rh'].toFixed(2) + ', blue health: ' + foo['bh'].toFixed(2) + ' incorrect';
              })
            ;
          })
        ;
      }
    }

    //populating colors for Fuel
    if(this.variable === 'fuel')
    {
	  this.key.updateKey(colorScaleF, this.variable);

      for(let i=0; i < list.length; i++)
      {
        let foo = linkData[list[i]];

        let path = d3.select('#link_' + list[i])
          .style('stroke', d => {
            if(this.team === 1)
            {
              let currRedFuel= foo['rf'];
              let totalRedFuel = linkData['trf'];
              let totalBlueFuel = linkData['tbf'];
              let totalFuel = totalRedFuel + totalBlueFuel;
              let scaleValue = currRedFuel/(totalFuel + 0.00001)*100;
              return colorScaleF(scaleValue);
            }
            else
            {
              let currBlueFuel = foo['bf'];
              let totalRedFuel = linkData['trf'];
              let totalBlueFuel = linkData['tbf'];
              let totalFuel = totalRedFuel + totalBlueFuel;
              let scaleValue = currBlueFuel / (totalFuel + 0.00001) * 100;
              return colorScaleF(scaleValue);
            }
          })
          .style('fill', 'none')
          .on('mouseover', function(d,i) {
			d3.select(this)
              .append('title')
              .text(function(d,i) {
                return 'red fuel: ' + foo['rf'].toFixed(2) + ', blue fuel: ' + foo['bf'].toFixed(2) + ' incorrect';
              })
            ;
          })
        ;
      }
    }

    //populating the colors for Reward
    if(this.variable === 'reward')
    {
	  this.key.updateKey(colorScaleR, this.variable);

      for(let i=0; i < list.length; i++)
      {
        let foo = linkData[list[i]];
        let path = d3.select('#link_' + list[i])
          .style('stroke', d => {
            if(this.team === 1)
            {
              let totalRedReward = linkData['trr'];
              let totalBlueReward = linkData['tbr'];
              let totalReward = totalRedReward + totalBlueReward;
              let currRedReward= foo['rr'];
              let scaleValue = currRedReward/(totalReward + 0.00001)*100;
              //console.log(currRedReward);
              return colorScaleR(scaleValue);
            }
            else
            {
              let totalRedReward = linkData['trr'];
              let totalBlueReward = linkData['tbr'];
              let totalReward = totalRedReward + totalBlueReward;
              let currBlueReward = foo['br'];
              let scaleValue = currBlueReward/(totalReward + 0.00001)*100;
              return colorScaleR(scaleValue);
            }
          })
          .style('fill', 'none')
          .on('mouseover', function(d,i) {
            d3.select(this)
              .append('title')
              .text(function(d,i) {
                return 'red: ' + foo['rr'].toFixed(2) + ', blue: ' + foo['br'].toFixed(2) + ' incorrect';
              })
            ;
          })
        ;
      }
    }

	for(let i=0; i < list.length; i++)
	{
		if(this.mapLinks[list[i]])
		{
			this.mapLinks[list[i]] = linkData[list[i]];
		}
	}

	this.links.updateMapLinks(this.mapLinks);
  }

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {

  }
}
