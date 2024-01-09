import { useCallback, useState } from "react";
import axios from "axios";
import { useModel } from "umi";
import { notification, message } from "antd";

const useAxios = () => {
  const { token } = useModel("Auth");
  const echHost = localStorage.getItem("echHost");
  const mhrHost = localStorage.getItem("mhrHost");
  const echDbName = localStorage.getItem("echDbName");
  const echSchemaName = localStorage.getItem("echSchemaName");
  const mhrDbName = localStorage.getItem("mhrDbName");
  const mhrSchemaName = localStorage.getItem("mhrSchemaName");
  const servarthId = localStorage.getItem("servarthId");
  const langType =
    localStorage.getItem("umi_locale") === "ma-IN" ? "mr-IN" : "en-US";
  const customMessageError = (msgData) => {
    // switch (msgData) {
    //  case ''
    // }
    message.info(`${msgData}`);
  };

  const openNotification = (type, placement) => {
    notification[type]({
      message: "Data Fetched",
      description: `Modification Data for Village fetched!`,
      placement,
      onClick: () => {
        // function on notification click can be added here!
        console.log("Notification Clicked!");
      },
    });
  };

  const sendRequest = useCallback(
    async (url, type = "GET", reqData, callback, errorCallback) => {
      if (type === "POST") {
        await axios
          .post(url, reqData, {
            headers: {
              "Accept-Language": langType,
              Authorization: `Bearer ${token}`,
              //   echHost: echHost,
              //   mhrHost: mhrHost,
              //   echDbName: echDbName,
              //   echSchemaName: echSchemaName,
              //   mhrDbName: mhrDbName,
              //   mhrSchemaName: mhrSchemaName,
              //   servarthId: servarthId,
            },
          })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
          });
      } else if (type === "PUT") {
        await axios
          .put(url, reqData, {
            headers: {
              "Accept-Language": langType,
              Authorization: `Bearer ${token}`,
              echHost: echHost,
              mhrHost: mhrHost,
              echDbName: echDbName,
              echSchemaName: echSchemaName,
              mhrDbName: mhrDbName,
              mhrSchemaName: mhrSchemaName,
              servarthId: servarthId,
            },
          })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (type === "PATCH") {
        await axios
          .patch(url, reqData, {
            headers: {
              "Accept-Language": langType,
              Authorization: `Bearer ${token}`,
              echHost: echHost,
              mhrHost: mhrHost,
              echDbName: echDbName,
              echSchemaName: echSchemaName,
              mhrDbName: mhrDbName,
              mhrSchemaName: mhrSchemaName,
              servarthId: servarthId,
            },
          })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (type === "GET") {
        await axios
          .get(url, {
            headers: {
              "Accept-Language": langType,
              Authorization: `Bearer ${token}`,
              echHost: echHost,
              mhrHost: mhrHost,
              echDbName: echDbName,
              echSchemaName: echSchemaName,
              mhrDbName: mhrDbName,
              mhrSchemaName: mhrSchemaName,
              servarthId: servarthId,
            },
          })
          .then((response) => {
            if (response.data.status === "FAILURE") {
              message.error(response.data.message);
              console.log(response);
            }
            callback(response);
          })
          .catch((error) => {
            console.log("error", error);
            message.error(error.response.data.message);
            if (errorCallback) {
              errorCallback(error.response);
            }
            console.log(error);
          });
      } else if (type === "DELETE") {
        await axios
          .delete(url, {
            headers: {
              "Accept-Language": langType,
              Authorization: `Bearer ${token}`,
              echHost: echHost,
              mhrHost: mhrHost,
              echDbName: echDbName,
              echSchemaName: echSchemaName,
              mhrDbName: mhrDbName,
              mhrSchemaName: mhrSchemaName,
              servarthId: servarthId,
            },
          })
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
            if (errorCallback) {
              errorCallback(error.response);
            }
          });
      }
    },
    [token],
  );

  return {
    sendRequest,
  };
};

export default useAxios;
