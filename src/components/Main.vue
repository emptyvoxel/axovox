<template>
    <div class="app">
        <nav>
            <ul>
                <li>Opções</li>
                <li>Simulações</li>
            </ul>
        </nav>

        <main>
            <StimuliGraph
                :width="1135"
                :height="80"
                :axis="{
                    y: {
                        label: 'Estímulos', type: 'Y',
                        max: 100, min: 0, step: 100, offset: 15,
                        render: true
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

export default {
    name: 'MainModel',
    components: {
        StimuliGraph
    },
    data () {
        return {
            isRunning: false,
            hp: -60, // Holding Potential fixed at -60mV
            stimuli: [
                new Stimulus(50, 1, 1),
                new Stimulus(25, 1.5, 1)
            ]
        }
    },
    methods: {
        run () { alert('Running simulation') },
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
