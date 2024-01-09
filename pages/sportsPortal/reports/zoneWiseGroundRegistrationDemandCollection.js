import React from 'react'
import styles from './reports.module.css'
import { Paper } from '@mui/material'
import Head from 'next/head'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'

const Index = () => {
  return (
    <>
      <Head>
        <title>Zone wise Ground Registration Demand Collection</title>
      </Head>
      <Paper className={styles.main}>
        <Title
          titleLabel={
            <FormattedLabel id='zoneWiseGroundRegistrationDemandCollection' />
          }
        />
      </Paper>
    </>
  )
}

export default Index
