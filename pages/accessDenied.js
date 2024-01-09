import { Button } from 'antd'
import React, { useEffect } from 'react'
import styles from '../styles/[loader].module.css'
import { useRouter } from 'next/router'

const AccessDenied = () => {
  const router = useRouter()

  return (
    <div className={styles.fullscreen}>
      <h1 className={styles.denied}>403 | Access Denied</h1>
      <Button
        type='primary'
        onClick={() => {
          router.push('/')
        }}
      >
        Back Home
      </Button>
    </div>
  )
}

export default AccessDenied
