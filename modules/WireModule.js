/*WIRE MODULE*/
class WireModule{
	constructor(uuid, lifeModule, forceVariant=false, variant=null){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		if(!forceVariant){
			let variants = [3,4,5]
			let index = Math.floor(Math.random()*variants.length)
			this.variant = variants[index];
		}else{
			this.variant = variant
		}
		

		this.wires = []
		this.wireCols = []
		this.cut = []
		for(let i=0;i<this.variant;i++){
			let col = Math.floor(Math.random()*5+1)
			switch(col){
				case 1:
					this.wires.push(`<img class="wire cursor" id="wire-${this.uuid}-${i}" src="imgs/red-wire.svg" onclick="activeModules[${this.uuid}].cutWire(${i})">`)
					break;
				case 2:
					this.wires.push(`<img class="wire cursor" id="wire-${this.uuid}-${i}" src="imgs/blue-wire.svg" onclick="activeModules[${this.uuid}].cutWire(${i})">`)
					break;
				case 3:
					this.wires.push(`<img class="wire cursor" id="wire-${this.uuid}-${i}" src="imgs/black-wire.svg" onclick="activeModules[${this.uuid}].cutWire(${i})">`)
					break;
				case 4:
					this.wires.push(`<img class="wire cursor" id="wire-${this.uuid}-${i}" src="imgs/white-wire.svg" onclick="activeModules[${this.uuid}].cutWire(${i})">`)
					break;
				case 5:
					this.wires.push(`<img class="wire cursor" id="wire-${this.uuid}-${i}" src="imgs/purple-wire.svg" onclick="activeModules[${this.uuid}].cutWire(${i})">`)
			}
			this.wireCols.push(col)
		}

		var wireModuleHTML = `
		<div class="wire-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="wire-module-background" id="wire-bg-left-${this.uuid}"></div>
			<div class="wire-module-background" id="wire-bg-right-${this.uuid}"></div>
			<div class="wires" id="wires-${this.uuid}"></div>
		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += wireModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML

		for(let i=0;i<this.wires.length;i++){
			let slot = `<div class="wire-slot slots-${this.uuid}"></div>`
			document.getElementById(`wires-${this.uuid}`).innerHTML += this.wires[i]
			document.getElementById(`wire-bg-left-${this.uuid}`).innerHTML += slot
			document.getElementById(`wire-bg-right-${this.uuid}`).innerHTML += slot
		}

		this.determineCutOrder()

	}

	defuse(){
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		let slots = document.getElementsByClassName(`slots-${this.uuid}`)
		for(let i=0; i<slots.length; i++){
			slots[i].style.background = "#09ec09";
		}
		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	cutWire(i){
		let wire = document.getElementById(`wire-${this.uuid}-${i}`)
		let splitPath = wire.src.split("/")
		if (!splitPath[splitPath.length-1].includes("-cut")){
			wire.src = "imgs/"+splitPath[splitPath.length-1].substring(0,splitPath[splitPath.length-1].length-4) + "-cut" + splitPath[splitPath.length-1].substring(splitPath[splitPath.length-1].length-4,splitPath[splitPath.length-1].length)
			audioManager.play("wire-cut-sound")
			if(this.toCut.includes(i)){
				this.cut.push(i)
				if(this.cut.length == this.toCut.length){
					this.defuse()
				}
			}else{
				this.lifeModule.loseLife()
			}
		}

	}

	determineCutOrder(){
		this.toCut = []
		switch(this.variant){
			case 3:
				if(this.howManyOfWire(1) == 2){
					this.toCut = [0]
				}else if(this.wireCols[this.wireCols.length-1] == 4 || this.wireCols[this.wireCols.length-1] == 5){
					this.toCut = [2]
				}else if(this.howManyOfWire(3) == this.howManyOfWire(2) && this.howManyOfWire(2) != 0){
					this.toCut = [this.whereIsWire(2)[0],this.whereIsWire(3)[0]]
				}else if(this.howManyOfWire(2) != 0){
					this.toCut = [0]
				}else if(this.howManyOfWire(1) == 0){
					this.toCut = [0,1,2]
				}else {
					this.toCut = [1]
				}
				break;
			case 4:
				if(this.wireCols[this.wireCols.length-1] == 2 || this.wireCols[this.wireCols.length-1] == 3){
					this.toCut = [1]
				}else if(!this.hasDuplicates(this.wireCols)){
					this.toCut = [0,2,3]
				}else if(this.howManyOfWire(4) != 0){
					this.toCut = [3,1]
				}else if(this.howManyOfWire(5) >= 2){
					this.toCut = [0]
				}else if(this.howManyOfWire(2) == 1 && this.whereIsWire(2)[0] != 0){
					this.toCut = [this.whereIsWire(2)[0]-1]
				}else{
					this.toCut = [0,3]
				}
				break;
			case 5:
				if(this.wireCols[0] == this.wireCols[this.wireCols.length-1]){
					this.toCut = [2]
				}else if(this.wireCols[1] == 5 || this.wireCols[3] == 5){
					this.toCut = [3]
				}else if(this.howManyOfWire(3) == 3){
					this.toCut = [0,1,2,3,4]
				}else if(this.howManyOfWire(1) == 4){
					this.toCut = [4]
				}else{
					this.toCut = [1]
				}
				break;
		}
	}

	howManyOfWire(num){
		return this.wireCols.filter(function(wire){return wire == num}).length
	}

	whereIsWire(num){
		return this.wireCols.reduce(function(a, e, i) {
		    if (e === num)
		        a.push(i);
		    return a;
		}, []);
	}

	hasDuplicates(array) {
	    return (new Set(array)).size !== array.length;
	}
}