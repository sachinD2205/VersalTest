import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
// import { addAllNewMarriageRegistraction } from "../../../../redux/features/newMarriageRegistrationSlice";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
// import UploadButton from "../../../FileUpload/UploadButton";

import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import URLS from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { CheckBox } from "@mui/icons-material";

const Index = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();
  const dispach = useDispatch();

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);

  // getZoneKeys
  const getZoneKeys = () => {
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        }))
      );
    });
  };

  // useEffect(() => {
  //   getZoneKeys();
  // }, []); // useEffect

  //remark

  const [modalforAprov, setmodalforAprov] = useState(false);
  const [modalforRejt, setmodalforRejt] = useState(false);

  // Add Record
  const addNewRecord = () => {
    router.push({
      // pathname: `components/SwimmingPool`,
      // pathname: `/master/bookingTimeMaster`,
      // pathname: `/swimmingPool`,
      pathname: `/sportsPortal/transaction/swimmingPool`,

      // query: {
      //   pageMode: "Add",
      // },
    });
  };
  const monthly = () => {
    router.push({
      // pathname: `components/SwimmingPool`,
      // pathname: `/master/bookingTimeMaster`,
      // pathname: `/swimmingPool`,
      pathname: `/sportsPortal/transaction/swimmingPool/month`,

      // query: {
      //   pageMode: "Add",
      // },
    });
  };

  // function checked(element1, element2) {
  //   var myLayer = document.getElementById('acceptbtn')

  //   if (element1.checked == true && element2.checked == true) {
  //     myLayer.class = 'submit'
  //     myLayer.removeAttribute('disabled')
  //   } else {
  //     myLayer.class = 'button:disabled'
  //     myLayer.setAttribute('disabled', 'disabled')
  //   }
  // }

  //checkbox

  // const [checked, setChecked] = React.useState(' ')
  // const [state, setSate] = useState(true)
  // const handleChange = (event) => {
  //   setChecked(event.target.checked)

  //   if (!setChecked(event.target.value)) {
  //     setSate(true)
  //   } else {
  //     setSate(false)
  //   }
  // }

  // const handleChange = (event) => {
  //   if (!setText(event.target.value)) {
  //     setSate(false);
  //   } else {
  //     setSate(true);
  //   }
  // };

  // const addressChange = (e) => {
  //   if (e.target.checked) {
  //     ;<Button
  //       variant="contained"
  //       color="success"
  //       onClick={() => addNewRecord()}
  //     >
  //       accept term & Condition
  //     </Button>
  //   } else {
  //     ;<Button
  //       disabled
  //       variant="contained"
  //       color="success"
  //       onClick={() => addNewRecord()}
  //     >
  //       accept term & Condition
  //     </Button>
  //   }
  // }

  //check box ch bgahu

  // function Checkbox({ handleChange, value }) {
  //   return (
  //     <FormControlLabel
  //       control={<Checkbox />}
  //       label=<Typography>
  //         <b> Accept T & C</b>
  //       </Typography>
  //       {...register('addressCheckBox')}
  //       onChange={(e) => {
  //         addressChange(e)
  //       }}
  //     />
  //   )
  // }

  // function Button({ handleClick, text, disabled }) {
  //   return (
  //     <button disabled={disabled} onClick={handleClick}>
  //       {text}
  //     </button>
  //   )
  // }

  // const [value, setValues] = useState('')
  // const [todoList, setTodoList] = useState()

  // const handleChange = (event) => {
  //   setValues(event.target.value)
  // }

  // const handleAdd = () => {
  //   setTodoList([...todoList, value])
  //   handleClear()
  // }

  // const handleClear = () => {
  //   setValues('')
  // }

  //

  // const [agree, setAgree] = useState(false)

  // const canBeSubmitted = () => {
  //   const isValid = agree // checkbox for terms

  //   if (isValid) {
  //     document.getElementById('submitButton').removeAttribute('disabled')
  //   } else {
  //     document.getElementById('submitButton').setAttribute('disabled', true)
  //   }
  //   console.log({ agree })
  // }

  // useEffect(() => canBeSubmitted())

  // const [state, setState] = useState(true)
  // // state = {
  // //   disabled: false,
  // // }

  // const handleChange = (e) => {
  //   if (e.target.value) {
  //     setState({
  //       disabled: false,
  //     })
  //   }
  // }

  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div className={styles.small}>
          {/* <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h2
                  style={{
                    marginLeft: '350px',

                    marginTop: '25px',
                    color: 'red',
                  }}
                >
                  पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८
                </h2>

                <h3
                  style={{
                    marginLeft: '400px',

                    marginTop: '25px',
                    color: 'red',
                  }}
                >
                  महाराष्ट्र विवाह कायदा , १९९८
                </h3>
              </div>
            </div> */}
          <div
            style={{
              backgroundColor: "#3EADCF",
            }}
          >
            <h1
              style={{
                marginLeft: "350px",
                marginTop: "25px",
                color: "yellow",
              }}
            >
              <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८</b>
            </h1>
            <h3
              style={{
                marginLeft: "500px",
                color: "yellow",
              }}
            >
              <b>जलतरण तलाव</b>
            </h3>
          </div>

          {/* <h1
              style={{
                marginLeft: '350px',

                marginTop: '25px',
                color: 'orange',
              }}
            >
              पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८
            </h1>
            <h3
              style={{
                marginLeft: '400px',

                marginTop: '25px',
                color: 'orange',
              }}
            >
              महाराष्ट्र विवाह कायदा , १९९८
            </h3> */}
          <h3
            style={{
              marginLeft: "500px",
              marginTop: "25px",
              color: "red",
            }}
          >
            <b></b>
          </h3>
          {/* term */}

          <div
            style={{
              marginLeft: "70px",
              marginTop: "25px",
            }}
          >
            <h4>
              नागरिकांनी जलतरण तलावावर पोहण्याच्या सरावासाठी Online पद्धतीने
              बॅचचे आरक्षण करणे कामी बुकिंग मधील महत्वाचे टप्पे खालीलप्रमाणे
              आहेत
            </h4>

            <h4>
              १. महानगरपालिकेच्या संकेतस्थळ www.pcmcindia.gov.in यावर जलतरण तलाव
              नोंदणी या लिंक वर क्लिक करणे.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              2.पोहणाऱ्या नागरिकाने अथवा पाल्याने अथवा पालकांनी आपले नोंद खाते
              तयार करणे ही प्रक्रिया एकदाच करावी लागेल.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              3. नोंद केल्यानंतर आपण लॉग इन करावे व आपला इच्छित जलतरण तलाव
              निवडून तारीख व वेळ निश्चित करुन पोहणाऱ्यांची संख्या जास्तीत जास्त
              तीन लोकांची नोंद आपण करू शकता,पोहणाऱ्या नागरिकाचा आधार नंबर या
              ठिकाणी नोंद करावा लागेल.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              4. यानंतर आपण निवडलेल्या पोहणाऱ्या यांच्या संख्येनुसार प्रत्येकी
              दहा रुपये या दराने ऑनलाइन पेमेंट करणे.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              5. पेमेंट केल्यानंतर तो सीरियल नंबर हा आपण लक्षात ठेवून आपण
              निवडलेल्या जलतरण तलावावर प्रवेशाच्या वेळेस हा नंबर संबंधित
              कर्मचाऱ्याला सांगून आपली नोंद प्रमाणित करणे.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              6. जलतरण तलाव सरावासाठी Online पद्धतीने बॅचचे आरक्षण करणे
              केल्यानंतर जलतरण तलावावर येताना आधार कार्डची झेरॉक्स प्रत आणणे
              बंधनकारक आहे.
            </h4>
          </div>
          <div
            className={styles.AcceptBtn}
            style={{
              marginRight: "20px",
            }}
          >
            {/* <FormControlLabel
                control={<Checkbox />}
                label=<Typography>
                  <b> Accept T & C</b>
                </Typography>
                {...register('addressCheckBox')}
                onChange={(e) => {
                  handleChange(e)
                }}
              /> */}

            {/* <Button
                handleClick={handleAdd}
                disabled={!value}
                text="accept term & Condition"
                variant="contained"
                color="primary"
                onClick={() => addNewRecord()}
              /> */}

            {/* <Input
                type="checkbox"
                name="agree"
                id="agree"
                onClick={(e) => setAgree(e.target.checked)}
              />
              <label> I agree.</label>
              <br />
              <Button
                type="submit"
                variant="contained"
                color="success"
                id="submitButton"
              >
                Submit
              </Button> */}

            {/* <FormControlLabel
                control={<Checkbox />}
                label="  Accept T & C"
                onChange={handleChange}
              /> */}

            <Button
              variant="contained"
              color="success"
              onClick={() => addNewRecord()}
              // disabled={state}
            >
              Daily Booking
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => monthly()}
              // disabled={state}
            >
              Monthly Booking
            </Button>
          </div>

          {/* <div className={styles.addbtn}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => addNewRecord()}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </div> */}
        </div>
      </Paper>
    </>
  );
};

export default Index;
