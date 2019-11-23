/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(vizData, nodeGraph, timeSeriesGraph) {
	console.log('table');
    // Maintain reference to the tree Object; 
    this.map = nodeGraph; 

    // Create list of all elements that will populate the table
    // Initially, the tableElements will be identical to the teamData
    //this.tableElements = vizData.slice(); // 
	//console.log(this.tableElements);
    // Store all match data for the 2014 Fifa cup
    this.vizData = vizData;

/*
    // Default values for the Table Headers
    this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

    // To be used when sizing the svgs in the table cells.
    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };

    this.bar = {
      "height": 20
    };

    // Set variables for commonly accessed data columns
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';


    // Setup the scales
    this.goalScale = null; 

    // Used for games/wins/losses
    this.gameScale = d3.scaleLinear()
		.domain([0,7])
		.range([0,70])
	;

    // Color scales
    // For aggregate columns  Use colors '#ece2f0', '#016450' for the range.
    this.aggregateColorScale = d3.scaleLinear()
		.domain([1, 8])
		.range(['#ece2f0','#016450'])
	;

    // For goal Column. Use colors '#cb181d', '#034e7b'  for the range.
    this.goalColorScale = null;
*/
  }

  /**
   * Updates the table contents with a row for each element in the global
   * variable tableElements.
   */
	updateTable(time) {
		let teamOneCount = 0;
		let teamTwoCount = 0;
		let teamOneFuel = 0;
		let teamTwoFuel = 0;
		let teamOneHealth = 0;
		let teamTwoHealth = 0;
		let teamOneReward = 0;
		let teamTwoReward = 0;
		
		let list = Object.values(this.vizData['playerData']);
		console.log(list);
		
		for(let i=0; i < list.length; i++)
		{
			if(list[i][time]['player_team'] == 1)
			{
				teamOneCount++;
				teamOneFuel += list[i][time]['fuel'];
				teamOneHealth += list[i][time]['health'];
				teamOneReward += list[i][time]['reward'];
			}
			else if (list[i][time]['player_team'] == -1)
			{
				teamTwoCount++;
				teamTwoFuel += list[i][time]['fuel'];
				teamTwoHealth += list[i][time]['health'];
				teamTwoReward += list[i][time]['reward'];
			}
		}
		
		
		
	}

  /**
   * Collapses all expanded countries, leaving only rows for aggregate
   * values per country.
   */
  collapseList() {
    
  }
}