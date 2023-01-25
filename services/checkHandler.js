import { $, $$ } from '../../utils/utils.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { gameHandler } from '../services/gameHandler.js'
import { generalMovement } from '../services/pieceMovement/general.js'

export const checkHandler = {

    checkHandle : {
        isCheck : false ,
        checkColor : undefined , 
        canTheKingMove : false ,
        resolvableSquares : undefined,
        kingMove : undefined
    },


    getAllPossibleSquares(){ 
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
              this.setSquares(generalMovement.getPotentialSquares(handleParams));
          })
      },
  
      checkKing(square){
          let pieceSquare = $(`[id^="${square}"]`);
          let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
          let kingPiece  = pieceSquare.firstChild.getAttribute('piece-type').includes('king') ? true : false;
          if(!gameHandler.pieceTurn(pieceColor) && kingPiece){ 
              console.log('Chekk');
              this.checkHandle.checkColor = pieceColor;
              this.checkHandle.isCheck = true;
              return this;
          }
          return this;
          
      },
  
      setSquares(verifiedSquares){
          Object.values(verifiedSquares).forEach(val => {                
              if(val.possibleCollision){
                  if(this.checkKing(val.possibleCollision)){
                    this.checkHandle.resolvableSquares = val.collisionFreeSquares; 
                }
            }
        });        
        return this;
      },

      clearHandlerObj(){
        this.checkHandle. isCheck = false ;
        this.checkHandle.checkColor = undefined ;
        this.checkHandle.canTheKingMove = false ;
        this.checkHandle.resolvableSquares = undefined;
        this.checkHandle.kingMove = undefined;
        return this;
      },

      getCheckStatus(color){
        return this.checkHandle.checkColor === color;
      }
}
