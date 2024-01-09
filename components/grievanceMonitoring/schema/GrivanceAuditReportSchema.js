import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
export let GrivanceAuditReportSchema = (language) => {
  return yup.object().shape({
    // fromDate
    fromDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "from date selection is required !!!"
          : "तारीख पासून निवड आवश्यक आहे !!!",
      ),
    // toDate
    toDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "to date selection is required"
          : "आजपर्यंतची निवड आवश्यक आहे",
      ),
    // departmentName
    // department: yup
    //   .string()
    //   .nullable()
    //   .required("Department name selection is required !!!"),
    // subDepartmentName
    // lstSubDepartment: yup
    //   .array()
    //   .nullable()
    //   .required("Sub Department name selection is required !!!"),
    // Percentage
    percentage: yup
      .number(
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!",
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!",
      )
      .required(
        language == "en"
          ? "percentage is required !!!"
          : "टक्केवारी आवश्यक आहे !!!",
      ),
  });
};

export let GrivanceAuditListTitleSchema = (language) => {
  return yup.object().shape({
    // fromDate
    fromDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "to date selection is required"
          : "आजपर्यंतची निवड आवश्यक आहे",
      ),
    // toDate
    toDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "to date selection is required"
          : "आजपर्यंतची निवड आवश्यक आहे",
      ),
    // departmentName
    // department: yup
    //   .string()
    //   .nullable()
    //   .required("Department name selection is required !!!"),
    // subDepartmentName
    // lstSubDepartment: yup
    //   .array()
    //   .nullable()
    //   .required("Sub Department name selection is required !!!"),
    // Percentage
    percentage: yup
      .number(
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!",
      )
      .required(
        language == "en"
          ? "percentage is required !!!"
          : "टक्केवारी आवश्यक आहे !!!",
      )
      .typeError(
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!",
      ),
    // titleName
    reportTitle: yup
      .string().nullable()
      .required(<FormattedLabel id='reportTitleReq'/>),
  });
};

export let AuditListTitleSchema = (language) => {
  return yup.object().shape({
    // titleName
    reportTitle: yup
      .string().nullable()
      .required(<FormattedLabel id='reportTitleReq'/>)
  });
};
