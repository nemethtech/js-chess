import { chessConfig } from '../../config/chessConfig.config.js';
import { $ } from '../../utils/utils.js'
import { gameHandler } from '../gameHandler.js'
import { generalMovement } from './general.js'

export const knightMovement = {
    
    setPotentialSquares(knightPiece){
        if(gameHandler.pieceTurn(knightPiece.pieceColor)){
           generalMovement.setSquaresWithCollisionArray(this.getAvaliableSquares(knightPiece));
        }
    },

    getAvaliableSquares(knightPiece){
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
        const collisionArray = availableSquares.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        const collisionFreeSquares = availableSquares.filter(x => !collisionArray.includes(x));

        return {
            horseJump : {
                collisionFreeSquares : collisionFreeSquares, 
                possibleCollision    : collisionArray
            }
        }
    }
}

