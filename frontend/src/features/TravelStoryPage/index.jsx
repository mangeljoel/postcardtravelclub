import { useContext, useEffect, useState } from "react";
import { FlexBox } from "../../styles/Layout/FlexBox";
import PostcardLayout from "../../patterns/PostcardLayout";
import AlbumDetails from "./AlbumDetails";
import { Box, Button, Image, Flex } from "@chakra-ui/react";
import {
    getPostcardByFilter,
    updateDBValue
} from "../../queries/strapiQueries";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import AppContext from "../AppContext";
import PostcardModal from "../PostcardModal";
// import ModalSignupLogin from "../ModalSignupLogin";
import { useRouter } from "next/router";
import ModalShare from "../ModalShare";
import SignUpInModal from "../HomePage1/SignUpInModal";
import SignUpInfoModal from "../HomePage1/SignUpInfoModal";

const TravelStoryPage = ({ postcard }) => {
    const [otherPostcards, setOtherPostcards] = useState([]);
    const router = useRouter();
    const { profileLikes, profile, refetchProfileLike } =
        useContext(AppContext);
    const [bookmarked, setBookmarked] = useState({
        bkmId: null,
        isBkmed: false
    });
    const [shareData, setShareData] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);

    const [showModal, setShowModal] = useState({ mode: "", isShow: false });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    useEffect(() => {
        const fetchOtherPostcards = async (album) => {
            const postcardList = await getPostcardByFilter({ album });
            const filteredList = postcardList.data.filter(
                (item) => item.id !== postcard.id
            );
            setOtherPostcards(filteredList);
        };
        checkBookmark();
        if (postcard.album?.id) {
            fetchOtherPostcards(postcard.album.id);
        }
    }, [postcard]);
    useEffect(() => {
        checkBookmark();
    }, [profile, profileLikes]);
    const checkBookmark = () => {
        if (postcard && profile) {
            let likeExists = false;
            if (profileLikes && profileLikes.length > 0) {
                profileLikes.map((like) => {
                    if (
                        like?.postcard?.id.toString() ===
                        postcard.id?.toString()
                    ) {
                        likeExists = true;
                        postcard.likeId = like.id;
                    }
                    if (likeExists) {
                        postcard.like = true;
                        setBookmarked({ bkmId: like.id, isBkmed: true });
                    } else {
                        postcard.like = false;
                        setBookmarked({
                            bkmId: null,
                            isBkmed: false
                        });
                        if (showModal.doCollect) {
                            AddRemoveLikes(
                                postcard,
                                postcard.likeId,
                                (like) => {
                                    postcard.like = !postcard.like;
                                    postcard.likeId = like.id;
                                    refetchProfileLike();
                                    setBookmarked({
                                        bkmId: like.id,
                                        isBkmed: true
                                    });
                                    setShowModal({
                                        isShow: false,
                                        doCollect: false
                                    });
                                }
                            );
                        }
                    }
                });
            }
        }
    };
    const { coverImage, name, album, intro, story } = postcard;

    return (
        <>
            {" "}
            <PostcardLayout
                image={coverImage?.url}
                name={name ?? ""}
                intro={intro ?? ""}
                company={album?.company?.name ?? ""}
                story={story ?? ""}
            />
            <FlexBox variant="homePage">
                <Flex
                    my="2em"
                    mx="auto"
                    justifyContent="space-evenly"
                    w={["100%", "60%"]}
                >
                    <Button
                        width="48%"
                        height={["40px", "48px"]}
                        variant={postcard.like ? "disabledButton" : "solid"}
                        onClick={() => {
                            if (profile)
                                AddRemoveLikes(
                                    postcard,
                                    postcard.likeId,
                                    (like) => {
                                        postcard.like = !postcard.like;
                                        postcard.likeId = like.id;
                                        refetchProfileLike();
                                        setBookmarked({
                                            bkmId: like.id,
                                            isBkmed: true
                                        });
                                    }
                                );
                            else
                                setShowModal({
                                    mode: "login",
                                    isShow: true,
                                    doCollect: true
                                });
                        }}
                    >
                        {postcard.like
                            ? "Added to Diary"
                            : "Add to Diary"}
                    </Button>
                    <Button
                        width="48%"
                        height={["40px", "48px"]}
                        variant="outline"
                        onClick={() => {
                            // setShareData({
                            //     title: postcard?.name,
                            //     description: postcard?.intro,
                            //     // eslint-disable-next-line no-restricted-globals
                            //     url: `https://postcard.travel${location.pathname}`

                            //     // hashtags: `#travel #postcardguide #${story.rcity?.Name} #${story.rcountry?.Name}`
                            // });
                            // setShowShareModal(true);
                            // else
                            //     setShowModal({
                            //         isShow: true,
                            //         mode: "login"
                            //     });
                            updateDBValue("news-articles", 19, {
                                videoURL: "Savings"
                            });
                        }}
                    >
                        Share
                    </Button>

                    <PostcardModal
                        isShow={showShareModal}
                        headerText="Share"
                        children={
                            <ModalShare
                                handleClose={() => setShowShareModal(false)}
                                {...shareData}
                            />
                        }
                        handleClose={() => setShowShareModal(false)}
                    />
                </Flex>

                {album && <AlbumDetails album={album} />}
                {otherPostcards && (
                    <Box w="100%">
                        <TravelPostcardList
                            canEdit={true}
                            postcards={otherPostcards ? otherPostcards : []}
                            isHomePage={true}
                            stopPreview={true}
                            mb="2em"
                        />
                    </Box>
                )}
                {album?.company?.icon && (
                    <Box w="100%" m="auto" textAlign={"center"}>
                        <Box
                            pos="relative"
                            // h="300px"
                            width={["66%", "33%"]}
                            my={"2%"}
                            mx="auto"
                        >
                            <Image
                                borderRadius="8px"
                                loading="lazy"
                                m="auto"
                                src={
                                    album?.company?.icon
                                        ? album?.company?.icon?.url
                                        : "/assets/postcard_stories.jpg"
                                }
                                fallbackSrc="/assets/postcard_stories.jpg"
                                objectFit="contain"
                                alt={"company"}
                            ></Image>
                        </Box>
                        <Button
                            my={"2%"}
                            onClick={(e) => {
                                e.stopPropagation();
                                // console.log(postcard);
                                if (postcard?.user?.slug)
                                    router.push("/" + postcard?.user?.slug);
                            }}
                        >
                            View Profile
                        </Button>
                    </Box>
                )}
                {/* <PostcardModal
                    isShow={showModal.isShow}
                    headerText={
                        showModal.mode === "login" ? "Sign in" : "Free Sign Up!"
                    }
                    size={showModal.mode === "login" ? "xl" : "sm"}
                    children={
                        <ModalSignupLogin
                            mode={showModal.mode}
                            isSchedulerOpen={true}
                            toggleMode={() =>
                                setShowModal({
                                    isShow: true,
                                    mode:
                                        showModal.mode === "login"
                                            ? "signup"
                                            : "login"
                                })
                            }
                            handleClose={() => {
                                if (!showModal.doCollect) setShowModal(false);
                            }}
                        />
                    }
                    handleClose={() => setShowModal(false)}
                /> */}
                <SignUpInModal
                    isShow={showModal.isShow}
                    mode={showModal.mode}
                    setShowModal={setShowModal}
                    setShowSignModal={setShowSignModal}
                />
                <SignUpInfoModal
                    state={showSignModal}
                    setShowSignModal={setShowSignModal}
                />
            </FlexBox>
        </>
    );
};

export default TravelStoryPage;
