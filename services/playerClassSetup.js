import { $ } from '../utils/utils.js';
import { bishopMovement } from './pieceMovement/bishop.js';
import { kingMovement } from './pieceMovement/king.js';
import { knightMovement } from './pieceMovement/knight.js';
import { pawnMovement } from './pieceMovement/pawn.js';
import { rookMovement } from './pieceMovement/rook.js';
import { Player } from './playerClassExtend.js'



class PlayerSetup extends Player {


    
    getPieceMoveUnfiltered(piece){

       // console.log('piece:' , piece);
        switch (piece.pieceType) {
            case 'rook':
              return rookMovement.getAllPossibleSquares(piece);
            case 'pawn':
              return pawnMovement.getAllPossibleSquares(piece);
            case 'bishop':
              return bishopMovement.getAllPossibleSquares(piece);
            case 'knight':
              return knightMovement.getAllPossibleSquares(piece);
            case 'king':
              return kingMovement.getAllAvaliableSquares(piece);
            case 'queen':
              return {
                ...bishopMovement.getAllPossibleSquares(piece),
                ...rookMovement.getAllPossibleSquares(piece)
              }
          }
    
    }

    getSetup(){
        Player.getEnemyPlayer()
            .setPlayerValuesToDefault()
            .getPlayerPieces();

        Player.getEnemyPlayer().playerPieces.forEach( enemyPiece => {

            let pieceMove = this.getPieceMoveUnfiltered(enemyPiece);
            this.analyzeEnemyPieceMove(enemyPiece , pieceMove);
            
        })
    }

    analyzeEnemyPieceMove(piece , pieceMove){

        for(const direction in pieceMove){

            if(pieceMove[direction].length > 0 ){

                if(piece.pieceType === 'pawn'){
                    if(direction === 'rightColumn' || direction === 'leftColumn'){
                            this.handleSquare(pieceMove[direction][0])
                    } else if(pieceMove[direction] === 'forwardRows'){
                            this.collectMoveSquares(pieceMove[direction]);
                    } 
                }
                if(piece.pieceType === 'bishop'){

                    const pieceSquares = pieceMove[direction].filter(square => $(`[id^="${square}"]`).hasChildNodes());

                    if(pieceSquares.length === 0){
                        this.collectMoveSquares(pieceMove[direction]);
                    }else{
                        const freeSquaresIndex = pieceSquares.length === 0 ? pieceMove[direction].length  : pieceMove[direction].indexOf(pieceSquares[0]);
                        const freeMoveSquares = pieceMove[direction].slice(0,freeSquaresIndex);
                        this.collectMoveSquares(freeMoveSquares);
                        if(pieceSquares.length === 1){
                            this.handleSquare(pieceSquares[0]);
                        }else{
                            console.log('isPinLive??');
                            if(this.isPinLive(pieceSquares)){
                                console.log('isPinLifsafave',pieceSquares);
                            }
                        }

                    }
   

                    console.log('piece',piece);
                    console.log('pieceMove[direction]',pieceMove[direction]);
                    console.log('freeSquaresIndex',freeSquaresIndex);
               
                    console.log('pieceSquares',pieceSquares);
                }
                        

                       
                    
                    
                    
                }
                
            }
            
        }

    isPinLive(pieceSquares){
        const firstCollision = $(`[id^="${pieceSquares[0]}"]`).firstChild;
        const secondCollision = $(`[id^="${pieceSquares[1]}"]`).firstChild;
        console.log('firstCollision',firstCollision);
        console.log('secondCollision',secondCollision);
        console.log('this.getPieceStatus(firstCollision) ',this.getPieceStatus(firstCollision) ===  'ally');
        console.log('pieceIsPlayerKing ',this.pieceIsPlayerKing(secondCollision));
        return this.getPieceStatus(firstCollision) ===  'ally' && this.pieceIsPlayerKing(secondCollision);
        
    }

    handleSquare(square){
        if($(`[id^="${square}"]`).hasChildNodes()){
            const pieceImg = $(`[id^="${square}"]`).firstChild;
            switch (this.getPieceStatus(pieceImg)) {
                case 'ally':
                    return this.checkAllyPiece(pieceImg);
                case 'enemy':    
                    return this.setEnemyPieceBackedUp(pieceImg);
            } 
        } else {  
            this.collectMoveSquares([square]);
        }
        return this;
    }

    getPieceStatus(pieceImg){
        return this.playerColor === pieceImg.getAttribute( 'piece-type' ).split('_')[0] ? 'ally' : 'enemy';
    }

    setEnemyPieceBackedUp(pieceImg){
        const playerPiece = Player.getEnemyPlayer().playerPieces.find( playerPiece => playerPiece.piecePosition === pieceImg.getAttribute( 'piecePosition' ));
        playerPiece.isBackedUp = true;
        return this;
    }

    checkAllyPiece(piece){
        if(this.pieceIsPlayerKing(piece)){
            this.isPlayerInCheck = true;
        }
        return this;
    }

    pieceIsPlayerKing(pieceImg){
        return pieceImg.getAttribute('piece-type').split('_')[1]  === 'king' && pieceImg.getAttribute('piece-type').split('_')[0] === this.playerColor;
    }

    collectMoveSquares(squareArray){
        squareArray.forEach( square => {
            this.allEnemyMoveSquare.push(square);
        })
        return this;
    }
}

const playerTwo = new PlayerSetup('black');
const playerOne = new PlayerSetup('white');

export { PlayerSetup };