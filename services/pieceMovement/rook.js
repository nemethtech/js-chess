import { chessConfig }  from '../../config/chessConfig.config.js'
import { movePieceHandler } from './movePiece.js';


export const rookMovement = {
    

    returnAvailableSquares(rookPiece , bool){
        return this.getAvaliableSquares(rookPiece , bool);
    },

    getAvaliableSquares(rookPiece , bool){
        let allPossibleSquares = this.checkAllPossibleSquares(rookPiece.piecePosition[0], rookPiece.piecePosition[1]);
        return {
            forwardRows : {
                collisionFreeSquares : movePieceHandler.checkCollisionWithKing(allPossibleSquares.forwardRows, bool).collisionFreeSquares, 
                possibleCollision    : movePieceHandler.checkCollision(allPossibleSquares.forwardRows).possibleCollision
            },
            backwardRows : {
                collisionFreeSquares : movePieceHandler.checkCollisionWithKing(allPossibleSquares.backwardRows, bool).collisionFreeSquares, 
                possibleCollision    : movePieceHandler.checkCollision(allPossibleSquares.backwardRows).possibleCollision
            },
            leftColumns  : {
                collisionFreeSquares : movePieceHandler.checkCollisionWithKing(allPossibleSquares.leftColumns, bool).collisionFreeSquares, 
                possibleCollision    : movePieceHandler.checkCollision(allPossibleSquares.leftColumns).possibleCollision
            },
            rightColumns : {
                collisionFreeSquares : movePieceHandler.checkCollisionWithKing(allPossibleSquares.rightColumns, bool).collisionFreeSquares, 
                possibleCollision    : movePieceHandler.checkCollision(allPossibleSquares.rightColumns).possibleCollision
            },
        };

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

