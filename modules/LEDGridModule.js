/*LED GRID MODULE*/
class LEDGridModule{
	constructor(uuid, lifeModule){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		this.stage = 1
		this.leds = []
		this.desiredVoltage = 400


		var LEDGridModuleHTML = `
		<div class="led-grid-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="led-grid-module-container">
				<div class="led-grid-stage-lights">
					<div class="led-grid-stage-light" id="led-grid-stage-light-0-${this.uuid}"></div>
					<div class="led-grid-stage-light" id="led-grid-stage-light-1-${this.uuid}"></div>
				</div>
				<div class="led-grid-main-section">
					<div class="led-grid-container">
						<div class="led-grid" id="led-grid-${this.uuid}">
						</div>
					</div>
					<div class="led-grid-voltage-selector">
						<i class="fas fa-chevron-up fa-2x cursor led-grid-inc-v-btn" id="led-grid-inc-v-btn-${this.uuid}" onclick="activeModules[${this.uuid}].increaseV()"></i> 
						<div class="led-grid-voltage-display cursor" onclick="activeModules[${this.uuid}].voltagePress()" onmousedown="this.children[0].style.top='8%'" onmouseup ="this.children[0].style.top='0%'">
							<div class="voltage-display-fore">
								<div class="voltage-display-text"><span id="voltage-${this.uuid}">0</span>V</div>
							</div>
							<div class="voltage-display-back"></div>
						</div>
						<i class="fas fa-chevron-down fa-2x cursor led-grid-dec-v-btn" id="led-grid-dec-v-btn-${this.uuid}" onclick="activeModules[${this.uuid}].decreaseV()"></i> 
					</div>
				</div>
			</div>
		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += LEDGridModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML

		this.randomiseLEDS()

		this.calcVoltage()
	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		document.getElementById(`led-grid-stage-light-1-${this.uuid}`).style.backgroundColor = "#09ec09"

		let ledGrid = document.getElementById(`led-grid-${this.uuid}`).children
		for(let i=0;i<ledGrid.length;i++){
			ledGrid[i].style.backgroundColor = "#09ec09"
		}

		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	mod(n, m) {
		return ((n % m) + m) % m;
	}

	randomiseLEDS(){
		document.getElementById(`led-grid-${this.uuid}`).innerHTML = ""
		this.leds = []
		for(let i=0;i<9;i++){
			let col = Math.floor(Math.random()*7)
			this.leds.push(col)
			switch(col){
				case 0:
					document.getElementById(`led-grid-${this.uuid}`).innerHTML += `<div class="led" style="background:#ffb347;"></div>`
					break;
				case 1:
					document.getElementById(`led-grid-${this.uuid}`).innerHTML += `<div class="led" style="background:#FF6961;"></div>`
					break
				case 2:
					document.getElementById(`led-grid-${this.uuid}`).innerHTML += `<div class="led" style="background:#AEC6CF;"></div>`
					break;
				case 3:
					document.getElementById(`led-grid-${this.uuid}`).innerHTML += `<div class="led" style="background:#b19cd9;"></div>`
					break;
				case 4: case 5: case 6:
					document.getElementById(`led-grid-${this.uuid}`).innerHTML += `<div class="led" style="background:grey;"></div>`
					break;
			}	
		}
		this.calcVoltage()
	}

	getNoOfPairs(col){
		let pairs = 0
		for(let i=0;i<this.leds.length;i++){
			pairs += Math.floor(this.numberOf(col)/2);
		}
		return pairs
	}

	totalNoOfPairs(){
		return (this.getNoOfPairs(0)+this.getNoOfPairs(1)+this.getNoOfPairs(2)+this.getNoOfPairs(3))/9
	}

	numberOf(col){
		return this.leds.filter(function(item) { return item == col; }).length
	}

	numberOfUnlit(){
		return this.numberOf(4) + this.numberOf(5) + this.numberOf(6)
	}

	calcVoltage(){
		if(this.stage == 1){
			switch(this.totalNoOfPairs()){
				case 0:
					if(this.leds.includes(0) && this.leds.includes(2)){
						this.desiredVoltage = 3
					}else if(this.leds.includes(1) && !this.leds.includes(2)){
						this.desiredVoltage = 7
					}else if(this.numberOfUnlit >= 5){
						this.desiredVoltage = 2
					}else if(this.leds[1] == 3 || this.leds[3] == 3 || this.leds[5] == 3 || this.leds[7] == 3){
						this.desiredVoltage = 9
					}else{
						this.desiredVoltage = 1
					}
					break;
				case 1:
					if(this.numberOf(1) >= 2){
						this.desiredVoltage = 4
					}else if(this.numberOf(2) >= 2 && this.numberOf(1) == 0){
						this.desiredVoltage = 11
					}else if(this.numberOf(3) >= 2){
						this.desiredVoltage = 3
					}else if(this.numberOf(1) == 0 && this.numberOf(0) == 0){
						this.desiredVoltage = 8
					}else{
						this.desiredVoltage = 5
					}
					break;
				default:
					if(this.numberOfUnlit >= 5){
						this.desiredVoltage = 11
					}else if(this.numberOf(0) >= 2){
						this.desiredVoltage = 1
					}else if(this.numberOf(1) >= 2 && this.numberOf(2) >= 2){
						this.desiredVoltage = 12
					}else if(this.numberOf(2) >= 1){
						this.desiredVoltage = 6
					}else{
						this.desiredVoltage = 7
					}
			}
		}else{
			if(this.leds[0] == this.leds[8] && this.leds[8] == this.leds[2] && this.leds[2] != 4 && this.leds[2] != 5 && this.leds[2] != 6){
				this.desiredVoltage = 4
			}else if(this.leds[2] == this.leds[6] && this.leds[6] == this.leds[8] && this.leds[8] != 4 && this.leds[8] != 5 && this.leds[8] != 6){
				this.desiredVoltage = 2
			}else if(this.leds[1] == this.leds[3] && this.leds[3] == this.leds[5] && this.leds[5] == this.leds[7] && this.leds[7] != 4 && this.leds[7] != 5 && this.leds[7] != 6){
				this.desiredVoltage = 11
			}else if(this.leds[0] == this.leds[2] && this.leds[2] == this.leds[6] && this.leds[6] != 4 && this.leds[6] != 5 && this.leds[6] != 6){
				this.desiredVoltage = 7
			}else if(this.leds[4] == this.leds[6] && this.leds[6] == this.leds[8] && this.leds[8] != 4 && this.leds[8] != 5 && this.leds[8] != 6){
				this.desiredVoltage = 6
			}else if(this.leds[0] == this.leds[4] && this.leds[4] == this.leds[6] && this.leds[6] == this.leds[6] && this.leds[6] != 4 && this.leds[6] != 5 && this.leds[6] != 6){
				this.desiredVoltage = 10
			}else if(this.leds[1] == this.leds[3] && this.leds[3] != 4 && this.leds[3] != 5 && this.leds[3] != 6){
				this.desiredVoltage = 8
			}else if(this.leds[3] == this.leds[4] && this.leds[4] != 4 && this.leds[4] != 5 && this.leds[4] != 6){
				this.desiredVoltage = 0
			}else if(this.leds[4] == this.leds[8] && this.leds[8] != 4 && this.leds[8] != 5 && this.leds[8] != 6){
				this.desiredVoltage = 3
			}else if(this.leds[0] == this.leds[2] && this.leds[2] != 4 && this.leds[2] != 5 && this.leds[2] != 6){
				this.desiredVoltage = 12
			}else if(this.leds[3] == this.leds[8] && this.leds[8] != 4 && this.leds[8] != 5 && this.leds[8] != 6){
				this.desiredVoltage = 9
			}else{
				this.desiredVoltage = 5
			}
		}
	}

	increaseV(){
		let text = document.getElementById(`voltage-${this.uuid}`);
		let newText = parseInt(text.innerHTML,10);
		text.innerHTML = newText+1
		if(text.innerHTML == 12){
			document.getElementById(`led-grid-inc-v-btn-${this.uuid}`).style.visibility = "hidden"
		}
		document.getElementById(`led-grid-dec-v-btn-${this.uuid}`).style.visibility = "visible"
	}

	decreaseV(){
		let text = document.getElementById(`voltage-${this.uuid}`);
		let newText = parseInt(text.innerHTML,10);
		text.innerHTML = newText-1
		if(text.innerHTML == 0){
			document.getElementById(`led-grid-dec-v-btn-${this.uuid}`).style.visibility = "hidden"
		}
		document.getElementById(`led-grid-inc-v-btn-${this.uuid}`).style.visibility = "visible"
	};

	voltagePress(){
		let text = document.getElementById(`voltage-${this.uuid}`);
		let V = parseInt(text.innerHTML,10);
		if(V == this.desiredVoltage){
			if(this.stage == 1){
				document.getElementById(`led-grid-stage-light-0-${this.uuid}`).style.backgroundColor = "#09ec09"
				this.stage = 2
				this.randomiseLEDS()
				this.calcVoltage()
				audioManager.play("defuse-sound")
			}else{
				this.defuse()
			}
		}else{
			this.lifeModule.loseLife()
		}
	}
}