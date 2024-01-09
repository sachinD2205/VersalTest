import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
// import EditIcon from "@mui/icons-material/Edit";
import EditIcon from '@mui/icons-material/Edit'
import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import urls from '../../../../URLS/urls'
import schema from './form'
import styles from './view.module.css'

// http://localhost:4000/hawkerManagementSystem/transactions/emergencyService/DataList
const DataList = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const router = useRouter()

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [businessTypes, setBusinessTypes] = useState([])

  // // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getBusinessTypes()
  }, [])

  useEffect(() => {
    getBusinesSubType()
  }, [businessTypes])

  const getBusinessTypes = () => {
    axios.get(`${urls.BaseURL}/businessType/getBusinessTypeData`).then((r) => {
      setBusinessTypes(
        r.data.map((row) => ({
          id: row.id,
          businessType: row.businessType,
        })),
      )
    })
  }

  // Get Table - Data
  const getBusinesSubType = () => {
    axios
      .get(`${urls.BaseURL}/businessSubType/getBusinessSubTypeData`)
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            businessSubTypePrefix: r.businessSubTypePrefix,
            toDate: moment(r.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            fromDate: moment(r.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            businessType: r.businessType,
            businessTypeName: businessTypes?.find(
              (obj) => obj?.id === r.businessType,
            )?.businessType,
            businessSubType: r.businessSubType,
            remark: r.remark,
          })),
        )
      })
  }

  // const editRecord = (rows) => {
  //   setBtnSaveText("Update"),
  //     setID(rows.id),
  //     setIsOpenCollapse(true),
  //     setSlideChecked(true);
  //   reset(rows);
  // };

  // // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   const fromDate = new Date(fromData.fromDate).toISOString();
  //   const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   // Update Form Data
  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromDate,
  //     toDate,
  //   };
  //   if (btnSaveText === "Save") {
  //     axios
  //       .post(
  //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(
  //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  // };

  const deleteById = (value) => {
    swal({
      title: 'Delete?',
      text: 'Are You Sure You Want To Delete This Record ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal('Record Is Successfully Deleted!', {
                icon: 'success',
              })
              setButtonInputState(false)
              //getcast();
            }
          })
      } else {
        swal('Record Is Safe')
      }
    })
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  // // cancell Button
  // const cancellButton = () => {
  //   reset({
  //     ...resetValuesCancell,
  //     id,
  //   });
  // };

  // // Reset Values Cancell
  // const resetValuesCancell = {
  //   fromDate: null,
  //   toDate: null,
  //   businessType: "",
  //   businessSubType: "",
  //   businessSubTypePrefix: "",
  //   remark: "",
  // };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    id: null,
  }

  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr.No',
    },
    { field: 'Department', headerName: 'Department Name', width: 150 },
    {
      field: 'Sub Department Name',
      headerName: 'Sub Department Name',
      width: 150,
    },

    {
      field: 'Description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                reset(params.row)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
    },
  ]

  // View
  return (
    <>
      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          type="primary"
          disabled={buttonInputState}
          // onClick={() => {
          //   reset({
          //     ...resetValuesExit,
          //   });
          //   setEditButtonInputState(true);
          //   setDeleteButtonState(true);
          //   setBtnSaveText("Save");
          //   setButtonInputState(true);
          //   setSlideChecked(true);
          //   setIsOpenCollapse(!isOpenCollapse);
          // }}
          onClick={() =>
            router.push({
              pathname: '/grievanceMonitoring/masters/slaMasters/form',
            })
          }
        >
          Add{' '}
        </Button>
      </div>
      <DataGrid
        autoHeight
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
        }}
        rows={dataSource}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        //checkboxSelection
      />
    </>
  )
}

export default DataList
