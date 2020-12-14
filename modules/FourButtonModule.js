/*FOUR BUTTON MODULE*/
class FourButtonModule{
	constructor(uuid, lifeModule){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		let variants = ["symbols"]
		let index = Math.floor(Math.random()*variants.length)
		this.variant = variants[index];

		let symbolSet = Math.floor(Math.random()*4)
		switch(symbolSet){
			case 0:
				this.symbols = ["ankh","balance-scale","fire","cog","chess-pawn","tree"]
				break;
			case 1:
				this.symbols = ["dollar-sign","chess-pawn","cog","cube","ankh","dna"]
				break;
			case 2:
				this.symbols = ["crosshairs","dna","gem","dollar-sign","signature","code-branch"]
				break;
			case 3:
				this.symbols = ["cog","fire","flag-checkered","gem","code-branch","tree"]
				break;
		}

		var FourButtonModuleHTML = `
		<div class="four-button-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="four-button-buttons" id="four-buttons-button-holder-${this.uuid}"> 
			</div>

		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += FourButtonModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML


		this.symbolOrder = this.shuffle([0,1,2,3,4,5])
		for(let i=0;i<4;i++){
			document.getElementById(`four-buttons-button-holder-${this.uuid}`).innerHTML +=
		`<div class="four-button-button cursor" onclick="activeModules[${this.uuid}].buttonPress(${i})">
			<div class="four-button-fore" id="four-button-fore-${i}-${this.uuid}">
				<i class="fas fa-${this.symbols[this.symbolOrder[i]]} fa-4x four-button-symbol"></i>
			</div>
			<div class="four-button-back"></div>
			<div class="four-button-light" id="four-button-light-${i}-${this.uuid}"></div>
		</div>`
		}

		this.fourSymbols = this.symbolOrder.slice(0,4)
		this.sorted = this.sortWithIndeces(this.fourSymbols)
		this.correct = []

	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	buttonPress(i){
		if(i == this.sorted.sortIndices[this.correct.length]){
			audioManager.play("button-push-sound")

			document.getElementById(`four-button-light-${i}-${this.uuid}`).style.backgroundColor = "#09ec09"
			document.getElementById(`four-button-light-${i}-${this.uuid}`).style.top = "16px"
			document.getElementById(`four-button-fore-${i}-${this.uuid}`).style.top = "6px"
			this.correct.push(i)
			if(this.correct.length == 4){
				this.defuse()
			}
		}else{
			this.lifeModule.loseLife()
		}
		
		
		
	}

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

	sortWithIndeces(toSort) {
		for (var i = 0; i < toSort.length; i++) {
			toSort[i] = [toSort[i], i];
		}
		toSort.sort(function(left, right) {
			return left[0] < right[0] ? -1 : 1;
		});
		toSort.sortIndices = [];
		for (var j = 0; j < toSort.length; j++) {
			toSort.sortIndices.push(toSort[j][1]);
			toSort[j] = toSort[j][0];
		}
		return toSort;
	}
}