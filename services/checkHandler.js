import { $, $$ } from '../../utils/utils.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { piecesRender } from '../services/pieceRender.js'
import { gameHandler } from '../services/gameHandler.js'
import { generalMovement } from '../services/pieceMovement/general.js'
import { pieceHandle } from './pieceHandler.js'

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
              this.checkCheckPossiblity(generalMovement.getPotentialSquares(handleParams),piecePosition);
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
              return true;
          }
          return false;
          
      },
  
        checkCheckPossiblity(verifiedSquares ,piecePosition){
          Object.values(verifiedSquares).forEach(val => {                
              if(val.possibleCollision){
                  if(this.checkKing(val.possibleCollision)){   
                    this.checkHandle.resolvableSquares.push(val.collisionFreeSquares); 
                    this.checkHandle.attackerSquare.push(piecePosition);
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

      getCheckStatus(color){
        return this.checkHandle.checkColor === color;
      },

      pieceCanBlockCheck(pieceSettings){
        if(pieceSettings.pieceType.includes('king')){
            this.canKingeMoveUnderCheck(pieceSettings);
        }
        let pieceCanBlockCheck = false;
        if(checkHandler.checkHandle.resolvableSquares.length !== 1){
            return pieceCanBlockCheck;
        }
        const arrCollFreeSquares = generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(pieceSettings));
        arrCollFreeSquares.forEach(collFreeSquare => {
            if(checkHandler.checkHandle.resolvableSquares[0].includes(collFreeSquare)){
                pieceCanBlockCheck = true;
            }
        });   
        return pieceCanBlockCheck;
    },

    canKingeMoveUnderCheck(pieceSettings){
       /* const arrCollFreeSquares = generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(pieceSettings));
        
        checkHandler.checkHandle.resolvableSquares.forEach(subArr => {
            subArr.forEach(elem => {
              // this.getAllForbiddenSquare.push(elem);
            })
        })
        this.getAllForbiddenSquares();
        let b = arrCollFreeSquares.filter(e => !checkHandler.checkHandle.resolvableSquares[0].includes(e));
        console.log("king ",this.checkHandle);
        console.log("king arrCollFreeSquares",arrCollFreeSquares);
        console.log("king b",b);*/
      //  console.log("getAllForbiddenSquare",getAllForbiddenSquare);
        return true;
    },

}
