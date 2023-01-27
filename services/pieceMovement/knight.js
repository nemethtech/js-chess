import { chessConfig } from '../../config/chessConfig.config.js';
import { gameHandler } from '../gameHandler.js'
import { generalMovement } from './general.js'

export const knightMovement = {
    
    returnAvailableSquares(knightPiece){
        return this.getAvaliableSquares(knightPiece);
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
        const horseJump = {};
        availableSquares.forEach((e,i) => {
            horseJump[i] = {
                collisionFreeSquares : generalMovement.checkCollision([e]).collisionFreeSquares,
                possibleCollision : generalMovement.checkCollision([e]).possibleCollision
            }
        })

        return horseJump;
    }
    
}

