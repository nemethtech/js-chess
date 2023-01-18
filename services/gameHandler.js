import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'

export const gameHandler = {

    endTurn(){
        this.changeTurnSettings();
        generalMovement.clearPotentialSquares();
        piecesRender.resetRound();
    },

    pieceTurn(color){
        return chessConfig.currentTurn === color ? true : false;
    },

    whosTurn(){
        return chessConfig.currentTurn;
    },

    changeTurnSettings(){
        chessConfig.whiteTurn = chessConfig.whiteTurn === true ?  false : true;
        chessConfig.currentTurn = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
    }

}
