import { bishopMovement } from './bishop.js';
import { knightMovement } from './knight.js';
import { kingMovement } from './king.js';
import { rookMovement } from './rook.js';
import { pawnMovement } from './pawn.js';
import { movePieceHandler } from './movePiece.js';
import { $ , $$ } from '../../utils/utils.js';
import { Player } from '../playerClassExtend.js';
import { chessConfig } from '../../config/chessConfig.config.js';
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from '../pieceHandler.js';
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
    
    markPotentialSquares(piece){

        const pieceS = Player.getPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === piece.piecePosition); 
        let pieceMove = this.getPieceMove(piece);
        //filterPieceMoveIfPlayerUnderCheck
        for (const key in pieceMove) {
            if(pieceS.isPinned){
                pieceMove[key].collisionFreeSquares = pieceMove[key].collisionFreeSquares.filter( e => (pieceS.pinnedInfo.pinnedSquares.includes(e)));
                if(pieceMove[key].possibleCollision !== pieceS.pinnedInfo.pinnerSquare){
                    pieceMove[key].possibleCollision = undefined;
                }
            }

        }

        if(Player.getPlayer().isPlayerInCheck && piece.pieceType !== 'king'){
            pieceMove =  Player.getPlayer().filterPieceMoveIfPlayerUnderCheck(piece , pieceMove);
        }
        if(Player.getPlayer().isPlayerInCheck && piece.pieceType === 'king'){
            pieceMove =  this.getPieceMove(piece);
            let alma = pieceMove.filter(e => (e.collisionFreeSquares[0] !== Player.getPlayer().checkThreat[0].plusOneSquare) );
            let körte = alma.filter(e => ( e.possibleCollision!== Player.getPlayer().checkThreat[0].plusOneSquare) );
            if(Player.getPlayer().checkThreat[0].plusOneSquare !== undefined){
                this.setSquares(körte);

            }else{

                this.setSquares(pieceMove);
            }

        }else{
            this.setSquares(pieceMove);
            
        }
        this.setEventsOnPotentialSquares();
    },

    getCollisionFreeSquares(verifiedSquares){
        const collisionFreeSquares = [];
        Object.values(verifiedSquares).forEach(val => {
            if(!generalMovement.valueNullOrUndefined(val.collisionFreeSquares)){
                val.collisionFreeSquares.forEach(freeSquareId => {
                    collisionFreeSquares.push(freeSquareId);
                })                   
            }
        });      
        return collisionFreeSquares;
    },

    getPossibleCollisionquares(verifiedSquares){

        const collisionSquares = [];
        Object.values(verifiedSquares).forEach(val => {
            verifiedSquares
            if(!this.valueNullOrUndefined(val.possibleCollision))collisionSquares.push(val.possibleCollision);             
        });      

        return collisionSquares;
    },

    getPossibleCollisionquares2(pieceMove){
        
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
    
    getCollisionFreeSquares2(pieceMove){
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

    setSquares(verifiedSquares){
        Object.values(verifiedSquares).forEach(val => {
            if(!this.valueNullOrUndefined(val.collisionFreeSquares)){
                val.collisionFreeSquares.forEach(freeSquareId => {
                    $(`[id^="${freeSquareId}"]`).classList.add( 'potential-square');
                    let span = document.createElement( 'a' );
                    span.classList.add( 'dot' );
                    $(`[id^="${freeSquareId}"]`).append(span);
                })                   
            }
            if(!this.valueNullOrUndefined(val.possibleCollision)){
                movePieceHandler.checkAndMarkPossibleEnemy(val.possibleCollision.toString());
            }
        });        
    },

    markPotentialSquares2(pieceSettings){

        this.setSquares2(pieceSettings);
        piecesRender.setEventsOnPotentialSquares2(pieceSettings);
    },

    setSquares2(piece){
        console.log('piece',piece);
        console.log('piece moveSquares',piece.moveSquares);
            piece.moveSquares.forEach( pieceMoveSquares => {
                pieceMoveSquares.colFreeMoveSquares.forEach( square => {
                    $(`[id^="${square}"]`).classList.add( 'potential-square');
                    this.createDotElementOnSquare(square);
                })
            })
            piece.collisions.forEach( pieceCollision => {
                if(pieceCollision.colType === 'enemy'){
                    
                    $(`[id^="${pieceCollision.colPiecePosition}"]`).classList.add('potential-enemy'); 
                }
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
        //    pieceBox.removeEventListener( 'click', movePieceHandler.movePiece2);
        });
    },
    
    clearPotentialSquares2(){
        $$('.dot').forEach(spanElem => {
            spanElem.remove();
        });
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );
            pieceBox.removeEventListener( 'click', movePieceHandler.movePiece2);
        });
    },
    

    setEventsOnPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            console.log('pieceBox',pieceBox);
            pieceBox.addEventListener( 'click', movePieceHandler.movePiece);
        });
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
        console.log('pawnColor1 : ', pawnColor);
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
       const piecePosition = piece.getAttribute( 'piece-square' );
       const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
           if(this.pawnCanBePromoted(piecePosition , pieceColor)){
               this.promotePawn(piece , pieceColor);
               console.log('promot time' , piece);
           }
       })
    },

    checkPawnPromotion(){
        this.checkPromotionForColor('black');
        this.checkPromotionForColor('white');
    },

}