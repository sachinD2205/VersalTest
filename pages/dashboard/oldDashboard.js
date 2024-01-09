import { Language } from '@mui/icons-material'
import React from 'react'
import { useSelector } from 'react-redux'
// import BasicLayout from "../../containers/Layout/BasicLayout";
// import CitizenDashboard from "../../containers/Layout/components/CitizenDashboard";
import CitizenDashboardData from '../../containers/Layout/components/CitizenDashboardData'
import InnerCards from '../../containers/Layout/Inner-Cards/InnerCards'
import { useEffect } from 'react'
import CitizenDashboardData3 from '../../containers/Layout/components/CitizenDashboardData3'
// const translate = require("translate-google")
// const tranObj = {
//   a: 1,
//   b: "1",
//   c: "How are you?\nI'm nice.",
//   d: [true, "true", "hi", { a: "hello", b: ["world"] }],
// }

// translate(tranObj, { to: "zh-cn", except: ["a"] })
//   .then((res) => {
//     console.log("res", res)
//   })
//   .catch((err) => {
//     console.error(err)
//   })

const DashboardHome = () => {
  let language = useSelector((state) => state.labels.language)

  useEffect(() => {
    localStorage.removeItem('issuanceOfHawkerLicenseId')
    localStorage.removeItem('renewalOfHawkerLicenseId')
    localStorage.removeItem('cancellationOfHawkerLicenseId')
    localStorage.removeItem('transferOfHawkerLicenseId')
    localStorage.removeItem('castOtherA')
    localStorage.removeItem('castCategoryOtherA')
    localStorage.removeItem('applicantTypeOtherA')
    localStorage.removeItem('disabledFieldInputState')
    localStorage.removeItem('disablityNameYN')
    localStorage.removeItem('QueryParamsData')
    localStorage.removeItem('issuanceOfHawkerLicenseInputState')
    localStorage.removeItem('applicationRevertedToCititizen')
    localStorage.removeItem('draft')
    localStorage.removeItem('DepartSideEditApplication')
    localStorage.removeItem('oldLicenseYNA')
    localStorage.removeItem('disablityNameYNA')
    localStorage.removeItem('voterNameYNA')
    localStorage.removeItem('sportsBookingAddMemberKey')
    localStorage.removeItem('sportsBookingKey')
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("GroundBookingId");
  }, [])

  return (
    <div>
      {/* <BasicLayout titleProp={'PCMC Dashboard'}> */}
      {/* <BasicLayout
        titleProp={"Welcome to Pimpri Chinchwad Online Citizen Portal"}
        subTitle={
          " Welcome to Pimpri Chinchwad Online Citizen Portal, which is simple and convenient way for citizens to acess various services from anywhere at anytime. The service of virtual civic center can be accessed without paying any additional charges."
        }
      >
        <InnerCards pageKey={"dashboard"} />
      </BasicLayout> */}
      {/* <CitizenDashboard
        titleProp={"Welcome to Pimpri Chinchwad Online Citizen Portal"}
        subTitle={
          " Welcome to Pimpri Chinchwad Online Citizen Portal, which is simple and convenient way for citizens to acess various services from anywhere at anytime. The service of virtual civic center can be accessed without paying any additional charges."
        }
      >
        <InnerCards pageKey={"dashboard"} />
      </CitizenDashboard> */}

      {/* translate('Ik spreek Engels', {to: 'en'}).then(res => {
            console.log(res.text);
            // => I speak English
            console.log(res.from.language.iso);
            //=> nl
        }).catch(err => {
            console.error(err);
        }); */}

      <CitizenDashboardData3
        titleProp={
          language === 'en'
            ? 'Welcome to Pimpri Chinchwad Online Citizen Portal'
            : 'पिंपरी चिंचवड ऑनलाईन सिटीझन पोर्टलवर आपले स्वागत आहे. '
        }
        subTitle={
          language === 'en'
            ? ' Welcome to Pimpri Chinchwad Online Citizen Portal, which is simple and convenient way for citizens to acess various services from anywhere at anytime. The service of virtual civic center can be accessed without paying any additional charges.'
            : 'पिंपरी चिंचवड ऑनलाइन सिटिझन पोर्टलवर आपले स्वागत आहे, जे नागरिकांसाठी कोणत्याही वेळी कोठूनही विविध सेवांमध्ये प्रवेश करण्याचा सोपा आणि सोयीस्कर मार्ग आहे. कोणतेही अतिरिक्त शुल्क न भरता आभासी नागरी केंद्राच्या सेवेत प्रवेश करता येतो.'
        }
      >
        <InnerCards pageKey={'dashboard'} />
      </CitizenDashboardData3>
    </div>
  )
}

export default DashboardHome
