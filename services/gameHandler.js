import { $, $$ } from '../../utils/utils.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { generalMovement } from '../services/pieceMovement/general.js'

export const gameHandler = {

    endTurn(){
        this.getAllPossibleSquares();
        this.changeTurnSettings();
        generalMovement.clearPotentialSquares();
        piecesRender.resetRound();
    },

    pieceTurn(color){
        return chessConfig.currentTurn === color ? true : false;
    },

    whosTurn(){
        return chessConfig.currentTurn;
    },

    changeTurnSettings(){
        chessConfig.whiteTurn = chessConfig.whiteTurn === true ?  false : true;
        chessConfig.currentTurn = chessConfig.currentTurn  === 'white' ? 'black' : 'white';
    },

    getAllPossibleSquares(){
      //  console.log($$(`[piece-type^="${chessConfig.currentTurn}"]`)); 
      const arr = [];
        $$(`[piece-type^="${chessConfig.currentTurn}"]`).forEach(piece => {


            const piecePosition = piecesRender.checkPiecePosition(piece);
            const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
            
            const handleParams = {
                piece,
                pieceType, 
                piecePosition,
                pieceColor,
            }
            arr.push(handleParams,generalMovement.getPotentialSquares(handleParams));
        })
        //document.querySelectorAll('[piece-type*="white"]')
        console.log('arr',arr);
    },

    checkPossibleEnemy(square){
        let pieceSquare = $(`[id^="${square}"]`);
        let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
        if(!gameHandler.pieceTurn(pieceColor)){ 
            console.log('pieceSquare.firstChild.',pieceSquare.firstChild);
           // pieceSquare.classList.add('potential-enemy'); 
            return true;
        }
        return undefined;
    },

    setSquares(verifiedSquares){
        Object.values(verifiedSquares).forEach(val => {
            val.collisionFreeSquares.forEach(freeSquareId => {
                $(`[id^="${freeSquareId}"]`).classList.add( 'potential-square');
            })                   
            if(val.possibleCollision)generalMovement.checkPossibleEnemy(val.possibleCollision);
        });        
    },

}
