import { gameHandler } from '../gameHandler.js'
import { chessConfig }  from '../../config/chessConfig.config.js'
import { generalMovement } from './general.js'


export const bishopMovement = {
    
    setPotentialSquares(bishopPiece){
        if(gameHandler.pieceTurn(bishopPiece.pieceColor)){
            generalMovement.setSquares(this.getAvaliableSquares(bishopPiece));
        }
    },

   getAvaliableSquares(bishopPiece){
    const columArrayOne = chessConfig.columns.slice(chessConfig.columns.indexOf(bishopPiece.piecePosition[0])+1, 8 );
    const columArrayTwo = chessConfig.columns.slice(0, chessConfig.columns.indexOf(bishopPiece.piecePosition[0])).reverse();
    const rowPos = bishopPiece.piecePosition[1];
    return {
        lineOneWayOne : {
            collisionFreeSquares : generalMovement.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne).collisionFreeSquares, 
            possibleCollision    : generalMovement.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne).possibleCollision
        },
        lineOneWayTwo : {
            collisionFreeSquares : generalMovement.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo).collisionFreeSquares, 
            possibleCollision    : generalMovement.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo).possibleCollision
        },
        lineTwoWayOne  : {
            collisionFreeSquares : generalMovement.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne).collisionFreeSquares, 
            possibleCollision    : generalMovement.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne).possibleCollision
        },
        lineTwoWayTwo : {
            collisionFreeSquares : generalMovement.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo).collisionFreeSquares, 
            possibleCollision    : generalMovement.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo).possibleCollision
        },
    };
   },

   getSquaresOnLine(columnArray , rowPos){
    const rowPosWayOne = columnArray.map((_,idx) => Number(parseInt(rowPos) +1 ) + idx);
    const rowPosWayTwo = columnArray.map((_,idx) => Number(rowPos -1 ) - idx);
    return {
        squaresOnWayOne : generalMovement.filterNonExistentSquares(this.zipArrayHelper(columnArray, rowPosWayOne)) , 
        squaresOnWayTwo : generalMovement.filterNonExistentSquares(this.zipArrayHelper(columnArray, rowPosWayTwo)) ,
    }
   },

   zipArrayHelper(array1, array2){
    return array1.map(function(e, i) {
        return e +array2[i];
      })
   }
}

