import { $, $$ } from '../utils/utils.js'
import { normalGame }  from '../config/normalGameInit.config.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { pieceHandle } from '../services/pieceHandler.js'
import { editedGame } from '../config/editedGameInit.config.js'
import { Player } from './playerClassExtend.js'
import { movePieceHandler } from './pieceMovement/movePiece.js'

export const piecesRender = {

    piecesEventListeners : {},
    moveSquareEventListeners : {},

    createPieces(){

        const gameStart = chessConfig.useNormalGame ? normalGame : editedGame;

        for(let postion in gameStart){

            const imgPiece = document.createElement( 'img' );
            imgPiece.classList.add( 'piece' );
            imgPiece.setAttribute( 'piece-type', gameStart[postion]);
            imgPiece.setAttribute( 'piece-square', postion);
            imgPiece.setAttribute('src', 'pieces/'+gameStart[postion]+'.png');
            $('#'+postion).append(imgPiece);
        }
    },

    setEventListeners(){

        $$(chessConfig.chessPieceSelector).forEach(piece => {

            const piecePosition = piece.getAttribute( 'piece-square' );
            const pieceColor = piece.getAttribute( 'piece-type' ).split('_')[0];
            const pieceType = piece.getAttribute( 'piece-type' ).split('_')[1];
            
            const handleParams = {
                piece,
                pieceType, 
                piecePosition,
                pieceColor,
            }

            this.piecesEventListeners[ piecePosition ] = {
               
                'mouseenter': _ => {
                    pieceHandle.handlePieceMouseenter( handleParams )
                },
                'mouseleave': _ => {
                    pieceHandle.handlePieceMouseleave( handleParams )
                },
                'click': _ => {
                    pieceHandle.handlePieceClick( handleParams )
                }
            }
            
            piece.addEventListener( 'mouseenter', this.piecesEventListeners[ piecePosition ][ 'mouseenter' ]);
            piece.addEventListener( 'mouseleave', this.piecesEventListeners[ piecePosition ][ 'mouseleave' ]);
            piece.addEventListener( 'click', this.piecesEventListeners[ piecePosition ][ 'click' ]);

        })
    },
    

    setEventListeners2(){

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
                    pieceHandle.handlePieceClick2( piece )
                }
            }
            
            piece.piece.addEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
            piece.piece.addEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
            piece.piece.addEventListener( 'click', this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);

        })
    },

    removeEventListeners() {

        $$( chessConfig.chessPieceSelector).forEach( piece => {

            const piecePosition = piece.getAttribute( 'piece-square' );

            piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piecePosition ][ 'mouseenter' ]);
            piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piecePosition ][ 'mouseleave' ]);
            piece.removeEventListener( 'click', this.piecesEventListeners[ piecePosition ][ 'click' ]);
            
        })
    },

    removeEventListeners2() {

        Player.getPlayer().playerPieces.forEach( piece => {

          piece.piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
          piece.piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
          piece.piece.removeEventListener( 'click'     , this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);
            
        })
    },

    removeEventListeners3(piece) {
        piece.piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piece.piecePosition ][ 'mouseenter' ]);
        piece.piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piece.piecePosition ][ 'mouseleave' ]);
        piece.piece.removeEventListener( 'click'     , this.piecesEventListeners[ piece.piecePosition ][ 'click' ]);
    },

    setEventsOnPotentialSquares2(pieceSettings){

        
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            console.log('pieceBox',pieceBox);
            pieceBox.addEventListener( 'click', movePieceHandler.movePiece2);
            
        });
    },
    
    removeEventsOnPotentialSquares(){
        
        $$('.potential-square , .potential-enemy').forEach(pieceBox => {
            console.log('pieceBox',pieceBox);
            pieceBox.removeEventListener( 'click', movePieceHandler.movePiece2);
        });

     
    },

    resetEventListeners(){
        
        this.removeEventListeners();
        this.setEventListeners();
        
    }
 
}
