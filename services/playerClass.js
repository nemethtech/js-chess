import { $ , $$ } from "../../utils/utils.js";
import { chessConfig } from "../config/chessConfig.config.js";
import { gameHandler } from "./gameHandler.js";
import { generalMovement } from "./pieceMovement/general.js";
import { piecesRender } from "./pieceRender.js";



class BasePlayer {
    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      this.playerPieces = [];
      this.attackSquares = [];
      this.pieceCollisions = [];
      this.pieceColFreeMoves = [];
      this.hasTheKingMoved = false;
      this.isPlayerInCheck = false;
      this.checkThreat = [];
      BasePlayer.instances[color] = this;
    }
    
    getPlayerPieces(){

      $$(`[piece-type^="${this.playerColor}"]`).forEach(piece => {
          const piecePosition = piece.getAttribute( 'piece-square' );
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
    }

    getAttackerSquares(){

      this.playerPieces.forEach(piece => {
        if(piece.pieceType === 'pawn'){
          this.attackSquares.push(generalMovement.getPossibleCollisionquares(generalMovement.getPieceMove(piece)));
        }else {
          this.attackSquares.push(generalMovement.getCollisionFreeSquares(generalMovement.getPieceMove(piece)));
        }
      })
      this.attackSquares = this.attackSquares.flat(1);
      this.attackSquares = this.attackSquares.filter((element, index) => {
        return this.attackSquares.indexOf(element) === index;
    });
 
    }

    setPieceCollisions(){

      this.playerPieces.forEach(piece => {

        let pieceAllMoveSquare = generalMovement.getPieceMove(piece);
        let collisionArray = generalMovement.getPossibleCollisionquares2(pieceAllMoveSquare);
        
        if(collisionArray.length > 0){

          collisionArray.forEach(collision =>{

          let collisionPiece = $(`[id^="${collision.square}"]`);

            if(!(collisionPiece.firstChild == null)){

              let collisionMoveSquares = pieceAllMoveSquare[collision.direction].collisionFreeSquares;
              const collisionType = collisionPiece.firstChild.getAttribute('piece-type').includes(this.enemyColor) ? 'enemy' : 'ally';
              const collisionPieceType = collisionPiece.firstChild.getAttribute('piece-type');
            
              this.pieceCollisions.push({
                playerPieceType : piece.pieceType , 
                playerPiecePosition : piece.piecePosition,
                direction : collision.direction ,
                colPiecePosition : collision.square ,
                colType  : collisionType, 
                colPieceType : collisionPieceType , 
                colMoveSquares :  collisionMoveSquares,
              }) 
            }   
          })
        }
      })
    }


    setPieceColFreeMoves(){

      this.playerPieces.forEach(piece => {

        let pieceAllMoveSquare = generalMovement.getPieceMove(piece);
        let colFreeMoves = generalMovement.getCollisionFreeSquares2(pieceAllMoveSquare);
        
        if(colFreeMoves.length > 0){

          colFreeMoves.forEach( colFreeMove => {
            if(colFreeMove.square.length > 0){

              this.pieceColFreeMoves.push({
                playerPieceType : piece.pieceType , 
                playerPiecePosition : piece.piecePosition,
                direction : colFreeMove.direction ,
                colFreeMoveSquares :  colFreeMove.square,
              }) 
            }
            
          })
        }
      })
    }

    setPlayerValuesToDefault(){
      this.pieceColFreeMoves = [];
      this.pieceCollisions = [];
      this.attackSquares = [];
      this.playerPieces = [];
      this.checkThreat = [];
      this.isPlayerInCheck  = false;
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

BasePlayer.instances = {};

BasePlayer.instanceByColor = (color) => {
  return BasePlayer.instances[color];
}

BasePlayer.resetPlayerPieces = () => {
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).setPlayerPieces();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).setPlayerPieces();
}
  

export { BasePlayer };
