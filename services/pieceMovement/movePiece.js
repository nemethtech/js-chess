import { chessConfig } from '../../config/chessConfig.config.js'
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { piecesRender } from '../pieceRender.js';


export const movePieceHandler = {

    movePiece(event){

        const targetDiv = event.target.tagName === 'DIV' ? event.target : event.target.parentNode ;
        const playerPiece = pieceHandle.getPlayerPieceSelected();

        piecesRender.removeEventListeners();
        playerPiece.piecePosition = targetDiv.getAttribute('id');
        playerPiece.piece.setAttribute('piecePosition', targetDiv.getAttribute('id'));
        
        targetDiv.firstChild.remove();
        pieceHandle.removeSelectPieceAndSquares()
        targetDiv.append(playerPiece.piece);

        gameHandler.endTurn();

    },

    movePieceForBot(pieceSettings, squareToMove){
        console.log('pieceSettings',pieceSettings);
        const piece = pieceSettings.piece;
        const targetDiv = pieceHandle.getPieceSquareById(squareToMove);
        let newSquareValue = targetDiv.getAttribute('id');;
        
        if(targetDiv.firstChild){
            targetDiv.removeChild(targetDiv.firstChild);s
        }
        targetDiv.append(piece);
        piecesRender.removeEventListeners();
        piece.setAttribute('piecePosition', newSquareValue);

        gameHandler.endTurn();
    }, 

    filterNonExistentSquares(squareArray){
        return squareArray.filter(e => e.length === 2).filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
    },
}