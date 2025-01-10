import { Stimulus } from "./classes";

// Physical constants
const FARADAY = 9.6487;
const RGAS = 8.3143;
const KELVIN = 273.15;
export const IONS = {
    'K': { in: 140, out: 5, charge: 1 },
    'Na': { in: 15, out: 145, charge: 1 },
};

// Gate kinetics equations (Hodgkin & Huxley, 1952)
// (Eqns. 12-13)
const an = v => .01 * (v + 10) / (Math.exp((v + 10) / 10) - 1);
const bn = v => .125 * Math.exp(v / 80);
// (Eqns. 20-21)
const am = v => .1 * (v + 25) / (Math.exp((v + 25) / 10) - 1);
const bm = v => 4 * Math.exp(v / 18);
// (Eqns. 23-24)
const ah = v => .07 * Math.exp(v / 20);
const bh = v => 1 / (Math.exp((v + 30) / 10) + 1);

// TESTING STUFF
const N_MODELS = 2;

export class Simulation {
    constructor () {
        // Simulation type
        this.type = 'AP';
        this.voltageClamp = false;
        this.markovModel = false;

        // Membrane potential
        this.mVInit = -60;
        this.mVMax = 60;
        this.mVMin = -90;

        // Conductances
        this.gKMax = 36; // Maxium K conductance
        this.gNaMax = 120; // Maximum Na conductance
        this.gLeak = .3; // Leak conductance
        this.gKLeakF = .8220557404; // Relative K leak conductance: 82.2%

        // Ionic concentrations
        this.KRatio = 1;
        this.NaRatio = 1;

        // Voltage-gated exponentials (Hodgkin & Huxley, 1952):
        // (Eqn. 6) gK = gKMax * n ^ nExp -> gK = gKMax * n^4
        // (Eqn. 14) gNa = gNaMax * h^hExp * m^mExp -> gNa = gNaMax * h * m^3
        this.nExp = 4;
        this.mExp = 3;
        this.hExp = 1;

        // NOTE: Will be useful for pharmacology
        this.hFrac = 1;

        // Gate closing and opening charges
        this.nOpen = -50; this.nClose = -60;
        this.mOpen = -35; this.mClose = -60;
        this.hOpen = -60; this.hClose = -30;

        // Ionic equilibrium potentials
        this.EK = -72;
        this.ENa = 55;

        // Membrane capacity per unit area
        this.Cm = 1;

        // Nernst variables
        this.celsius = 20;
        this.temperature = this.celsius + KELVIN;
        this.RTzF = RGAS * this.temperature / FARADAY;

        // Stimuli
        this.stimuli = [
            new Stimulus(100, 0, .1)
        ];

        // Plotting resolution
        this.TIMEBASE = 10;
        this.POINTS = 500;
        this.TOTALTIME = this.TIMEBASE;
    }

    calcLeak () {
        this.vK = this.EK + this.RTzF * Math.log(this.KRatio);
        this.vNa = this.ENa + this.RTzF * Math.log(this.NaRatio);

        this.gNaLeakF = 1 - this.gKLeakF;
        this.gKLeak = this.gKLeakF * this.gLeak;
        this.gNaLeak = this.gNaLeakF * this.gLeak;
        this.vLeak = this.gKLeakF * this.vK + this.gNaLeakF * this.vNa;
    }

    calcNernst (ion) {
        return this.RTzF * Math.log(ion.out / ion.in) / ion.z;
    }

    run () {
        this.initialize();

        for (let t = 0; t < this.TOTALTIME; t += this.dt) {
            if (this.voltageClamp) this.commandV();

            if (this.markovModel) {
                this.iT = 0;

                for (let k = 1; k < N_MODELS; k++) {
                    this.markovRates(k);
                    this.markovGatingCharge();
                    this.markovState(k);
                    this.markovCurrent();
                }
            } else {
                this.rates(); // done
                // this.gatingCharge();
                this.gates(); // done
                this.currents(); // done
            }

            if (this.voltageClamp) {
                this.gatingCurrents();
                this.plotVClamp();
            } else {
                // this.stimulus();
                this.voltages(); // done
            }

            // this.measurements();
        }
    }

    initialize () {
        this.dt = this.TIMEBASE / this.POINTS;
        this.ddt = this.dt / 1000;

        this.n = 0;
        this.m = 0;
        this.h = 0;

        this.calcLeak();

        this.mV = this.mVInit;
        this.mVold = this.mV;
    }

    rates () {
        // TODO: Check for division by zero
        this.an = an(this.mV - this.nOpen);
        this.bn = bn(this.mV - this.nClose);
        this.am = am(this.mV - this.mOpen);
        this.bm = bm(this.mV - this.mClose);
        this.ah = ah(this.mV - this.hOpen);
        this.bh = bh(this.mV - this.hClose);

        if ((this.n + this.m + this.h) === 0) {
            this.steadyState();
        }
    }

    steadyState () {
        this.n = this.an / (this.an / this.bn);
        this.m = this.am / (this.am / this.bm);
        this.h = this.ah / (this.ah / this.bh);
    }

    gates () {
        // Derived from Eqns. 7, 15 and 16
        this.dn = this.an * (1 - this.n) - this.bn * this.n;
        this.dm = this.am * (1 - this.m) - this.bm * this.m;
        this.dh = this.ah * (1 - this.h) - this.bh * this.h;

        // Step dt units in time
        this.n += this.dn * this.dt;
        this.m += this.dm * this.dt;
        this.h += this.dh * this.dt;

        // TODO: Check gate
    }

    currents () {
        let hNet = this.h * this.hFrac + (1 - this.hFrac);

        // Experimentally obtained probabilities (Fig. 3)
        this.pK = Math.pow(this.n, this.nExp);
        this.pNa = Math.pow(this.m, this.mExp) * Math.pow(hNet, this.hExp);

        // Ion conductance (Eqns. 6, 14)
        this.gK = this.gKMax * this.pK;
        this.gNa = this.gNaMax * this.pNa;

        // Ionic and leak currents (Eqns. 3-5)
        this.iNa = this.gNa * (this.mV - this.vNa);
        this.iK = this.gK * (this.mV - this.vK);
        this.iL = this.gKLeak * (this.mV - this.vK)
                + this.gNaLeak * (this.mV - this.vNa);
        this.iC = -this.Cm * (this.mVold - this.mV) / this.dt;
        this.iT = this.iT + this.iK + this.iNa;
    }

    voltages () {
        this.mV += -this.iT * this.dt;
    }
}
