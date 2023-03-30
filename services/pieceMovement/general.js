import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { movePieceHandler } from './movePiece.js';
import { $ , $$ } from '../../utils/utils.js';


export const generalMovement = {


    getPotentialSquares(piece, bool){
        if(piece.pieceType === 'rook'){
            return rookMovement.returnAvailableSquares(piece , bool);
        }else if(piece.pieceType === 'pawn'){
            return pawnMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'bishop'){
            return bishopMovement.returnAvailableSquares(piece , bool);
        }else if(piece.pieceType === 'knight'){
            return knightMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'king'){
            return kingMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'queen'){
            return { ...rookMovement.returnAvailableSquares(piece , bool), 
                     ...bishopMovement.returnAvailableSquares(piece ,bool)};
        }
    },
    
    markPotentialSquares(piece){
        this.setSquares(this.getPotentialSquares(piece));
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
            pieceBox.classList.remove( 'potential-square' );;
            pieceBox.removeEventListener( 'click', movePieceHandler.movePiece)
        });
    },
    
    setEventsOnPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', movePieceHandler.movePiece)
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