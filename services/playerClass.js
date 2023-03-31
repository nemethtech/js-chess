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
          const piecePosition = piece.getAttribute( 'piece-square' );
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
      console.log("this.playerColor",this.playerColor);
      console.log('this.pieceCollisions',this.pieceCollisions);
      this.pieceCollisions.forEach(pieceCollision =>{
     //   console.log('pieceCollision',pieceCollision);
        if(pieceCollision.enemyPieceType.includes('king')){
     //     console.log('CSEKK!');
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
      this.getPlayerPieces();
      this.setPieceCollisions();
      this.getAttackerSquares();
    //  this.setPieceBackUp();
    }

  }

BasePlayer.instances = {};

BasePlayer.instanceByColor = (color) => {
  return BasePlayer.instances[color];
}

BasePlayer.resetPlayerPieces = () => {
  BasePlayer.instanceByColor('black').setPlayerPieces();
  BasePlayer.instanceByColor('white').setPlayerPieces();
}
  

export { BasePlayer };
