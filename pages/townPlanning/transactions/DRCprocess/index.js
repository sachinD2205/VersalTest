import sweetAlert from 'sweetalert'
import { Add, Delete, Visibility } from '@mui/icons-material'
import { Button, IconButton, Paper } from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { DataGrid } from '@mui/x-data-grid'
import router from 'next/router'
import axios from 'axios'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'

const Index = () => {
  const [runAgain, setRunAgain] = useState(false)
  const [table, setTable] = useState([])
  const [forView, setForView] = useState([])
  const [zone, setZone] = useState([
    {
      id: 1,
      zoneEn: '',
      zoneMr: '',
    },
  ])
  const [village, setVillage] = useState([
    {
      id: 1,
      villageEn: '',
      villageMr: '',
    },
  ])

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  useEffect(() => {
    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      console.log('Zone: ', res.data)
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        }))
      )
    })

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((res) => {
      console.log('Villages: ', res.data)
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        }))
      )
    })
  }, [runAgain])

  useEffect(() => {
    setRunAgain(false)

    // axios
    //   .get(`${URLS.BaseURL}/partplan/getpartplanDetails`)
    //   .then((response) => {
    //     console.log('aalela: ', response.data)
    //     setForView(response.data)
    //     setTable(
    //       response.data.map((res, index) => ({
    //         srNo: index + 1,
    //         id: res.id,
    //         applicationDate: res.applicationDate,
    //         applicationNo: res.applicationNo,
    //         fullNameEn:
    //           res.firstNameEn + ' ' + res.middleNameEn + ' ' + res.surnameEn,
    //         fullNameMr:
    //           res.firstNameMr + ' ' + res.middleNameMr + ' ' + res.surnameMr,
    //         zoneNameEn: getZoneName(res.tDRZone, 'en'),
    //         zoneNameMr: getZoneName(res.tDRZone, 'mr'),
    //         villageNameEn: getVillageName(res.villageName, 'en'),
    //         villageNameMr: getVillageName(res.villageName, 'mr'),
    //         pincode: res.pincode,
    //         status: res.status,
    //       }))
    //     )
    //   })
  }, [village])

  function getZoneName(value, lang) {
    if (lang === 'en') {
      // @ts-ignore
      return zone.find((obj) => obj?.id == value)?.zoneEn
    } else {
      // @ts-ignore
      return zone.find((obj) => obj?.id == value)?.zoneMr
    }
  }
  function getVillageName(value, lang) {
    if (lang === 'en') {
      // @ts-ignore
      return village.find((obj) => obj?.id == value)?.villageEn
    } else {
      // @ts-ignore
      return village.find((obj) => obj?.id == value)?.villageMr
    }
  }

  // const deleteRecord = async (record) => {
  //   sweetAlert({
  //     title: 'Are you sure?',
  //     text: 'Once deleted, you will not be able to recover this record!',
  //     icon: 'warning',
  //     buttons: ['Cancel', 'Delete'],
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(`${URLS.BaseURL}/partplan/deletepartplan/${record.id}`)
  //         .then((res) => {
  //           if (res.status == 200) {
  //             sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
  //             setRunAgain(true)
  //           }
  //         })
  //     }
  //   })
  // }

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id='applicationDate' />,
      width: 150,
    },
    {
      field: 'applicationNo',
      headerName: <FormattedLabel id='applicationNo' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'fullNameEn' : 'fullNameMr',
      headerName: <FormattedLabel id='fullName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'zoneNameEn' : 'zoneNameMr',
      headerName: <FormattedLabel id='zoneName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      headerName: <FormattedLabel id='villageName' />,
      width: 200,
    },
    {
      field: 'serviceCompletionDate',
      headerName: <FormattedLabel id='serviceCompletionDate' />,
      width: 200,
    },
    {
      field: 'status',
      headerName: <FormattedLabel id='status' />,
      width: 200,
    },
    {
      field: 'action',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                const viewData = forView[params.row.srNo - 1]
                console.log('Query data: ', viewData)
                router.push({
                  pathname: `/townPlanning/transactions/utilizationofTDRFSI/view`,
                  query: {
                    pageMode: 'view',
                    ...viewData,
                  },
                })
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton onClick={() => deleteRecord(params.row)}>
              <Delete />
            </IconButton> */}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Utilization of TDR/FSI</title>
      </Head>
      <div>
        <Button
          sx={{ marginBottom: 2, marginLeft: 5 }}
          onClick={() =>
            router.push({
              pathname: `/townPlanning/transactions/utilizationofTDRFSI/view`,
              query: {
                pageMode: 'new',
                length: table.length + 1,
              },
            })
          }
          variant='contained'
          endIcon={<Add />}
        >
          <FormattedLabel id='add' />
        </Button>

        <Paper style={{ padding: '3% 3%' }}>
          <DataGrid
            autoHeight
            rows={table}
            // @ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Paper>
      </div>
    </>
  )
}

export default Index
