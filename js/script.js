d3.json('data/gameData.json').then(function(data) {
	console.log(data);

	let tsg = new TimeSeriesGraph(data);
	let ts = new TimeStamp();
	let graph = new NodeGraph(data, ts);
	let table = new Table(data, graph, tsg);
	let slider = new TimeSelect(data, table, graph, tsg);

    // Create Tree Object
    // let tree = new Tree();
    // tree.createTree(csvData);

    // Create Table Object and pass in reference to tree object
    // (for hover linking)
    // let table = new Table(data,tree);

    // table.createTable();
    // table.updateTable();

	slider.createSlider();
	tsg.updateGraph('1',0,'reward');
});
