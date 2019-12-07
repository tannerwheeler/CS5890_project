class TimeStamp {

	constructor(){
		console.log('timeStamp');
	}
	
	updateKey(scale, variable){
		
		let myData = [];
		
		if(variable == 'players')
			myData = [-100,-80,-60,-40,-20,0,20,40,60,80,100];
		else
			myData = [0,10,20,30,40,50,60,70,80,90,100];
		
		let svg = d3.select('#colorKey');
		
		svg.selectAll('text').remove();
		svg.selectAll('rect').remove();
		svg.selectAll('g').remove();
		
		let rects = svg.selectAll('g')
			.data(myData)
			.enter();
			
		let gs = rects.append('g');
		
		gs.append('rect')
			.attr('x', 5)
			.attr('y', (d,i) => i * 40)
			.attr('width', 50)
			.attr('height', 40)
			.style('fill', d => scale(d))
		;
		
		gs.append('text')
			.attr('x', 60)
			.attr('y', (d,i) => i * 40 + 25)
			.html(d => {
				if(d == 100)
					return '100% Red ' + variable;
				else if(d == -100)
					return '100% Blue ' + variable;
				if(d < 0)
					return '' + -d + '%';
				return '' + d + '%';
			})
		;
	}
}