import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { $ , $$ } from '../../utils/utils.js';
import { chessConfig } from '../../config/chessConfig.config.js';
import { gameHandler } from '../gameHandler.js';
import { piecesRender } from '../pieceRender.js';
import { pieceHandle } from '../pieceHandler.js';

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

   
    markPotentialSquares(pieceSettings){
        this.setSquares(pieceSettings);
        piecesRender.setEventsOnPotentialSquares(pieceSettings);
    },

    setSquares(piece){
        piece.moves.forEach( pieceMoveSquares => {
            pieceMoveSquares.moveSquares.forEach( square => {
                $(`[id^="${square}"]`).classList.add( 'potential-square');
                pieceHandle.createDotElementOnSquare(square);
            })
            if(pieceMoveSquares.collision.colPos !== 'none'){
                if(pieceMoveSquares.collision.colType === 'enemy'){
                    $(`[id^="${pieceMoveSquares.collision.colPos}"]`).classList.add('potential-enemy'); 
                }
            }  
        })
    },

   
    
    valueNullOrUndefined(value){
        return value == null ? true : false;
    },

    simplifyArray(array){
        const mergedSquares = array.flat(1);
        const simplifiedArray =  mergedSquares.filter((element, index) => {
            return mergedSquares.indexOf(element) === index;
        });
        return simplifiedArray;
      },

    fillModal(pawnPiece){
        this.clearModal();
        const pawnColor = pawnPiece.getAttribute( 'piece-type' ).split('_')[0];
        chessConfig.promotePieces.forEach( pieceName => {
            let imgPiece = document.createElement( 'img' );
            imgPiece.classList.add( 'promote-piece' );
            imgPiece.setAttribute('src', `pieces/${pawnColor}_${pieceName}.png`);
            imgPiece.setAttribute( 'piece-type'  , `${pieceName}`);
            imgPiece.addEventListener('click' , this.changePiece.bind(this , pieceName , pawnPiece)  )
            $(chessConfig.modalSelector).append(imgPiece);
        }) 

    },

    clearModal(){
        while ($(chessConfig.modalSelector).firstChild){
            $(chessConfig.modalSelector).removeChild($(chessConfig.modalSelector).firstChild);
        }
    },

    promotePawn(pawnPiece){
        this.fillModal(pawnPiece);
        const modal = document.querySelector(".modal");
        
        modal.showModal();
    },

    changePiece(promotPiece , pawnPiece){
        const pawnColor = pawnPiece.getAttribute( 'piece-type' ).split('_')[0];
        const modal = document.querySelector(".modal");
        pawnPiece.setAttribute( 'src'  ,  `pieces/${pawnColor}_${promotPiece}.png`);
        pawnPiece.setAttribute( 'piece-type'  , `${pawnColor}_${promotPiece}`);
        gameHandler.endTurn();
        modal.close();
    },


   pawnCanBePromoted(piecePos , pieceColor){
    return pieceColor === 'white' && piecePos[1] === '8' ||  pieceColor === 'black' && piecePos[1] === '1' ? true : false;
    },
  
  checkPromotionForColor(color){
   $$(`[piece-type=${color}_pawn`).forEach( piece => {
       const piecePosition = piece.getAttribute( 'piecePosition' );
       const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
           if(this.pawnCanBePromoted(piecePosition , pieceColor)){
               this.promotePawn(piece , pieceColor);
           }
       })
    },

    checkPawnPromotion(){
        this.checkPromotionForColor('black');
        this.checkPromotionForColor('white');
    },

}