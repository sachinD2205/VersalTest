import React from "react";

const CheckFileExtension = (filename) => {
  const extension = filename.split(".").pop();
  // console.log(extension);
  if (["jpeg", "jpg", "png"].indexOf(extension) < 0) {
    message.error("Please Select Valid File Format JPEG,JPG,PNG,PDF!");
    return false;
  } else {
    return true;
  }
};

export default CheckFileExtension;
