import { chessConfig } from "../config/chessConfig.config.js";
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
    if(this.isPlayerInCheck){
      this.gatherCheckInfo();
      this.checkThreat.forEach( threat => {
        console.log('color ' , this.playerColor);
        console.log('threat',threat);
      })
    }
    this.setPieceIsBackedUp();
    console.log('Color : ' , this.playerColor , ' Csekk? : ' , this.isPlayerInCheck);
    this.playerPieces.forEach( e => {
      if(e.isBackedUp ){
  //      console.log('backed up', e);
      }
    })
  }
   
  gatherCheckInfo(){
    if(this.isPlayerInCheck){
      Player.instanceByColor(this.enemyColor).pieceCollisions.forEach( pieceCollision => {
        if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
          this.checkThreat.push(pieceCollision);
        }
      })
    }
  }

  setPieceIsBackedUp(){
    this.pieceCollisions.forEach( pieceCollision => {
      if(pieceCollision.colType === 'ally'){
        const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === pieceCollision.colPiecePosition);
        playerPiece.isBackedUp = true;
      }
    })
  }

  pieceCanBlockCheck(piece){    
    let pieceCanBlockCheck = false;
    if(this.checkThreat.length !== 1){
        return false;
    }
    let pieceCollisions = Player.instanceByColor(chessConfig.currentTurn).pieceCollisions;
    console.log('this.pieceCollision',pieceCollisions);
    const pieceCollision = pieceCollisions.find( pieceCol =>  pieceCol.playerPiecePosition === piece.piecePosition);
    console.log('pieceCollision',pieceCollision);
 /*
    if(pieceCollision.colPiecePosition === this.threat[0].piecePosition){
      if(pieceCollision.colPiecePosition === this.checkThreat[0].colPiecePosition){
        return true;
      }
    }
*/
    return pieceCanBlockCheck;
  }

  
}

const playerExtendedTwo = new Player('black');
const playerExtendedOne = new Player('white');


export { Player };