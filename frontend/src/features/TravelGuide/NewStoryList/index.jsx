import { Box } from "@chakra-ui/react";
import { useMemo, useCallback } from 'react';
import AlbumCard from "../../AlbumCard";
import InfiniteGrid from "../../../patterns/InfiniteGrid";

const NewStoryList = ({
    stories = [],
    isStoriesLoading = false,
    hasMore = false,
    fetchMoreData = () => { },
    dataLength,
    ...props
}) => {
    // Memoize the click handler to prevent recreation on each render
    const handleStoryClick = useCallback((e, story) => {
        e.stopPropagation();
        const isPublished = story.news_article?.status === "published";
        const link = isPublished
            ? `/postcard-pages/${story?.slug}`
            : `/${story?.slug}`;
        window.open(link, "_blank");
    }, []);

    // Memoize the grid items to prevent unnecessary re-renders
    const gridItems = useMemo(() =>
        stories?.map((story) => (
            <AlbumCard
                key={`tsc_${story.id}`}
                story={story}
                onClick={(e) => handleStoryClick(e, story)}
            />
        )),
        [stories, handleStoryClick]
    );

    return (
        <Box {...props}>
            <Box
                padding="0px"
                width="100%"
                display="flex"
                justifyContent="center"
                textAlign="center"
                mt={["2em", "3em"]}
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
                    <InfiniteGrid
                        gridItems={gridItems}
                        hasMore={hasMore}
                        loading={isStoriesLoading}
                        fetchMoreData={fetchMoreData}
                        dataLength={dataLength}
                    />
                </div>
            </Box>
        </Box>
    );
};

export default NewStoryList;