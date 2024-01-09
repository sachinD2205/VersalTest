import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import styles from "../../../styles/LegalCase_Styles/upload.module.css";

const FileTable = (props) => {
  // View
  return (
    <div className={styles.attachFile}>
      <DataGrid
        getRowId={(row) => row.srNo}
        autoHeight
        disableSelectionOnClick
        rows={props.rows}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};
export default FileTable;
