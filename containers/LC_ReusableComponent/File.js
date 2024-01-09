import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const File = () => {
  const router = useRouter()

  let pratiFileName = router.query.filename + ''
  let actualFileName = pratiFileName?.split('.')[0]

  useEffect(() => {
    console.log('Byte Array: ', router.query.byteArray)
  }, [])

  return (
    <>
      <Head>
        <title>{actualFileName}</title>
      </Head>
      <div>
        <iframe
          id='inlineFrameExample'
          title='Inline Frame Example'
          width='100%'
          height='623'
          src={router.query.byteArray + ''}
        />
      </div>
    </>
  )
}

export default File
