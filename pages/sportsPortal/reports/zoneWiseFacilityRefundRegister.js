import React from 'react'
import styles from './reports.module.css'
import { Paper } from '@mui/material'
import Head from 'next/head'
import Title from '../../../containers/VMS_ReusableComponents/Title'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'

const Index = () => {
  return (
    <>
      <Head>
        <title>Zone wise Facility Refund Register</title>
      </Head>
      <Paper className={styles.main}>
        <Title
          titleLabel={<FormattedLabel id='zoneWiseFacilityRefundRegister' />}
        />
      </Paper>
    </>
  )
}

export default Index
