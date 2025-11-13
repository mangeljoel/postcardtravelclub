import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FollowCard from "../MyCircle/FollowCard";
import { getExpertbyId } from "../../queries/strapiQueries";
import LoadingGif from "../../patterns/LoadingGif";

const CollectionList = ({ list, onClose }) => {
    const router = useRouter();
    const [followInProgress, setFollowInProgress] = useState({ show: false });
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState(list);
    useEffect(() => {
        setLoading(true);
        setPageData();
    }, [list]);
    const setPageData = async () => {
        let bkmUsers = [];
        if (list && list.length >= 1) {
            const promises = list.map(async (bkm) => {
                const userData = await getExpertbyId(bkm.id);
                if (userData[0]) {
                    return userData[0];
                }
            });

            bkmUsers = await Promise.all(promises);
            bkmUsers = bkmUsers.filter((userData) => userData !== undefined);
            setUserList(bkmUsers);
            setLoading(false);
        }
    };

    const getBtnInfo = (item) => {
        const btnLoading =
            followInProgress.show &&
            followInProgress.key === `collectionCard_${item?.id}`;

        return {
            btnText: "View",
            btnLoading
        };
    };

    const getUserDetails = (item) => {
        const fullName = item?.fullName || item?.company?.name || item?.slug;
        const noOfbkmpc = item?.bookmarkedCount;
        const noOfbkmCountries = item?.bookmarkedCountries;
        const picUrl = item?.profilePic?.url || "/assets/images/p_stamp.png";
        const link = item?.slug;

        return {
            fullName,
            noOfbkmpc,
            noOfbkmCountries,
            picUrl,
            link
        };
    };

    const getBkmCountries = (bookmarks) => {
        const countries = [];

        if (bookmarks && bookmarks.length) {
            bookmarks.forEach((item) => {
                if (
                    item.postcard.country?.name &&
                    countries.filter(
                        (e) => e.name === item.postcard.country.name
                    ).length === 0
                ) {
                    countries.push(item.postcard.country);
                }
            });

            countries.sort((a, b) => a.name.localeCompare(b.name));

            return countries.length;
        }
    };

    const callToAction = (item) => {
        router.push(`/${item?.slug}`);
    };

    return (
        <Box w="100%" h="50vh">
            {loading ? (
                <LoadingGif />
            ) : userList && userList.length ? (
                userList.map((item) => (
                    <FollowCard
                        onClose={onClose}
                        key={`collectionCard_${item?.id}`}
                        followData={getUserDetails(item)}
                        BtnInfo={getBtnInfo(item, `collectionCard_${item?.id}`)}
                        btnAction={() => callToAction(item)}
                        itemId={item.id}
                    />
                ))
            ) : (
                <Text textAlign="center">No Collection Yet</Text>
            )}
        </Box>
    );
};

export default CollectionList;
