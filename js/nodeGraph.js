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

      for (let link in help) {
        if (count < help[link]['edgeStartNode']) {
          count = help[link]['edgeStartNode'];
        }
      }

      let myList = [];
      let myList2 = [];

      for (let i = 0; i <= count; i++) {
        myList.push(i);
      }

      for (let i = 0; i <= count; i++) {
        myList2.push({'x': i + 1, 'y': 0});
      }

      for (let i = 0; i <= count; i++) {
        myList2.push({'x': 0, 'y': i + 1});
      }

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
          if (d.x != 0) {
            return d.x - 1;
          } else {
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
        .attr('id', (d, i) => 'link_' + Object.keys(help)[i]) ;
	      this.updateGraph(0, 'current', 0);
  };


populateLinkData(list)
{

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
    let domain = [-100, 0, 100];
    let range = ["#063e78","#229954", "#860308"];

		//define domain for health, fuel, and reward
		let cdomain = [0,100];

		//define health range
		let hrange = ["#ffffff","#27AE60"];

		//define fuel range
		let frange = ["#ffffff","#D35400"];

		//define reward range
		let rrange = ["#ffffff","#8E44AD"];

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
    let linkData = {
    'tbh' : 0, 'tbf' : 0, 'tbr' : 0,
      'trh' : 0, 'trf' : 0, 'trr' : 0};

    for(let i=0; i < list.length; i++)
		{
			linkData[list[i]] = {'redTeam' : 0, 'blueTeam' : 0,
        'rh' : 0, 'bh' : 0, 'rf' : 0,
        'bf' : 0, 'rr' : 0, 'br' : 0};
		}

		//iterate over each player in the graph, and record to which edge the player corresponds
		for(let key in this.data['playerData'])
		{
		  //define the current player's edge id
			let edge = this.data['playerData'][key][this.time]['player_edge'];

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

		if(this.variable === 'players')
		{
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
					  let redValue = foo['redTeam'];
					  let bluValue = foo['blueTeam'];
					  let indicator = (redValue - bluValue)/(redValue + bluValue) * 100;
					  return colorScale(indicator);
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
            let redValue = foo['redTeam'];
            let bluValue = foo['blueTeam'];
            let indicator = (redValue - bluValue)/(redValue + bluValue + 0.00001) * 100;
            return colorScale(indicator);
					})
					.on('mouseover', function(d,i) {
						console.log(foo);
						d3.select(this)
							.append('title')
							.text(function(d,i) {
                if(this.variable === "players")
                {
                  return 'red: ' + foo['redTeam'] + ', blue: ' + foo['blueTeam'] + ' incorrect';
                }
							})
						;
					})
				;
			}
		}

		//populating colors for Health
		if(this.variable === 'health')
		{
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];

				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#27AE60';
					})
					.style('fill', d =>
					{
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
			for(let i=0; i < list.length; i++)
			{
				let foo = linkData[list[i]];

				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#D35400';
					})
					.style('fill', d =>
					{
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
			for(let i=0; i < list.length; i++)
			{
        let foo = linkData[list[i]];
				let path = d3.select('#link_' + list[i])
					.style('stroke', d => {
						return '#8E44AD';
					})
					.style('fill', d =>
					{
						if(this.team === 1)
						{
						  let totalRedReward = linkData['trr'];
						  let totalBlueReward = linkData['tbr'];
						  let totalReward = totalRedReward + totalBlueReward;
              let currRedReward= foo['rr'];
              let scaleValue = currRedReward/(totalReward + 0.00001)*100;
              console.log(currRedReward);
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
	}

  /**
   * Removes all highlighting from the tree.
   */
  clearGraph() {

  }
}
