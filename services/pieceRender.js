import { $, $$ } from '../utils/utils.js'
import { normalGame }  from '../config/normalGameInit.config.js'
import { chessConfig }  from '../config/chessConfig.config.js'
import { pieceHandle } from '../services/pieceHandler.js'
import { editedGame } from '../config/editedGameInit.config.js'
import { gameHandler } from './gameHandler.js'


export const piecesRender = {

    piecesEventListeners : {},

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
            
            piece.addEventListener( 'mouseenter', this.piecesEventListeners[ piecePosition ][ 'mouseenter' ])
            piece.addEventListener( 'mouseleave', this.piecesEventListeners[ piecePosition ][ 'mouseleave' ])
            piece.addEventListener( 'click', this.piecesEventListeners[ piecePosition ][ 'click' ])
        })
    },
    
    removeEventListeners() {

        $$( chessConfig.chessPieceSelector).forEach( piece => {

            const piecePosition = piece.getAttribute( 'piece-square' );

            piece.removeEventListener( 'mouseenter', this.piecesEventListeners[ piecePosition ][ 'mouseenter' ])
            piece.removeEventListener( 'mouseleave', this.piecesEventListeners[ piecePosition ][ 'mouseleave' ])
            piece.removeEventListener( 'click', this.piecesEventListeners[ piecePosition ][ 'click' ])
        })
    },


    resetEventListeners(){
        
        this.removeEventListeners();
        this.setEventListeners();
        if(gameHandler.getGameOverStatus())console.log('GAME OVER');
        
    }
 
}
