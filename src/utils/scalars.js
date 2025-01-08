// Converts a plot coordinate (value) to a canvas coordinate (pixel)
const scale = (pixel, value, { min, max }) => pixel * (value - min) / (max - min);

// Inverts the y-coordinate origin
const invertY = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
}

// TODO: Find a better place to accommodate this function
const plotStimuli = (x, stimuli) => {
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

export {
    scale,
    invertY,
    plotStimuli
}
