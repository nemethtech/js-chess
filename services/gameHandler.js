import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { checkHandler } from './checkHandler.js'
import { $$ } from '../utils/utils.js'
import { pieceHandle } from './pieceHandler.js'


export const gameHandler = {

    endTurn(){
        console.log('itt');
        checkHandler.checkIfCheckIsOn();
        this.changeTurnSettings();
        generalMovement.clearPotentialSquares();
        piecesRender.resetRound();
        this.makeRandomMoveForEnemy();
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
    },

    notCurrentTurnFor(){
        return  chessConfig.whiteTurn === true ?  'black' : 'white';
    },

    makeRandomMoveForEnemy(){
        if(chessConfig.currentTurn === chessConfig.enemyColor){
            const enemyPieces = $$(`[piece-type^="${chessConfig.enemyColor.toString()}"]`);
           // const enemyPieces = $$(`[piece-type^="${chessConfig.enemyColor.toString()+"_pawn"}"]`);
            let i = 0;
          //  while(chessConfig.currentTurn === chessConfig.enemyColor){
               
            let randomPiece = enemyPieces[Math.floor(Math.random() * enemyPieces.length)];
          //  let randomPiece = $(`[piece-type^="${chessConfig.enemyColor.toString()}"]`);
        //    pieceHandle.setHoverOnEnter(randomPiece);
            const piecePosition = piecesRender.checkPiecePosition(randomPiece);
            const pieceColor = randomPiece.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = randomPiece.getAttribute( 'piece-type' ).split('_')[1];
            
            const handleParams = {
                randomPiece,
                pieceType, 
                piecePosition,
                pieceColor,
            }
          //  console.log('handleParams',handleParams);
            randomPiece.click();
         //   pieceHandle.handlePieceClick(handleParams);
           // randomPiece.click();
          //  randomPiece.click();
         //   randomPiece.click();
         //   pieceHandle.handlePieceClick(handleParams);
        //    pieceHandle.setHoverOnExit(randomPiece);
            let pot = document.getElementsByClassName('potential-square');
         //   console.log('pot',pot);
         //   console.log('pot[0])',pot[0]);

            if(pot.length !== 0){
                console.log('itt is');
                  pot[0].click();
            }
          
            this.endTurn();
   //     }

        }
    },

   

}
