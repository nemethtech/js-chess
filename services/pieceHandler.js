import { $ } from '../utils/utils.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { gameHandler } from './gameHandler.js';
import { Player } from './playerClassExtend.js';
import { chessConfig } from '../config/chessConfig.config.js';

export const pieceHandle = {



    handlePieceClick(pieceSettings){
     //   console.log('Player.pieceSettings()',pieceSettings);
     //   this.pieceiIsPinned(pieceSettings)   ;
        if(chessConfig.gameEnded){
            return;
        }
        if(!gameHandler.pieceTurn(pieceSettings.pieceColor)){
            return this;
        }  
       // if(this.pieceiIsPinned(pieceSettings)){
      //      return this;
        //}
        else if(Player.getPlayer().isPlayerInCheck){
            console.log('0');
            if(pieceSettings.pieceType === 'king'){
                
                if(Player.getPlayer().canPlayerKingMove()){
                    console.log('1');
                    this.managePiece(pieceSettings)
                }
            }else if(Player.getPlayer().pieceCanBlockCheck(pieceSettings)){
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


    handlePieceClick2(piece){

        if(chessConfig.gameEnded){
            return;
        }
        if(Player.getPlayer().isPlayerInCheck){
            console.log('0');
            if(piece.isPinned){
                return;
            }
            if(piece.pieceType === 'king' && Player.getPlayer().canPlayerKingMove()){
                console.log('1');
                this.managePiece2(piece)

            }else if(piece.canBlockCheck || piece.canAttackThreat){
                console.log('2');
                this.managePiece2(piece)
            }
        } else { 
            console.log('3');
            this.managePiece2(piece)
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
        const selectedPieceSquare = $('.piece-selected > .piece').getAttribute( 'piece-square' );
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
        generalMovement.markPotentialSquares2(pieceSettings);
        return this;
    },

    removeSelectPieceAndSquares(){
        this.removeSelected();
        generalMovement.clearPotentialSquares2();
        return this;
    },

    managePiece(pieceSettings){
        if(!this.isThereASelectedPiece()){
            this.selectPieceAndSquares(pieceSettings);
        }
        else if(this.ownPieceSelected(pieceSettings)){
            this.removeSelectPieceAndSquares(pieceSettings.piece);
        }
    },


    managePiece2(pieceSettings){
        if(!this.isThereASelectedPiece()){
            this.selectPieceAndSquares(pieceSettings);
        }
        else if(this.ownPieceSelected(pieceSettings)){
            this.removeSelectPieceAndSquares(pieceSettings.piece);
        }
    },


    pieceiIsPinned(pieceSettings){
        return Player.getPlayer().playerPieces.find( piece => piece.piecePosition === pieceSettings.piecePosition).isPinned;
    }
    
    

}
