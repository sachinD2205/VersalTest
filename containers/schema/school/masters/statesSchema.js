import * as yup from "yup";

// schema - validation for student divisionSchema form
let statesSchema = yup.object().shape({

  stateName: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("State Name is Required"),
  stateNameMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("State Name in marathi Required"),
  remark: yup.string().required("Remark is Required"),


});

export default statesSchema;
