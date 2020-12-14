class ConnectColoursModule{
	constructor(uuid, lifeModule){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		this.selected = 0

		this.wireLookup={1:[32,40],2:[32,120],3:[32,200],4:[32,280],5:[288,40],6:[288,120],7:[288,200],8:[288,280]}
		this.lines = []

		//

		var ConnectColoursModuleHTML = `
		<div class="connect-colours-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="connect-colours-container">
				<div class="connect-colours-slot-section connect-colours-section-left" id="connect-colours-section-0-${this.uuid}"></div>
				<div class="connect-colours-slot-section connect-colours-section-right" id="connect-colours-section-1-${this.uuid}"></div>
				<div class="connect-colours-back cursor" onclick="activeModules[${this.uuid}].resetLines()"><i class="fas fa-undo fa-2x"></i></div>
				<div class="connect-colours-check cursor" onclick="activeModules[${this.uuid}].check()"><i class="fas fa-check fa-2x"></i></div>
				<canvas class="connect-colours-canvas" id="connect-colours-canvas-${this.uuid}"></canvas>
			</div>
		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += ConnectColoursModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML

		this.colours = []
		this.options = ["#ffb347","#ff6961","#aec6cf","#b19cd9"]
		for(let i=0;i<8;i++){
			let colour = Math.floor(Math.random()*this.options.length)
			this.colours.push(this.options[colour])
		}

		for(let i=1;i<5;i++){
			document.getElementById(`connect-colours-section-0-${this.uuid}`).innerHTML += `<div class="connect-colours-wire-slot cursor" id="connect-colours-slot-${this.uuid}-${i}" style="background:${this.colours[i-1]};" onclick="activeModules[${this.uuid}].slotClick(${i})"></div>`
		}
		for(let i=5;i<9;i++){
			document.getElementById(`connect-colours-section-1-${this.uuid}`).innerHTML += `<div class="connect-colours-wire-slot cursor" id="connect-colours-slot-${this.uuid}-${i}" style="background:${this.colours[i-1]};" onclick="activeModules[${this.uuid}].slotClick(${i})"></div>`
		}

		this.calcCorrect()
	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		//this.colours = ["#09ec09","#09ec09","#09ec09","#09ec09","#09ec09","#09ec09","#09ec09","#09ec09"]
		//this.drawLines()
		for(let i=1;i<9;i++){
			document.getElementById(`connect-colours-slot-${this.uuid}-${i}`).style.backgroundColor = "#09ec09"
		}
		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	slotClick(i){
		if([0,1,2,3,4].includes(i)){
			if(this.selected == i){
				this.resetSelected()
				this.selected = 0
			}else{
				this.selected = i
				for(let x=0;x<4;x++){
					let y = x+1
					if(y == this.selected){
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.border = "2px solid grey"
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.width =  "26px"
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.height = "26px"
					}else{
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.border = "none"
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.width =  "30px"
						document.getElementById(`connect-colours-slot-${this.uuid}-${y}`).style.height = "30px"
					}
				}
			}
		}else{
			if(this.selected != 0){
				this.connectSlots(this.selected,i)
				this.selected = 0
				this.resetSelected()
			}
		}
	}

	connectSlots(a,b){
		let index = this.isInLines(a,b)
		if(index != -1){
			this.lines.splice(index,1)
		}else{
			this.lines.push([a,b])
		}
		this.drawLines()
	}

	resetSelected(){
		for(let x=1;x<5;x++){
			document.getElementById(`connect-colours-slot-${this.uuid}-${x}`).style.border = "none"
			document.getElementById(`connect-colours-slot-${this.uuid}-${x}`).style.width =  "30px"
			document.getElementById(`connect-colours-slot-${this.uuid}-${x}`).style.height = "30px"
		}
	}

	drawLines(){
		var c = document.getElementById(`connect-colours-canvas-${this.uuid}`);
		var ctx = c.getContext("2d");
		c.width = 320;
        c.height = 320;
		for(let i=0;i<this.lines.length;i++){
			ctx.beginPath();
        	ctx.lineWidth = 10;
	        var gradient = ctx.createLinearGradient(0, 0, 320, 0);
			gradient.addColorStop("0.2", this.colours[this.lines[i][0]-1]);
			gradient.addColorStop("0.8", this.colours[this.lines[i][1]-1]);
			ctx.strokeStyle = gradient;
			ctx.moveTo(this.wireLookup[this.lines[i][0]][0], this.wireLookup[this.lines[i][0]][1]);
			ctx.lineTo(this.wireLookup[this.lines[i][1]][0], this.wireLookup[this.lines[i][1]][1]);
			ctx.stroke();
		}
	}

	isInLines(a,b){
		for(let i = 0;i<this.lines.length;i++){
			if(JSON.stringify(this.lines[i]) === JSON.stringify([a,b])){
				return i
			}
		}
		return -1
	}

	resetLines(){
		this.lines = []
		this.drawLines()
		this.selected = 0
		this.resetSelected()
	}

	check(){
		if(JSON.stringify(this.lines.sort()) == JSON.stringify(this.correct.sort())){
			this.defuse()
		}else{
			this.lifeModule.loseLife()
		}
	}

	calcCorrect(){
		if(this.colours[0] == this.colours[2]){
			this.correct = [[4,5]]
		}else if(this.colours[2] == "#aec6cf"){
			this.correct = [[2,8],[3,6]]
		}else if(this.colours[1] == this.colours[4] || this.colours[1] == this.colours[5]){
			this.correct = [[1,6],[1,7]]
		}else if(this.colours[0] == "#ffb347"){
			this.correct = [[2,7],[4,7]]
		}else if(new Set([this.colours[0],this.colours[1],this.colours[2],this.colours[3]]).length == [this.colours[0],this.colours[1],this.colours[2],this.colours[3]].length){
			this.correct = [[3,7],[4,5]]
		}else if(new Set([this.colours[4],this.colours[5],this.colours[6],this.colours[7]]).length == [this.colours[4],this.colours[5],this.colours[6],this.colours[7]].length){
			this.correct = [[2,6],[3,7],[1,8]]
		}else if([this.colours[4],this.colours[5],this.colours[6],this.colours[7]].includes("#b19cd9")){
			this.correct = [[2,5]]
		}else if([this.colours[0],this.colours[1],this.colours[2],this.colours[3]].includes("#ff6961")){
			this.correct=[[4,7],[1,5]]
		}else{
			this.correct = [[3,6],[1,6],[2,5]]
		}
	}
}
