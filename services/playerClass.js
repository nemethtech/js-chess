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
      this.hasTheKingMoved = false;
      this.isPlayerInCheck = false;
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
          this.attackSquares.push(generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(piece)));
        }else {
          this.attackSquares.push(generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(piece)));
        }
      })
      this.attackSquares = this.attackSquares.flat(1);
      this.attackSquares = this.attackSquares.filter((element, index) => {
        return this.attackSquares.indexOf(element) === index;
    });
 
    }

    setPieceCollisions(){

      this.playerPieces.forEach(piece => {

        let collisionArray = generalMovement.getPossibleCollisionquares2(generalMovement.getPotentialSquares(piece));

        if(collisionArray.length > 0){

          collisionArray.forEach(collision =>{

          let collisionPiece = $(`[id^="${collision.square}"]`);

            if(!(collisionPiece.firstChild == null)){

              const collisionType = collisionPiece.firstChild.getAttribute('piece-type').includes(this.enemyColor) ? 'enemy' : 'ally';
              const collisionPieceType = collisionPiece.firstChild.getAttribute('piece-type');
            
              this.pieceCollisions.push({
                playerPieceType : piece.pieceType , 
                playerPiecePosition : piece.piecePosition,
                direction : collision.direction ,
                colPiecePosition : collision.square ,
                colType  : collisionType, 
                colPieceType : collisionPieceType , 
              }) 
            }   
          })
        }
      })
    }


    setPlayerValuesToDefault(){
      this.pieceCollisions = [];
      this.attackSquares = [];
      this.playerPieces = [];
      this.isPlayerInCheck  = false;
    }


    setPlayerPieces(){
      this.setPlayerValuesToDefault();
      this.getPlayerPieces();
      this.getAttackerSquares();
      this.setPieceCollisions();
    //  this.setPieceBackUp();
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
