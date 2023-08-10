import { generalMovement } from './pieceMovement/general.js';
import { Player } from './playerClassExtend.js'


class PlayerSetup extends Player {

    setupPlayerPieceMove(piece , pieceMove){

        piece.moves = [];

        for(const direction in pieceMove){
            if(pieceMove[direction].length > 0 ){

                const collsion = this.getCollisionPieces(pieceMove[direction])?.[0];
                let moveSquares = this.getMoveSquares(pieceMove[direction] , collsion);

                let playerPieceMove = {
                    moveSquares: moveSquares,
                    collision : {},
                    direction : direction,
                };

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
                    if(piece.isPined){

                        if(playerPieceMove.collision.colPos !== piece.pinInfo[0].attackerPosition){
                            playerPieceMove.collision =  {};
                        }
                        playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => piece.pinInfo[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                    }
                    if(this.isPlayerInCheck){

                        if(piece.isPined || this.checkingPieces.length !== 1){
                            playerPieceMove.moveSquares = [];
                            playerPieceMove.collision =  {};
                        }
                        if(this.checkingPieces.length === 1){
                            playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => this.checkingPieces[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                            if(playerPieceMove.collision.colPos !== this.checkingPieces[0].attackerPosition){
                                playerPieceMove.collision =  {};
                            }
                        }
                    }

                }else{

                    if(playerPieceMove.moveSquares.length > 0){
                        playerPieceMove.moveSquares = playerPieceMove.moveSquares.filter( moveSquare => this.allEnemyMoveSquare.indexOf(moveSquare) === -1 ); 
                    }

                    if(JSON.stringify(playerPieceMove.collision) !== '{}'){
                        const enemy = this.getEnemyPlayer().playerPieces.find( piece => piece.piecePosition === playerPieceMove.collision.colPos);
                        if(enemy.isBackedUp){
                            playerPieceMove.collision =  {};
                        }
                    }
                }

                if(JSON.stringify(playerPieceMove.collision) !== '{}' || !!playerPieceMove.moveSquares.length){
                    if(piece.pieceType === 'pawn' && ((piece.pieceColor === 'white' && piece.piecePosition[1] === '7') || 
                    (piece.pieceColor === 'black' && piece.piecePosition[1] === '2'))){
                        piece.canPromote = true;
                    }
                    piece.moves.push(playerPieceMove);
                }
            }
        }
    }
   
    setPlayerPieceMoves(){
        this.playerPieces.forEach( playerPiece => {
            let pieceMove = generalMovement.getPieceMoveUnfiltered(playerPiece);
            this.setupPlayerPieceMove(playerPiece , pieceMove);
          })
        return this;
      }

}


export { PlayerSetup };