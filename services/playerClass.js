import { $ , $$ } from "../../utils/utils.js";
import { gameHandler } from "./gameHandler.js";
import { generalMovement } from "./pieceMovement/general.js";

class BasePlayer {
    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      this.playerPieces = [];
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

    getPlayerPiecesMoveSquares(){

      let piecesMovesSquares = [];

      this.pieceColFreeMoves.forEach( piceMove => {
        piecesMovesSquares.push(piceMove.colFreeMoveSquares);
      })
      return generalMovement.simplifyArray(piecesMovesSquares);
    }

    setPieceCollisions(){

      this.playerPieces.forEach(piece => {

        let pieceAllMoveSquare = generalMovement.getPieceMove(piece);
        let collisionArray = generalMovement.getPossibleCollisionquares2(pieceAllMoveSquare);
        
        if(collisionArray.length > 0){

          collisionArray.forEach(collision => {

          let collisionPiece = $(`[id^="${collision.square}"]`);

            if(!(collisionPiece.firstChild == null)){

              const collisionMoveSquares = pieceAllMoveSquare[collision.direction].collisionFreeSquares;
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

    setPieceCollisions2(piece , pieceAllMoveSquare){

      let collisionArray = generalMovement.getPossibleCollisionquares2(pieceAllMoveSquare);
      
      if(collisionArray.length > 0){
      
        piece.collisions = [];

        collisionArray.forEach(collision => {

        let collisionPiece = $(`[id^="${collision.square}"]`);

          if(!(collisionPiece.firstChild == null)){

            const collisionMoveSquares = pieceAllMoveSquare[collision.direction].collisionFreeSquares;
            const collisionType = collisionPiece.firstChild.getAttribute('piece-type').includes(this.enemyColor) ? 'enemy' : 'ally';
            const collisionPieceType = collisionPiece.firstChild.getAttribute('piece-type');
          
            piece.collisions.push({
              direction : collision.direction ,
              colPiecePosition : collision.square ,
              colType  : collisionType, 
              colPieceType : collisionPieceType , 
              colMoveSquares :  collisionMoveSquares,

            });
            
          }   
        })
      }
      
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

    getEnemyPlayer(){
      return BasePlayer.instanceByColor(this.enemyColor);
    }

    setPieceColFreeMoves2(piece , pieceAllMoveSquare ){

      let colFreeMoves = generalMovement.getCollisionFreeSquares2(pieceAllMoveSquare);
    
      if(colFreeMoves.length > 0){

        piece.moveSquares = [];

        colFreeMoves.forEach( colFreeMove => {

          if(colFreeMove.square.length > 0){

            piece.moveSquares.push({
              direction : colFreeMove.direction ,
              colFreeMoveSquares :  colFreeMove.square,
            }) 
          }
        })
      }
    }


    setPlayerPiecesMoves(){
      this.playerPieces.forEach( piece => {
        let pieceAllMoveSquare = generalMovement.getPieceMove(piece);
        this.setPieceColFreeMoves2(piece , pieceAllMoveSquare);
        this.setPieceCollisions2(piece , pieceAllMoveSquare);
      })
    }


    
    setPieceIsBackedUp(){
      this.playerPieces.forEach( playerPiece => {
        if(playerPiece.collisions){
          playerPiece.collisions.forEach( pieceCollision => {
            if(pieceCollision.colType === 'ally'){
              const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === pieceCollision.colPiecePosition);
              playerPiece.isBackedUp = true;
            }
          })
        }
     })
    } 
    
    setPlayerValuesToDefault(){
      this.pieceColFreeMoves = [];
      this.pieceCollisions = [];
      this.playerPieces = [];
      this.checkThreat = [];
      this.isPlayerInCheck  = false;
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

BasePlayer.resetPlayerPieces = () => {
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).setPlayerPieces();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).setPlayerPieces();
}



export { BasePlayer };
