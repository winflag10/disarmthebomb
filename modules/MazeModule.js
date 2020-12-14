class MazeModule{
	constructor(uuid, lifeModule, forceVariant=false, variant=null){
		this.uuid = uuid;
		this.lifeModule = lifeModule
		this.timeInit = Date.now()

		this.mazeChoice = Math.ceil(Math.random()*4)

		this.x = Math.ceil(Math.random()*2)
		this.y = Math.ceil(Math.random()*6)

		this.targetx = Math.ceil(Math.random()*2)+4
		this.targety = Math.ceil(Math.random()*6)

		//0-up 1-down 2-left 3-right
 		if(this.mazeChoice == 1){//maze 1
			this.maze = [
				[//row1
					{"walls":[0,1,2]},
					{"walls":[0,1]},
					{"walls":[1]},
					{"walls":[1]},
					{"walls":[0,1]},
					{"walls":[1,3]}
				],
				[//row2
					{"walls":[1,2]},
					{"walls":[1,3]},
					{"walls":[0,2,3]},
					{"walls":[2,3]},
					{"walls":[0,1,2]},
					{"walls":[0,3]}
				],
				[//row3
					{"walls":[2,3]},
					{"walls":[0,2]},
					{"walls":[1,3]},
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[0,1,3]}
				],
				[//row4
					{"walls":[2]},
					{"walls":[1,3]},
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[1,3]},
					{"walls":[2,3]}
				],
				[//row5
					{"walls":[0,2,3]},
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[1,3]},
					{"walls":[2]},
					{"walls":[2,3]}
				],
				[//row6
					{"walls":[0,1,2]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[0,3]},
					{"walls":[0,2]},
					{"walls":[0,3]}
				]
			]
		}else if(this.mazeChoice == 2){
			this.maze = [
				[//row1
					{"walls":[1,2]},
					{"walls":[0,1,3]},
					{"walls":[1,2]},
					{"walls":[0,1]},
					{"walls":[1]},
					{"walls":[1,3]}
				],
				[//row2
					{"walls":[2]},
					{"walls":[0,1]},
					{"walls":[0,3]},
					{"walls":[1,2]},
					{"walls":[0,3]},
					{"walls":[0,2,3]}
				],
				[//row3
					{"walls":[0,2,3]},
					{"walls":[1,2]},
					{"walls":[1,3]},
					{"walls":[0,2]},
					{"walls":[1]},
					{"walls":[1,3]}
				],
				[//row4
					{"walls":[1,2]},
					{"walls":[0,3]},
					{"walls":[0,2]},
					{"walls":[1,3]},
					{"walls":[0,2,3]},
					{"walls":[2,3]}
				],
				[//row5
					{"walls":[2,3]},
					{"walls":[1,2]},
					{"walls":[3,1]},
					{"walls":[0,2]},
					{"walls":[3,1]},
					{"walls":[2,3]}
				],
				[//row6
					{"walls":[0,2,3]},
					{"walls":[0,2,3]},
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[0]},
					{"walls":[0,3]}
				]
			]
		}else if(this.mazeChoice == 3){
			this.maze = [
				[//row1
					{"walls":[2,3,1]},
					{"walls":[2,1]},
					{"walls":[0,1]},
					{"walls":[1]},
					{"walls":[3,1]},
					{"walls":[1,2,3]}
				],
				[//row2
					{"walls":[2]},
					{"walls":[0,3]},
					{"walls":[2,1]},
					{"walls":[0,3]},
					{"walls":[2,3]},
					{"walls":[2,3]}
				],
				[//row3
					{"walls":[0,2,3]},
					{"walls":[2,1]},
					{"walls":[0,3]},
					{"walls":[2,1,3]},
					{"walls":[2,3]},
					{"walls":[2,3]}
				],
				[//row4
					{"walls":[1,2]},
					{"walls":[0,3]},
					{"walls":[1,2]},
					{"walls":[0]},
					{"walls":[0,3]},
					{"walls":[2,3]}
				],
				[//row5
					{"walls":[0,2]},
					{"walls":[1,3]},
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[3]}
				],
				[//row6
					{"walls":[0,1,2]},
					{"walls":[0,3]},
					{"walls":[0,1,2]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[0,3]}
				]
			]
		}else if(this.mazeChoice == 4){
			this.maze = [
				[//row1
					{"walls":[2,1]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[0,1]},
					{"walls":[3,1]}
				],
				[//row2
					{"walls":[0,2]},
					{"walls":[0,1]},
					{"walls":[1,3]},
					{"walls":[1,2]},
					{"walls":[0,1,3]},
					{"walls":[2,3]}
				],
				[//row3
					{"walls":[1,2]},
					{"walls":[1,3]},
					{"walls":[0,2]},
					{"walls":[3]},
					{"walls":[1,2]},
					{"walls":[3]}
				],
				[//row4
					{"walls":[2,3]},
					{"walls":[2,3]},
					{"walls":[0,1,2]},
					{"walls":[3]},
					{"walls":[2,3]},
					{"walls":[2,3]}
				],
				[//row5
					{"walls":[2,3]},
					{"walls":[0,2]},
					{"walls":[1,3]},
					{"walls":[0,2,3]},
					{"walls":[2,3]},
					{"walls":[2,3]}
				],
				[//row6
					{"walls":[0,2,3]},
					{"walls":[0,1,2]},
					{"walls":[0]},
					{"walls":[0,1]},
					{"walls":[0,3]},
					{"walls":[0,2,3]}
				]
			]
		}

		var MazeModuleHTML = `
		<div class="maze-module module" id="module-${this.uuid}">
			<div class="win-cover" id="win-cover-${this.uuid}"></div>
			<div class="maze-module-container">
				<p>${this.mazeChoice}</p>
				<div class="maze-movement-container">
					<div class="maze-center-point">
						<i class="fas fa-chevron-up fa-3x cursor maze-movement-up-arrow" onclick="activeModules[${this.uuid}].move(0)"></i> 
						<i class="fas fa-chevron-down fa-3x cursor maze-movement-down-arrow" onclick="activeModules[${this.uuid}].move(1)"></i> 
						<i class="fas fa-chevron-left fa-3x cursor maze-movement-left-arrow" onclick="activeModules[${this.uuid}].move(2)"></i> 
						<i class="fas fa-chevron-right fa-3x cursor maze-movement-right-arrow" onclick="activeModules[${this.uuid}].move(3)"></i> 
					</div>
				</div>
				<p id="maze-${this.uuid}-location">[${this.x},${this.y}] to [${this.targetx},${this.targety}]</p>
			</div>
		</div>`

		this.defused = 0
		document.getElementById("game").innerHTML += MazeModuleHTML
		let lightHTML = `<div class="light-back"><div class="light" id="light-${this.uuid}"></div></div>`
		document.getElementById("lights").innerHTML += lightHTML
	}

	defuse(){
		document.getElementById(`maze-${this.uuid}-location`).style.color = "#09ec09"
		document.getElementById(`light-${this.uuid}`).style.background = "#09ec09"
		document.getElementById(`win-cover-${this.uuid}`).style.display = "block"
		audioManager.play("defuse-sound")
		this.defused = 1
		this.lifeModule.checkWin()
	}

	getWalls(pos){// list of [x,y]
	    return this.maze[pos[1]-1][pos[0]-1]["walls"]
	}

	move(dir){
		if(this.getWalls([this.x,this.y]).includes(dir)){
			this.lifeModule.loseLife()
		}else{
			switch(dir){
				case 0:
					this.y++;
					break;
				case 1:
					this.y--;
					break;
				case 2:
					this.x--;
					break;
				case 3:
					this.x++;
					break;
			}
			document.getElementById(`maze-${this.uuid}-location`).innerHTML = `[${this.x},${this.y}] to [${this.targetx},${this.targety}]`
			if(this.x == this.targetx && this.y == this.targety){
				this.defuse()
			}
		}
	}

}