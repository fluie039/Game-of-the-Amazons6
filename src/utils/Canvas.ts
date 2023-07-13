import { Chess } from './Chess';
import { ChessPieces } from './ChessPieces';
import config, { ImagesType } from './config';
import { getImages } from './loadImage';
import * as request from '../API/request';

// memory for last click
let lastClick: null | ((event: MouseEvent) => void) = null;

// canvas class draw function
export class Canvas {
  // canvas 
  canvas: HTMLCanvasElement | null = null;
  // pen
  ctx: CanvasRenderingContext2D | null = null;
  width = 0;
  height = 0;
  chessInstance: Chess | null = null;
  chessBoardGridWidth = 0;
  chessBoardGridHeight = 0;
  // if Obstacles
  isPlaceObstacles = false;

  blockX = -1;
  blockY = -1; 
  FromX = -1;
  FromY = -1;
  Tox = -1;
  ToY = -1;


  constructor(canvas: HTMLCanvasElement, chessInstance: Chess, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.chessInstance = chessInstance;
  }

  init() {
    this.ctx = this.canvas!.getContext('2d');
    this.canvas!.width = this.width;
    this.canvas!.height = this.height;
    this.clickEvent();
  }

  async updateChessBoard(){
    // clear canvas
    this.ctx!.clearRect(0, 0, this.width, this.height);
    //  During the chessboard to draw the board
    const chessBoard = this.chessInstance!.chessBoard;
    const chessBoardWidth = this.width;
    const chessBoardHeight = this.height;
    this.chessBoardGridWidth = chessBoardWidth / 10;
    this.chessBoardGridHeight = chessBoardHeight / 10;
    let indexarr = undefined;
    console.log(chessBoard)
    await request.getGame(0).then(data => {indexarr = data.board.squares});
    console.log(indexarr);
    for(let i = 0 ; i < 10;i++)
    {
      for(let  j= 9 ; j <10;j++)
      {
        if(indexarr[j][i] === 1)
        {
            chessBoard[j][i] = new ChessPieces('WhiteChess');
        }else if(indexarr[j][i] === 0)
        {
          chessBoard[j][i] = new ChessPieces('BlockChess');
        }else if(indexarr[j][i] === -2)
        {
          chessBoard[j][i] = new ChessPieces('Obstacles');
        }else
        {
              chessBoard[j][i] = 0;
        } 
      }
    }
    // draw board
    for (let i = 0; i < chessBoard.length; i++) {
      for (let j = 0; j < chessBoard[i].length; j++) {
        this.ctx!.fillStyle = (i + j) % 2 ? config.chess.background2 : config.chess.background1;
        this.ctx!.fillRect(
          i * this.chessBoardGridWidth,
          j * this.chessBoardGridHeight,
          this.chessBoardGridWidth,
          this.chessBoardGridHeight,
        );
        // draw pieces
        if (chessBoard[i][j] instanceof ChessPieces) {
          const chessPieces = chessBoard[i][j] as ChessPieces;
          console.log(i,j,chessPieces.type!);
          this.drawChessPiece(i, j, chessPieces.type!);
        }
      }
    }
  }


  // borad 10*10
   drawChessBoard() {
    // clear canvas
    this.ctx!.clearRect(0, 0, this.width, this.height);
    //  During the chessboard to draw the board
    const chessBoard = this.chessInstance!.chessBoard;
    const chessBoardWidth = this.width;
    const chessBoardHeight = this.height;
    this.chessBoardGridWidth = chessBoardWidth / 10;
    this.chessBoardGridHeight = chessBoardHeight / 10;
    // draw board
    for (let i = 0; i < chessBoard.length; i++) {
      for (let j = 0; j < chessBoard[i].length; j++) {
        this.ctx!.fillStyle = (i + j) % 2 ? config.chess.background2 : config.chess.background1;
        this.ctx!.fillRect(
          i * this.chessBoardGridWidth,
          j * this.chessBoardGridHeight,
          this.chessBoardGridWidth,
          this.chessBoardGridHeight,
        );
        // draw pieces
        if (chessBoard[i][j] instanceof ChessPieces) {
          const chessPieces = chessBoard[i][j] as ChessPieces;
          this.drawChessPiece(i, j, chessPieces.type!);
        }
      }
    }
  }

  clickEvent() {
    this.canvas!.addEventListener('click', (e) => 
    {
      const { offsetX, offsetY } = e;
      const i = Math.floor(offsetX / this.chessBoardGridWidth);
      const j = Math.floor(offsetY / this.chessBoardGridHeight);
      //  the selected pieces
      const chessPieces = this.chessInstance!.chessBoard[i][j];

      // check the valid movement
      if (
        !chessPieces ||
        !(chessPieces instanceof ChessPieces && chessPieces.type !== 'Obstacles') ||
        chessPieces.type !== this.chessInstance?.firstHand || 
        this.isPlaceObstacles
      ) {
        console.log("faile");
        return;
      }

      // delete las clickevent
      if (lastClick) {
        this.canvas!.removeEventListener('click', lastClick);
      }

    
      this.drawPossibleMoves(i, j, config.chess.activeBackground);

      const onClickGreen = (e: MouseEvent) => {
        const { offsetX, offsetY } = e;
        const newPiecesX = Math.floor(offsetX / this.chessBoardGridWidth);
        const newPiecesY = Math.floor(offsetY / this.chessBoardGridHeight);
        if (this.isGreenSquare(newPiecesX, newPiecesY)) {
          // move to
          this.FromX = i ;
          this.FromY = j;
          this.Tox = newPiecesX;
          this.ToY = newPiecesY;
          this.moveChessPiece(i, j, newPiecesX, newPiecesY);
        }
      };

      lastClick = onClickGreen;

      // eventListener
      this.canvas!.addEventListener('click', onClickGreen);
    });
  }

  isGreenSquare(x: number, y: number) {
    const color = this.ctx!.getImageData(x * this.chessBoardGridWidth + 1, y * this.chessBoardGridHeight + 1, 1,
      1).data;
    return this.rgbToHex(color) === config.chess.activeBackground; 
  }

  moveChessPiece(fromX: number, fromY: number, toX: number, toY: number) {
    const chessPieces = this.chessInstance!.chessBoard[fromX][fromY];
    // check the localtion is empty?
    
    if (!this.chessInstance!.chessBoard[toX][toY]) {
      // refresh board
      this.chessInstance!.chessBoard[toX][toY] = chessPieces;
      this.chessInstance!.chessBoard[fromX][fromY] = 0;
      this.clearRectangles();
      this.drawChessBoard();
      this.drawPossibleMoves(toX, toY, config.chess.placeBackground);
      // block
      this.isPlaceObstacles = true;
      // cancel moveableevent
      this.canvas!.removeEventListener('click', lastClick);
      //  blockevent
      this.canvas!.addEventListener('click', this.blueSquaresClick.bind(this));
    }
     else {
    }
  }

  isBlueSquare(newX: number, newY: number) {
    const color = this.ctx!.getImageData(newX * this.chessBoardGridWidth + 1, newY * this.chessBoardGridHeight + 1, 1,
      1).data;

    return this.rgbToHex(color) === config.chess.placeBackground;
  }

  blueSquaresClick(e) {
    const { offsetX, offsetY } = e;
    const newX = Math.floor(offsetX / this.chessBoardGridWidth);
    const newY = Math.floor(offsetY / this.chessBoardGridHeight);
    this.blockX = newX;
    this.blockY = newY;
    if (this.isBlueSquare(newX, newY)) {
      //block
      this.chessInstance!.chessBoard[newX][newY] = new ChessPieces('Obstacles');
      this.isPlaceObstacles = false;

      // local position
      const isGameOver = this.isGameOver();
      if (isGameOver) {
        this.gameOver(isGameOver === 'WhiteChess' ? 'white' : 'black');

      }
      this.clearRectangles();
      this.chessInstance!.firstHand = this.chessInstance!.firstHand === 'BlockChess' ? 'WhiteChess' : 'BlockChess';
      request.postNewMove(0,0,this.FromY,this.FromX,this.Tox,this.ToY,this.blockX,this.blockY);
      //request();
      this.clearRectangles();
      this.updateChessBoard();
    }
  }

  //colour in hex
  rgbToHex(color) {
    return '#' + ((1 << 24) | (color[0] << 16) | (color[1] << 8) | color[2]).toString(16).slice(1);
  }

  drawPossibleMoves(x: number, y: number, color: string) {
    // definition direction
    const directions = [
      { dx: 0, dy: -1 },   // ↑
      { dx: 0, dy: 1 },    // ↓
      { dx: -1, dy: 0 },   // ←
      { dx: 1, dy: 0 },     // →
      { dx: -1, dy: -1 },  // ↖
      { dx: 1, dy: -1 },   // ↗
      { dx: -1, dy: 1 },   // ↙
      { dx: 1, dy: 1 },    // ↘
    ];

    let isBlackChess = false;

    // loop all  direction
    for (const direction of directions) {
      const dx = direction.dx;
      const dy = direction.dy;
      let newX = x + dx;
      let newY = y + dy;
      while (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
        const chessPiece = this.chessInstance!.chessBoard[newX][newY];
        if (!chessPiece) {
          if (!isBlackChess) {
            this.clearRectangles();
            isBlackChess = true;
          }
          // green for moveable direction
          this.drawRectangle(newX, newY, color); // draw green for moveable direction
        } else {
          // if meet blocks or pieces , stop drawing
          break;
        }
        // keep moving
        newX += dx;
        // keep moving
        newY += dy;
      }
    }

  }

  drawRectangle(x: number, y: number, color: string) {
    this.ctx!.fillStyle = color;
    this.ctx!.fillRect(
      x * this.chessBoardGridWidth,
      y * this.chessBoardGridHeight,
      this.chessBoardGridWidth,
      this.chessBoardGridHeight,
    );
  }

  clearRectangles() {
    this.ctx!.clearRect(0, 0, this.width, this.height);
    this.drawChessBoard();
  }

  drawChessPiece(x: number, y: number, type: ImagesType) {
    // get Foto
    const image = getImages(type)!;
    // convertiert
    const pieceX = x * this.chessBoardGridWidth;
    const pieceY = y * this.chessBoardGridHeight;
    //draw it
    this.ctx!.drawImage(image, pieceX, pieceY, this.chessBoardGridWidth, this.chessBoardGridHeight);
  }

  isGameOver() {
    const chessBoard = this.chessInstance!.chessBoard;
    // arr need 4 not moveablie pieces for black
    const blackCanMove = [];
    // arr need 4 not moveablie pieces for white
    const whiteCanMove = [];
    for (let i = 0; i < chessBoard.length; i++) {
      for (let j = 0; j < chessBoard[i].length; j++) {
        const chessPieces = chessBoard[i][j];
        if (chessPieces instanceof ChessPieces && chessPieces.type !== 'Obstacles') {
          const possibleMoves = this.getPossibleMoves(i, j);
          // when pieces r unmoveable
          if (possibleMoves.length <= 0) {
            if (chessPieces.type === 'BlockChess') 
            {
              blackCanMove.push(chessPieces);
              // losing point for white if ==4 white win
              if (blackCanMove.length === 4) {
                return 'WhiteChess';
              }
            } 
            else 
            {
              whiteCanMove.push(chessPieces);
              // losing point for white if ==4 black win
              if (whiteCanMove.length === 4) {
                return 'BlockChess';
              }
            }
          }
        }
      }
    }

    return false;
  }


  getPossibleMoves(x: number, y: number) {
    // get the position of piece
    const chessPieces = this.chessInstance!.chessBoard[x][y];
    // definition direction
    const possibleMoves: { x: number; y: number }[] = [];
    if (chessPieces instanceof ChessPieces && chessPieces.type !== 'Obstacles') {
      // definition direction
      const directions = [
        { dx: 0, dy: -1 },   // ↑
        { dx: 0, dy: 1 },    // ↓
        { dx: -1, dy: 0 },   // ←
        { dx: 1, dy: 0 },    // →
        { dx: -1, dy: -1 },  // ↖
        { dx: 1, dy: -1 },   // ↗
        { dx: -1, dy: 1 },   // ↙
        { dx: 1, dy: 1 },    // ↘
      ];
      // loop all  direction
      for (const direction of directions) {
        const dx = direction.dx;
        const dy = direction.dy;
        let newX = x + dx;
        let newY = y + dy;
        // keep loop when not out of range of board
        while (this.isValidMove(newX, newY)) {
          possibleMoves.push({ x: newX, y: newY });
          newX += dx;
          newY += dy;

        }
      }
    }
    return possibleMoves;
  }

  isValidMove(x: number, y: number) {
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      return false;
    }
    const chessBoard = this.chessInstance!.chessBoard;
    const chessPieces = chessBoard[x][y];
    return chessPieces === 0;
  }

  // gameover
  gameOver(text: string) {
    document.querySelector('.masking')!.classList.remove('none');
    document.querySelector('.masking-tex')!.innerHTML = `game over!!!${text}Win`;
  }
}