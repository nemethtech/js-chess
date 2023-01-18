import { $, $$ } from '../../utils/utils.js'
import { pieceHandle } from '../pieceHandler.js';
import { rookMovement } from '../pieceMovement/rook.js'
import { pawnMovement } from '../pieceMovement/pawn.js'
import { gameHandler } from '../gameHandler.js';

export const generalMovement = {
    
    markPotentialSquares(handleParams){
        if(handleParams.pieceType === 'rook'){
          rookMovement.setPotentialSquares(handleParams);
        }else if(handleParams.pieceType === 'pawn'){
          pawnMovement.setPotentialSquares(handleParams);
        }
    },

    clearPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );;
            pieceBox.removeEventListener( 'click', this.movePiece)
        });
      
    },
    
    setEventsOnPotentialSquares(handleParams){
        console.log('handleParams:',handleParams);
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
        console.log('square:',square);
        let pieceSquare = $(`[id^="${square}"]`);
        let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
        if(!gameHandler.pieceTurn(pieceColor)){ 
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
        console.log('verifiedSquares',verifiedSquares);
        Object.values(verifiedSquares).forEach(val => {
            val.collisionFreeSquares.forEach(freeSquareId => {
                $(`[id^="${freeSquareId}"]`).classList.add( 'potential-square');
            })                   
            if(val.possibleCollision)generalMovement.checkPossibleEnemy(val.possibleCollision);
        });        
    },
}