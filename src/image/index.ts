
export async function loadImage(source: string): Promise<HTMLImageElement> {
    const image = new Image();
    image.src = source;
    await image.decode();
    return image;
}