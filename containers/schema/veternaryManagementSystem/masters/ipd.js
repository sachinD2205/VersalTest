import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  ipdId: yup.string().required("IPD Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  zoneName: yup.string().required("Zone Name is Required !!!"),
  wardName: yup.string().required("Ward Name is Required !!!"),
  ipdPrefix: yup.string().required("IPD Prefix is Required"),
  ipdNo: yup.string().required("IPD No is Required"),
  ipdName: yup.string().required("IPD Name is Required"),
  ipdWorkingDays: yup.string().required("IPD Working Days is Required"),
  opdOpeningTime: yup
    .string()
    .nullable()
    .required("OPD Opening Time is Required"),
  opdWorkingDays: yup.string().required("OPD Working Days is Required"),
  roadName: yup.string().required("Road Name is Required"),
  landmark: yup.string().required("Landmark is Required"),
  pincode: yup.string().required("Pincode is Required"),
  ipdChargesPerDay: yup.string().required("IPD Charges Per Day is Required"),
})

export default Schema
