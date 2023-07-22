import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { Player } from './playerClassExtend.js'
import { movePieceHandler } from './pieceMovement/movePiece.js'

export const gameHandler = {



    startGame(){
        piecesRender.createPieces();
        Player.resetPlayerPieces();
        piecesRender.setEventListeners();
    },
    
    startGameUltimate(){
        piecesRender.createPieces();

        Player.getPlayer().setPlayerValuesToDefault();
        Player.getEnemyPlayer().setPlayerValuesToDefault();


        Player.getPlayer().getPlayerPieces();
        Player.getEnemyPlayer().getPlayerPieces();

        Player.getEnemyPlayer().setPlayerPiecesMoves();
        Player.getEnemyPlayer().setPieceIsBackedUp();
        Player.getEnemyPlayer().checkPinnedPieces();


        Player.getPlayer().setPlayerPiecesMoves();
        Player.getPlayer().checkIfPlayIsUnderCheck2();
        Player.getPlayer().checkPlayerPinnedPieceMoves();

        piecesRender.setEventListeners2();

        console.log('palyer 2',Player.getEnemyPlayer());
        console.log('palyer 1',Player.getPlayer());
    },




    endTurn(){

        generalMovement.clearPotentialSquares();
        Player.resetPlayerPieces();
        this.changeTurnSettings();
        this.checkGameStance();

        piecesRender.setEventListeners();
        Player.getEnemyPlayer().checkPinnedPieces();
        Player.getPlayer().checkPinnedPieces();

    
        //   this.makeBotMove(); 
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
        [Player.getPlayer(),Player.getEnemyPlayer()].forEach( player => {
            this.staleMate(player);
            this.gotMated(player);
        })  
    },

    endGame(endResult){
        chessConfig.endResult = endResult;
        chessConfig.gameEnded = true;
    },


    makeBotMove(){
        console.log('makeRandomMoveForEnemy');
        console.log('player : ',Player.getPlayer());
        if(chessConfig.currentTurn === chessConfig.botColor){
            if(Player.getPlayer().isPlayerInCheck){
                this.makeBotMoveInCheck();
            } else {
                if(this.attackWithBotIfCan()) {
                    return;
                } else {
                    this.moveWithBotIfCan();
                }
            }
        }
    },

    makeBotMoveInCheck(){
        let piecesAvailableInCheck = Player.getPlayer().playerPieces.filter( piece => piece.canBlockCheck || piece.canAttackThreat)

        console.log('piecesAvailableInCheck',piecesAvailableInCheck);
        let pieceSelected = piecesAvailableInCheck[Math.floor(Math.random() * piecesAvailableInCheck.length)];
        if(pieceSelected){
            if(pieceSelected.canAttackThreat){
                let squareToMove = Player.getPlayer().checkThreat[0].piecePosition;
                movePieceHandler.movePieceForBot(pieceSelected , squareToMove);
            } else {
                let squaresToMove = pieceSelected.moveSquares.find( moveSquares => moveSquares.direction === pieceSelected.canBlockCheckDirections[0]).colFreeMoveSquares;
                let squaresToBlock = squaresToMove.filter( squares => Player.getPlayer().checkThreat[0].moveSquares.includes(squares))
                movePieceHandler.movePieceForBot(pieceSelected , squaresToBlock);
                console.log('squaresToMove',squaresToMove);
                console.log('squaresToBlock',squaresToBlock);
            }
        } else if (Player.getPlayer().canPlayerKingMove()) {
            let kingPiece = Player.getPlayer().playerPieces.find( piece => piece.pieceType === 'king');
            console.log('kingPiece',kingPiece);
            if(Player.getPlayer().playerKingCanAttack(kingPiece)){
                let kingEnemeyCollisions = kingPiece.collisions.filter( col => col.colType === 'ally');
                let squareToMove = kingEnemeyCollisions[Math.floor(Math.random() * kingEnemeyCollisions.length)].colPiecePosition;
                movePieceHandler.movePieceForBot(kingPiece , squareToMove);

            } else {

                let kingSquaresToMove = kingPiece.moveSquares[Math.floor(Math.random() * kingPiece.moveSquares.length)].colFreeMoveSquares;
                movePieceHandler.movePieceForBot(kingPiece , kingSquaresToMove);
            }

        }
        
        console.log('pieceSelected',pieceSelected);
    },

    attackWithBotIfCan(){
        let bool = false;
        let attackPieces = [];
        Player.getPlayer().playerPieces.forEach( piece => {
            if(piece.collisions){
                piece.collisions.forEach( col => {
                    if(col.colType === 'enemy'){
                        attackPieces.push({
                            piece ,
                            squareToMove : col.colPiecePosition
                        })
                    }
                })
            }
        })
        if(attackPieces.length > 0){
            let randomNum = Math.floor(Math.random() * attackPieces.length);
            movePieceHandler.movePieceForBot(attackPieces[randomNum].piece , attackPieces[randomNum].squareToMove);
            bool = true;
        }

        return bool;
    },


    moveWithBotIfCan(){
        let bool = false;
        let movePieces = [];
        Player.getPlayer().playerPieces.forEach( piece => {
            if(piece.moveSquares.length > 0 ){
                piece.moveSquares.forEach( moveSquares => {
                    if(moveSquares.colFreeMoveSquares.length > 0){
                        movePieces.push({
                            piece ,
                            squareToMove : moveSquares.colFreeMoveSquares[Math.floor(Math.random() * moveSquares.colFreeMoveSquares.length)]
                        })
                    }
                })
            }
        })
        if(movePieces.length > 0){
            let randomNum = Math.floor(Math.random() * movePieces.length);
            movePieceHandler.movePieceForBot(movePieces[randomNum].piece , movePieces[randomNum].squareToMove);
            bool = true;
        }

        return bool;
    }
    

}
