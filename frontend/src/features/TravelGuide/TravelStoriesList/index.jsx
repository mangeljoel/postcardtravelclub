import { useEffect, useState, useContext } from "react";
import TravelStoriesCard from "./TravelStoriesCard";
import { Box, Img } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { masonry, masonryMobile } from "./index.module.scss";

import AppContext from "../../AppContext";

import { getTourBkms } from "../../../queries/strapiQueries";
const TravelStoriesList = ({
    stories,
    isStoriesLoading,
    isMobile,
    refetch, isHotel
}) => {
    const router = useRouter();
    const { profile, isTabletOrMobile, tourBkmRefetch } =
        useContext(AppContext);

    const [displayStories, setdisplayStories] = useState([]);
    useEffect(() => {
        // if (profile) {
        //     tourBkmRefetch().then(() => {
        //         if (stories) {
        //             setdisplayStories(stories);
        //         }
        //     });
        // } else {
        if (stories) {
            setdisplayStories(stories);
        }
        // }
    }, [stories]);
    return (
        <>
            {isStoriesLoading && (
                <Img loading="lazy" src={"assets/balloon.gif"} alt="loading" />
            )}
            {!isStoriesLoading && (
                <Box
                    padding="0px"
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
                        {stories && displayStories.length > 0 && (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                    350: 1,
                                    750: 2,
                                    800: 2,
                                    1200: 3
                                }}
                            >
                                <Masonry
                                    gutter="20px"
                                    className={
                                        isMobile ? masonryMobile : masonry
                                    }
                                >
                                    {displayStories.map((story, index) => (
                                        <TravelStoriesCard
                                            key={"tsc_" + story.id}
                                            indexId={index}
                                            isHotel={isHotel}
                                            story={story}
                                            refetch={refetch}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push("/" + story.slug);
                                            }}
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

export default TravelStoriesList;
