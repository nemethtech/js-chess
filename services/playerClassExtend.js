import { generalMovement } from "./pieceMovement/general.js";
import { BasePlayer } from "./playerClass.js";


class Player extends BasePlayer {

    analyzeEnemyPieceMove(piece , pieceMove){
        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                const pieceSquares = generalMovement.getPieceSquareArray(pieceMove[direction]);
                const pieceSquares2 = this.getCollisionPieces(pieceMove[direction]);
                if(pieceSquares2.length > 0){

                    console.log('piece',piece);
                    console.log('pieceSquares2',pieceSquares2);
                    console.log('pieceMove[direction]',pieceMove[direction]);
                }
                const moveSquares = generalMovement.getMoveSquares(pieceMove[direction] , pieceSquares);
                this.collectMoveSquares(moveSquares);

                if(piece.pieceType === 'pawn' && (direction === 'rightColumn' || direction === 'leftColumn')){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , []  , []);
                }
                else if( piece.pieceType === 'bishop' || piece.pieceType === 'rook' || piece.pieceType === 'queen'){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , moveSquares , pieceMove[direction]);
                }else if(piece.pieceType === 'knight' || piece.pieceType === 'king'  ){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , []  , []);
                }
            }     
        }
        return this;     
    }


    checkCollisionsForEnemy(pieceSquares ,   piece  , moveSquares , allMoveSquare){
        if(pieceSquares.length === 0){
            return;
        }else if(pieceSquares.length === 1){
            this.handlePieceSquare(piece , pieceSquares  ,  moveSquares , allMoveSquare);
        }else if(pieceSquares.length > 1){
            this.handlePieceSquare(piece , pieceSquares  ,  moveSquares , allMoveSquare); 
            this.checkAndSetPin(pieceSquares, piece  , allMoveSquare)    
        }
    }

    handlePieceSquare(piece , pieceSquares  ,  moveSquares , allMoveSquare) {
        const pieceImg = generalMovement.getPieceImg(pieceSquares[0]);
        switch (generalMovement.getPieceStatus(pieceImg , this.playerColor)) {
            case 'ally':
                if(generalMovement.pieceIsPlayerKing(pieceImg)){
                    this.isPlayerInCheck = true;
                    this.checkingPieces.push({
                        attackerPosition : piece.piecePosition,
                        attackerMoveSquares : moveSquares , 
                       
                    });
                    if(allMoveSquare.indexOf(pieceSquares[0])+1 !== -1){
                        this.allEnemyMoveSquare.push(allMoveSquare[allMoveSquare.indexOf(pieceSquares[0])+1]); 
                    }
                }
                return this;
            case 'enemy':    
                return this.setEnemyPieceBackedUp(pieceImg);
        } 
   }


    setPinedPiece(firstCollision , piece  , allMoveSquare){
        const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === firstCollision.getAttribute('piecePosition'));
        playerPiece.isPined = true;
        playerPiece.pinInfo = [];
        playerPiece.pinInfo.push({
            attackerPosition : piece.piecePosition,
            attackerMoveSquares : allMoveSquare, 
        })
        return this;
    }


    checkAndSetPin(pieceSquares, piece , moveSquares , allMoveSquare){
        const firstCollision = generalMovement.getPieceImg(pieceSquares[0]);
        const secondCollision = generalMovement.getPieceImg(pieceSquares[1]);
        if(generalMovement.isPinLive(firstCollision, secondCollision , this.playerColor)){
            this.setPinedPiece(firstCollision , piece , moveSquares  , allMoveSquare);
            console.log('PINNN');
        }
        return this;
    }
  
    
    setEnemyPieceBackedUp(pieceImg){
        const playerPiece = this.getEnemyPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === pieceImg.getAttribute( 'piecePosition' ));
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