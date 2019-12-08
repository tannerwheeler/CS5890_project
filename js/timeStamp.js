class TimeStamp {

	constructor(){
		console.log('timeStamp');
	}
	
	updateKey(scale, variable){
		
		let myData = [];
		let size = 40;
		
		if(variable == 'players')
		{
			myData = [-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60,70,80,90,100];
			size = 20;
		}
		else
		{
			myData = [0,10,20,30,40,50,60,70,80,90,100];
		}
		
		let svg = d3.select('#colorKey');
		
		svg.selectAll('text').remove();
		svg.selectAll('rect').remove();
		svg.selectAll('g').remove();
		
		svg.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -300)
			.attr('y', 50)
			.html(d => {
				if(variable == 'players')
				{
					return 'Percentage of Team Edge Possession';
				}
				else
				{
					return 'Percentage of team ' + variable;
				}
			})
		;
		
		let rects = svg.selectAll('g')
			.data(myData)
			.enter();
			
		let gs = rects.append('g');
		
		gs.append('rect')
			.attr('x', 150)
			.attr('y', (d,i) => i * size)
			.attr('width', 50)
			.attr('height', size)
			.style('fill', d => scale(d))
		;
		
		gs.append('text')
			.attr('x', d => {
				if(d != 100 && d != -100)
					return 115;
				else
					return 20;
			})
			.attr('y', (d,i) => i * size + size/2 + 5)
			.html(d => {
				if(variable == 'players')
				{
					if(d == 100)
						return '100% more Red ';
					else if(d == -100)
						return '100% more Blue ';
					if(d < 0 && d % 20 == 0)
						return '' + -d + '%';
				}
				else
				{
					if(d == 100)
						return '100% Team ' + variable;
				}
				
				if(d % 20 == 0)
					return '' + d + '%';
				
				return '';
			})
		;
	}
}