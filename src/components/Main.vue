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
                :height="750"
                :axis="{
                    y: {
                        label: 'Potencial de Membrana (mV)', type: 'Y',
                        max: 60, min: -80, step: 10, offset: 20,
                        render: true, markers: [0, hp]
                    },
                    x: {
                        label: 'Tempo (ms)', type: 'X',
                        max: 10, min: 0, step: 1, offset: 15,
                        render: false
                    },
                }"
                :data="{ stimuli: stimuli }"
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
                        max: 10, min: 0, step: 1, offset: 20,
                        render: true
                    }
                }"
                :data="{stimuli: stimuli}"
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
import StimuliGraph from './StimuliGraph.vue';
import ActionGraph from './ActionGraph.vue';

export default {
    name: 'MainModel',
    components: {
        StimuliGraph, ActionGraph
    },
    data () {
        return {
            isRunning: false,
            hp: -60, // Holding Potential fixed at -60mV
            stimuli: [
                new Stimulus(100, 0, .1),
            ]
        }
    },
    methods: {
        run () {
            this.isRunning = !this.isRunning;
            console.log(this.isRunning);
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
