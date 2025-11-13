import { useContext } from "react";
import AppContext from "../../features/AppContext";
import { Box, Heading } from "@chakra-ui/react";
import React, { useState } from "react";
import { joinTribeBtnText } from "../../constants/stringConstants";
// import ModalSignupLogin from "../../features/ModalSignupLogin";
import PostcardModal from "../../features/PostcardModal";
import * as ga from "../../services/googleAnalytics";
import LogInButton from "./LoginButton";

const LogInButtons = ({ mode, title, component, cta }) => {
    const { profile } = useContext(AppContext);
    const [showModal, setShowModal] = useState({ mode: "", isShow: false });
    const SingUPhandleClick = () => {
        setShowModal({
            mode: mode,
            isShow: true
        });
        // ga.event({
        //     action: "click",
        //     category: mode,
        //     label: "signin_popup_click",
        //     value: 2
        // });
    };

    return (
        <>
            <Box
                display={profile ? "none" : "block"}
                onClick={SingUPhandleClick}
            >
                {title && <Heading my="2em">{title}</Heading>}
                {component ? (
                    component
                ) : (
                    <LogInButton
                        buttontext={
                            cta
                                ? cta
                                : showModal.mode === "login"
                                ? "Sign in"
                                : joinTribeBtnText
                        }
                    />
                )}
            </Box>
            {/* <PostcardModal
                isShow={showModal.isShow}
                headerText={
                    showModal.mode === "login" ? "Sign in" : "Free Sign Up!"
                }
                size={showModal.mode === "login" ? "xl" : "sm"}
                children={
                    <ModalSignupLogin
                        mode={showModal.mode}
                        toggleMode={() =>
                            setShowModal({
                                isShow: true,
                                mode:
                                    showModal.mode === "login"
                                        ? "signup"
                                        : "login"
                            })
                        }
                        handleClose={() => setShowModal(false)}
                    />
                }
                handleClose={() => setShowModal(false)}
            /> */}
        </>
    );
};

export default LogInButtons;
