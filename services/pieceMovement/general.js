import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { $ , $$ } from '../../utils/utils.js';
import { chessConfig } from '../../config/chessConfig.config.js';
import { gameHandler } from '../gameHandler.js';
import { piecesRender } from '../pieceRender.js';

export const generalMovement = {

    eventListener : {},

    getPieceMove(piece) {
        switch (piece.pieceType) {
          case 'rook':
            return rookMovement.returnAvailableSquares(piece);
          case 'pawn':
            return pawnMovement.returnAvailableSquares(piece);
          case 'bishop':
            return bishopMovement.returnAvailableSquares(piece);
          case 'knight':
            return knightMovement.returnAvailableSquares(piece);
          case 'king':
            return kingMovement.returnAvailableSquares(piece);
          case 'queen':
            return {
              ...rookMovement.returnAvailableSquares(piece),
              ...bishopMovement.returnAvailableSquares(piece)
            }
        }
      },

      getPieceMoveUnfiltered(piece){

        // console.log('piece:' , piece);
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

    getPossibleCollisionquares(pieceMove){
        
        let collisionSquares = [];

        for (const direction in pieceMove) {
            if (Object.hasOwn(pieceMove,direction)) {
                if(!this.valueNullOrUndefined(pieceMove[direction].possibleCollision)){
                    collisionSquares.push({
                        direction : direction ,
                        square : pieceMove[direction].possibleCollision            
                    })
                }
            }
        }
          
        return collisionSquares;
    },
    
    getCollisionFreeSquares(pieceMove){
        const collisionFreeSquares = [];
        for (const direction in pieceMove) {
            if (Object.hasOwn(pieceMove,direction)) {
                if(!this.valueNullOrUndefined(pieceMove[direction].collisionFreeSquares)){
                    collisionFreeSquares.push({
                        direction : direction ,
                        square : pieceMove[direction].collisionFreeSquares            
                    })
                }
            }
        }  
        
        return collisionFreeSquares;
    },


    markPotentialSquares(pieceSettings){

        this.setSquares(pieceSettings);
        piecesRender.setEventsOnPotentialSquares(pieceSettings);
    },

    setSquares(piece){
            piece.moveSquares.forEach( pieceMoveSquares => {
                pieceMoveSquares.colFreeMoveSquares.forEach( square => {
                    $(`[id^="${square}"]`).classList.add( 'potential-square');
                    this.createDotElementOnSquare(square);
                })
            })
            piece.collisions.forEach( pieceCollision => {
                 
                    $(`[id^="${pieceCollision.colPiecePosition}"]`).classList.add('potential-enemy'); 
                
            })
    },

    createDotElementOnSquare(square){
        let span = document.createElement( 'a' );
        span.classList.add( 'dot' );
        $(`[id^="${square}"]`).append(span);
    },


    clearPotentialSquares(){
        $$('.dot').forEach(spanElem => {
            spanElem.remove();
        });
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );
        });
        piecesRender.removeEventsOnPotentialSquares();
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


   pawnCanBePromoted(piecePosition , pieceColor){
       if(pieceColor === 'white' &&
       piecePosition[1] === '8' ||
       pieceColor === 'black' &&
       piecePosition[1] === '1') 
       {
           return true; } else 
       {
           return false;
       }
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