import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import { fetchPaginatedResults, getCountries } from '../../queries/strapiQueries'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'

const GuidedSearchAlbum = ({ filter, setFilter, type, forProfile = false, slug, aff }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const countries = useCountries(type || 'hotels', slug, aff)
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const handleOpen = (e, tabName) => {
        e.stopPropagation()
        setCurrentTab(tabName)
        if (!open) {
            setOpen(true);
        }
    }

    const calcBg = useMemo(() => {
        return (tabName) => {
            // If modal is open, use internal states
            if (open) {
                if (currentTab === tabName) return '#EDB6A9'
                if (
                    (tabName === 'country' && selectedCountry) ||
                    (tabName === 'interest' && selectedTags?.length > 0)
                )

                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'interest' && filter?.selectedTags?.length > 0)
                )

                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedCountry, selectedTags, filter])

    // Calculate text color based on background
    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const toggleTagSelection = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.some((t) => t.id === tag.id) ? prevTags.filter((t) => t.id !== tag.id) : [...prevTags, tag]
        );
    };

    const handleNextClick = () => {
        if (currentTab === "country") setCurrentTab("interest");
    };

    const handleApply = () => {
        setFilter({
            country: selectedCountry?.id !== -1 ? selectedCountry : null,
            selectedTags: selectedTags,
        });
        setOpen(false);
    };

    const handleReset = () => {
        setFilter({ country: null, selectedTags: [] });
        setSelectedCountry(null);
        setSelectedTags([]);
        setOpen(false);
    };

    const fetchTags = useCallback(async () => {
        const queryParts = ['type=hotels']
        if (forProfile && slug) {
            queryParts.push(`profile=${slug}`)
            queryParts.push(`resultFor=albums`)
        }
        if (aff) queryParts.push(`affiliation=${aff}`)
        if (selectedCountry && selectedCountry?.id !== -1) queryParts.push(`country=${selectedCountry?.id}`)
        const query = queryParts?.length > 0 ? `?${queryParts.join('&')}` : ''
        const res = await strapi.find(`tags/getTags${query}`);
        setTags(res);
        // setCurrentTab("interest");
    }, [selectedCountry]);

    const centerElementInView = () => {
        const element = document.getElementById("GuidedSearchAlbum");
        const modalBody = document.getElementById("GuidedSearchBody");

        if (element && modalBody) {
            const elementRect = element.getBoundingClientRect();
            const bodyRect = modalBody.getBoundingClientRect();
            const elementTop = elementRect.top + window.scrollY;
            const windowHeight = window.innerHeight;
            const bodyHeight = bodyRect.height;

            // Calculate the scroll position to center the element
            const scrollPosition = elementTop - (windowHeight - bodyHeight) / 2;

            // Smoothly scroll to the calculated position
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (open) {
            centerElementInView();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Reset overflow on cleanup
        };
    }, [open]);

    // Set internal states when modal opens
    useEffect(() => {
        if (open) {
            setSelectedCountry(filter?.country)
            setSelectedTags(filter?.selectedTags || [])
        }
    }, [open, filter])

    useEffect(() => {
        fetchTags();
    }, [selectedCountry]);

    const commonStyles = {
        borderRadius: ["7.22vw", "2.78vw"],
        w: "100%",
        boxShadow: ["20px 0px 15px -3px rgba(0,0,0,0.1)", "20px 0px 15px -3px rgba(0,0,0,0.1)"],
        bg: "white",
        ml: ["-7vw", "-3vw"],
        justify: "center",
        alignItems: "center",
        fontSize: ["3.056vw", "1.46vw"],
        fontWeight: 600,
        fontFamily: "raleway",
        color: "primary_1",
        transition: "background-color 1s ease"
    }

    return (
        <Box id={"GuidedSearchAlbum"} w={"100%"} px={["0%", "10%"]} position={"relative"}>
            {/* Overlay */}
            {open && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    zIndex={59}
                    bg="rgba(0, 0, 0, 0.4)" // Adjust transparency as needed
                    backdropFilter="blur(2px)"
                ></Box>
            )}

            <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
                <Flex
                    {...{
                        ...commonStyles,
                        ml: "",
                        bg: calcBg("country"),
                        color: calcTextColor("country")
                    }}
                    zIndex={open ? 64 : 14}
                    onClick={(e) => handleOpen(e, "country")}
                >
                    {open ?
                        (selectedCountry ? selectedCountry.name : "Country") :
                        (filter?.country ? filter?.country?.name : "Country")
                    }
                </Flex>
                <Flex
                    {...{
                        ...commonStyles,
                        boxShadow: "",
                        bg: calcBg("interest"),
                        color: calcTextColor("interest"),
                        pl: ["5%", "0"]
                    }}
                    zIndex={open ? 61 : 11}
                    onClick={(e) => handleOpen(e, "interest")}
                >
                    {open ?
                        (selectedTags?.length > 0 && selectedTags.length) :
                        (filter?.selectedTags?.length > 0 && filter?.selectedTags?.length)
                    } Interests
                </Flex>
            </Flex>
            <Flex id={"GuidedSearchBody"} flexDirection={"column"} display={open ? "flex" : "none"} h={["auto", "43.96vw"]} maxH={["85vh", "43.96vw"]} mt={["-9.167vw", "-3.472vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} py={["7.77vw", "2.64vw"]} w={["100%", "80%"]} mx={[0, "10%"]} bg={"white"} zIndex={60} position={"absolute"} left={0} justifyContent={"space-between"}>

                {currentTab == "country" &&
                    <Flex
                        animation={
                            currentTab === "country"
                                ? "fadeIn 1s ease-in-out forwards"
                                : "fadeOut 1s ease-in-out forwards"
                        }
                        flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                        <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT COUNTRY</Text>
                        <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                        <Flex
                            overflow={"auto"}
                            flexDirection={"column"}
                            position="relative"
                            h="100%"
                            pb={["15vw", "10vw"]}
                        >
                            <Text fontSize={["3.611vw", "1.46vw"]} fontFamily={"raleway"} color={selectedCountry?.id == -1 ? "primary_1" : "#646260"} textAlign={"left"} cursor={"pointer"}
                                onClick={(e) => {
                                    if (selectedCountry?.id == -1) {
                                        setSelectedCountry(null)
                                    }
                                    else {
                                        setSelectedCountry({ id: -1, name: "All Countries" });
                                    }
                                    setSelectedTags([])
                                }}
                            >
                                {selectedCountry?.id == -1 ? "Clear All" : "Select All"}
                            </Text>
                            {/* {Object.keys(countries).sort().map((letter) => (
                            <Box key={letter} mt={["4vw", "1.4vw"]}>
                                <Text fontFamily={"raleway"} fontSize={["3.611vw", "1.46vw"]} color={"#B8B3AF"} textAlign={"left"}>
                                    {letter}
                                </Text>
                                <Flex flexWrap={"wrap"} gap={["2vw", "1.4vw"]} mt={["2vw", "1.4vw"]}>
                                    {countries[letter].map((country, index) => (
                                        <Text
                                            w={"30%"}
                                            fontSize={["3.611vw", "1.46vw"]}
                                            fontFamily={"raleway"}
                                            color={selectedCountry == country.id ? "primary_1" : "#646260"}
                                            textAlign={"left"}
                                            key={index}
                                            onClick={(e) => {
                                                setSelectedCountry(country);
                                                setCurrentTab("category");
                                                setSelectedCatgory(null)
                                                setSelectedTags([])
                                            }}
                                            cursor="pointer"
                                        >
                                            {country.name}
                                        </Text>
                                    ))}
                                </Flex>
                            </Box>
                        ))} */}

                            <Flex flexWrap={"wrap"} gap={["2vw", "1.4vw"]} mt={["2vw", "1.4vw"]}>
                                {countries.map((country, index) => (
                                    <Text
                                        w={"30%"}
                                        fontSize={["3.611vw", "1.46vw"]}
                                        fontFamily={"raleway"}
                                        color={selectedCountry?.id == -1 || selectedCountry?.id == country.id ? "primary_1" : "#646260"}
                                        textAlign={"left"}
                                        key={index}
                                        onClick={(e) => {
                                            if (selectedCountry?.id == country?.id) {
                                                setSelectedCountry(null)
                                            }
                                            else {
                                                setSelectedCountry(country);
                                                setCurrentTab("interest");
                                            }
                                            setSelectedTags([])
                                        }}
                                        cursor="pointer"
                                    >
                                        {country.name}
                                    </Text>
                                ))}
                            </Flex>
                        </Flex>

                        {/* Gradient Overlay */}
                        <Box
                            w="100%"
                            h={["20%", "30%"]}
                            bg={"linear-gradient(to top, white 33%, transparent)"}
                            position="absolute"
                            bottom="0"
                            zIndex={61}
                            pointerEvents="none" /* Ensures it doesn't block interactions with content */
                        />
                    </Flex>}

                {currentTab == "interest" &&
                    <Flex
                        animation={
                            currentTab === "interest"
                                ? "fadeIn 1s ease-in-out forwards"
                                : "fadeOut 1s ease-in-out forwards"
                        }
                        flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                        <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT INTERESTS</Text>
                        <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                        <Flex
                            overflow={"auto"}
                            flexDirection={"column"}
                            position="relative"
                            h={"100%"}
                            maxH={["60vh", "100%"]}
                            pb={["15vw", "10vw"]}
                        >
                            <Text as={Flex} px={["8.33vw", "2.67vw"]} minH={["8.33vw", "3.125vw"]} fontSize={["3.33vw", "1.25vw"]} borderRadius={["7.22vw", "2.78vw"]} border={["1px", "2px"]} borderColor={tags?.length == selectedTags?.length ? "primary_1" : "#807D7B"} color={tags?.length == selectedTags?.length ? "primary_1" : "#807D7B"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} cursor={"pointer"}
                                onClick={() => {
                                    if (tags?.length == selectedTags?.length) {
                                        setSelectedTags([])
                                    }
                                    else {
                                        setSelectedTags(tags)
                                    }
                                }}
                            >
                                {tags?.length == selectedTags?.length ? "Clear All" : "Select All"}
                            </Text>
                            <Flex mt={["4vw", "2.98vw"]} flexWrap={"wrap"} gap={["1.67vw", "0.833vw"]}>
                                {tags?.map((tag) => (
                                    <Text as={Flex} px={["4vw", "2.67vw"]} minH={["8.33vw", "3.125vw"]} fontSize={["3.33vw", "1.25vw"]} borderRadius={["7.22vw", "2.78vw"]} border={["1px", "2px"]} borderColor={selectedTags.some((t) => t.id === tag.id) ? "primary_1" : "#807D7B"} color={selectedTags.some((t) => t.id === tag.id) ? "primary_1" : "#807D7B"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} onClick={() => toggleTagSelection(tag)} cursor={"pointer"}>{tag.name}</Text>
                                ))}
                            </Flex>
                        </Flex>

                        {/* Gradient Overlay */}
                        <Box
                            w="100%"
                            h={["20%", "30%"]}
                            bg={"linear-gradient(to top, white 33%, transparent)"}
                            position="absolute"
                            bottom="0"
                            zIndex={61}
                            pointerEvents="none" /* Ensures it doesn't block interactions with content */
                        />
                    </Flex>}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => setOpen(false)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#B8B3AF"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={handleReset}>Reset</Button>
                        {currentTab == "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                        {currentTab !== "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchAlbum