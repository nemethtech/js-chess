import { chessConfig }  from '../../config/chessConfig.config.js';
import { movePieceHandler } from './movePiece.js';
import {  Player } from '../playerClassExtend.js';

export const kingMovement = {

  returnAvailableSquares(kingPiece){

      return this.getAvailableSquares(kingPiece);
  },

  getAllAvaliableSquares2(kingPiece){

      const columnPos = kingPiece.piecePosition[0];
      const rowPos    = parseInt(kingPiece.piecePosition[1]);
      const colIdx    = chessConfig.columns.indexOf(columnPos);
      const possibleSquares = 
              [chessConfig.columns[colIdx-1]+(parseInt(rowPos)+1),
              chessConfig.columns[colIdx-1]+(parseInt(rowPos)-1),
              chessConfig.columns[colIdx-1]+(parseInt(rowPos)),
              chessConfig.columns[ colIdx ]+(parseInt(rowPos)+1),
              chessConfig.columns[ colIdx ]+(parseInt(rowPos)-1),
              chessConfig.columns[colIdx+1]+(parseInt(rowPos)),
              chessConfig.columns[colIdx+1]+(parseInt(rowPos)+1),
              chessConfig.columns[colIdx+1]+(parseInt(rowPos)-1)];

      const availableSquares = movePieceHandler.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));

      return availableSquares;
  },



  getAllAvaliableSquares(kingPiece){

    const columnPos = kingPiece.piecePosition[0];
    const rowPos    = parseInt(kingPiece.piecePosition[1]);
    const colIdx    = chessConfig.columns.indexOf(columnPos);
    const possibleSquares = 
            [chessConfig.columns[colIdx-1]+(parseInt(rowPos)+1),
            chessConfig.columns[colIdx-1]+(parseInt(rowPos)-1),
            chessConfig.columns[colIdx-1]+(parseInt(rowPos)),
            chessConfig.columns[ colIdx ]+(parseInt(rowPos)+1),
            chessConfig.columns[ colIdx ]+(parseInt(rowPos)-1),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)+1),
            chessConfig.columns[colIdx+1]+(parseInt(rowPos)-1)];

    const availableSquares = movePieceHandler.filterNonExistentSquares(possibleSquares.filter(e => typeof(e) === 'string'));
    const kingMove = {};
    availableSquares.forEach((e,i) => {
      kingMove[i] = [e] ; 
    })
    return kingMove;
},

  getAvailableSquares(kingPiece){

      const enemyColor = kingPiece.pieceColor === 'black' ? 'white' : 'black';
      const enemySquares = Player.instanceByColor(enemyColor).getPlayerPiecesMoveSquares();
      let kingSquares = this.getAllAvaliableSquares2(kingPiece);
      let avaliableSquares = kingSquares.filter( square => !enemySquares.includes(square));
      return this.checkKingMove(this.buildKingMove(avaliableSquares , enemySquares) , enemyColor);
  },

  buildKingMove(availableSquares , enemySquares){

      const kingMove = [];
      
      availableSquares.forEach((e,i) => {
          if(!enemySquares.includes(e)){
            kingMove[i] = {
              collisionFreeSquares : movePieceHandler.checkCollision([e]).collisionFreeSquares,
              possibleCollision : movePieceHandler.checkCollision([e]).possibleCollision
            }
          }
      })

      return kingMove
    },
 

  checkKingMove(kingMoveArray , enemyColor){

      let backedUpEnemySquares = []; 

      Player.instanceByColor(enemyColor).playerPieces.forEach( enemyPiece => {
        if(enemyPiece.isBackedUp){
          backedUpEnemySquares.push(enemyPiece.piecePosition)
        }
      })
      
      kingMoveArray.forEach( (kingMove )  => {
        if(backedUpEnemySquares.includes(kingMove.possibleCollision)){
          kingMove.possibleCollision = undefined;
        }
      })

      return kingMoveArray;
  },
  
}

