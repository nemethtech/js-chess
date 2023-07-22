import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {


  setIfPlayerCheckIsOn(){

    this.getEnemyPlayer().playerPieces.forEach( enemyPiece => {
      if(enemyPiece.collisions){
        enemyPiece.collisions.forEach( enemeyCollision => {
          if(enemeyCollision.colPieceType.includes('king') && enemeyCollision.colType === 'enemy'){
            let a = enemeyCollision.direction;
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

 setPieceCanBlockThreat2(piece){   

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
              moveSquares : [threatMoveSquare]
            })
          }
        })
      })
    
    piece.moveSquares = filteredPieceMoveSquares;
    return ;
  }
  
  setPieceCanAttackThreat2(piece){

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

  setPlayerPiecesInCheck2(){
    if(this.isPlayerInCheck){
      this.playerPieces.forEach( playerPiece => {
        if(playerPiece.pieceType != 'king'){
          this.setPieceCanBlockThreat2(playerPiece);
        }
        this.setPieceCanAttackThreat2(playerPiece);
         // playerPiece.canAttackThreat = true;
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


  resetPlayerPiecesV1(){
    this.setPlayerValuesToDefault();
    this.getPlayerPieces();
    this.setPlayerPiecesMoves();
    this.setPieceIsBackedUp();

    //setPinnedPieces
  }
  
  checkIfPlayIsUnderCheck(){
    this.setIfPlayerCheckIsOn();
    this.setPlayerPiecesInCheck();
  }

  checkIfPlayIsUnderCheck2(){
    this.setIfPlayerCheckIsOn();
    this.setPlayerPiecesInCheck2();

  }
}

const playerTwo = new Player('black');
const playerOne = new Player('white');


export { Player };