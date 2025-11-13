import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import LoadingGif from "../../../patterns/LoadingGif";
import NotPrivileged from "../../../patterns/NotPrivileged";
import DashboardTable from "../DashboardTable";

const EicDashboard = () => {
    const { profile } = useContext(AppContext);
    const [isPrevilaged, setIsPrevilaged] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (profile && profile.user_type?.name === "EditorInChief")
            setIsPrevilaged(true);
        else setIsPrevilaged(false);
        setLoading(false);
    }, [profile]);
    return (
        <Box>
            {loading ? (
                <LoadingGif />
            ) : isPrevilaged ? (
                <Box p={6} w="100%">
                    <DashboardTable role="eic" profile={profile} />
                </Box>
            ) : (
                <NotPrivileged profile={profile} />
            )}
        </Box>
    );
};
export default EicDashboard;
