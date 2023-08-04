import { generalMovement } from "./pieceMovement/general.js";
import { BasePlayer } from "./playerClass.js";


class Player extends BasePlayer {

    analyzeEnemyPieceMove(piece , pieceMove){

        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                const collisionPieces = this.getEnemyPlayer().getCollisionPieces(pieceMove[direction]);
                const moveSquares = this.getMoveSquares(pieceMove[direction] , collisionPieces[0]);
                this.collectMoveSquares(moveSquares);
                

                if(piece.pieceType === 'pawn' && (direction === 'rightColumn' || direction === 'leftColumn')){
                    this.checkCollisionsForEnemy(collisionPieces , piece  , []  , []);
                }
                else if( piece.pieceType === 'bishop' || piece.pieceType === 'rook' || piece.pieceType === 'queen'){
                    this.checkCollisionsForEnemy(collisionPieces , piece  , moveSquares , pieceMove[direction]);
                }else if(piece.pieceType === 'knight' || piece.pieceType === 'king'  ){
                    this.checkCollisionsForEnemy(collisionPieces , piece  , []  , []);
                }
            }     
        }
        return this;     
    }

    checkCollisionsForEnemy(collisionPieces ,   piece  , moveSquares , allMoveSquare){

        if(collisionPieces.length === 0){
            return;
        }else if(collisionPieces.length === 1){
            this.handleCollisionForEnemy(piece , collisionPieces[0]  ,  moveSquares , allMoveSquare);
        }else if(collisionPieces.length > 1){
            this.handleCollisionForEnemy(piece , collisionPieces[0]  ,  moveSquares , allMoveSquare); 
            this.checkAndSetPin(collisionPieces, piece  , allMoveSquare)    
        }
    }

    handleCollisionForEnemy(piece , collision  ,  moveSquares , allMoveSquare) {
        if(collision.status === 'enemy') {
            if(collision.type === 'king'){
                this.isPlayerInCheck = true;
                this.checkingPieces.push({
                    attackerPosition : piece.piecePosition,
                    attackerMoveSquares : moveSquares , 
                });
                if(allMoveSquare.indexOf(collision.colPos)+1 !== -1){
                    this.allEnemyMoveSquare.push(allMoveSquare[allMoveSquare.indexOf(collision.colPos)+1]); 
                }
                return this;
            }
        } else{
            return this.setEnemyPieceBackedUp(collision);
        } 
    }

    setPinedPiece(firstCollision , piece  , allMoveSquare){
        const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === firstCollision.colPos);
        playerPiece.isPined = true;
        playerPiece.pinInfo = [];
        playerPiece.pinInfo.push({
            attackerPosition : piece.piecePosition,
            attackerMoveSquares : allMoveSquare, 
        })
        return this;
    }

    checkAndSetPin(collisionPieces, piece , moveSquares , allMoveSquare){
        if(collisionPieces[0].status === 'enemy' && collisionPieces[1].status === 'enemy' && collisionPieces[1].type === 'king'){
            this.setPinedPiece(collisionPieces[0] , piece , moveSquares  , allMoveSquare);
        }
    }
  
    setEnemyPieceBackedUp(collision){
        const playerPiece = this.getEnemyPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === collision.colPos);
        playerPiece.isBackedUp = true;
        return this;
    }
  
    collectMoveSquares(squareArray){
        squareArray.forEach( square => { this.allEnemyMoveSquare.push(square); })
        return this;
    } 
      
    setEnemeyPieceMoves(){
        this.getEnemyPlayer().playerPieces.forEach( enemyPiece => {
            let pieceMove = generalMovement.getPieceMoveUnfiltered(enemyPiece);
            this.analyzeEnemyPieceMove(enemyPiece , pieceMove); 
          });
        return this;
    }
}


export { Player };