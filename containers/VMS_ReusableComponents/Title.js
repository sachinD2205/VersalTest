import React from 'react'
import router from 'next/router'
import styles from '../../styles/reusableComponents/vms/Title.module.css'

import { ArrowBack } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const Index = ({ titleLabel = <></> }) => {
  return (
    <div className={styles.wrapper}>
      <IconButton className={styles.backBtn} onClick={() => router.back()}>
        <ArrowBack />
      </IconButton>
      {titleLabel}
    </div>
  )
}

export default Index
