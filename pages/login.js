import React from "react"
import { useRef, useState, useEffect } from "react"
import styles from "../styles/[login].module.css"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import {
  login,
  setMenu,
  setUsersDepartmentDashboardData,
  setUsersCitizenDashboardData,
  logout,
} from "../features/userSlice"
import backEndApiMenu from "../containers/Layout/backEndApiMenu"
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Grid,
  Link,
  Avatar,
  Modal,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import PropTypes from "prop-types"
import axios from "axios"
// import Image from "next/image";
import { useForm } from "react-hook-form"
import CitizenLogin from "../containers/Layout/components/CitizenLogin"
import DepartmentLogin from "../containers/Layout/components/DepartmentLogin"
import CfcLogin from "../containers/Layout/components/CfcLogin"
import AppBarComponent from "../containers/Layout/components/AppBarComponent"
import { toast } from "react-toastify"
import { mountLabels, language } from "../features/labelSlice"
// import { passwordUpdater } from "../features/isPasswordChangedSlice";
import labels from "../containers/reuseableComponents/newLabels"
import loginLabels from "../containers/reuseableComponents/labels/common/loginLabels"
import urls from "../URLS/urls"
import Head from "next/head"
import sweetAlert from "sweetalert"
import { useGetToken } from "../containers/reuseableComponents/CustomHooks"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [user, setUser] = useState("")
  const [pwd, setPwd] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [showOTPCitizen, setShowOTPCitizen] = useState(false)
  const [otp, setOtp] = useState(null)
  const [otpCitizen, setOtpCitizen] = useState(null)
  const [isVerified, setIsVerified] = useState(true)
  const [isVerifiedCitizen, setIsVerifiedCitizen] = useState(true)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isOtpVerifiedCitizen, setIsOtpVerifiedCitizen] = useState(false)
  const [countDown, setCountDown] = useState(0)
  const [cfcUser, setCfcUser] = useState("")
  const [cfcPwd, setCfcPwd] = useState("")
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState(false)
  // const [LoginForm] = Form.useForm();
  const router = useRouter()
  // const [activeTabKey2, setActiveTabKey2] = useState("citizen");

  const [value, setValue] = useState(0)
  const [checked, setChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [disableLoginButton, setDisableLoginButton] = useState(false)
  const [loginData, setLoginData] = useState()

  const [showTermsCondModel, setShowTermsCondModel] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const _language = useSelector((state) => {
    return state.labels.language
  })

  const [checkedLanguage, setCheckedLanguage] = useState(
    _language == "en" ? true : false
  )
  const dispatch = useDispatch()

  const handleChangeLanguage = (e) => {
    // setCheckedLanguage(e.target.checked);
    e == "ENG" ? dispatch(language("en")) : dispatch(language("mr"))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //    resolver: yupResolver(schema),
  })

  // useEffect(() => {
  //   dispatch(mountLabels(labels))
  // }, [])

  const onSubmit = (data) => console.log("entered data", data)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleRememberMe = (event) => {
    setChecked(event.target.checked)
  }

  const handleForgotPasswordClick = (e) => {
    console.log("eeee", e)
    router.push({
      pathname: "/ForgotPassword",
      query: { screen: e },
    })
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    router.push("/Register")
  }

  const checkLoginState = useSelector((state) => {
    return state.user.isLoggedIn
  })

  // useEffect(() => {
  //   // redirect to home if already logged in
  //   if (checkLoginState) {
  //     router.push("/")
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id]
    } else {
      return loginLabels["mr"][id]
    }
  }

  const onFinish = (values) => {
    setDisableLoginButton(true)
    const body = {
      username: values.Username,
      password: values.password,
    }
    axios
      // .post(`${urls.CFCURL}/transaction/citizen/login`, body)
      .post(`${urls.AuthURL}/citizen/login`, body)
      .then((r) => {
        if (r.status == 200) {
          console.log("response of citizen login", r)
          setLoginData(r.data)
          if (r.data.isOtpRequired == true) {
            setShowOTPCitizen(true)
          } else {
            setShowOTPCitizen(false)
            dispatch(login(r.data))
            dispatch(setMenu(backEndApiMenu))
            dispatch(mountLabels(labels))
            dispatch(setUsersCitizenDashboardData(r.data))
            dispatch(setMenu(r.data.menuCodes))
            localStorage.setItem("loggedInUser", "citizenUser")

            setShowTermsCondModel(true)

            // router.push("/dashboardV3");
          }
        } else {
          console.log("Ashish", r.data)
          message.error(r.data)
          setDisableLoginButton(false)
          //    setDisableLoginButton(false);
        }
      })
      .catch((err) => {
        setDisableLoginButton(false)
        console.log("Ashish", err?.response?.data)
        toast(err?.response?.data?.message, {
          type: "error",
        })
      })

    // if (values.Username === "Admin" && values.password === "12345") {
    //   dispatch(login(userDetails));
    //   dispatch(setMenu(backEndApiMenu));
    //   router.push("/ResetPassword");
    //   router.push("/Verification");
    //   router.push("/ResetPassword");
    //   router.push("/ForgotPassword");
    //   router.push("/dashboard");
    //   router.push("/DepartmentDashboard")
    // }
  }

  const onDepartmentLogin = (e) => {
    e.preventDefault()
    setDisableLoginButton(true)
    const body = {
      userName: user,
      password: pwd,
    }

    axios
      .post(`${urls.AuthURL}/signinNew`, body)
      .then((r) => {
        if (r.status == 200) {
          // console.log('res dep login',r);
          // setLoading(true);

          // router.push("/DepartmentDashboard");
          setDisableLoginButton(false)
          dispatch(login(r.data))
          dispatch(setMenu(backEndApiMenu))
          dispatch(setUsersDepartmentDashboardData(r.data))
          dispatch(mountLabels(labels))
          localStorage.setItem(
            "isPasswordChanged",
            r.data.userDao.isPasswordChanged
          )
          // dispatch(passwordUpdater(r.data.userDao.isPasswordChanged))
          localStorage.setItem("loggedInUser", "departmentUser")
          setShowOTP(true)
          setIsVerified(false)
          setShowTermsCondModel(true)
          // router.push("/DepartmentDashboard/dashboardV1")
        }
      })
      .catch((err) => {
        console.log("8888", err?.response?.data?.message)
        // sweetAlert(
        //   // err?.response?.data?.message,
        //   "Invalid Password !!",
        //   // "Try again with different E-mail or userName",
        //   "warning"
        // );
        setDisableLoginButton(false)
        // toast("Login Failed ! Please Try Again !", {
        //   type: "error",
        // });
        toast(err?.response?.data?.message, {
          type: "error",
        })
      })
  }

  const onCfcUserLogin = (e) => {
    setLoading(true)
    e.preventDefault()
    setDisableLoginButton(true)
    const body = {
      userName: cfcUser,
      password: cfcPwd,
    }

    axios
      .post(`${urls.AuthURL}/signinNew`, body)
      .then((r) => {
        if (r.status == 200) {
          if (r.data.userDao.cfcUser) {
            dispatch(login(r.data))
            dispatch(setMenu(backEndApiMenu))
            dispatch(setUsersDepartmentDashboardData(r.data))
            dispatch(mountLabels(labels))
            router.push("/CFC_Dashboard")
            // router.push("/CFC_Dashboard/v2");
            setDisableLoginButton(false)
            console.log("cfc login response", r)
            localStorage.setItem("loggedInUser", "cfcUser")
            setLoading(false)
          } else {
            toast("Not CFC user, Please login with CFC user credentials!", {
              type: "error",
            })
          }
        }

        // if (r.status == 200) {
        //   dispatch(login(r.data));
        //   dispatch(setMenu(backEndApiMenu));
        //   dispatch(setUsersDepartmentDashboardData(r.data));
        //   dispatch(mountLabels(labels));
        //   router.push("/CFC_Dashboard");
        //   setDisableLoginButton(false);
        //   console.log("cfc login response", r);
        //   localStorage.setItem("loggedInUser", "cfcUser");
        //   setLoading(false);
        // }
      })
      .catch((err) => {
        console.log("errw", err)
        setDisableLoginButton(false)
        setLoading(false)
        toast(err?.response?.data?.message, {
          type: "error",
        })
      })
  }

  const handleVerifyOtp = () => {
    console.log("123", otp)
    setIsOtpVerified(true)
  }

  const handleVerifyOtpCitizen = () => {
    console.log("citizenuser", loginData)
    console.log("citizenotp", otpCitizen)

    console.log("123", otpCitizen)
    const body = {
      username: loginData?.username,
      otp: otpCitizen,
    }
    axios
      .post(`${urls.AuthURL}/citizen/verifyOtp`, body)

      .then((r) => {
        if (r.status == 200) {
          dispatch(login(loginData))
          dispatch(setMenu(backEndApiMenu))
          dispatch(mountLabels(labels))
          dispatch(setUsersCitizenDashboardData(loginData))
          dispatch(setMenu(loginData.menuCodes))
          localStorage.setItem("loggedInUser", "citizenUser")
          setIsOtpVerifiedCitizen(true)
        } else if (r.status == 401) {
          toast("Invalid OTP Please try Again", {
            type: "error",
          })
        }
      })
      .catch((err) => {
        setCountDown(countDown + 1)
        if (countDown == 2) {
          setLoginData()
          setShowOTPCitizen(false)
          setDisableLoginButton(false)
        }
        console.log("errw", err)
        // setDisableLoginButton(true);
        setLoading(false)
        // setIsOtpVerifiedCitizen(false);

        toast("Invalid OTP Please try Again !", {
          type: "error",
        })
      })
  }
  const handleSsoLogin = () => {
    console.log("sso")
    router.push({
      pathname: "/adminLogin",
    })
  }

  useEffect(() => {
    console.log(
      "env from local",
      process.env.NEXT_PUBLIC_BACK_END_PROBITY_POINT
    )
  }, [])

  const handleAgreementChange = () => {
    setAgreed(!agreed)
  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW IMPLEMENTATION BY ANWAR ANSARI
  const userToken = useGetToken()
  const currentUserType = localStorage.getItem("loggedInUser")

  const handleNewLoginHistoryApiFunc = () => {
    setShowTermsCondModel(false)

    axios
      .post(
        `${urls.CFCURL}/declaration/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (currentUserType === "departmentUser") {
          router.push("/DepartmentDashboard/dashboardV1")
        } else {
          router.push("/dashboard")
        }
      })
      .catch((error) => {
        console.log("error: ", error)
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
          closeOnClickOutside: false,
        }).then((will) => {
          setShowTermsCondModel(false)
          dispatch(language("en"))
          dispatch(logout())
          dispatch(setUsersDepartmentDashboardData(null))
          dispatch(setUsersCitizenDashboardData(null))
          localStorage.setItem("loggedInUser", null)
          router.push("/login")
        })
      })
  }

  return (
    <>
      <Head>
        {/* <title>{findLoginLabel('pcmcTitle')}</title> */}
        <title>PCMC - Login</title>
      </Head>

      <form onSubmit={handleSubmit(onFinish)}>
        <Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box style={{ width: "100%" }}>
                  <AppBarComponent />
                  <div
                    style={{
                      // backgroundImage: `url(/bgImage.jpeg)`,
                      backgroundImage: `url('/pcmcDashboardV1BG.jpg')`,
                      // height: '100%',
                      minHeight: "90vh",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minwidth: "105%",
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                      // margin: '-3vw -2vw -2vw -2vw'
                    }}
                  >
                    <Box
                      p={2}
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "5%",
                          right: "1%",
                          // width: '100%',
                          // display: 'flex',
                          // justifyContent: 'end',
                        }}
                      >
                        {_language == "en" ? (
                          <Avatar
                            onClick={() => {
                              handleChangeLanguage("MAR")
                            }}
                            sx={{
                              width: "35px",
                              height: "35px",
                              bgcolor: "#3B90DB",
                              cursor: "pointer",
                              fontSize: "15px",
                            }}
                          >
                            म
                          </Avatar>
                        ) : (
                          <Avatar
                            onClick={() => {
                              handleChangeLanguage("ENG")
                            }}
                            sx={{
                              width: "35px",
                              height: "35px",

                              bgcolor: "#3B90DB",
                              cursor: "pointer",
                              fontSize: "15px",
                            }}
                          >
                            ENG
                          </Avatar>
                        )}
                      </Box>
                      <Typography
                        sx={{ typography: { sm: "h6", xs: "subtitle1" } }}
                      >
                        {findLoginLabel("welcomeTo")}
                      </Typography>
                      <Typography
                        sx={{ typography: { sm: "h5", xs: "subtitle1" } }}
                      >
                        {findLoginLabel("pcmcNameNew")}
                      </Typography>
                    </Box>

                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          sx={{
                            color: "#000000",
                            backgroundColor: "#FFFFFF",
                            "& .Mui-selected": {
                              color: "#FFFFFF !important",
                              backgroundColor: "#3B90DB",
                            },
                          }}
                          TabIndicatorProps={{
                            style: {
                              display: "none",
                            },
                          }}
                          variant="fullWidth"
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                        >
                          <Tab
                            label={findLoginLabel("citizen")}
                            {...a11yProps(0)}
                          />
                          <Tab
                            label={findLoginLabel("department")}
                            {...a11yProps(1)}
                          />
                          <Tab
                            label={findLoginLabel("cfcUser")}
                            {...a11yProps(2)}
                          />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        <Box
                          sx={{
                            paddingX: "20%",
                          }}
                        >
                          <CitizenLogin
                            showOTPCitizen={showOTPCitizen}
                            setOtpCitizen={setOtpCitizen}
                            isVerifiedCitizen={isVerifiedCitizen}
                            isOtpVerifiedCitizen={isOtpVerifiedCitizen}
                            handleVerifyOtpCitizen={handleVerifyOtpCitizen}
                            register={register}
                            errors={errors}
                            handleClickShowPassword={handleClickShowPassword}
                            showPassword={showPassword}
                            handleRememberMe={handleRememberMe}
                            handleForgotPasswordClick={
                              handleForgotPasswordClick
                            }
                            handleRegisterClick={handleRegisterClick}
                            disableLoginButton={disableLoginButton}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <Box
                          sx={{
                            paddingX: "20%",
                          }}
                        >
                          <DepartmentLogin
                            onDepartmentLogin={onDepartmentLogin}
                            setUser={setUser}
                            setPwd={setPwd}
                            showOTP={showOTP}
                            setOtp={setOtp}
                            isVerified={isVerified}
                            handleVerifyOtp={handleVerifyOtp}
                            handleClickShowPassword={handleClickShowPassword}
                            showPassword={showPassword}
                            // handleRegisterClick={handleRegisterClick}
                            isOtpVerified={isOtpVerified}
                            handleForgotPasswordClick={
                              handleForgotPasswordClick
                            }
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <Box
                          sx={{
                            paddingX: "20%",
                          }}
                        >
                          <CfcLogin
                            handleClickShowPassword={handleClickShowPassword}
                            showPassword={showPassword}
                            onCfcUserLogin={onCfcUserLogin}
                            setCfcUser={setCfcUser}
                            setCfcPwd={setCfcPwd}
                            handleForgotPasswordClick={
                              handleForgotPasswordClick
                            }
                          />
                        </Box>
                      </TabPanel>
                    </Box>
                  </div>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={0}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              display={{
                xs: "none",
                sm: "none",
                md: "block",
                lg: "block",
                xl: "block",
              }}

              // style={{
              //   "@media (min-width: 120px)": {
              //     backgroundColor: "red",
              //   },
              // }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: "#B5B5B5",
                }}
              >
                <Box>
                  <Link
                    href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                    target="_blank"
                  >
                    {findLoginLabel("googleMarthiTrans")}
                  </Link>
                </Box>
                {/* <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Marathi</Typography>
                <Switch
                  checked={checkedLanguage}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
                />
                <Typography variant="subtitle2">English</Typography>
              </Box> */}
              </Box>
              <Box>
                <img
                  className={styles.bgImg}
                  src="/sign.jpg"
                  alt="PP"
                  width="100%"
                  // height="600vh"
                  height="800vh"
                  layout="responsive"
                />
              </Box>
              <Box>
                <div className={styles.right}>
                  <div className={styles.footer}>
                    <h4>{findLoginLabel("footer")}</h4>
                  </div>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* NEWLY ADD TERMS AND CONDITION MODEL BY ANWAR ANSARI */}

        <>
          <Modal
            open={showTermsCondModel}
            sx={{
              // padding: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                width: "90%",
                minHeight: "50vh", // Adjust the height as needed
                backgroundImage: `url('/pcmcDashboardV1BG.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "1px solid black",
                borderRadius: 5,
                padding: 1,
              }}
            >
              <form
                style={{
                  height: "500px",
                  overflowY: "auto",
                  width: "98%",
                  margin: 5,
                  padding: 5,
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    // letterSpacing: "0.2px",
                  }}
                >
                  I hereby agree that I will be undertaking Beta Testing of the
                  modules assigned to me and I will strictly comply with the
                  below-mentioned Terms & Conditions:
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    // letterSpacing: "0.2px",
                  }}
                >
                  मी याबाबत सहमत आहे की, मी मला नियुक्त केलेल्या संगणक
                  प्रणालींचे बिटा चाचणी (Beta Testing) करताना मी खाली नमूद
                  केलेल्या अटी आणि नियमांचे काटेकोरपणे पालन करीन:
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    1. Data Confidentiality:
                  </span>{" "}
                  I agree to keep all provided information confidential and not
                  share it with any unauthorized third party without the written
                  consent of Pimpri Chinchwad Municipal Corporation (PCMC) /
                  Pimpri Chinchwad Smart City Limited (PCSCL).
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    १. डेटा गोपनीयता:
                  </span>
                  मी सर्व प्रदान केलेली माहिती गोपनीय ठेवण्यास आणि पिंपरी चिंचवड
                  महानगरपालिका (PCMC) / पिंपरी चिंचवड स्मार्ट सिटी लिमिटेड
                  (PCSCL) च्या लेखी संमतीशिवाय ती कोणत्याही अनधिकृत तृतीय पक्षास
                  / व्यक्तिस / संस्थेस सामायिक / वितरीत न करण्यास सहमत आहे.
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    2. Authorized Usage:
                  </span>{" "}
                  The data in the module is intended for testing purposes of the
                  PCMC / PCSCL only and may not be shared, sold, or otherwise
                  distributed without explicit written consent of the PCMC /
                  PCSCL.
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    २. अधिकृत वापर:
                  </span>{" "}
                  मॉड्यूलमधील डेटा केवळ PCMC / PCSCL च्या बिटा चाचणीच्या
                  उद्देशाने आहे आणि PCMC / PCSCL च्या स्पष्ट लेखी संमतीशिवाय तो
                  शेअर, विकला किंवा अन्यथा वितरित केला जाऊ शकत नाही.
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    3. Legal Consequences:
                  </span>{" "}
                  I agree that any unauthorized sharing or breach of
                  confidentiality may result in legal action against me and any
                  other person or entity who may collaborate with me for the
                  same.
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    ३. डेटा मालकी:
                  </span>{" "}
                  मी कबूल करतो की प्रदान केलेला डेटा PCMC / PCSCL ची मालमत्ता
                  आहे आणि माझ्याद्वारे किंवा माझ्या संगणकीय प्रणाली(s) मध्ये
                  प्रवेश करणाऱ्या कोणत्याही व्यक्तीने केलेला कोणताही अनधिकृत
                  वापर बौद्धिक संपदा अधिकारांचे (Intellectual Property Rights)
                  उल्लंघन करू शकतो.
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    4. Data Ownership:
                  </span>{" "}
                  I acknowledge that the data provided remains the property of
                  the PCMC / PCSCL, and any unauthorized use by me or any person
                  accessing my computing system(s) may infringe on intellectual
                  property rights.
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    ४. उल्लंघनाची अधिसूचना:
                  </span>{" "}
                  कोणत्याही अनधिकृत प्रवेशाच्या किंवा गोपनीयतेचा भंग झाल्यास,
                  संभाव्य नुकसान कमी करण्यासाठी मी PCMC / PCSCL च्या संबंधित
                  अधिकाऱ्यांना त्वरित सूचित करण्यास सहमत आहे.
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    5. Notification of Breach:
                  </span>{" "}
                  In the event of any unauthorized access or breach of
                  confidentiality, I agree to promptly notify the concerned
                  officials of the PCMC / PCSCL to mitigate potential damages.
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    ५. Login रद्द करणे:
                  </span>{" "}
                  सदर अटींचे अनधिकृत सामायिकरण किंवा उल्लंघन केल्याचा पुरावा
                  असल्यास PCMC / PCSCL त्यांच्या डेटा आणि/किंवा सिस्टममधील
                  प्रवेश समाप्त करण्याचा अधिकार राखून ठेवत आहे.
                </p>
                <hr />
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    6. Termination of Access:
                  </span>{" "}
                  The PCMC / PCSCL reserves the right to terminate access to
                  their data and/or systems if there is evidence of unauthorized
                  sharing or breach of these terms.
                </p>
                <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    ६. कायदेशीर परिणाम:
                  </span>{" "}
                  मी सहमत आहे की कोणत्याही अधिकृत माहितीच्या गोपनीयतेचा भंग
                  केल्यास माझ्यावर आणि माझ्याशी सहयोग / संगणमत करणाऱ्या इतर
                  कोणत्याही अनधिकृत तृतीय पक्षावर / व्यक्तिवर / संस्थेवर
                  कायदेशीर कारवाई होऊ शकते.
                </p>
                <hr />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    margin: "20px 0px 1px 0px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreed}
                        onChange={handleAgreementChange}
                        color="success"
                      />
                    }
                    label="I agree to the Terms & Conditions/मी उपरोक्त अटी आणि
                        शर्तींशी सहमत आहे"
                  />
                  {agreed ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        handleNewLoginHistoryApiFunc()
                      }}
                      disabled={!agreed}
                    >
                      SUBMIT
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setShowTermsCondModel(false)
                        dispatch(language("en"))
                        dispatch(logout())
                        dispatch(setUsersDepartmentDashboardData(null))
                        dispatch(setUsersCitizenDashboardData(null))
                        localStorage.setItem("loggedInUser", null)
                        router.push("/login")
                      }}
                    >
                      EXIT
                    </Button>
                  )}
                </div>
              </form>
            </Box>
          </Modal>
        </>

        {/* <Box className={styles.main}>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <Image
                src="/sign.jpg"
                className={styles.bgLeft}
                width="50%"
                height="50%"
                layout="responsive"
              />
            </div>
            <div className={styles.main}>


              <div className={styles.part}>
                <div className={styles.left}>
                  <AppBarComponent />
                  <Box className={styles.welcome} p={2}>
                    <Typography variant="h1">
                      <FormattedLabel id="welcomeTo" />
                    </Typography>
                    <Typography variant="h2">
                      <FormattedLabel id="pcmcName" />
                    </Typography>
                  </Box>


                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        sx={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          "& .Mui-selected": {
                            color: "#FFFFFF !important",
                            backgroundColor: "#3B90DB",
                          },
                        }}
                        TabIndicatorProps={{
                          style: {
                            display: "none",
                          },
                        }}
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          label={<FormattedLabel id="citizen" />}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label={<FormattedLabel id="department" />}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label={<FormattedLabel id="cfcUser" />}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CitizenLogin
                          showOTPCitizen={showOTPCitizen}
                          setOtpCitizen={setOtpCitizen}
                          isVerifiedCitizen={isVerifiedCitizen}
                          isOtpVerifiedCitizen={isOtpVerifiedCitizen}
                          handleVerifyOtpCitizen={handleVerifyOtpCitizen}
                          register={register}
                          errors={errors}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          handleRememberMe={handleRememberMe}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                          handleRegisterClick={handleRegisterClick}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <DepartmentLogin
                          onDepartmentLogin={onDepartmentLogin}
                          setUser={setUser}
                          setPwd={setPwd}
                          showOTP={showOTP}
                          setOtp={setOtp}
                          isVerified={isVerified}
                          handleVerifyOtp={handleVerifyOtp}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          // handleRegisterClick={handleRegisterClick}
                          isOtpVerified={isOtpVerified}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CfcLogin
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          onCfcUserLogin={onCfcUserLogin}
                          setCfcUser={setCfcUser}
                          setCfcPwd={setCfcPwd}
                        />
                      </Box>
                    </TabPanel>
                  </Box>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Box>
                <Link
                  href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                  target="_blank"
                >
                  <FormattedLabel id="googleMarthiTrans" />
                </Link>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Marathi</Typography>
                <Switch
                  checked={checkedLanguage}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
                />
                <Typography variant="subtitle2">English</Typography>
              </Box>
            </Box>
            <div>
              <Image
                src="/sign.jpg"
                alt="PP"
                width="100%"
                height="100%"
                layout="responsive"
              />
            </div>
            <div className={styles.right}>
              <div className={styles.footer}>
                <h4>
                  <FormattedLabel id="footer" />
                </h4>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box> */}
      </form>
    </>
  )
}

export default Login
