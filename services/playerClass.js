import { $$ } from "../../utils/utils.js";
import { generalMovement } from "./pieceMovement/general.js";
import { piecesRender } from "./pieceRender.js";



class Player {
    constructor(color) {
  //    this.playerName = name;
      this.playerColor = color;
      this.playerPieces = [];
      this.attackSquares = [];
      this.playerPiecesPosition = [];
      Player.instances[color] = this;
    }
    
    getPieces(){
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

    getCollisionSquares(){
      let collisonSquare = [];
      this.playerPieces.forEach(piece => {
        collisonSquare.push(generalMovement.getPossibleCollisionquares(generalMovement.getPotentialSquares(piece ,  true)));
      })
      return collisonSquare.flat(1);
    }

    setPieceBackUp(){
      let colSquares = this.getCollisionSquares();
      this.playerPieces.forEach(piece => {
        let isBackedUp = colSquares.includes(piece.piecePosition) ? true : false;
        piece.isBackedUp = isBackedUp;
      })
    }

    getPiecePositions(){
      this.playerPiecesPosition = [];
      this.playerPieces.forEach( piece =>{
        this.playerPiecesPosition.push(piece.piecePosition);
      })
    }

    getPiecesAndSquares(){
      this.playerPieces = [];
      this.attackSquares = [];
      this.getPieces();
      this.getAttackerSquares();
      this.setPieceBackUp();
      this.getPiecePositions();
    }

  }
  
  Player.instances = {};
  
  Player.instanceByColor = function(color) {
    return Player.instances[color];
  }

const playerOne = new Player('white');
const playerTwo = new Player('black');


export { Player};
