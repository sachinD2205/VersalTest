import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './animalRescue.module.css'

import Title from '../../../../containers/VMS_ReusableComponents/Title'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Button, IconButton, Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import URLs from '../../../../URLS/urls'
import { Add, Edit, Visibility } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  const language = useSelector((state) => state.labels.language)

  const roles = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem('selectedMenuFromDrawer'))
    )
  )?.roles

  const userToken = useGetToken()

  const [table, setTable] = useState([])

  useEffect(() => {
    //Get Table data
    axios
      .get(`${URLs.VMS}/trnAnimalRescue/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      .then((res) =>
        setTable(
          res.data?.trnAnimalRescueDao?.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            // date: j?.applicationDate,
            // rescueDateAndTime: j?.dateOfRescue + ' ' + j?.timeOfRescue,
            date: moment(j?.applicationDate).format('DD-MM-YYYY'),
            rescueDateAndTime:
              moment(j?.dateOfRescue).format('DD-MM-YYYY') +
              ' ' +
              j?.timeOfRescue,
            nameOfInformer: j?.nameOfInformer,
            commonName: j?.commonName,
            scientificName: j?.scientificName,
            age: j?.age,
            applicationStatus: j?.applicationStatus,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 60,
    },
    {
      headerClassName: 'cellColor',

      field: 'date',
      headerName: <FormattedLabel id='date' />,
      minWidth: 100,
    },
    {
      headerClassName: 'cellColor',

      field: 'rescueDateAndTime',
      headerName: <FormattedLabel id='rescueDateAndTime' />,
      minWidth: 185,
    },
    {
      headerClassName: 'cellColor',

      field: 'nameOfInformer',
      headerName: <FormattedLabel id='nameOfInformer' />,
      minWidth: 165,
      flex: 1,
    },
    // {
    //   headerClassName: 'cellColor',

    //   field: 'addressOrLocationOfRescue',
    //   headerName: <FormattedLabel id='addressOrLocationOfRescue' />,
    //   minWidth: 250,
    // },
    {
      headerClassName: 'cellColor',

      field: 'commonName',
      headerName: <FormattedLabel id='commonName' />,
      minWidth: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'scientificName',
      headerName: <FormattedLabel id='scientificName' />,
      minWidth: 165,
    },
    {
      headerClassName: 'cellColor',

      field: 'age',
      headerName: <FormattedLabel id='age' />,
      width: 90,
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
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: '#1976d2',
              }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/animalRescue/view`,
                  query: { id: params.row?.id },
                })
              }}
            >
              {(roles?.includes('ENTRY') ||
                roles?.includes('ADMINISTRATIVE_OFFICER')) &&
              ['REVERT_BY_CURATOR'].includes(params.row?.applicationStatus) ? (
                <Edit />
              ) : (
                <Visibility />
              )}
            </IconButton>

            {/* {(roles?.includes('ENTRY'))}
            {(roles?.includes('APPROVAL') ||
              roles?.includes('ADMINISTRATIVE_OFFICER')) && (
              <IconButton
                disabled={
                  !(params.row.applicationStatus == 'REVERT_BY_CURATOR')
                }
                style={{
                  color:
                    params.row.applicationStatus == 'REVERT_BY_CURATOR'
                      ? '#1976d2'
                      : 'lightgray',
                }}
                onClick={() => {
                  router.push({
                    pathname: `/veterinaryManagementSystem/transactions/animalRescue/view`,
                    query: { id: params.row?.id },
                  })
                }}
              >
                <Edit />
              </IconButton>
            )} */}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Animal Rescue</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='animalRescue' />} />
        {(roles?.includes('ENTRY') ||
          roles?.includes('ADMINISTRATIVE_OFFICER')) && (
          <div className={styles.right}>
            <Button
              variant='contained'
              endIcon={<Add />}
              onClick={() =>
                router.push(
                  '/veterinaryManagementSystem/transactions/animalRescue/view'
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
          //   loading={loader}
        />
      </Paper>
    </>
  )
}

export default Index
