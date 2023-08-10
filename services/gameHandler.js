import { chessConfig }  from '../config/chessConfig.config.js'
import { eventHandler } from './eventHandler.js'
import { BasePlayer } from './playerClass.js'
import { pieceHandle } from './pieceHandler.js'

export const gameHandler = {
    
    startGame(){
        pieceHandle.createPieces();
        BasePlayer.getPlayer().getSetup();
        eventHandler.setEventListeners();
        console.log('player 2',BasePlayer.getEnemyPlayer());
        console.log('player 1',BasePlayer.getPlayer());
    },

    endTurn(){
        this.changeTurnSettings();
        BasePlayer.getPlayer().getSetup();
        eventHandler.setEventListeners();
        console.log('player 2',BasePlayer.getEnemyPlayer());
        console.log('player 1',BasePlayer.getPlayer());
    },

    changeTurnSettings(){
        chessConfig.currentTurn = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
        chessConfig.currentEnemy = chessConfig.currentTurn  === 'white' ? 'white' : 'black';
    },
}
