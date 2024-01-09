import * as yup from "yup";

let schema = yup.object().shape({
  //     billPrefix: yup
  //     .string()
  //     .required("Bill Prefix is Required !!!"),
  //   fromDate: yup.string().nullable().required("From Date is Required !!!"),
  //   toDate: yup.string().nullable().required("To Date is Required !!!"),
  //   billType:
  // menuNameMr: yup.string().required("menuNameMr is Required"),
  //             menuCode:yup.string().required("menuCode is Required") ,
  //             menuNameEng:string().required("menuNameEng is Required") ,
  //             appId:string().required("appId is Required") ,
  menuCode: yup.string().required("Menu Code is Required !!!"),
  menuNameEng: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required("Menu Name is Required !!!"),
  menuNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required("Menu Name is Required !!!"),
  clickTo: yup.string().required("Menu Code is Required !!!"),
  appId: yup.string().required().typeError("Please Choose Application Name"),
  icon: yup.string().required().typeError("Please Choose Icon"),
  breadcrumName: yup
    .string()
    .required()
    .required()
    .typeError("Enter Breadcrum Name"),
  content: yup.string().required().required().typeError("Enter any content"),
  //   selectedChildOrParent: yup.string().required("please choose one option"),
  parentId: yup.string().required().typeError("Please Select One"),
  //   selectedChildOrParent: yup.boolean().required().oneOf(["Y", "N"], "please choose one option"),
  //   serviceId: yup.string().typeError("Service Name Not Available"),
});

export default schema;
