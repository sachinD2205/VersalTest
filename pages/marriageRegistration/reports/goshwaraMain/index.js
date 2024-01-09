import { Button, FormControl, Paper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import styles from "./goshwara.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useSelector } from "react-redux";
const GoshwaraMain = () => {
  const language = useSelector((state) => state?.labels.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState();

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  let user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (watch("fromDate") && watch("toDate")) {
      console.log("Inside", watch("fromDate"), watch("toDate"));

      const finalBody = {
        fromDate: watch("fromDate"),
        toDate: watch("toDate"),
      };

      console.log("Search Body", finalBody);
      axios
        .post(`${urls.MR}/reports/ghoshwara1`, finalBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("inside1", res.data);
          setData(res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [watch("fromDate"), watch("toDate")]);

  return (
    <>
      <Paper
        sx={{
          padding: "5vh",
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div>
          <center>
            <h1>Goshwara Part-1</h1>
          </center>
        </div>
        <div className={styles.searchFilter}>
          <FormControl sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 14 }}>From Date</span>}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
          <FormControl sx={{ marginTop: 0, marginLeft: "10vh" }}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 14 }}>To Date </span>}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
        </div>
        <div style={{ padding: 10 }}>
          {data && (
            <Button
              variant="contained"
              color="primary"
              style={{ float: "right" }}
              onClick={handlePrint}
            >
              print
            </Button>
          )}
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
          >
            back To home
          </Button>
        </div>
        <br />
        <div>
          <ComponentToPrint ref={componentRef} data={data} />
        </div>
      </Paper>
    </>
  );
};

class ComponentToPrint extends React.Component {
  onClickHandler = (item) => {
    console.log("111 ", item);
  };

  render() {
    return (
      <>
        <div>
          <Paper>
            <table className={styles.report}>
              <thead className={styles.head}>
                <tr>
                  <th colSpan={8}>Goshwara Part-1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan={1}>Sr.No</th>
                  <th colSpan={1}>Zone</th>
                  <th colSpan={1}>Ward</th>
                  <th colSpan={1}>Marriage Registration No</th>
                  <th colSpan={1}>Marriage Date</th>
                  <th colSpan={1}>Groom Name</th>
                  <th colSpan={1}>Bride Name</th>
                </tr>
                {this.props.data &&
                  this.props.data.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a>{index + 1}</a>
                      </td>
                      <td>{item.zoneName}</td>
                      <td>{item.wardName}</td>
                      <td>{item.registrationNumber}</td>
                      <td>{item.marriageDate}</td>
                      <td>{item.gFName + " " + item.gLName}</td>
                      <td>{item.bFName + " " + item.bLName}</td>
                      <td>
                        <Button
                          variant="contained"
                          color="primary"
                          type="primary"
                          style={{ float: "right" }}
                          onClick={() => this.onClickHandler(item)}
                        >
                          show
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Paper>
        </div>
      </>
    );
  }
}

export default GoshwaraMain;
