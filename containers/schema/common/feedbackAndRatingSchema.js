import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  feedbackEnt: yup.string().required("Feedback is Required !!!"),
  ratingVal: yup
    .number()
    .min(1, "Rating must be at least 1 Star")
    .max(5, "Rating cannot be greater than 5 Star")
    .required("Rating is required")
    .nullable(),
});

export default schema;
