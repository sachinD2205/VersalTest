import * as yup from "yup"

let Schema = (language, checked) => {
  const checked1 = checked
  console.log("checked3423", checked, checked1)
  return yup.object().shape({
    // wardKey: yup.string().required("Ward name is Required"),
    // workName: yup.string().required("Work Name is Required"),
    // rotationGroupKey: yup.string().required("Select rotation Group is Required"),
    // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required"),
    // newsPaperLevel: yup.string().required("Select news Paper Level is Required"),
    // standardFormatSize: yup.string().required("Select standard Format Size is Required"),

    // financialYear: yup.string().required("Financial Year is Required"),
    // zoneKey: yup.string().required("Zone name is Required"), // Removed zone field | Client Requirements 16-10-2023
    department: yup
      .string()
      .required("Department name is Required / विभागाचे नाव आवश्यक आहे"),
    advertisementType: yup
      .string()
      .required("Advertisement Type is Required / जाहिरात प्रकार आवश्यक आहे"),
    financialYear: yup
      .string()
      .required("Please Select Financial Year / कृपया आर्थिक वर्ष निवडा"),
    typeOfNews: yup
      .string()
      .required("Please Select type Of News / कृपया बातम्यांचा प्रकार निवडा"),
    advirtiseMentInDocx: yup
      .string()
      .typeError(
        "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
      )
      .required(
        "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
      ),
    advirtiseMentInPdf: yup
      .string()
      .typeError(
        "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
      )
      .required(
        "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
      ),
    newsAdvertisementSubject: yup
      .string()
      .required(
        "News Advertisement Subject is Required / बातम्या जाहिरात विषय आवश्यक आहे"
      ),
    newsAdvertisementDescription: yup
      .string()
      .required(
        "news Advertisement Description is Required / बातम्या जाहिरात वर्णन आवश्यक आहे"
      ),
    newsPublishDate: yup
      .date()
      .typeError("Enter Valid Date / वैध तारीख प्रविष्ट करा")
      .required(
        "news Publish Date is Required / बातम्या प्रकाशित करण्याची तारीख आवश्यक आहे"
      ),
    // workCost: yup
    //   .string()
    //   .matches(/^[0-9]+$/, "Must be only digits")
    //   .typeError(),
    // .required("work Cost is Required"),

    // specialNotice: yup
    //   .string()
    //   .typeError(
    //     "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
    //   )
    //   .required(
    //     "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
    //   ),

    // specialNotice: yup.string().when(["checked1"], {
    //   is: (checked1) => checked1,
    //   then: yup
    //     .string()
    //     .typeError(
    //       "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
    //     )
    //     .required(
    //       "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
    //     ),
    //   otherwise: yup.string().nullable(),
    // }),

    specialNotice: yup.string().when("checked", {
      is: (checked) => checked, // Apply when resignDate is truthy (filled)
      then: yup
        .string()
        .nullable()
        .required(
          "Please Attach the Document Here / कृपया येथे कागदपत्र संलग्न करा"
        ),
      otherwise: yup.string().nullable(), // No validation when resignDate is not filled
    }),
  })
}
export default Schema
