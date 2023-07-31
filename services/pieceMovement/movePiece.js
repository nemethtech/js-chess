import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { piecesRender } from '../pieceRender.js';


export const movePieceHandler = {

    movePiece(event){

        const targetDiv = event.target.tagName === 'DIV' ? event.target : event.target.parentNode ;
        const playerPiece = pieceHandle.getPieceSelected();

        piecesRender.removeEventListeners();
     //   playerPiece.piecePosition = targetDiv.getAttribute('id');
        playerPiece.setAttribute('piecePosition', targetDiv.getAttribute('id'));
        
        targetDiv.firstChild.remove();
        pieceHandle.removeSelectPieceAndSquares()
        targetDiv.append(playerPiece);

        gameHandler.endTurn();

    },

    filterNonExistentSquares(squareArray){
        const validRows = Array.from({length: 8}, (_, i) => i + 1);
        return squareArray.filter(e => e.length === 2).filter( e => validRows.indexOf(parseInt(e[1])) !== -1);
    },
}