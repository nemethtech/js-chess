import { chessConfig }  from '../config/chessConfig.config.js'
import { eventHandler } from './eventHandler.js'
import { PlayerSetup } from './playerClassSetup.js'
import { pieceHandle } from './pieceHandler.js'
import { BasePlayer } from './playerClass.js'
import { NewPlayer, NewPlayerOne, NewPlayerTwo } from './newPlayerClass.js'
import { pieceMoveHandler } from './pieceMoveHandler.js'

export const gameHandler = {
    
    startGame(){
        pieceHandle.createPieces();
        PlayerSetup.getPlayer().getSetup();
        eventHandler.setEventListeners();
       // console.log('player 2',BasePlayer.getEnemyPlayer());
        console.log('BasePlayer player 1',BasePlayer.getPlayer());
       NewPlayerOne.initPlayer();
     

    //   NewPlayerTwo.initPlayer();
    pieceMoveHandler.setPlayerPieceMoves();
        console.log('NewPlayer player 1',NewPlayerOne);

        
 //       console.log('NewPlayerplayer 2',NewPlayerOne.enemyPlayer);
   
    },

    endTurn(){
        this.changeTurnSettings();
        PlayerSetup.getPlayer().getSetup();
        eventHandler.setEventListeners();
        console.log('player 2',PlayerSetup.getEnemyPlayerForPlayer());
        console.log('player 1',PlayerSetup.getPlayer());
    },

    changeTurnSettings(){
        chessConfig.currentTurn = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
        chessConfig.currentEnemy = chessConfig.currentTurn  === 'white' ? 'white' : 'black';
    },
}
