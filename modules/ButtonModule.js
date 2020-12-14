/*BUTTON MODULE*/
class ButtonModule{
	constructor(uuid, lifeModule, forceVariant=false, variant=null){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		if(!forceVariant){
			this.variants = ["bolts","vowel","rg"]
			//Ensure that the number variant only appears once
			for(let i=0;i<activeModules.length;i++){
				if(activeModules[i].constructor.name == "ButtonModule"){
					if(activeModules[i].variant == "number"){
						this.variants = this.variants.filter(function(value, index, arr){ return value != "number";});
					}
				}
			}

			let index = Math.floor(Math.random()*this.variants.length) /*Choose a random variant for the module */
			this.variant = this.variants[index];
		}else{
			this.variant = variant
		}
		
		if(this.variant == "number"){
			this.chosenNum = Math.floor(Math.random()*9)
			document.getElementById("title").innerHTML = this.chosenNum + ".DisarmTheBomb.com"
			var buttonModuleHTML = `
			<div class="button-module module" id="module-${this.uuid}">
				<div class="win-cover" id="win-cover-${this.uuid}"></div>
				<div class="bolt tl" id="bolt-1-${this.uuid}"></div>
				<div class="bolt tr" id="bolt-2-${this.uuid}"></div>
				<div class="bolt bl" id="bolt-3-${this.uuid}"></div>
				<div class="bolt br" id="bolt-4-${this.uuid}"></div>
				<div class="button">
					<div class="circle cursor button-red" onmouseenter="activeModules[${this.uuid}].buttonRandomText()" onmouseleave="activeModules[${this.uuid}].buttonClearText()" onclick="activeModules[${this.uuid}].buttonNumberPress()">
						<p id="button-text-${this.uuid}">Why Not?</p>
					</div>
					<div class="circle cursor button-red-background c-background"></div>
				</div>
			</div>`
		}
		if (this.variant == "bolts"){
			this.order = this.shuffle([1,2,3,4]);
			this.clickOrder = [];
			var buttonModuleHTML = `
			<div class="button-module module" id="module-${this.uuid}">
				<div class="win-cover" id="win-cover-${this.uuid}"></div>
				<div class="bolt tl cursor button-bolts-bolt" id="bolt-1-${this.uuid}" onclick=activeModules[${this.uuid}].boltBoltPress(1,this)></div>
				<div class="bolt tr cursor button-bolts-bolt" id="bolt-2-${this.uuid}" onclick=activeModules[${this.uuid}].boltBoltPress(2,this)></div>
				<div class="bolt bl cursor button-bolts-bolt" id="bolt-3-${this.uuid}" onclick=activeModules[${this.uuid}].boltBoltPress(3,this)></div>
				<div class="bolt br cursor button-bolts-bolt" id="bolt-4-${this.uuid}" onclick=activeModules[${this.uuid}].boltBoltPress(4,this)></div>
				<div class="button">
					<div class="circle cursor button-blue" onclick="activeModules[${this.uuid}].buttonBoltPress()">
						<p id="button-text-${this.uuid}">You Sure?</p>
					</div>
					<div class="circle cursor button-blue-background c-background"></div>
				</div>
			</div>`
		}
		if (this.variant == "vowel"){
			this.timer = null;
			this.words = ["America","Picture","Amazing","Nothing","Imagine","Nuclear","Uniform","Purpose","Example","Program","Endless","Gravity"]

			for(let i=0;i<activeModules.length;i++){
				if(activeModules[i].constructor.name == "ButtonModule"){
					if(activeModules[i].variant == "vowel"){
						this.words = this.words.filter(function(value, index, arr){ return value != activeModules[i].word;});
						if(this.words == []){
							this.variant = "rg"
						}
					}
				}
			}
		}
		if (this.variant == "vowel"){
			let index = Math.floor(Math.random()*this.words.length) /*Choose a random variant for the module */
			this.word = this.words[index];

			var buttonModuleHTML = `
			<div class="button-module module" id="module-${this.uuid}">
				<div class="win-cover" id="win-cover-${this.uuid}"></div>
				<div class="bolt tl" id="bolt-1-${this.uuid}"></div>
				<div class="bolt tr" id="bolt-2-${this.uuid}"></div>
				<div class="bolt bl" id="bolt-3-${this.uuid}"></div>
				<div class="bolt br" id="bolt-4-${this.uuid}"></div>
				<div class="button">
					<div class="circle cursor button-green" onmousedown="activeModules[${this.uuid}].vowelStart()" onmouseup="activeModules[${this.uuid}].vowelEnd()">
						<p id="button-text-${this.uuid}">${this.word}</p>
					</div>
					<div class="circle cursor button-green-background c-background"></div>
				</div>
				<div class="progress-bar" id="progress-bar-${this.uuid}">
					<div class="progress-bar-bar" id="progress-bar-bar-${this.uuid}">
				</div>
			</div>`
		}
		if (this.variant == "rg"){
			this.color = "r"
			this.colorTimer = setInterval(this.colorEvent.bind(this),(Math.floor(Math.random() * (14 - 6 + 1)) + 8 )* 1000);;
			var buttonModuleHTML = `
			<div class="button-module module" id="module-${this.uuid}">
				<div class="win-cover" id="win-cover-${this.uuid}"></div>
				<div class="bolt tl" id="bolt-1-${this.uuid}"></div>
				<div class="bolt tr" id="bolt-2-${this.uuid}"></div>
				<div class="bolt bl" id="bolt-3-${this.uuid}"></div>
				<div class="bolt br" id="bolt-4-${this.uuid}"></div>
				<div class="button">
					<div class="circle cursor button-red" id="button-${this.uuid}" onclick="activeModules[${this.uuid}].buttonPressColor()">
					</div>
					<div class="circle cursor button-red-background c-background" id="button-background-${this.uuid}"></div>
				</div>
			</div>`
		}

		this.defused = 0
		document.getElementById("game").innerHTML += buttonModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML
	}

	getBolts(){
		return [document.getElementById(`bolt-1-${this.uuid}`),document.getElementById(`bolt-2-${this.uuid}`),document.getElementById(`bolt-3-${this.uuid}`),document.getElementById(`bolt-4-${this.uuid}`)]
	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		this.valid = 1
		this.defused = 1
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		let bolts = this.getBolts()
		for(let i=0; i<bolts.length; i++){
			bolts[i].style.background = "#09ec09";
		}
		audioManager.play("defuse-sound")
		this.lifeModule.checkWin()
		try{
			clearInterval(this.colorTimer);
		}catch(err){}
		
	}

	/*Number variant*/
	buttonRandomText(){
		this.buttonChosenNum = (Math.floor(Math.random() * 10) + 1) % 9
		document.getElementById(`button-text-${this.uuid}`).innerHTML = "Why N"+ this.buttonChosenNum+"t?"
	}

	buttonClearText(){
		document.getElementById(`button-text-${this.uuid}`).innerHTML = "Why Not?"
	}

	buttonNumberPress(){
		if(this.chosenNum == this.buttonChosenNum){
			this.defuse()
		}else{
			this.lifeModule.loseLife()
		}
	}

	/*Bolts Variant*/
	shuffle(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	}

	boltBoltPress(i,bolt){
		if(i == this.order[this.clickOrder.length]){
			bolt.style.background = "orange"
			this.clickOrder.push(i);
		}else{
			this.clickOrder = [];
			let bolts = this.getBolts()
			for(let i=0; i<bolts.length; i++){
				bolts[i].style.background = "#AAAAAA"
			}
		}
	}

	buttonBoltPress(){
		let bolts = this.getBolts()
		if(this.clickOrder.length == 4){
			this.defuse()
		}else{
			this.lifeModule.loseLife()
		}
	}

	/*Vowel Varient*/

	vowelStart(){
		this.vowelProgressReset()
		this.barLength = 0;
		this.timer = setInterval(this.vowelProgressIncrease.bind(this),10);
	}

	vowelEnd(){
		clearInterval(this.timer)
		if(["A","E","I","O","U"].includes(this.word[0])){
			if(this.barLength == 100){
				this.defuse()
				this.bar.style.backgroundColor = "#09ec09"
			}else{
				this.lifeModule.loseLife()
			}
		}else{
			if(this.barLength == 100){
				this.lifeModule.loseLife()
			}else{
				this.defuse()
				this.bar.style.backgroundColor = "#09ec09"
			}
		}
	}

	vowelProgressIncrease(){
		if(this.barLength != 100){
			this.barLength ++;
			this.bar.style.width = `${this.barLength}%`
		}
	}

	vowelProgressReset(){
		this.bar = document.getElementById(`progress-bar-bar-${this.uuid}`)
		this.bar.style.width = "0%"
		this.bar.style.backgroundColor = "orange"
	}

	/*Rg Varient*/

	colorEvent(){
		this.switchColor()
		this.setGreenTimer = setTimeout(this.switchColor.bind(this),2000);
	}

	switchColor(){
		let button = document.getElementById(`button-${this.uuid}`)
		let background = document.getElementById(`button-background-${this.uuid}`)
		try {
			if(this.color == "r"){
				this.color = "g"
				button.classList.remove("button-red")
				background.classList.remove("button-red-background")
				button.classList.add("button-green")
				background.classList.add("button-green-background")
			}else{
				this.color = "r"
				button.classList.add("button-red")
				background.classList.add("button-red-background")
				button.classList.remove("button-green")
				background.classList.remove("button-green-background")
			}
		}catch (e) {}
	}

	buttonPressColor(){
		if(this.color == "g"){
			clearInterval(this.colorTimer);
			clearTimeout(this.setGreenTimer);
			this.defuse();
		}else{
			this.lifeModule.loseLife();
		}
		
	}
}