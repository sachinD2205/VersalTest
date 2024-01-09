import * as yup from "yup";

export const bookIssueSchema = yup.object().shape({
  libraryId: yup.string().required("Library ID is required"),
  memberId: yup.string().required("Member ID is required"),
  bookId: yup.string().required("Book ID is required"),
  issueDate: yup.date().required("Issue Date is required"),
});

export const bookReturnSchema = yup.object().shape({
  libraryId: yup.string().required("Library ID is required"),
  memberId: yup.string().required("Member ID is required"),
  bookId: yup.string().required("Book ID is required"),
  returnDate: yup.date().required("Return date is required"),
});
