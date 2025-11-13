import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
// import ModalSignupLogin from "../../features/ModalSignupLogin";
import PostcardModal from "../../features/PostcardModal";

const SignUpButton = ({ style, title }) => {
    const [showModal, setShowModal] = useState({ mode: "", isShow: false });
    const handleClick = () => {
        setShowModal({
            mode: "signup",
            isShow: true
        });
    };
    return (
        <>
            <Button
                style={style}
                _hover={{
                    transform: `scale(1.1)`
                }}
                onClick={handleClick}
            >
                {title}
            </Button>
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

export default SignUpButton;
