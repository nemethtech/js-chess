import { $ , $$ } from '../utils/utils.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { piecesRender } from './pieceRender.js';

export const pieceHandle = {


    handlePieceClick(pieceSettings){
        if(!this.isThereASelectedPiece()){
            this.selectPieceAndSquares(pieceSettings);
        }
        else if(this.ownPieceSelected(pieceSettings)){
            this.removeSelectPieceAndSquares();
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

    selectPieceAndSquares(pieceSettings){
        this.setSelected(pieceSettings.piece);
        generalMovement.markMoveSquares(pieceSettings);
    },

    removeSelectPieceAndSquares(){
        this.removeSelected();
        piecesRender.removeEventsOnMoveSquares();
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
    
}
