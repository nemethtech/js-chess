import { chessConfig }  from '../../config/chessConfig.config.js'


export const rookMovement = {
    
   getAllPossibleSquares(rookPiece){

    const col = rookPiece.piecePosition[0];
    const row = rookPiece.piecePosition[1];
    let colIdx = chessConfig.columns.indexOf(col);

    return {
        forwardRows  : Array(8 - Number(row) ).fill().map((_,idx) => Number(row)+1 + idx).map( e => col + e),
        backwardRows : Array( Number(row-1)  ).fill().map((_,idx) => Number(row)-1 - idx).map( e => col + e),
        leftColumns  : chessConfig.columns.slice(0, colIdx).map( e => e + row).reverse(), 
        rightColumns : chessConfig.columns.slice(colIdx + 1, 8).map( e => e + row)
    }
},

}

