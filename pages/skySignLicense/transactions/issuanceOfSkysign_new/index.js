import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Button, DatePicker, Select } from "antd";
import moment from "moment";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

const Index = () => {
  const form = useForm({
    defaultValues: {
      applicantName: "",
      agencyName: "",
      status: "",
      address: "",
      telephone: "",
      fax: "",
      mediumOfAdvertisements: "",
      formOfAdvertisements: "",
      natureOfAdvertisement: "",
      displayFreeBanner: "",
      fromDate: "",
      toDate: "",
      locationType: "",
      noOfLocations: "",
      messageOnBanner: "",
      categoryOfCivicMessage: "",
      isPhotoCopyAttached: "",
      roadDrawingVisibilityName: "",
      roadWidth: "",
      noOfHoardingLocated: "",
      noOfTrees: "",
      treesRequiredToCut: "",
      landlordName: "",
      landlordNOCSubmitted: "",
      documentsSubmittedAsRule: "",
    },
  });

  const finalSubmit = (value) => {
    console.log("SSL: value =", value);
  };

  console.log("SSL: form.getValues =", form.getValues());

  return (
    <Paper>
      <div style={{ textAlign: "center" }}>
        <h1>
          महाराष्ट्र शासन राजपत्र असाधारण भाग एक-अ-मध्य उप-विभाग, मे ९, २०२२ /
          वैशाख १९, शके १९४४
        </h1>
        <h2>Form A</h2>
        <h2>Application Form</h2>
        <h2>[See rule 17]</h2>
        <h2>(See section 244 in the MMC Act)</h2>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(finalSubmit)}>
          <ol style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {/* 1. Name of Applicant */}
            <li
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            >
              <InputLabel id="applicantName" sx={{ margin: 0, flex: "1" }}>
                1. Name of Applicant:
              </InputLabel>
              <TextField
                sx={{ flex: "2", margin: "0" }}
                id="applicantName"
                variant="standard"
                {...form.register("applicantName")}
              />
            </li>
            {/* 2. Name of Agency */}
            <li
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            >
              <InputLabel style={{ margin: 0, flex: "1" }}>
                2. Name of Agency:
              </InputLabel>
              <TextField
                sx={{ flex: "2", margin: "0" }}
                id="standard-basic"
                variant="standard"
                {...form.register("agencyName")}
              />
            </li>
            {/* 3. Status */}
            <li
              style={{ display: "flex", alignItems: "center", padding: "4px" }}
            >
              <InputLabel style={{ margin: 0, flex: "1" }}>
                3. Status:
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...form.register("status")}
                  onChange={(e) => {
                    form.setValue("status", e);
                  }}
                >
                  <MenuItem value={"proprietary_firm"}>
                    Proprietary firm
                  </MenuItem>
                  <MenuItem value={"company"}>Company</MenuItem>
                  <MenuItem value={"charitable_trust"}>
                    Charitable Trust
                  </MenuItem>
                  <MenuItem value={"others"}>Others</MenuItem>
                </Select>
              </FormControl>
            </li>
            {/* 4. Address */}
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ margin: 0, flex: "1" }}>
                4. Address:
              </InputLabel>
              <div style={{ flex: "2" }}>
                <TextField
                  id="standard-basic"
                  fullWidth
                  variant="standard"
                  multiline
                  minRows={4}
                  {...form.register("address")}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px",
                    gap: "4px",
                  }}
                >
                  <p style={{ margin: "0", flex: "1" }}>Telephone No:</p>
                  <TextField
                    id="standard-basic"
                    sx={{ flex: "2" }}
                    variant="standard"
                    {...form.register("telephone")}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px",
                    gap: "4px",
                  }}
                >
                  <p style={{ margin: 0, flex: "1" }}>Fax:</p>
                  <TextField
                    id="standard-basic"
                    sx={{ flex: "2" }}
                    variant="standard"
                    {...form.register("fax")}
                  />
                </div>
              </div>
            </li>
            {/* 5. Medium of advertisements applied for: */}
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ margin: "0", flex: "1" }}>
                5. Medium of advertisements applied for:
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="mediumOfAdvertisements"
                  {...form.register("mediumOfAdvertisements")}
                  onChange={(e) => {
                    form.setValue(
                      "mediumOfAdvertisements",
                      e.target.defaultValue
                    );
                  }}
                >
                  <FormControlLabel
                    value="illuminated"
                    control={<Radio />}
                    label="Illuminated"
                  />
                  <FormControlLabel
                    value="Non Illuminated"
                    control={<Radio />}
                    label="Non Illuminated."
                  />
                </RadioGroup>
              </FormControl>
            </li>
            {/* 6. Form of Advertisement: */}
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ margin: "0", flex: "1" }}>
                6. Form of Advertisement:
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="formOfAdvertisements"
                  {...form.register("formOfAdvertisements")}
                  onChange={(e) => {
                    form.setValue(
                      "formOfAdvertisements",
                      e.target.defaultValue
                    );
                  }}
                >
                  <FormControlLabel
                    value="Temporary"
                    control={<Radio />}
                    label="Temporary"
                  />
                  <FormControlLabel
                    value="Non Temporary"
                    control={<Radio />}
                    label="Non Temporary"
                  />
                </RadioGroup>
              </FormControl>
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: "1" }}>
                7. Nature of advertisement applied
              </InputLabel>
              <TextField
                sx={{ flex: "2", margin: "0" }}
                id="standard-basic"
                variant="standard"
                {...form.register("natureOfAdvertisement")}
              />
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: "1" }}>
                8. Are you applying for display of free banner?
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="displayFreeBanner"
                  {...form.register("displayFreeBanner")}
                  onChange={(e) => {
                    form.setValue("displayFreeBanner", e.target.defaultValue);
                  }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  {form.watch("displayFreeBanner") === "yes" && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {/* a) Purpose */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>a) Purpose</p>
                        <FormControl sx={{ flex: "2" }}>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            {...form.register("status")}
                            onChange={(e) => {
                              form.setValue("status", e);
                            }}
                          >
                            <MenuItem value={"proprietary_firm"}>
                              Academic
                            </MenuItem>
                            <MenuItem value={"company"}>Religious</MenuItem>
                            <MenuItem value={"charitable_trust"}>
                              Public Awareness
                            </MenuItem>
                            <MenuItem value={"charitable_trust"}>
                              Health
                            </MenuItem>
                            <MenuItem value={"charitable_trust"}>
                              Political
                            </MenuItem>
                            <MenuItem value={"others"}>Others</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      {/* b) Period */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>b) Period</p>
                        <div style={{ flex: "2" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <div>
                              From:
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    From
                                  </span>
                                }
                                onChange={(date) => {
                                  console.log(
                                    moment(date).format("YYYY-MM-DD")
                                  );
                                }}
                                selected={form.getValues("fromDate")}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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
                            </div>
                            <div>
                              To:
                              <DatePicker
                                minDate={form.watch("fromDate")}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    From
                                  </span>
                                }
                                onChange={(date) => {
                                  console.log(
                                    moment(date).format("YYYY-MM-DD")
                                  );
                                }}
                                selected={form.getValues("fromDate")}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* c) Location */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>c) Location</p>
                        <FormControl sx={{ flex: "2" }}>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="locationType"
                            {...form.register("locationType")}
                            onChange={(e) => {
                              form.setValue(
                                "locationType",
                                e.target.defaultValue
                              );
                            }}
                          >
                            <FormControlLabel
                              value="Single"
                              control={<Radio />}
                              label="Single"
                            />
                            <div>
                              <FormControlLabel
                                value="Multiple"
                                control={<Radio />}
                                label="Multiple"
                              />
                              {form.watch("locationType") === "Multiple" && (
                                <TextField
                                  size="small"
                                  label="No. of locations"
                                  {...form.register("noOfLocations")}
                                />
                              )}
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      {/* d) Text of the message on free banner */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>
                          d) Text of the message on free banner
                        </p>
                        <TextField
                          size="small"
                          sx={{ flex: "2" }}
                          id="standard-basic"
                          variant="standard"
                          {...form.register("messageOnBanner")}
                        />
                      </div>
                      {/* e) Indicate the category of Civic message you propose to carry */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>
                          e) Indicate the category of Civic message you propose
                          to carry
                        </p>
                        <TextField
                          size="small"
                          sx={{ flex: "2" }}
                          id="standard-basic"
                          variant="standard"
                          {...form.register("categoryOfCivicMessage")}
                        />
                      </div>
                      {/* f) Indicate the category of Civic message you propose to carry */}
                      <div style={{ display: "flex" }}>
                        <p style={{ flex: "1" }}>
                          f) Whether photocopy of Trust Registration attached
                        </p>
                        <FormControl sx={{ flex: "2" }}>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="isPhotoCopyAttached"
                            {...form.register("isPhotoCopyAttached")}
                            onChange={(e) => {
                              form.setValue(
                                "isPhotoCopyAttached",
                                e.target.defaultValue
                              );
                            }}
                          >
                            <FormControlLabel
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </FormControl>
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: "1" }}>9. Dimensions:</InputLabel>
              <div style={{ flex: "2" }}>{/* TODO add table */}</div>
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: "1" }}>10. Site Location:</InputLabel>
              <div
                style={{
                  flex: "2",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <p style={{ flex: "1" }}>
                    Name of the Road drawing visibility:
                  </p>
                  <TextField
                    size="small"
                    sx={{ flex: "2" }}
                    id="standard-basic"
                    variant="standard"
                    {...form.register("roadDrawingVisibilityName")}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ flex: "1" }}>Width of the Road:</p>
                  <TextField
                    size="small"
                    sx={{ flex: "2" }}
                    id="standard-basic"
                    variant="standard"
                    {...form.register("roadWidth")}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ flex: "1" }}>
                    No. of hoarding located within 25 mtr.:
                  </p>
                  <TextField
                    size="small"
                    sx={{ flex: "2" }}
                    id="standard-basic"
                    variant="standard"
                    {...form.register("roadWidth")}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ flex: "1" }}>
                    No. of trees within 25 mtr. on either side:
                  </p>
                  <TextField
                    size="small"
                    sx={{ flex: "2" }}
                    id="standard-basic"
                    variant="standard"
                    {...form.register("roadWidth")}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <p style={{ flex: "1" }}>
                    Whether trees are required to cut:
                  </p>
                  <FormControl sx={{ flex: "2" }}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="treesRequiredToCut"
                      {...form.register("treesRequiredToCut")}
                      onChange={(e) => {
                        form.setValue(
                          "treesRequiredToCut",
                          e.target.defaultValue
                        );
                      }}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: 1 }}>
                11. Name of the Landlord:
              </InputLabel>
              <TextField
                sx={{ flex: "2" }}
                id="standard-basic"
                variant="standard"
                {...form.register("landlordName")}
              />
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: 1 }}>
                12. NOC of the Landlord submitted:
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="landlordNOCSubmitted"
                  {...form.register("landlordNOCSubmitted")}
                  onChange={(e) => {
                    form.setValue(
                      "landlordNOCSubmitted",
                      e.target.defaultValue
                    );
                  }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </li>
            <li
              style={{ display: "flex", alignItems: "start", padding: "4px" }}
            >
              <InputLabel style={{ flex: 1 }}>
                13. Whether documents submitted as per rule 17 (b):
              </InputLabel>
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="documentsSubmittedAsRule"
                  {...form.register("documentsSubmittedAsRule")}
                  onChange={(e) => {
                    form.setValue(
                      "documentsSubmittedAsRule",
                      e.target.defaultValue
                    );
                  }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </li>
          </ol>
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
