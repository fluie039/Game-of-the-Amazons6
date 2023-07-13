import {ChessPieces} from './ChessPieces';
import {ImagesType} from "./config";

export class Chess {
    chessBoard: (number | ChessPieces)[][] = [];
    // init the position of the amazone 
    initChessPieces: Record<ImagesType, { x: number, y: number }[]> = {
        'BlockChess': [
            {
                x: 3,
                y: 0,
            },
            {
                x: 6,
                y: 0,
            },
            {
                x: 0,
                y: 3,
            },
            {
                x: 9,
                y: 3,
            },
        ],
        'WhiteChess': [
            {
                x: 0,
                y: 7,
            },
            {
                x: 9,
                y: 7,
            },
            {
                x: 3,
                y: 9,
            },
            {
                x: 6,
                y: 9,
            },
        ],
        'Obstacles': []
    };

    // who is first hand?
    _firstHand = 'Whitechess';

    player: ''|'Blockchess'|'Whitechess' = '';

    get firstHand() {
        return this._firstHand;
    }

    // setting of first hand
    set firstHand(value) {
        this._firstHand = value;
        // get element
        const node = document.querySelector<HTMLDivElement>('.canvas-title')
        // set element
        node!.style.display = 'block'
        // set the inhalt of element
        node!.innerHTML = value === 'BlockChess' ? 'black round' : 'white round'
    }

    constructor(firstHand: string) {
        const initChessPieces = JSON.parse(localStorage.getItem('initChessPieces')!)
        if (initChessPieces) {
            this.initChessPieces = initChessPieces
        }

        this.init();
        // first hand
        this.firstHand = firstHand
    }

    // draw the board 10*10
    init() {
        for (let i = 0; i < 10; i++) {
            this.chessBoard[i] = [];
            for (let j = 0; j < 10; j++) {
                //? the position 
                const blackChess = this.initChessPieces['BlockChess'].find((item) => item.x === i && item.y === j);
                
                if (blackChess) {
                    this.chessBoard[i][j] = new ChessPieces('BlockChess');
                    continue;
                }
                
                const whiteChess = this.initChessPieces['WhiteChess'].find((item) => item.x === i && item.y === j);
                // blockarea
                if (whiteChess) {
                    this.chessBoard[i][j] = new ChessPieces('WhiteChess');
                    continue;
                }
                //  bloack
                const obstacles = this.initChessPieces['Obstacles'].find((item) => item.x === i && item.y === j);
                // block exist
                if (obstacles) {
                    this.chessBoard[i][j] = new ChessPieces('Obstacles');
                    continue;
                }
                //if none pieces on the tile is empty
                this.chessBoard[i][j] = 0;
            }
        }
    }

    //data save
    async save() {

       /* let indexarr = undefined;
        await getGame(0).then(data=>{indexarr = data.board.squares});

        for(let i = 0 ; i < indexarr.length; i++)
        {
            for(let j = 0; j < indexarr[i].length; j++)
            {
                const value =indexarr[i][j];
                if(value===1)
                {
                    this.chessBoard[i][j] = new  ChessPieces('WhiteChess');
                }else if(value === 0)
                { 
                    this.chessBoard[i][j] = new  ChessPieces('BlockChess');
                }else if (value === -1){
                    this.chessBoard[i][j] = 0;
                }else {
                            this.chessBoard[i][j] = new  ChessPieces('BlockChess');
                        }
            }
        }
        console.log(this.chessBoard);
        console.log(indexarr);
        */
        /*await getGame(0).then(data=>{
            this.chessInstance.chessBoard = data.board.squares.reduce((arr, item, index) =>{
                   // 
                   if (!Array.isArray(arr[index])) {
                    arr.push([])
                    }
                    for(let i = 0 ; i<item.length;i++){
                        const value= item[i];
                        if(value===1)
                        {
                            arr[index].push(new Chess(this.chessInstance.player));
                        }else if(value === 0)
                        { 
                            arr[index].push(new Chess(this.chessInstance.player === 'BlockChess' ? 'WhiteChess' : 'BlockChess'))
                        }else if (value === -1){
                            arr[index].push(0)
                        }else {
                            arr[index].push(new Chess('Obstacles'))
                        }
    
    
                    }

            },[] as number[][]);
            this.clearRectangles()
        })*/
    }


}
