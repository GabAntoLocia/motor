export const calculateCredit  = (tipoNomina, fechaPrimerEmpleo, genero) => {

    const creditAmounts = {
        m: {
            min: [
                [0, 26, { A: 100, B: 1000, C: 400, D: 400 }],
                [27, 27, { A: 400, B: 600, C: 200, D: 300 }],
                [28, 28, { A: 900, B: 1000, C: 200, D: 500 }],
                [29, 29, { A: 100, B: 1000, C: 1000, D: 900 }],
                [30, Infinity, { A: 600, B: 1000, C: 600, D: 1000 }]
            ],
            max: [
                [0, 26, { A: 4900, B: 4700, C: 5000, D: 4400 }],
                [27, 27, { A: 4700, B: 4400, C: 4700, D: 4700 }],
                [28, 28, { A: 4600, B: 5000, C: 5000, D: 4300 }],
                [29, 29, { A: 4600, B: 4400, C: 4200, D: 4900 }],
                [30, Infinity, { A: 4500, B: 4900, C: 4600, D: 4300 }]
            ]
        },
        f: {
            min: [
                [0, 24, { A: 800, B: 800, C: 200, D: 500 }],
                [25, 25, { A: 800, B: 700, C: 900, D: 1000 }],
                [26, 26, { A: 800, B: 100, C: 700, D: 600 }],
                [27, 27, { A: 600, B: 600, C: 800, D: 400 }],
                [28, Infinity, { A: 200, B: 700, C: 100, D: 700 }]
            ],
            max: [
                [0, 24, { A: 4000, B: 4700, C: 4600, D: 5000 }],
                [25, 25, { A: 4200, B: 4200, C: 4900, D: 4900 }],
                [26, 26, { A: 4100, B: 4500, C: 4600, D: 4700 }],
                [27, 27, { A: 4200, B: 4300, C: 4700, D: 5000 }],
                [28, Infinity, { A: 4500, B: 4400, C: 4000, D: 4300 }]
            ]
        }
    };


    const currentDate = new Date();
    const startDate = new Date(fechaPrimerEmpleo);
    const monthsSinceStart = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));

    
    function getCreditAmount(table, months, tipoNomina) {
        for (let [min, max, values] of table) {
            if (months >= min && months <= max) {
                return values[tipoNomina];
            }
        }
        return null;
    }

    const minCredit = getCreditAmount(creditAmounts[genero].min, monthsSinceStart, tipoNomina);
    const maxCredit = getCreditAmount(creditAmounts[genero].max, monthsSinceStart, tipoNomina);


    const p1 = minCredit + Math.sqrt(maxCredit - minCredit);
    const p2 = minCredit + 0.0175 * (maxCredit - minCredit);
    const optimalCreditLine = Math.max(p1, p2);


    return {
        minCredit,
        maxCredit,
        optimalCreditLine: Math.round(optimalCreditLine) 
    };
}
