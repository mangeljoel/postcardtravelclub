/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { AppContextContainer } from "../src/features/AppContext";
import { DefaultSeo } from "next-seo";
import SEO from "../src/services/defaultSEO";
import AppFooter from "../src/features/AppFooter";
import NavHeader from "../src/features/NavHeader";
import ChakraUIContainer from "../src/styles/ChakraUI";
import { QueryClient, QueryClientProvider } from "react-query";
import { Context as ResponsiveContext } from "react-responsive";

import "../src/styles/global.scss";
import "../src/global.js";

import { useRouter } from "next/router";

// const CookieConsent = dynamic(() => import("react-cookie-consent"), {
//   suspense: true,
// });

import * as gtag from "../src/services/googleAnalytics";
import * as fbq from "../src/services/fbPixel";
import AccessCodeLogin from "../src/services/AccessCodeLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModalProvider } from "../src/features/SignupModalContext/index.jsx";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// const consetForCookies = (
//   <CookieConsent
//     style={{
//       background: "#568DFB",
//     }}
//     buttonClasses="btn btn-primary"
//     enableDeclineButton
//     declineButtonText="Close"
//     buttonStyle={{
//       background: "#f5896d",
//       color: "white",
//       fontWeight: "bolder",
//       borderRadius: "10px",
//     }}
//     declineButtonStyle={{
//       borderColor: "#f5896d",
//       borderWidth: "3px",
//       fontWeight: "bold",
//       color: "#f5896d",
//       background: "white",
//       cursor: "pointer",
//       boxShadow: "none",
//       borderRadius: "10px",
//     }}
//   >
//     Our website uses cookies to improve your experience. Learn more about
//     cookies in our{" "}
//     <a
//       href="https://postcard.travel/privacy"
//       target="_blank"
//       rel="noreferrer noopener"
//     >
//       privacy policy
//     </a>
//   </CookieConsent>
// );

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = async (url) => {
      fbq.pageview();
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const getColorName = () => {
    if (
      router.pathname === "/test" ||
      router.pathname === "/partnerships" ||
      router.pathname === "/local-stories"
    )
      return "white";
    else return "primary_3";
  };

  return (
    <React.Fragment>
      <ChakraUIContainer>
        <ResponsiveContext.Provider value={{ width: 1440 }}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <QueryClientProvider client={queryClient}>
              <AppContextContainer>
                <ModalProvider>
                  {() => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100vh",
                      }}
                    >
                      <AccessCodeLogin />
                      <div style={{ flex: 1 }}>
                        <DefaultSeo {...SEO} />
                        {!global.$isNoHeader && (
                          <NavHeader fontcolor={getColorName()} />
                        )}
                        <div style={{ minHeight: "50vh", marginTop: "8%" }}>
                          <Component {...pageProps} />
                        </div>
                      </div>

                      {!global.$isNoFooter &&
                        router.pathname !== "/chatbot" && <AppFooter />}
                      {/* <Suspense>{consetForCookies}</Suspense> */}
                    </div>
                  )}
                </ModalProvider>
              </AppContextContainer>
            </QueryClientProvider>
          </GoogleOAuthProvider>
        </ResponsiveContext.Provider>
      </ChakraUIContainer>
    </React.Fragment>
  );
};

export default MyApp;
