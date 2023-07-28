import { $ , $$ } from '../utils/utils.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { gameHandler } from './gameHandler.js';
import { Player } from './playerClassExtend.js';
import { chessConfig } from '../config/chessConfig.config.js';
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
        if(chessConfig.gameEnded){
            return;
        }
        if(gameHandler.pieceTurn(pieceSettings.pieceColor))this.setHoverOnExit(pieceSettings.piece);
    },

    handlePieceMouseenter(pieceSettings){
        if(chessConfig.gameEnded){
            return;
        }
        if(gameHandler.pieceTurn(pieceSettings.pieceColor))this.setHoverOnEnter(pieceSettings.piece);
    },

    isThereASelectedPiece(){
        return $('.piece-selected');
    },

    pieceSelected(){
        return $('.piece-selected > .piece');
    },

    getPlayerPieceSelected(){
        const selectedPieceSquare = $('.piece-selected > .piece').getAttribute( 'piecePosition' );
        return Player.getPlayer().playerPieces.find( piece => piece.piecePosition === selectedPieceSquare);
    },

    setSelected(piece){ 
        piece.parentElement.classList.remove( 'yellow' );
        piece.parentElement.classList.add( 'piece-selected' );
    }, 

    setHoverOnEnter(piece){
        return piece.parentElement.classList.add( 'yellow' );
    },

    setHoverOnExit(piece){
        return piece.parentElement.classList.remove( 'yellow' );
    },
    
    removeSelected(){
        return $('.piece-selected').classList.remove( 'piece-selected' );
    },

    ownPieceSelected(handleParams){
        return $('.piece-selected > .piece' ) === handleParams.piece;
    },

    isTargetEnemyPiece(target){
        return target.classList.contains('piece');
    },

    getPieceSquareById(id){
        return $(`[id^="${id}"]`);
    },

    selectPieceAndSquares(pieceSettings){
        this.setSelected(pieceSettings.piece);
        generalMovement.markPotentialSquares(pieceSettings);
        return this;
    },

    removeSelectPieceAndSquares(){
        this.removeSelected();
        piecesRender.removeEventsOnPotentialSquares();
        this.clearPotentialSquares();
        return this;
    },

    createDotElementOnSquare(square){
        let span = document.createElement( 'a' );
        span.classList.add( 'dot' );
        $(`[id^="${square}"]`).append(span);
    },


    clearPotentialSquares(){
        $$('.dot').forEach(spanElem => { spanElem.remove();}); 
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );
        });
    },



}
