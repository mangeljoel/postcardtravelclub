import { useContext, useEffect, useState } from "react";

import AppContext from "../../AppContext";
import TravelPostcard from "./TravelPostcard/TravelPostcard";
import DraftsCard from "../../DraftsCard";
import { Box, Image, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import InfiniteMasonry from "../../../patterns/InfiniteMasonry";

const TravelPostcardList = ({
    postcards,
    isPostcardsLoading,
    fitCenter,
    isTab,
    showDraft,
    story,
    onShareClick,
    hasMore = false,
    refetch,
    isCreate,
    canEdit,
    isHomePage,
    refetchDraftsCount,
    handlePublish,
    title,
    stopPreview,
    fetchMoreData,
    dataLength,
    ...props
}) => {
    const { profile, isTabletOrMobile, refetchProfileLike, firstLoad } =
        useContext(AppContext);
    const router = useRouter();
    const getShareData = (postcard, hashtags) => {
        return {
            description: `Here is a Postcard from  ${postcard.country?.name}\n\n${postcard.intro}\n`,
            fbDescription: `Here is a Postcard by ${postcard.user.fullName
                } from her tour "${story ? story.name : "The Pashmina Trail in Ladakh"
                }"\n\n${postcard.name
                }\n---------------------------\nRead the full story in the Postcard album from ${story ? story.name : ""
                }`,
            imageUrl: postcard?.coverImage?.url || "",
            title: `${postcard.name}, ${postcard.country?.name}`,
            hashtags: `#travel #postcardguide #${postcard.country?.name} ${hashtags
                    ? hashtags.replaceAll(" ", "").replaceAll("#", " #")
                    : ""
                }`,
            url: `https://postcard.travel/` + postcard.album?.slug,
            postcardDesc: postcard.intro,
            postcardTitle: postcard.name
        };
    };
    const deletePostcard = (id) => {
        postcards.forEach((ele, index) => {
            if (ele.id === id) postcards.splice(index, 1);
        });
        if (refetch) refetch();
        if (refetchDraftsCount) refetchDraftsCount();
    };
    const [displayCards, setdisplayCards] = useState();
    const [visibilityChange, setvisibilityChange] = useState(false);

    useEffect(() => {
        if (postcards && postcards.length > 0) {
            setdisplayCards(postcards);
        }
        else setdisplayCards();
    }, [postcards, isTabletOrMobile]);

    const getMasonryItems = () => {
        if (postcards && displayCards && displayCards.length > 0) {
            return displayCards.map((postcard, index) =>
                !postcard?.isEdit
                    ? postcard && (
                        <TravelPostcard
                            key={postcard?.id}
                            indexId={index}
                            isHomePage={isHomePage}
                            postcard={postcard}
                            canEdit={canEdit}
                            onShareClick={(hashtags) =>
                                onShareClick(getShareData(postcard, hashtags))
                            }
                            story={story ? story : []}
                            handleEdit={() => {
                                displayCards[index].isEdit = true;
                                setdisplayCards(displayCards);
                                setvisibilityChange(!visibilityChange);
                            }}
                            handleDelete={() => {
                                deletePostcard(postcard.id);
                            }}
                            handlePublish={() => {
                                handlePublish();
                            }}
                        />
                    )
                    : postcard && (
                        <DraftsCard
                            key={"postcard-" + index}
                            postcard={postcard}
                            story={story ? story : []}
                            isEdit={true}
                            refetch={refetch}
                            onDeletecard={() => {
                                deletePostcard(postcard.id);
                            }}
                            editCard={(editedPostcard) => {
                                displayCards[index] = editedPostcard;
                                displayCards[index].isEdit = false;

                                setdisplayCards(displayCards);
                                setvisibilityChange(!visibilityChange);

                                // temperory hack to reload
                                handlePublish();
                                // refetch();
                            }}
                            handleDelete={() => {
                                deletePostcard(postcard.id);
                            }}
                            handlePublish={() => {
                                handlePublish();
                            }}
                        />
                    )
            );
        } else return [0];
    };

    return (
        <Box {...props}>
            {isPostcardsLoading && (
                <Box w="100%" mx="auto" h="400px" my={30}>
                    <Image
                        loading="lazy"
                        margin="auto"
                        width="100px"
                        height="100px"
                        textAlign="center"
                        src={"/assets/balloon.gif"}
                        alt="loading"
                    />
                </Box>
            )}
            {title && (
                <Heading
                    mx="auto"
                    textAlign={"center"}
                    my="1em"
                    fontSize="42px"
                    fontWeight={700}
                    color=" rgb(91, 81, 71)"
                    lineHeight={1.2}
                >
                    {title}
                </Heading>
            )}
            {displayCards && !isPostcardsLoading && (
                <Box
                    padding={["0px", "12px"]}
                    width="100%"
                    id="postcard-list"
                    display="flex"
                    justifyContent="center"
                    textAlign="center"
                    transition={"0.5s ease"}
                    overflow="hidden"
                >
                    <div
                        id="scrollableDiv"
                        style={{
                            width: "100%",
                            height: "100%",
                            // overflow: "auto",
                            display: "flex",
                            flexDirection: "column-reverse",
                            overflow: "hidden",
                        }}
                    >
                        <InfiniteMasonry
                            masonryItems={getMasonryItems()}
                            hasMore={hasMore}
                            fetchMoreData={
                                fetchMoreData ? fetchMoreData : () => { }
                            }
                            dataLength={dataLength}
                        />
                    </div>
                </Box>
            )}
        </Box>
    );
};

export default TravelPostcardList;
