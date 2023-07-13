import {RefObject, useEffect, useRef} from "react"
import "./index.css"
import {Canvas} from "./utils/Canvas"
import {Chess} from "./utils/Chess"
import config, {ImagesType} from "./utils/config"
import loadImage from "./utils/loadImage"
import * as request from "./API/request"

let canvasInstance = undefined;

async function start(canvas: RefObject<HTMLCanvasElement>) {
    // hide the result
    document.querySelector('.masking')!.classList.add('none')
    // preload
    await Promise.all(Object.keys(config.images).map(
        (key) =>
            loadImage(config.images[key as ImagesType], key as ImagesType))
    );
    // who is the first hand
    const firstHand = Math.floor(Math.random() * 1000) % 2 === 0 ? 'BlockChess' : 'WhiteChess'
    // get board
    const chessInstance = new Chess(firstHand);
    // Instanz 
    canvasInstance = new Canvas(canvas.current!, chessInstance, 500, 500)
    // init
    canvasInstance.init();
    // drawboard
    canvasInstance.drawChessBoard()
}

async function startNewGame() {
    await request.reset();
    await request.postNewPlayer("You", true);
    await request.postNewPlayer("Bot", false);
    await request.postNewGame(60000, 0, 1);
    canvasInstance.updateChessBoard();
}

function App() {
    // canvaselement
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        start(canvas)
    }, [])

    return (
        <div className="app">
            <h1> Game of the Amazons</h1>
            <div className="menu-bar">
                <button onClick={() => startNewGame()}>New Game</button>
                <button onClick={() => request.postNewMove(0, 0, 0, 3, 1, 3, 2, 3)}>Move Piece</button>
                <button onClick={() => request.getGame(0).then(data => console.log(data))}>Print Game</button>
                <button onClick={() => request.reset()}>Reset Everything</button>
            </div>
            <div id="test"></div>
            <div className="game">
                <div className="canvas-title">
                    firsthand
                </div>
                <div className='canvas-content'>
                    <canvas id="canvas" ref={canvas}></canvas>
                    {/**/}
                    <div className='masking none'>
                        <div className='masking-tex'>
                            Gameover!!!
                        </div>
                        <button className='masking-button' onClick={() => {
                            start(canvas)
                            //remove
                            localStorage.removeItem('initChessPieces')
                            
                        }
                        }>
                            Restart game
                        </button>
                    </div>
                </div>
            </div>
            <div>
            <h2>Hilfebereich</h2>
            <ol>
                <li><u>Um ein neues Spiel zu Starten drücke "New Game"</u>
                <br />
                <br />
                Schwarz zieht zuerst. Danach wechseln sich beide Spieler ab.
                <br />
                <br />
                <u>Bewegungsphase:</u> Amazonen (Spielsteine) können horizontal, vertikal oder diagonal über beliebig viele freie Felderbewegt werden.
                <br />
                <br />
                <u>Angriffsphase:</u> Von der neuen Position aus kann die Amazone nun in horizontale, vertikale oder diagonale Richtung ein Feld für den Rest des Spieles blockieren.
                <br />
                <br />
                <p></p> Das Spiel endet, sobald ein Spieler keine Amazonen mehr bewegen kann.</li>
            </ol>
            </div>
        </div>
    )
}

export default App
