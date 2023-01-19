import { $ } from '../../utils/utils.js'
import { gameHandler } from '../gameHandler.js'
import { chessConfig }  from '../../config/chessConfig.config.js'
import { pieceHandle } from '../pieceHandler.js';
import { generalMovement } from './general.js'



export const bishopMovement = {
    
    setPotentialSquares(bishopPiece){
        if(gameHandler.pieceTurn(bishopPiece.pieceColor)){
            console.log('bishopPiece,',bishopPiece);
            this.helper(bishopPiece);
        }
    },



   getAvaliableSquares(bishopPiece){
        const ownSquareId = parseInt($(`[id^="${bishopPiece.piecePosition}"]`).getAttribute('id_val'));
        let r1Arr = [];

   },

   helper(bishopPiece){
        let columnPos = bishopPiece.piecePosition[0];
        let rowPos = bishopPiece.piecePosition[1];
        let resArr1 = chessConfig.columns.slice(chessConfig.columns.indexOf(columnPos)+1, 8 );
        let resArr2 = chessConfig.columns.slice(0, chessConfig.columns.indexOf(columnPos));
        const resArr= resArr1.map((_,idx) => Number(rowPos -1 ) - idx);
        const resArrY= resArr1.map((_,idx) => Number(parseInt(rowPos) +1 ) + idx);
        const resArrY1= resArr2.map((_,idx) => Number(parseInt(rowPos) +1 ) + idx);
        const resArrX1= resArr2.map((_,idx) => Number(rowPos -1 ) - idx);
        const resArrX= resArr1.map((_,idx) => Number(rowPos -1 ) - idx);
        var c = resArr1.map(function(e, i) {
            return e +resArrY[i];
          }).filter(e => e.length === 2) .filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
        var d = resArr1.map(function(e, i) {
            return e +resArrX[i];
        }).filter(e => e.length === 2) .filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);
        var e = resArr2.reverse().map(function(e, i) {
            return e +resArrY1[i];
          }).filter(e => e.length === 2) .filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1);  
        var e2 = resArr2.reverse().map(function(e, i) {
            return e +resArrY1[i];
          }); 
        var f = resArr2.map(function(e, i) {
            return e +resArrX1[i];
        }).filter(e => e.length === 2) .filter( e => chessConfig.rows.indexOf(parseInt(e[1])) !== -1)
        ;
        /*e.forEach(e=> {
            console.log('e',e);
            console.log('e.length',e.length);
        })*/
       console.log('f:',f);
       
 //       console.log('resArr:',resArr);
 //       console.log('resArr1:',resArr1);
 //       console.log('resArr2:',resArr2);
 //       console.log('resArrX1:',resArrX1);
 //       console.log('resArrY1:',resArrY1);
  //
        console.log('d:',d);
        console.log('c:',c);  
        console.log('e:',e);
    //    console.log('e2:',e2);
   }
}

