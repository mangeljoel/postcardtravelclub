import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Flex,
    Text,
    useBreakpointValue,
    useToast
} from "@chakra-ui/react";
import CountryFilter from "./CountryFilter";
import AppContext from "../AppContext";
import SearchResults from "../Experiences/SearchResults";
import {
    createDBEntry,
    deleteDBEntry,
    fetchPaginatedResults,
    getTotalRecords
} from "../../queries/strapiQueries";
import { apiNames } from "../../services/fetchApIDataSchema";
import LoadingGif from "../../patterns/LoadingGif";
import strapi from "../../queries/strapi";
import { useSignupModal } from "../SignupModalContext";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import DebouncedAutoCompleteInput from "../../patterns/DebouncedAutoCompleteInput";
import axios from "axios";

const TagResultPage = ({ tag, type }) => {
    const { profile } = useContext(AppContext);
    const { openLoginModal } = useSignupModal();
    const [filter, setFilter] = useState({ selectedTags: [tag] });
    const [loading, setLoading] = useState(false);
    const [totalPostcards, setTotalPostcards] = useState(null);
    const [totalCountries, setTotalCountries] = useState(0);
    const [followId, setFollowId] = useState(null);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    const [searchText, setSearchText] = useState("");
    const [inputValue, debouncedValue, handleInputChange, resetInput] =
        useDebouncedInput(
            1000 // Debounce time
            // setSearchText // Callback function
        );
    const [searchLoading, setSearchLoading] = useState(false);
    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Utility function for capitalizing words
    const capitalizeWords = (sentence) =>
        sentence
            ?.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    // Fetch total postcards count
    const getTotalPostcards = useCallback(async () => {
        if (!tag?.name) return;

        try {
            const total = await getTotalRecords(
                apiNames.postcard,
                {
                    album: {
                        isActive: true,
                        directories: {
                            slug: { $in: ["mindful-luxury-hotels"] }
                        }
                    },
                    isComplete: true,
                    tags: { name: { $in: tag.name.toLowerCase() } }
                },
                {}
            );
            const res = await strapi.find(
                `country/getCountries?type=hotels&resultFor=postcards&tags=${tag?.id}`,
                {
                    sort: "name:ASC"
                }
            );
            setTotalCountries(res.length);
            setTotalPostcards(total || 0);
        } catch (error) {
            console.error("Failed to fetch total postcards:", error);
        }
    }, [tag]);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        // If mobile and navigator.share is supported, use the native share API
        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl
            });
        } else {
            // For desktop or when share is unavailable, copy the URL to clipboard
            try {
                navigator.clipboard
                    .writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `Link Copied`,
                            status: "success",
                            isClosable: true,
                            position: "top",
                            variant: "subtle"
                        });
                    })
                    .catch((err) => {
                        // console.log('Error copying URL:', err);
                    });
            } catch (err) {
                // console.log('Error:', err);
            }
        }
    };

    const followUnfollowTag = () => {
        if (profile) {
            if (!followId) {
                createDBEntry("follow-tags", {
                    follower: profile?.id,
                    tag: tag?.id
                }).then((data) => {
                    setFollowId(data?.data?.id);
                });
            } else {
                deleteDBEntry("follow-tags", followId).then(() => {
                    setFollowId(null);
                });
            }
        } else openLoginModal();
    };

    const getFollowId = () => {
        if (profile) {
            fetchPaginatedResults("follow-tags", {
                follower: profile.id,
                tag: tag?.id
            }).then((data) => {
                if (data)
                    setFollowId(Array.isArray(data) ? data[0]?.id : data?.id);
            });
        }
    };

    const handleAutoCompleteSelect = (value) => {
        handleInputChange({ target: { value } });
        setFilter((prev) => ({ searchText: value }));
    };

    const resetDebouncedInput = () => {
        resetInput();
        setFilter((prev) => ({ ...prev, searchText: "" }));
        setAutoCompleteItems([]);
    };

    const fetchAutoComplete = async (newSearch, reset = false) => {
        // if (!newSearch.trim() || newSearch.length < 3) {
        //     setAutoCompleteItems([]);
        //     setHasMore(false);
        //     return;
        // }

        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAutoCompleteItems`,
                {
                    params: {
                        type: "postcards",
                        search:
                            newSearch.trim()?.length > 1
                                ? newSearch.trim()
                                : "",
                        page: reset ? 1 : page,
                        pageSize: 15,
                        tag: tag?.id
                    }
                }
            );

            console.log(response.data);
            if (response?.data) {
                setAutoCompleteItems((prev) =>
                    reset
                        ? response.data.resultSet
                        : [...prev, ...response.data.resultSet]
                );
                setHasMore(response.data.length >= 15);
                if (reset) setPage(2);
                else setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    };

    const loadMoreItems = () => {
        fetchAutoComplete(inputValue);
    };

    useEffect(() => {
        // if (inputValue?.length < 3) {
        //     setAutoCompleteItems([]);
        //     return
        // }
        fetchAutoComplete(inputValue, true);
    }, [inputValue]);

    useEffect(() => {
        getTotalPostcards();
        getFollowId();
    }, [profile]);

    return totalPostcards ? (
        <Flex w="100%" flexDirection="column">
            <Flex flexDirection={"column"} w={"100%"} mb={["10vw", "3vw"]}>
                <Box
                    p={["5.55vw", "2.083vw"]}
                    borderRadius={["4.167vw", "2.083vw"]}
                    w={"100%"}
                    height={"auto"}
                >
                    <Box
                        w={"100%"}
                        h={"100%"}
                        bg={"black"}
                        borderRadius={["4.167vw", "2.083vw"]}
                        py={["9.167vw", "6.25vw"]}
                        px={["8.33vw", "5.83vw"]}
                        position={"relative"}
                    >
                        <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            gap={4}
                        >
                            <Text
                                as="h1"
                                fontSize={["9.44vw", "5.14vw"]}
                                lineHeight={["10.55vw", "6.5vw"]}
                                fontFamily={"lora"}
                                fontStyle={"italic"}
                                color={"white"}
                            >
                                {capitalizeWords(tag?.name)}
                            </Text>
                            {/* <Flex gap={4} display={["none", "flex"]}>
                                <Button variant="none" fontSize={"1.6vw"} borderRadius={"2.64vw"} h={"3.96vw"} px={"4.375vw"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>Share Directory</Button>
                                <Button variant="none" ml={4} fontSize={"1.6vw"} borderRadius={"2.64vw"} h={"3.96vw"} px={"4.375vw"} border="2px" borderColor={"white"} bg={followId ? "white" : "#111111"} color={followId ? "#111111" : "white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={followUnfollowTag}>{followId ? "Following" : "Follow"}</Button>
                            </Flex> */}
                        </Flex>
                        <Box
                            w={"100%"}
                            bg={"white"}
                            h={"3px"}
                            mt={["8.05vw", "5vw"]}
                        ></Box>
                        <Flex
                            justifyContent={"space-between"}
                            flexDirection={["column", "row"]}
                        >
                            <Flex
                                flexDirection={"column"}
                                mt={["5.55vw", "2.29vw"]}
                                gap={2}
                            >
                                <Text
                                    as={Flex}
                                    alignItems={"center"}
                                    fontSize={["3.61vw", "1.875vw"]}
                                    lineHeight={["4.72vw", "auto"]}
                                    h={["8.33vw", "3.96vw"]}
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                >{`${totalPostcards} Postcard Experiences`}</Text>
                                <Text
                                    as={Flex}
                                    alignItems={"center"}
                                    fontSize={["3.61vw", "1.875vw"]}
                                    lineHeight={["4.72vw", "auto"]}
                                    h={["8.33vw", "3.96vw"]}
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                >{`${totalCountries} Countries`}</Text>
                            </Flex>

                            <Flex
                                flexDirection={["row", "column"]}
                                mt={["5.55vw", "2.29vw"]}
                                gap={2}
                            >
                                {/* <Button variant="none" w={"50%"} mt={"7.22vw"} fontSize={"3.33vw"} borderRadius={"5.55vw"} h={"8.33vw"} px={"9.167vw"} border="2px" borderColor={"white"} color={"white"} fontFamily={"raleway"} fontWeight={500} _hover={{ bg: "white", color: "#111111" }} onClick={handleShareClick}>Share Directory</Button>
                                <Button variant="none" w={"50%"} mt={"7.22vw"} fontSize={"3.33vw"} borderRadius={"5.55vw"} h={"8.33vw"} px={"9.167vw"} border="2px" borderColor={"white"} bg={followId ? "white" : "#111111"} color={followId ? "#111111" : "white"} fontFamily={"raleway"} fontWeight={500} onClick={followUnfollowTag}>{followId ? "Following" : "Follow"}</Button> */}
                                <Button
                                    variant="none"
                                    fontSize={["3.33vw", "1.6vw"]}
                                    w={["50%", "auto"]}
                                    borderRadius={["5.55vw", "2.64vw"]}
                                    h={["8.33vw", "3.96vw"]}
                                    px={["9.167vw", "4.375vw"]}
                                    border="2px"
                                    borderColor={"white"}
                                    bg={followId ? "white" : "black"}
                                    color={followId ? "#111111" : "white"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    _hover={{ bg: "white", color: "#111111" }}
                                    onClick={followUnfollowTag}
                                >
                                    {followId ? "Following" : "Follow"}
                                </Button>
                                <Button
                                    variant="none"
                                    fontSize={["3.33vw", "1.6vw"]}
                                    w={["50%", "auto"]}
                                    borderRadius={["5.55vw", "2.64vw"]}
                                    h={["8.33vw", "3.96vw"]}
                                    px={["9.167vw", "4.375vw"]}
                                    border="2px"
                                    borderColor={"white"}
                                    color={"white"}
                                    fontFamily={"raleway"}
                                    fontWeight={500}
                                    _hover={{ bg: "white", color: "#111111" }}
                                    onClick={handleShareClick}
                                >
                                    Share
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            </Flex>

            <Box
                pos="relative"
                w="100%"
                pl={{ base: "5%", lg: "10%" }}
                pr={{ base: "5%", lg: "10%" }}
                mx="auto"
                textAlign="center"
            >
                {/* <DebouncedAutoCompleteInput inputValue={inputValue} handleInputChange={handleInputChange} resetInput={resetInput} autoCompleteItems={autoCompleteItems} loading={searchLoading} setIsSearchActive={setIsSearchActive} /> */}
                <DebouncedAutoCompleteInput
                    inputValue={inputValue}
                    handleInputChange={handleInputChange}
                    resetInput={resetDebouncedInput}
                    autoCompleteItems={autoCompleteItems}
                    loading={searchLoading}
                    handleAutoCompleteSelect={handleAutoCompleteSelect}
                    loadMoreItems={loadMoreItems}
                    hasMore={hasMore}
                />

                <CountryFilter
                    filter={filter}
                    setFilter={setFilter}
                    tag={tag}
                    type={"hotels"}
                />
                <Box w="100%" mb="1em" mt={{ base: "0", md: "1em" }}>
                    {/* <SearchResults searchFilter={filter} type="experiences" searchText={searchText} setSearchText={setSearchText} resetInput={resetInput}
                        setAutoCompleteItems={setAutoCompleteItems} loading={loading} setLoading={setLoading} isSearchActive={isSearchActive}
                        setSearchLoading={setSearchLoading} /> */}
                    <SearchResults
                        searchFilter={filter}
                        type={"experiences"}
                        profile={profile}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </Box>
            </Box>
        </Flex>
    ) : (
        <LoadingGif />
    );
};

export default TagResultPage;
