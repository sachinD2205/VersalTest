import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../components/view.module.css";
import moment from "moment";

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const AdditionalDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // wards
  const [wards, setWards] = useState([]);

  // getWards
  const getWards = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setWards(
          r.data.map((row) => ({
            id: row.id,
            ward: row.ward,
            wardNo: row.wardNo,
          })),
        );
      });
  };

  // hawkingDurationDailys
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([]);

  // getHawkingDurationDaily
  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setHawkingDurationDaily(
          r.data.map((row) => ({
            id: row.id,
            hawkingDurationDaily: row.hawkingDurationDaily,
          })),
        );
      });
  };

  // hawkerTypes
  const [hawkerTypes, setHawkerType] = useState([]);

  // getHawkerType
  const getHawkerType = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setHawkerType(
          r.data.map((row) => ({
            id: row.id,
            hawkerType: row.hawkerType,
          })),
        );
      });
  };

  // Items
  const [items, setItems] = useState([]);

  // getItems
  const getItems = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setItems(
          r.data.map((row) => ({
            id: row.id,
            item: row.item,
          })),
        );
      });
  };

  // Bank Masters
  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setBankMasters(
          r.data.map((row) => ({
            id: row.id,
            bankMaster: row.bankMaster,
          })),
        );
      });
  };

  // BranchNames
  const [branchNames, setBranchNames] = useState([]);

  // getBranchNames
  const getBranchNames = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setBranchNames(
          r.data.map((row) => ({
            id: row.id,
            branchName: row.branchName,
          })),
        );
      });
  };

  // useEffect
  useEffect(() => {
    getWards();
    getHawkingDurationDaily();
    getHawkerType();
    getItems();
    getBankMasters();
    getBranchNames();
  }, []);

  return (
    <>
      <div className={styles.small}>
        {/** First Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.wardNo}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Ward No *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Ward No *'
                  >
                    {wards &&
                      wards.map((wardNo, index) => (
                        <MenuItem key={index} value={wardNo.id}>
                          {wardNo.wardNo}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='wardNo'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.wardNo ? errors.wardNo.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.wardName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Ward Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Ward Name *'
                  >
                    {wards &&
                      wards.map((wardNo, index) => (
                        <MenuItem key={index} value={wardNo.id}>
                          {wardNo.wardNo}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='wardName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.wardName ? errors.wardName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Nature Of Business *'
              variant='standard'
              {...register("natureOfBusiness")}
              error={!!errors.natureOfBusiness}
              helperText={
                errors?.natureOfBusiness
                  ? errors.natureOfBusiness.message
                  : null
              }
            />
          </div>
        </div>

        {/** Second Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.hawkingDurationDaily}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Hawking Duration Daily *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Hawking Duration Daily *'
                  >
                    {hawkingDurationDailys &&
                      hawkingDurationDailys.map(
                        (hawkingDurationDaily, index) => (
                          <MenuItem key={index} value={hawkingDurationDaily.id}>
                            {hawkingDurationDaily.hawkingDurationDaily}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name='hawkingDurationDaily'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.hawkingDurationDaily
                  ? errors.hawkingDurationDaily.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Hawker Type *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='hawkerType *'
                  >
                    {hawkerTypes &&
                      hawkerTypes.map((hawkerType, index) => (
                        <MenuItem key={index} value={hawkerType.id}>
                          {hawkerType.hawkerType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='hawkerType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.hawkerType ? errors.hawkerType.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.item}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Item *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Item *'
                  >
                    {items &&
                      items.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.item}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='item'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.item ? errors.item.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        {/** Third Row */}
        <div className={styles.row}>
          <div>
            <FormControl style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name='periodOfResidenceInMaharashtra'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 12 }}>
                          Period of Residence in Maharashtra
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              {/** 
              <FormHelperText>
                {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
              </FormHelperText>
            */}
            </FormControl>
          </div>
          <div>
            <div>
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name='periodOfResidenceInPCMC'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat='DD/MM/YYYY'
                        label={
                          <span style={{ fontSize: 12 }}>
                            Period of Residence in PCMC *
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/** 
              <FormHelperText>
                {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
              </FormHelperText>
            */}
              </FormControl>
            </div>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Ration Card No.'
              variant='standard'
              {...register("rationCardNo")}
            />
          </div>
        </div>
        {/** Fourth Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.bankMaster}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Bank Master *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Bank Master *'
                  >
                    {bankMasters &&
                      bankMasters.map((bankMaster, index) => (
                        <MenuItem key={index} value={bankMaster.id}>
                          {bankMaster.bankMaster}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='bankMaster'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.bankMaster ? errors.bankMaster.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            {" "}
            <div>
              <FormControl
                variant='standard'
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.branchName}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  Branch Name *
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='Branch Name *'
                    >
                      {branchNames &&
                        branchNames.map((branchName, index) => (
                          <MenuItem key={index} value={branchName.id}>
                            {branchName.branchName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='branchName'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {errors?.branchName ? errors.branchName.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Bank Account No.*'
              variant='standard'
              {...register("bankAccountNo")}
              error={!!errors.bankAccountNo}
              helperText={
                errors?.bankAccountNo ? errors.bankAccountNo.message : null
              }
            />
          </div>
          <div>
            {" "}
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='IFSC Code *'
              variant='standard'
              {...register("ifscCode")}
              error={!!errors.ifscCode}
              helperText={errors?.ifscCode ? errors.ifscCode.message : null}
            />
          </div>
        </div>
        {/** Sixth  Row */}
        <div className={styles.row}>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AdditionalDetails;
