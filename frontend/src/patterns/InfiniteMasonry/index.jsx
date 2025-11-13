import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingGif from "../LoadingGif";
import { Flex, Text, useMediaQuery } from "@chakra-ui/react";

const InfiniteMasonry = ({
    masonryItems = [],
    hasMore,
    fetchMoreData,
    emptyState,
    dataLength,
    loading
}) => {
    const [isSmallScreen] = useMediaQuery("(max-width: 48em)");

    // Show loading state on initial load - be more conservative
    if (loading && (!masonryItems || masonryItems.length === 0)) {
        return <LoadingGif />;
    }

    // Only show empty state when we're sure: not loading AND have tried to fetch
    // Add a more strict condition to prevent flash
    const shouldShowEmptyState = !loading && masonryItems?.length === 0 && !hasMore;

    return (
        <InfiniteScroll
            dataLength={masonryItems?.length * 1}
            next={() => fetchMoreData()}
            hasMore={hasMore}
            loader={<LoadingGif />}
            scrollThreshold={0.7}
            className="no-scrollbar"
            style={{
                paddingBottom: "60px",
                paddingTop: "60px",
                overflow: "hidden"
            }}
        >
            {shouldShowEmptyState ? (
                emptyState ? emptyState() : (
                    <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                        No Items to display
                    </Text>
                )
            ) : (
                <ResponsiveMasonry
                    columnsCountBreakPoints={{
                        350: 1,
                        750: 2,
                        800: 2,
                        1200: 3
                    }}
                >
                    <Masonry gutter={isSmallScreen ? "36px" : "1.5vw"}>
                        {masonryItems
                            ?.filter((item) => item != null)
                            .map((item, index) => (
                                <Flex key={index}>{item}</Flex>
                            ))}
                    </Masonry>
                </ResponsiveMasonry>
            )}
        </InfiniteScroll>
    );
};
export default InfiniteMasonry;