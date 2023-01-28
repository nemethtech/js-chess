import { $, $$ } from '../../utils/utils.js'
import { chessConfig } from '../../config/chessConfig.config.js'
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { checkHandler } from '../checkHandler.js';



export const generalMovement = {

    /*getPotentialSquares(piece){
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
            return { ...rookMovement.returnAvailableSquares(piece), 
                     ...bishopMovement.returnAvailableSquares(piece)};
        }
    },*/


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
         //   console.log('quuen' , { ...rookMovement.checkSquaresWithKing(piece), 
         //       ...bishopMovement.checkSquaresWithKing(piece)});
            return { ...rookMovement.returnAvailableSquares(piece), 
                     ...bishopMovement.returnAvailableSquares(piece)};
        }
    },
    
    markPotentialSquares(piece){
        this.setSquares(this.getPotentialSquares(piece));
        this.setEventsOnPotentialSquares();
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
        checkHandler.clearHandlerObj();
        gameHandler.endTurn();
    }, 
    
    checkPossibleEnemy(square){
        let pieceSquare = $(`[id^="${square}"]`);
        let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
        if(!gameHandler.pieceTurn(pieceColor)){ 
            pieceSquare.classList.add('potential-enemy'); 
            return true;
        }
        return undefined;
    },

    checkCollisionWithKing(arr, bool){         
        let collisionArray = arr.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        let possibleCollision = collisionArray.length === 0 ? undefined  : collisionArray[0];
        if(pieceHandle.getPieceSquareById(possibleCollision)){
            let a = pieceHandle.getPieceSquareById(possibleCollision).firstChild;
       //     console.log('A!!',a);
            
            const pieceColor = a.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = a.getAttribute( 'piece-type' ).split('_')[1];
     
            console.log('king!!',a);
            if(gameHandler.pieceTurn(pieceColor) === bool && pieceType === 'king'){
                console.log('king2!!',a);
                possibleCollision = undefined;
            }

        }
        let collisionFreeSquares = possibleCollision === undefined ? arr : arr.slice(0,(arr.indexOf(possibleCollision)));
        return {
            collisionFreeSquares , 
            possibleCollision
        }  
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

    getCollisionFreeSquares(verifiedSquares){
        const resArr = [];
        Object.values(verifiedSquares).forEach(val => {
            val.collisionFreeSquares.forEach(freeSquareId => {
                resArr.push(freeSquareId);
            })                   
        });      
        return resArr;
    },

    getPossibleCollisionquares(verifiedSquares){
        const resArr = [];
        Object.values(verifiedSquares).forEach(val => {
            val.possibleCollision.forEach(freeSquareId => {
                resArr.push(freeSquareId);
            })                   
        });      
        return resArr;
    },

    filterNonExistentSquares(squareArray){
        return squareArray.filter(e => e.length === 2).filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
    },
}