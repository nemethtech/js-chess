import { $ , $$ } from "../../utils/utils.js";
import { gameHandler } from "./gameHandler.js";
import { bishopMovement } from "./pieceMovement/bishop.js";
import { generalMovement } from "./pieceMovement/general.js";
import { rookMovement } from "./pieceMovement/rook.js";
import { Player } from "./playerClassExtend.js";

class BasePlayer {
    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      this.playerPieces = [];
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

      this.playerPieces.forEach( playerPiece => {
        if(Array.isArray(playerPiece.moveSquares) && playerPiece.moveSquares.length > 0){
          playerPiece.moveSquares.forEach( move => {
            piecesMovesSquares.push(move.colFreeMoveSquares);
          })
        }
      })
      return generalMovement.simplifyArray(piecesMovesSquares);
    }



    setPieceCollisions(piece , pieceAllMoveSquare){
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

    checkPieceMovesForPin(piece, moveObj) {
      for (const key in moveObj) {
        if (moveObj[key].length > 0) {
          this.checkSquaresHasPinnedPiece(moveObj[key], piece.piecePosition[0], piece.piecePosition[1]);
        }
      }
    }


    checkPinnedPieces(){

        this.playerPieces.forEach(piece => {
          if (piece.pieceType === 'bishop') {
            this.checkPieceMovesForPin(piece, bishopMovement.getAllAvailableSquares(piece));
          } else if (piece.pieceType === 'rook') {
            this.checkPieceMovesForPin(piece, rookMovement.checkAllPossibleSquares(piece.piecePosition[0], piece.piecePosition[1]));
        } else if (piece.pieceType === 'queen') {
          this.checkPieceMovesForPin(piece, bishopMovement.getAllAvailableSquares(piece));
          this.checkPieceMovesForPin(piece, rookMovement.checkAllPossibleSquares(piece.piecePosition[0], piece.piecePosition[1]));
        }
      });
    }
    
    getAllAvailableSquaresForPiece(piece){

        if (piece.pieceType === 'bishop') {

          return  bishopMovement.getAllAvailableSquares(piece);

        } else if (piece.pieceType === 'rook') {

          return rookMovement.checkAllPossibleSquares(piece.piecePosition[0], piece.piecePosition[1]);

        } else if (piece.pieceType === 'queen') {
          console.log('iece.piecePosition[0], piece.piecePosition[1]',piece.piecePosition[0], piece.piecePosition[1]);
          return {
            ...bishopMovement.getAllAvailableSquares(piece),
            ...rookMovement.checkAllPossibleSquares(piece.piecePosition[0], piece.piecePosition[1])
          }
        }
   
  }

    checkSquaresHasPinnedPiece(rookSquares , pinerCol , pinerRow){
      let squaresWithPieces = rookSquares.filter( e => $(`[id^="${e}"]`).hasChildNodes()).map( e => {
      return  {
          pieceColor : $(`[id^="${e}"]`).firstChild.getAttribute('piece-type').split('_')[0] ,
          pieceType : $(`[id^="${e}"]`).firstChild.getAttribute('piece-type').split('_')[1] ,
          piecePosition : $(`[id^="${e}"]`).firstChild.getAttribute( 'piece-square' ),
          rookSquaresIdx : rookSquares.indexOf(e)
         }
      })
     
      if(squaresWithPieces.length > 1){
        if(squaresWithPieces[1].pieceType === 'king' && squaresWithPieces[1].pieceColor !== this.playerColor ){
          if( squaresWithPieces[0].pieceColor !== this.playerColor){
            const pinned =  this.getEnemyPlayer().playerPieces.find( piece => piece.piecePosition ===  squaresWithPieces[0].piecePosition);
            pinned.isPinned = true;
            pinned.pinnedInfo = {
              pinnedSquares : rookSquares.toSpliced(squaresWithPieces[0].rookSquaresIdx , rookSquares.length),
              pinnerSquare  :  pinerCol + pinerRow
            }
            console.log('pinned' , squaresWithPieces[0]);
          }
        }
      }
    }

    setPieceColFreeMoves(piece , pieceAllMoveSquare ){    
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
        if(piece.pieceType !== 'king'){ 
          let pieceAllMoveSquare = generalMovement.getPieceMove(piece);
          this.setPieceColFreeMoves(piece , pieceAllMoveSquare);
          this.setPieceCollisions(piece , pieceAllMoveSquare);
        }
      })
    }
    
    setPlayerKingMoves(){

      const kingPiece = this.playerPieces.find( piece => piece.pieceType === 'king');
      let pieceAllMoveSquare = generalMovement.getPieceMove(kingPiece);
    //  console.log('pieceAllMoveSquare',pieceAllMoveSquare);  
      this.setPieceColFreeMoves(kingPiece , pieceAllMoveSquare);
      this.setPieceCollisions(kingPiece , pieceAllMoveSquare);
      if(this.isPlayerInCheck){
     //   console.log('kingPiece',kingPiece);
    //    console.log("threat",this.checkThreat);
        //let filtered = kingPiece.moveSquares.colFreeMoveSquares.filter( e => e !== this.checkThreat.plusOneSquare)
        let alma = kingPiece.moveSquares;
        
        alma.forEach( e => {
          //console.log('ez',e.colFreeMoveSquares[0]);
          if(e.colFreeMoveSquares[0] === this.checkThreat[0].plusOneSquare){
            e.colFreeMoveSquares = undefined;
          //  console.log('itt van',e);
            
          }
        })
   //     console.log('alma',alma);
        kingPiece.moveSquares = alma;
        //console.log('kingPiece',kingPiece);
      }
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
     this.playerPieces.forEach( playerPiece => {
      if(!playerPiece.isBackedUp){
        playerPiece.isBackedUp = false;
      }
     })
    }

    getEnemyPlayer(){
      return BasePlayer.instanceByColor(this.enemyColor);
    }
    
    setPlayerValuesToDefault(){
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
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).resetPlayerPiecesV1();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).resetPlayerPiecesV1();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).checkIfPlayIsUnderCheck();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).checkIfPlayIsUnderCheck();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).setPlayerKingMoves();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).setPlayerKingMoves();
  //BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).checkPinnedPieces();
 // BasePlayer.instanceByColor(gameHandler.currentTurnFor()).checkPinnedPieces();
}

export { BasePlayer };
