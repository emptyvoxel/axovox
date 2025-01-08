<template>
    <div class="graph">
        <canvas class="y-axis"
            :height="height"
            :width="90"
            ref="axisY"
        />

        <canvas class="plot"
            :width="width"
            :height="height"
            ref="plot"
        />

        <canvas class="x-axis"
            :v-if="axis.x.render"
            :width="width"
            :height="90"
            ref="axisX"
        />
    </div>
</template>

<script>
import { Axis } from '@/utils/classes';

export default {
    name: 'StimuliGraph',
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
    mounted () {
        this.setupAxis('y');

        if (this.axis.x.render) this.setupAxis('x');
    },
    methods: {
        setupAxis (axis) {
            const canvas = this.$refs[`axis${axis.toUpperCase()}`];
            const ctx = canvas.getContext('2d');

            // Check which dimension to use for the scale factor
            const size = axis === 'y' ? canvas.height : canvas.width;

            const range = this.axis[axis].max - this.axis[axis].min;
            const steps = range / this.axis[axis].step;
            const stepSize = (size - this.axis[axis].offset) / steps;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px Arial';
            ctx.save();

            if (axis === 'y') {
                ctx.textAlign = 'right';

                for (let i = 0; i <= steps; i++) {
                    const y = size - (this.axis[axis].offset / 2) - i * stepSize;
                    const label = this.axis[axis].min + i * this.axis[axis].step;

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
                    const x = size - (this.axis[axis].offset / 2) - i * stepSize;
                    const value = this.axis[axis].max - i * this.axis[axis].step;

                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 10);
                    ctx.stroke();

                    ctx.fillText(value.toString(), x, 30);
                }

                ctx.translate(size / 2, 60);
            }

            ctx.textAlign = 'center';
            ctx.fillText(this.axis[axis].label, 0, 0);
            ctx.restore();
        },
        plot () {
            return;
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

.plot {
    background-color: aquamarine; /* REMOVE THIS */
}

.y-axis {
    background-color: mediumpurple; /* REMOVE THIS */
    border-right: 2px black solid;
}

.x-axis {
    background-color: mediumpurple; /* REMOVE THIS */
    border-top: 2px black solid;
    position: relative;
    left: 92px;
}
</style>
