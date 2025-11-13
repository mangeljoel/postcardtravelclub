import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppContext from "../features/AppContext";
import { validateSignup } from "../queries/strapiQueries";
import strapi from "../queries/strapi.js";
import * as ga from "./googleAnalytics";
import PostcardModal from "../features/PostcardModal";
import SignUpInModal from "../features/HomePage1/SignUpInModal.jsx";
import SignUpInfoModal from "../features/HomePage1/SignUpInfoModal.jsx";
// import ModalSignupLogin from "../features/ModalSignupLogin";

const AccessCodeLogin = () => {
    const { updateUser, callTokenLogin, profile, logOut } =
        useContext(AppContext);
    const [showLogin, setShowLogin] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const router = useRouter();
    const { pathname, query } = router;
    useEffect(() => {
        const handleStorage = () => {
            setShowLogin(false);
            let unAuthorized = localStorage.getItem("unAuthorizedUser");
            if (unAuthorized === "true") {
                if (!profile) {
                    logOut();
                    setShowLogin({ isShow: true, mode: "login" });
                    localStorage.setItem("unAuthorizedUser", false);
                }
            }
        };

        window.addEventListener("storage", handleStorage());
        return () => window.removeEventListener("storage", handleStorage());
    }, []);
    useEffect(() => {
        if (router.query && router.query.access_code) {
            validateSignup(router.query.access_code)
                .then((response) => {
                    if (response.user) {
                        if (response.isNew) {
                            ga.event({
                                action: "event",
                                category: "newuser_signup_success",
                                label: "signup_success",
                                value: 1
                            });
                        } else {
                            ga.event({
                                action: "event",
                                category: "existinguser_signin_success",
                                label: "signin_success",
                                value: 1
                            });
                        }
                        strapi.setToken(response.jwt);
                        response.user.isReload = true;

                        callTokenLogin(response, false).then((resp) => {
                            const params = new URLSearchParams(query);
                            params.delete("access_code");
                            router.replace(
                                { pathname, query: params.toString() },
                                undefined,
                                { shallow: true }
                            );
                        });
                    }
                })
                .catch(() => {
                    //console.log(error);
                });
        }
    }, [router.query]);
    return (
        // <PostcardModal
        //     isShow={showLogin.isShow}
        //     headerText={
        //         showLogin.mode === "login" ? "Sign in" : "Free Sign Up!"
        //     }
        //     size={showLogin.mode === "login" ? "xl" : "sm"}
        //     children={
        //         <ModalSignupLogin
        //             mode={showLogin.mode}
        //             isSchedulerOpen={true}
        //             toggleMode={() =>
        //                 setShowLogin({
        //                     isShow: true,
        //                     mode:
        //                         showLogin.mode === "login" ? "signup" : "login"
        //                 })
        //             }
        //             handleClose={() => {
        //                 setShowLogin(false);
        //             }}
        //         />
        //     }
        //     handleClose={() => setShowLogin(false)}
        // />
        <>
            <SignUpInModal
                isShow={showLogin.isShow}
                mode={showLogin.mode}
                setShowModal={setShowLogin}
                setShowSignModal={setShowSignModal}
            />
            <SignUpInfoModal
                state={showSignModal}
                setShowSignModal={setShowSignModal}
            />
        </>
    );
};
export default AccessCodeLogin;
