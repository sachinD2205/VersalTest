import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../components/common/theme";
import createEmotionCache from "./createEmotionCache";

import "../styles/globals.css";
import { store, persistor } from "../features/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { RouteGuard } from "../features/RouteGaurd";
import Loader from "../features/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import BasicLayout from "../containers/Layout/BasicLayout";
import { useRouter } from "next/router";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();
  console.log("router.asPath", router.asPath);

  if (
    router.asPath == "/login" ||
    router.asPath == "/adminLogin" ||
    router.asPath == "/adminLogout" ||
    router.asPath == "/departmentLogin" ||
    router.asPath == "/DepartmentDashboard" ||
    router.asPath == "/Register" ||
    router.asPath == "/ForgotPassword" ||
    router.asPath == "/VerificationVerify"
  ) {
    return (
      <>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Loader />
                <RouteGuard>
                  <Loader />
                  <CssBaseline />
                  <Component {...pageProps} />
                </RouteGuard>
              </PersistGate>
            </Provider>
          </ThemeProvider>
        </CacheProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          pauseOnVisibilityChange
          closeOnClick
          pauseOnHover
        />
      </>
    );
  } else {
    return (
      <>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Loader />
                <RouteGuard>
                  <Loader />
                  <BasicLayout>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </BasicLayout>
                </RouteGuard>
              </PersistGate>
            </Provider>
          </ThemeProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
          />
        </CacheProvider>
      </>
    );
  }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

// import "../styles/globals.css";
// import { store, persistor } from "../features/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { Provider } from "react-redux";
// import { RouteGuard } from "../features/RouteGaurd";
// import Loader from "../features/Loader";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import BasicLayout from "../containers/Layout/BasicLayout";
// import { useRouter } from "next/router";

// function MyApp({ Component, pageProps }) {
//   const router = useRouter();

//   if (router.asPath == "/login") {
//     return (
//       <>
//         <Provider store={store}>
//           <PersistGate loading={null} persistor={persistor}>
//             <Loader />
//             <RouteGuard>
//               <Loader />
//               <Component {...pageProps} />
//             </RouteGuard>
//           </PersistGate>
//         </Provider>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           draggable={false}
//           pauseOnVisibilityChange
//           closeOnClick
//           pauseOnHover
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <Loader />
//           <RouteGuard>
//             <Loader />
//             {/* <BasicLayout> */}
//               <Component {...pageProps} />
//             {/* </BasicLayout> */}
//           </RouteGuard>
//         </PersistGate>
//       </Provider>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         draggable={false}
//         pauseOnVisibilityChange
//         closeOnClick
//         pauseOnHover
//       />
//     </>
//   );
// }

// export default MyApp;
