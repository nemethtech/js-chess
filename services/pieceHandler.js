import { $ } from '../utils/utils.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { gameHandler } from './gameHandler.js';

export const pieceHandle = {
   
    handlePieceClick(pieceSettings){
        
        if(!gameHandler.pieceTurn(pieceSettings.pieceColor)){
            console.log('1');
            return ;
        }
     /*  van kiválasztva 
      else if(this.isThereASelectedPiece()){
            console.log('1.5');
            return ;
        } */
        else if(!this.isThereASelectedPiece()){
            console.log('2');
            this.setSelected(pieceSettings.piece);
            generalMovement.markPotentialSquares(pieceSettings);
            generalMovement.setEventsOnPotentialSquares(pieceSettings);
            return this;
        }
        else if(this.ownPieceSelected(pieceSettings)){
            console.log('3');
            this.removeSelected(pieceSettings.piece);
            generalMovement.clearPotentialSquares();
            return this;
        }

    },
    handlePieceMouseleave(handleParams){
        if(gameHandler.pieceTurn(handleParams.pieceColor))this.setHoverOnExit(handleParams.piece);
    },

    handlePieceMouseenter(handleParams){
        if(gameHandler.pieceTurn(handleParams.pieceColor))this.setHoverOnEnter(handleParams.piece);
    },

    isThereASelectedPiece(){
        return $('.piece-selected');
    },

    pieceSelected(){
        return $('.piece-selected > .piece');
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

    getIdByIdVal(idVal){
        return $(`[id_val^="${idVal}"]`).getAttribute('id');
    },

}
