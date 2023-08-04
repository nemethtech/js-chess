import { chessConfig }  from '../config/chessConfig.config.js'
import { normalGame } from '../config/normalGameInit.config.js'
import { editedGame } from '../config/editedGameInit.config.js'
import { eventHandler } from './eventHandler.js'
import { Player } from './playerClassExtend.js'
import { PlayerSetup } from './playerClassSetup.js'
import { $ } from '../utils/utils.js'



export const gameHandler = {
    
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

    startGame(){
        this.createPieces();
        PlayerSetup.getPlayer().getSetup();
        eventHandler.setEventListeners();
        console.log('player 2',Player.getEnemyPlayer());
        console.log('player 1',Player.getPlayer());
    },


    endTurn(){
        this.changeTurnSettings();
        PlayerSetup.getPlayer().getSetup();
        eventHandler.setEventListeners();
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
