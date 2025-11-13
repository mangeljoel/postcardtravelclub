import { useState, useContext, useEffect } from "react";
import AppContext from "../AppContext";
import NotPrivileged from "../../patterns/NotPrivileged";
const AdminPages = ({ isAdminOnly, childrenComponent }) => {
    const { profile } = useContext(AppContext);
    const [previlege, setPrevilege] = useState(false);
    useEffect(() => {
        if (profile && isAdminOnly) {
            if (
                profile?.user_type?.name === "SuperAdmin" ||
                profile?.user_type?.name === "Admin"
            )
                setPrevilege(true);
            else setPrevilege(false);
        } else if (
            !isAdminOnly &&
            profile &&
            profile?.user_type?.name !== "Regular"
        )
            setPrevilege(true);
        else setPrevilege(false);
    }, [profile]);
    return (
        <>
            {previlege ? (
                childrenComponent
            ) : (
                <NotPrivileged profile={profile} />
            )}
        </>
    );
};
export default AdminPages;
