class Stimulus {
    constructor (amplitude=0, start=0, duration=0) {
        this.amplitude = amplitude;
        this.start = start;
        this.duration = duration;
    }

    // NOTE: I don't know if this function should be here or somewhere else
    plot (x) {
        if (x >= this.start && x <= (this.start + this.duration)) {
            return this.amplitude;
        } else {
            return 0;
        }
    }
}

class Axis {
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

export {
    Stimulus,
    Axis
}
