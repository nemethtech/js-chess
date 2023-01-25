import { $, $$ } from '../../utils/utils.js'
import { chessConfig } from '../../config/chessConfig.config.js'
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';



export const generalMovement = {
    
    markPotentialSquares(piece){
        if(piece.pieceType === 'rook'){
            this.setSquares(rookMovement.returnAvailableSquares(piece));
        }else if(piece.pieceType === 'pawn'){
            this.setSquares(pawnMovement.returnAvailableSquares(piece));
        }else if(piece.pieceType === 'bishop'){
            this.setSquares(bishopMovement.returnAvailableSquares(piece));
        }else if(piece.pieceType === 'knight'){
            this.setSquares(knightMovement.returnAvailableSquares(piece));
        }else if(piece.pieceType === 'king'){
            this.setSquares(kingMovement.returnAvailableSquares(piece));
        }else if(piece.pieceType === 'queen'){
            this.setSquares(rookMovement.returnAvailableSquares(piece));
            this.setSquares(bishopMovement.returnAvailableSquares(piece));
        }
    },

    getPotentialSquares(piece){
        if(piece.pieceType === 'rook'){
            return rookMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'pawn'){
            return pawnMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'bishop'){
            return bishopMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'knight'){
            return knightMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'king'){
            return kingMovement.returnAvailableSquares(piece);
        }else if(piece.pieceType === 'queen'){
            return rookMovement.returnAvailableSquares(piece),
                   bishopMovement.returnAvailableSquares(piece);
        }
    },

    clearPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );;
            pieceBox.removeEventListener( 'click', this.movePiece)
        });
    },
    
    setEventsOnPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', this.movePiece)
        });
    },

    movePiece : function(event) {
        const piece = pieceHandle.pieceSelected();
        let newSqaureValue ;
        if(pieceHandle.isTargetEnemyPiece(event.target)){
            const targetDiv = event.target.parentNode;
            targetDiv.removeChild(event.target);
            targetDiv.append(piece);
            newSqaureValue = targetDiv.getAttribute('id');
        }else{
            newSqaureValue = event.target.getAttribute('id');
            event.target.append(piece);
        }
        piece.setAttribute('new-piece-square', newSqaureValue);
        pieceHandle.removeSelected();
        gameHandler.endTurn();
    }, 
    
    checkPossibleEnemy(square){
        let pieceSquare = $(`[id^="${square}"]`);
        let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
        if(!gameHandler.pieceTurn(pieceColor)){ 
            console.log('pieceSquare.firstChild.',pieceSquare.firstChild);
            pieceSquare.classList.add('potential-enemy'); 
            return true;
        }
        return undefined;
    },

    checkCollision(arr){         
        let collisionArray = arr.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        let possibleCollision = collisionArray.length === 0 ? undefined  : collisionArray[0];
        let collisionFreeSquares = possibleCollision === undefined ? arr : arr.slice(0,(arr.indexOf(possibleCollision)));
        return {
            collisionFreeSquares , 
            possibleCollision
        }  
    },

    setSquares(verifiedSquares){
        Object.values(verifiedSquares).forEach(val => {
            val.collisionFreeSquares.forEach(freeSquareId => {
                $(`[id^="${freeSquareId}"]`).classList.add( 'potential-square');
            })                   
            if(val.possibleCollision)generalMovement.checkPossibleEnemy(val.possibleCollision);
        });        
    },

    filterNonExistentSquares(squareArray){
        return squareArray.filter(e => e.length === 2).filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
    },
}