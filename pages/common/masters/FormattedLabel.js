import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

const FormattedLabel = ({ id, required = false }) => {
  const router = useRouter()
  // @ts-ignore
  const labels = useSelector((state) => state?.labels.labels)
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const path = router.asPath.split('/')

  const [value, setValue] = useState('')

  useEffect(() => {
    findLabel()
  }, [language])

  function findLabel() {
    setValue(labels[path[1]][language][id])
  }

  if (required) {
    return (
      <>
        {value + ' '}{' '}
        <span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
      </>
    )
  } else {
    return <>{value}</>
  }
}

export default FormattedLabel
