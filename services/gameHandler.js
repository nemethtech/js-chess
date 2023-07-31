import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { Player } from './playerClassExtend.js'
import { PlayerSetup } from './playerClassSetup.js'

export const gameHandler = {
    
 

    startGame(){
        piecesRender.createPieces();
        PlayerSetup.getPlayer().getSetup();
        piecesRender.setEventListeners();
        console.log('player 2',Player.getEnemyPlayer());
        console.log('player 1',Player.getPlayer());
    },


    endTurn(){
        this.changeTurnSettings();
        PlayerSetup.getPlayer().getSetup();
        piecesRender.setEventListeners();
        console.log('player 2',Player.getEnemyPlayer());
        console.log('player 1',Player.getPlayer());
    },

    pieceTurn(color){
        return chessConfig.currentTurn === color ? true : false;
    },

    currentTurnFor(){
        return chessConfig.currentTurn;
    },

    changeTurnSettings(){
        chessConfig.whiteTurn = chessConfig.whiteTurn === true ?  false : true;
        chessConfig.currentTurn = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
    },

    notCurrentTurnFor(){
        return  chessConfig.whiteTurn === true ?  'black' : 'white';
    },


}
