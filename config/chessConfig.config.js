export const chessConfig = { 
   
    useNormalGame : false ,
    modalSelector : '.modal' , 
    currentEnemy : 'black' ,
    currentTurn : 'white', 
    columns : ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' ] , 
    promotePieces : ['queen' , 'rook' ,  'knight' , 'bishop' ] ,
    enemyStatusModell : {
        checkStatus: {  
            playerInCheck : false ,
            checkThreat : [] ,  
            attackerCounter : 0, 
            },
        pinInfo    : { 
            arePinedPiece : false,
            pinInfo : [], 
            },
        allEnemyMoveSquare :  [], 
        backedUpEnemeyPieces : [],
    },
    playerPieceMoveModell : {
        piece       : undefined , 
        moveSquares : undefined,
        collision   : {},
        direction   : undefined,
        eventType   : 'move',
    },
}   