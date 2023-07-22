import { chessConfig } from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js';
import { movePieceHandler } from './movePiece.js';


export const pawnMovement = {
    
    returnAvailableSquares(pawnPiece){
        return this.getAvailableSquares(pawnPiece);
    },
  
    checkSideSquares( pawnPiece ){
        let rightSideToAttack = undefined; 
        let leftSideToAttack = undefined; 
        const moveSide = this.getPawnMoveOrder(pawnPiece);
        const ownSquareCol = pawnPiece.piecePosition[0];
        const ownSquareRow = parseInt(pawnPiece.piecePosition[1]);
        const colIdx = chessConfig.columns.indexOf(ownSquareCol);
        const rowIdx = chessConfig.rows.indexOf(ownSquareRow);
        const rowToAttack = chessConfig.rows[rowIdx + ( 1 * moveSide)] ? chessConfig.rows[rowIdx + ( 1 * moveSide)] : undefined ;
        const rightCol = chessConfig.columns[colIdx + 1 * moveSide] ? chessConfig.columns[colIdx +  1 * moveSide] : undefined ;
        const leftCol = chessConfig.columns[colIdx - 1 * moveSide] ? chessConfig.columns[colIdx- 1 * moveSide] : undefined ;

       !generalMovement.valueNullOrUndefined(rowToAttack) && !generalMovement.valueNullOrUndefined(leftCol) 
        if(!generalMovement.valueNullOrUndefined(rowToAttack) && !generalMovement.valueNullOrUndefined(leftCol) ){
            leftSideToAttack = leftCol + rowToAttack;
        }
        if(!generalMovement.valueNullOrUndefined(rowToAttack) && !generalMovement.valueNullOrUndefined(rightCol) ){
            rightSideToAttack = rightCol + rowToAttack;
        }
        return {
            rightSideToAttack,
            leftSideToAttack
        }
    },

    buildPawnMove(forwardSquares , sideSquares){
  
        return{
            forwardRows : {
                collisionFreeSquares : movePieceHandler.checkCollision(forwardSquares).collisionFreeSquares, 
            },
            rightColumn : {
                
                possibleCollision    : movePieceHandler.checkIfPieceOnSquare(sideSquares.rightSideToAttack),
            },
            leftColumn : {
                possibleCollision    : movePieceHandler.checkIfPieceOnSquare(sideSquares.leftSideToAttack),
               
            },
        }
    },

    getForwardSquares(pawnPiece){
        const rowIdx = this.getPawnPosition(pawnPiece).rowIdx ;
        const moveSide = this.getPawnMoveOrder(pawnPiece)
        const forwardSquares = [];

        if(( rowIdx + (1 * moveSide) >= 0 ) && (rowIdx + (1 * moveSide) <= 7)){ 
            forwardSquares.push(pawnPiece.piecePosition[0] + chessConfig.rows[rowIdx + (1 * moveSide)] );
            if(this.isTheFirstMove(pawnPiece)){
                if(( rowIdx + (2 * moveSide) >= 0 ) && (rowIdx + (2 * moveSide) <= 7)){
                    forwardSquares.push(pawnPiece.piecePosition[0] + chessConfig.rows[rowIdx + (2 * moveSide)] )
                }
            }
        }
        return forwardSquares;
   },

   getAvailableSquares(pawnPiece){
        return this.buildPawnMove(this.getForwardSquares(pawnPiece), this.checkSideSquares(pawnPiece));
   },

   getPawnPosition(pawnPiece){
        const ownSquareCol = pawnPiece.piecePosition[0];
        const ownSquareRow = parseInt(pawnPiece.piecePosition[1]);
        const colIdx = chessConfig.columns.indexOf(ownSquareCol);
        const rowIdx = chessConfig.rows.indexOf(ownSquareRow);
        return {
            colIdx,
            rowIdx
        }
   },

   getPawnMoveOrder(pawnPiece){
        return  pawnPiece.pieceColor === 'white' ? 1 : -1;
   },

   
   isTheFirstMove(pawnPiece){
    if(pawnPiece.pieceColor === 'white' &&
    pawnPiece.piecePosition[1] === '2' ||
       pawnPiece.pieceColor === 'black' &&
       pawnPiece.piecePosition[1] === '7') 
        {
            return true; } else 
        {
            return false;
        }
    },
    
   


}

