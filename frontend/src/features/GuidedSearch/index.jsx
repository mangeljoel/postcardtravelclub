import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import { fetchPaginatedResults, getCountries } from '../../queries/strapiQueries'
import strapi from '../../queries/strapi'

const GuidedSearch = ({ filter, setFilter }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const [countriesGrouped, setCountriesGrouped] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCatgory] = useState(null)
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const dropdownRef = useRef(null);

    const handleOpen = (e, tabName) => {
        e.stopPropagation()
        setCurrentTab(tabName)
        if (!open) {
            setOpen(true);
        }
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    const calcBg = (tabName) => {
        if (open && currentTab == tabName) {
            return "#EDB6A9"
        }
        else if ((tabName == "country" && selectedCountry) || (tabName == "category" && selectedCategory) || (tabName == "interest" && selectedTags?.length > 0)) {
            return "#EB836E"
        }
        else {
            return "white"
        }
    }

    const toggleTagSelection = (tag) => {
        setSelectedTags((prevTags) => {
            if (prevTags.some((t) => t.id === tag.id)) {
                return prevTags.filter((t) => t.id !== tag.id); // Remove if already selected
            } else {
                return [...prevTags, tag]; // Add if not selected
            }
        });
    };

    const handleNextClick = () => {
        if (currentTab == "country") {
            setCurrentTab("category")
        }
        else if (currentTab == "type") {
            setCurrentTab("category")
        }
        else {
            setCurrentTab("interest")
        }
    }

    const handleApply = () => {
        setFilter({
            country: selectedCountry,
            category: selectedCategory,
            selectedTags: selectedTags
        })
        setOpen(false)
    }

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    useEffect(() => {
        (async function getActiveCountries() {
            return await strapi.find("albums/findcountries", {
                sort: "name:ASC"
            });
        })().then((res) => {
            const sortedCountries = res.sort((a, b) => a.name.localeCompare(b.name));

            // Group by the first letter
            const grouped = sortedCountries.reduce((acc, country) => {
                const firstLetter = country.name[0].toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(country);
                return acc;
            }, {});

            setCountriesGrouped(grouped);
        })
    }, [])

    useEffect(() => {
        fetchPaginatedResults("categories").then((res) => {
            setCategories(res)
        })
    }, [])

    useEffect(() => {
        fetchPaginatedResults("tags").then((res) => {
            setTags(res)
        })
    }, [])

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
        color: "primary_1"
    }

    return (
        <Box w={"100%"} px={["0%", "10%"]} position={"relative"}>
            <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
                <Flex {...{ ...commonStyles, ml: "", bg: calcBg("country"), color: selectedCountry ? "white" : "primary_1" }} zIndex={14} onClick={(e) => handleOpen(e, "country")} >{selectedCountry ? selectedCountry.name : "Country"}</Flex>
                <Flex {...{ ...commonStyles, bg: calcBg("type"), color: false ? "white" : "primary_1" }} zIndex={13} onClick={(e) => handleOpen(e, "type")} >Type</Flex>
                <Flex {...{ ...commonStyles, bg: calcBg("category"), color: selectedCategory ? "white" : "primary_1", pl: ["5%", "0"] }} zIndex={12} onClick={(e) => handleOpen(e, "category")} >{selectedCategory ? selectedCategory.name : "Category"}</Flex>
                <Flex {...{ ...commonStyles, boxShadow: "", bg: calcBg("interest"), color: selectedTags?.length > 0 ? "white" : "primary_1", pl: ["5%", "0"] }} zIndex={11} onClick={(e) => handleOpen(e, "interest")} >{selectedTags?.length > 0 && selectedTags.length} Interests</Flex>
            </Flex>
            <Flex ref={dropdownRef} flexDirection={"column"} display={open ? "flex" : "none"} h={["124.44vw", "43.96vw"]} mt={["-9.167vw", "-3.472vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} py={["7.77vw", "2.64vw"]} w={["100%", "80%"]} mx={[0, "10%"]} bg={"white"} zIndex={10} position={"absolute"} left={0} justifyContent={"space-between"}>

                {currentTab == "country" && <Flex flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                    <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT COUNTRY</Text>
                    <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                    <Flex
                        overflow={"auto"}
                        flexDirection={"column"}
                        position="relative"
                        h="100%"
                        pb={["22vw", "10vw"]}
                    >
                        {/* <Text fontSize={"1.46vw"} fontFamily={"raleway"} color={!selectedCountry ? "primary_1" : "#646260"} textAlign={"left"} cursor={"pointer"} onClick={() => setSelectedCatgory(null)}>
                            Select All
                        </Text> */}
                        {Object.keys(countriesGrouped).sort().map((letter) => (
                            <Box key={letter} mt={["4vw", "1.4vw"]}>
                                <Text fontFamily={"raleway"} fontSize={["3.611vw", "1.46vw"]} color={"#B8B3AF"} textAlign={"left"}>
                                    {letter}
                                </Text>
                                <Flex flexWrap={"wrap"} gap={["2vw", "1.4vw"]} mt={["2vw", "1.4vw"]}>
                                    {countriesGrouped[letter].map((country, index) => (
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
                        ))}
                    </Flex>

                    {/* Gradient Overlay */}
                    <Box
                        w="100%"
                        h={["27%", "30%"]}
                        bg={"linear-gradient(to top, white 33%, transparent)"}
                        position="absolute"
                        bottom="0"
                        zIndex={11}
                        pointerEvents="none" /* Ensures it doesn't block interactions with content */
                    />
                </Flex>}

                {currentTab == "type" && <Flex flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                    <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT TYPE</Text>
                    <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>
                </Flex>}

                {currentTab == "category" && <Flex flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                    <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT CATEGORY</Text>
                    <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                    <Flex
                        overflow={"auto"}
                        flexDirection={"column"}
                        position="relative"
                        h="100%"
                        pb={["22vw", "10vw"]}
                    >
                        {/* <Text as={Flex} px={"2.67vw"} minH={"3.125vw"} fontSize={"1.25vw"} borderRadius={"2.78vw"} bg={!selectedCategory ? "primary_1" : "#D9D9D9"} color={!selectedCategory ? "white" : "#111111"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} cursor={"pointer"} onClick={() => setSelectedCatgory(null)}>Select All</Text> */}
                        <Flex mt={["4vw", "2.98vw"]} flexWrap={"wrap"} gap={["1.67vw", "0.833vw"]}>
                            {categories?.map((cat) => (
                                <Text as={Flex} px={["8.33vw", "2.67vw"]} h={["8.33vw", "3.125vw"]} fontSize={["3.33vw", "1.25vw"]} borderRadius={["7.22vw", "2.78vw"]} bg={selectedCategory?.id == cat.id ? "primary_1" : "#D9D9D9"} color={selectedCategory?.id == cat.id ? "white" : "#111111"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} onClick={() => { setSelectedCatgory(cat); setCurrentTab("interest"); setSelectedTags([]) }} cursor={"pointer"}>{cat.name}</Text>
                            )
                            )}
                        </Flex>
                    </Flex>

                    {/* Gradient Overlay */}
                    <Box
                        w="100%"
                        h={["27%", "30%"]}
                        bg={"linear-gradient(to top, white 33%, transparent)"}
                        position="absolute"
                        bottom="0"
                        zIndex={11}
                        pointerEvents="none" /* Ensures it doesn't block interactions with content */
                    />
                </Flex>}

                {currentTab == "interest" && <Flex flexDirection={"column"} h={"90%"} pt={["6.4vw", "2.64vw"]} position={"relative"}>
                    <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>SELECT INTERESTS</Text>
                    <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                    <Flex
                        overflow={"auto"}
                        flexDirection={"column"}
                        position="relative"
                        h="100%"
                        pb={["22vw", "10vw"]}
                    >
                        <Text as={Flex} px={["8.33vw", "2.67vw"]} minH={["8.33vw", "3.125vw"]} fontSize={["3.33vw", "1.25vw"]} borderRadius={["7.22vw", "2.78vw"]} border={["1px", "2px"]} borderColor={selectedTags?.length === 0 ? "primary_1" : "#807D7B"} color={selectedTags?.length === 0 ? "primary_1" : "#807D7B"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} cursor={"pointer"} onClick={() => setSelectedTags([])}>Select All</Text>
                        <Flex mt={["4vw", "2.98vw"]} flexWrap={"wrap"} gap={["1.67vw", "0.833vw"]}>
                            {tags?.map((tag) => (
                                <Text as={Flex} px={["4vw", "2.67vw"]} minH={["8.33vw", "3.125vw"]} fontSize={["3.33vw", "1.25vw"]} borderRadius={["7.22vw", "2.78vw"]} border={["1px", "2px"]} borderColor={selectedTags.some((t) => t.id === tag.id) ? "primary_1" : "#807D7B"} color={selectedTags.some((t) => t.id === tag.id) ? "primary_1" : "#807D7B"} w={"fit-content"} justifyContent={"center"} alignItems={"center"} fontFamily={"raleway"} fontWeight={500} onClick={() => toggleTagSelection(tag)} cursor={"pointer"}>{tag.name}</Text>
                            ))}
                        </Flex>
                    </Flex>

                    {/* Gradient Overlay */}
                    <Box
                        w="100%"
                        h={["27%", "30%"]}
                        bg={"linear-gradient(to top, white 33%, transparent)"}
                        position="absolute"
                        bottom="0"
                        zIndex={11}
                        pointerEvents="none" /* Ensures it doesn't block interactions with content */
                    />
                </Flex>}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => setOpen(false)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#B8B3AF"} />
                    </Box>

                    {currentTab == "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                    {currentTab !== "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearch