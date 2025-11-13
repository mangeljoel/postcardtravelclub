import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import TabsPart from "../TabsPart";
import FollowList from "./FollowList";

const MyCircle = ({ userFollowings, userFollowers, followingFollowerTabIndex, refetch, onClose }) => {
    // useEffect(() => { }, [userFollowings, userFollowers])
    const tabData = [
        { name: "Followings", childComp: <FollowList type="Followings" refetch={refetch} onClose={onClose} list={userFollowings} /> },
        { name: "Followers", childComp: <FollowList type="Followers" refetch={refetch} onClose={onClose} list={userFollowers} /> }
    ]
    return <Box w="100%">
        <TabsPart variant="profileEdit" defaultTab={followingFollowerTabIndex} tabData={tabData} />
    </Box>
}
export default MyCircle;