// Converts a plot coordinate (value) to a canvas coordinate (pixel)
const scale = (pixel, value, { min, max }) => pixel * (value - min) / (max - min);

// Inverts the y-coordinate origin
const invertY = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
}

export {
    scale,
    invertY
}
