import { chessConfig } from '../../config/chessConfig.config.js';

export const knightMovement = {
    
    getAllPossibleSquares(knightPiece){

        const columnPos = knightPiece.piecePosition[0];
        const rowPos    = parseInt(knightPiece.piecePosition[1]);
        const colIdx    = chessConfig.columns.indexOf(columnPos);

        const horseJumpBase = {
            
            1 : { col : chessConfig.columns[colIdx-2] , row : parseInt(rowPos)+1} , 
            2 : { col : chessConfig.columns[colIdx-2] , row : parseInt(rowPos)-1} , 
            3 : { col : chessConfig.columns[colIdx-1] , row : parseInt(rowPos)+2} , 
            4 : { col : chessConfig.columns[colIdx-1] , row : parseInt(rowPos)-2} , 
            5 : { col : chessConfig.columns[colIdx+1] , row : parseInt(rowPos)+2} , 
            6 : { col : chessConfig.columns[colIdx+1] , row : parseInt(rowPos)-2} , 
            7 : { col : chessConfig.columns[colIdx+2] , row : parseInt(rowPos)+1} , 
            8 : { col : chessConfig.columns[colIdx+2] , row : parseInt(rowPos)-1} , 
            
        };

        const horseJumpChecked = {};

        Object.values(horseJumpBase).forEach( (horseJump , idx ) => {
            if(horseJump.col !== undefined && (horseJump.row > 0 && horseJump.row < 9)){
                horseJumpChecked[idx] = [horseJump.col + horseJump.row];  
            }  
        });
      
        return horseJumpChecked;
    }  
}

