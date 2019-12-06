class TimeStamp {

	constructor(){
		console.log('timeStamp');
	}
	
	updateKey(scale){
		
		let myData = [-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100];
		
		let svg = d3.select('#colorKey');
		
		let rects = svg.selectAll('g')
			.data(myData)
			.enter();
			
		let gs = rects.append('g');
		
		gs.append('rect')
			.attr('x', 5)
			.attr('y', (d,i) => i * 20)
			.attr('width', 50)
			.attr('height', 20)
			.style('fill', d => scale(d))
		;
		
		gs.append('text')
			.attr('x', 60)
			.attr('y', (d,i) => i * 20 + 15)
			.html(d => {
				if(d == 100)
					return '100% Red Team';
				else if(d == -100)
					return '100% Blue Team'
				return'' + d + '%';
			})
		;
	}
}