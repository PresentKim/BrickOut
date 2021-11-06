export default class ColorHSLA {
    constructor(
            public h: number,
            public s: number = 100,
            public l: number = 50,
            public a: number = 1
    ) {
    }

    toString() {
        return "hsla(" + this.h + "," + this.s + "%," + this.l + "%," + this.a + ")";
    }
}