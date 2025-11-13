import { useContext, useMemo, useCallback, useState, useEffect } from "react";
import AppContext from "../../AppContext";
import DraftsCard from "../../DraftsCard";
import { Box } from "@chakra-ui/react";
import InfiniteMasonry from "../../../patterns/InfiniteMasonry";
import { fetchPaginatedResults } from "../../../queries/strapiQueries";
import {
    apiNames,
    populatePostcardData
} from "../../../services/fetchApIDataSchema";
import Postcard from "./Postcard";

const TravelPostcardList = ({
    postcards = [],
    isPostcardsLoading = false,
    hasMore = false,
    fetchMoreData = () => { },
    dataLength,
    from,
    ...props
}) => {
    const { canCreatePostcard } = useContext(AppContext);
    const [displayCards, setDisplayCards] = useState(postcards);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        setDisplayCards(postcards)
    }, [postcards])

    const handlePostcardUpdate = useCallback(async (postcard, index) => {
        const response = await fetchPaginatedResults(
            apiNames.postcard,
            { id: postcard?.id },
            populatePostcardData
        );
        const updatedPostcard = Array.isArray(response) ? response[0] : response;

        setDisplayCards(prev => {
            const updatedCards = [...prev];
            updatedCards[index] = updatedPostcard;
            return updatedCards;
        });
    }, []);

    const postcardItems = useMemo(() =>
        displayCards.map((postcard, index) => {
            if (!postcard) return null;

            // Check if postcard has required fields
            const hasRequiredFields = postcard?.name && postcard?.intro && postcard?.country;
            const isComplete = postcard?.isComplete;
            const canEdit = canCreatePostcard(postcard?.album?.news_article);

            // Get the current edit state - check if it's been set locally
            const currentCard = displayCards[index];
            const isCurrentlyInEditMode = currentCard?.isEdit === true;

            // Show DraftsCard if:
            // 1. User can edit AND
            // 2. Either the postcard is incomplete OR user has clicked edit
            const shouldShowDraftsCard = canEdit && (!isComplete || isCurrentlyInEditMode);

            if (shouldShowDraftsCard) {
                return (
                    <DraftsCard
                        key={postcard?.id}
                        postcard={postcard}
                        isEdit={!hasRequiredFields || isCurrentlyInEditMode}
                        refetch={() => handlePostcardUpdate(postcard, index)}
                    />
                );
            }

            // Show regular Postcard for completed postcards not in edit mode
            return (
                <Postcard
                    key={postcard?.id}
                    postcard={postcard}
                    from={from}
                    setIsEdit={(value) => {
                        setDisplayCards(prev => {
                            const updatedCards = [...prev];
                            updatedCards[index] = { ...postcard, isEdit: value };
                            return updatedCards;
                        });
                    }}
                    canEdit={canEdit}
                    isFirstItem={index === 0}
                    firstLoad={firstLoad}
                    setFirstLoad={setFirstLoad}
                />
            );
        }),
        [displayCards, from, canCreatePostcard, handlePostcardUpdate, firstLoad]
    );

    return (
        <Box {...props}>
            <Box
                padding={["0px", "12px"]}
                width="100%"
                id="postcard-list"
                display="flex"
                justifyContent="center"
                textAlign="center"
                transition="0.5s ease"
                overflow="hidden"
            >
                <div
                    id="scrollableDiv"
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column-reverse",
                        overflow: "hidden"
                    }}
                >
                    <InfiniteMasonry
                        masonryItems={postcardItems}
                        hasMore={hasMore}
                        fetchMoreData={fetchMoreData}
                        loading={isPostcardsLoading}
                        dataLength={dataLength}
                    />
                </div>
            </Box>
        </Box>
    );
};

export default TravelPostcardList;