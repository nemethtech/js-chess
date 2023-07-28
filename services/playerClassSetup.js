import { $ } from '../utils/utils.js';
import { generalMovement } from './pieceMovement/general.js';
import { Player } from './playerClassExtend.js'



class PlayerSetup extends Player {


    analyzeEnemyPieceMove(piece , pieceMove){

        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                const pieceSquares = this.getPieceSquareArray(pieceMove[direction]);
                const moveSquares = this.getMoveSquares(pieceMove[direction] , pieceSquares);
                this.collectMoveSquares(moveSquares);

                if(piece.pieceType === 'pawn'){
                    if(direction === 'rightColumn' || direction === 'leftColumn'){
                        this.checkCollisionsForEnemy(pieceSquares , piece  , []);
                    }
                }
                else if( piece.pieceType === 'bishop' || piece.pieceType === 'rook' || piece.pieceType === 'queen'){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , moveSquares);
                }else if(piece.pieceType === 'knight' || piece.pieceType === 'king'  ){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , []);
                }
            }
            
        }
        
    }

    isPinLive(firstCollision , secondCollision){
        return this.getPieceStatus(firstCollision) ===  'ally' && this.pieceIsPlayerKing(secondCollision);
        
    }

    handleSingleAttack(attackSquare , piece , attackerIsKing){
        if($(`[id^="${attackSquare}"]`).hasChildNodes()){
            this.handlePieceSquare(piece , attackSquare  ,  []);
        } else {  
            this.collectMoveSquares([attackSquare]);
        }
        return this;
    }

    checkCollisionsForEnemy(pieceSquares ,   piece  , moveSquares){
        if(pieceSquares.length === 0){
            return;
        }else if(pieceSquares.length === 1){
            this.handlePieceSquare(piece , pieceSquares[0]  ,  moveSquares);
        }else if(pieceSquares.length > 1){
            this.handlePieceSquare(piece , pieceSquares[0]  ,  moveSquares); 
            this.checkAndSetPin(pieceSquares, piece , moveSquares)    
        }
    }

    checkCollisionsForPlayer(pieceSquares){
        if(pieceSquares.length > 0){
            const collisionImg = this.getPieceImg(collisionImg);
            if(this.getPieceStatus(collisionImg) === 'enemy'){
                piece.collisions.push({
                    colPiecePosition : collisionImg.getAttribute( 'piecePosition' ) , 
                })
            }
        }
        return this;
    }

    setupPlayerPiece(piece , pieceMove){
        piece.moveSquares = [];
        for(const direction in pieceMove){
            
            let bigCollisions  = [];
            let collision = 'none';
            let collisionType = 'none';
            let colDirection = 'none';
            if(pieceMove[direction].length > 0 ){

                const pieceSquares = this.getPieceSquareArray(pieceMove[direction]);
                let moveSquares = this.getMoveSquares(pieceMove[direction] , pieceSquares);
                if(pieceSquares.length > 0){
                    const collisionImg = this.getPieceImg(pieceSquares[0]);
                    collisionType = this.getPieceStatus(collisionImg);
                    collision =  collisionImg.getAttribute( 'piecePosition' );   
                    colDirection = direction;       
                }
                if(piece.pieceType === 'pawn'){
                    if(direction === 'rightColumn' || direction === 'leftColumn'){
                        moveSquares = [];
                    }
                }
                if(piece.isPined){
                    if(collision !== piece.pinInfo[0].attackerPosition){
                        collision = 'none';
                    }
                    moveSquares = moveSquares.filter( moveSquare => piece.pinInfo[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
     
                }
                if(this.isPlayerInCheck){
                    if(piece.isPined){
                        moveSquares = [];
                        collision = 'none';
                    }
                    if(this.checkingPieces.length === 1){
                        moveSquares = moveSquares.filter( moveSquare => this.checkingPieces[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                        console.log('moveSquares sakkban',moveSquares );
                    }
                    if(collision !== this.checkingPieces[0].attackerPosition){
                        collision = 'none';
                    }
                }
                if(collision !== 'none' && colDirection === direction){
                    bigCollisions.push({
                        colPos : collision ,
                        collisionType ,
                    });
                }
                piece.moveSquares.push({ direction, moveSquares  , bigCollisions  });
            }
        }
    }


   handlePieceSquare(piece , collisionPiece  ,  moveSquares) {
        const pieceImg = this.getPieceImg(collisionPiece);
        switch (this.getPieceStatus(pieceImg)) {
            case 'ally':
                if(this.pieceIsPlayerKing(pieceImg)){
                    this.isPlayerInCheck = true;
                    this.checkingPieces.push({
                        attackerPosition : piece.piecePosition,
                        attackerPieceType    : piece.pieceType,
                        attackerMoveSquares : moveSquares
                    });
                }
                return this;
            case 'enemy':    
                return this.setEnemyPieceBackedUp(pieceImg);
        } 
   }

    getMoveSquares(squareArr , pieceSquaresArr ){
        const freeSquaresIndex = pieceSquaresArr.length === 0 ? squareArr.length  : squareArr.indexOf(pieceSquaresArr[0]);
        const freeMoveSquares = squareArr.slice(0,freeSquaresIndex);
        return freeMoveSquares;
    }

    setPinedPiece(firstCollision , piece , moveSquares ){
        const playerPiece = this.playerPieces.find( playerPiece => playerPiece.piecePosition === firstCollision.getAttribute('piecePosition'));
        playerPiece.isPined = true;
        playerPiece.pinInfo = [];
        playerPiece.pinInfo.push({
            attackerPosition : piece.piecePosition,
            attackerPieceType    : piece.pieceType,
            attackerMoveSquares : moveSquares
        })
    }

    checkAndSetPin(pieceSquares, piece , moveSquares){
        const firstCollision = this.getPieceImg(pieceSquares[0]);
        const secondCollision = this.getPieceImg(pieceSquares[1]);
        if(this.isPinLive(firstCollision, secondCollision)){
            this.setPinedPiece(firstCollision , piece , moveSquares );
            console.log('PINNN');
        }
    }

    getPieceSquareArray(squareArr){
        return squareArr.filter(square => $(`[id^="${square}"]`).hasChildNodes());
    }

    getPieceImg(square){
        return $(`[id^="${square}"]`).firstChild;
    }

    getPieceStatus(pieceImg){
        return this.playerColor === pieceImg.getAttribute( 'piece-type' ).split('_')[0] ? 'ally' : 'enemy';
    }

    setEnemyPieceBackedUp(pieceImg){
        const playerPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === pieceImg.getAttribute( 'piecePosition' ));
        playerPiece.isBackedUp = true;
        return this;
    }

    pieceIsPlayerKing(pieceImg){
        return pieceImg.getAttribute('piece-type').split('_')[1]  === 'king' && pieceImg.getAttribute('piece-type').split('_')[0] === this.playerColor;
    }

    collectMoveSquares(squareArray){
        squareArray.forEach( square => { this.allEnemyMoveSquare.push(square); })
        return this;
    }


    getSetup(){
        
        this.setPlayerValuesToDefault()
            .getPlayerPieces();

        Player.getEnemyPlayer()
            .setPlayerValuesToDefault()
            .getPlayerPieces();
        
        Player.getEnemyPlayer().playerPieces.forEach( enemyPiece => {

            let pieceMove = generalMovement.getPieceMoveUnfiltered(enemyPiece);
            this.analyzeEnemyPieceMove(enemyPiece , pieceMove);
            
        });

        this.playerPieces.forEach( playerPiece => {
            let pieceMove = generalMovement.getPieceMoveUnfiltered(playerPiece);
            this.setupPlayerPiece(playerPiece , pieceMove);
        })
    }

}

const playerTwo = new PlayerSetup('black');
const playerOne = new PlayerSetup('white');

export { PlayerSetup };