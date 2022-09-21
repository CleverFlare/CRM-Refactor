import React from "react";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { default as BASEURL } from "../data/APIs";
import { useSelector, useDispatch } from "react-redux";

const useRequest = ({
  path = null,
  method = null,
  successMessage = "sent successfully!",
  responseType = null,
}) => {
  //----useSelectors----
  const states = useSelector((state) => state);
  const userInfo = useSelector((state) => state.userInfo.value);

  // ---hooks invokes----
  const dispatch = useDispatch();

  //----states----
  const [isPending, setIsPending] = useState(false);

  const [totalData, setTotal] = useState(0);

  const [loadedData, setLoaded] = useState(0);

  const [failAlert, setFailAlert] = useState({
    open: false,
    message: "",
  });

  const [successAlert, setSuccessAlert] = useState({
    open: false,
    message: "",
  });

  const [serverResponse, setServerResponse] = useState(null);

  const request = async ({
    customBaseUrl = null,

    customMethod = null,

    customFullUrl = null,

    customPath = null,

    id = null,

    onSuccess = () => {},

    customSuccessMessage = null,

    customAuthorization = null,

    customToken = null,

    params = {},

    body = null,
  } = {}) => {
    setIsPending(true);

    // ----errors throws----
    if (!Boolean(path) && !Boolean(customPath))
      throw Error("you didn't specify a path for the request");

    if (!Boolean(BASEURL) && !Boolean(customBaseUrl))
      throw Error("there is no domain to send data");

    if (!Boolean(userInfo.token) && !Boolean(customToken))
      throw Error("there is no token to send data");

    if (!Boolean(method) && !Boolean(customMethod))
      throw Error("you didn't specify a method for the request");

    return axios({
      method: customMethod ? customMethod : method,
      baseURL: customFullUrl ? "" : BASEURL ? BASEURL : customBaseUrl,
      url: customFullUrl
        ? customFullUrl
        : `${customPath ? customPath : path}${id ? `${id}/` : ""}`,
      headers: {
        //prettier-ignore
        "Authorization": Boolean(customAuthorization) ? customAuthorization : `Token ${Boolean(customToken) ? customToken : userInfo.token}`,
      },
      params,
      data: body,
      responseType,
      onUploadProgress: (event) => {
        const { loaded, total } = event;
        setTotal(() => total);
        setLoaded(() => loaded);
      },
      onDownloadProgress: (event) => {
        const { loaded, total } = event;
        setTotal(() => total);
        setLoaded(() => loaded);
      },
    })
      .then((res) => {
        setIsPending(false);

        onSuccess(res);

        setSuccessAlert({
          open: true,
          message: Boolean(customSuccessMessage)
            ? customSuccessMessage
            : successMessage,
        });

        setServerResponse(res);

        return res.data;
      })
      .catch((err) => {
        switch (err?.response?.status) {
          case 401:
            Object.keys(states).map((state) =>
              dispatch({ type: `${state}/reset` })
            );
            dispatch({ type: "token/remove" });
            return;
          default:
            return err;
        }

        setIsPending(false);

        setServerResponse(err);

        const getValues = (data, values = []) => {
          if (typeof data !== "object") {
            return [...values, data];
          }
          return Object.values(data).flatMap((v) => getValues(v, values));
        };

        setFailAlert({
          open: true,
          message:
            err.response.status === 400
              ? getValues(err.response.data).join(" - ")
              : err.message,
        });

        return err;
      });
  };

  return [
    request,
    {
      isPending: isPending,
      successAlert: (
        <Snackbar
          open={successAlert.open}
          autoHideDuration={1000}
          onClose={() => setSuccessAlert((old) => ({ ...old, open: false }))}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setSuccessAlert((old) => ({ ...old, open: false }))}
          >
            {successAlert.message}
          </Alert>
        </Snackbar>
      ),
      failAlert: (
        <Snackbar
          open={failAlert.open}
          autoHideDuration={1000}
          onClose={() => setFailAlert((old) => ({ ...old, open: false }))}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setFailAlert((old) => ({ ...old, open: false }))}
          >
            {failAlert.message}
          </Alert>
        </Snackbar>
      ),
      total: totalData,
      loaded: loadedData,
      serverResponse: serverResponse,
    },
  ];
};

export default useRequest;
