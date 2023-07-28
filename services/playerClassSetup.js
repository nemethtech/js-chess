import { Player } from './playerClassExtend.js'



class PlayerSetup extends Player {


    analyzeEnemyPieceMove(piece , pieceMove){

        for(const direction in pieceMove){
            
            if(pieceMove[direction].length > 0 ){

                const pieceSquares = this.getPieceSquareArray(pieceMove[direction]);
                const moveSquares = this.getMoveSquares(pieceMove[direction] , pieceSquares);
                this.collectMoveSquares(moveSquares);

                if(piece.pieceType === 'pawn' && (direction === 'rightColumn' || direction === 'leftColumn')){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , []);
                }
                else if( piece.pieceType === 'bishop' || piece.pieceType === 'rook' || piece.pieceType === 'queen'){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , moveSquares);
                }else if(piece.pieceType === 'knight' || piece.pieceType === 'king'  ){
                    this.checkCollisionsForEnemy(pieceSquares , piece  , []);
                }
            }     
        }
        return this;     
    }

    isPinLive(firstCollision , secondCollision){
        return this.getPieceStatus(firstCollision) ===  'ally' && this.pieceIsPlayerKing(secondCollision);
        
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

    setupPlayerPiece(piece , pieceMove){
        piece.moves = [];
        for(const direction in pieceMove){
            if(pieceMove[direction].length > 0 ){
                let collision = this.resetCollisionToDefault();
                const pieceSquares = this.getPieceSquareArray(pieceMove[direction]);
                let moveSquares = this.getMoveSquares(pieceMove[direction] , pieceSquares);

                if(pieceSquares.length > 0){
                    const collisionImg = this.getPieceImg(pieceSquares[0]);
                    collision.colType = this.getPieceStatus(collisionImg);  
                    collision.colPos = collisionImg.getAttribute( 'piecePosition' );   
                    collision.direction = direction;  
                }
                if(piece.pieceType !== 'king'){
                    if(piece.pieceType === 'pawn'){
                        if(direction === 'rightColumn' || direction === 'leftColumn'){
                            moveSquares = [];
                        }else{
                            collision = this.resetCollisionToDefault();
                        }
                    }
                    if(piece.isPined){
                        if(collision.colPos !== piece.pinInfo[0].attackerPosition){
                            collision = this.resetCollisionToDefault();
                        }
                        moveSquares = moveSquares.filter( moveSquare => piece.pinInfo[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                    }
                    if(this.isPlayerInCheck){
                        if(piece.isPined){
                            moveSquares = [];
                            collision = this.resetCollisionToDefault();
                        }
                        if(this.checkingPieces.length === 1){
                            moveSquares = moveSquares.filter( moveSquare => this.checkingPieces[0].attackerMoveSquares.indexOf(moveSquare) !== -1 );
                            if(collision.colPos !== this.checkingPieces[0].attackerPosition){
                                collision = this.resetCollisionToDefault();
                            }
                        }else{
                            moveSquares = [];
                            collision = this.resetCollisionToDefault();
                        }
                    }
                    if(collision.colPos === 'none' ||  collision.direction !== direction){
                        collision = this.resetCollisionToDefault();
                    }
                }else{
                    if(moveSquares.length > 0){
                        moveSquares = moveSquares.filter( moveSquare => this.allEnemyMoveSquare.indexOf(moveSquare) === -1 ); 
                    }
                    if(collision.colType === 'enemy'){
                        const enemy = this.getEnemyPlayer().playerPieces.find( piece => piece.piecePosition === collision.colPos);
                        if(enemy.isBackedUp){
                            collision = this.resetCollisionToDefault();
                        }
                    }
                }
                piece.moves.push({ direction, moveSquares  ,collision });
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
        return this;
    }

    resetCollisionToDefault(){
        return  {
            colPos  : 'none' ,
            colType : 'none' , 
            direction : 'none' , 
        }
    }

    checkAndSetPin(pieceSquares, piece , moveSquares){
        const firstCollision = this.getPieceImg(pieceSquares[0]);
        const secondCollision = this.getPieceImg(pieceSquares[1]);
        if(this.isPinLive(firstCollision, secondCollision)){
            this.setPinedPiece(firstCollision , piece , moveSquares );
            console.log('PINNN');
        }
        return this;
    }

    getSetup(){
        
        this.setPlayerValuesToDefault()
            .getPlayerPieces()
            .getEnemyPlayer()
            .setPlayerValuesToDefault()
            .getPlayerPieces()
            .getEnemeyP()
            .setEnemeyPieceMoves()
            .setPlayerPieceMoves();
    }

}

const playerTwo = new PlayerSetup('black');
const playerOne = new PlayerSetup('white');

export { PlayerSetup };