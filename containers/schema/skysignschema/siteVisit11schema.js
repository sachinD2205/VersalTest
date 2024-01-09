import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
    // advertisementCategoryPrefix: yup
    //     .string()
    //     .required("Advertisement Category  Prefix is Required !!!"),
    // advertisementCategory: yup.string().required("Advertisement Category  is Required !!!"),
    // fromDate: yup.string().nullable().required("From Date is Required !!!"),
    // toDate: yup.string().nullable().required("todate is Required !!!"),
    // mediaType: yup.string().required("Media Type  is Required !!!"),
    // mediaSubType: yup.string().required("Media Sub Type  is Required !!!"),
    //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
