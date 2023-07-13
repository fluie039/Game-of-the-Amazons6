import BlockChess from '../Images/black.png';
import Obstacles from '../Images/obstacles.png';
import WhiteChess from '../Images/white.png';


const config = {
  images: {
    BlockChess,
    WhiteChess,
    Obstacles,
  },
  chess : {
    // white
    background1: '#ea9063',
    // black
    background2: '#743d1f',
    // moveable pieces
    activeBackground: '#00ff00',
    // block 
    placeBackground: '#69a1ff',
  },
};

export type ImagesType = keyof typeof config.images

export default config;
