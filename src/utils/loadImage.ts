import {ImagesType} from './config';

// foto preload
const imageCache: Map<ImagesType, HTMLImageElement> = new Map();

export default function loadImage(src: string, type: ImagesType): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(type, img);
            resolve(img)
        };
        img.onerror = reject;
        img.src = src;
    });
}

//  Load all images
export function getImages(key: ImagesType) {
    return imageCache.get(key)
}