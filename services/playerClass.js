import { $ , $$ } from "../../utils/utils.js";
import { gameHandler } from "./gameHandler.js";
import { generalMovement } from "./pieceMovement/general.js";

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

    getPieceSquareArray(squareArr){
      return squareArr.filter(square => $(`[id^="${square}"]`).hasChildNodes());
    }

    getPieceImg(square){
      return $(`[id^="${square}"]`).firstChild;
    }

    getPieceStatus(pieceImg){
      return this.playerColor === pieceImg.getAttribute( 'piece-type' ).split('_')[0] ? 'ally' : 'enemy';
    }

    setEnemyPieceBackedUp(pieceImg){
      const playerPiece = this.getEnemyPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === pieceImg.getAttribute( 'piecePosition' ));
      playerPiece.isBackedUp = true;
      return this;
    }

    pieceIsPlayerKing(pieceImg){
      return pieceImg.getAttribute('piece-type').split('_')[1]  === 'king' && pieceImg.getAttribute('piece-type').split('_')[0] === this.playerColor;
    }

    collectMoveSquares(squareArray){
      squareArray.forEach( square => { this.allEnemyMoveSquare.push(square); })
      return this;
    } 

    setEnemeyPieceMoves(){
      console.log('ENEMY' , this.getEnemeyP());
      this.getEnemeyP().playerPieces.forEach( enemyPiece => {

          let pieceMove = generalMovement.getPieceMoveUnfiltered(enemyPiece);
          this.analyzeEnemyPieceMove(enemyPiece , pieceMove);
          
        });
      return this;
    }

    setPlayerPieceMoves(){
      this.playerPieces.forEach( playerPiece => {
          let pieceMove = generalMovement.getPieceMoveUnfiltered(playerPiece);
          this.setupPlayerPiece(playerPiece , pieceMove);
        })
      return this;
    }

    getEnemeyP(){
      return BasePlayer.instances[this.enemyColor];
    }

    getP(){
      console.log('getP',BasePlayer.instances[this.playerColor]);
      return BasePlayer.instances[this.playerColor];
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
