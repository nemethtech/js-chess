import { chessConfig } from '../../config/chessConfig.config.js';


export const pawnMovement = {
    
   getAllPossibleSquares(pawnPiece){
        const forwardRows = this.getForwardSquares(pawnPiece);
        const sideSquares = this.getSideSquares(pawnPiece);
        const rightColumn =  sideSquares.rightSideSquare === undefined ? [] : [sideSquares.rightSideSquare]; 
        const leftColumn  =  sideSquares.leftSideSquare === undefined ? [] : [sideSquares.leftSideSquare]; 

        return{
            forwardRows , 
            rightColumn ,
            leftColumn  ,
        }
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


   
}

