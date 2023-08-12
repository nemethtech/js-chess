import { chessConfig } from '../config/chessConfig.config.js';
import { $ } from '../utils/utils.js';
import { NewPlayer} from './newPlayerClass.js'
import { generalMovement } from './pieceMovement/general.js';

export const enemyStatus = {

    enemyStatus : {},


    getEnemyInfo(){

        this.enemyStatus = chessConfig.enemyStatusModell;

        NewPlayer.getPlayer().newEnemyPieces.forEach( enemyPiece => {
            const enemyPieceMove = generalMovement.getPieceMoveUnfiltered(enemyPiece);
             this.analyzeEnemyPieceMove(enemyPiece , enemyPieceMove); 
          });
          return this.enemyStatus;
    },

    analyzeEnemyPieceMove(piece , pieceMove){

        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                const collisionPieces = generalMovement.getCollisionPieces(pieceMove[direction] , true);
                const moveSquares = generalMovement.getMoveSquares(pieceMove[direction] , collisionPieces[0]);
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
    },

    checkCollisionsForEnemy(collisionPieces ,   piece  , moveSquares , allMoveSquare){
        if(collisionPieces.length === 0){
            return;
        }else if(collisionPieces.length === 1){
            this.handleCollisionForEnemy(piece , collisionPieces[0]  ,  moveSquares , allMoveSquare);
        }else if(collisionPieces.length > 1){
            this.handleCollisionForEnemy(piece , collisionPieces[0]  ,  moveSquares , allMoveSquare); 
            this.checkAndSetPin(collisionPieces, piece  , allMoveSquare)    
        }
    },

    handleCollisionForEnemy(piece , collision  ,  moveSquares , allMoveSquare) {
        if(collision.status === 'enemy') {
            if(collision.type === 'king'){
                this.enemyStatus.checkStatus.playerInCheck = true;
                this.enemyStatus.checkStatus.attackerCounter++;
                this.enemyStatus.checkStatus.checkThreat.push({
                    attackerPosition : piece.piecePosition,
                    attackerMoveSquares : moveSquares , 
                });
                if(allMoveSquare.indexOf(collision.colPos)+1 !== -1){
                    this.enemyStatus.allEnemyMoveSquare.push(allMoveSquare[allMoveSquare.indexOf(collision.colPos)+1]); 
                }
                return this;
            }
        } else{
            return this.setEnemyPieceBackedUp(collision);
        } 
    },

    setPinedPiece(firstCollision , piece  , allMoveSquare){
        const playerPiecePosition = NewPlayer.getPlayer().newPlayerPieces.find( playerPiece => playerPiece.piecePosition === firstCollision.colPos).piecePosition;
        this.enemyStatus.pinInfo.arePinedPiece = true;
        this.enemyStatus.pinInfo.pinInfo.push({
            attackerPosition : piece.piecePosition,
            attackerMoveSquares : allMoveSquare, 
            pinedPlayerPiece : playerPiecePosition,
        })
        return this;
    },

    checkAndSetPin(collisionPieces, piece , moveSquares , allMoveSquare){
        if(collisionPieces[0].status === 'enemy' && collisionPieces[1].status === 'enemy' && collisionPieces[1].type === 'king'){
            this.setPinedPiece(collisionPieces[0] , piece , moveSquares  , allMoveSquare);
        }
    },
  
    setEnemyPieceBackedUp(collision){
        if(!this.enemyStatus.backedUpEnemeyPieces.includes(collision.colPos)){
            this.enemyStatus.backedUpEnemeyPieces.push(collision.colPos);
        }
        return this;
    },
  
    collectMoveSquares(squareArray){
        squareArray.forEach( square => { 
            if(!this.enemyStatus.allEnemyMoveSquare.includes(square)){
                this.enemyStatus.allEnemyMoveSquare.push(square); 
            }
        })
        return this;
    }, 
      
  
}
