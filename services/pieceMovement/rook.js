import { chessConfig }  from '../../config/chessConfig.config.js'
import { generalMovement } from './general.js'

export const rookMovement = {
    
    potentialSquares : {},
  
    returnAvailableSquares(rookPiece){
        this.potentialSquares = {};
        return this.getAvaliableSquares(rookPiece);
    },

    getAvaliableSquares(rookPiece){
        let allPossibleSquares = this.checkAllPossibleSquares(rookPiece.piecePosition[0], rookPiece.piecePosition[1]);
        return {
            forwardRows : {
                collisionFreeSquares : generalMovement.checkCollisionWithKing(allPossibleSquares.forwardRows).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.forwardRows).possibleCollision
            },
            backwardRows : {
                collisionFreeSquares : generalMovement.checkCollisionWithKing(allPossibleSquares.backwardRows).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.backwardRows).possibleCollision
            },
            leftColumns  : {
                collisionFreeSquares : generalMovement.checkCollisionWithKing(allPossibleSquares.leftColumns).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.leftColumns).possibleCollision
            },
            rightColumns : {
                collisionFreeSquares : generalMovement.checkCollisionWithKing(allPossibleSquares.rightColumns).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.rightColumns).possibleCollision
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

