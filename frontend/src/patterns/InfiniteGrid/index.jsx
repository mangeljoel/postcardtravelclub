import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingGif from "../LoadingGif";
import { Grid, GridItem, Text, useMediaQuery } from "@chakra-ui/react";

const InfiniteGrid = ({
    gridItems = [], // Default to empty array if undefined
    hasMore,
    fetchMoreData,
    dataLength,
    loading,
}) => {
    const [isSmallScreen] = useMediaQuery("(max-width: 48em)");

    return (
        // <InfiniteScroll
        //     dataLength={gridItems?.length}
        //     next={fetchMoreData}
        //     hasMore={hasMore}
        //     loader={loading && <LoadingGif />}
        //     scrollThreshold={0.8}
        //     className="no-scrollbar"
        //     style={{
        //         paddingBottom: "60px",
        //         paddingTop: "60px",
        //         overflow: "hidden",
        //     }}
        // >
        //     {gridItems?.length > 0 ? (
        //         <Grid
        //             templateColumns={[
        //                 "repeat(1, 1fr)",
        //                 "repeat(2, 1fr)",
        //                 "repeat(2, 1fr)",
        //                 "repeat(3, 1fr)",
        //             ]}
        //             gap={isSmallScreen ? "28px" : "2.22vw"}
        //             justifyItems="center"
        //             alignItems="center"
        //         >
        //             {gridItems.map((item, index) => (
        //                 <GridItem w="100%" key={index}>
        //                     {item}
        //                 </GridItem>
        //             ))}
        //         </Grid>
        //     ) : !loading ? (
        //         <Text
        //             fontSize={["3.61vw", "1.875vw"]}
        //             fontFamily={"lora"}
        //             fontStyle={"italic"}
        //         >
        //             No Items to display
        //         </Text>
        //     ) : null}
        // </InfiniteScroll>
        gridItems?.length > 0 ? <InfiniteScroll
            dataLength={gridItems?.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={loading && <LoadingGif />}
            scrollThreshold={0.8}
            className="no-scrollbar"
            style={{
                paddingBottom: "60px",
                paddingTop: "60px",
                overflow: "hidden",
            }}
        >
            <Grid
                templateColumns={[
                    "repeat(1, auto)",
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                    "repeat(3, 1fr)",
                ]}
                gap={isSmallScreen ? "28px" : "2.22vw"}
                justifyItems="center"
                alignItems="center"
                justifyContent="center"
            >
                {gridItems.map((item, index) => (
                    <GridItem w="100%" key={index}>
                        {item}
                    </GridItem>
                ))}
            </Grid>
        </InfiniteScroll>
            : !loading ? <Text
                fontSize={["3.61vw", "1.875vw"]}
                fontFamily={"lora"}
                fontStyle={"italic"}
            >
                No Items to display
            </Text> : null
    );
};

export default InfiniteGrid;
