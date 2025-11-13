import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Image, Text, Flex, Img, Avatar, Link } from "@chakra-ui/react";
import { FlexBox } from "../../styles/Layout/FlexBox";
import {
    fetchPaginatedResults,
    getBkmStory,
    getExpertbyUserLink
} from "../../queries/strapiQueries";
import AppContext from "../AppContext";
import { useRouter } from "next/router";
import { populateAlbumData } from "../../services/fetchApIDataSchema";
import * as ga from "../../services/googleAnalytics";
import PostcardModal from "../PostcardModal";
import ModalShare from "../ModalShare";
import TabsPart from "../TabsPart";
import CountryFilter from "../AllTours/CountryFilter";
import { getCountryNameFromList } from "../../services/utilities";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import NewStoryList from "../TravelGuide/NewStoryList";
import SelectInterest from "../PostcardAnalytics/Filters/SelectInterest";
import SelectCountry from "../PostcardAnalytics/Filters/SelectCountry";
import { TagIcon } from "../../styles/ChakraUI/icons";
import SelectedTagList from "../Experiences/SelectedTagList";
import UserProfile from "../ProfilePage/UserProfile";

const MyCollectionPage = ({ expert }) => {
    const router = useRouter();
    const { isTablet, profile, isTabletOrMobile, isActiveProfile } =
        useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedTagsList, setSelectedTagsList] = useState({
        postcardName: [],
        hotelName: [],
        tourName: []
    });

    const [clickedTag, setClickedTag] = useState({
        postcardName: null,
        hotelName: null,
        tourName: null
    });
    const [userCollection, setUserCollection] = useState({});
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [initialData, setInitialData] = useState({});
    const [tabData, setTabData] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        if (expert) {
            setSelectedCountry(null);
            getData(expert);
        }
    }, [expert]);

    useEffect(() => {
        if (initialData) {
            let collectionData = {
                userData: initialData.userData,
                postcards: getDisplayPostcards(initialData.bkmPostcards),
                hotels: getDisplayHotels(initialData.bkmHotels),
                tours: getDisplayTours(initialData.bkmTours)
            };
            setUserCollection(collectionData);
        }
    }, [selectedCountry, selectedTagsList, clickedTag]);

    const CountryCustomFilter = ({ fieldkey, filter }) => {
        return (
            <SelectCountry
                selectedCountry={selectedCountry?.[fieldkey]}
                setSelectedCountry={(e) => {
                    setSelectedCountry((prev) => {
                        return {
                            ...prev,
                            [fieldkey]:
                                e && e.name != "All Countries" ? e.name : ""
                        };
                    });
                    setSelectedTagsList((prev) => {
                        return {
                            ...prev,
                            [fieldkey]: []
                        };
                    });
                }}
                countryList={filter?.country}
                allCountriesOption={true}
                customButtom={(onClick) => (
                    <Button
                        borderRadius="43px"
                        mr="1em"
                        h="30px"
                        fontSize="16px"
                        px={4}
                        onClick={onClick}
                    >
                        {selectedCountry?.[fieldkey] || "Select Country"}
                    </Button>
                )}
            />
        );
    };

    const renderSelectInterest = (fieldkey, filter) => (
        <SelectInterest
            editTags={selectedTagsList?.[fieldkey] || []}
            setEditTags={(tags) =>
                setSelectedTagsList((prev) => {
                    return {
                        ...prev,
                        [fieldkey]: tags
                    };
                })
            }
            tagList={filter.tags}
            customButton={(onClick) => (
                <Button
                    borderRadius="43px"
                    mr="1em"
                    h="30px"
                    fontSize="16px"
                    px={4}
                    onClick={onClick}
                >
                    <TagIcon color={"white"} mr="5px" w="16px" h="16px" />
                    {selectedTagsList?.[fieldkey]?.length == 0
                        ? "Select Interest"
                        : selectedTagsList?.[fieldkey].length}
                </Button>
            )}
            onClear={() =>
                setClickedTag((prev) => ({
                    ...prev,
                    [fieldkey]: ""
                }))
            }
        />
    );

    const renderSelectedTagList = (fieldkey) => (
        <Box my={[6, 10]}>
            <SelectedTagList
                tagList={selectedTagsList?.[fieldkey]}
                orientation={"horizontal"}
                selectedTags={clickedTag?.[fieldkey]}
                onSelectTags={(tags) => {
                    if (tags && tags.length > 0) {
                        setClickedTag((prev) => ({
                            ...prev,
                            ...(tags === clickedTag?.[fieldkey]
                                ? {
                                    [fieldkey]: ""
                                }
                                : {
                                    [fieldkey]: tags
                                })
                        }));
                    }
                }}
            />
        </Box>
    );

    useEffect(() => {
        if (userCollection) {
            // console.log(userCollection, selectedCountry, selectedTagsList);
            const Filter = {
                Experiences: {
                    country:
                        getCountryNameFromList(initialData.bkmPostcards) || [],
                    tags:
                        getTagList(
                            initialData.bkmPostcards,
                            false,
                            "postcardName"
                        ) || []
                },
                Stays: {
                    country:
                        getCountryNameFromList(initialData.bkmHotels) || [],
                    tags:
                        getTagList(initialData.bkmHotels, true, "hotelName") ||
                        []
                },
                Tours: {
                    country: getCountryNameFromList(initialData.bkmTours) || [],
                    tags:
                        getTagList(initialData.bkmTours, true, "tourName") || []
                }
            };
            let tabData = [
                {
                    name: "Experiences",
                    childComp: (
                        <>
                            {userCollection.postcards &&
                                userCollection.postcards.length === 0 ? (
                                isActiveProfile(userData) ? (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Flex h={["20vw", "8.75vw"]} w={"100%"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>{"You have 0 Postcards collected, Start Collecting now :)"}</Text>
                                            <Text as={Link} href={"/experiences"} fontSize={["4vw", "1.67vw"]} fontFamily={"raleway"} fontWeight={500} textAlign={"center"} textDecoration={"underline"} color={"primary_3"}>Experience</Text>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>No Postcards Collected</Text>
                                    </Flex>
                                )
                            ) : (
                                <Box mt={3} textAlign="center" w="100%">
                                    <Flex
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        my={[2, 6]}
                                    >
                                        {Filter["Experiences"].country.length >
                                            1 && (
                                                <CountryCustomFilter
                                                    fieldkey={"postcardName"}
                                                    filter={Filter["Experiences"]}
                                                />
                                            )}
                                        {!(
                                            (Filter["Experiences"].tags
                                                ?.length <= 1 &&
                                                !selectedTagsList?.postcardName) ||
                                            (selectedCountry?.postcardName &&
                                                userCollection?.postcards
                                                    ?.length <= 1)
                                        ) &&
                                            renderSelectInterest(
                                                "postcardName",
                                                Filter["Experiences"]
                                            )}
                                    </Flex>
                                    {selectedTagsList?.postcardName?.length >
                                        1 &&
                                        renderSelectedTagList("postcardName")}
                                    <Box px={[0, "5%"]}>
                                        <TravelPostcardList
                                            mt={6}
                                            canEdit={true}
                                            postcards={userCollection.postcards}
                                            isPostcardsLoading={loading}
                                            isMobile={isTabletOrMobile}
                                            isTab={isTablet}
                                            isHomePage={true}
                                            onShareClick={(shareData) => {
                                                setShareData({
                                                    ...shareData,
                                                    url: `https://postcard.travel${location.pathname}`
                                                });
                                                setShowShareModal(true);
                                            }}
                                        // isPostcardsLoading={isPostcardsLoading}
                                        />
                                    </Box>
                                    {isActiveProfile(userData) && (
                                        <Button
                                            my={5}
                                            borderRadius={"2.78vw"}
                                            mx="auto"
                                            onClick={() =>
                                                router.push("/experiences")
                                            }
                                        >
                                            Collect more Postcards
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </>
                    )
                },
                {
                    name: "Stays",
                    childComp: (
                        <>
                            {userCollection.hotels &&
                                userCollection.hotels.length === 0 ? (
                                isActiveProfile(userData) ? (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Flex h={["20vw", "8.75vw"]} w={"100%"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>{"You have 0 Stays collected, Start Collecting now :)"}</Text>
                                            <Text as={Link} href={"/stays"} fontSize={["4vw", "1.67vw"]} fontFamily={"raleway"} fontWeight={500} textAlign={"center"} textDecoration={"underline"} color={"primary_3"}>Stays</Text>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>No Stays Collected</Text>
                                    </Flex>
                                )
                            ) : (
                                <Box mt={3} textAlign="center" w="100%">
                                    <Flex
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        my={[2, 6]}
                                    >
                                        {Filter["Stays"].country?.length >
                                            1 && (
                                                <CountryCustomFilter
                                                    fieldkey={"hotelName"}
                                                    filter={Filter["Stays"]}
                                                />
                                            )}
                                        {!(
                                            (Filter["Stays"].tags?.length <=
                                                1 &&
                                                !selectedTagsList?.hotelName) ||
                                            (selectedCountry?.hotelName &&
                                                userCollection?.hotels
                                                    ?.length <= 1)
                                        ) &&
                                            renderSelectInterest(
                                                "hotelName",
                                                Filter["Stays"]
                                            )}
                                    </Flex>
                                    {selectedTagsList?.hotelName?.length > 1 &&
                                        renderSelectedTagList("hotelName")}
                                    <NewStoryList
                                        mt={3}
                                        stories={userCollection.hotels}
                                        isStoriesLoading={false}
                                    />
                                    {isActiveProfile(userData) && (
                                        <Button
                                            my={5}
                                            mx="auto"
                                            borderRadius={"2.78vw"}
                                            onClick={() =>
                                                router.push("/stays")
                                            }
                                        >
                                            Collect more Stays
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </>
                    )
                },
                {
                    name: "Tours",
                    childComp: (
                        <>
                            {userCollection.tours &&
                                userCollection.tours.length === 0 ? (
                                isActiveProfile(userData) ? (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Flex h={["20vw", "8.75vw"]} w={"100%"} flexDirection={"column"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>{"You have 0 Tours collected, Start Collecting now :)"}</Text>
                                            <Text as={Link} href={"/tours"} fontSize={["4vw", "1.67vw"]} fontFamily={"raleway"} fontWeight={500} textAlign={"center"} textDecoration={"underline"} color={"primary_3"}>Tours</Text>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex w={"100%"} minH={["500px", "600px"]} py={["15%", 0]} justifyContent={"center"} alignItems={["flex-start", "center"]}>
                                        <Text maxW={["50vw", "27vw"]} fontSize={["4vw", "1.67vw"]} fontFamily={"lora"} fontStyle={"italic"} textAlign={"center"}>No Tours Collected</Text>
                                    </Flex>
                                )
                            ) : (
                                <Box mt={3} textAlign="center" w="100%">
                                    <Flex
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        my={[2, 6]}
                                    >
                                        {Filter["Tours"].country?.length >
                                            1 && (
                                                <CountryCustomFilter
                                                    fieldkey={"tourName"}
                                                    filter={Filter["Tours"]}
                                                />
                                            )}
                                        {!(
                                            (Filter["Tours"].tags?.length <=
                                                1 &&
                                                !selectedTagsList?.tourName) ||
                                            (selectedCountry?.tourName &&
                                                userCollection?.tours?.length <=
                                                1)
                                        ) &&
                                            renderSelectInterest(
                                                "tourName",
                                                Filter["Tours"]
                                            )}
                                    </Flex>
                                    {selectedTagsList?.tourName?.length > 1 &&
                                        renderSelectedTagList("tourName")}
                                    <NewStoryList
                                        mt={3}
                                        stories={userCollection.tours}
                                        isStoriesLoading={false}
                                    />
                                    {isActiveProfile(userData) && (
                                        <Button
                                            my={5}
                                            borderRadius={"2.78vw"}
                                            mx="auto"
                                            onClick={() =>
                                                router.push("/tours")
                                            }
                                        >
                                            Collect More Tours
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </>
                    )
                }
            ];
            setTabData(tabData);
            setLoading(false);
        }
    }, [userCollection, selectedTagsList]);

    const getData = async (expert) => {
        let bkmStory = await getBkmStory(expert.slug);
        let bkmAlbums = await fetchPaginatedResults(
            "follow-albums",
            {
                follower: expert.id
            },
            { album: { populate: populateAlbumData } }
        );
        bkmAlbums = Array.isArray(bkmAlbums) ? bkmAlbums : [bkmAlbums];
        let user = await getExpertbyUserLink(expert.slug);
        if (user && user[0]) setUserData(user[0]);
        setInitialData({
            userData: user[0] ?? {},
            bkmPostcards: bkmStory?.filter(bkm => bkm.postcard != null)?.map((bkm) => bkm.postcard),
            bkmTours:
                bkmAlbums && bkmAlbums.length > 0
                    ? bkmAlbums
                        .map((alb) => alb.album)
                        .filter(
                            (alb) =>
                                alb?.directories[0]?.name === "Designer Tours"
                        )
                    : [],
            bkmHotels:
                bkmAlbums && bkmAlbums.length > 0
                    ? bkmAlbums
                        .map((alb) => alb.album)
                        .filter(
                            (alb) =>
                                alb?.directories[0]?.name === "Postcard Stays | Conscious Luxury Travel"
                        )
                    : []
        });
        setSelectedCountry({ postcardName: "", hotelName: "", tourName: "" });

        setTimeout(() => {
            setLoading(false);
        }, 300);
    };

    const getDisplayPostcards = (postcards) => {
        // Determine the tags to use for filtering
        const tagsToUse = clickedTag?.postcardName
            ? [clickedTag.postcardName]
            : selectedTagsList?.postcardName;

        if (selectedCountry?.postcardName && tagsToUse?.length > 0) {
            // Filter postcards by both country name and tags
            return postcards.filter(
                (pc) =>
                    pc?.country?.name === selectedCountry.postcardName &&
                    pc?.tags?.some((tag) => tagsToUse.includes(tag.name))
            );
        } else if (selectedCountry?.postcardName) {
            // Filter postcards by country name only
            return postcards.filter(
                (pc) => pc?.country?.name === selectedCountry.postcardName
            );
        } else if (tagsToUse?.length > 0) {
            // Filter postcards by tags only
            return postcards.filter((pc) =>
                pc?.tags?.some((tag) => tagsToUse.includes(tag.name))
            );
        } else {
            // Return all postcards if no filter is applied
            return postcards;
        }
    };
    const getDisplayHotels = (hotels) => {
        // Determine the tags to use for filtering
        const tagsToUse = clickedTag?.hotelName
            ? [clickedTag.hotelName]
            : selectedTagsList?.hotelName;

        if (selectedCountry?.hotelName && tagsToUse?.length > 0) {
            // Filter hotels by both country name and tags
            return hotels.filter((hotel) =>
                hotel?.postcards?.some(
                    (postcard) =>
                        postcard?.country?.name === selectedCountry.hotelName &&
                        postcard?.tags?.some((tag) =>
                            tagsToUse.includes(tag.name)
                        )
                )
            );
        } else if (selectedCountry?.hotelName) {
            // Filter hotels by country name only
            return hotels.filter((hotel) =>
                hotel?.postcards?.some(
                    (postcard) =>
                        postcard?.country?.name === selectedCountry.hotelName
                )
            );
        } else if (tagsToUse?.length > 0) {
            // Filter hotels by tags only
            return hotels.filter((hotel) =>
                hotel?.postcards?.some((postcard) =>
                    postcard?.tags?.some((tag) => tagsToUse.includes(tag.name))
                )
            );
        } else {
            // Return all hotels if no filter is applied
            return hotels;
        }
    };
    const getDisplayTours = (tours) => {
        // Determine the tags to use for filtering
        const tagsToUse = clickedTag?.tourName
            ? [clickedTag.tourName]
            : selectedTagsList?.tourName;

        if (selectedCountry?.tourName && tagsToUse?.length > 0) {
            // Filter hotels by both country name and tags
            return tours.filter((tour) =>
                tour?.postcards?.some(
                    (postcard) =>
                        postcard?.country?.name === selectedCountry.tourName &&
                        postcard?.tags?.some((tag) =>
                            tagsToUse.includes(tag.name)
                        )
                )
            );
        } else if (selectedCountry?.tourName) {
            // Filter hotels by country name only
            return tours.filter((tour) =>
                tour?.postcards?.some(
                    (postcard) =>
                        postcard?.country?.name === selectedCountry.tourName
                )
            );
        } else if (tagsToUse?.length > 0) {
            // Filter hotels by tags only
            return tours.filter((tour) =>
                tour?.postcards?.some((postcard) =>
                    postcard?.tags?.some((tag) => tagsToUse.includes(tag.name))
                )
            );
        } else {
            // Return all hotels if no filter is applied
            return tours;
        }
    };

    const getTagList = (data, postcardInObject, key) => {
        const tags = [];
        const ids = new Set();
        function addToTags(postcards) {
            postcards?.forEach((postcard) => {
                postcard?.tags?.map((tag) => {
                    if (!ids.has(tag.id)) {
                        if (
                            selectedCountry &&
                            selectedCountry[key] &&
                            postcard?.country?.name !== selectedCountry[key]
                        ) {
                            return; // Skip this iteration if country name doesn't match
                        }
                        tags.push(tag.name);
                        ids.add(tag.id);
                    }
                });
            });
        }
        if (!postcardInObject) {
            addToTags(data);
        } else {
            data?.forEach((item) => addToTags(item?.postcards));
        }
        return tags;
    };

    return (
        <Box bg={"#f7ede2"}>
            <UserProfile slug={expert?.slug} />
            <Flex flexDirection={"column"}>

                <Flex position={"relative"} w={"100%"} h={["11.11vw", "3.33vw"]} bg={["#307fe27f", "#7faae3"]}>
                    {tabData?.map((tab, index) => {
                        let backgroundColor;
                        let textColor;

                        // Create a stack of indices
                        const stack = tabData.map((_, i) => i);

                        // Pop the selected tab index
                        const selectedIndex = stack.splice(selectedTab, 1)[0];

                        if (index === selectedIndex) {
                            backgroundColor = "#f7ede2"; // Selected tab color
                            textColor = "#EA6146"
                        } else {
                            textColor = "#EFE9E4"
                            // Determine the color for remaining tabs in the stack
                            if (stack.length > 0) {
                                const lowerIndex = stack[0]; // The first one in the stack (which is the lowest index after popping)

                                if (index === lowerIndex) {
                                    backgroundColor = "#EA6146"; // Lower index unselected tab color
                                } else {
                                    backgroundColor = "#EB836E"; // Remaining unselected tab color
                                }
                            }
                        }

                        return (
                            <Flex
                                key={index} // Add a unique key for each tab
                                zIndex={100 - index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTab(index);
                                }}
                                h={"100%"}
                                pr={["5.55vw", "2vw"]}
                                borderTopRightRadius={["4.167vw", "1.4vw"]}
                                justifyContent={"flex-end"}
                                alignItems={"center"}
                                position={"absolute"}
                                w={[`${47.22 + index * 23.62}vw`, `${20.7 + index * 9.4}vw`]}
                                textAlign={"right"}
                                top={0}
                                left={0}
                                backgroundColor={backgroundColor} // Use the determined background color
                                textColor={textColor}
                                fontFamily={"raleway"}
                                fontWeight={500}
                                fontSize={["4.44vw", "1.5vw"]}
                                boxShadow={selectedTab !== index && ["10px 0px 10px -7px rgba(0,0,0,0.1)", "15px 0px 10px -7px rgba(0,0,0,0.1)"]}
                                cursor={"pointer"}
                            >
                                {tab.name}
                            </Flex>
                        );
                    })}
                </Flex>

                <Flex w={"100%"} p={"5%"} pt={["12%", "5%"]}>
                    {tabData[selectedTab]?.childComp}
                </Flex>
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
        </Box >
    );
};

export default MyCollectionPage;
