/** Class implementing the table. */
class TimeSeriesGraph {
  /**
   * Creates a Table Object
   */
  constructor(graphData) {
	  console.log('tsg');
	// Create a common scale for both graphs
	this.data = graphData;
  };

  /**
   * TODO: add axis labels
   * TODO: add legend of some sort
   * TODO: generalize functions and code to be reused in second figure
   * TODO: decrease cyclomatic complexity by breaking into sub-functions
   * TODO: add indicator of which time step was passed in
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateFirstGraph(time, attribute) {

    //define positional parameters
    let svgHeight = 300;
    let svgWidth = 1000;
    let yAxisWidth = 75;
    let xAxisHeight = 20;
    let xAxisWidth = svgWidth - yAxisWidth - 25;
    let height = svgHeight - 50;
    let axisBuffer = 10;
    let nTicks = 36;

    //define data driven parameters and structures
    let playerData = this.data['playerData'];
    let nRounds = playerData[Object.keys(playerData)[0]].length;
    let nPlayers = Object.keys(playerData).length;

    //separate keys for player teams
    let keys1 = new Array();
    let keys2 = new Array();
    let keys = Object.keys(playerData);
    for(let i=0; i<nPlayers; i++)
    {
      if(i===0)
      {
        keys1.push(keys[i]);
      }
      else
      {
        if(playerData[keys[i]] === playerData[keys1[0]])
        {
          keys1.push(keys[i]);
        }
        else
        {
          keys2.push(keys[i]);
        }
      }
    }

    //define team dependent variables
    let nTeam1= keys1.length;
    let nTeam2 = keys2.length;
    let attributeData1 = new Array(nRounds);
    let attributeData2 = new Array(nRounds);


    //extract team statistics
    for(let i=0; i<nRounds; i++)
    {
      attributeData1[i] = 0;
      for(let j=0; j<nTeam1; j++)
      {
        let player = playerData[keys1[j]];
        attributeData1[i] = attributeData1[i] + player[i][attribute];
      }

      attributeData2[i] = 0;
      for(let j=0; j<nTeam2; j++)
      {
        let player = playerData[keys2[j]];
        attributeData2[i] = attributeData2[i] + player[i][attribute];
      }

    }

    //remove previous graph
    d3.select("#timeSeriesGraph1").selectAll("svg").remove();

    //create new svg
    let svg = d3.select("#timeSeriesGraph1")
      .append("svg")
      .attr("width",svgWidth)
      .attr("height",svgHeight);

    //define x scale
    let tickDiff = Math.floor(nRounds/nTicks);
    let tickLoc = d3.range(0, nRounds,tickDiff);
    let xScale = d3.scaleBand()
      .domain(d3.range(0,nRounds))
      .range([0, xAxisWidth])
      .padding(0.25);

    //define x axis
    let xAxis = d3.axisBottom(xScale)
      .tickValues(tickLoc);

    //define y scale
    let maxVal = d3.max([d3.max(attributeData1),d3.max(attributeData2)]);
    let yScale = d3.scaleLinear()
      .domain([0,maxVal])
      .range([height, 0]);

    //define y axis
    let yAxis = d3.axisLeft(yScale);

    //show x axis
    let xAxisGroup = svg.append("g")
      .attr('transform',`translate(${yAxisWidth + axisBuffer}, ${height + xAxisHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform","translate(0,5)rotate(0)");

    //show y axis
    svg.append("g")
      .attr('transform',`translate(${yAxisWidth},${axisBuffer})`)
      .call(yAxis);

    //define line parameters
    let line = d3.line()
      .x(function(d,i){return xScale(i) + yAxisWidth + axisBuffer;})
      .y(function(d){return yScale(d) + xAxisHeight - axisBuffer;})
      .curve(d3.curveMonotoneX);

    //plot team 1 data
    svg.append("path")
      .datum(attributeData1)
      .attr("fill","none")
      .attr("stroke","steelblue")
      .attr("stroke-width",1.5)
      .attr("d",line);


    //plot team 2 data
    svg.append("path")
      .datum(attributeData2)
      .attr("fill","none")
      .attr("stroke","red")
      .attr("stroke-width",1.5)
      .attr("d",line);
  }

  updateSecondGraph(time, attribute) {
	  //updateGraph(/*secondGraph ID*/, time, attribute);
	  console.log('secondGraph');
  }

  updateGraph(svgID, time, attribute) {
    this.updateFirstGraph(time,attribute);
	  // update graphs with specific id
  }
}
