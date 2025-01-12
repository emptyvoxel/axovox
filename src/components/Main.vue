<template>
    <div class="app">
        <nav>
            <ul>
                <li>Opções</li>
                <li>Simulações</li>
            </ul>
        </nav>

        <main>
            <Graph id="potential"
                :width="1135"
                :height="700"
                :axis="{
                    y: {
                        label: 'Potencial de Membrana (mV)', type: 'Y',
                        max: 60, min: -80, step: 10, offset: 20,
                        render: true, markers: [0, hp]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: timebase, min: 0, step: 1, offset: 15,
                        render: false
                    },
                }"
                :data="{t: data.t, mV: data.mV}"
                :simulation="simulation"
            />
            <Graph id="conductance"
                :width="1135"
                :height="200"
                :axis="{
                    y: {
                        label: 'Condutância', type: 'Y',
                        max: 50, min: 0, step: 50, offset: 20,
                        render: true, markers: [0]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: timebase, min: 0, step: 1, offset: 15,
                        render: false
                    },
                }"
                :data="{t: data.t, gNa: data.gNa, gK: data.gK}"
            />
            <Graph id="current"
                :width="1135"
                :height="200"
                :axis="{
                    y: {
                        label: 'Correntes', type: 'Y',
                        max: 900, min: 0, step: 500, offset: 20,
                        render: true, markers: [0, 1]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: timebase, min: 0, step: 1, offset: 15,
                        render: false
                    },
                }"
                :data="{t: data.t, iNa: data.iNa.map(v => -v), iK: data.iK}"
            />
            <Graph id="gates"
                :width="1135"
                :height="200"
                :axis="{
                    y: {
                        label: 'Probabilidades', type: 'Y',
                        max: 1, min: 0, step: 1, offset: 20,
                        render: true, markers: [0, 1]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: timebase, min: 0, step: 1, offset: 15,
                        render: false
                    },
                }"
                :data="{t: data.t, n: data.n, m: data.m, h: data.h}"
            />
            <Graph
                :width="1135"
                :height="80"
                :axis="{
                    y: {
                        label: 'Estímulos', type: 'Y',
                        max: 100, min: -100, step: 100, offset: 15,
                        render: true, markers: [0]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: timebase, min: 0, step: 1, offset: 20,
                        render: true
                    }
                }"
                :data="{t: data.t, stimuli: data.stimuli}"
            />
        </main>

        <aside>
            <div class="graph">
                <button @click="run">Iniciar</button>
                <button @click="clear">Reiniciar</button>
            </div>

            <div class="simulation">
                <label>HP = <input type="number" v-model="hp"/></label>

                <div class="stimulus">
                    <label>Amp. = <input type="number" v-model="stimuli[0].amplitude"/></label>
                    <label>Começo = <input type="number" v-model="stimuli[0].start"/></label>
                    <label>Dur. = <input type="number" v-model="stimuli[0].duration"/></label>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { Simulation, Stimulus } from '@/utils/simulation';
import Graph from './Graph.vue';

export default {
    name: 'MainModel',
    components: {
        Graph
    },
    data () {
        const spike = new Simulation(10);
        spike.run();

        return {
            isRunning: false,
            hp: -60, // Holding Potential fixed at -60mV
            stimuli: [
                new Stimulus(100, 0, .1)
            ],
            timebase: 10,
            simulation: spike,
            data: spike.data
        }
    },
    methods: {
        run () {
            this.isRunning = !this.isRunning;
        },
        clear () { alert('Screen cleared') },
    }
}
</script>

<style scoped>
.app {
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-rows: 50px 1fr;
    grid-template-columns: 1fr 300px;
    grid-template-areas: 'nav nav' 'graphs menu';
}

main { grid-area: graphs; }

nav { grid-area: nav; }

aside { grid-area: menu; }

aside label { display: block; }

li { display: inline-block; }
</style>
