import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { checkHandler } from './checkHandler.js'
import { $$ } from '../utils/utils.js'
import { movePieceHandler } from '../services/pieceMovement/movePiece.js'
import { kingMovement } from './pieceMovement/king.js'
import { Player } from './playerClassExtend.js'

export const gameHandler = {

    startGame(){
        
        piecesRender.createPieces();
        piecesRender.setEventListeners();
        Player.resetPlayerPieces();
    },
    
    endTurn(){
        
        this.changeTurnSettings();
        generalMovement.clearPotentialSquares();
        Player.resetPlayerPieces();
        piecesRender.setEventListeners();
        Player.instanceByColor('white').consoleCheckSit();
        Player.instanceByColor('black').consoleCheckSit();
        
    },

    endTurn2(){

        this.changeTurnSettings();
        piecesRender.resetRound();

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
        chessConfig.enemyColor = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
    },

    notCurrentTurnFor(){
        return  chessConfig.whiteTurn === true ?  'black' : 'white';
    },

    makeRandomMoveForEnemy(){
        console.log('makeRandomMoveForEnemy');
        if(chessConfig.currentTurn === chessConfig.enemyColor){
            console.log('makeRandomMoveForEnemy belép');
            let bool = false;
           // const enemyPieces = $$(`[piece-type^="${chessConfig.enemyColor.toString()}"]`);
            const enemyPieces = $$(`[piece-type^="${chessConfig.enemyColor.toString()+"_pawn"}"]`);
            while(bool === false){

                    //  while(chessConfig.currentTurn === chessConfig.enemyColor){
                        
                let piece = enemyPieces[Math.floor(Math.random() * enemyPieces.length)];
            //  let piece = $(`[piece-type^="${chessConfig.enemyColor.toString()}"]`);
            //    pieceHandle.setHoverOnEnter(randomPiece);
                const piecePosition = piece.getAttribute( 'piece-square' );;
                const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
                const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
                
                const handleParams = {
                    piece ,
                    pieceType, 
                    piecePosition,
                    pieceColor,
                }
                
                let poti = generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(handleParams));
                let poti2 = generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(handleParams));
                
                if(!!poti.length || !!poti2.length){
                    if(!!poti2.length){
                        console.log('ütni akarok');
                        let square = poti2[Math.floor(Math.random() * poti2.length)];
                        console.log('square:',square);
                        if(movePieceHandler.checkPossibleEnemyForEnemy(square)){
                            console.log('ütök is vele:',piece);
                            console.log('ide:',square);

                            movePieceHandler.movePieceForEnemy(handleParams, square);
                            gameHandler.endTurn2();
                            bool = true;
                            
                        }
                    }else if(!!poti.length){
                        console.log('ide is belépek');
                        let square = poti[Math.floor(Math.random() * poti.length)];
                        movePieceHandler.movePieceForEnemy(handleParams, square);
                        gameHandler.endTurn2();
                        bool = true;
                    }
                }
            }

        }
    },

    getGameOverStatus(){
        let gameOver = undefined;
        if(checkHandler.checkHandle.isCheck){
            gameOver = true;
            $$(chessConfig.chessPieceSelector).forEach(piece => {
                
                const piecePosition = piece.getAttribute( 'piece-square' );;
                const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
                const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
                
                const handleParams = {
                    piece,
                    pieceType, 
                    piecePosition,
                    pieceColor,
                }

                if(pieceType === 'king'){
                    if(kingMovement.canTheKingMove(handleParams)){
                        gameOver = false;
                    }
                }else if(checkHandler.pieceCanBlockCheck(handleParams) ){
                        gameOver = false;
                }
                
            })
        }
        return gameOver;
    }

    

}
