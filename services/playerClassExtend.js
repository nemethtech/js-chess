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
              colDirection : enemeyCollision.direction,
              plusOneSquare : this.getAllAvailableSquaresForPiece(enemyPiece)[a][this.getAllAvailableSquaresForPiece(enemyPiece)[a].indexOf(enemeyCollision.colPiecePosition)+1]
            }
            this.checkThreat.push(checkThreat)
            this.isPlayerInCheck = true;
          }
        })
      }
    })
    return this;
  }

 setPieceCanBlockThreat(piece){   

    if(this.checkThreat.length !== 1){
        piece.moveSquares = [];
        return ;
    }

    let filteredPieceMoveSquares = [];

    piece.moveSquares.forEach( colFreeeMove => {
        this.checkThreat[0].moveSquares.forEach( threatMoveSquare => {
          if(colFreeeMove.colFreeMoveSquares.includes(threatMoveSquare)){
            piece.canBlockCheck = true;
            filteredPieceMoveSquares.push({
              direction : colFreeeMove.direction , 
              colFreeMoveSquares : [threatMoveSquare]
            })
          }
        })
      })
    
    piece.moveSquares = filteredPieceMoveSquares;
    return ;
  }
  
  setPieceCanAttackThreat(piece){

    if(this.checkThreat.length !== 1){
        return piece.collisions = [];;
    }
    if(piece.collisions){
      piece.collisions = piece.collisions.filter( e => e.colPiecePosition === this.checkThreat[0].piecePosition);
      if(piece.collisions.length > 0){
        piece.canAttackThreat = true;
      }
    }

    return;
  }

  setPlayerPiecesInCheck(){
    if(this.isPlayerInCheck){
      this.playerPieces.forEach( playerPiece => {
        if(playerPiece.pieceType !== 'king'){
          this.setPieceCanBlockThreat(playerPiece);
        }
        this.setPieceCanAttackThreat(playerPiece);
      })
    }
    return this;
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


  canPlayerKingMove(){
    const kingPiece = this.playerPieces.find( piece => piece.pieceType === 'king');
    const kingHasMoveSquare = kingPiece.hasOwnProperty("moveSquares") && kingPiece.moveSquares.length > 0;

    return kingHasMoveSquare || this.playerKingCanAttack(kingPiece);
  }

  checkIfPlayIsUnderCheck(){
    this.setIfPlayerCheckIsOn();
    this.setPlayerPiecesInCheck();
    return this;
  }
}


export { Player };