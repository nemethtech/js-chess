import { chessConfig } from '../../config/chessConfig.config.js';
import { movePieceHandler } from './movePiece.js';


export const pawnMovement = {
    
    returnAvailableSquares(pawnPiece){
        return this.buildPawnMove(pawnPiece);
    },
  
   getPawnMoveOrder(pawnPiece){
        return  pawnPiece.pieceColor === 'white' ? 1 : -1;
   },
 
   isTheFirstMove(pawnPiece){
        const startingPosToCheck = pawnPiece.pieceColor === 'white' ? '2' : '7';
        return pawnPiece.piecePosition[1] === startingPosToCheck;
    },
    
    getForwardSquares(pawnPiece){
        const moveDirection = this.getPawnMoveOrder(pawnPiece);
        const firstSquareForward =  pawnPiece.piecePosition[0] +  (parseInt(pawnPiece.piecePosition[1]) + 1 * moveDirection);
        const secondSquareForward =  pawnPiece.piecePosition[0] + (parseInt(pawnPiece.piecePosition[1]) + 2 * moveDirection);
        if(this.isTheFirstMove(pawnPiece)){
            return [ firstSquareForward , secondSquareForward ]
        }else{
            return [ firstSquareForward];
        }
    },

    getSideSquares(pawnPiece){
        const moveDirection = this.getPawnMoveOrder(pawnPiece);
        const columnIndex = chessConfig.columns.indexOf(pawnPiece.piecePosition[0]);
        const rightColumn  = chessConfig.columns?.[columnIndex+1] ;
        const leftColumn  = chessConfig.columns?.[columnIndex-1] ;
        const forwardRowSquare = parseInt(pawnPiece.piecePosition[1]) + 1 * moveDirection;
        const rightSideSquare = rightColumn === undefined ? undefined : rightColumn + forwardRowSquare;
        const leftSideSquare  = leftColumn  === undefined ? undefined : leftColumn + forwardRowSquare;
 
       return {
           rightSideSquare,
           leftSideSquare
        }
    },

    buildPawnMove(pawnPiece){
        let sideSquares = this.getSideSquares(pawnPiece);
        const rightSide =  sideSquares.rightSideSquare === undefined ? [] : [sideSquares.rightSideSquare]; 
        const leftSide  =  sideSquares.leftSideSquare === undefined ? [] : [sideSquares.leftSideSquare]; 

        return{
            forwardRows : {
                collisionFreeSquares : movePieceHandler.checkCollision(this.getForwardSquares(pawnPiece)).collisionFreeSquares,
            },
            rightColumn : {
                possibleCollision    : movePieceHandler.checkCollision(rightSide).possibleCollision,
            },
            leftColumn : {
                possibleCollision    : movePieceHandler.checkCollision(leftSide).possibleCollision, 
            },
        }
    },
}

