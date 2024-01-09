import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

export let demandBillAdvocateDetailsSchema = yup.object().shape({
  // advocateName
  //   advocateName: yup
  //     .string()
  //     .required(<FormattedLabel id='advocateNameValidation' />),
  //   // city
  //   city: yup.string().required(<FormattedLabel id='cityNameValidation' />),
  //   // area
  //   area: yup.string().required(<FormattedLabel id='areaNameValidation' />),
  //   // roadName
  //   roadName: yup.string().required(<FormattedLabel id='roadNameValidation' />),
  //   // landMarkName
  //   landmark: yup
  //     .string()
  //     .required(<FormattedLabel id='landmarkNameValidation' />),
  //   // pinCode
  //   pinCode: yup
  //     .string()
  //     .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
  //     .typeError(<FormattedLabel id='pinCodeValidation' />)
  //     .min(
  //       6,
  //       "pincode number must be at least 6 number/ पिनकोड क्रमांक किमान 6 क्रमांकाचा असावा",
  //     )
  //     .max(
  //       6,
  //       "pincode number not valid on above 6 number/6 अंकांवरील क्रमांकावर पिनकोड क्रमांक वैध नाही",
  //     )
  //     .required(),
  //   // mobileNo
  //   mobileNo: yup
  //     .string()
  //     .required(<FormattedLabel id='mobileNovalidation' />)
  //     .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
  //     .min(
  //       10,
  //       "mobile number must be at least 10 number/मोबाईल क्रमांक किमान 10 अंकी असावा",
  //     )
  //     .max(
  //       10,
  //       " mobile number is  not valid above 10 number/मोबाईल नंबर 10 अंकीवर वैध नाही",
  //     )
  //     .typeError(),
  //   // emailAddress
  //   emailAddress: yup
  //     .string()
  //     .required(<FormattedLabel id='emailIdValidation' />)
  //     .email(
  //       "please enter valid email address/कृपया वैध ई-मेल पत्ता प्रविष्ट करा",
  //     )
  //     .typeError(),
});

// // BankDetailsSchema
export let demandBillBankDetailsSchema = yup.object().shape({
  //   // bankName
  //   bankName: yup.string().required(<FormattedLabel id='bankNameValidation' />),
  //   // accountNo
  //   accountNo: yup
  //     .string()
  //     .required(<FormattedLabel id='accountNoValidation' />)
  //     .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
  //     .min(
  //       12,
  //       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
  //     )
  //     .max(
  //       17,
  //       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
  //     )
  //     .typeError(<FormattedLabel id='accountNoValidation' />),
  //   //bankIFSCCode
  //   bankIFSCCode: yup
  //     .string()
  //     .required(<FormattedLabel id='ifscCodeValidation' />),
  //   // bankMICRCode
  //   bankMICRCode: yup
  //     .string()
  //     .required(<FormattedLabel id='bankMICRCodeValidation' />),
  // });
  // // BillDetailsSchema
  // export let demandBillDetailsSchema = yup.object().shape({
  //   // // caseNumber
  // caseNumber: yup
  //   .string()
  //   .required(<FormattedLabel id='caseNumberValidation' />),
  //   // // caseMainType
  //   // caseMainType: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='caseMainTypeValidation' />),
  //   // // caseSubType
  //   // caseSubType: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='caseSubTypeValidation' />),
  //   // // caseFees
  //   // caseFees: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='caseFeesValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   ),
  //   // // feesAmount
  //   // feesAmount: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='billAmountValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   )
  //   //   .typeError(),
  //   // // pendingFees
  //   // pendingFees: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='pendingAmountValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   )
  //   //   .typeError(),
  //   // // paymentDate
  //   // paymentDate: yup
  //   //   .date()
  //   //   .required(<FormattedLabel id='billCreatedDateTimeValidation' />)
  //   //   .typeError(
  //   //     "bill created date is required/बिल तयार करण्याची तारीख आवश्यक आहे !!!",
  //   //   ),
  //   // // approvalAmount
  //   // approvalAmount: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='approvalAmountValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   )
  //   .typeError(),
});

// BillDetailsSchema
export let demandBillDetailsSchema = yup.object().shape({
  caseNumber: yup.string().required("Case Number is Required !!!"),

  // // caseNumber
  // caseNumber: yup.string().required("efs"),
  // .required(<FormattedLabel id='caseNumberValidation' />),
  // // hawkingzoneName
  // hawkingZoneName: yup
  //   .string()
  //   .required(<FormattedLabel id='caseNumberValidation' />),
  // // paidAmount
  // paidAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='paidAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billAmount
  // billAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='billAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // caseMainType
  // caseMainType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseMainTypeValidation' />),
  // // caseSubType
  // caseSubType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseSubTypeValidation' />),
  // // caseFees
  // caseFees: yup
  //   .string()
  //   .required(<FormattedLabel id='caseFeesValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   ),
  // // pendingAmount
  // pendingAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='pendingAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billCreatedDateTime
  // billCreatedDateTime: yup
  //   .date()
  //   .required(<FormattedLabel id='billCreatedDateTimeValidation' />)
  //   .typeError(
  //     "bill created date is required/बिल तयार करण्याची तारीख आवश्यक आहे !!!",
  //   ),
});
export let demandBillAdvocateDetailsSchema1 = yup.object().shape({
 
});
