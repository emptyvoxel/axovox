<template>
    <div class="app">
        <nav>
            <ul>
                <li>Options</li>
                <li>Simulations</li>
            </ul>
        </nav>

        <main>
        </main>

        <aside>
            <div class="graph">
                <button @click="run">Run</button>
                <button @click="clear">Clear</button>
            </div>

            <div class="simulation">
                <label>HP = <input type="number" v-model="hp"/></label>

                <div class="stimulus">
                    <label>Amp. = <input type="number" v-model="stimuli[0].amplitude"/></label>
                    <label>Start = <input type="number" v-model="stimuli[0].start"/></label>
                    <label>Dur. = <input type="number" v-model="stimuli[0].duration"/></label>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import { Stimulus } from '@/utils/classes';

export default {
    name: 'MainModel',
    data () {
        return {
            isRunning: false,
            hp: -60, // Resting Potential fixed at -60mV
            stimuli: [
                new Stimulus(100, 0, .1)
            ]
        }
    },
    methods: {
        run () { alert('Running simulation') },
        clear () { alert('Screen cleared') },
    }
}
</script>
