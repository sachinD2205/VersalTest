import React from "react";

// Check File Size
export function checkFileSize(fileSize) {
  if (fileSize >= 2097152) {
    message.error("File Should not be more than 2 MB !");
    return false;
  } else {
    return true;
  }
}

// Check File Extension
export function checkFileExtension(filename) {
  const extension = filename.split(".").pop();
  // console.log(extension);
  if (["jpeg", "jpg", "png"].indexOf(extension) < 0) {
    message.error("Please Select Valid File Format JPEG,JPG,PNG,PDF!");
    return false;
  } else {
    return true;
  }
}

export default File;
