import { DataGrid, gridClasses } from "@mui/x-data-grid";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/newsRotationManagementSystem/[newsRotationManagementSystem].module.css";

export default function HistoryComponent({ tableData }) {
  if (tableData === null) {
    return null;
  }
  // console.log("NRMS: tabledata", tableData);

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="id" />,
      width: 70,
      type: "number",
    },
    {
      field: "newsPublishId",
      headerName: <FormattedLabel id="newsPublishID" />,
      width: 150,
      type: "number",
    },
    {
      field: "department",
      headerName: <FormattedLabel id="department" />,
      width: 150,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.value !== null && params.value !== "" ? (
              params.value
            ) : (
              <FormattedLabel id="noRemarkFound" />
            )}
          </>
        );
      },
    },
    {
      field: "actionDate",
      headerName: <FormattedLabel id="statusUpdateDate" />,
      width: 150,
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
    },
  ];

  return (
    <>
      <div className={styles.detailsTABLE}>
        <h2
          className={styles.h1TagTABLE}
          style={{
            fontSize: "20",
            color: "black",
            marginTop: "7px",
          }}
        >
          <FormattedLabel id="applicationHis" />
        </h2>
      </div>
      <br />
      <DataGrid
        sx={{
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 2,
          overflowY: "scroll",

          [`& .${gridClasses.cell}`]: {
            py: 1,
          },

          "& .MuiDataGrid-virtualScrollerContent": {},
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#076ee6",
            color: "white",
          },

          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        density="compact"
        autoHeight
        scrollbarSize={17}
        rows={tableData}
        columns={columns}
        pageSize={10}
        pagination
        paginationMode="server"
        rowsPerPageOptions={[10]}
        getRowHeight={() => "auto"}
      />
    </>
  );
}
