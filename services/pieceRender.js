import { $, $$ } from '../utils/utils.js'
import { normalGame }  from '../config/normalGameInit.config.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { pieceHandle } from '../services/pieceHandler.js'
import { editedGame } from '../config/editedGameInit.config.js'
import { Player } from './playerClassExtend.js'
import { movePieceHandler } from './pieceMovement/movePiece.js'

export const piecesRender = {

    piecesEventListeners : {},

    createPieces(){

        const gameStart = chessConfig.useNormalGame ? normalGame : editedGame;

        for(let postion in gameStart){

            const imgPiece = document.createElement( 'img' );
            imgPiece.classList.add( 'piece' );
            imgPiece.setAttribute( 'piece-type'     , gameStart[postion]);
            imgPiece.setAttribute( 'piecePosition'   , postion);
            imgPiece.setAttribute( 'src'            , 'pieces/'+gameStart[postion]+'.png');
            $('#'+postion).append(imgPiece);
        }
    },

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
            piece.piece.addEventListener( 'click', this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);

        })
    },

    removeEventListeners() {

        Player.getPlayer().playerPieces.forEach( piece => {

          piece.piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
          piece.piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
          piece.piece.removeEventListener( 'click'     , this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);
            
        })
    },

    setEventsOnPotentialSquares(){

        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.addEventListener( 'click', movePieceHandler.movePiece);    
        });
    },
    
    removeEventsOnPotentialSquares(){
        
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            pieceBox.removeEventListener( 'click', movePieceHandler.movePiece);
        });

     
    },

}
