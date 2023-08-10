import { chessConfig }  from '../../config/chessConfig.config.js';

export const kingMovement = {

  getAllAvaliableSquares(kingPiece){

    const columnPos = kingPiece.piecePosition[0];
    const rowPos    = parseInt(kingPiece.piecePosition[1]);
    const colIdx    = chessConfig.columns.indexOf(columnPos);

    const kingMoveBase = {

        1 : { col : chessConfig.columns[colIdx-1] , row : parseInt(rowPos)+1} , 
        2 : { col : chessConfig.columns[colIdx-1] , row : parseInt(rowPos)-1} , 
        3 : { col : chessConfig.columns[colIdx-1] , row : parseInt(rowPos)} , 
        4 : { col : chessConfig.columns[colIdx]   , row : parseInt(rowPos)+1} , 
        5 : { col : chessConfig.columns[colIdx]   , row : parseInt(rowPos)-1} , 
        6 : { col : chessConfig.columns[colIdx+1] , row : parseInt(rowPos)} , 
        7 : { col : chessConfig.columns[colIdx+1] , row : parseInt(rowPos)+1} , 
        8 : { col : chessConfig.columns[colIdx+1] , row : parseInt(rowPos)-1} , 
        
    };

    const kingMoveChecked = {};

    Object.values(kingMoveBase).forEach( (kingMove , idx ) => {
          if(kingMove.col !== undefined && (kingMove.row > 0 && kingMove.row < 9)){
            kingMoveChecked[idx] = [kingMove.col + kingMove.row];  
          }  
      });
    
    return kingMoveChecked;
  }

}

