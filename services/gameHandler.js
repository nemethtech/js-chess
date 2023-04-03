import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'
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
        piecesRender.setEventListeners();
        Player.resetPlayerPieces();
        console.log('Player Player.getPlayer().pieceCollisions',Player.getPlayer().pieceCollisions);
        console.log('Enemy Player.getPlayer().pieceCollisions ',Player.getEnemyPlayer().pieceCollisions);
  
        //     console.log('white canPlayerKingMove',Player.instanceByColor('white').canPlayerKingMove());
   //      console.log('black canPlayerKingMove',Player.instanceByColor('black').canPlayerKingMove());
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
/*
    makeRandomMoveForEnemy(){
        console.log('makeRandomMoveForEnemy');
        if(chessConfig.currentTurn === chessConfig.enemyColor){
            console.log('makeRandomMoveForEnemy belép');
            let bool = false;
            const enemyPieces = $$(`[piece-type^="${chessConfig.enemyColor.toString()+"_pawn"}"]`);
            while(bool === false){
      
                let piece = enemyPieces[Math.floor(Math.random() * enemyPieces.length)];

                const piecePosition = piece.getAttribute( 'piece-square' );;
                const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
                const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
                
                const handleParams = {
                    piece ,
                    pieceType, 
                    piecePosition,
                    pieceColor,
                }
                
                let poti = generalMovement.getCollisionFreeSquares(generalMovement.getPieceMove(handleParams));
                let poti2 = generalMovement.getPossibleCollisionquares(generalMovement.getPieceMove(handleParams));
                
                if(!!poti.length || !!poti2.length){
                    if(!!poti2.length){
                        let square = poti2[Math.floor(Math.random() * poti2.length)];

                        if(movePieceHandler.checkPossibleEnemyForEnemy(square)){

                            movePieceHandler.movePieceForEnemy(handleParams, square);
                            gameHandler.endTurn2();
                            bool = true;
                            
                        }
                    }else if(!!poti.length){
   
                        let square = poti[Math.floor(Math.random() * poti.length)];
                        movePieceHandler.movePieceForEnemy(handleParams, square);
                        gameHandler.endTurn2();
                        bool = true;
                    }
                }
            }

        }
    },*/

  
    

}
