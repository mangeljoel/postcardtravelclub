// contexts/ModalContext.js
import React, { createContext, useContext, useState } from 'react';
import SignUpInModal from '../HomePage1/SignUpInModal';
import SignUpInfoModal from '../HomePage1/SignUpInfoModal';

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState({
        mode: "",
        isShow: false,
        isClosable: true // Default value for closability
    });

    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });

    const openSignUpModal = (isClosable = true) => {
        setShowModal({
            mode: "signup",
            isShow: true,
            isClosable
        });
    };

    const openLoginModal = (isClosable = true) => {
        setShowModal({
            mode: "login",
            isShow: true,
            isClosable
        });
    };

    const closeModal = () => {
        setShowModal({
            mode: "",
            isShow: false,
            isClosable: true // Reset to default
        });
    };

    const toggleMode = () => {
        setShowModal(prev => ({
            isShow: true,
            mode: prev.mode === "login" ? "signup" : "login",
            isClosable: prev.isClosable // Maintain current closability state
        }));
    };

    const openSignInfoModal = (title, message) => {
        setShowSignModal({
            isShow: true,
            title,
            message
        });
    };

    const closeSignInfoModal = () => {
        setShowSignModal({
            isShow: false,
            title: "",
            message: ""
        });
    };

    return (
        <ModalContext.Provider
            value={{
                showModal,
                showSignModal,
                openSignUpModal,
                openLoginModal,
                closeModal,
                toggleMode,
                openSignInfoModal,
                closeSignInfoModal,
                setShowModal,
                setShowSignModal
            }}
        >
            <SignUpInModal
                isShow={showModal.isShow}
                mode={showModal.mode}
                setShowModal={setShowModal}
                setShowSignModal={setShowSignModal}
                isClosable={showModal.isClosable} // Pass the value to SignUpInModal
            />
            <SignUpInfoModal
                state={showSignModal}
                setShowSignModal={setShowSignModal}
            />
            {children()}
        </ModalContext.Provider>
    );
};

export const useSignupModal = () => useContext(ModalContext);