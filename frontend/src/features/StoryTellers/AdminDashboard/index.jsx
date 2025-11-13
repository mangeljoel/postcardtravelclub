import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import LoadingGif from "../../../patterns/LoadingGif";
import NotPrivileged from "../../../patterns/NotPrivileged";
import PostcardModal from "../../PostcardModal";
import CollectionForm from "../../CollectionForm";
import DashboardTable from "../DashboardTable";

const AdminDashboard = () => {
    const { profile } = useContext(AppContext);
    const [isPrevilaged, setIsPrevilaged] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (
            profile &&
            (profile.user_type?.name === "Admin" ||
                profile.user_type?.name === "SuperAdmin")
        )
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
                    {/* <Flex justify={"space-between"}>
                        <Text
                            fontSize="1.5rem"
                            textAlign={"left"}
                            color="primary_3"
                            fontWeight={"bold"}
                        >
                            {profile?.fullName || "Admin"}'s Assignment
                            Dashboard
                        </Text>
                        <Button
                            onClick={() => {
                                setCreateAlbum(false);
                                setShowCreateAlbum(true);
                            }}
                        >
                            Create New
                        </Button>
                        <PostcardModal
                            size="3xl"
                            isShow={showCreateAlbum}
                            headerText={"Create"}
                            children={
                                <CollectionForm
                                    onClose={() => {
                                        setShowCreateAlbum(false);
                                        setCreateAlbum(true);
                                    }}
                                    mode="create"
                                ></CollectionForm>
                            }
                            handleClose={() => setShowCreateAlbum(false)}
                        />
                    </Flex> */}
                    <DashboardTable role="admin" profile={profile} />
                </Box>
            ) : (
                <NotPrivileged profile={profile} />
            )}
        </Box>
    );
};
export default AdminDashboard;
