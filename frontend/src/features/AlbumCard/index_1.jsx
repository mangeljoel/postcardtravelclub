import { Flex, Box, Text, Button, Image, Link } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { BookmarkIcon } from "../../styles/ChakraUI/icons";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import DynamicTags from "./DynamicTags";
import AppContext from "../AppContext";
import { addBacklinkEvent, followUnfollowAlbum } from "../../services/utilities";
import SignUpInModal from "../HomePage1/SignUpInModal";
import SignUpInfoModal from "../HomePage1/SignUpInfoModal";

const AlbumCard = ({ story, onClick }) => {
    const { profile, logOut } = useContext(AppContext);
    // console.log(story);
    // story.category = { name: "Tea Estate" };
    const [tagList, setTagList] = useState([]);
    const [followed, setFollowed] = useState(false);
    const [followId, setFollowId] = useState(null);

    const [showModal, setShowModal] = useState({
        isShow: false,
        mode: "login"
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });

    useEffect(() => {
        getTags();

        if (profile) {
            story?.follow_albums?.forEach((item) => {
                if (item?.follower?.id == profile.id) {
                    setFollowId(item.id);
                    setFollowed(true);
                }
            });
        }
    }, [story]);

    const getTags = async () => {
        let tags = [];
        if (story && story.id)
            tags = await fetchPaginatedResults(
                "albums/gettags?albumId=" + story.id,
                {},
                {}
            );
        const capitalizedTags = tags.map((tag) =>
            tag
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        );
        setTagList(capitalizedTags);
    };

    const handleFollowUnfollowAlbum = async (e) => {
        if (profile) {
            followUnfollowAlbum(
                followed,
                followId,
                profile.id,
                story.id,
                (response) => {
                    // console.log(response)
                    if (response.error) {
                        logOut();
                        toast({
                            title: "Session Expired",
                            description: "Login Again",
                            isClosable: true,
                            duration: 3000,
                            position: "top"
                        });
                        setShowModal({
                            mode: "login",
                            isShow: true
                        });
                    } else {
                        setFollowId(response?.id || null);
                        setFollowed((prev) => !prev);
                    }
                }
            );
        }
    };

    return (
        <Flex
            w={["95%", "23.61vw"]}
            minW={"306px"}
            h={"42.71vw"}
            minH={"560px"}
            borderRadius={["20px", "20px", "20px", "1.563vw"]}
            bg={"#2c67b1"}
            pt={["7px", "7px", "7px", "0.56vw"]}
            mx={"auto"}
        >
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
            <Flex
                bg={"#fff"}
                w={"100%"}
                h={"100%"}
                borderRadius={["20px", "20px", "20px", "1.563vw"]}
                flexDirection={"column"}
            >
                <Flex
                    w={"100%"}
                    h={["43px", "43px", "43px", "3.33vw"]}
                    bg={"#2c67b1"}
                    borderRadius={["20px", "20px", "20px", "1.563vw"]}
                >
                    <Flex
                        borderTopRadius={["20px", "20px", "20px", "1.563vw"]}
                        w={"14.58vw"}
                        minW={"188px"}
                        h={"100%"}
                        bg={"#fff"}
                        alignItems={"center"}
                        position={"relative"}
                    >
                        <Flex
                            position={"absolute"}
                            top={["10px", "10px", "10px", "0.75vw"]}
                            left={["10px", "10px", "10px", "0.75vw"]}
                            alignItems={"center"}
                            w={"100%"}
                            gap={["10px", "10px", "10px", "0.85vw"]}
                        >
                            {story.company?.icon?.url ? (
                                <ChakraNextImage
                                    src={story.company?.icon?.url}
                                    w={"3.125vw"}
                                    minW={"40px"}
                                    h={"3.125vw"}
                                    minH={"40px"}
                                    objectFit="contain"
                                    borderColor="primary_4"
                                    borderWidth="1px"
                                    //bg={"#EFE9E4"}
                                    borderRadius={"100%"}
                                    alt={`${story?.company?.name} logo`}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <Box
                                    w={"3.125vw"}
                                    minW={"40px"}
                                    h={"3.125vw"}
                                    minH={"40px"}
                                    bg={"#EFE9E4"}
                                    borderRadius={"100%"}
                                ></Box>
                            )}

                            <Text
                                maxW={["125px", "125px", "125px", "9.4vw"]}
                                w={"100%"}
                                textAlign={"left"}
                                fontFamily={"raleway"}
                                fontWeight={600}
                                fontSize={["11px", "11px", "11px", "0.833vw"]}
                                lineHeight={["12px", "12px", "12px", "0.9vw"]}
                                color={"primary_3"}
                            >
                                {story.name}
                            </Text>
                        </Flex>
                        {/* <ChakraNextImage src={story.company?.icon?.url} w={"3.125vw"} h={"3.125vw"} objectFit="cover" bg={"#EFE9E4"} borderRadius={"100%"} position={"absolute"} top={"0.833vw"} left={"0.833vw"} />

                        <Text maxW={"9.4vw"} position={"absolute"} w={"100%"} left={"4.5vw"} right={"0.833vw"} top={"1.6vw"} textAlign={"left"} fontFamily={"raleway"} fontWeight={600} fontSize={"0.833vw"} lineHeight={"0.9vw"} color={"primary_3"}>{story.name}</Text> */}
                    </Flex>

                    <Flex
                        bg={"#fff"}
                        w={["50%", "9.5vw"]}
                        minW={"118px"}
                        h={"100%"}
                        borderTopRightRadius={[
                            "20px",
                            "20px",
                            "20px",
                            "1.563vw"
                        ]}
                    >
                        <Flex
                            w={"100%"}
                            bg={"#2c67b1"}
                            borderTopRightRadius={[
                                "16px",
                                "16px",
                                "16px",
                                "1vw"
                            ]}
                            borderBottomLeftRadius={[
                                "10px",
                                "10px",
                                "10px",
                                "0.833vw"
                            ]}
                            justifyContent={"flex-end"}
                            pr={["19px", "19px", "19px", "1.46vw"]}
                        >
                            <Text
                                my={["14px", "14px", "14px", "1.11vw"]}
                                fontFamily={"raleway"}
                                fontWeight={"bold"}
                                fontSize={["11px", "11px", "11px", "0.833vw"]}
                                lineHeight={["21px", "21px", "21px", "1.67vw"]}
                                color={"#EFE9E4"}
                            >
                                {story?.country?.name}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex
                    flexDirection={"column"}
                    mt={["20px", "20px", "20px", "1.6vw"]}
                    px={["16px", "16px", "16px", "1.25vw"]}
                    pb={["21px", "21px", "21px", "1.67vw"]}
                    h={"100%"}
                >
                    <ChakraNextImage
                        src={
                            story?.news_article?.image?.url ||
                            story?.coverImage?.url
                        }
                        w={["100%", "21.11vw"]}
                        minW={"273px"}
                        h={["263px", "20.35vw"]}
                        minH={"263px"}
                        objectFit={"cover"}
                        borderRadius={["13.5px", "13.5px", "13.5px", "1.04vw"]}
                        alt={`${story?.news_article?.image?.url ||
                            story?.coverImage?.url
                            } coverImage`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <Text
                        h={["11px", "11px", "11px", "0.885vw"]}
                        textAlign={"left"}
                        mt={["19px", "19px", "19px", "1.46vw"]}
                        fontFamily={"raleway"}
                        fontSize={["10px", "10px", "10px", "0.76vw"]}
                        lineHeight={["12px", "12px", "12px", "0.94vw"]}
                    >
                        {story?.category && story.category}
                        {/* PROPERTY CATEGORY */}
                    </Text>

                    <Flex>
                        <Text
                            textAlign={"left"}
                            mt={["7px", "7px", "7px", "0.503vw"]}
                            h={["57px", "57px", "57px", "4.44vw"]}
                            fontFamily={"raleway"}
                            fontSize={["16px", "16px", "16px", "1.25vw"]}
                            lineHeight={["19px", "19px", "19px", "1.46vw"]}
                            fontWeight={500}
                        >
                            {story?.news_article?.title || story?.name}
                        </Text>
                        {/* <Button
                            mt={["7px", "7px", "7px", "0.503vw"]}
                            variant={"none"}
                            onClick={handleFollowUnfollowAlbum}
                        >
                            <BookmarkIcon
                                width={["19px", "19px", "19px", "1.46vw"]}
                                height={["24px", "24px", "24px", "1.80vw"]}
                                stroke={"primary_1"}
                                fill={followed ? "primary_1" : "none"}
                            />
                        </Button> */}
                    </Flex>

                    {/* <Flex mt={["7px","0.503vw"]} h={["20px","1.53vw"]} gap={["6px","0.5vw"]}>
                        {tagList?.slice(0, 2)?.map((tag) => (
                            <Flex key={tag} bg={"#D9D9D9"} borderRadius={["9px","0.69vw"]} alignItems={"center"}>
                                <Text fontFamily={"raleway"} fontSize={["9px","0.69vw"]} lineHeight={["12px","0.94vw"]} mx={["14px","0.97vw"]} color={"#111111"}>{tag}</Text>
                            </Flex>
                        ))}

                        {tagList?.length > 2 && (
                            <Flex bg={"#D9D9D9"} borderRadius={["9px","0.69vw"]} alignItems={"center"}>
                                <Text fontFamily={"raleway"} fontSize={["9px","0.69vw"]} lineHeight={["12px","0.94vw"]} w={["20px","1.53vw"]} color={"#111111"}>+{tagList.length}</Text>
                            </Flex>
                        )}
                    </Flex> */}

                    <DynamicTags tagList={tagList} />

                    <Text
                        mt={["16px", "16px", "16px", "1.2vw"]}
                        h={["11px", "11px", "11px", "0.885vw"]}
                        textAlign={"left"}
                        color={"primary_3"}
                        fontWeight={600}
                        fontFamily={"raleway"}
                        fontSize={["11px", "11px", "11px", "0.833vw"]}
                        lineHeight={["12px", "12px", "12px", "0.94vw"]}
                    >
                        {story?.pricesStartingAt &&
                            `${story.pricesStartingAt} USD Per Night`}
                    </Text>

                    <Box
                        bg={"#D9D9D9"}
                        mt={["12px", "12px", "12px", "0.94vw"]}
                        h={"2px"}
                    ></Box>

                    <Flex
                        my={["18px", "18px", "18px", "1.3vw"]}
                        h={["27px", "27px", "27px", "2.083vw"]}
                        gap={["12px", "12px", "12px", "0.9vw"]}
                    >
                        <Button
                            as={Link}
                            variant={"none"}
                            h={"30px"}
                            border={"2px"}
                            borderRadius={["20px", "20px", "20px", "1.56vw"]}
                            borderColor={"primary_1"}
                            color={"primary_1"}
                            w={"100%"}
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["11px", "11px", "11px", "0.833vw"]}
                            lineHeight={["50px", "50px", "50px", "3.82vw"]}
                            onClick={(e) => {
                                e.stopPropagation();
                                addBacklinkEvent(profile?.id, story?.website, story?.id, null)// Stops the event from propagating
                            }}
                            href={story.website}
                            target="_blank"
                        >
                            Visit Website
                        </Button>
                        <Button
                            as={Link}
                            variant={"none"}
                            h={"30px"}
                            borderRadius={["20px", "20px", "20px", "1.56vw"]}
                            bg={"primary_1"}
                            color={"#EFE9E4"}
                            w={"100%"}
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["11px", "11px", "11px", "0.833vw"]}
                            lineHeight={["50px", "50px", "50px", "3.82vw"]}
                            onClick={(e) => {
                                e.stopPropagation(); // Stops the event from propagating
                            }}
                            href={
                                story?.news_article?.id
                                    ? `/postcard-pages/${story?.slug}`
                                    : `/${story?.slug}`
                            }
                            target="_blank"
                        >
                            Discover More
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AlbumCard;
