import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
// import crypto from "crypto";
// import axios from "axios";

const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const encryptBasic = (value) => {
  //   const iv = Buffer.from("a188155a235083f4eb2959024fc030b5", "hex");
  //   const KEY = Buffer.from(
  //     "A4D67DC3899EFE72A4AA898391B00C9D",
  //     "hex"
  //   );
  //   const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  //   let encrypted = cipher.update(JSON.stringify(value), "utf8", "base64");
  //   encrypted += cipher.final("base64");
  //   return [encrypted, iv, cipher.getAuthTag()];
  // };

  // const encrypt = (data) => {
  //   const [encrypted, iv, authTag] = encryptBasic(data);
  //   const bufferEncrypted = Buffer.from(encrypted, "base64");
  //   const arr = [bufferEncrypted, authTag];
  //   const finalReturn = Buffer.concat(arr);
  //   const finalEncryptedRequest = finalReturn.toString("base64");
  //   return finalEncryptedRequest;
  // };

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);

    // let merchant_id = encrypt(data.merchant_id);
    // let merchant_id = encrypt(data.merchant_id);

    // let key = "A4D67DC3899EFE72A4AA898391B00C9D";
    // // const CryptoJS = require("crypto-js");
    // // const merchant_id = CryptoJS.AES.encrypt(data.merchant_id, key);
    // console.log("merchant_id", merchant_id.toString());

    // let formData = new FormData();
    // formData.append(
    //   "order_id",
    //   CryptoJS.AES.encrypt(data.merchant_id, key).toString()
    // );
    // formData.append(
    //   "order_id",
    //   CryptoJS.AES.encrypt(data.order_id, key).toString()
    // );
    // formData.append(
    //   "currency",
    //   CryptoJS.AES.encrypt(data.currency, key).toString()
    // );
    // formData.append(
    //   "amount",
    //   CryptoJS.AES.encrypt(data.amount, key).toString()
    // );
    // formData.append(
    //   "redirect_url",
    //   CryptoJS.AES.encrypt(data.redirect_url, key).toString()
    // );
    // formData.append(
    //   "cancel_url",
    //   CryptoJS.AES.encrypt(data.cancel_url, key).toString()
    // );
    // formData.append(
    //   "language",
    //   CryptoJS.AES.encrypt(data.language, key).toString()
    // );

    // console.log("formData", formData);
    // axios
    //   .post(
    //     `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction`,
    //     formData
    //   )
    //   .then((res) => {
    //     console.log("Done");
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12}>
          <table width="40%" height="100" border="1" align="center">
            <caption>
              <font size="4" color="blue">
                <b>Integration Kit</b>
              </font>
            </caption>
          </table>
        </Grid>
        <Grid item xs={12}>
          <table width="40%" height="100" border="1" align="center">
            <tr>
              <td>Parameter Name:</td>
              <td>Parameter Value:</td>
            </tr>
            <tr>
              <td colspan="2">Compulsory information</td>
            </tr>
            <tr>
              <td>Merchant Id</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="merchant_id"
                  variant="standard"
                  {...register("merchant_id")}
                  error={!!errors?.merchant_id}
                  InputLabelProps={{
                    shrink: !!register("merchant_id").value,
                  }}
                  helperText={errors?.merchant_id?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Order Id</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="order_id"
                  variant="standard"
                  {...register("order_id")}
                  error={!!errors?.order_id}
                  InputLabelProps={{
                    shrink: !!register("order_id").value,
                  }}
                  helperText={errors?.order_id?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Currency</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="currency"
                  variant="standard"
                  defaultValue="INR"
                  {...register("currency")}
                  error={!!errors?.currency}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.currency?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="amount"
                  variant="standard"
                  defaultValue="1.00"
                  {...register("amount")}
                  error={!!errors?.amount}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.amount?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Redirect URL</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="redirect_url"
                  variant="standard"
                  defaultValue="http://127.0.0.1:3001/ccavResponseHandler"
                  {...register("redirect_url")}
                  error={!!errors?.redirect_url}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.redirect_url?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Cancel URL</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="cancel_url"
                  variant="standard"
                  defaultValue="http://127.0.0.1:3001/ccavResponseHandler"
                  {...register("cancel_url")}
                  error={!!errors?.cancel_url}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.cancel_url?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Language</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="language"
                  variant="standard"
                  defaultValue="EN"
                  {...register("language")}
                  error={!!errors?.language}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.language?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td colspan="2">Billing information(optional):</td>
            </tr>
            <tr>
              <td>Billing Name</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="billing_name"
                  variant="standard"
                  defaultValue="Peter"
                  {...register("billing_name")}
                  error={!!errors?.billing_name}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.billing_name?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Billing Address:</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="billing_address"
                  variant="standard"
                  defaultValue="Santacruz"
                  {...register("billing_address")}
                  error={!!errors?.billing_address}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.billing_address?.message || ""}
                />
              </td>
            </tr>
            {/* Add other billing fields similarly */}
            <tr>
              <td colspan="2">Shipping information(optional):</td>
            </tr>
            <tr>
              <td>Shipping Name</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="delivery_name"
                  variant="standard"
                  defaultValue="Sam"
                  {...register("delivery_name")}
                  error={!!errors?.delivery_name}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.delivery_name?.message || ""}
                />
              </td>
            </tr>
            <tr>
              <td>Shipping Address:</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="delivery_address"
                  variant="standard"
                  defaultValue="Vile Parle"
                  {...register("delivery_address")}
                  error={!!errors?.delivery_address}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.delivery_address?.message || ""}
                />
              </td>
            </tr>
            {/* Add other shipping fields similarly */}
            <tr>
              <td>Merchant Param1</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="merchant_param1"
                  variant="standard"
                  defaultValue="additional Info."
                  {...register("merchant_param1")}
                  error={!!errors?.merchant_param1}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors?.merchant_param1?.message || ""}
                />
              </td>
            </tr>
            {/* Add other merchant param fields similarly */}
            <tr>
              <td>Promo Code:</td>
              <td>
                <TextField
                  sx={{ width: "80%" }}
                  id="promo_code"
                  variant="standard"
                  {...register("promo_code")}
                  error={!!errors?.promo_code}
                  InputLabelProps={{
                    shrink: !!register("promo_code").value,
                  }}
                  helperText={errors?.promo_code?.message || ""}
                />
              </td>
            </tr>
          </table>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "center", justifyContent: "center", marginTop: "1vh" }}
        >
          <Button
            variant="outlined"
            type="submit"
            style={{
              padding: "10px 24px",
              fontSize: "16px",
              backgroundColor: "green",
              color: "white",
              borderRadius: "5px",
            }}
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Index;
