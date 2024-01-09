import React from 'react'
import { useSelector } from 'react-redux'
import InnerCards from '../../containers/Layout/Inner-Cards/InnerCards'
import { useEffect } from 'react'
import CitizenDashboardData2 from '../../containers/Layout/components/CitizenDashboardData2'


const DashboardHome = () => {
  let language = useSelector((state) => state.labels.language);

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
      <CitizenDashboardData2
        titleProp={language === "en" ? 'Welcome to Pimpri Chinchwad Online Citizen Portal' : 'पिंपरी चिंचवड ऑनलाईन सिटीझन पोर्टलवर आपले स्वागत आहे. '}
        subTitle={
          language === "en" ? ' Welcome to Pimpri Chinchwad Online Citizen Portal, which is simple and convenient way for citizens to acess various services from anywhere at anytime. The service of virtual civic center can be accessed without paying any additional charges.'
            : "पिंपरी चिंचवड ऑनलाइन सिटिझन पोर्टलवर आपले स्वागत आहे, जे नागरिकांसाठी कोणत्याही वेळी कोठूनही विविध सेवांमध्ये प्रवेश करण्याचा सोपा आणि सोयीस्कर मार्ग आहे. कोणतेही अतिरिक्त शुल्क न भरता आभासी नागरी केंद्राच्या सेवेत प्रवेश करता येतो."
        }
      >
        <InnerCards pageKey={'dashboard'} />
      </CitizenDashboardData2>
    </div>
  )
}

export default DashboardHome
