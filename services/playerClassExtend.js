import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {


  setIfPlayerCheckIsOn(){

    this.getEnemyPlayer().playerPieces.forEach( enemyPiece => {
      if(enemyPiece.collisions){
        enemyPiece.collisions.forEach( enemeyCollision => {
          if(enemeyCollision.colPieceType.includes('king') && enemeyCollision.colType === 'enemy'){
            let checkThreat = {
              moveSquares : enemeyCollision.colMoveSquares,
              piecePosition : enemyPiece.piecePosition,
              pieceType : enemyPiece.pieceType,
            }
            this.checkThreat.push(checkThreat)
            this.isPlayerInCheck = true;
          }
        })
      }
    })
  }

  pieceCanBlockCheck(piece){   

    let pieceMoveDirections = [];
    
    if(this.checkThreat.length !== 1){
        return pieceMoveDirections;
    }

    let pieceColFreeMoves = piece.moveSquares;

      if(Array.isArray(pieceColFreeMoves)){
        pieceColFreeMoves.forEach( colFreeeMove => {

          this.checkThreat[0].moveSquares.forEach( threatMoveSquare => {

            if(colFreeeMove.colFreeMoveSquares.includes(threatMoveSquare)){

            pieceMoveDirections.push(colFreeeMove.direction);

          }
        })
      })
    }
    return pieceMoveDirections;
  }

  pieceCanAttackCheckThreat(piece){
    let pieceCanAttackThreat = false;
    
    if(this.checkThreat.length !== 1){
        return pieceCanAttackThreat;
    }
    if(piece.collisions){
      piece.collisions.forEach( pieceCollison => {
        if(pieceCollison.colPiecePosition === this.checkThreat[0].piecePosition){
          pieceCanAttackThreat =  true;
        }
      })
    }
    return pieceCanAttackThreat;
  }

  setPlayerPiecesInCheck(){
    if(this.isPlayerInCheck){
      this.playerPieces.forEach( playerPiece => {
        if(this.pieceCanBlockCheck(playerPiece).length !== 0){
          playerPiece.canBlockCheck = true;
          playerPiece.canBlockCheckDirections = this.pieceCanBlockCheck(playerPiece);
        }
        if(this.pieceCanAttackCheckThreat(playerPiece)){
          playerPiece.pieceCanAttackThreat = true;
        
        }
        
        
      })
    }
  }

  filterPieceMoveIfPlayerUnderCheck(piece , pieceMove){

    const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === piece.piecePosition);
    let filteredMove = {};

    if(playerPiece.canBlockCheck){
      for (const direction in pieceMove) {
        if (playerPiece.canBlockCheckDirections.includes(direction)) {
          let squares  = pieceMove[direction].collisionFreeSquares.filter(element => this.checkThreat[0].moveSquares.includes(element));
          filteredMove[direction] = { collisionFreeSquares : squares };
        }
      } 
    }

    if(playerPiece.canAttackThreat){
      for (const direction in pieceMove) {
        if (pieceMove[direction].possibleCollision === this.checkThreat[0].piecePosition) {
          filteredMove[direction] = { possibleCollision : this.checkThreat[0].piecePosition };
        }
      } 
    }

    return filteredMove;
  }

  canPlayerKingMove(){
    const kingPiece = this.playerPieces.find( piece => piece.pieceType === 'king');
    console.log('kingPiece',kingPiece);
    const kingHasMoveSquare = kingPiece.moveSquares !== [];

    let kingCanAttack = false;

    kingPiece.collisions.forEach( kingColMove => {
      const enemyPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => 
        playerPiece.piecePosition === kingColMove.colPiecePosition);
      if(enemyPiece && !enemyPiece.isBackedUp){
        kingCanAttack = true;
      }
    })

    const canTheKingMove = kingHasMoveSquare || kingCanAttack;

    return canTheKingMove;

    }










  setPlayerPieces(){

    this.setPlayerValuesToDefault();
    this.getPlayerPieces();
    this.setPieceCollisions();
    this.setPlayerPiecesMoves();
    this.setPieceIsBackedUp();
    this.setPieceColFreeMoves();
    this.setIfPlayerCheckIsOn();
    this.setPlayerPiecesInCheck();

  }

  
}

const playerTwo = new Player('black');
const playerOne = new Player('white');


export { Player };