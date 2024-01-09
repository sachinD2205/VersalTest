import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import urls from "../URLS/urls";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  setMenu,
  setUsersDepartmentDashboardData,
  setUsersCitizenDashboardData,
} from "../features/userSlice";
import backEndApiMenu from "../containers/Layout/backEndApiMenu";
import { mountLabels, language } from "../features/labelSlice";
import labels from "../containers/reuseableComponents/newLabels";

const departmentLogin = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [showOTPCitizen, setShowOTPCitizen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpCitizen, setOtpCitizen] = useState(null);
  const [isVerified, setIsVerified] = useState(true);
  const [isVerifiedCitizen, setIsVerifiedCitizen] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpVerifiedCitizen, setIsOtpVerifiedCitizen] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [cfcUser, setCfcUser] = useState("");
  const [cfcPwd, setCfcPwd] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const departmentLoginRef = useRef(null); // Define the ref to the department login form
  const dispatch = useDispatch();

  const _language = useSelector((state) => {
    return state.labels.language;
  });

  const [checkedLanguage, setCheckedLanguage] = useState(
    _language == "en" ? true : false
  );

  const handleChangeLanguage = (e) => {
    // setCheckedLanguage(e.target.checked);
    e == "ENG" ? dispatch(language("en")) : dispatch(language("mr"));
  };

  const checkLoginState = useSelector((state) => {
    return state.user.isLoggedIn;
  });
  useEffect(() => {
    // redirect to home if already logged in
    if (checkLoginState) {
      router.push("/DepartmentDashboard");
    }
  }, []);

  // const submitDepartmentLoginForm = (username, password) => {
  //   // Make the API call to perform Department Login
  //   const body = {
  //     userName: username,
  //     password: password,
  //   };
  //   console.log("res", body);
  //   axios
  //     .post(`${urls.AuthURL}/signinNew`, body)
  //     // .post(`http://192.168.1.101:8090/cfc/auth/signinNew`, body)
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log('res dep login',r);
  //         // setLoading(true);

  //         router.push("/DepartmentDashboard");
  //         // setDisableLoginButton(false);
  //         dispatch(login(r.data));
  //         dispatch(setMenu(backEndApiMenu));
  //         dispatch(setUsersDepartmentDashboardData(r.data));
  //         dispatch(mountLabels(labels));
  //         localStorage.setItem(
  //           "isPasswordChanged",
  //           r.data.userDao.isPasswordChanged
  //         );
  //         // dispatch(passwordUpdater(r.data.userDao.isPasswordChanged))
  //         localStorage.setItem("loggedInUser", "departmentUser");
  //         setShowOTP(true);
  //         setIsVerified(false);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle API call error
  //       console.error("API call error", error);
  //     });
  // };
  const submitDepartmentLoginEmpForm = (empCode) =>{
    const body = {
      empCode: empCode,
    };

      axios
      // .post(`http://192.168.1.112:8090/cfc/open/emas/redirecttoui`, body)
      // .post(`${urls.CFCURL}/emas/redirecttoui`, body)
      .post(`${urls.SSOCFCURL}/emas/redirecttoui`, body)
      // .post(`http://localhost:8090/cfc/api/emas/redirecttoui`, body)
      // .post(`http://192.168.1.101:8090/cfc/auth/signinNew`, body)
      .then((r) => { 
        if (r.status == 200) {
          console.log("res dep login", r);
          // setLoading(true);

          router.push("/DepartmentDashboard");
          // setDisableLoginButton(false);
          dispatch(login(r.data));
          dispatch(setMenu(backEndApiMenu));
          dispatch(setUsersDepartmentDashboardData(r.data));
          dispatch(mountLabels(labels));
          localStorage.setItem(
            "isPasswordChanged",
            r.data.userDao.isPasswordChanged
          );
          localStorage.setItem("isSsoDashboard", true);
          // dispatch(passwordUpdater(r.data.userDao.isPasswordChanged))
          localStorage.setItem("loggedInUser", "departmentUser");
          setShowOTP(true);
          setIsVerified(false);
        }
      })
      .catch((error) => {
        // Handle API call error
        console.error("API call error", error);
        if(error.response.status===404){
          logoutIdam()
        }
      });
  }

  const logoutIdam = () => {
    axios
      // .get(`${urls.CFCURL}/emas/logoutIdam`)
      .get(`${urls.SSOCFCURL}/emas/logoutIdam`)
      // .get(`http://192.168.1.112:8090/cfc/open/emas/logoutIdam`)
      .then((response) => {
        console.log("response", response);
        const redirectUrl = response.data;
        window.location.href = redirectUrl;
      })
      .catch((error) => {
        console.error("GET API call error:", error);
      });
  };


  useEffect(() => {
    const { query } = router;
   console.log("empCode",query.empCode);
  
  if(query.empCode){
      submitDepartmentLoginEmpForm(query.empCode);
  }

  }, [router.query]);
  // useEffect(() => {

  //   const { query } = router;
  //   const body = {
  //     empCode: query.empCode,
  //   };
  //   axios
  //     // .post(`http://192.168.1.103:8090/cfc/api/emas/redirecttoui`, body)
  //     .post(`http://localhost:8090/cfc/api/emas/showDashboardV3`, body)
  //     // .post(`http://192.168.1.101:8090/cfc/auth/signinNew`, body)
  //     .then((r) => { 
  //       if (r.status == 200) {
  //         console.log("res dep login", r);
  //         // setLoading(true);

  //         router.push("/DepartmentDashboard");
  //         // setDisableLoginButton(false);
  //         dispatch(login(r.data));
  //         dispatch(setMenu(backEndApiMenu));
  //         dispatch(setUsersDepartmentDashboardData(r.data));
  //         dispatch(mountLabels(labels));
  //         localStorage.setItem(
  //           "isPasswordChanged",
  //           r.data.userDao.isPasswordChanged
  //         );
  //         // dispatch(passwordUpdater(r.data.userDao.isPasswordChanged))
  //         localStorage.setItem("loggedInUser", "departmentUser");
  //         setShowOTP(true);
  //         setIsVerified(false);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle API call error
  //       console.error("API call error", error);
  //     });
  // }, []);

  return (
    <div>
      {router.query.empcode ? (
        <div>
          {/* Department Login form */}
          <form
            ref={departmentLoginRef}
            onSubmit={(e) => {
              e.preventDefault();
              submitDepartmentLoginForm(user, pwd);
            }}
          >
            {/* Hidden input fields to submit user and password */}
            <input type="hidden" name="Username" value={user} />
            <input type="hidden" name="password" value={pwd} />
          </form>
        </div>
      ) : null}

      {/* Your other login components */}
      {/* ... */}
    </div>
  );
};

export default departmentLogin;
