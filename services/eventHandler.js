import { $$ } from '../utils/utils.js'
import { pieceHandle } from './pieceHandler.js'
import { Player } from './playerClassExtend.js'
import { gameHandler } from './gameHandler.js'

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

    setEventsOnMoveSquares(){
        $$('.moveSquare , .enemySquare').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', this.movePiece);    
        });
    },
    
    removeEventsOnMoveSquares(){
        $$('.moveSquare , .enemySquare').forEach(pieceBox => {
            pieceBox.removeEventListener( 'click', this.movePiece);
        });
    },


    movePiece(event){
        const targetDiv = event.target.tagName === 'DIV' ? event.target : event.target.parentNode ;
        const playerPiece = pieceHandle.getPieceSelected();
        console.log('playerPiece',playerPiece);
        //general pawncanbepromoted
        eventHandler.removeEventListeners();
        playerPiece.setAttribute('piecePosition', targetDiv.getAttribute('id'));
        
        targetDiv.firstChild.remove();
        pieceHandle.removeSelectPieceAndSquares()
        targetDiv.append(playerPiece);

        gameHandler.endTurn();

    },


    changePiece(promotPiece , pawnPiece){
        const pawnColor = pawnPiece.getAttribute( 'pieceColor' );

        pawnPiece.setAttribute( 'src'  ,  `pieces/${pawnColor}_${promotPiece}.png`);
        pawnPiece.setAttribute( 'pieceType'  , `${pieceName}`);
        pawnPiece.setAttribute( 'pieceColor'  , `${pawnColor}`);
        $(".modal").close();
        gameHandler.endTurn();
    },

}
