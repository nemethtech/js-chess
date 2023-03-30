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
        attackerSquares : [] ,
        resolvableSquares : [],
        forbiddenSqures : [] , 
        tempaRrr  : [] , 
    },


    checkIfCheckIsOn(){ 
        console.log('checkIfCheckIsOn');
    //    this.getPieces();
        $$(`[piece-type^="${chessConfig.currentTurn}"]`).forEach(piece => {
              const piecePosition = piece.getAttribute( 'piece-square' );;
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
          //   this.isAttackerBackedUp();
            console.log('isAttackerBackedUp');
            console.log('this.checkHandle',this.checkHandle);
            console.log('this.checkHandle.resolvableSquares',this.checkHandle.resolvableSquares );
        },
  
    checkKing(square){
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
                    if(pieceType === 'pawn') {
                        this.checkHandle.resolvableSquares.push(val.possibleCollision);   
                    } else {
                        this.checkHandle.resolvableSquares.push(val.collisionFreeSquares); 
                    }    
                    this.checkHandle.attackerSquares.push(piecePosition);
                    console.log('checkH',this.checkHandle);
                }
            }
            this.checkHandle.resolvableSquares = generalMovement.simplifyArray(this.checkHandle.resolvableSquares);
        });        
        return this;
      },

    clearHandlerObj(){
       // this.checkHandle = {};
        this.checkHandle.isCheck = false;
        this.checkHandle.checkColor = undefined;
        this.checkHandle.canTheKingMove = false;
        this.checkHandle.kingMove = undefined;
        this.checkHandle.resolvableSquares = [];
        this.checkHandle.attackerSquares = [];
        this.checkHandle.forbiddenSqures = [];
        this.tempaRrr = [];
        return this;
      },

      getCheckStatusForColor(color){
        return this.checkHandle.checkColor === color;
      },

    pieceCanBlockCheck(pieceSettings){    
        let pieceCanBlockCheck = false;
        if(this.checkHandle.attackerSquares.length > 1){
            return pieceCanBlockCheck;
        }
        const arrCollFreeSquares = generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(pieceSettings));
        const arrPossibleCollisionquares = generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(pieceSettings));
        arrCollFreeSquares.forEach(collFreeSquare => {
            if(this.checkHandle.resolvableSquares.includes(collFreeSquare)){
                pieceCanBlockCheck = true;
            }
        });   
        arrPossibleCollisionquares.forEach(possibleCollisionquare => {
            if(this.checkHandle.attackerSquares.includes(possibleCollisionquare)){
                pieceCanBlockCheck = true;
            }
        });   
        return pieceCanBlockCheck;
    }, 


   
}
