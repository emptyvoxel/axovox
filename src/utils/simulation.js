export const FARADAY = 9.6487;
export const RGAS = 8.3143;
export const KELVIN = 273.15;
export const IONS = {
    'K': { in: 140, out: 5, charge: 1 },
    'Na': { in: 15, out: 145, charge: 1 },
}

export class Simulation {
    constructor () {
        // Membrane potential
        this.mVInit = -60;
        this.mVMax = 60;
        this.mVMin = -90;
        this.mV = this.mVInit;

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

        // Ionic equilibrium potentials
        this.EK = -72;
        this.ENa = 55;

        // Membrane capacity per unit area
        this.Cm = 1;

        // Nernst variables
        this.celsius = 20;
        this.temperature = this.celsius + KELVIN;
        this.RTzF = RGAS * this.temperature / FARADAY;
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
}
