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

  setPieceCanBlockThreat(piece){   
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

  setPieceCanAttackThreat(piece){
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
        if(this.setPieceCanBlockThreat(playerPiece).length !== 0){
          playerPiece.canBlockCheck = true;
          playerPiece.canBlockCheckDirections = this.setPieceCanBlockThreat(playerPiece);
        }
        if(this.setPieceCanAttackThreat(playerPiece)){
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


  playerKingCanAttack(kingPiece){
    let playerKingCanAttack = false;
    if(kingPiece.collisions){
      let enemyCollisions =  kingPiece.collisions.filter( col => col.colType !== 'ally');
      enemyCollisions.forEach( enemyCol => {
        const enemyPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => 
          playerPiece.piecePosition === enemyCol.colPiecePosition);
          if(!enemyPiece.isBackedUp){
            playerKingCanAttack = true;
          }
        })
    }
    return playerKingCanAttack;
  }

  
  playerKingCanAttackCheckThreat(kingPiece){
    let playerKingCanAttackCheckThreat = false;
    if(this.isPlayerInCheck){
      const enemyPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => 
        playerPiece.piecePosition === this.checkThreat[0].piecePosition);
        if(!enemyPiece.isBackedUp && kingPiece.canAttackThreat){
          playerKingCanAttackCheckThreat = true;
        }
      }
      return playerKingCanAttackCheckThreat;
  }

  canPlayerKingMove(){
    const kingPiece = this.playerPieces.find( piece => piece.pieceType === 'king');
    const kingHasMoveSquare = kingPiece.hasOwnProperty("moveSquares") && kingPiece.moveSquares.length > 0;
    if(this.isPlayerInCheck){
      return kingHasMoveSquare || this.playerKingCanAttackCheckThreat(kingPiece);
    } else {
      return kingHasMoveSquare || this.playerKingCanAttack(kingPiece);
    }
  }
    
  pieceCanBlockCheck(piece){
    const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === piece.piecePosition);
    return playerPiece.canBlockCheck || playerPiece.canAttackThreat;
  }


  resetPlayerPieces(){
    this.setPlayerValuesToDefault();
    this.getPlayerPieces();
    this.setPlayerPiecesMoves();
    this.setPieceIsBackedUp();
  }
  
  resetPieceMoves(){
    this.setIfPlayerCheckIsOn();
    this.setPlayerPiecesInCheck();
  }
  
}

const playerTwo = new Player('black');
const playerOne = new Player('white');


export { Player };