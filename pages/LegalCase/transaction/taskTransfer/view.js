import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { yupResolver } from "@hookform/resolvers/yup";
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

import { Collapse } from "@mui/material";
import Stack from "@mui/material/Stack";
// import { Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const View = () => {
  const { Panel } = Collapse;
  const router = useRouter();
  const [fromDuration, setFromDuration] = React.useState(null);
  const [value1, setValue1] = React.useState(null);
  const [toDuration, setToDuration] = React.useState(null);

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  return (
    <>
      <BasicLayout>
        {/* <Card>
          <Row>
            <Col xl={10} lg={10} md={9} sm={8}>
              {" "}
            </Col>
            <Col>
              <h2>Task Transfer</h2>
            </Col>
          </Row>
        </Card> */}

        <Card>
          <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
            <Grid item xs={5}></Grid>
            <Grid item xs={5.7}>
              <h2>Task Transfer</h2>
            </Grid>
          </Grid>
        </Card>

        <Card style={{ marginTop: 10, height: 400 }}>
          {/* <form layout="vartical"> */}
          <Grid container style={{ marginTop: 40 }}>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={2}>
              <FormControl variant="standard" sx={{ minWidth: 190 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Department Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={age}
                  // onChange={handleChange}
                  label="Department Name"
                >
                  {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                  <MenuItem value={"DepartmentName"}>Department Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <FormControl variant="standard" sx={{ minWidth: 190 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Task/Service Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={age}
                  // onChange={handleChange}
                  label="Task/Service Name"
                >
                  {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                  <MenuItem value={"service1"}>Service 1</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <FormControl variant="standard" sx={{ minWidth: 190 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Employee Name (Transfer From)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={age}
                  // onChange={handleChange}
                  label="Employee Name (Transfer From)"
                >
                  {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                  <MenuItem value={"empName"}>Emp Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <FormControl variant="standard" sx={{ minWidth: 190 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Employee Name (Transfer To)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={age}
                  // onChange={handleChange}
                  label="Employee Name (Transfer To)"
                >
                  {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                  <MenuItem value={"empName"}>Emp Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 40 }}>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Duration"
                  // InputProps={{ style: { fontSize: 5 } }}
                  // InputLabelProps={{ style: { fontSize: 50 } }}
                  // value={value}
                  value={fromDuration}
                  onChange={(newValue) => {
                    setFromDuration(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      // InputLabelProps={{ style: { fontSize: 13 } }}
                      InputProps={{ style: { fontSize: 20 } }}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              {/* <Stack component="form" noValidate>
                    <TextField
                      size="small"
                      id="date"
                      label="From Duration"
                      type="date"
                      //   defaultValue="2017-05-24"
                      //   sx={{ width: 200 }}
                      //   style={{ height: 5 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Stack> */}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Duration"
                  // InputProps={{ style: { fontSize: 5 } }}
                  // InputLabelProps={{ style: { fontSize: 50 } }}
                  value={toDuration}
                  onChange={(newValue) => {
                    setToDuration(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      // InputLabelProps={{ style: { fontSize: 13 } }}
                      InputProps={{ style: { fontSize: 20 } }}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              {/* <Stack component="form" noValidate>
                    <TextField
                      size="small"
                      id="date"
                      label="To Duration"
                      type="date"
                      //   defaultValue="2017-05-24"
                      //   sx={{ width: 200 }}
                      //   style={{ height: 5 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Stack> */}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <TextField
                //// required
                id="standard-basic"
                label="Reason for Task Transfer"
                variant="standard"
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <FormControl variant="standard" sx={{ minWidth: 190 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Counter No.
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={age}
                  // onChange={handleChange}
                  label="Counter No."
                >
                  {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                  <MenuItem value={"counterNumber"}>Counter No1</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 40 }}>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={2}>
              <TextField
                //// required
                id="standard-basic"
                label="Remarks"
                variant="standard"
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              {/* <Form.Item label="Attached file"> */}
              <label>Attached file</label>
              <TextField
                //// required
                id="standard-basic"
                //                     label="Upload
                // Documents/Order "
                variant="standard"
                type="file"
                InputProps={{ style: { fontSize: 11 } }}
                InputLabelProps={{ style: { fontSize: 13 } }}
              />
            </Grid>
          </Grid>

          {/* <Row style={{ marginTop: 20 }}>
              <Col xl={6} lg={6} md={6} sm={8} xs={24}>
                <Form.Item>
                  <TextField
                    //// required
                    id="standard-basic"
                    label="Case Status."
                    variant="standard"
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={3} md={3} sm={1}></Col>
              <Col xl={4} lg={6} md={6} sm={8} xs={10}>
                <Form.Item>
                  <TextField
                    size="small"
                    id="date"
                    label="Bill Date"
                    type="date"
                    //   defaultValue="2017-05-24"
                    //   sx={{ width: 200 }}
                    //   style={{ height: 5 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={3} md={3} sm={1}></Col>
              <Col xl={4} lg={6} md={6} sm={8} xs={10}>
                <Form.Item>
                  <FormControl variant="standard" sx={{ minWidth: 190 }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Bill Forwarded To
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={age}
                      // onChange={handleChange}
                      label="Transfer From Advocate"
                    >
                      <MenuItem value={"DepartmentName"}>
                        Bill Forwarded To
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Form.Item>
              </Col>
            </Row> */}

          {/* RowButton */}
          {/* <Row style={{ marginTop: 30 }}>
              <Col xl={9} lg={6} md={6}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button htmlType="submit">Save</Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                // onClick={resetForm}
                >
                  Reset
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={() => {
                    router.push(`/LegalCase/transaction/taskTransfer/`);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row> */}

          <Grid container style={{ marginTop: 50 }}>
            <Grid item xs={4}></Grid>
            <Grid item xs={1}>
              <Button variant="outlined" type="submit">
                Save
              </Button>
            </Grid>

            <Grid item xs={0.5}></Grid>

            <Grid item xs={1}>
              <Button variant="outlined">Reset</Button>
            </Grid>
            <Grid item xs={0.5}></Grid>

            <Grid item xs={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  router.push(`/LegalCase/transaction/taskTransfer/`);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          {/* </form> */}
        </Card>
      </BasicLayout>
    </>
  );
};

export default View;
