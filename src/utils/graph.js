// Converts a plot coordinate (value) to a canvas coordinate (pixel)
export const scale = (pixel, value, { min, max }) => pixel * (value - min) / (max - min);

// Inverts the y-coordinate origin
export const invertY = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
}

// TODO: Find a better place to accommodate this function
export const plotStimuli = (x, stimuli) => {
    let output = 0;

    for (let i = 0; i < stimuli.length; i++) {
        const stimulus = stimuli[i];

        if (x >= stimulus.start && x <= (stimulus.start + stimulus.duration)) {
            output += stimulus.amplitude;
        } else {
            output += 0;
        }
    }

    return output;
}

export const COLORS = {
    gNa: 'blue', gK: 'blue',
    iNa: 'blue', iK: 'blue', iT: 'blue',
    mV: 'blue',
    n: 'blue', m: 'blue', h: 'blue'
};
