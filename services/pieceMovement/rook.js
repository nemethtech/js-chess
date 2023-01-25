import { $ } from '../../utils/utils.js'
import { gameHandler } from '../gameHandler.js'
import { chessConfig }  from '../../config/chessConfig.config.js'
import { generalMovement } from './general.js'

export const rookMovement = {
    
    potentialSquares : {},
  
    returnAvailableSquares(rookPiece){
        this.potentialSquares = {};
        if(gameHandler.pieceTurn(rookPiece.pieceColor)){
            return this.getAvaliableSquares(rookPiece);
        }
    },

    getAvaliableSquares(rookPiece){
        let allPossibleSquares = this.checkAllPossibleSquares(rookPiece.piecePosition[0], rookPiece.piecePosition[1]);
        return {
            forwardRows : {
                collisionFreeSquares : generalMovement.checkCollision(allPossibleSquares.forwardRows).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.forwardRows).possibleCollision
            },
            backwardRows : {
                collisionFreeSquares : generalMovement.checkCollision(allPossibleSquares.backwardRows).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.backwardRows).possibleCollision
            },
            leftColumns  : {
                collisionFreeSquares : generalMovement.checkCollision(allPossibleSquares.leftColumns).collisionFreeSquares, 
                possibleCollision    : generalMovement.checkCollision(allPossibleSquares.leftColumns).possibleCollision
            },
            rightColumns : {
                collisionFreeSquares : generalMovement.checkCollision(allPossibleSquares.rightColumns).collisionFreeSquares, 
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

