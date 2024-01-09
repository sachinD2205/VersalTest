import { toast, ToastContainer } from "react-toastify";

export const Failed = (errors) => {
  toast("Failed ! Please Try Again !", {
    type: "error",
    position: toast.POSITION.TOP_RIGHT,
    //  autoClose:toast.autoClose
    // autoClose={3000}
    // hideProgressBar={false}
    // newestOnTop={false}
    // draggable={false}
    // pauseOnVisibilityChange
    // closeOnClick
    // pauseOnHover
  });
  console.log("error", errors);
};

// export const DraftSaveAlert = () => {
//   toast("Draft ! Saved in Draft !", {
//     type: "error",
//     position: toast.POSITION.TOP_RIGHT,
//     //  autoClose:toast.autoClose
//     // autoClose={3000}
//     // hideProgressBar={false}
//     // newestOnTop={false}
//     // draggable={false}
//     // pauseOnVisibilityChange
//     // closeOnClick
//     // pauseOnHover
//   });
// };

export default Failed;