import React from "react";

const CheckFileSize = (fileSize) => {
  if (fileSize >= 2097152) {
    message.error("File Should not be more than 2 MB !");
    return false;
  } else {
    return true;
  }
};
export default CheckFileSize;
