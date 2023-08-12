import { chessConfig } from '../config/chessConfig.config.js';
import { $ , $$ } from '../utils/utils.js'
import { eventHandler } from './eventHandler.js';
import { normalGame } from '../config/normalGameInit.config.js'
import { editedGame } from '../config/editedGameInit.config.js'

export const pieceHandle = {

    handlePieceClick(pieceSettings){
        if(!this.isThereASelectedPiece()){
            this.setSelected(pieceSettings.piece);
            this.markMoveSquares(pieceSettings);
        }
        else if(this.ownPieceSelected(pieceSettings)){
            this.removeSelectPieceAndSquares(pieceSettings);
        }
    },

    handlePieceMouseleave(pieceSettings){
        pieceSettings.piece.parentElement.classList.remove( 'piece-hovered'  );
    },

    handlePieceMouseenter(pieceSettings){
        pieceSettings.piece.parentElement.classList.add( 'piece-hovered'  );
    },

    isThereASelectedPiece(){
        return $('.piece-selected');
    },

    getPieceSelected(){
        return $('.piece-selected > .piece');
    },

    setSelected(piece){ 
        piece.parentElement.classList.add( 'piece-selected' );
    }, 

    removeSelected(){
        this.getPieceSelected().parentElement.classList.remove( 'piece-selected' );
    },

    ownPieceSelected(handleParams){
        return $('.piece-selected > .piece' ) === handleParams.piece;
    },

    removeSelectPieceAndSquares(piece){
        this.removeSelected();
        const eventType = Object.hasOwn(piece, 'canPromote') ? 'promote' : 'move';
        eventHandler.removeEventsOnSquares(eventType);
        this.clearPieceMoves();
    },

    createDotElementOnSquare(square){
        let span = document.createElement( 'a' );
        span.classList.add( 'dot' );
        $(`[id^="${square}"]`).append(span);
    },

    clearPieceMoves(){
        $$('.dot').forEach(spanElem => { spanElem.remove();}); 
        $$('.moveSquare , .enemySquare').forEach(pieceBox => {
            pieceBox.classList.remove( 'enemySquare' );
            pieceBox.classList.remove( 'moveSquare' );
        });
    },

    markMoveSquares(piece){
        this.setSquares(piece);
        const eventType = Object.hasOwn(piece, 'canPromote') ? 'promote' : 'move';
        eventHandler.setEventsOnSquares(eventType);
    },

    setSquares(piece){
        piece.moves.forEach( playerPieceMove => {
            playerPieceMove.moveSquares.forEach( square => {
                $(`[id^="${square}"]`).classList.add( 'moveSquare');
                this.createDotElementOnSquare(square);
            })
            if(JSON.stringify(playerPieceMove.collision) !== '{}'){
                $(`[id^="${playerPieceMove.collision.colPos}"]`).classList.add('enemySquare'); 
            }
        })
    },

    createPieces(){
        const gameStart = chessConfig.useNormalGame ? normalGame : editedGame;
         for(let postion in gameStart){
             const imgPiece = document.createElement( 'img' );
             imgPiece.classList.add( 'piece' );
             imgPiece.setAttribute( 'pieceType'   , gameStart[postion].split('_')[1]);
             imgPiece.setAttribute( 'pieceColor'   , gameStart[postion].split('_')[0]);
             imgPiece.setAttribute( 'piecePosition', postion);
             imgPiece.setAttribute( 'src'          , 'pieces/'+gameStart[postion]+'.png');
             $('#'+postion).append(imgPiece);
         }
     },
}
