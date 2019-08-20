function arrumarUnico(array) {
    let s = "";
    let props = [];
    
    let args = "";
      for(let i = 1; i < array.length;i++) {
          args += `'${array[i]}'`;
        if(i < array.length-1)
            args += ", ";
      }
    
    for(let _a of array[0]) {
        props.push(_a);	
    }
    
    props.sort();
    
    for(let p of props) {
        s += `['${p}', ${args}],\n`;
    }	
    
    return s;
  }
  
  function arrumarMultiplo(array) {
    let s = "";
    let props = [];
    
    for(let _a of array) {
        s += arrumarUnico(_a);
    }
    
    s = s.slice(0, -1);
    
    s = bubbleSort(eval(`[${s}]`));
    console.log("final");
    console.log(s);
    console.log()
    s = JSON.stringify(s).replace(/],/g, "],\n");
    return s.substring(1,s.length-1);
  }
  
  function converter(){
  let str = $("#converter").val();
      if(str.endsWith(","))
          str = str.slice(0, -1);
      if($("#tipo").val() == 0) {
          $("#convertido").val(arrumarUnico(eval(str)));
      } else {
          $("#convertido").val(arrumarMultiplo(eval(`[${str}]`)));
      }
      
  }
  
  
  $("#converter").keyup(converter);
  $("#tipo").change(converter);
  
  function bubbleSort(array) {
  console.log(array);
      let len = array.length;
      for (let i = 0; i < len; i++) {
          for (let j = 0; j < len-1; j++) {
              if (array[j][0] > array[j + 1][0]) {
                  let tmp = array[j];
                  array[j] = array[j + 1];
                  array[j + 1] = tmp;
              }
          }
      }
      return array;
  };