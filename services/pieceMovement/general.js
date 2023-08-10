import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { $ } from '../../utils/utils.js';
import { chessConfig } from '../../config/chessConfig.config.js';
import { eventHandler } from '../eventHandler.js';


export const generalMovement = {


    getPieceMoveUnfiltered(piece){

        switch (piece.pieceType) {
            case 'rook':
            return rookMovement.getAllPossibleSquares(piece);
            case 'pawn':
            return pawnMovement.getAllPossibleSquares(piece);
            case 'bishop':
            return bishopMovement.getAllPossibleSquares(piece);
            case 'knight':
            return knightMovement.getAllPossibleSquares(piece);
            case 'king':
            return kingMovement.getAllAvaliableSquares(piece);
            case 'queen':
            return {
                ...bishopMovement.getAllPossibleSquares(piece),
                ...rookMovement.getAllPossibleSquares(piece)
            }
        }   
     },

  

    fillModal(event){
        this.clearModal();
        chessConfig.promotePieces.forEach( pieceName => {
            const imgPiece = document.createElement( 'img' );
            imgPiece.classList.add( 'promote-piece' );
            imgPiece.setAttribute('src', `pieces/${chessConfig.currentTurn}_${pieceName}.png`);
            imgPiece.addEventListener('click' , eventHandler.changePiece.bind(this, pieceName  , event )  )
            $(chessConfig.modalSelector).append(imgPiece);
        }) 

    },

    clearModal(){
        while ($(chessConfig.modalSelector).firstChild){
            $(chessConfig.modalSelector).removeChild($(chessConfig.modalSelector).firstChild);
        }
    },

    promotePawn(event){
        this.fillModal(event);
        document.querySelector(".modal").showModal();
        
    },


}