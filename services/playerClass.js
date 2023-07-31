import { $, $$ } from "../../utils/utils.js";
import { gameHandler } from "./gameHandler.js";


class BasePlayer {

    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      this.playerPieces = [];
      this.isPlayerInCheck = false;
      this.checkingPieces = [];
      this.allEnemyMoveSquare = [];
      BasePlayer.instances[color] = this;
    }
    
    getPlayerPieces(){
      $$(`[piece-type^="${this.playerColor}"]`).forEach(piece => {
          const piecePosition = piece.getAttribute( 'piecePosition' );
          const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
          const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
          
          const handleParams = {
              piece,
              pieceType, 
              piecePosition,
              pieceColor,
          }
          this.playerPieces.push(handleParams);
      }); 
      return this;
    }

    getEnemyPlayer(){
      return BasePlayer.instanceByColor(this.enemyColor);
    }
    
    setPlayerValuesToDefault(){
      this.playerPieces = [];
      this.isPlayerInCheck  = false;
      this.allEnemyMoveSquare = [];
      this.checkingPieces = [];
      return this;
    }

    getCollisionPieces(squareArr){
      const colSquareArr =  squareArr.filter(square => $(`[id^="${square}"]`).hasChildNodes());
      let colPieceArr = [];
      if(colSquareArr.length > 0){
        colSquareArr.forEach( e => {
          const collisionPiece = $(`[id^="${e}"]`).firstChild;
          if(collisionPiece.getAttribute( 'piece-type' ).split('_')[0] === this.playerColor){
            colPieceArr.push({ 
              colPos : collisionPiece.getAttribute( 'piecePosition' ) , 
              status : collisionPiece.getAttribute( 'piece-type' ).split('_')[0] !== this.playerColor ?  'ally' : 'enemy' ,
              type : collisionPiece.getAttribute( 'piece-type' ).split('_')[1]
            }) 
          }
        })
      }
      return colPieceArr;
    }


    getSetup(){
        
      this.setPlayerValuesToDefault()
          .getPlayerPieces()
          .getEnemyPlayer()
          .setPlayerValuesToDefault()
          .getPlayerPieces()
          .getEnemyPlayer()
          .setEnemeyPieceMoves()
          .setAllPlayerPieceMoves();
    }
  }
  
BasePlayer.instances = {};
  
  
BasePlayer.instanceByColor = (color) => {
  return BasePlayer.instances[color];
}

BasePlayer.getPlayer = ()  => {
return BasePlayer.instances[gameHandler.currentTurnFor()];
}

BasePlayer.getEnemyPlayer = ()  => {
  return BasePlayer.instances[gameHandler.notCurrentTurnFor()];
}


export { BasePlayer };
