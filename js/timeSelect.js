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
		let foo = [];

		let size = 0;

		while(size < this.data['itemData'][Object.keys(this.data['itemData'])[0]].length)
		{
			foo.push(size);
			size++;
		}

		let svg = d3.select('#barSlider');

		let bars = svg.selectAll('g')
			.data(foo)
			.enter()
		;

		let shift = 3;

		bars.append('g')
			.attr('id', d => 'mark' + d )
			.append('rect')
			.attr('x', d => d*shift + 1)
			.attr('y', 26)
			.attr('width', 3)
			.attr('height', 20)
			.on('mouseover', d => {
				let choice = d3.select('#mark' + d);

				choice.selectAll('rect')
					.attr('y', 6)
					.attr('height', 59)
				;

				choice.append('circle')
					.attr('cx', d => d*shift+1.5 )
					.attr('cy', 6)
					.attr('r', 4)
					.style('fill', 'red')
				;

				choice.append('text')
					.attr('x', d => d*shift +8)
					.attr('y', 16)
					.html(d => {
						if(d == 0)
						{
							return 'start';
						}
						else if(d == size-1)
						{
							return 'end';
						}
						else
						{
							return d;
						}

					})
				;
			})
			.on('mouseout', d => {
				let choice = d3.select('#mark' + d);

				choice.selectAll('rect')
					.attr('y', 26)
					.attr('height', 20)
				;

				choice.selectAll('circle').remove();

				choice.selectAll('text').remove();
			})
			.on('click', d => {
				d3.select('#timeSelect')
					.html('Current Simulation Time: ' + d)
				;

				this.nodeGraph.updateGraph(d, 'current');
				this.table.updateTable(d);
				this.timeSeriesGraph.updateGraph('1',d,'reward');
			})
		;

		this.nodeGraph.createGraph(0);
		this.table.updateTable(0);
  };
}
