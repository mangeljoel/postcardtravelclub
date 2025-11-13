import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    InputGroup,
    Input,
    Icon,
    ModalOverlay,
    Text,
    useBreakpointValue
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { CloseIcon } from "../../../styles/ChakraUI/icons";
import { SearchIcon } from "@chakra-ui/icons";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import VideoPlayer from "./VideoPlayer";
import DebouncedAutoCompleteInput from "../../../patterns/DebouncedAutoCompleteInput";
import { createDBEntry } from "../../../queries/strapiQueries";

const HeroSection = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [autoCompleteItems, setAutoCompleteItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchLoading, setSearchLoading] = useState(false);

    const router = useRouter();

    const imageSrc = useBreakpointValue({
        base: "/assets/homepage/hero-section-mobile.jpeg", // mobile
        md: "/assets/homepage/hero-section-desktop.jpeg" // desktop
    });

    // Fetch autocomplete suggestions
    // Fetch autocomplete suggestions
    const fetchAutoComplete = async (newSearch, reset = false) => {
        setSearchLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAutoCompleteItems`,
                {
                    params: {
                        search: newSearch.trim() || "",
                        page: reset ? 1 : page,
                        pageSize: 15
                    }
                }
            );

            if (response?.data?.data) {
                const transformedData = response.data.data.map((item) => ({
                    ...item,
                    text: item.name || item.text // Convert 'name' to 'text'
                }));

                setAutoCompleteItems((prev) =>
                    reset ? transformedData : [...prev, ...transformedData]
                );
                setHasMore(response.data.data.length >= 15);
                setPage(reset ? 2 : (prev) => prev + 1);
            } else {
                if (reset) setAutoCompleteItems([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
            if (reset) setAutoCompleteItems([]);
            setHasMore(false);
        } finally {
            setSearchLoading(false);
        }
    };
    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    // Fetch autocomplete when search query changes (with debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Fetch for any input length, including empty (for initial suggestions)
            fetchAutoComplete(searchQuery, true);
        }, 300); // Reduced to 300ms for better responsiveness

        return () => clearTimeout(timeoutId);
    }, [searchQuery]); // This will trigger on every change, including backspace

    // Reset search input
    const resetSearch = () => {
        setSearchQuery("");
        setAutoCompleteItems([]);
        setPage(1);
        setHasMore(true);
    };

    // Handle selection from autocomplete dropdown
    const handleAutoCompleteSelect = async (selectedText) => {
        // Find the selected item to get its type and other data
        const selectedItem = autoCompleteItems.find(
            (item) => item.text === selectedText
        );
        router.push(`/experiences?search=${encodeURIComponent(selectedText)}`);
        await createDBEntry("events", { event_master: 7,searchText:{searchText:selectedText,type:"autocomplete",searchFor:"experience"}});
    };

    // Handle search button click
    const handleSearchClick = (query) => {
        if (query && query.trim()) {
            router.push(
                `/experiences?search=${encodeURIComponent(query.trim())}`
            );
        }
    };

    // Load more items for infinite scroll
    const loadMoreItems = () => {
        if (hasMore && !searchLoading) {
            fetchAutoComplete(searchQuery);
        }
    };

    return (
        <>
            <Modal isOpen={isVideoModalOpen} size="full" isCentered>
                <ModalOverlay />
                <ModalContent background={"#307FE2"} borderRadius={0}>
                    <Box
                        onClick={() => setIsVideoModalOpen(false)}
                        position={"absolute"}
                        top={"2%"}
                        right={"2%"}
                        width={["40px", "50px", "60px"]}
                        _hover={{
                            cursor: "pointer",
                            "svg .outer-rect": {
                                stroke: "#111111"
                            },
                            svg: {
                                fill: "#111111"
                            }
                        }}
                    >
                        <CloseIcon width={"100%"} height={"100%"} />
                    </Box>
                    <ModalBody
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <VideoPlayer
                            boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                            width={["100%", "85%"]}
                            height={["100%", "85%"]}
                            url="https://www.youtube.com/watch?v=CucfpZnTKvw"
                            customPlay={false}
                            autoPlay={true}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Box pos="relative" mx={[0, "1.56vw"]}>
                <Flex
                    direction="column"
                    position={"relative"}
                  //  overflow="hidden"
                    width={["95vw", "96.88vw"]}
                    borderRadius={["15px", "15px", "30px"]}
                    justifyContent={["space-between", "flex-end"]}
                    height={["65vh", "65vh", "80vh", "80vh", "80vh"]}
                >
                    <ChakraNextImage
                        rel={"preload"}
                        src={imageSrc}
                        w="100%"
                        overflow="hidden"
                        // borderRadius={["15px", "15px", "30px"]}
                        h="100%"
                        objectFit="cover"
                        alt="Background Image"
                        borderRadius={["4.167vw", "2.083vw"]}
                        noLazy={true}
                        priority={true}
                    />
                    <Flex
                        w="100%"
                        direction={"column"}
                        justifyContent={["space-around", "auto"]}
                        pos="absolute"
                        h="100%"
                    >
                        <Flex
                            w="100%"
                            h="100%"
                            direction={["column", "column"]}
                            justifyContent={["flex-start", "center"]}
                            alignItems="center"
                            textAlign="center"
                            mx="auto"
                        >
                            <Box
                                display="flex"
                                flexDirection={["column", "row"]}
                                alignItems={["flex-start"]}
                                my="3vw"
                                mb={["6vw"]}
                                textAlign={["center"]}
                                gap={["4vw", "0"]}
                            >
                                <Text
                                    as="h1"
                                    mt={["22vw", 0]}
                                    mb={["6vw", 0]}
                                    px={3}
                                    fontFamily="raleway"
                                    fontWeight={600}
                                    fontSize={["32px", "4vw"]}
                                    lineHeight={["34px", "5vw"]}
                                    color="#EFE9E4"
                                >
                                    Discover the world of {" "}<br/>
                                    <Text
                                        as="span"
                                        fontFamily="lora"
                                        fontStyle="italic"
                                        fontWeight={400}
                                        fontSize={["36px", "4.6vw"]}
                                        lineHeight={["34px", "4.6vw"]}
                                    >
                                        conscious luxury travel.
                                    </Text>
                                </Text>
                            </Box>

                            <DebouncedAutoCompleteInput
                                type="hero"
                                inputValue={searchQuery}
                                handleInputChange={handleInputChange}
                                resetInput={resetSearch}
                                autoCompleteItems={autoCompleteItems}
                                loading={searchLoading}
                                handleAutoCompleteSelect={
                                    handleAutoCompleteSelect
                                }
                                loadMoreItems={loadMoreItems}
                                hasMore={hasMore}
                                placeholder="Search by country, region or interest"
                                onSearch={handleSearchClick}
                            />

                        </Flex>
                    </Flex>
                </Flex>
                <Box
                    w={"100%"}
                    h={"20%"}
                    bottom={0}
                    mt={"auto"}
                    position={"absolute"}
                    borderRadius={["4.167vw", "2.083vw"]}
                    top={0}
                    bg={"linear-gradient(to top, #111111 2%, transparent)"}
                ></Box>
            </Box>
        </>
    );
};

export default HeroSection;
