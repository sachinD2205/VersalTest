// import { Paper, Typography } from "@mui/material";
import React from "react";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
// import URLS from "../../../URLS/urls";
// import axios from "axios";

const FileViewer = (props) => {
  //   function getFIleData() {
  //     axios
  //       .get(`${URLS.API_file}/preview?filePath=${props.filePath}`)
  //       .then((r) => {
  //         return r.data;
  //       });
  //   }
  const docs = [{ uri: "" }];
  //   alert("GG");
  return (
    <>
      {/* <div>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "100px",
            marginRight: "100px",
            marginTop: "50px",
            marginBottom: "50px",
            padding: 1,
          }}
        >
          <Typography>File Viewer</Typography>
          <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} />
        </Paper>
      </div> */}
    </>
  );
};
export default FileViewer;
