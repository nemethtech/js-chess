import { gameHandler } from '../gameHandler.js'
import { chessConfig } from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js'


export const kingMovement = {
    
    returnAvailableSquares(kingPiece){
        if(gameHandler.pieceTurn(kingPiece.pieceColor)){
            return this.getAvaliableSquares(kingPiece);
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
                chessConfig.columns[ colIdx ]+(parseInt(rowPos)+1),
                chessConfig.columns[ colIdx ]+(parseInt(rowPos)-1),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)+1),
                chessConfig.columns[colIdx+1]+(parseInt(rowPos)-1)];

        const availableSquares = generalMovement.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));
        const kingMove = {};
        availableSquares.forEach((e,i) => {
            kingMove[i] = {
                collisionFreeSquares : generalMovement.checkCollision([e]).collisionFreeSquares,
                possibleCollision : generalMovement.checkCollision([e]).possibleCollision
            }
        })
        return kingMove
    }

  
}

