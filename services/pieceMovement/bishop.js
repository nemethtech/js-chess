import { chessConfig }  from '../../config/chessConfig.config.js'

export const bishopMovement = {
    
   getAllPossibleSquares(bishopPiece){
 
    const columnPos = bishopPiece.piecePosition[0];
    const rowPos = bishopPiece.piecePosition[1];

    const columArrayOne = chessConfig.columns.slice(chessConfig.columns.indexOf(columnPos)+1, 8 );
    const columArrayTwo = chessConfig.columns.slice(0, chessConfig.columns.indexOf(columnPos)).reverse();

    const rowsWayOne = Array(8 - Number(rowPos) ).fill().map((_,idx) => Number(rowPos)+1 + idx);
    const rowsWayTwo = Array( Number(rowPos-1)  ).fill().map((_,idx) => Number(rowPos)-1 - idx);
    
     return {
 
         lineOneWayOne : this.setSquaresOrUndefined(rowsWayOne ,columArrayOne ).filter(e => e !== undefined), 
         lineOneWayTwo : this.setSquaresOrUndefined(rowsWayTwo ,columArrayOne ).filter(e => e !== undefined), 
         lineTwoWayOne : this.setSquaresOrUndefined(rowsWayOne ,columArrayTwo ).filter(e => e !== undefined), 
         lineTwoWayTwo : this.setSquaresOrUndefined(rowsWayTwo ,columArrayTwo ).filter(e => e !== undefined), 
         
         }   
 
    },

   setSquaresOrUndefined(rows , columnArray){
    return rows.map(( row , i ) => {
        if(chessConfig.columns.includes(columnArray[i])){
            if(row > 0 && row < 9){
                return columnArray[i]+ row;
                }
            }
        })
    },
}

