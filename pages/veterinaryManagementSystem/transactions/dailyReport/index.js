import React, { useState } from 'react'
import Head from 'next/head'
import styles from './dailyReport.module.css'

import ZooKeeper from './ZooKeeper'
import Scrutiny from './Scrutiny'
import Admin from './Admin'
import { useSelector } from 'react-redux'
import { Paper } from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import Title from '../../../../containers/VMS_ReusableComponents/Title'

const Index = () => {
  const [roles, setRoles] = useState(
    useSelector((state) =>
      // @ts-ignore
      state?.user?.user?.menus?.find(
        (menu) =>
          menu.id == Number(localStorage.getItem('selectedMenuFromDrawer'))
      )
    )?.roles
  )

  return (
    <>
      <Head>
        <title>Zoo Keeper</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='dailyReport' />} />
        {roles?.includes('ENTRY') && <ZooKeeper />}
        {(roles?.includes('APPROVAL') || roles?.includes('FINAL_APPROVAL')) && (
          // <Supervisor menuRoles={roles} />
          <Scrutiny menuRoles={roles} />
        )}
        {roles?.includes('ADMINISTRATIVE_OFFICER') && (
          <Admin roleSetter={setRoles} />
        )}
      </Paper>
    </>
  )
}

export default Index
