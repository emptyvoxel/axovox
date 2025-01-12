<template>
    <div class="app">
        <nav>
            <ul>
                <li>Opções</li>
                <li>Simulações</li>
            </ul>
        </nav>

        <main>
            <ActionGraph
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
                :data="data"
                :simulation="simulation"
            />
            <ConductanceGraph
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
                :data="data"
            />
            <CurrentGraph
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
                :data="data"
            />
            <GateGraph
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
                :data="data"
            />
            <StimuliGraph
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
                :data="data"
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
import { Stimulus } from '@/utils/classes';
import StimuliGraph from './Graph/Stimuli.vue';
import ActionGraph from './Graph/Potential.vue';
import ConductanceGraph from './Graph/Conductance.vue';
import CurrentGraph from './Graph/Current.vue';
import GateGraph from './Graph/Gate.vue';
import { Simulation } from '@/utils/simulation';

export default {
    name: 'MainModel',
    components: {
        StimuliGraph, ActionGraph, ConductanceGraph, GateGraph, CurrentGraph
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
