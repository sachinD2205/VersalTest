import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
} from "@mui/material";
import * as yup from "yup";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState();

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 100,
    },
    {
      headerName: "Department Name",
      field: "departmentName",
      width: 140,
    },
    {
      headerName: "Task/Service Name",
      field: "taskServiceName",
      width: 160,
    },
    {
      headerName: "Employee Name(Transfer From)",
      field: "employeeNameTransferFrom",
      width: 200,
    },
    {
      headerName: "Employee Name(Transfer To)",
      field: "employeeNameTransferTo",
      width: 250,
    },
    {
      headerName: "From Duration",
      field: "fromDuration",
      width: 150,
    },
    {
      headerName: "To Duration",
      field: "toDuration",
      width: 150,
    },
    {
      headerName: "Reason for Task Transfer",
      field: "reasonForTaskTransfer",
      width: 170,
    },
    {
      headerName: "Remarks",
      field: "remarks",
      width: 140,
    },
    {
      headerName: "Attach file",
      field: "attachFile",
      width: 130,
    },

    {
      field: "Action",
      headerName: "Action",
      width: 100,

      renderCell: (record) => {
        return (
          <>
            <VisibilityIcon />
            <EditIcon />
            <DeleteIcon />
          </>
        );
      },
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  ];

  return (
    <>
      <BasicLayout>
        {/* <Card>


          <Row>
            <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

            <Col>
              <Button
                type="primary"
                onClick={() =>
                  router.push(`/LegalCase/transaction/taskTransfer/view`)
                }
              >
                Add New
              </Button>
            </Col>
          </Row>
        </Card> */}

        <Card>
          <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
            <Grid item xs={5}></Grid>
            <Grid item xs={5.7}>
              <h2>Task Transfer</h2>
            </Grid>
            <Grid item>
              <div style={{ display: "flex", justifyContent: "right" }}>
                <Button
                  // type="primary"
                  variant="contained"
                  onClick={() =>
                    router.push(`/LegalCase/transaction/taskTransfer/view`)
                  }
                >
                  Add New
                </Button>
              </div>
            </Grid>
          </Grid>
        </Card>
        <Card style={{ marginTop: 5 }}>
          <div>
            <Paper component={Box} sx={{ height: 300, width: 1300 }}>
              <DataGrid
                //autoPageSize
                // autoHeight
                mt={5}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                // checkboxSelection
              />
            </Paper>
            {/* <Table
              bordered
              columns={cols}
              dataSource={dataSource}
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              scroll={{ y: 450, x: 1900 }}
            /> */}

            {/* <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{
                  y: 300,
                }}
              /> */}
          </div>
        </Card>
      </BasicLayout>
    </>
  );
};

export default Index;
