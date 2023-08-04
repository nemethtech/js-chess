import { chessConfig } from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js';

export const knightMovement = {
    
    getAllPossibleSquares(knightPiece){
        const columnPos = knightPiece.piecePosition[0];
        const rowPos    = parseInt(knightPiece.piecePosition[1]);
        const colIdx    = chessConfig.columns.indexOf(columnPos);
        const possibleSquares = 
               [chessConfig.columns[colIdx-2]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx-2]+(parseInt(rowPos)-1),
                chessConfig.columns[colIdx-1]+(parseInt(rowPos)+2),
                chessConfig.columns[colIdx-1]+(parseInt(rowPos)-2),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)+2),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)-2),
                chessConfig.columns[colIdx+2]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx+2]+(parseInt(rowPos)-1)];

        const availableSquares = generalMovement.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));
        const horseJump = {};
        availableSquares.forEach((e,i) => {
            horseJump[i] = [e] ; 
        })

        return horseJump;
    }
    
}

