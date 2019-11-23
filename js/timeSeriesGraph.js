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
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateFirstGraph(time, attribute) {
	  //updateGraph(/*firstGraph ID*/, time, attribute);
	  console.log('firstGraph');
  }
  
  updateSecondGraph(time, attribute) {
	  //updateGraph(/*secondGraph ID*/, time, attribute);
	  console.log('secondGraph');
  }
  
  updateGraph(svgID, time, attribute) {
	  // update graphs with specific id
  }
}