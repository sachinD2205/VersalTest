import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let loiGeneratedSchema = yup.object().shape({
    // applicationNo: yup
    // .string()
    // .required("Application No is Required !!!"),
    // applicantFirstName: yup.string().required("Applicant First Name is Required !!!"),
    // serviceName: yup.string().required("Service Name is Required !!!"),
    // amount: yup.string().required("Amount is Required !!!"),
    // noOfPages:yup
    // .string()
    // .required(<FormattedLabel id="noOfPageReq" />)
    // .matches(/^[0-9]+$/, "Must be only digits/फक्त अंक असणे आवश्यक आहे")
    // .typeError(<FormattedLabel id="allowNum" />)
    // .min(1, <FormattedLabel id="noOfPageMin" />)
    // .max(5, <FormattedLabel id="noOfPagesMax" />),
    // totalAmount: yup.string().test(
    //     "minValue",
    //     <FormattedLabel id="totalAmountMin" />,
    //     (value) => value != 0
    //   )
    // .required(<FormattedLabel id="totalAmtReq"/>)
    // .max(5, <FormattedLabel id="totalMax" />)
    // .matches(/^[0-9]+$/, "Must be only digits/फक्त अंक असणे आवश्यक आहे"),
    // amount:yup
    // .string()
    // .required(<FormattedLabel id="ratePerPageReq" />)
    // .matches(/^[0-9]+$/, <FormattedLabel id="mustBeOnlyNum" />)
    // .typeError(<FormattedLabel id="allowNum" />)
    // .min(1, <FormattedLabel id="ratePerPageMin" />)
    // .max(4, <FormattedLabel id="ratePerPageMax" />),
    // chargeTypeKey: yup.string().required(<FormattedLabel id="chargeTypeReq"/>),
    // totalAmount:yup.string().required("Total Amount is Required !!!"),
    remarks:yup.string().max(2000, <FormattedLabel id='remarkMaxLen' />)
    .required(<FormattedLabel id="remarkReq"/>),

});

export default loiGeneratedSchema;