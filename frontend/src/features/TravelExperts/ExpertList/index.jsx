import { useContext, useEffect } from "react";
import Link from "next/link";
//import { Masonry } from "../../../styles/Layout/Masonry";
import { Image, Box } from "@chakra-ui/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import AppContext from "../../AppContext";
import ExpertCard from "./ExpertCard";

const ExpertList = ({
    profiles,
    profileLoading,
    type,
    styleType,
    showFollow
}) => {
    const { isTabletOrMobile, profileFriendsRefetch } = useContext(AppContext);
    useEffect(() => {
        if (profiles) profileFriendsRefetch();
    }, []);
    const getPath = (profile) => {
        if (type) return "/[slug]";
        return "/[slug]";
    };
    return (
        <>
            {profileLoading && (
                <Image
                    loading="lazy"
                    src={"assets/balloon.gif"}
                    alt="loading"
                />
            )}
            {!profileLoading && (
                <Box
                    padding={["0px", "12px"]}
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    textAlign="center"
                >
                    <div
                        id="scrollableDiv"
                        style={{
                            width: "100%",
                            height: "100%",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column-reverse"
                        }}
                    >
                        {profiles.length > 0 && !profileLoading && (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                    350: 1,
                                    750: 2,
                                    800: 2,
                                    1200: 3
                                }}
                            >
                                <Masonry gutter="20px">
                                    {profiles.map((profile, index) => (
                                        <ExpertCard
                                            key={"ex_card" + index}
                                            showFollow={showFollow}
                                            expert={profile}
                                        />
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>
                        )}
                    </div>
                </Box>
            )}
        </>
    );
};
export default ExpertList;
