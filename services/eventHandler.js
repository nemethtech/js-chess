import { $ , $$ } from '../utils/utils.js'
import { pieceHandle } from './pieceHandler.js'
import { Player } from './playerClassExtend.js'
import { gameHandler } from './gameHandler.js'
import { generalMovement } from './pieceMovement/general.js'

export const eventHandler = {

    piecesEventListeners : {},

    setEventListeners(){

        this.piecesEventListeners = {};
        
        Player.getPlayer().playerPieces.forEach(piece => {
            
            this.piecesEventListeners[ piece.piecePosition ] = {
               
                'mouseenter': _ => {
                    pieceHandle.handlePieceMouseenter( piece )
                },
                'mouseleave': _ => {
                    pieceHandle.handlePieceMouseleave( piece )
                },
                'click': _ => {
                    pieceHandle.handlePieceClick( piece )
                }
            }
            
            piece.piece.addEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
            piece.piece.addEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
            piece.piece.addEventListener( 'click'     , this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);

        })
    },

    removeEventListeners() {
        Player.getPlayer().playerPieces.forEach( piece => {

          piece.piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
          piece.piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
          piece.piece.removeEventListener( 'click'     , this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);
            
        })
    },

    setEventsOnSquares(eventType){
        const event = eventType === 'move' ?  this.movePiece : this.promotePiece;
        $$('.moveSquare , .enemySquare').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', event);    
        });
    },
    
    removeEventsOnSquares(eventType){
        const event = eventType === 'move' ?  this.movePiece : this.promotePiece;
        $$('.moveSquare , .enemySquare').forEach(pieceBox => {
            pieceBox.removeEventListener( 'click', event);
        });
    },

    
    movePiece(event){
        const targetDiv = event.target.tagName === 'DIV' ? event.target : event.target.parentNode ;
        const playerPiece = pieceHandle.getPieceSelected();

        eventHandler.removeEventListeners();
        playerPiece.setAttribute('piecePosition', targetDiv.getAttribute('id'));
        
        targetDiv.firstChild.remove();
        eventHandler.removeEventsOnSquares('move');
        pieceHandle.clearPieceMoves();
        pieceHandle.removeSelected();
        targetDiv.append(playerPiece);
        
        gameHandler.endTurn();
        
    },

    
    promotePiece(event){
       generalMovement.promotePawn(event);
       
    },

    changePiece(type,  event){
        pieceHandle.getPieceSelected().setAttribute('src', `pieces/${Player.getPlayer().playerColor}_${type}.png`);
        pieceHandle.getPieceSelected().setAttribute('piecetype', `${type}`);
        $(".modal").close();
        eventHandler.removeEventsOnSquares('promote');
        eventHandler.movePiece(event);
    },

}
