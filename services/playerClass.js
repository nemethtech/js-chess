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
      $$(`[pieceColor^="${this.playerColor}"]`).forEach(piece => {
          const piecePosition = piece.getAttribute( 'piecePosition' );
          const pieceColor = piece.getAttribute( 'pieceColor' );
          const pieceType = piece.getAttribute( 'pieceType' );
          
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
      const pieceSquareArr =  squareArr.filter(square => $(`[piecePosition="${square}"]`));
      const firstCollision  = pieceSquareArr?.[0] ;
      const secondCollision  = pieceSquareArr?.[1] ;
      let collisionPieces = [firstCollision,secondCollision].map( collision => {
        if(collision){
          return {
            colPos : $(`[pieceposition="${collision}"]`).getAttribute( 'piecePosition' ) , 
            status : $(`[pieceposition="${collision}"]`).getAttribute( 'pieceColor' ) === this.playerColor ?  'ally' : 'enemy' ,
            type   : $(`[pieceposition="${collision}"]`).getAttribute( 'pieceType' ) ,
          }
        }
      });
      return collisionPieces.filter( collision => collision !== undefined);
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
