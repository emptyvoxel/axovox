<template>
    <div class="graph">
        <canvas class="y-axis"
            :height="height"
            :width="90"
            ref="axisY"
        />

        <canvas class="plot"
            :width="width - this.axis.x.offset"
            :height="height - this.axis.y.offset"
            :style="`padding: ${this.axis.y.offset / 2}px ${this.axis.x.offset / 2}px`"
            ref="plot"
        />

        <canvas class="x-axis"
            v-if="axis.x.render"
            :width="width"
            :height="90"
            ref="axisX"
        />
    </div>
</template>

<script>
// TODO: create a more general and reusable graph component later
import { Axis } from '@/utils/classes';
import { scale, invertY } from '@/utils/scalars';

export default {
    name: 'ActionGraph',
    props: {
        height: Number, // Canvas height
        width: Number, // Canvas width
        axis: { // Axes classes
            x: Axis,
            y: Axis,
        },
        data: Object, // Simulation data to be plotted
        functions: Object // Pre-processing functions
    },
    watch: {
        data: 'plot',
    },
    mounted () {
        this.setupAxis(this.axis.y);

        if (this.axis.x.render) this.setupAxis(this.axis.x);

        this.plot(); // TODO: remove this and bind the plot function to the run button
    },
    methods: {
        setupAxis (axis) {
            const canvas = this.$refs[`axis${axis.type}`];
            const ctx = canvas.getContext('2d');

            // Check which dimension to use for the scale factor
            const size = axis.type === 'Y' ? canvas.height : canvas.width;

            const range = axis.max - axis.min;
            const steps = range / axis.step;
            const stepSize = (size - axis.offset) / steps;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px Arial';
            ctx.save();

            if (axis.type === 'Y') {
                ctx.textAlign = 'right';

                for (let i = 0; i <= steps; i++) {
                    const y = size - (axis.offset / 2) - i * stepSize;
                    const label = axis.min + i * axis.step;

                    ctx.beginPath();
                    ctx.moveTo(90, y);
                    ctx.lineTo(80, y);
                    ctx.stroke();

                    ctx.fillText(label.toString(), 70, y + 4);
                }

                ctx.translate(30, size / 2);
                ctx.rotate(-Math.PI / 2);
            }

            else {
                ctx.textAlign = 'center';
                for (let i = 0; i <= steps; i++) {
                    const x = size - (axis.offset / 2) - i * stepSize;
                    const value = axis.max - i * axis.step;

                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 10);
                    ctx.stroke();

                    ctx.fillText(value.toString(), x, 30);
                }

                ctx.translate(size / 2, 60);
            }

            ctx.textAlign = 'center';
            ctx.fillText(axis.label, 0, 0);
            ctx.restore();
        },
        // NOTE: Currently only works for the Y-axis, but not sure
        // if I should bother adding a X-axis case
        setupMarkers (canvas, axis) {
            const ctx = canvas.getContext('2d');
            ctx.setLineDash([5, 5]);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < axis.markers.length; i++) {
                const marker = scale(canvas.height, axis.markers[i], axis);

                ctx.beginPath();
                ctx.moveTo(0, marker);
                ctx.lineTo(canvas.width, marker);
                ctx.stroke();
            }
        },
        plot () {
            const canvas = this.$refs.plot;
            const ctx = canvas.getContext('2d');
            const dt = 0.01;

            ctx.save();
            invertY(canvas);

            this.setupMarkers(canvas, this.axis.y);

            for (let x = 0; x < this.axis.x.max; x += dt) {
                ctx.fillRect(
                    scale(canvas.width, x, this.axis.x),
                    scale(canvas.height, Math.tan(x) * this.data.stimuli[0].amplitude, this.axis.y),
                    1.5, 1.5
                );
            }

            ctx.restore();
        }
    }
}
</script>

<style scoped>
.graph {
    display: grid;
    grid-template-columns: 92px 1fr;
    margin-bottom: 20px;
}

.y-axis {
    border-right: 2px black solid;
}

.x-axis {
    border-top: 2px black solid;
    position: relative;
    left: 92px;
}
</style>
