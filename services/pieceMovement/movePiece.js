import { $, $$ } from '../../utils/utils.js'
import { chessConfig } from '../../config/chessConfig.config.js'
import { gameHandler } from '../gameHandler.js';
import { pieceHandle } from './../pieceHandler.js'
import { checkHandler } from '../checkHandler.js';
import { generalMovement } from './general.js';


export const movePieceHandler = {

    clearPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.classList.remove( 'potential-enemy' );
            pieceBox.classList.remove( 'potential-square' );;
            pieceBox.removeEventListener( 'click', this.movePiece)
        });
    },
    
    setEventsOnPotentialSquares(){
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', this.movePiece)
        });
    },

    movePiece : function(event) {

        const piece = pieceHandle.pieceSelected();
    //    gameHandler.playerOne.randomArr.push(piece);
        let newSqaureValue ;
   
        if(pieceHandle.isTargetEnemyPiece(event.target)){
            const targetDiv = event.target.parentNode;
            targetDiv.removeChild(event.target);
            targetDiv.append(piece);
            newSqaureValue = targetDiv.getAttribute('id');
        }else{
            newSqaureValue = event.target.getAttribute('id');
            event.target.append(piece);
        }
        piece.setAttribute('new-piece-square', newSqaureValue);
        pieceHandle.removeSelected();
        checkHandler.clearHandlerObj();
        gameHandler.endTurn();
    }, 

    movePieceForEnemy(pieceSettings, squareToMove){
        console.log('pieceSettings',pieceSettings);
        console.log('squareToMove',squareToMove);
        const piece = pieceSettings.piece;
        let newSqaureValue ;
        const targetDiv = pieceHandle.getPieceSquareById(squareToMove);
        console.log('targetDiv',targetDiv);
        console.log('this.checkPossibleEnemyForEnemy(squareToMove)',this.checkPossibleEnemyForEnemy(squareToMove));
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
      //  console.log('square',square);
      //  console.log(' $(`[id^="${square.toString()}"]`).firstChild ', $(`[id^="${square.toString()}"]`).firstChild );

     //   console.log('squareChild',squareChild);
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

    checkPossibleEnemyForEnemy(square){
        let pieceSquare = $(`[id^="${square}"]`);
        if(!generalMovement.valueNullOrUndefined(squareChild)){
            let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
            if(!gameHandler.pieceTurn(pieceColor)){ 
                return true;
            }
        }
        return undefined;
    },

    checkCollisionWithKing(arr, bool){         
        let collisionArray = arr.filter( e => $(`[id^="${e}"]`).hasChildNodes());
        let possibleCollision = collisionArray.length === 0 ? undefined  : collisionArray[0];
        if(pieceHandle.getPieceSquareById(possibleCollision)){
            let a = pieceHandle.getPieceSquareById(possibleCollision).firstChild;
            const pieceColor = a.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = a.getAttribute( 'piece-type' ).split('_')[1];

            if( pieceColor === gameHandler.whosTurn() && pieceType === 'king' && bool){
                possibleCollision = undefined;
            }
        }
        let collisionFreeSquares = possibleCollision === undefined ? arr : arr.slice(0,(arr.indexOf(possibleCollision)));
        return {
            collisionFreeSquares , 
            possibleCollision
        }  
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