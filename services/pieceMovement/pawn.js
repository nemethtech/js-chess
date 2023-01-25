import { $ } from '../../utils/utils.js'
import { gameHandler } from '../gameHandler.js'
import { pieceHandle } from '../pieceHandler.js';
import { generalMovement } from './general.js'



export const pawnMovement = {
    
    returnAvailableSquares(pawnPiece){
        //console.log('PAWN',pawnPiece);
        if(gameHandler.pieceTurn(pawnPiece.pieceColor)){
            const firstMove = this.isTheFirstMove(pawnPiece) ? true : false ;
            return this.getAvaliableSquares(pawnPiece, firstMove);
        }
    },

    isTheFirstMove(pawnPiece){
        if(pawnPiece.pieceColor === 'white' &&
           pawnPiece.piecePosition[1] === '2' ||
           pawnPiece.pieceColor === 'black' &&
           pawnPiece.piecePosition[1] === '7') {
            return true;
        } else{
            return false;
        }
    },
   
   getPossiblyEnemyIdVals(pawnPiece){
        const ownSquareVal = $(`[id^="${pawnPiece.piecePosition}"]`).getAttribute('id_val');
        const moveSide = pawnPiece.pieceColor === 'white' ? 1 : - 1 ;
        var sideOrder = {
            first: ()=>{
                if( parseInt(ownSquareVal) + 7 * moveSide < 64 &&  parseInt(ownSquareVal) + 7 * moveSide > 0 && 
                    parseInt(ownSquareVal) % 8  !== 1 ){return parseInt(ownSquareVal) + 7 * moveSide;}  
            }, 
            second : ()=>{
                if( parseInt(ownSquareVal) + 9  * moveSide < 64  &&  parseInt(ownSquareVal) + 9 * moveSide > 0 && 
                    parseInt(ownSquareVal) % 8  !== 0 ){return parseInt(ownSquareVal) + 9 * moveSide ;}  
                }
        };
        return sideOrder;
    },

   getForwardSquares(pawnPiece, forwardSquareQuantity){
        const ownSquareVal = parseInt($(`[id^="${pawnPiece.piecePosition}"]`).getAttribute('id_val'));
        const moveSide = pawnPiece.pieceColor === 'white' ? 1 : -1 ;
        if(forwardSquareQuantity > 1){
            return [ pieceHandle.getIdByIdVal(ownSquareVal+(8*moveSide)),
                     pieceHandle.getIdByIdVal(ownSquareVal+(16*moveSide))]
        }else{
            return [ pieceHandle.getIdByIdVal(ownSquareVal+(8*moveSide))]
        }
   },

   getAvaliableSquares(pawnPiece, firstMove){
        var [forwardSquares,rigtPosEn,leftPosEn] = [undefined]
        if(firstMove){
            forwardSquares = this.getForwardSquares(pawnPiece, 2);
        }else{
            forwardSquares = this.getForwardSquares(pawnPiece, 1);
        }
        if($(`[id_val^="${this.getPossiblyEnemyIdVals(pawnPiece).first()}"]`)){
            rigtPosEn = $(`[id_val^="${this.getPossiblyEnemyIdVals(pawnPiece).first()}"]`).firstChild === null ? undefined : pieceHandle.getIdByIdVal(this.getPossiblyEnemyIdVals(pawnPiece).first());
        }
        if($(`[id_val^="${this.getPossiblyEnemyIdVals(pawnPiece).second()}"]`)){
            leftPosEn = $(`[id_val^="${this.getPossiblyEnemyIdVals(pawnPiece).second()}"]`).firstChild === null ? undefined : pieceHandle.getIdByIdVal(this.getPossiblyEnemyIdVals(pawnPiece).second());
        }
        return{
            forwardRows : {
                collisionFreeSquares : generalMovement.checkCollision(forwardSquares).collisionFreeSquares, 
                possibleCollision    : undefined
            },
            rightCol : {
                collisionFreeSquares : [] , 
                possibleCollision    : rigtPosEn
            },
            leftCol : {
                collisionFreeSquares : [] , 
                possibleCollision    : leftPosEn
            },
        }
    },
}

