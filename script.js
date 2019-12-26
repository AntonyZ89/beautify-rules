const converterElement = $('#converter');
const convertidoElement = $('#convertido');
const atElement = $('#at');
const withBracketElement = $('#withBracket');
// const errorElement = $('.error');

function unique(str) {
    str = unbracket(str);

    if (!str.startsWith('[')) {
        let r = str.split(',')[0];
        str = str.replace(r, `[${r}]`);
    }

    let v = splitBrackets(str)[0];
    let properties = str.replace(v, '');

    return eval(v)
        .map(v => `[['${v}']${properties}]`)
        .join(',\n');
}

function convert() {
    let val = converterElement
        .val()
        .replace(/[\t\n]/g, '')
        .trim()
        .replace(/(?:\s+)?([)\]])(?:\s+)?/g, '$1')
        .replace(/(?:\s+)?([(\[])(?:\s+)?/g, '$1')
        .replace(/\s+/g, ' ');

    /*
    let response = await  fetch('https://phpcodechecker.com/api?code=' + converterElement.val())
        .then(response => response.json());

    //{"errors":"TRUE","syntax":{"message":"Parse error: syntax error, unexpected ']' in your code on line 6","code":"]"}}
    console.log(response);
    if (response.errors === 'TRUE') {
        errorElement.addClass('is-invalid');
        errorElement.removeClass('is-valid');
        errorElement.text(response.syntax.message.replace(/in your code on line \d+/, ''));
        return;
    } else {
        errorElement.addClass('is-valid');
        errorElement.removeClass('is-invalid');
        errorElement.empty();
    }
     */

    let hasBracket = false;

    if (splitBrackets(val).length === 1) {
        val = unbracket(val);
        hasBracket = true;
    }

    let sorted = bubbleSort(
        splitBrackets(val)
            .map(unique)
            .join(',\n'), atElement.is(':checked')
    );
    let commented = comment(sorted).replace(/(\/\/.+),/g, '$1');

    /** Remove Brackets from Attribute */
    if (!withBracketElement.is(':checked')) {
        commented = commented
            .split('\n')
            .map((v, i) => {
                if (v.startsWith('\t\t//')) return v;

                let r = v.match(/\[(.+)]/)[1];
                let _r = r.split(',')[0];
                return v.replace(r, r.replace(_r, unbracket(_r)));
            }).join('\n');
    }

    if (hasBracket) commented = `[\n${commented}\n]`;

    convertidoElement.val(commented);
}

converterElement.keyup(convert);
atElement.change(convert);
withBracketElement.change(convert);

function bubbleSort(str, CreatedAtAndUpdatedAt) {
    str = str.split(',\n');
    let len = str.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            let str1 = getMainAttribute(str[j]);
            let str2 = getMainAttribute(str[j + 1]);

            (str1 > str2) && ([str[j], str[j + 1]] = [str[j + 1], str[j]]);
        }
    }

    let createdAtIndex = -1, updatedAtIndex = -1;

    str.forEach((v, i) => {
        if (createdAtIndex !== -1 && updatedAtIndex !== -1) return;

        v = getMainAttribute(v);
        if (CreatedAtAndUpdatedAt && createdAtIndex === -1 && v === "'created_at'")
            createdAtIndex = i;
        else if (CreatedAtAndUpdatedAt && updatedAtIndex === -1 && v === "'updated_at'")
            updatedAtIndex = i;
    });

    let createdAt, updatedAt;

    function removeCreatedAt() {
        if (createdAtIndex !== -1)
            createdAt = str.splice(createdAtIndex, 1)[0];
    }

    function removeUpdatedAt() {
        if (updatedAtIndex !== -1)
            updatedAt = str.splice(updatedAtIndex, 1)[0];
    }

    if (createdAtIndex !== -1) {
        if (createdAtIndex > updatedAtIndex) {
            removeCreatedAt();
            removeUpdatedAt();
        } else {
            removeUpdatedAt();
            removeCreatedAt();
        }

        createdAt && str.push(createdAt);
        updatedAt && str.push(updatedAt);
    } else if (updatedAtIndex !== -1) {
        if (createdAtIndex > updatedAtIndex) {
            removeCreatedAt();
            removeUpdatedAt();
        } else {
            removeUpdatedAt();
            removeCreatedAt();
        }

        createdAt && str.push(createdAt);
        updatedAt && str.push(updatedAt);
    }

    return str.join(',\n');
}

function comment(str) {
    str = str.split(',\n');

    let values = {};

    str.forEach((attribute, i) => {
        attribute = getMainAttribute(attribute);
        (values[attribute] === undefined) && (values[attribute] = i);
    });

    for (let attribute of Object.keys(values).reverse())
        str.splice(values[attribute], 0, `\t\t//${unquote(attribute)}`);

    return str.join(',\n');
}

function unbracket(str) {
    return str.slice(1, -1);
}

function unquote(str) {
    return unbracket(str);
}

function getMainAttribute(str) {
    /**
     * 1 - [['example'], 'integer']
     * 2 - ['example'], 'integer'
     * 3 - ['example']
     * 4 - 'example'
     *         4           3           2      1 */
    return unbracket(splitBrackets(unbracket(str))[0])
}

function splitBrackets(str) {
    let strSplit = str.split('');

    let brackets = [], bracketIndex = -1, inside = 0;

    strSplit.forEach((v, i) => {
        if (v === '[')
            bracketIndex === -1 ? (bracketIndex = i) : inside++;
        else if (v === ']' && !inside--) {
            brackets.push(str.substring(bracketIndex, i + 1));
            (bracketIndex = -1) && (inside = 0);
        }
    });

    return brackets;
}

setTimeout(() => {
    converterElement.val(`[
    [['example', 'yii', 'created_at', 'updated_at'], 'integer'],
    [['yii', 'good_structure'], 'required'],
    ['creation_date', 'date'],
    [['name', 'description'], 'string', 'max' => 255]
]`);

    convert();
}, 100);
