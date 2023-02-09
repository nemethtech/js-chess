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
        kingMove : undefined ,
        attackerSquare : [] ,
        resolvableSquares : [],
        forbiddenSqures : []
    },


    checkIfCheckIsOn(){ 
        console.log('checkIfCheckIsOn');
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
              this.checkCheckPossiblity(generalMovement.getPotentialSquares(handleParams),piecePosition , pieceType);
          })
      },
  
      checkKing(square){
    //    console.log('checkKing(square)',square);
    //    console.log('checkKing(pieceSquare)',$(`[id^="${square}"]`));
          let pieceSquare = $(`[id^="${square}"]`);
          if(!generalMovement.valueNullOrUndefined(pieceSquare.firstChild)){
              let pieceColor = pieceSquare.firstChild.getAttribute('piece-type').includes('white') ? 'white' : 'black';
              let kingPiece  = pieceSquare.firstChild.getAttribute('piece-type').includes('king') ? true : false;
              if(!gameHandler.pieceTurn(pieceColor) && kingPiece){ 
                  console.log('Chekk');
                  this.checkHandle.checkColor = pieceColor;
                  this.checkHandle.isCheck = true;
                  return true;
                }
                return false;
            }  
      },
  
      checkCheckPossiblity(verifiedSquares ,piecePosition , pieceType){
          Object.values(verifiedSquares).forEach(val => {                
              if(!generalMovement.valueNullOrUndefined(val.possibleCollision)){
                  if(this.checkKing(val.possibleCollision)){   
                    console.log('belép');
                    console.log('pieceType' , pieceType);
                    (pieceType === 'pawn') ?
                        this.checkHandle.resolvableSquares.push(val.possibleCollision) :   
                        this.checkHandle.resolvableSquares.push(val.collisionFreeSquares); 
                        
                    this.checkHandle.attackerSquare.push(piecePosition);
                    console.log('checkH',this.checkHandle);
                }
            }
        });        
        return this;
      },

      clearHandlerObj(){
        this.checkHandle.isCheck = false ;
        this.checkHandle.checkColor = undefined ;
        this.checkHandle.canTheKingMove = false ;
        this.checkHandle.kingMove = undefined;
        this.checkHandle.resolvableSquares = [];
        this.checkHandle.attackerSquare = [];
        this.checkHandle.forbiddenSqures = [];
        return this;
      },

      getCheckStatusForColor(color){
        return this.checkHandle.checkColor === color;
      },

      pieceCanBlockCheck(pieceSettings){
       
        let pieceCanBlockCheck = false;
        //    console.log('checkHandler' , checkHandler.checkHandle);
     //   console.log('pieceCanBlockCheck' , pieceSettings);
        if(checkHandler.checkHandle.resolvableSquares.length !== 1){
            return pieceCanBlockCheck;
        }
        const arrCollFreeSquares = generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(pieceSettings));
        const arrPossibleCollisionquares = generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(pieceSettings));
        arrCollFreeSquares.forEach(collFreeSquare => {
            if(checkHandler.checkHandle.resolvableSquares[0].includes(collFreeSquare)){
                pieceCanBlockCheck = true;
            }
        });   
        arrPossibleCollisionquares.forEach(possibleCollisionquares => {
            if(checkHandler.checkHandle.attackerSquare.includes(possibleCollisionquares)){
                pieceCanBlockCheck = true;
            }
        });   
        return pieceCanBlockCheck;
    }
}
