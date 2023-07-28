import { chessConfig }  from '../../config/chessConfig.config.js'
import { movePieceHandler } from './movePiece.js';

export const bishopMovement = {
    
   getAllPossibleSquares(bishopPiece){
 
     const columArrayOne = chessConfig.columns.slice(chessConfig.columns.indexOf(bishopPiece.piecePosition[0])+1, 8 );
     const columArrayTwo = chessConfig.columns.slice(0, chessConfig.columns.indexOf(bishopPiece.piecePosition[0])).reverse();
     const rowPos = bishopPiece.piecePosition[1];
 
     return {
 
         lineOneWayOne : this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayOne , 
         lineOneWayTwo : this.getSquaresOnLine(columArrayOne, rowPos).squaresOnWayTwo , 
         lineTwoWayOne : this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayOne ,
         lineTwoWayTwo : this.getSquaresOnLine(columArrayTwo, rowPos).squaresOnWayTwo ,    
         
         }   
 
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

