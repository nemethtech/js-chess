import { $ } from '../../utils/utils.js'
import { gameHandler } from '../gameHandler.js'
import { chessConfig } from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js'


export const kingMovement = {
    
    setPotentialSquares(kingPiece){
        if(gameHandler.pieceTurn(kingPiece.pieceColor)){
            generalMovement.setSquaresWithCollisionArray(this.getAvaliableSquares(kingPiece));
        }
    },

    getAvaliableSquares(kingPiece){
        const columnPos = kingPiece.piecePosition[0];
        const rowPos    = parseInt(kingPiece.piecePosition[1]);
        const colIdx    = chessConfig.columns.indexOf(columnPos);
        const possibleSquares = 
               [chessConfig.columns[colIdx-1]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx-1]+(parseInt(rowPos)-1),
                chessConfig.columns[colIdx-1]+(parseInt(rowPos)),
                chessConfig.columns[colIdx]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx]+(parseInt(rowPos)-1),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)-1)];

        const availableSquares = generalMovement.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));
        const collisionArray = availableSquares.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        const collisionFreeSquares = availableSquares.filter(x => !collisionArray.includes(x));

        return {
            kingMove : {
                collisionFreeSquares : collisionFreeSquares, 
                possibleCollision    : collisionArray
            }
        }
    }

  
}

