import * as yup from "yup";

// schema - validation for student admission form
let academicYearSchema = yup.object().shape({
  academicYear: yup.string().required("Academic Year is Required"),
  //   academicYearFrom: yup.string().required("Academic YearFrom Date is Required"),
  //   academicYearTo: yup.string().required("Academic YearTo Date is Required"),

  academicYearFrom: yup.string().required("From date is required"),
  // .test("from-date", "From date should not be greater than To date", function (value) {
  //   const { academicYearTo } = this.parent;
  //   return !academicYearTo || !value || value <= academicYearTo;
  // }),
  academicYearTo: yup.string().required("To date is required"),
  // .test("to-date", "To date should not be less than From date", function (value) {
  //   const { academicYearFrom } = this.parent;
  //   return !academicYearFrom || !value || value >= academicYearFrom;
  // }),
});

export default academicYearSchema;
