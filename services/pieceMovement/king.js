import { chessConfig }  from '../../config/chessConfig.config.js';
import { movePieceHandler } from './movePiece.js';
import {  Player } from '../playerClassExtend.js';

export const kingMovement = {

  returnAvailableSquares(kingPiece){

      return this.getAvailableSquares(kingPiece);
  },

  getAllAvaliableSquares(kingPiece){

    const columnPos = kingPiece.piecePosition[0];
    const rowPos    = parseInt(kingPiece.piecePosition[1]);
    const colIdx    = chessConfig.columns.indexOf(columnPos);
    const possibleSquares = 
            [chessConfig.columns[colIdx-1]+(parseInt(rowPos)+1),
            chessConfig.columns[colIdx-1]+(parseInt(rowPos)-1),
            chessConfig.columns[colIdx-1]+(parseInt(rowPos)),
            chessConfig.columns[ colIdx ]+(parseInt(rowPos)+1),
            chessConfig.columns[ colIdx ]+(parseInt(rowPos)-1),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)+1),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)-1)];

    const availableSquares = movePieceHandler.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));
    const kingMove = {};
    availableSquares.forEach((e,i) => {
      kingMove[i] = [e] ; 
    })
    return kingMove;
  },
  
}

