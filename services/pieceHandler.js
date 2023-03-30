import { $ } from '../utils/utils.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { gameHandler } from './gameHandler.js';
import { checkHandler } from './checkHandler.js';
import { kingMovement } from './pieceMovement/king.js';
import { Player } from './playerClassExtend.js';


export const pieceHandle = {
    handlePieceClick(pieceSettings){
  //          console.log('white',Player.instanceByColor('white'));
  //      console.log('black',Player.instanceByColor('black'));

        if(!gameHandler.pieceTurn(pieceSettings.pieceColor)){
            return this;
        }
        else if(checkHandler.getCheckStatusForColor(pieceSettings.pieceColor)){
            console.log('0');
            if(pieceSettings.pieceType === 'king'){
                if(kingMovement.canTheKingMove(pieceSettings)){
                    this.managePiece(pieceSettings)
                }
            }else if(checkHandler.pieceCanBlockCheck(pieceSettings) ){
                console.log('2');
                this.managePiece(pieceSettings)
            }else{
                return;
            }
        } 
        else { 
            this.managePiece(pieceSettings)
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
        generalMovement.clearPotentialSquares();
        return this;
    },

    managePiece(pieceSettings){
        if(!this.isThereASelectedPiece()){
            this.selectPieceAndSquares(pieceSettings);
        }
        else if(this.ownPieceSelected(pieceSettings)){
            this.removeSelectPieceAndSquares(pieceSettings.piece);
        }
    }
    
    

}
