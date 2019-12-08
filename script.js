function arrumarUnico(array) {
    let s = "";
    let props = [];

    let args = array
        .splice(1, array.length)
        .map((v, i) => `'${v}'`)
        .join(", ");

    for (let _a of array[0]) {
        props.push(_a);
    }

    props.sort();

    let comentados = [];

    for (let p of props) {
        if (comentados.indexOf(`${p}`) === -1) {
            s += `\t\t\t//${p}\n`;
            comentados.push(p);
        }
        s += `['${p}', ${args}],\n`;
    }

    s = bubbleSort(`[${s}]`);

    return s.substring(1, s.length - 1);
}

function arrumarMultiplo(array) {
    let s = "";
    let resultado = "";

    for (let _a of array) {
        s += arrumarUnico(_a);
    }

    s = s.slice(0, -1);

    s = bubbleSort(eval(`[${s}]`));

    let comentados = [];

    for (let _array of s) {
        let atributo = _array[0];
        let args = _array
            .slice(1, _array.length)
            .map(v => {

                if (/.+ => \d+/.test(v)) {
                    let m = v.match(/(.+) => .+/)[1];
                    return v.replace(m, `\'${m}\'`);
                }

                return `'${v}'`;
            })
            .join(", ");
        if (comentados.indexOf(`${atributo}`) === -1) {
            resultado += `\t\t\t//${atributo}\n`;
            comentados.push(atributo);
        }
        resultado += `['${atributo}', ${args}],\n`;
    }

    return resultado;
}

function _() {
    `[['accredited', 'courtyards'], 'string', 'max' => 255]`.split(', ').map((v) => {
        if (/(['"]).+\1 => .+/.test(v)) {

            let m = temp1.match(/(['"]).+\1/)[0];
            v = v.replace(m, m.slice(0, -1));
            m = temp2.match(/=> .+\b/)[0];
            v = v.replace(m, m + "'");
            return v;

        }
        return v;
    }).join(', ')
}

function converter() {
    let str = $("#converter").val();
    if (str.endsWith(",")) str = str.slice(0, -1);
    str = str.trim().replace(/\s+/g, ' ').split('');

    let groups = [], found = false, index = 0, _ = 0;

    for (let [i, v] of str.entries()) {
        if (v === '[') {
            if (found) {
                _++;
            } else {
                found = true;
                index = i;
            }
        } else if (v === ']') {
            if (_) _--;
            else {
                groups.push([index, i]);
                found = false;
            }
        }
    }

    str = str.join('');

    for (let [start, final] of groups) {
        let _str = str.substring(start, final + 1);
        let _n_str = 0;


        if (/(['"]).+\1 => \d+/.test(_str)) {
            _n_str = _str;
            let m = _n_str.match(/(['"]).+\1/)[0];
            _n_str = _str.replace(m, m.slice(0, -1));
            m = _n_str.match(/=> \d+\b/)[0];
            _n_str = _n_str.replace(m, `${m}'`);


            str = str.replace(_str, _n_str);
        } else if (/(['"]).+\1 => (['"]).+\2/.test(_str)) {
            _n_str = _str.split('').reverse();

            let p = false;
            let qnt = 2;
            for (let [i, v] of _n_str.entries()) {
                if ([`'`, `"`].indexOf(v) !== -1) {
                    if (p && qnt) {
                        delete _n_str[i];
                        qnt--;
                    } else {
                        p = true;
                    }


                }
            }

            _n_str = _n_str.reverse().join('');

            str = str.replace(_str, _n_str);
        }

    }


    /*if ($("#tipo").val() == 0) {
      $("#convertido").val(arrumarUnico(eval(str)));
    } else {*/
    $("#convertido").val(arrumarMultiplo(eval(`[${str}]`)));
    // }
}

$("#converter").keyup(converter);

// $("#tipo").change(converter);

function bubbleSort(array) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (array[j][0] > array[j + 1][0]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                // let tmp = array[j];
                // array[j] = array[j + 1];
                // array[j + 1] = tmp;
            }
        }
    }
    return array;
}
