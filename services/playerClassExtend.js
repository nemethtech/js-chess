import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {

  setIfPlayerCheckIsOn(){

    Player.instanceByColor(this.enemyColor).pieceCollisions.forEach( pieceCollision => {
      
      if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
        this.isPlayerInCheck = true;
        return;
      }
    })
  }

  consoleCheckSit(){

    this.setIfPlayerCheckIsOn();
    this.setPieceIsBackedUp();
    console.log('Color : ' , this.playerColor , ' Csekk? : ' , this.isPlayerInCheck);
    this.playerPieces.forEach( e => {
      if(e.isBackedUp ){
        console.log('backed up', e);
      }
    })
  }
   

  setPieceIsBackedUp(){
    this.pieceCollisions.forEach( pieceCollision => {
      if(pieceCollision.colType === 'ally'){
        const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === pieceCollision.colPiecePosition);
        playerPiece.isBackedUp = true;
      }
    })
  }

}

const playerExtendedTwo = new Player('black');
const playerExtendedOne = new Player('white');


export { Player };