import { chessConfig }  from '../../config/chessConfig.config.js'
import { movePieceHandler } from './movePiece.js';


export const rookMovement = {
    

    returnAvailableSquares(rookPiece ){
        return this.getAvaliableSquares(rookPiece);
    },

  
    getAvaliableSquares(rookPiece) {
        const allPossibleSquares = this.checkAllPossibleSquares(rookPiece.piecePosition[0], rookPiece.piecePosition[1]);

        return ['forwardRows', 'backwardRows', 'leftColumns', 'rightColumns'].reduce((acc, prop) => {
            const squares = allPossibleSquares[prop];
            acc[prop] = {
            collisionFreeSquares: movePieceHandler.checkCollision(squares).collisionFreeSquares,
            possibleCollision: movePieceHandler.checkCollision(squares).possibleCollision
            };
            return acc;
        }, {});
    },

    

   checkAllPossibleSquares(col, row){

        let colIdx = chessConfig.columns.indexOf(col);

        return {
            forwardRows  : Array(8 - Number(row) ).fill().map((_,idx) => Number(row)+1 + idx).map( e => col + e),
            backwardRows : Array( Number(row-1)  ).fill().map((_,idx) => Number(row)-1 - idx).map( e => col + e),
            leftColumns  : chessConfig.columns.slice(0, colIdx).map( e => e + row).reverse(), 
            rightColumns : chessConfig.columns.slice(colIdx + 1, 8).map( e => e + row)
        }
   },
   


}

