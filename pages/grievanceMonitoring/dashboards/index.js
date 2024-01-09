import React from 'react'
import CitizenDashboard from './citizenUserDashboard'
import CFCDashboard from './cfcUserDashboard'

const gmDashboard = () => {
    const logedInUser = localStorage.getItem("loggedInUser");
  return (
    <>
        {logedInUser==='citizenUser' &&<div>
          <CitizenDashboard />
        </div>}
        {logedInUser==='cfcUser' && <div>
          <CFCDashboard />
        </div>}
    </>
  )
}

export default gmDashboard
