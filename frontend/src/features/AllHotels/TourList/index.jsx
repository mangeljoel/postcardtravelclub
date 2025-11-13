import { useContext } from "react";
import TourListCard from "../TourListCard";
import { Box, Img } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { masonry, masonryMobile } from "./index.module.scss";

import AppContext from "../../AppContext";

const TourList = ({ data, alignStyle }) => {
    const router = useRouter();
    const { profile, isTabletOrMobile, tourBkmRefetch } =
        useContext(AppContext);

    return (
        <>
            {data && data.length ? (
                <Box
                    padding="0px"
                    width={"100%"}
                    display="flex"
                    justifyContent={
                        alignStyle && alignStyle === "left"
                            ? "flex-start"
                            : "center"
                    }
                    textAlign="center"
                >
                    <Box
                        id="scrollableDiv"
                        width={["100%", "70%"]}
                        style={{
                            height: "100%",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column-reverse",
                            textAlign: "center",
                            justifyContent: "center",
                            margin:
                                alignStyle && alignStyle === "left"
                                    ? "0px"
                                    : "auto"
                        }}
                    >
                        {data && data.length > 0 && (
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                    350: 1,
                                    750: 1,
                                    800: 1,
                                    1200: 1
                                }}
                            >
                                <Masonry
                                    gutter="20px"
                                    className={
                                        isTabletOrMobile
                                            ? masonryMobile
                                            : masonry
                                    }
                                >
                                    {data.map((story, index) => (
                                        <TourListCard
                                            key={"tourlist_check" + story.id}
                                            indexId={index}
                                            data={story}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (story.slug)
                                                    router.push(
                                                        "/" + story.slug
                                                    );
                                                else if (story.link)
                                                    window.open(
                                                        story.link,
                                                        "_blank"
                                                    );
                                            }}
                                        />
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>
                        )}
                    </Box>
                </Box>
            ) : (
                <Img loading="lazy" src={"assets/balloon.gif"} alt="loading" />
            )}
        </>
    );
};

export default TourList;
