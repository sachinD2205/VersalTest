import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './postMortem.module.css'

import Title from '../../../../containers/VMS_ReusableComponents/Title'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Button, IconButton, Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { Add, Edit, Visibility } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import URLs from '../../../../URLS/urls'
import moment from 'moment'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  const language = useSelector((state) => state?.labels.language)

  const userToken = useGetToken()

  const [zooAnimal, setZooAnimal] = useState([])
  const [table, setTable] = useState([])

  const [loading, setLoading] = useState(false)

  const roles = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem('selectedMenuFromDrawer'))
    )
  )?.roles

  useEffect(() => {
    axios
      .get(`${URLs.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setZooAnimal(
          res.data?.mstZooAnimalList?.map((j) => ({
            id: j?.id,
            animalNameEn: j?.animalNameEn,
            animalNameMr: j?.animalNameMr,
          }))
        )
      )
      .catch((error) => {
        setLoading(false)
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    if (zooAnimal?.length > 0) {
      axios
        .get(`${URLs.VMS}/trnPostMortem/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setTable(
            res.data?.trnPostMortemDao?.map((j, i) => ({
              srNo: i + 1,
              id: j?.id,
              // dateOfPostMortem: j?.dateOfPostMortem,
              dateOfPostMortem: !!j?.dateOfPostMortem
                ? moment(j?.dateOfPostMortem).format('DD-MM-YYYY')
                : '-',
              personalName: j?.personalName,
              scientificName: j?.scientificName,
              placeOfDeath: j?.placeOfDeath,
              age: j?.age,
              applicationStatus: j?.applicationStatus,
              zooAnimalNameEn: zooAnimal?.find(
                (obj) => obj?.id == j?.zooAnimalKey
              )?.animalNameEn,
              zooAnimalNameMr: zooAnimal?.find(
                (obj) => obj?.id == j?.zooAnimalKey
              )?.animalNameMr,
            }))
          )
          setLoading(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
          setLoading(false)
        })
    }
  }, [zooAnimal])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 60,
    },
    {
      headerClassName: 'cellColor',

      field: 'dateOfPostMortem',
      headerName: <FormattedLabel id='dateOfPostMortem' />,
      minWidth: 150,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'zooAnimalNameEn' : 'zooAnimalNameMr',
      headerName: <FormattedLabel id='zooAnimal' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'personalName',
      headerName: <FormattedLabel id='personalName' />,
      minWidth: 150,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'scientificName',
      headerName: <FormattedLabel id='scientificName' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'placeOfDeath',
      headerName: <FormattedLabel id='placeOfDeath' />,
      minWidth: 150,
      // flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'age',
      headerName: <FormattedLabel id='age' />,
      width: 80,
    },
    {
      headerClassName: 'cellColor',

      field: 'applicationStatus',
      headerName: <FormattedLabel id='status' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'action',
      headerAlign: 'center',
      align: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: '#1976d2',
              }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/postMortem/view`,
                  query: { id: params.row?.id },
                })
              }}
            >
              {/* {(roles?.includes('ENTRY') ||
                roles?.includes('ADMINISTRATIVE_OFFICER')) &&
              ['REVERT_BY_CURATOR'].includes(params.row?.applicationStatus) ? (
                <Edit />
              ) : (
                <Visibility />
                )} */}
              <Visibility />
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Post Mortem Report</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='postMortemReport' />} />
        {(roles?.includes('ENTRY') ||
          roles?.includes('ADMINISTRATIVE_OFFICER')) && (
          <div className={styles.right}>
            <Button
              variant='contained'
              endIcon={<Add />}
              onClick={() =>
                router.push(
                  '/veterinaryManagementSystem/transactions/postMortem/view'
                )
              }
            >
              <FormattedLabel id='add' />
            </Button>
          </div>
        )}
        <DataGrid
          autoHeight
          sx={{
            marginTop: '10px',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
            '& .redText': {
              color: 'red',
            },
            '& .greenText': {
              color: 'green',
            },
            '& .blueText': {
              color: 'blue',
            },
          }}
          getCellClassName={(params) => {
            if (
              params.field === 'applicationStatus' &&
              params.value == 'APPLICATION_CREATED'
            ) {
              return 'blueText'
            } else if (
              params.field === 'applicationStatus' &&
              params.value == 'APPROVE_BY_CURATOR'
            ) {
              return 'greenText'
            } else if (
              params.field === 'applicationStatus' &&
              (params.value == 'REJECTED_BY_CURATOR' ||
                params.value == 'REVERT_BY_CURATOR')
            ) {
              return 'redText'
            } else {
              return ''
            }
          }}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: true },
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          loading={loading}
        />
      </Paper>
    </>
  )
}

export default Index
