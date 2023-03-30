import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {

   setIsPlayerCheckIsOn(){

   }

   getEnemyKingPosition(){
   // let enemyColor = this.playerColor === 'white' ? 'black' : 'white';
    Player.instanceByColor(this.enemyColor).playerPieces.forEach(enemyPiece => {
        if(enemyPiece.pieceType === 'king'){
  //          console.log('KING:',enemyPiece);
  //          console.log('KING POS:',enemyPiece);
            
        }
    });
   }
  
    // ...
  }

const playerExtendedTwo = new Player('black');
const playerExtendedOne = new Player('white');
Player.resetPlayerPieces = function(){
  Player.instanceByColor('white').setPlayerPieces();
  Player.instanceByColor('black').setPlayerPieces();
}


export { Player };