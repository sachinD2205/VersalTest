import React, { useState } from "react";
// import styles from "../scheduleSiteVisite/scheduleSiteVisite.module.css";
import styles from "../../../../styles/skysignstyles/scheduleSiteVisite.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from './schema'

import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
// import BasicLayout from '../../../../containers/Layout/BasicLayout'
import { useRouter } from "next/router";

const ScheduleSiteVisite = () => {
  const {
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    // (schema),
    mode: "onChange",
  });

  const [modalforAppoitment, setmodalforAppoitment] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className={styles.model}>
        <Modal
          open={modalforAppoitment}
          //onClose={clerkApproved}
          onCancel={() => {
            setmodalforAppoitment(false);
          }}
        >
          <div className={styles.box}>
            <div className={styles.titlemodelT}>
              <Typography
                className={styles.titleOne}
                variant="h6"
                component="h2"
                color="#f7f8fa"
              >
                List Of All Appointments
              </Typography>
              <IconButton>
                <CloseIcon onClick={() => router.push(`/skySignLicense`)} />
              </IconButton>
            </div>
            <div className={styles.row}>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 120 }}
                  error={!!errors.DocumentsList}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Select Resource *
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 200 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Select Resource  *"
                      >
                        {/* {Service &&
                                    Service.map((gender, index) => (
                                      <MenuItem
                                        key={index}
                                        value={gender.gender}
                                      >
                                        {gender.gender}
                                      </MenuItem>
                                    ))} */}

                        <MenuItem value="">
                          <em>Choose a Resource </em>
                        </MenuItem>

                        <MenuItem value={" Resource1"}> Zone A</MenuItem>
                        <MenuItem value={"Resource2"}>Zone B</MenuItem>
                      </Select>
                    )}
                    name="Resource"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.Resource ? errors.Resource.message : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className={styles.btndate}>
                <FormControl
                  style={{
                    width: 200,
                    marginTop: 10,
                    // maxWidth: "40%",
                    // backgroundColor: "red",
                  }}
                  error={!!errors.selectDate}
                >
                  <Controller
                    control={control}
                    name="selectDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>Select Date *</span>
                          }
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
                  <FormHelperText>
                    {errors?.selectDate ? errors.selectDate.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div className={styles.btnSerch}>
                <Button
                  variant="outlined"
                  endIcon={<FindInPageIcon />}

                  // onClick={viewApp}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className={styles.btnappr}>
              <Button
                variant="contained"
                color="success"
                endIcon={<CancelIcon />}
                // type="primary"
                onClick={() => router.push(`/skySignLicense`)}
              >
                Exit
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div className={styles.slot}>
          <Button
            variant="outlined"
            endIcon={<AccessAlarmsIcon />}
            onClick={() => {
              setmodalforAppoitment(true);
            }}
          >
            Available Slot
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default ScheduleSiteVisite;
