import { chessConfig }  from '../../config/chessConfig.config.js'
import { movePieceHandler } from './movePiece.js';

export const bishopMovement = {
    
    returnAvailableSquares(bishopPiece){
        
        return this.getAvaliableSquares(bishopPiece);
    },

   getAvaliableSquares(bishopPiece){

    const columArrayOne = chessConfig.columns.slice(chessConfig.columns.indexOf(bishopPiece.piecePosition[0])+1, 8 );
    const columArrayTwo = chessConfig.columns.slice(0, chessConfig.columns.indexOf(bishopPiece.piecePosition[0])).reverse();
    const rowPos = bishopPiece.piecePosition[1];

    return {
        lineOneWayOne : {
            collisionFreeSquares : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne).possibleCollision
        },
        lineOneWayTwo : {
            collisionFreeSquares : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo).possibleCollision
        },
        lineTwoWayOne  : {
            collisionFreeSquares : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne).possibleCollision
        },
        lineTwoWayTwo : {
            collisionFreeSquares : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo).possibleCollision
        },
    };
   },

   getSquaresOnLine(columnArray , rowPos){

    const rowPosWayOne = columnArray.map((_,idx) => Number(parseInt(rowPos) +1 ) + idx);
    const rowPosWayTwo = columnArray.map((_,idx) => Number(rowPos -1 ) - idx);

        return {
            squaresOnWayOne : movePieceHandler.filterNonExistentSquares(this.zipArray(columnArray, rowPosWayOne)) , 
            squaresOnWayTwo : movePieceHandler.filterNonExistentSquares(this.zipArray(columnArray, rowPosWayTwo)) ,
        }
   },

   zipArray(array1, array2){

    return array1.map(function(e, i) {
        return e +array2[i];
      })

   }
}

