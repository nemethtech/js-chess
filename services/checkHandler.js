import { $, $$ } from '../../utils/utils.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { gameHandler } from '../services/gameHandler.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { kingMovement } from '../services/pieceMovement/king.js'


export const checkHandler = {

    checkHandle : {
        isCheck : false ,
        checkColor : undefined , 
        canTheKingMove : false ,
        kingMove : undefined ,
        attackerSquare : [] ,
        attacketBackedup : false , 
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
            console.log('moveAbleSquares' ,  this.isAttackerBackedUp());
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
                    console.log('belép');
                    console.log('pieceType' , pieceType);
                    if(pieceType === 'pawn') {
                        this.checkHandle.resolvableSquares.push(val.possibleCollision);   
                    } else {
                        this.checkHandle.resolvableSquares.push(val.collisionFreeSquares); 
                    }
                        
                    this.checkHandle.attackerSquare.push(piecePosition);
                    console.log('checkH',this.checkHandle);
                }
            }
        });        
        return this;
      },

      clearHandlerObj(){
        this.checkHandle.isCheck = false;
        this.checkHandle.checkColor = undefined;
        this.checkHandle.canTheKingMove = false;
        this.checkHandle.kingMove = undefined;
        this.checkHandle.resolvableSquares = [];
        this.checkHandle.attackerSquare = [];
        this.checkHandle.forbiddenSqures = [];
        this.attacketBackedup = false;
        return this;
      },

      getCheckStatusForColor(color){
        return this.checkHandle.checkColor === color;
      },

      pieceCanBlockCheck(pieceSettings){    
        let pieceCanBlockCheck = false;
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
            if(checkHandler.checkHandle.attackerSquare.includes(possibleCollisionquares) && !checkHandler.checkHandle.attacketBackedup ){
                pieceCanBlockCheck = true;
            }
        });   
        return pieceCanBlockCheck;
    }, 

    isAttackerBackedUp(){
        const moveAbleSquares = [];
        $$(`[piece-type^=${gameHandler.whosTurn()}]`).forEach(piece => {
            const piecePosition = piecesRender.checkPiecePosition(piece);
            const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
            const handleParams = {
                piece,
                pieceType, 
                piecePosition,
                pieceColor,
                }
            
            moveAbleSquares.push(generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(handleParams ,  true)));
            if(pieceType !== 'pawn'){
                moveAbleSquares.push(generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(handleParams ,  true)));
            }
        })
        if(kingMovement.getForbiddenSquares(moveAbleSquares).includes(this.checkHandle.attackerSquare[0])){
            this.checkHandle.attacketBackedup = true;
            console.log('true');
        }
        return this;
    }
}
