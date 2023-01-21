import { gameHandler } from '../gameHandler.js'
import { bishopMovement } from './bishop.js';
import { generalMovement } from './general.js'
import { rookMovement } from './rook.js';
import { kingMovement } from './king.js';


export const queenMovement = {
    
    setPotentialSquares(queenPiece){
        if(gameHandler.pieceTurn(queenPiece.pieceColor)){
            generalMovement.setSquares(rookMovement.getAvaliableSquares(queenPiece));
            generalMovement.setSquaresWithCollisionArray(kingMovement.getAvaliableSquares(queenPiece));
            generalMovement.setSquares(bishopMovement.getAvaliableSquares(queenPiece));
        }
    },

    getAvaliableSquares(queenPiece){
        
    }

  
}

