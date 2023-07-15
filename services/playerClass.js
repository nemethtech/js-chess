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

    checkPinnedPieces(){
      const pieceTypesThatCanPin = ['queen' , 'rook' , 'bishop'];
      this.playerPieces.forEach( piece => {
        if(piece.pieceType === 'bishop'){ 
       //   console.log('Bishop : ' , bishopMovement.getAllAvailableSquares(piece));
        }
        if(piece.pieceType === 'rook'){ 
          
          
          let rookMoveObj = rookMovement.checkAllPossibleSquares(piece.piecePosition[0], piece.piecePosition[1]);

          let  arr2  = [];
          for (const key in rookMoveObj) {
            if(rookMoveObj[key].length > 0){
              this.checkRookSquaresHasPinnedPiece(rookMoveObj[key] , piece.piecePosition[0], piece.piecePosition[1]) ;
//('childNodeArr'  , childNodeArr);
             /* console.log('Arr 2 ',arr2);
              if(arr2.length >= 2){

                if(arr2[1].pieceType === 'king' && arr2[1].pieceColor !== piece.pieceColor ){
                  if( arr2[0].pieceColor !== piece.pieceColor){
                    const pinned =  this.getEnemyPlayer().playerPieces.find( piece => piece.piecePosition ===  arr2[0].piecePosition);
                    console.log('this.getEnemyPlayer()!!' ,this.getEnemyPlayer() );
                    console.log('tarr2[0]' ,arr2[0] );
                    console.log('Ezzel Nem Szabad Mozogni !!' ,pinned );
                  }
                }
              }
              arr2  = [];
            */}
          }
        }  
      });
    }

    checkRookSquaresHasPinnedPiece(rookSquares , pinerCol , pinerRow){
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
            pinned.pinnedSquares = 
            pinned.pinner = pinerCol + pinerRow;
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
      this.setPieceColFreeMoves(kingPiece , pieceAllMoveSquare);
      this.setPieceCollisions(kingPiece , pieceAllMoveSquare);
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
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).resetPlayerPieces();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).resetPlayerPieces();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).setPlayerKingMoves();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).setPlayerKingMoves();
  BasePlayer.instanceByColor(gameHandler.currentTurnFor()).resetPieceMoves();
  BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).resetPieceMoves();
  //BasePlayer.instanceByColor(gameHandler.notCurrentTurnFor()).checkPinnedPieces();
 // BasePlayer.instanceByColor(gameHandler.currentTurnFor()).checkPinnedPieces();
}

export { BasePlayer };
