import React, { useEffect, useContext, useState } from "react";
import { useQuery } from "react-query";
// import { useGoogleLogin } from "react-google-login";
import { Image, Box } from "@chakra-ui/react";

import AppContext from "../AppContext";
import { createProfile } from "../../queries/strapiQueries";
import SignIn from "./SignIn";
import PostcardAlert from "../PostcardAlert";
import "../../../src/global.js";
import strapi from "../../queries/strapi.js";

import * as ga from "../../services/googleAnalytics";

const GOOGLE_CLIENT_ID =
    "693038270178-0qtf72562knm0v22s5burodrg5k7cgbj.apps.googleusercontent.com";

const FACEBOOK_ID = "2483229551716958";

const JoinTribe = ({ mode, toggleMode, handleClose, isSchedulerOpen }) => {
    const { setProfile, callAuthService } = useContext(AppContext);

    const [userData, setUserData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileData, setprofileData] = useState(null);

    const [isSuccess, setSuccess] = useState({
        mode: false,
        message: "success"
    });
    // const {
    //     data: userprofileData,
    //     isLoading: isprofileLoading,
    //     refetch: refetchprofile,
    //     isIdle: isprofileQueryIdle
    // } = useQuery(
    //     ["fetchProfile", userData?.id],
    //     () =>
    //         strapi
    //             .find("profiles/?user.id=" + userData?.id)
    //             .then((response) => {
    //                 setprofileData(response);
    //                 //console.log(response, profileData);
    //             }),
    //     {
    //         refetchOnWindowFocus: false,
    //         enabled: !!userData?.id
    //     }
    // );
    // useEffect(() => {
    //     if (profileData) {
    //         // //console.log(profileData);
    //         const profiles = profileData;
    //         // //console.log(profileData, profiles);
    //         if (profiles && profiles.length > 0) {
    //             let prof = profiles[0];
    //             if (isSchedulerOpen) prof.isScheduler = true;
    //             setProfile(prof);
    //             setIsSubmitting(false);
    //             handleClose();
    //         } else if (profiles && profiles.length === 0) {
    //             let data = {
    //                 user: userData.id,
    //                 Name: userData.name ? userData.name : userData.username,
    //                 Userlink: userData.name ? userData.name : userData.username,
    //                 FbId: userData.userID ? userData.userID : null
    //             };
    //             createProfile(data).then((response) => {
    //                 if (response) {
    //                     let prof = response;
    //                     if (isSchedulerOpen) prof.isScheduler = true;
    //                     setProfile(prof);
    //                 }
    //             });
    //             setIsSubmitting(false);
    //             handleClose();
    //         }
    //     }
    // }, [profileData]);

    // const callAuthService1 = async (provider, token) => {
    //     try {
    //         const response = await fetch(
    //             `https://proconnect.postcard.travel/auth/${provider}/callback?code=${token}`
    //         );

    //         const data = await response.json();
    //         //console.log(data, "user data");
    //         if (data)
    //             ga.event({
    //                 action: "click",
    //                 category: "signin",
    //                 label: "signin_success",
    //                 value: 3
    //             });
    //         setUserData((prev) => ({ ...prev, id: data.user.id }));
    //         strapi
    //             .find("profiles/?user.id=" + userData?.id)
    //             .then((response) => {
    //                 setprofileData(response);
    //                 //console.log(response, profileData);
    //                 if (profileData) {
    //                     // //console.log(profileData);
    //                     const profiles = profileData;
    //                     // //console.log(profileData, profiles);
    //                     if (profiles && profiles.length > 0) {
    //                         let prof = profiles[0];
    //                         if (isSchedulerOpen) prof.isScheduler = true;
    //                         setProfile(prof);
    //                         setIsSubmitting(false);
    //                         handleClose();
    //                     } else if (profiles && profiles.length === 0) {
    //                         let data = {
    //                             user: userData.id,
    //                             Name: userData.name ? userData.name : userData.username,
    //                             Userlink: userData.name ? userData.name : userData.username
    //                         };
    //                         createProfile(data).then((response) => {
    //                             if (response) {
    //                                 let prof = response;
    //                                 if (isSchedulerOpen) prof.isScheduler = true;
    //                                 setProfile(prof);
    //                             }
    //                         });
    //                         setIsSubmitting(false);
    //                         handleClose();
    //                     }
    //                 }
    //             });

    //     } catch (error) {
    //         //console.log(error);
    //         alert(error.toString());
    //     }
    // };

    // const { signIn } = useGoogleLogin({
    //     clientId: GOOGLE_CLIENT_ID,
    //     onSuccess: (data) => {
    //         handleClose();
    //         callAuthService("google", data.accessToken, isSchedulerOpen);
    //         // setUserData(data.profileObj);
    //     }
    //     //   onFailure: (error) => //console.log(error)
    // });

    return (
        <>
            <SignIn
                mode={mode}
                onGoogleLogin={() => signIn()}
                facebookAppId={FACEBOOK_ID}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                onFacebookLogin={(response) => {
                    //console.log(response);
                    if (response.accessToken) {
                        callAuthService("facebook", response.accessToken);
                        setUserData(response);
                        //console.log(response, "fb response");
                        global.fbAccessToken = response.accessToken;
                    } else setSuccess(true, "SomeError");
                }}
                onLocalLogin={async (response) => {
                    if (response.user) {
                        // ga.event({
                        //     action: "click",
                        //     category: "current_user_signin_success",
                        //     label: "signin_success",
                        //     value: 3
                        // });
                        await setUserData(response.user);
                    } else {
                        setSuccess({
                            mode: true,
                            message: response.message.message
                        });
                    }
                }}
                toggleMode={toggleMode}
                onClose={handleClose}
            />
            <PostcardAlert
                isCentered={true}
                closeOnEsc={true}
                closeOnOverlayClick={true}
                show={isSuccess}
                // isSuccess={true}
                buttonText="OK"
                handleAction={() => {
                    setIsSubmitting(false);
                    setSuccess({ mode: false });
                }}
            />
        </>
    );
};

export default JoinTribe;
