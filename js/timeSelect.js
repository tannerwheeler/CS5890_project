class TimeSelect{
    /**
     * Creates a Tree Object
     */
    constructor(data, table, nodeGraph, timeSeriesGraph) {
		console.log('timeSelect');
		
		this.nodeGraph = nodeGraph;
		this.table = table;
		this.data = data;
		this.timeSeriesGraph = timeSeriesGraph;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
	createSlider() {
		let input = d3.select('#slider')
			.select('input')
			.attr('max', 300)
			.attr('min', 0)
			.attr('value', 0);
		;
		
		this.nodeGraph.createGraph(this.data, 0);
		this.table.updateTable(0);
  };
}