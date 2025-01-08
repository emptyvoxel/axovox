class Stimulus {
    constructor (amplitude=0, start=0, duration=0) {
        this.amplitude = amplitude;
        this.start = start;
        this.duration = duration;
    }
}

class Axis {
    constructor (label, type, min, max, step, offset, render=true, markers=null) {
        this.label = label;
        this.type = type; // X or Y
        this.min = min;
        this.max = max;
        this.step = step;
        this.offset = offset; // Axis canvas padding
        this.render = render; // False prevents the x-axis from being rendered
        this.markers = markers; // List of values to be marked with dotted lines
    }
}

export {
    Stimulus,
    Axis
}
