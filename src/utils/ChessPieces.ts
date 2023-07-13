

type ChessPiecesType = 'WhiteChess' | 'BlockChess' | 'Obstacles'


// Pieces
export class ChessPieces {
    //  Pieces id
    id: number | null = null;
    // type of pieces
    type: ChessPiecesType | null = null;
    constructor(type: ChessPiecesType, id: number | null = null) {
        // type of pieces
        this.type = type;
        //Piecesid
        this.id = id;
    }
}
