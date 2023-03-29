import { Player } from "./../playerClass.js";

class checkHandling extends Player {

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

const playerExtendedTwo = new checkHandling('black');
const playerExtendedOne = new checkHandling('white');
Player.resetPlayerPieces = function(){
  Player.instanceByColor('white').setPlayerPieces();
  Player.instanceByColor('black').setPlayerPieces();
}


export { checkHandling};