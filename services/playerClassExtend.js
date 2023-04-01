import { chessConfig } from "../config/chessConfig.config.js";
import { BasePlayer } from "./playerClass.js";

class Player extends BasePlayer {

  setIfPlayerCheckIsOn(){

    Player.instanceByColor(this.enemyColor).pieceCollisions.forEach( pieceCollision => {
      
      if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
        this.isPlayerInCheck = true;
        return;
      }
    })
  }

  checkIfPlayerInCheck(){

    this.setIfPlayerCheckIsOn();
    if(this.isPlayerInCheck){
      this.gatherCheckInfo();
      this.checkThreat.forEach( threat => {
        console.log('color ' , this.playerColor);
        console.log('threat',threat);
      })
    }
    console.log('Color : ' , this.playerColor , ' Csekk? : ' , this.isPlayerInCheck);
  }
   
  gatherCheckInfo(){
    if(this.isPlayerInCheck){
      Player.instanceByColor(this.enemyColor).pieceCollisions.forEach( pieceCollision => {
        if(pieceCollision.colPieceType.includes('king') && pieceCollision.colType === 'enemy'){
          this.checkThreat.push(pieceCollision);
        }
      })
    }
  }


  pieceCanBlockCheck(piece){   

    let pieceCanBlockCheck = false;

    if(this.checkThreat.length !== 1){
        return false;
    }
    let playerPieceCollisions = Player.instanceByColor(chessConfig.currentTurn).pieceCollisions;
    let playerPieceColFreeMoves = Player.instanceByColor(chessConfig.currentTurn).pieceColFreeMoves;

    const playerPiecesCanAttackThreat = playerPieceCollisions.filter( pieceCol =>  
          pieceCol.colPiecePosition === this.checkThreat[0].playerPiecePosition);

    if(playerPiecesCanAttackThreat.length > 0){
      playerPiecesCanAttackThreat.forEach( pieceCol => {
        if(pieceCol.playerPiecePosition === piece.piecePosition){
          console.log('true');
          pieceCanBlockCheck =  true;
        }
      })
    }

    const playerPieceColFreeeMoves = playerPieceColFreeMoves.filter( pieceColFreeMove =>  
      pieceColFreeMove.playerPiecePosition === piece.piecePosition);
    //  console.log('playerPieceColFreeeMoves',playerPieceColFreeeMoves);

    if(playerPieceColFreeeMoves.length > 0){
      playerPieceColFreeeMoves.forEach( colFreeeMove => {
        this.checkThreat[0].colMoveSquares.forEach( threatMoveSquare => {
          if(colFreeeMove.colFreeMoveSquares.includes(threatMoveSquare)){
            pieceCanBlockCheck = true;
          }
        })
      })
    }

    return pieceCanBlockCheck;
  }

  pieceCanBlockCheck2(piece){   

    let pieceMoveDirections = [];
    
    if(this.checkThreat.length !== 1){
        return false;
    }
    let playerPieceCollisions = Player.instanceByColor(chessConfig.currentTurn).pieceCollisions;
    let playerPieceColFreeMoves = Player.instanceByColor(chessConfig.currentTurn).pieceColFreeMoves;

    const playerPiecesCanAttackThreat = playerPieceCollisions.filter( pieceCol =>  
          pieceCol.colPiecePosition === this.checkThreat[0].playerPiecePosition);

    if(playerPiecesCanAttackThreat.length > 0){
      playerPiecesCanAttackThreat.forEach( pieceCol => {
        if(pieceCol.playerPiecePosition === piece.piecePosition){
          console.log('true');
          pieceMoveDirections.push(pieceCol.direction);
        }
      })
    }
    
    const playerPieceColFreeeMoves = playerPieceColFreeMoves.filter( pieceColFreeMove =>  
      pieceColFreeMove.playerPiecePosition === piece.piecePosition);
      //  console.log('playerPieceColFreeeMoves',playerPieceColFreeeMoves);
      
      if(playerPieceColFreeeMoves.length > 0){
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

  setPlayerPiecesInCheck(){
    if(this.isPlayerInCheck){
      Player.instanceByColor(this.playerColor).playerPieces.forEach( playerPiece => {
        if(this.pieceCanBlockCheck2(playerPiece).length !== 0){
          playerPiece.canBlockCheck = true;
          playerPiece.canBlockCheckDirections = this.pieceCanBlockCheck2(playerPiece);
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
            filteredMove[direction] = pieceMove[direction];
          }
        } 
    }
    return filteredMove;
  }

  setPlayerPieces(){

    this.setPlayerValuesToDefault();
    this.getPlayerPieces();
    this.setPieceIsBackedUp();
    this.getAttackerSquares();
    this.setPieceCollisions();
    this.setPieceColFreeMoves();
    this.checkIfPlayerInCheck();
    this.setPlayerPiecesInCheck();

  }
  
}

const playerTwo = new Player('black');
const playerOne = new Player('white');


export { Player };