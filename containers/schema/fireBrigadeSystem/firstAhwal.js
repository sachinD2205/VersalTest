import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  // vardi slip
  vardiSlip: yup.object().shape({
    informerName: yup
      .string()
      .required("Informer Name is Required !!!")
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    informerMiddleName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    informerLastName: yup
      .string()
      .required("Informer Name is Required !!!")
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    informerNameMr: yup
      .string()
      .required("Informer Name (In Marathi) is Required !!!")
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
    informerMiddleNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
    informerLastNameMr: yup
      .string()
      .required("Informer Name (In Marathi) is Required !!!")
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
    mailID: yup
      .string()
      .email("Email is not valid")
      .required("Email Id is Required !!!"),
    contactNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError("Mobile Number is Required !!")
      .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number")
      .required(),
    area: yup
      .string()
      .required("Informer Name is Required !!!")
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    areaMr: yup
      .string()
      .required("Informer Name (In Marathi) is Required !!!")
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
    vardiPlace: yup
      .string()
      .required("Informer Name is Required !!!")
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    vardiPlaceMr: yup
      .string()
      .required("Informer Name (In Marathi) is Required !!!")
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
    city: yup
      .string()
      .required("Informer Name is Required !!!")
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    cityMr: yup
      .string()
      .required("Informer Name (In Marathi) is Required !!!")
      .matches(
        /^[\u0900-\u097F ]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
  }),
  // first ahwal
  firstAhawal: yup.object().shape({
    vardiDispatchTime: yup.string().required(),
    selfEmployeeInjurred: yup
      .number()
      .required()
      .typeError("Employee Injurred count is required"),
    selfEmployeeDead: yup
      .number()
      .required()
      .typeError("Employee Dead count is required"),
    ownerOfPropertyInjurredCount: yup
      .number()
      .required()
      .typeError("Owner Of Property Injurred count is required"),
    ownerOfPropertyDeadCount: yup
      .number()
      .required()
      .typeError("Owner Of Property Dead count is required"),
    otherInjurred: yup
      .number()
      .required()
      .typeError("Other Injurred count is required"),
    otherDead: yup
      .number()
      .required()
      .typeError("Other Dead count is required"),
  }),
})

export default Schema
