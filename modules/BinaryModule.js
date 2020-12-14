/*BINARY INPUT MODULE*/
class BinaryModule{
	constructor(uuid, lifeModule, forceVariant=false, variant=null){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		this.inputted = ""

		let words = {
			"Water":"01010101",
			"Tape":"11110000",
			"Wizard":"01001010",
			"Problem":"01000010",
			"Monster":"01011010",
			"Super":"11001011",
			"Terrible":"11001100",
			"Kangaroo":"00001111",
			"Bridge":"10010010",
			"Tripod":"00001000",
			"Glasses":"01011001",
			"Glass":"11011010",
			"Cards":"10101111",
			"Longitude":"01010000",
			"Voodoo":"11100011",
			"Ambidextrous":"00101001",
			"Flabbergasted":"11111001",
			"Vision":"00100001",
			"Follow":"11010000",
			"Ignite":"00011001"
		}

		let index = Math.floor(Math.random()*Object.keys(words).length)
		this.binary = words[Object.keys(words)[index]]
		this.word = Object.keys(words)[index]

		var BinaryModuleHTML = `
		<div class="binary-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="binary-module-container">
				<div class="binary-word-container" id="binary-word-container-${this.uuid}">
					<p>${this.word}</p>
				</div>
				<div class="binary-button-holder">
					<div class="binary-button cursor">
						<div class="binary-button-fore" onmousedown="this.style.top='6%'" onmouseup="this.style.top='0%'" onclick="activeModules[${this.uuid}].one()">
							<p class="binary-button-text">1</p>
						</div>
						<div class="binary-button-back"></div>
					</div>
					<div class="binary-button cursor">
						<div class="binary-button-fore" onmousedown="this.style.top='6%'" onmouseup="this.style.top='0%'" onclick="activeModules[${this.uuid}].zero()">
							<p class="binary-button-text">0</p>
						</div>
						<div class="binary-button-back"></div>
					</div>
				</div>
				<div class="binary-reset-btn cursor">
					<div class="binary-button-fore" onmousedown="this.style.top='10%'" onmouseup="this.style.top='0%'" onclick="activeModules[${this.uuid}].reset()">
						<p class="binary-reset-text">Reset</p>
					</div>
					<div class="binary-button-back" id="binary-reset-back"></div>
				</div>
			</div>
		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += BinaryModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML

		if(!forceVariant){
			this.variant = Math.floor(Math.random()*2) //0 for red 1 for purple.
		}else{
			this.variant = variant
		}
		if(this.variant == 1){
			document.getElementById(`binary-word-container-${this.uuid}`).style.color = "#d51ef1"
		}
		
	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		document.getElementById(`binary-word-container-${this.uuid}`).style.color = "#0fa60f"
		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	reset(){
		this.inputted = ""
	}

	zero(){
		if(this.variant == 1){
			this.inputted += "1"
		}else{
			this.inputted += "0"
		}
		this.checkMatch()
	}

	one(){
		if(this.variant == 1){
			this.inputted += "0"
		}else{
			this.inputted += "1"
		}
		this.checkMatch()
	}

	checkMatch(){
		if(this.inputted == this.binary){
			this.defuse()
		}else if(this.inputted.length == 8){
			this.lifeModule.loseLife()
			this.reset()
		}
	}
}
