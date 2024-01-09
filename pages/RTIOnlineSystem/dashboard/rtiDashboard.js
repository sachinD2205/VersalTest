import React from 'react'
import RtiAppDashboard from './rtiApplicationDashboard/index'
import AppealDashboard from './rtiAppealDashboard/index'
import { useSelector } from "react-redux";
import roleId from '../../../components/rtiOnlineSystem/commonRoleId';

const rtiDashboard = () => {
  let user = useSelector((state) => state?.user?.user);

  return (
    <>
        {(user?.roleIds && user?.roleIds.includes(roleId.RTI_ADHIKARI_ROLE_ID)) &&<div>
          <RtiAppDashboard />
        </div>}
        {(user?.roleIds && user?.roleIds.includes(roleId.RTI_APPEALE_ROLE_ID)) && <div>
          <AppealDashboard />
        </div>}
    </>
  )
}

export default rtiDashboard
