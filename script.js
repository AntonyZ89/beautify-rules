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
      .map((v, i) => `'${v}'`)
      .join(", ");
    if (comentados.indexOf(`${atributo}`) === -1) {
      resultado += `\t\t\t//${atributo}\n`;
      comentados.push(atributo);
    }
    resultado += `['${atributo}', ${args}],\n`;
  }

  return resultado;
}

function converter() {
  let str = $("#converter").val();
  if (str.endsWith(",")) str = str.slice(0, -1);
  if ($("#tipo").val() == 0) {
    $("#convertido").val(arrumarUnico(eval(str)));
  } else {
    $("#convertido").val(arrumarMultiplo(eval(`[${str}]`)));
  }
}

$("#converter").keyup(converter);
$("#tipo").change(converter);

function bubbleSort(array) {
  let len = array.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (array[j][0] > array[j + 1][0]) {
        let tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
      }
    }
  }
  return array;
}
