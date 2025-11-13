import { useContext, useEffect } from "react";
import AppContext from "../features/AppContext";
import { useSignupModal } from "../features/SignupModalContext";

const RestrictToRead = (props) => {
    const { children } = props;
    const { profile } = useContext(AppContext);
    const { openSignUpModal } = useSignupModal()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!localStorage.getItem("profile")) openSignUpModal(false);
        }, 90000);

        return () => {
            clearTimeout(timeoutId); // Clear the timeout when the component unmounts or dependencies change
        };
    }, [profile]);

    return (
        <>
            {children}
        </>
    );
};
export default RestrictToRead;
