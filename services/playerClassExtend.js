import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {

  setIfPlayerCheckIsOn(){

    Player.getEnemyPlayer().pieceCollisions.forEach( pieceCollision => {
      if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
        this.isPlayerInCheck = true;
        return;
      }
    })
  }

  checkIfPlayerInCheck(){

    this.setIfPlayerCheckIsOn();
    if(this.isPlayerInCheck){
      this.getCheckThreatInfo();
    }
  }
   
  getCheckThreatInfo(){
    if(this.isPlayerInCheck){
      Player.getEnemyPlayer().pieceCollisions.forEach( pieceCollision => {
        if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
          this.checkThreat.push(pieceCollision);
        }
      })
    }
  }



  pieceCanBlockCheck(piece){   

    let pieceMoveDirections = [];
    
    if(this.checkThreat.length !== 1){
        return pieceMoveDirections;
    }

    let playerPieceColFreeMoves = Player.getPlayer().pieceColFreeMoves;

    const playerPieceColFreeeMoves = playerPieceColFreeMoves.filter( pieceColFreeMove =>  
      pieceColFreeMove.playerPiecePosition === piece.piecePosition);

      if(Array.isArray(playerPieceColFreeeMoves)){
        playerPieceColFreeeMoves.forEach( colFreeeMove => {
          this.checkThreat[0].colMoveSquares.forEach( threatMoveSquare => {
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

    let playerPieceCollisions = Player.getPlayer().pieceCollisions;

    const playerPiecesCanAttackThreat = playerPieceCollisions.filter( pieceCol =>  
          pieceCol.colPiecePosition === this.checkThreat[0].playerPiecePosition);

    if(Array.isArray(playerPiecesCanAttackThreat)){
      playerPiecesCanAttackThreat.forEach( pieceCol => {
        if(pieceCol.playerPiecePosition === piece.piecePosition){
          pieceCanAttackThreat = true;
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
          playerPiece.canAttackThreat = true;
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
          let squares  = pieceMove[direction].collisionFreeSquares.filter(element => this.checkThreat[0].colMoveSquares.includes(element));
          filteredMove[direction] = { collisionFreeSquares : squares };
        }
      } 
    }

    if(playerPiece.canAttackThreat){
      for (const direction in pieceMove) {
        if (pieceMove[direction].possibleCollision === this.checkThreat[0].playerPiecePosition) {
          filteredMove[direction] = { possibleCollision : this.checkThreat[0].playerPiecePosition };
        }
      } 
    }

    return filteredMove;
  }

  canPlayerKingMove(){
    
    const kingColFreeeMoves = this.pieceColFreeMoves.filter( pieceColFreeMove =>  
      pieceColFreeMove.playerPieceType === 'king');
    
    const kingHasMoveSquare = kingColFreeeMoves.length > 0 ;

    let kingCanAttack = false;

    const kingColMoves = this.pieceCollisions.filter( pieceCollision =>  
      pieceCollision.playerPieceType === 'king' && pieceCollision.colType === 'enemy');
    
    kingColMoves.forEach( kingColMove => {
      const enemyPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => 
                         playerPiece.piecePosition === kingColMove.colPiecePosition);
      if(!enemyPiece.isBackedUp){
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
    this.setPieceIsBackedUp();
    this.setPieceColFreeMoves();
    this.checkIfPlayerInCheck();
    this.setPlayerPiecesInCheck();

  }

  
}

const playerTwo = new Player('black');
const playerOne = new Player('white');


export { Player };