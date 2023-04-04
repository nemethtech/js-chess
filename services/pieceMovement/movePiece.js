import { $, $$ } from '../../utils/utils.js'
import { chessConfig } from '../../config/chessConfig.config.js'
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { generalMovement } from './general.js';
import { piecesRender } from '../pieceRender.js';


export const movePieceHandler = {

    clearPotentialSquares(){ű
        
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );;
            pieceBox.removeEventListener( 'click', this.movePiece )
        });
    },
    
    setEventsOnPotentialSquares(){

        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', this.movePiece )
        });
    },

    movePiece : function(event) {

        const piece = pieceHandle.pieceSelected();
        const isTargetEnemyPiece = pieceHandle.isTargetEnemyPiece(event.target);
        const targetDiv = isTargetEnemyPiece ? event.target.parentNode  :  event.target;
        const newSquareValue = targetDiv.getAttribute('id');
        
        if (isTargetEnemyPiece) {
            targetDiv.removeChild(event.target);
        }
        
        targetDiv.append(piece);
        pieceHandle.removeSelected();
        piecesRender.removeEventListeners();
        piece.setAttribute('piece-square', newSquareValue);
        gameHandler.endTurn();
    }, 

    movePieceForEnemy(pieceSettings, squareToMove){

        const piece = pieceSettings.piece;
        let newSqaureValue ;
        const targetDiv = pieceHandle.getPieceSquareById(squareToMove);

        if(this.checkPossibleEnemyForEnemy(squareToMove)){
            targetDiv.removeChild(targetDiv.firstChild);
            targetDiv.append(piece);
            newSqaureValue = targetDiv.getAttribute('id');
        }else{
            newSqaureValue = targetDiv.getAttribute('id');
            targetDiv.append(piece);
        }
        pieceSettings.piece.setAttribute('new-piece-square', newSqaureValue);
    }, 
    
    checkAndMarkPossibleEnemy(square){

        let squareChild = $(`[id^="${square.toString()}"]`).firstChild === null ? undefined : $(`[id^="${square}"]`).firstChild ;
        let pieceColor = undefined;

        if(!generalMovement.valueNullOrUndefined(squareChild)){
            pieceColor = squareChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
            if(!gameHandler.pieceTurn(pieceColor)){ 
                $(`[id^="${square}"]`).classList.add('potential-enemy'); 
                return true;
            }
        }
        return undefined;
    },

    checkIfEnemeyOnSquare(square){

        const squareElement = $(`[id^="${square.toString()}"]`);
        let enemyOnSquare = false;
        if(squareElement.firstChild != null  ){
            if(squareElement.firstChild.getAttribute('piece-type').includes(gameHandler.notCurrentTurnFor())){
                enemyOnSquare = true;
            }
        }

        return enemyOnSquare;
    },

    checkIfPieceOnSquare(square){

        let pieceOnSquare = null;
        if(square === undefined){
            return pieceOnSquare;
        }
        const squareElement = $(`[id^="${square.toString()}"]`);
        if(squareElement.firstChild != null  ){
            pieceOnSquare = square;
        }

        return pieceOnSquare;
    },
    checkPossibleEnemyOnSquarecheckPossibleEnemyOnSquare(square){

        let pieceSquare = $(`[id^="${square}"]`);
        if(!generalMovement.valueNullOrUndefined(squareChild)){
            let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
            if(!gameHandler.pieceTurn(pieceColor)){ 
                return true;
            }
        }
        return undefined;
    },

    checkCollision(arr){         

        let collisionArray = arr.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        let possibleCollision = collisionArray.length === 0 ? undefined  : collisionArray[0];
        let collisionFreeSquares = possibleCollision === undefined ? arr : arr.slice(0,(arr.indexOf(possibleCollision)));
        return {
            collisionFreeSquares , 
            possibleCollision
        }  
    },

    filterNonExistentSquares(squareArray){

        return squareArray.filter(e => e.length === 2).filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
    },
}