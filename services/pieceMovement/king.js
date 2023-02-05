import { gameHandler }  from '../gameHandler.js'
import { $$ }           from '../../utils/utils.js'
import { chessConfig }  from '../../config/chessConfig.config.js';
import { generalMovement } from './general.js'
import { piecesRender } from '../pieceRender.js';
import { movePieceHandler } from './movePiece.js';


export const kingMovement = {

    returnAvailableSquares(kingPiece){
        return this.getAvailableSquares(kingPiece);
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
        return availableSquares;
    },


    getAllForbiddenSquares(){
        let allForbiddenSquares = [];
          $$(`[piece-type^="${gameHandler.notCurrentTurnFor().toString()}"]`).forEach(piece => {
              const piecePosition = piecesRender.checkPiecePosition(piece);
              const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
              const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
              const handleParams = {
                  piece,
                  pieceType, 
                  piecePosition,
                  pieceColor,
                }
            
                if(pieceType !== 'king'){
                  allForbiddenSquares.push(generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(handleParams ,  true)));
                  const piecePosition = piecesRender.checkPiecePosition(piece);
                  if(pieceType === 'pawn' && piecePosition === "e5"){
                    let a = generalMovement.getPotentialSquares(handleParams ,  true) 
                    Object.values(a).forEach(val => {
                      console.log('val' , val);                 
                  });      
                }    
              }
          })
        return allForbiddenSquares;
      } , 
  
      getForbiddenSquares(allForbiddenSquares){
        const mergedSquares = allForbiddenSquares.flat(1);
        const resArr =  mergedSquares.filter((element, index) => {
            return mergedSquares.indexOf(element) === index;
        });
        return resArr;
      },

      getAvailableSquares(kingPiece){
        const enemySquares = this.getForbiddenSquares(this.getAllForbiddenSquares());
        let kingSquares = this.getAllAvaliableSquares(kingPiece);
        let avaliableSquares = kingSquares.filter( square => !enemySquares.includes(square));
        return this.buildKingMove(avaliableSquares);
      },

      buildKingMove(availableSquares){
        const kingMove = {};

        availableSquares.forEach((e,i) => {
            kingMove[i] = {
                collisionFreeSquares : movePieceHandler.checkCollision([e]).collisionFreeSquares,
                possibleCollision : movePieceHandler.checkCollision([e]).possibleCollision
            }
        })
        return kingMove
      },

      canTheKingMove(kingPiece){
        const enemySquares = this.getForbiddenSquares(this.getAllForbiddenSquares());
        let kingSquares = this.getAllAvaliableSquares(kingPiece);
        let avaliableSquares = kingSquares.filter( square => !enemySquares.includes(square));

        return avaliableSquares.length > 0 ? true : false;
      }

      
}

