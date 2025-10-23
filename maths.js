(() => {
    const display = document.getElementById('res');
    const teclado = document.getElementById('teclado');

    let displayStr = '';
    let evalStr = '';
    let lastAns = 0;
    let memory = 0;
    let angleMode = 'rad';

    const jsFnMap = {
        ln: 'Math.log',
        log: 'log10',
        sqrt: 'Math.sqrt',
        exp: 'Math.exp',
        abs: 'Math.abs',
        sinh: 'Math.sinh',
        cosh: 'Math.cosh',
        tanh: 'Math.tanh'
    };

    function render() {
        display.innerText = displayStr || '0';
    }

    function evaluateExpression(expr) {
        try {
            expr = expr.replace(/\^/g, '**');
            expr = expr.replace(/(\d+)!/g, 'factorial($1)');
            const funcBody = `
                const angleMode = ${JSON.stringify(angleMode)};
                function toRad(x){ return x * Math.PI / 180; }
                function sin(x){ return angleMode==='deg' ? Math.sin(toRad(x)) : Math.sin(x); }
                function cos(x){ return angleMode==='deg' ? Math.cos(toRad(x)) : Math.cos(x); }
                function tan(x){ return angleMode==='deg' ? Math.tan(toRad(x)) : Math.tan(x); }
                function asin(x){ return angleMode==='deg' ? Math.asin(x)*180/Math.PI : Math.asin(x); }
                function acos(x){ return angleMode==='deg' ? Math.acos(x)*180/Math.PI : Math.acos(x); }
                function atan(x){ return angleMode==='deg' ? Math.atan(x)*180/Math.PI : Math.atan(x); }
                function log10(x){ return Math.log10 ? Math.log10(x) : Math.log(x)/Math.LN10; }
                function factorial(n){
                    n = Math.floor(n);
                    if(n < 0) return NaN;
                    if(n === 0 || n === 1) return 1;
                    let r = 1;
                    for(let i = 2; i <= n; i++) r *= i;
                    return r;
                }
                const memory = ${Number(memory)};
                const ans = ${Number(lastAns)};
                return (${expr});
            `;
            const result = new Function(funcBody)();
            return result;
        } catch (e) {
            return 'Error';
        }
    }

    teclado.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.tecla');
        if (!btn) return;
        const v = btn.dataset.value;

        if (v === 'limpar') {
            displayStr = '';
            evalStr = '';
            render();
            return;
        }
        if (v === 'apagar') {
            displayStr = displayStr.slice(0, -1);
            evalStr = evalStr.slice(0, -1);
            render();
            return;
        }
        if (v === 'eval') {
            if (!evalStr.trim()) return;
            const processed = evalStr
                .replace(/\bln\(/g, 'Math.log(')
                .replace(/\blog\(/g, 'log10(')
                .replace(/\bsqrt\(/g, 'Math.sqrt(')
                .replace(/\bexp\(/g, 'Math.exp(')
                .replace(/\babs\(/g, 'Math.abs(');
            const result = evaluateExpression(processed);
            displayStr = String(result);
            lastAns = (typeof result === 'number' && isFinite(result)) ? result : lastAns;
            evalStr = String(lastAns);
            render();
            return;
        }
        if (v === 'mc') { memory = 0; return; }
        if (v === 'mr') { displayStr += String(memory); evalStr += String(memory); render(); return; }
        if (v === 'mplus') { memory += Number(lastAns); return; }
        if (v === 'mminus') { memory -= Number(lastAns); return; }
        if (v === 'deg') { angleMode = 'deg'; return; }
        if (v === 'rad') { angleMode = 'rad'; return; }
        if (v === 'ans') {
            displayStr += 'Ans';
            evalStr += `(${lastAns})`;
            render();
            return;
        }
        if (v === 'pi') {
            displayStr += 'π';
            evalStr += 'Math.PI';
            render();
            return;
        }
        if (v === 'e') {
            displayStr += 'e';
            evalStr += 'Math.E';
            render();
            return;
        }
        if (v === '!') {
            displayStr += '!';
            evalStr += '!';
            render();
            return;
        }
        if (v === '^') {
            displayStr += '^';
            evalStr += '^';
            render();
            return;
        }

        const fnNames = ['sin','cos','tan','asin','acos','atan','ln','log','sqrt','exp','abs','sinh','cosh','tanh'];
        if (fnNames.includes(v)) {
            displayStr += v + '(';
            if (jsFnMap[v]) {
                evalStr += jsFnMap[v] + '(';
            } else {
                evalStr += v + '(';
            }
            render();
            return;
        }

        displayStr += btn.innerText;
        evalStr += v;
        render();
    });

    render();
})();