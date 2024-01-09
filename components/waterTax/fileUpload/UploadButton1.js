import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import style from "./uploadButtonHawker.module.css";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  // view
  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && (
          <>
            <span>{<FormattedLabel id="fileNotUploaded" />}</span>
          </>
        )}
        {filePath ? (
          <a
            href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
            target="__blank"
          >
            <Button variant="contained" color="primary">
              {<FormattedLabel id="view" />}
            </Button>
          </a>
        ) : (
          <h1></h1>
        )}
      </label>
    </div>
  );
};
export default UploadButton;
