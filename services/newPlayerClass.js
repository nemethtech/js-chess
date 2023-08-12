import { $$ } from "../../utils/utils.js";
import { chessConfig } from "../config/chessConfig.config.js";
import { enemyStatus } from "./enemyStatus.js";

export class NewPlayer {

    #NewPlayerPieces;
    #NewEnemyPieces;
    #CheckStatus;
    #allEnemyMoveSquare;
    #PlayerPiecesMoves;

    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      NewPlayer.instances[color] = this;
    }
    
    get allEnemyMoveSquare() {
        return this.#allEnemyMoveSquare;
    }
    setNewPlayerPieces(){
        this.#NewPlayerPieces = this.getPlayerPieces(this.playerColor);
    }

    setNewEnemyPieces(){
        this.#NewEnemyPieces  = this.getPlayerPieces(this.enemyColor);
    }

    get newPlayerPieces() {
        return this.#NewPlayerPieces;
    }

    get PlayerPiecesMoves() {
        return this.#PlayerPiecesMoves;
    }

    set PlayerPiecesMoves(value){
        this.#PlayerPiecesMoves  = value;
    }

    get newEnemyPieces() {
        return this.#NewEnemyPieces;
    }

    get CheckStatus() {
        return this.#CheckStatus;
    }

    getPlayerPieceByPosition(position){
        return this.#NewPlayerPieces.find( enemyPiece => enemyPiece.piecePosition ===  position);
    }

    getEnemyPieceByPosition(position){
        return this.#NewEnemyPieces.find( enemyPiece => enemyPiece.piecePosition ===  position);
    }

    getPlayerPieces(color){

      const playerPieces = [];

      $$(`[pieceColor^="${color}"]`).forEach(piece => {

          const piecePosition = piece.getAttribute( 'piecePosition' );
          const pieceColor = piece.getAttribute( 'pieceColor' );
          const pieceType = piece.getAttribute( 'pieceType' );
          
          const handleParams = {
              piece,
              pieceType, 
              piecePosition,
              pieceColor,
          }

          playerPieces.push(handleParams);

      }); 

      return playerPieces;
    }

    get enemyPlayer(){
        return NewPlayer.instances[chessConfig.currentEnemy];
    }

    initPlayer(){
        this.setNewPlayerPieces();
        this.setNewEnemyPieces();
        this.processEnemeyInfo();
       
    }
    
    processEnemeyInfo(){
        const enemyInfo = enemyStatus.getEnemyInfo();
        console.log('enemyInfo',enemyInfo);
        if(enemyInfo.checkStatus.playerInCheck){
            this.#CheckStatus = enemyInfo.CheckStatus;
        }else{
            this.#CheckStatus = { CheckStatus  : {  playerInCheck : false ,  } } ;

        }
        if(enemyInfo.pinInfo.arePinedPiece){
            enemyInfo.pinInfo.pinInfo.forEach( pinInfo => {
                const playerPiece = this.newPlayerPieces.find( piece =>  pinInfo.pinedPlayerPiece ===  piece.piecePosition );
                playerPiece.isPined = true;
                playerPiece.pinInfo = pinInfo;
            } )
        }

        this.#allEnemyMoveSquare = enemyInfo.allEnemyMoveSquare;
        enemyInfo.backedUpEnemeyPieces.forEach( enemyPieceBackedUp => {
            const piece = this.newEnemyPieces.find( enemyPiece =>  enemyPieceBackedUp ===  enemyPiece.piecePosition );
            piece.backedUp = true;
        } )
    }

}
  
NewPlayer.instances = {};
  
NewPlayer.getPlayer = ()  => {
return NewPlayer.instances[chessConfig.currentTurn];
}

export const NewPlayerTwo = new NewPlayer('black');
export const NewPlayerOne = new NewPlayer('white');
