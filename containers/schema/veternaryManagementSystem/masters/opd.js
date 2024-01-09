import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  opdId: yup.string().required("OPD Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  zoneName: yup.string().required("Zone Name is Required !!!"),
  wardName: yup.string().required("Ward Name is Required !!!"),
  opdPrefix: yup.string().required("OPD Prefix is Required"),
  opdNo: yup.string().required("OPD No is Required"),
  opdName: yup.string().required("OPD Name is Required"),
  opdOpeningTime: yup
    .string()
    .nullable()
    .required("OPD Opening Time is Required"),
  opdWorkingDays: yup.string().required("OPD Working Days is Required"),
  roadName: yup.string().required("Road Name is Required"),
  landmark: yup.string().required("Landmark is RSquired"),
  pincode: yup.string().required("Pincode is Required"),
})

export default Schema
