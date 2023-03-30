import { $ , $$ } from "../../utils/utils.js";
import { generalMovement } from "./pieceMovement/general.js";
import { piecesRender } from "./pieceRender.js";



class BasePlayer {
    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.enemyColor = color === 'white' ? 'black' : 'white';
      this.playerPieces = [];
      this.attackSquares = [];
      this.pieceCollisions = [];
      this.hasTheKingMoved = false;
      this.isPlayerInCheck = false;
      BasePlayer.instances[color] = this;
    }
    
    getPlayerPieces(){
      this.playerPieces = [];
      $$(`[piece-type^="${this.playerColor}"]`).forEach(piece => {
          const piecePosition = piecesRender.checkPiecePosition(piece);
          const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
          const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
          
          const handleParams = {
              piece,
              pieceType, 
              piecePosition,
              pieceColor,
          }
          this.playerPieces.push(handleParams);
      }); 
    }

    getAttackerSquares(){
      this.attackSquares = [];
      this.playerPieces.forEach(piece => {
        if(piece.pieceType === 'pawn'){
          this.attackSquares.push(generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(piece ,  true)));
        }else {
          this.attackSquares.push(generalMovement.getCollisionFreeSquares(generalMovement.getPotentialSquares(piece ,  true)));
        }
      })
      this.attackSquares = this.attackSquares.flat(1);
      this.attackSquares = this.attackSquares.filter((element, index) => {
        return this.attackSquares.indexOf(element) === index;
    });
 
    }

    setPieceCollisions(){
      this.pieceCollisions = [];

      this.playerPieces.forEach(piece => {
        let collisionArray = generalMovement.getPossibleCollisionquares2(generalMovement.getPotentialSquares(piece ,  true));
        if(collisionArray.length > 0){
          collisionArray.forEach(collision =>{
          let collisionPiece = $(`[id^="${collision.square}"]`);
         //   console.log('collisionPiece',collisionPiece.firstChild);
            if(!generalMovement.valueNullOrUndefined(collisionPiece.firstChild)){
              if(collisionPiece.firstChild.getAttribute('piece-type').includes(this.enemyColor)){

                let enemyPieceType = collisionPiece.firstChild.getAttribute('piece-type');
  
                  this.pieceCollisions.push({
                    playerPieceType : piece.pieceType , 
                    attackSquare : collision.square ,
                    direction : collision.direction ,
                    enemyPieceType , 
                  })
              }
            }   
          })
        }
      })
    }


    getCollisionSquares(){

      this.playerPieces.forEach(piece => {
   //     let collisionArray = generalMovement.getPossibleCollisionquares2(generalMovement.getPotentialSquares(piece ,  true));

      })
//      return collisionArray.flat(1);
    } 

    clgCollisions(){
      this.pieceCollisions.forEach(pieceCollision =>{
        console.log("itt");
        if(pieceCollision.enemyPieceType.includes('king')){
          console.log('CSEKK!');
        }
      } )
    }

/*    setPieceBackUp(){
      let colSquares = this.getCollisionSquares();
      this.playerPieces.forEach(piece => {
        let isBackedUp = colSquares.includes(piece.piecePosition) ? true : false;
        piece.isBackedUp = isBackedUp;
      })
    }*/

    setPlayerPieces(){
      this.setPieceCollisions();
      this.getPlayerPieces();
      this.getAttackerSquares();
    //  this.setPieceBackUp();
    }

  }
  
  BasePlayer.instances = {};
  
  BasePlayer.instanceByColor = (color) => {
    return BasePlayer.instances[color];
  }

  BasePlayer.resetPlayerPieces = () => {
    console.log('Player.instances',Player.instances);
    Player.instances.forEach(player =>{
      player.setPlayerPieces();
      console.log('player',player);
    })
  }

export { BasePlayer };
