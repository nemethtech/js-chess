import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { $ , $$ } from '../../utils/utils.js';
import { chessConfig } from '../../config/chessConfig.config.js';

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

     filterNonExistentSquares(squareArray){
        const validRows = Array.from({length: 8}, (_, i) => i + 1);
        return squareArray.filter(e => e.length === 2).filter( e => validRows.indexOf(parseInt(e[1])) !== -1);
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
        const pawnColor = pawnPiece.getAttribute( 'pieceColor' );
        chessConfig.promotePieces.forEach( pieceName => {
            let imgPiece = document.createElement( 'img' );
            imgPiece.classList.add( 'promote-piece' );
            imgPiece.setAttribute('src', `pieces/${pawnColor}_${pieceName}.png`);
            imgPiece.setAttribute( 'pieceType'  , `${pieceName}`);
            imgPiece.setAttribute( 'pieceColor'  , `${pawnColor}`);
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
        document.querySelector(".modal").showModal();
        
       
    },




   pawnCanBePromoted(piecePos , pieceColor){
    return pieceColor === 'white' && piecePos[1] === '8' ||  pieceColor === 'black' && piecePos[1] === '1' ? true : false;
    },
  
  checkPromotionForColor(color){
   $$(`[pieceColor=${color}`).forEach( piece => {
       const piecePosition = piece.getAttribute( 'piecePosition' );
       const pieceColor = piece.getAttribute( 'pieceColor' );
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