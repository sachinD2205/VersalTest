import ValidationExpressions from "./ValidationExpressions";


const isInputNumber = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.NUMBER.test(ch)) {
        e.preventDefault();
    }
};

const isInputChar = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.CHAR.test(ch)) {
        e.preventDefault();
    }
};

const isInputDecimal = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.BIGDECIMAL.test(ch)) {
        e.preventDefault();
    }
};

const isInputVarchar = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.VARCHAR.test(ch)) {
        e.preventDefault();
    }
};

const isInputNumber1 = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.NUMBER1.test(ch)) {
        e.preventDefault();
    }
};

const isDevnagri = (e) => {
    var ch = String.fromCharCode(e.which);
    if (!ValidationExpressions.DEVNAGRI.test(ch)) {
        e.preventDefault();
    }
};



export default {
    isDevnagri,
    isInputNumber,
    isInputChar,
    isInputDecimal,
    isInputVarchar,isInputNumber1
};
  