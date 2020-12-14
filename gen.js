/*LIVES MANAGER*/
class lives{
	constructor(liveCount){
		this.lives = liveCount;
		this.livesLeft = this.lives
		for(let i=0; i<this.lives;i++){
			document.getElementById("lives").innerHTML += `<i class="fas fa-times life fa-3x" id="life-${i}"></i>`
		}
	}

	loseLife(){
		timer.speedUp()
		this.livesLeft -= 1;
		let index = this.lives - this.livesLeft -1
		if(index == this.lives-1){
			document.getElementById(`life-${index}`).style.color = "red";
		}else{
			document.getElementById(`life-${index}`).style.color = "red";
		}

		if(this.livesLeft == 0){
			this.youLoseSequence("The bomb exploded...")
		}else{
			audioManager.play("lose-life-sound")
		}
	}

	youLoseSequence(subtext){
		clearInterval(timer.audio)
		document.getElementById("you-lose-screen").style.display = "flex"
		document.getElementById("game").style.display = "none"

		audioManager.play("explosion-sound")

		let title = document.getElementById("you-lose-title")
		let titleText = "YOU LOSE!"
		title.innerHTML = ""
		title.style.visibility = "visible"
		for(let i=0;i<titleText.length;i++){
			setTimeout(() => { 
				title.innerHTML += titleText[i] 
				audioManager.play("keyboard-sound")
			}, 1500 + (i*100));
			
		}

		let sub = document.getElementById("you-lose-subtext")
		sub.innerHTML = ""
		sub.style.visibility = "visible"
		for(let i=0;i<subtext.length;i++){
			setTimeout(() => { 
				sub.innerHTML += subtext[i]
				audioManager.play("keyboard-sound")
			}, 1500 + (100*titleText.length) + 800 + (i*100)); 
			// Initial wait time + title type wait time + time between title and sub + time between sub letters
			
		}

		setTimeout(() => { 
			document.getElementById("you-lose-menu").style.visibility = "visible"
			document.getElementById("you-lose-retry-btn").style.visibility = "visible"
			document.getElementById("you-lose-menu-btn").style.visibility = "visible"
		 }, 1500 + (100*titleText.length) + 800 + (100*subtext.length) + 800); 
		// Initial wait time + title type wait time + time between title and sub + sub type time + wait between sub and button reveal
	}

	checkWin(){
		let won = true
		for(let i=0;i<activeModules.length;i++){
			if(activeModules[i].defused == 0){
				won = false
			}
		}
		if(won){
			dataLayer.push({'event': 'bomb-defused'});
			clearInterval(timer.audio)
			document.getElementById("you-win-screen").style.display = "flex"
			document.getElementById("you-win-screen").style.opacity = 1
			document.getElementById("win-screen-difficulty").innerHTML = document.getElementById("difficulty-name").innerHTML
			document.getElementById("win-screen-lives-lost").innerHTML = this.lives - this.livesLeft
			document.getElementById("win-screen-time-remaining").innerHTML = timer.getTimeLeft()
			let timeTaken = timer.getTimeTaken()
			let difficulty = document.getElementById("difficulty-name").innerHTML.toLowerCase()
			if (localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`) === null) {
				localStorage.setItem(`disarmthebomb.comfastesttime${difficulty}`,JSON.stringify(timeTaken))
			}else if(timeTaken[0] < JSON.parse(localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`))[0]){
				localStorage.setItem(`disarmthebomb.comfastesttime${difficulty}`,JSON.stringify(timeTaken))
			}else if(timeTaken[0] == JSON.parse(localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`))[0] && timeTaken[1] < JSON.parse(localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`))[1]){
				localStorage.setItem(`disarmthebomb.comfastesttime${difficulty}`,JSON.stringify(timeTaken))
			}
			updateFastestTime(difficulty)
		}
	}
}

/*TIMER*/
class Timer{
	constructor(mins,lifeModule){
		this.secondLength = 1000
		this.mins = mins
		this.initialTime = mins
		this.secs = 0 
		this.lifeModule = lifeModule
		this.updateClock();
		this.setTimer()
	}

	setTimer(){
		this.audio = setInterval(function() {this.tick()}.bind(this), this.secondLength);
	}

	tick(){
		audioManager.play("beep-sound")
		if(this.secs == 0){
			if(this.mins == 0){
				this.lifeModule.youLoseSequence("You took too long..")
			}else{
				this.mins--;
				this.secs = 59;
			}
		}else{
			this.secs--;
		}
		this.updateClock();
	}

	updateClock(){
		if(this.mins < 10){
			 this.minText = "0" + this.mins
		}else{
			this.minText = this.mins
		}
		if(this.secs < 10){
			this.secsText = "0" + this.secs
		}else{
			this.secsText = this.secs
		}

		document.getElementById("timer-text").innerHTML = this.minText + ":" + this.secsText
	}

	getTimeLeft(){
		if(this.mins != 0){
			if(this.secs == 0){
				return this.mins + " minutes "
			}else{
				return this.mins + " minutes " + this.secs + " seconds"
			}
		}else{
			return this.secs + " seconds"
		}
	}

	getTimeTaken(){
		if(this.secs == 0){
			this.secsTaken = 0
			this.mins--;
		}else{
			this.secsTaken = 60-this.secs
		}
		return [this.initialTime-this.mins-1,this.secsTaken]
	}

	speedUp(){
		if(this.secondLength == 1000){
			this.secondLength = 800
		}else if(this.secondLength == 800){
			this.secondLength = 600
		}else if(this.secondLength == 600){
			this.secondLength = 400
		}
		clearInterval(this.audio)
		this.setTimer()
	}

	isNumInTimer(x){
		return document.getElementById("timer-text").innerHTML.split("").includes(""+x)
	}
}

/*AUDIO MANAGER*/
class AudioManager{
	constructor(){
		this.mute = false
	}

	toggleMute(){
		if(this.mute){
			this.mute = false;
			document.getElementById("mute-icon-container").innerHTML = `<i class="fas fa-volume-up fa-2x cursor" id="audio-mute" onclick="audioManager.toggleMute()"></i>`
		}else{
			this.mute = true;
			document.getElementById("mute-icon-container").innerHTML = `<i class="fas fa-volume-mute fa-2x cursor" id="audio-mute" onclick="audioManager.toggleMute()"></i>`
		}
	}

	play(sound){
		if(!this.mute){
			document.getElementById(sound).currentTime = 0
			document.getElementById(sound).play()
		}
	}
}

/*INITIAL GENERATION OF BOMB*/
function genGame(){

	let difficulty = document.getElementById("difficulty-name").innerHTML.toLowerCase()

	cleanup()

	activeModules = [];
	activeLives = null;
	timer = null;

	switch(difficulty){
		case "practice":
			switch(document.getElementById("menu-practice-module").innerHTML.toLowerCase()){
				case "buttons":
					modules = ["button"]
					break;
				case "wires":
					modules = ["wires"]
					break;
				case "keypad":
					modules = ["four-button"]
					break;
				case "binary":
					modules = ["binary"]
					break;
				case "led grid":
					modules = ["led"]
					break;
				case "connections":
					modules = ["connect"]
					break;
				case "maze":
					modules = ["maze"]
					break;
			}
			activeLives = new lives(4)
			timer = new Timer(6,activeLives)
			break;
		case "easy":
			modules = ["wires","button","four-button","binary","led","connect","maze"]
			var noOfModules = 3
			activeLives = new lives(4)
			timer = new Timer(6,activeLives)
			break;
		case "normal":
			modules = ["wires","button","four-button","binary","led","connect","maze"]
			var noOfModules = 5
			activeLives = new lives(3)
			timer = new Timer(5,activeLives)
			break;
		case "hard":
			modules = ["wires","button","four-button","binary","led","connect","maze"]
			var noOfModules = 7
			activeLives = new lives(2)
			timer = new Timer(5,activeLives)
			break;
		case "insane":
			modules = ["wires","button","four-button","binary","led","connect","maze"]
			var noOfModules = 9
			activeLives = new lives(1)
			timer = new Timer(4,activeLives)
			break;
		case "custom":
			modules = ["wires","button","four-button","binary","led","connect","maze"]
			var noOfModules = parseInt(document.getElementById("menu-module-count").innerHTML.split(" ")[0])
			activeLives = new lives(parseInt(document.getElementById("menu-life-count").innerHTML.split(" ")[0]))
			timer = new Timer(parseInt(document.getElementById("menu-time-count").innerHTML.split(" ")[0]),activeLives)
	}
	if(difficulty != "practice"){
		for(let i=0; i < noOfModules; i++){
			let index = Math.floor(Math.random()*modules.length)
			var item = modules[index];
			switch(item){
				case "button":
					activeModules.push(new ButtonModule(activeModules.length, activeLives));
					break
				case "wires":
					activeModules.push(new WireModule(activeModules.length, activeLives));
					break
				case "four-button":
					activeModules.push(new FourButtonModule(activeModules.length, activeLives));
					break;
				case "binary":
					activeModules.push(new BinaryModule(activeModules.length, activeLives));
					break;
				case "led":
					activeModules.push(new LEDGridModule(activeModules.length, activeLives));
					break;
				case "connect":
					activeModules.push(new ConnectColoursModule(activeModules.length, activeLives));
					break;
				case "maze":
					activeModules.push(new MazeModule(activeModules.length, activeLives));
					break;
			}
		}
	}else{
		let index = Math.floor(Math.random()*modules.length)
		var item = modules[index];
		switch(item){
			case "button":
				activeModules.push(new ButtonModule(activeModules.length, activeLives, true, "bolts"));
				activeModules.push(new ButtonModule(activeModules.length, activeLives, true, "vowel"));
				activeModules.push(new ButtonModule(activeModules.length, activeLives, true, "rg"));
				break;
			case "wires":
				activeModules.push(new WireModule(activeModules.length, activeLives, true, 3));
				activeModules.push(new WireModule(activeModules.length, activeLives, true, 4));
				activeModules.push(new WireModule(activeModules.length, activeLives, true, 5));
				break;
			case "four-button":
				activeModules.push(new FourButtonModule(activeModules.length, activeLives));
				break;
			case "binary":
				activeModules.push(new BinaryModule(activeModules.length, activeLives, true, 0));
				activeModules.push(new BinaryModule(activeModules.length, activeLives, true, 1));
				break;
			case "led":
				activeModules.push(new LEDGridModule(activeModules.length, activeLives));
				break;
			case "connect":
				activeModules.push(new ConnectColoursModule(activeModules.length, activeLives));
				break;
			case "maze":
				activeModules.push(new MazeModule(activeModules.length, activeLives, true, 1));
				activeModules.push(new MazeModule(activeModules.length, activeLives, true, 2));
				activeModules.push(new MazeModule(activeModules.length, activeLives, true, 3));
				activeModules.push(new MazeModule(activeModules.length, activeLives, true, 4));
				break;
		}
	}
	
	document.getElementById("main-menu").style.display = "none"
	document.getElementById("lives").style.display = "flex"
	document.getElementById("lights").style.display = "flex"
	document.getElementById("game").style.display = "flex"
	document.getElementById("timer").style.display = "flex"
}

function cleanup(){
	document.getElementById("game").innerHTML = `
		<div class="x-button cursor" onclick="menu()">
			<i class="fas fa-times fa-3x" id="exit-icon"></i>
			<i class="fas fa-times fa-2x" id="exit-icon-small"></i>
		</div>`
	let boltsHTML = `<div class="bolt tl small"></div>
		<div class="bolt tr small"></div>
		<div class="bolt bl small"></div>
		<div class="bolt br small"></div>`
	document.getElementById("lives").innerHTML = boltsHTML
	document.getElementById("lights").innerHTML = boltsHTML
	for(let i=0;i<99999;i++){
		try{
			clearInterval(i)
		}catch(err){}
	}
}

//MENU CONTROL
function increaseDifficulty(){
	let name = document.getElementById("difficulty-name")
	let border = document.getElementById("difficulty-selector")
	let moduleCount = document.getElementById("menu-module-count")
	let lifeCount = document.getElementById("menu-life-count")
	let timeCount = document.getElementById("menu-time-count")
	switch(name.innerHTML){
		case "Practice":
			document.getElementById("prev-dif").style.visibility = "visible"
			document.getElementById("prev-dif-small").style.visibility = "visible"
			name.innerHTML = "Easy"
			border.style.borderColor = "#1ac31a"
			moduleCount.innerHTML = "3 Modules"
			lifeCount.innerHTML = "4 Lives"
			timeCount.innerHTML = "6 Minutes"

			lifeCount.style.display = "block"
			timeCount.style.display = "block"
			document.getElementById("menu-fastest-time").style.display = "block"
			document.getElementById("menu-practice-module-container").style.display = "none"
			document.getElementById("menu-module-preview").style.display = "none"
			//document.getElementById("difficulty-selector").style.paddingBottom = "36px"

			document.getElementById("difficulty-indicator-practice").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-practice").classList.remove("selected")

			document.getElementById("difficulty-indicator-easy").style.backgroundColor = "#1ac31a"
			document.getElementById("difficulty-indicator-easy").classList.add("selected")

			updateFastestTime("easy")
			break;
		case "Easy":
			name.innerHTML = "Normal"
			border.style.borderColor = "orange"
			moduleCount.innerHTML = "5 Modules"
			lifeCount.innerHTML = "3 Lives"
			timeCount.innerHTML = "5 Minutes"
			updateFastestTime("normal")

			document.getElementById("difficulty-indicator-easy").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-easy").classList.remove("selected")

			document.getElementById("difficulty-indicator-normal").style.backgroundColor = "orange"
			document.getElementById("difficulty-indicator-normal").classList.add("selected")
			break;
		case "Normal":
			name.innerHTML = "Hard"
			border.style.borderColor = "red"
			moduleCount.innerHTML = "7 Modules"
			lifeCount.innerHTML = "2 Lives"
			timeCount.innerHTML = "5 Minutes"
			updateFastestTime("hard")

			document.getElementById("difficulty-indicator-normal").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-normal").classList.remove("selected")

			document.getElementById("difficulty-indicator-hard").style.backgroundColor = "red"
			document.getElementById("difficulty-indicator-hard").classList.add("selected")
			break;
		case "Hard":
			name.innerHTML = "Insane"
			border.style.borderColor = "purple"
			moduleCount.innerHTML = "9 Modules"
			lifeCount.innerHTML = "1 Life"
			timeCount.innerHTML = "4 Minutes"
			updateFastestTime("insane")

			document.getElementById("difficulty-indicator-hard").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-hard").classList.remove("selected")

			document.getElementById("difficulty-indicator-insane").style.backgroundColor = "purple"
			document.getElementById("difficulty-indicator-insane").classList.add("selected")
			break;
		case "Insane":
			name.innerHTML = "Custom"
			border.style.borderColor = "#006dff"
			moduleCount.innerHTML = "1 Module"
			lifeCount.innerHTML = "1 Life"
			timeCount.innerHTML = "1 Minute"
			updateFastestTime("custom")
			document.getElementById("next-dif").style.visibility = "hidden"
			document.getElementById("next-dif-small").style.visibility = "hidden"

			let customRightArrows = document.getElementsByClassName("custom-right-arrow-menu")
			for(let i=0;i<customRightArrows.length;i++){
				customRightArrows[i].style.visibility = "visible"
			}

			document.getElementById("difficulty-indicator-insane").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-insane").classList.remove("selected")

			document.getElementById("difficulty-indicator-custom").style.backgroundColor = "#006dff"
			document.getElementById("difficulty-indicator-custom").classList.add("selected")
			break;

	}
}

function decreaseDifficulty(){
	let name = document.getElementById("difficulty-name")
	let border = document.getElementById("difficulty-selector")
	let moduleCount = document.getElementById("menu-module-count")
	let lifeCount = document.getElementById("menu-life-count")
	let timeCount = document.getElementById("menu-time-count")
	switch(name.innerHTML){
		case "Custom":
			name.innerHTML = "Insane"
			border.style.borderColor = "purple"
			moduleCount.innerHTML = "9 Modules"
			lifeCount.innerHTML = "1 Life"
			timeCount.innerHTML = "4 Minutes"
			updateFastestTime("insane")
			document.getElementById("next-dif").style.visibility = "visible"
			document.getElementById("next-dif-small").style.visibility = "visible"

			let customRightArrows = document.getElementsByClassName("custom-right-arrow-menu")
			for(let i=0;i<customRightArrows.length;i++){
				customRightArrows[i].style.visibility = "hidden"
			}

			let customLeftArrows = document.getElementsByClassName("custom-left-arrow-menu")
			for(let i=0;i<customLeftArrows.length;i++){
				customLeftArrows[i].style.visibility = "hidden"
			}

			document.getElementById("difficulty-indicator-custom").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-custom").classList.remove("selected")

			document.getElementById("difficulty-indicator-insane").style.backgroundColor = "purple"
			document.getElementById("difficulty-indicator-insane").classList.add("selected")
			break;
		case "Insane":
			name.innerHTML = "Hard"
			border.style.borderColor = "red"
			moduleCount.innerHTML = "7 Modules"
			lifeCount.innerHTML = "2 Lives"
			timeCount.innerHTML = "5 Minutes"
			updateFastestTime("hard")

			document.getElementById("difficulty-indicator-insane").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-insane").classList.remove("selected")

			document.getElementById("difficulty-indicator-hard").style.backgroundColor = "red"
			document.getElementById("difficulty-indicator-hard").classList.add("selected")
			break;
		case "Hard":
			name.innerHTML = "Normal"
			border.style.borderColor = "orange"
			moduleCount.innerHTML = "5 Modules"
			lifeCount.innerHTML = "3 Lives"
			timeCount.innerHTML = "5 Minutes"
			updateFastestTime("normal")

			document.getElementById("difficulty-indicator-hard").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-hard").classList.remove("selected")

			document.getElementById("difficulty-indicator-normal").style.backgroundColor = "orange"
			document.getElementById("difficulty-indicator-normal").classList.add("selected")
			break;
		case "Normal":
			name.innerHTML = "Easy"
			border.style.borderColor = "#1ac31a"
			moduleCount.innerHTML = "3 Modules"
			lifeCount.innerHTML = "4 Lives"
			timeCount.innerHTML = "6 Minutes"
			updateFastestTime("easy")

			document.getElementById("difficulty-indicator-normal").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-normal").classList.remove("selected")

			document.getElementById("difficulty-indicator-easy").style.backgroundColor = "#1ac31a"
			document.getElementById("difficulty-indicator-easy").classList.add("selected")
			break;
		case "Easy":
			name.innerHTML = "Practice"
			border.style.borderColor = "#71d2f2"
			lifeCount.style.display = "none"
			timeCount.style.display = "none"
			document.getElementById("menu-fastest-time").style.display = "none"
			document.getElementById("prev-dif").style.visibility = "hidden"
			document.getElementById("prev-dif-small").style.visibility = "hidden"
			document.getElementById("menu-practice-module-container").style.display = "flex"
			document.getElementById("menu-module-preview").style.display = "block"
			document.getElementById("difficulty-selector").style.paddingBottom = "0px"

			document.getElementById("difficulty-indicator-easy").style.backgroundColor = "grey"
			document.getElementById("difficulty-indicator-easy").classList.remove("selected")

			document.getElementById("difficulty-indicator-practice").style.backgroundColor = "#71d2f2"
			document.getElementById("difficulty-indicator-practice").classList.add("selected")

			try{
				let variants = levels[Object.keys(levels)[this.newPracticeIndex]]["variants"]
				if(variants == 1){
					document.getElementById("menu-module-count").innerHTML = "1 Variant"
				}else{
					document.getElementById("menu-module-count").innerHTML = variants + " Variants"
				}
			}catch(err){
				document.getElementById("menu-module-count").innerHTML = 3 + " Variants"
			}
			break;

	}
}

function changePractice(change){
	let currentPractice = Object.keys(levels).indexOf(document.getElementById("menu-practice-module").innerHTML)
	this.newPracticeIndex = currentPractice + change
	document.getElementById("menu-practice-module").innerHTML = Object.keys(levels)[newPracticeIndex]
	document.getElementById("menu-module-preview").src = "imgs/" + levels[Object.keys(levels)[newPracticeIndex]]["src"]

	if(this.newPracticeIndex == Object.keys(levels).length-1){
		document.getElementById("next-prac").style.visibility = "hidden"
	}else{
		document.getElementById("next-prac").style.visibility = "visible"
	}
	if(this.newPracticeIndex == 0){
		document.getElementById("prev-prac").style.visibility = "hidden"
	}else{
		document.getElementById("prev-prac").style.visibility = "visible"
	}

	let variants = levels[Object.keys(levels)[this.newPracticeIndex]]["variants"]
	if(variants == 1){
		document.getElementById("menu-module-count").innerHTML = "1 Variant"
	}else{
		document.getElementById("menu-module-count").innerHTML = variants + " Variants"
	}
}

function changeModuleCount(change){
	let moduleText = document.getElementById("menu-module-count")
	let moduleCount = parseInt(moduleText.innerHTML.split(" ")[0])
	moduleCount += change;
	if(moduleCount == 50){
		moduleText.innerHTML = moduleCount + " Modules"
		document.getElementById("next-mod").style.visibility = "hidden"
	}else if(moduleCount != 1){
		moduleText.innerHTML = moduleCount + " Modules"
		document.getElementById("prev-mod").style.visibility = "visible"
		document.getElementById("next-mod").style.visibility = "visible"

	}else{
		moduleText.innerHTML = moduleCount + " Module"
		document.getElementById("prev-mod").style.visibility = "hidden"
		document.getElementById("next-mod").style.visibility = "visible"
	}
}

function changeLifeCount(change){
	let lifeText = document.getElementById("menu-life-count")
	let lifeCount = parseInt(lifeText.innerHTML.split(" ")[0])
	lifeCount += change;
	if(lifeCount == 20){
		lifeText.innerHTML = lifeCount + " Lives"
		document.getElementById("next-life").style.visibility = "hidden"
	}else if(lifeCount != 1){
		lifeText.innerHTML = lifeCount + " Lives"
		document.getElementById("prev-life").style.visibility = "visible"
		document.getElementById("next-life").style.visibility = "visible"
	}else{
		lifeText.innerHTML = lifeCount + " Life"
		document.getElementById("prev-life").style.visibility = "hidden"
		document.getElementById("next-life").style.visibility = "visible"
	}
}

function changeTimeCount(change){
	let timeText = document.getElementById("menu-time-count")
	let timeCount = parseInt(timeText.innerHTML.split(" ")[0])
	timeCount += change;
	if(timeCount == 60){
		timeText.innerHTML = timeCount + " Minutes"
		document.getElementById("next-time").style.visibility = "hidden"
	}else if(timeCount != 1){
		timeText.innerHTML = timeCount + " Minutes"
		document.getElementById("prev-time").style.visibility = "visible"
		document.getElementById("next-time").style.visibility = "visible"
	}else{
		timeText.innerHTML = timeCount + " Minute"
		document.getElementById("prev-time").style.visibility = "hidden"
		document.getElementById("next-time").style.visibility = "visible"
	}
}

function updateFastestTime(difficulty){
	if (localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`) === null) {
		document.getElementById("menu-fastest-text").innerHTML = "None" 
	}else{
		let timeTaken = JSON.parse(localStorage.getItem(`disarmthebomb.comfastesttime${difficulty}`))

		if(timeTaken[0] != 0){
			if(timeTaken[1] == 0){
				document.getElementById("menu-fastest-text").innerHTML =  timeTaken[0] + "m "
			}else{
				document.getElementById("menu-fastest-text").innerHTML =  timeTaken[0] + "m " + timeTaken[1] + "s"
			}
		}else{
			document.getElementById("menu-fastest-text").innerHTML =  timeTaken[1] + "s"
		}
	}	
}

function openHowToPlay(){
	document.getElementById("how-to-play-page").style.display = "flex"
}

function closeHowToPlay(){
	document.getElementById("how-to-play-page").style.display = "none"
}

/*YOU LOSE SCREEN*/
function retry(){
	hideYouLoseScreen()
	hideYouWinScreen()
	genGame()
}
function menu(){
	hideYouWinScreen()
	hideYouLoseScreen()
	document.getElementById("main-menu").style.display = "flex"
	document.getElementById("lives").style.display = "none"
	document.getElementById("lights").style.display = "none"
	document.getElementById("game").style.display = "none"
	clearInterval(timer.audio)
	document.getElementById("timer").style.display = "none"
}
function hideYouLoseScreen(){
	document.getElementById("you-lose-screen").style.display = "none"
	document.getElementById("you-lose-menu").style.visibility = "hidden"
	document.getElementById("you-lose-retry-btn").style.visibility = "hidden"
	document.getElementById("you-lose-menu-btn").style.visibility = "hidden"
	document.getElementById("you-lose-subtext").style.visibility = "hidden"
	document.getElementById("you-lose-title").style.visibility = "hidden"
}
function hideYouWinScreen(){
	setTimeout(() => { document.getElementById("you-win-screen").style.display = "none" }, 300);
	document.getElementById("you-win-screen").style.opacity = 0
}


audioManager = new AudioManager();

levels = {
	"Buttons":{
		"src":"Buttons.png",
		"variants":3
	},
	"Wires":{
		"src":"wires.png",
		"variants":3
	},
	"Keypad":{
		"src":"keypad.png",
		"variants":1
	},
	"Binary":{
		"src":"Binary.png",
		"variants":2
	},
	"LED Grid":{
		"src":"led.png",
		"variants":1
	},
	"Connections":{
		"src":"connect.png",
		"variants":1
	},
	"Maze":{
		"src":"maze.png",
		"variants":4
	}
}