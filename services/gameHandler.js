import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { Player } from './playerClassExtend.js'

export const gameHandler = {

    startGame(){
        
        piecesRender.createPieces();
        Player.resetPlayerPieces();
        piecesRender.setEventListeners();
    },
    
    endTurn(){
        
        generalMovement.clearPotentialSquares();
        this.changeTurnSettings();
        Player.resetPlayerPieces();
        piecesRender.setEventListeners();
        this.checkGameStance();
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

    gotMated(Player){
        if(Player.isPlayerInCheck){

            let piecesCanSaveKing = false;
            Player.playerPieces.forEach( piece => {
                if(piece.canBlockCheck || piece.canAttackThreat){
                    piecesCanSaveKing = true;
                }
            });
            let kingCanMove = Player.canPlayerKingMove();
            if(!piecesCanSaveKing && !kingCanMove){
                this.endGame(`${Player.enemyColor} WON !!!`);
            }
        }
    },

    staleMate(Player){
        if(Player.isPlayerInCheck){
            return ;
        }
        let playerHasMoveablePiece = false;
        let kingCanMove = Player.canPlayerKingMove();
        Player.playerPieces.forEach( piece => {
            if(piece.pieceType !== 'king'){
            if((piece.hasOwnProperty("moveSquares") && piece.moveSquares.length > 0)  ||
                (piece.hasOwnProperty("collisions") && piece.collisions.length > 0)) {
                    playerHasMoveablePiece = true;
                }
            }
        });

        if(!playerHasMoveablePiece && !kingCanMove){

            this.endGame('Stale Mate');
        }
    },

    checkGameStance(){
        this.staleMate(Player.getPlayer());
        this.staleMate(Player.getEnemyPlayer());
        this.gotMated(Player.getPlayer());
        this.gotMated(Player.getEnemyPlayer());
    },

    endGame(endResult){
        chessConfig.endResult = endResult;
        chessConfig.gameEnded = true;
    }

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
