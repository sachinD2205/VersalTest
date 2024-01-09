import * as yup from "yup";

let schema = yup.object().shape({
  pinCode: yup.string().required("area pinCode  is Required !!!").matches(/^\d{6}$/, "Pin code should be 6 digits"),

  areaName: yup.string().required("Area Name is Required !!!"),
  areaNameMr: yup.string().required("Area Name Mr is Required !!!"),
  // remark: yup.string().required("Remark is Required !!!"),
  // remarkMr: yup.string().required("Area Name Mr is Required !!!"),
});

export default schema;
