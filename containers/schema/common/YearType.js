import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  yearType: yup.string().required("Year Type is Required !!!"),
  startDate: yup.string().nullable().required("Start Date is Required !!!"),
  endDate: yup.string().nullable().required("End Date is Required !!!"),
  remark: yup.string().required("Remark is Required"),
});

export default schema;
