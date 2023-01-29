import { chessConfig }  from '../../config/chessConfig.config.js'
import { generalMovement } from './general.js'
import { movePieceHandler } from './movePiece.js';



export const bishopMovement = {
    
    returnAvailableSquares(bishopPiece , bool){
        return this.getAvaliableSquares(bishopPiece , bool);
    },

   getAvaliableSquares(bishopPiece ,bool){
    const columArrayOne = chessConfig.columns.slice(chessConfig.columns.indexOf(bishopPiece.piecePosition[0])+1, 8 );
    const columArrayTwo = chessConfig.columns.slice(0, chessConfig.columns.indexOf(bishopPiece.piecePosition[0])).reverse();
    const rowPos = bishopPiece.piecePosition[1];
    return {
        lineOneWayOne : {
            collisionFreeSquares : movePieceHandler.checkCollisionWithKing(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne, bool).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne).possibleCollision
        },
        lineOneWayTwo : {
            collisionFreeSquares : movePieceHandler.checkCollisionWithKing(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo, bool).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo).possibleCollision
        },
        lineTwoWayOne  : {
            collisionFreeSquares : movePieceHandler.checkCollisionWithKing(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne, bool).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne).possibleCollision
        },
        lineTwoWayTwo : {
            collisionFreeSquares : movePieceHandler.checkCollisionWithKing(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo, bool).collisionFreeSquares, 
            possibleCollision    : movePieceHandler.checkCollision(this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo).possibleCollision
        },
    };
   },

   getSquaresOnLine(columnArray , rowPos){
    const rowPosWayOne = columnArray.map((_,idx) => Number(parseInt(rowPos) +1 ) + idx);
    const rowPosWayTwo = columnArray.map((_,idx) => Number(rowPos -1 ) - idx);
    return {
        squaresOnWayOne : movePieceHandler.filterNonExistentSquares(this.zipArrayHelper(columnArray, rowPosWayOne)) , 
        squaresOnWayTwo : movePieceHandler.filterNonExistentSquares(this.zipArrayHelper(columnArray, rowPosWayTwo)) ,
    }
   },

   zipArrayHelper(array1, array2){
    return array1.map(function(e, i) {
        return e +array2[i];
      })
   }
}

