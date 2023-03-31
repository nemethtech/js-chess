import { $$ } from '../../utils/utils.js'
import { chessConfig } from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js';
import { movePieceHandler } from './movePiece.js';
import { gameHandler } from '../gameHandler.js';
import { piecesRender } from '../pieceRender.js';

export const pawnMovement = {
    
    returnAvailableSquares(pawnPiece){
       // console.log('this.getAvailableSquares(pawnPiece)',this.getAvailableSquares(pawnPiece));
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
        const rightCol = chessConfig.columns[colIdx + 1] ? chessConfig.columns[colIdx +  1 * moveSide] : undefined ;
        const leftCol = chessConfig.columns[colIdx -1] ? chessConfig.columns[colIdx-1 * moveSide] : undefined ;

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
                possibleCollision    : sideSquares.rightSideToAttack,
            },
            leftColumn : {
                possibleCollision    : sideSquares.leftSideToAttack,
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

   promotePawn(pawnPiece , pieceColor){
        const queenImgSrc = `pieces/${pieceColor}_queen.png`;
        pawnPiece.setAttribute( 'src'  , queenImgSrc);
        pawnPiece.setAttribute( 'piece-type'  , `${pieceColor}_queen`);
   },

   

   checkPawnsPromotion(){
    $$(`[piece-type=${gameHandler.currentTurnFor()}_pawn`).forEach( piece => {
        const piecePosition = piece.getAttribute( 'piece-square' );
        const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
            if(this.pawnCanBePromoted(piecePosition , pieceColor)){
                this.promotePawn(piece , pieceColor);
                console.log('promot time' , piece);
            }
        })
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

pawnCanBePromoted(piecePosition , pieceColor){
    if(pieceColor === 'white' &&
        piecePosition[1] === '8' ||
        pieceColor === 'black' &&
        piecePosition[1] === '1') 
        {
            return true; } else 
        {
            return false;
        }
   },
}

