// Graph axis definitions
export class Axis {
    constructor (label, type, min, max, step, offset, render=true, markers=null) {
        this.label = label;
        this.type = type.toUpperCase(); // X or Y
        this.min = min;
        this.max = max;
        this.step = step;
        this.offset = offset; // Axis canvas padding
        this.render = render; // False prevents the x-axis from being rendered
        this.markers = markers; // List of values to be marked with dotted lines
    }
}

// Converts a plot coordinate (value) to a canvas coordinate (pixel)
export const scale = (pixel, value, { min, max }) => pixel * (value - min) / (max - min);

// Inverts the y-coordinate origin
export const invertY = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
}

export const COLORS = {
    gNa: 'blue', gK: 'blue',
    iNa: 'blue', iK: 'blue', iT: 'blue',
    mV: 'blue', stimuli: 'blue',
    n: 'blue', m: 'blue', h: 'blue'
};
