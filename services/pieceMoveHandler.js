import { generalMovement } from './pieceMovement/general.js';
import { NewPlayer} from './newPlayerClass.js'

export const pieceMoveHandler = {

    playerPiecesMoves : [],

    setupPlayerPieceMove(piece , pieceMove){


      // this.playerPiecesMoves = [];
        const pieceMoves = [];
        console.log('piece',piece);
        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                const collsion = generalMovement.getCollisionPieces(pieceMove[direction] , false)?.[0];
                let moveSquares = generalMovement.getMoveSquares(pieceMove[direction] , collsion);
                const playerPieceOff =  NewPlayer.getPlayer().getPlayerPieceByPosition(piece.piecePosition);
                const checkStatus = NewPlayer.getPlayer().CheckStatus;
                let playerPieceMove = {};
                playerPieceMove.piece = piece;
                playerPieceMove.moveSquares = moveSquares;
                playerPieceMove.direction   = direction;
                playerPieceMove.eventType = 'move';
                playerPieceMove.collision = {};


                if(collsion){
                    if(collsion.status === 'enemy'){
                        playerPieceMove.collision.colPos = collsion.colPos;   
                        playerPieceMove.collision.direction = direction;  

                    }
                }

                if(piece.pieceType !== 'king'){

                    if(piece.pieceType === 'pawn'){
                        if(playerPieceMove.direction === 'rightColumn' || playerPieceMove.direction === 'leftColumn'){
                            playerPieceMove.moveSquares = [];
                        }else{
                            playerPieceMove.collision =  {};
                        }
                    }
                    if( playerPieceOff.isPined){

                        if(playerPieceMove.collision.colPos !== piece.pinInfo.attackerPosition){
                            playerPieceMove.collision =  {};
                        }
                        playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => piece.pinInfo.attackerMoveSquares.indexOf(moveSquare) !== -1 );
                    
                    }
                    if(this.isPlayerInCheck){

                        if(playerPieceOff.isPined || checkStatus.attackerCounter !== 1){
                            playerPieceMove.moveSquares = [];
                            playerPieceMove.collision =  {};
                        }
                        if(checkStatus.attackerCounter === 1){
                            playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => checkStatus.checkThreat[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                            if(playerPieceMove.collision.colPos !== this.checkingPieces[0].attackerPosition){
                                playerPieceMove.collision =  {};
                            }
                        }
                    }

                }else{

                    if(playerPieceMove.moveSquares.length > 0){
                        playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => NewPlayer.getPlayer().allEnemyMoveSquare.indexOf(moveSquare) === -1 ); 
                    }
                    if(JSON.stringify(playerPieceMove.collision) !== '{}'){
                        const backedUp =  NewPlayer.getPlayer().getEnemyPieceByPosition(playerPieceMove.collision.colPos) ;
                        if(backedUp.backedUp){
                            playerPieceMove.collision =  {};
                        }
                    }
                }
                if(JSON.stringify(playerPieceMove.collision) !== '{}' || !!playerPieceMove.moveSquares.length){
                    if(piece.pieceType  === 'pawn'  && 
                    ((piece.pieceColor  === 'white' && piece.piecePosition[1] === '7') || 
                      (piece.pieceColor === 'black' && piece.piecePosition[1] === '2'))){
                        playerPieceMove.eventType = 'promote';
                    }
                    pieceMoves.push(playerPieceMove);
                }
            }
        }
        return pieceMoves;
    },
   
    setPlayerPieceMoves(){
        this.playerPiecesMoves = [];
        NewPlayer.getPlayer().newPlayerPieces.forEach( playerPiece => {
            const pieceMove = generalMovement.getPieceMoveUnfiltered(playerPiece);
            this.playerPiecesMoves.push(
                {
                    piece : playerPiece , 
                    moves : this.setupPlayerPieceMove(playerPiece, pieceMove),
                })
        })
        NewPlayer.getPlayer().PlayerPiecesMoves = this.playerPiecesMoves; 
    },


}
