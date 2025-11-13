import { Box, Text } from "@chakra-ui/react";
import { getExpertbyId } from "../../../queries/strapiQueries";
import { useState } from "react";
import { useContext } from "react";
import AppContext from "../../AppContext";
import FollowCard from "../FollowCard";
const FollowList = ({ list, type, onClose, refetch }) => {
    const { profile, isFollowing, FollowOrUnFollow } = useContext(AppContext);
    const [followInProgress, setFollowInProgress] = useState({ show: false });

    const getBtnInfo = (item, index) => {
        let text = isFollowing(
            type === "Followings" ? item.following?.id : item.follower?.id
        );
        let data = {
            btnText: text ? "Following" : "Follow",
            btnLoading:
                followInProgress.show &&
                followInProgress.key === "followCard_" + item?.id
        };
        return data;
    };
    const getUserDetails = (item) => {
        return {
            fullName: item?.fullName
                ? item?.fullName
                : item?.company?.name
                ? item?.company?.name
                : item?.slug,
            picUrl: item?.profilePic?.url
                ? item?.profilePic?.url
                : "/assets/images/p_stamp.png",
            link: item?.albums?.length ? item?.albums[0].slug : item?.slug
        };
    };
    const callToAction = (data, item, index) => {
        if (index === "followCard_" + item?.id)
            setFollowInProgress({ key: "followCard_" + item?.id, show: true });
        if (profile) {
            FollowOrUnFollow(data, (resp) => {
                if (resp) {
                    getBtnInfo(item, "followCard_" + item?.id);
                    if (refetch) refetch();
                    setFollowInProgress(false);
                }
            });
        }
    };
    return (
        <Box w="100%" h="50vh">
            {list && list.length ? (
                list.map((item) => {
                    return (
                        <FollowCard
                            onClose={onClose}
                            key={"followCard_" + item?.id}
                            followData={getUserDetails(
                                type === "Followings"
                                    ? item.following
                                    : item.follower
                            )}
                            BtnInfo={getBtnInfo(item, "followCard_" + item?.id)}
                            btnAction={(data) => {
                                if (data)
                                    callToAction(
                                        data,
                                        item,
                                        "followCard_" + item?.id
                                    );
                            }}
                            itemId={
                                type === "Followings"
                                    ? item.following?.id
                                    : item.follower?.id
                            }
                        />
                    );
                })
            ) : (
                <Text textAlign={"center"}>No {type} Yet</Text>
            )}
        </Box>
    );
};
export default FollowList;
