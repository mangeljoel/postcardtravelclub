import { useContext } from "react";
import TourListCard from "../TourListCard";
import { Box, Img, Text, Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { masonry, masonryMobile, masonryForm } from "./index.module.scss";

import AppContext from "../../AppContext";
import { RiDeleteBin6Line } from "react-icons/ri";
const TourList = ({
    data,
    isArticle,
    showDelete,
    onDelete,
    isPostcard,
    alignStyle,
    title
}) => {
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
                    flexDir={"column"}
                    justifyContent={
                        alignStyle && alignStyle === "left"
                            ? "flex-start"
                            : "center"
                    }
                    textAlign="center"
                >
                    {title && (
                        <Text mt="2em" variant="profileName">
                            {" "}
                            {title}
                        </Text>
                    )}
                    <Box
                        id="scrollableDiv"
                        width={["100%", showDelete ? "100%" : "70%"]}
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
                                        showDelete
                                            ? masonryForm
                                            : isTabletOrMobile
                                            ? masonryMobile
                                            : masonry
                                    }
                                >
                                    {data.map((story, index) => (
                                        <Flex key={"tourlist_check" + story.id}>
                                            <TourListCard
                                                indexId={index}
                                                data={story}
                                                isPostcard={isPostcard}
                                            />
                                            {showDelete && (
                                                <Icon
                                                    as={RiDeleteBin6Line}
                                                    my="auto"
                                                    ml="3%"
                                                    color="primary_1"
                                                    boxSize="25px"
                                                    onClick={onDelete}
                                                />
                                            )}
                                            {/* {isArticle && isActiveProfile && (
                                                <Text> edit</Text>
                                            )}
                                            {isArticle && isActiveProfile && (
                                                <Text> delete</Text>
                                            )} */}
                                        </Flex>
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
