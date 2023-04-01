import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { movePieceHandler } from './movePiece.js';
import { $ , $$ } from '../../utils/utils.js';
import { Player } from '../playerClassExtend.js';
import { chessConfig } from '../../config/chessConfig.config.js';


export const generalMovement = {



    getPieceMove(piece) {
        switch (piece.pieceType) {
          case 'rook':
            return rookMovement.returnAvailableSquares(piece);
          case 'pawn':
            return pawnMovement.returnAvailableSquares(piece);
          case 'bishop':
            return bishopMovement.returnAvailableSquares(piece);
          case 'knight':
            return knightMovement.returnAvailableSquares(piece);
          case 'king':
            return kingMovement.returnAvailableSquares(piece);
          case 'queen':
            return {
              ...rookMovement.returnAvailableSquares(piece),
              ...bishopMovement.returnAvailableSquares(piece)
            }
        }
      },
    
    markPotentialSquares(piece){
        let pieceMove = this.getPieceMove(piece);
        //filterPieceMoveIfPlayerUnderCheck
        if(Player.instanceByColor(chessConfig.currentTurn).isPlayerInCheck && piece.pieceType !== 'king'){
            pieceMove =  Player.instanceByColor(chessConfig.currentTurn).filterPieceMoveIfPlayerUnderCheck(piece , pieceMove)
        }
        this.setSquares(pieceMove);
        this.setEventsOnPotentialSquares();
    },

    getCollisionFreeSquares(verifiedSquares){
        const collisionFreeSquares = [];
        Object.values(verifiedSquares).forEach(val => {
            if(!generalMovement.valueNullOrUndefined(val.collisionFreeSquares)){
                val.collisionFreeSquares.forEach(freeSquareId => {
                    collisionFreeSquares.push(freeSquareId);
                })                   
            }
        });      
        return collisionFreeSquares;
    },

    getPossibleCollisionquares(verifiedSquares){

        const collisionSquares = [];
        Object.values(verifiedSquares).forEach(val => {
            verifiedSquares
            if(!this.valueNullOrUndefined(val.possibleCollision))collisionSquares.push(val.possibleCollision);             
        });      

        return collisionSquares;
    },

    getPossibleCollisionquares2(pieceMove){
        
        let collisionSquares = [];

        for (const direction in pieceMove) {
            if (Object.hasOwn(pieceMove,direction)) {
                if(!this.valueNullOrUndefined(pieceMove[direction].possibleCollision)){
                    collisionSquares.push({
                        direction : direction ,
                        square : pieceMove[direction].possibleCollision            
                    })
                }
            }
        }
          
        return collisionSquares;
    },
    
    getCollisionFreeSquares2(pieceMove){
        const collisionFreeSquares = [];
        for (const direction in pieceMove) {
            if (Object.hasOwn(pieceMove,direction)) {
                if(!this.valueNullOrUndefined(pieceMove[direction].collisionFreeSquares)){
                    collisionFreeSquares.push({
                        direction : direction ,
                        square : pieceMove[direction].collisionFreeSquares            
                    })
                }
            }
        }  
        
        return collisionFreeSquares;
    },

    setSquares(verifiedSquares){
        Object.values(verifiedSquares).forEach(val => {
            if(!this.valueNullOrUndefined(val.collisionFreeSquares)){
                val.collisionFreeSquares.forEach(freeSquareId => {
                    $(`[id^="${freeSquareId}"]`).classList.add( 'potential-square');
                })                   
            }
            if(!this.valueNullOrUndefined(val.possibleCollision)){
                movePieceHandler.checkAndMarkPossibleEnemy(val.possibleCollision.toString());
            }
        });        
    },

    clearPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );
            pieceBox.removeEventListener( 'click', movePieceHandler.movePiece);
        });
    },
    
    setEventsOnPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', movePieceHandler.movePiece);
        });
    },

    valueNullOrUndefined(value){
        return value == null ? true : false;
    },

    simplifyArray(array){
        const mergedSquares = array.flat(1);
        const simplifiedArray =  mergedSquares.filter((element, index) => {
            return mergedSquares.indexOf(element) === index;
        });
        return simplifiedArray;
      },

}