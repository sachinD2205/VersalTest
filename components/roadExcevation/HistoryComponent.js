import { DataGrid, gridClasses } from "@mui/x-data-grid";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/roadExcavation/[roadExcavationForm].module.css";
import moment from "moment";

export default function HistoryComponent({ tableData }) {
  if (tableData === null) {
    return null;
  }
  console.log("RE: tabledata", tableData);

  const columns = [
    // {
    //   field: "id",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 70,
    //   type: "number",
    // },
    {
      field: "senderName",
      headerName: <FormattedLabel id="senderName" />,
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
      field: "sentDate",
      headerName: <FormattedLabel id="sentDate" />,
      width: 150,
      renderCell: (params) => {
        return <>{new Date(params.value).toLocaleDateString("en-GB")}</>;
      },
    },
    {
      field: "sentTime",
      headerName: <FormattedLabel id="sentTime" />,
      width: 150,
      renderCell: (params) => {
        // function tConvert(time) {
        //   // Check correct time format and split into components
        //   time = time
        //     .toString()
        //     .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        //   if (time.length > 1) {
        //     // If time format correct
        //     time = time.slice(1); // Remove full string match value
        //     time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        //     time[0] = +time[0] % 12 || 12; // Adjust hours
        //   }
        //   return time.join(""); // return adjusted time or original string
        // }
        // return <>{tConvert(params.value)}</>;
        return moment(params.value, 'HH:mm:ss').format('h:mm A')
      },
    },
    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
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
          <FormattedLabel id="applicationHistory" />
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
