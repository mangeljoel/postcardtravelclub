import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'
import { transformFilterData } from '../../services/utilities'
import FilterItem from './FilterItem'
import { useRouter } from 'next/router'

const GuidedSearchDxExps = ({ type, filter, setFilter, hasAccess, filterData }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const router = useRouter()
    // const [allCards, setAllCards] = useState([])

    // const countries = useCountries(type || 'hotels', slug, aff)
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [tagGroups, setTagGroups] = useState([])
    const [selectedTagGroup, setSelectedTagGroup] = useState(null)

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const [selectAll, setSelectAll] = useState({
        countries: false,
        regions: false,
        tagGroups: false,
        tags: false,
    })

    const isMobile = useBreakpointValue({ base: true, md: false });
    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    useEffect(() => {
        const selectedJson = (() => {
            if (selectedTagGroup) {
                return filterData["tagGroups"][selectedTagGroup]
            } else if (selectedRegion) {
                return filterData["regions"][selectedRegion]
            } else if (selectedCountry) {
                return filterData["countries"][selectedCountry]
            } else {
                return filterData["countries"]
            }
        })()

        const selectedFilter = () => {
            if (selectedTagGroup) {
                return [selectedTagGroup ? selectedTagGroup : null, null]
            } else if (selectedRegion) {
                return [selectedTagGroup ? selectedTagGroup : null, null]
            } else {
                return [selectedRegion ? selectedRegion : null, selectedTagGroup ? selectedTagGroup : null, null]
            }
        }
        if (Array.isArray(selectedJson)) {
            setTags(selectedJson)
            return
        }
        // console.log("selectedJson", selectedJson)
        // console.log("filterData", result)
        const routerCountry = router.query.country || null
        const routerRegion = router.query.region || null
        const result = filterByLevels(selectedJson, selectedFilter())

        if (routerCountry || routerRegion) {
            // if (result?.level1?.length == 0) {
            //     setTagGroups([])
            //     setTags([])
            //     return
            // }
            if (!selectedJson) {
                !routerRegion && setRegions([])
                setTagGroups([])
                setTags([])
            }
        }
        if (Object.keys(result).length == 4) {
            // console.log("result", result)
            if (!selectedCountry) setCountries(result.level1)
            setRegions(result.level2)
            setTagGroups(result.level3)
            setTags(result.level4)
        } else if (Object.keys(result).length == 3) {
            if (!selectedRegion) setRegions(result.level1)
            setTagGroups(result.level2)
            setTags(result.level3)
        } else if (Object.keys(result).length == 2) {
            if (!selectedTagGroup) setTagGroups(result.level1)
            setTags(result.level2)
        } else {
            setTags(result.level1)
        }
    }, [filterData, selectedCountry, selectedRegion, selectedTagGroup])

    function filterByLevels(data, filter = []) {
        const result = {};

        function traverse(node, level) {
            if (!result[`level${level + 1}`]) {
                result[`level${level + 1}`] = new Set();
            }

            if (Array.isArray(node)) {
                for (const item of node) {
                    if (item === 'empty') continue;
                    if (!filter[level] || filter[level] === item) {
                        result[`level${level + 1}`].add(item);
                    }
                }
            } else if (typeof node === 'object' && node !== null) {
                for (const [key, value] of Object.entries(node)) {
                    const isEmptyKey = key === 'empty';
                    if (!isEmptyKey && (!filter[level] || filter[level] === key)) {
                        result[`level${level + 1}`].add(key);
                    }
                    traverse(value, level + 1); // Always process children
                }
            }
        }

        traverse(data, 0);

        // Convert Sets to Arrays in final output
        const formattedResult = {};
        for (const [level, values] of Object.entries(result)) {
            formattedResult[level] = Array.from(values);
        }

        return formattedResult;
    }

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
                    (tabName === 'country' && (selectedCountry || selectAll?.countries)) ||
                    (tabName === 'region' && (selectedRegion || selectAll?.regions)) ||
                    (tabName === 'tagGroup' && (selectedTagGroup || selectAll?.tagGroups)) ||
                    (tabName === 'interest' && (selectedTags?.length > 0))
                )

                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && (filter?.country || selectAll?.countries)) ||
                    (tabName === 'region' && (filter?.region || selectAll?.regions)) ||
                    (tabName === 'tagGroup' && (filter?.tagGroup || selectAll?.tagGroups)) ||
                    (tabName === 'interest' && (filter?.selectedTags?.length > 0))
                )

                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedCountry, selectedRegion, selectedTagGroup, selectedTags, filter])

    // Calculate text color based on background
    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const toggleTagSelection = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.some((t) => t === tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    const handleNextClick = () => {
        if (currentTab === 'country') {
            if (regions?.length > 0) setCurrentTab('region');
            else if (tagGroups?.length > 0) setCurrentTab('tagGroup');
            else if (tags?.length > 0) setCurrentTab('interest');
            else handleApply();
        }
        else if (currentTab === 'region') {
            if (tagGroups?.length > 0) setCurrentTab('tagGroup');
            else if (tags?.length > 0) setCurrentTab('interest');
            else handleApply();
        }
        else if (currentTab === 'tagGroup') {
            if (tags?.length > 0) setCurrentTab('interest');
            else handleApply();
        }
        else setCurrentTab('interest');
    };

    const handleApply = () => {
        // if (callBeforeApply) callBeforeApply();
        setFilter({
            country: selectedCountry ? { name: selectedCountry } : null,
            region: selectedRegion ? { name: selectedRegion } : null,
            tagGroup: selectedTagGroup ? { name: selectedTagGroup } : null,
            selectedTags: selectedTags ? selectedTags : [],
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, tagGroup: null, selectedTags: [] });
        const { country, region, ...rest } = router.query;
        router.push({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
        setSelectedCountry(null);
        setSelectedRegion(null);
        setSelectedTagGroup(null);
        setSelectedTags([]);
        setOpen(false);
    };

    const centerElementInView = () => {
        const element = document.getElementById("GuidedSearchDx" + type);
        const modalBody = document.getElementById("GuidedSearchBody" + type);

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
            // document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Reset overflow on cleanup
        };
    }, [open]);

    // Set internal states when modal opens
    //fix .name issue
    useEffect(() => {
        if (open) {
            filter?.country && setSelectedCountry(filter?.country?.name)
            filter?.region && setSelectedRegion(filter?.region?.name)
            filter?.tagGroup && setSelectedTagGroup(filter?.tagGroup?.name)
            filter?.selectedTags && setSelectedTags(filter?.selectedTags || [])
        }
    }, [open, filter])

    useEffect(() => {
        async function changeTab() {
            if (selectedTagGroup) {
                if (tags?.length > 0) setCurrentTab('interest');
                else handleApply();
            }
            else if (selectedRegion) {
                if (tagGroups?.length > 0) setCurrentTab('tagGroup');
                else if (tags?.length > 0) setCurrentTab('interest');
                else handleApply();
            }
            else if (selectedCountry) {
                if (regions?.length > 0) setCurrentTab('region');
                else if (tagGroups?.length > 0) setCurrentTab('tagGroup');
                else if (tags?.length > 0) setCurrentTab('interest');
                else handleApply();
            }
        }
        changeTab()
    }, [selectedCountry, selectedRegion, selectedTagGroup, regions, tagGroups, tags])

    useEffect(() => {
        // if (hasAccess) {
        const country = router.query.country || null
        const region = router.query.region || null
        setSelectedCountry(country)
        // setCountries((prev) => country ? [country] : prev)
        setSelectedRegion(region)
        // setRegions((prev) => region ? [region] : prev)
        !open && setFilter({
            country: country ? { name: country } : null,
            region: region ? { name: region } : null,
        })
        country || region && setSelectedTagGroup(null)
        country || region && setSelectedTags([])
        // }
    }, [router.query])

    const changeCountry = (value) => {
        const query = { ...router.query };

        if (value) {
            query.country = value;
        } else {
            delete query.country;
        }

        delete query.region; // Always remove region when country changes

        router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    };

    const changeRegion = (value) => {
        const query = { ...router.query };

        if (value) {
            query.region = value;
        } else {
            delete query.region;
        }

        router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    };


    return (
        <Box id={"GuidedSearchDx" + type} w={["100%", "70%"]} position={"relative"} display={"flex"} flexDirection={"column"} alignItems={"center"} mx={"auto"} >
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
                {!(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0)) ? (
                    <Button
                        variant="solid"
                        bg="#EB836E"
                        color="white"
                        borderRadius={["7.22vw", "2.78vw"]}
                        px={["6vw", "5vw"]}
                        py={["3vw", "1.5vw"]}
                        fontFamily="raleway"
                        fontSize={["3vw", "1.46vw"]}
                        fontWeight={600}
                        onClick={(e) => handleOpen(e, "country")}
                    >
                        Try Postcard Guided Search
                    </Button>
                ) : (
                    <>
                        <FilterHeader
                            isFirst={true}
                            bg={calcBg("country")}
                            color={calcTextColor("country")}
                            zIndex={open ? 65 : 15}
                            onClick={(e) => handleOpen(e, "country")}
                            displayText={open ?
                                (selectAll?.countries ? truncateText("All Countries") : selectedCountry ? truncateText(selectedCountry) : "Country") :
                                (selectAll?.countries ? truncateText("All Countries") : filter?.country ? truncateText(filter?.country.name) : "Country")
                            }
                        />
                        {regions?.length > 0 && <FilterHeader
                            isFirst={false}
                            bg={calcBg("region")}
                            color={calcTextColor("region")}
                            zIndex={open ? 64 : 14}
                            onClick={(e) => handleOpen(e, "region")}
                            displayText={open ?
                                (selectAll?.regions ? truncateText("All Regions") : selectedRegion ? truncateText(selectedRegion) : "Region") :
                                (selectAll?.regions ? truncateText("All Regions") : filter?.region ? truncateText(filter?.region.name) : "Region")
                            }
                        />}
                        {tagGroups?.length > 0 && <FilterHeader
                            isFirst={false}
                            bg={calcBg("tagGroup")}
                            color={calcTextColor("tagGroup")}
                            zIndex={open ? 63 : 13}
                            onClick={(e) => handleOpen(e, "tagGroup")}
                            displayText={open ?
                                (selectAll?.tagGroups ? truncateText("All Themes") : selectedTagGroup ? truncateText(selectedTagGroup) : "Theme") :
                                (selectAll?.tagGroups ? truncateText("All Themes") : filter?.tagGroup ? truncateText(filter?.tagGroup.name) : "Theme")
                            }
                        />}
                        {tags?.length > 0 && <FilterHeader
                            isFirst={false}
                            bg={calcBg("interest")}
                            color={calcTextColor("interest")}
                            zIndex={open ? 62 : 12}
                            onClick={(e) => handleOpen(e, "interest")}
                            displayText={open ?
                                (selectedTags?.length > 0 ? `${selectedTags.length} Interests` : "Interest") :
                                (filter?.selectedTags?.length > 0 ? `${filter?.selectedTags?.length} Interests` : "Interest")
                            }
                        />}
                    </>)}
            </Flex>
            <Flex id={"GuidedSearchBody" + type} flexDirection={"column"} display={open ? "flex" : "none"} maxH={["85vh", "43.96vw"]} minH={["30vh"]} h={["auto", "43.96vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} pb={["7.77vw", "2.64vw"]} pt={["10%", "5%"]} w={["100%", "100%"]} bg={"white"} zIndex={60} position={"absolute"} left={0} justifyContent={"space-between"}>

                {currentTab == "country" && (<>
                    {countries?.length > 0 ?
                        <Flex
                            animation={
                                currentTab == "country"
                                    ? "fadeIn 1s ease-in-out forwards"
                                    : "fadeOut 1s ease-in-out forwards"
                            }
                            flexDirection={"column"} h={"100%"}
                            pt={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0)) ? ["6.4vw", "2.64vw"] : ""}
                            overflow={"hidden"} position={"relative"}>
                            <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT COUNTRY"}</Text>
                            <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                            <Flex
                                overflow={"auto"}
                                flexDirection={"column"}
                                position="relative"
                                h="100%"
                                pb={["15vw", "10vw"]}
                            >
                                <FilterItem
                                    type={1}
                                    onClick={() => {
                                        setSelectAll((prev) => ({ ...prev, countries: !prev.countries }));
                                        setSelectedCountry(null);
                                        setSelectedRegion(null);
                                        setSelectedTagGroup(null);
                                        setSelectedTags([])
                                    }}
                                    selectedState={selectAll?.countries}
                                    displayText={selectAll?.countries ? "Clear All" : "Select All"}
                                />

                                <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                    {countries.map((value, index) => (
                                        <FilterItem
                                            type={1}
                                            key={index}
                                            onClick={() => {
                                                setSelectAll((prev) => ({ ...prev, countries: false }));
                                                selectedCountry == value ? changeCountry(null) : changeCountry(value)
                                                setSelectedRegion(null)
                                                setSelectedTagGroup(null)
                                                setSelectedTags([])
                                            }
                                            }
                                            selectedState={selectedCountry == value || selectAll?.countries}
                                            displayText={value}
                                        />
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
                        </Flex>
                        : <Flex flex={1} h={"90%"} justify={"center"} alignItems={"center"}>
                            <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                                {"No Countries"}
                            </Text>
                        </Flex>}
                </>)}

                {currentTab == "region" && (<>
                    {
                        regions?.length > 0 ?
                            <Flex
                                animation={
                                    currentTab == "region"
                                        ? "fadeIn 1s ease-in-out forwards"
                                        : "fadeOut 1s ease-in-out forwards"
                                }
                                flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0)) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
                                <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT REGION"}</Text>
                                <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                                <Flex
                                    overflow={"auto"}
                                    flexDirection={"column"}
                                    position="relative"
                                    h="100%"
                                    pb={["15vw", "10vw"]}
                                >
                                    <FilterItem
                                        type={2}
                                        onClick={() => {
                                            setSelectAll((prev) => ({ ...prev, regions: !prev.regions }));
                                            setSelectedRegion(null);
                                            setSelectedTagGroup(null);
                                            setSelectedTags([])
                                        }}
                                        selectedState={selectAll?.regions}
                                        displayText={selectAll?.regions ? "Clear All" : "Select All"}
                                    />

                                    <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                        {regions.map((value, index) => (
                                            <FilterItem
                                                type={2}
                                                key={index}
                                                onClick={() => {
                                                    setSelectAll((prev) => ({ ...prev, regions: false }));
                                                    selectedRegion == value ? changeRegion(null) : changeRegion(value)
                                                    setSelectedTagGroup(null)
                                                    setSelectedTags([])
                                                }
                                                }
                                                selectedState={selectedRegion == value || selectAll?.regions}
                                                displayText={value}
                                            />
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
                            </Flex>
                            : <Flex flex={1} h={"90%"} justify={"center"} alignItems={"center"}>
                                <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                                    {"No Regions"}
                                </Text>
                            </Flex>
                    }</>)}

                {currentTab == "tagGroup" && (<>
                    {tagGroups?.length > 0 ?
                        <Flex
                            animation={
                                currentTab == "tagGroup"
                                    ? "fadeIn 1s ease-in-out forwards"
                                    : "fadeOut 1s ease-in-out forwards"
                            }
                            flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0)) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
                            <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT THEME"}</Text>
                            <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                            <Flex
                                overflow={"auto"}
                                flexDirection={"column"}
                                position="relative"
                                h="100%"
                                pb={["15vw", "10vw"]}
                            >
                                <FilterItem
                                    type={1}
                                    onClick={() => {
                                        setSelectAll((prev) => ({ ...prev, tagGroups: !prev.tagGroups }));
                                        setSelectedTagGroup(null);
                                        setSelectedTags([])
                                    }}
                                    selectedState={selectAll?.tagGroups}
                                    displayText={selectAll?.tagGroups ? "Clear All" : "Select All"}
                                />

                                <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                    {tagGroups.map((value, index) => (
                                        <FilterItem
                                            type={1}
                                            key={index}
                                            onClick={() => {
                                                setSelectAll((prev) => ({ ...prev, tagGroups: false }));
                                                selectedTagGroup == value ? setSelectedTagGroup(null) : setSelectedTagGroup(value)
                                                setSelectedTags([])
                                            }
                                            }
                                            selectedState={selectedTagGroup == value || selectAll?.tagGroups}
                                            displayText={value}
                                        />
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
                        </Flex>
                        : <Flex flex={1} h={"90%"} justify={"center"} alignItems={"center"}>
                            <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                                {"All Themes"}
                            </Text>
                        </Flex>}
                </>)}

                {currentTab == "interest" && (<>
                    {tags?.length > 0 ?
                        <Flex
                            animation={
                                currentTab
                                    ? "fadeIn 1s ease-in-out forwards"
                                    : "fadeOut 1s ease-in-out forwards"
                            }
                            flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0)) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
                            <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT INTERESTS"}</Text>
                            <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                            <Flex
                                overflow={"auto"}
                                flexDirection={"column"}
                                position="relative"
                                h="100%"
                                pb={["15vw", "10vw"]}
                            >
                                <FilterItem
                                    type={3}
                                    onClick={() => selectedTags?.length == tags?.length ? setSelectedTags([]) : setSelectedTags(tags || [])}
                                    selectedState={tags?.length == selectedTags?.length}
                                    displayText={selectedTags?.length === tags?.length ? "Clear All" : "Select All"}
                                />

                                <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                    {tags.map((value, index) => (
                                        <FilterItem
                                            type={3}
                                            key={index}
                                            onClick={() => toggleTagSelection(value)}
                                            selectedState={selectedTags.some((t) => t === value)}
                                            displayText={value}
                                        />
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
                        </Flex>
                        : <Flex flex={1} h={"90%"} justify={"center"} alignItems={"center"}>
                            <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                                {"No Interests"}
                            </Text>
                        </Flex>}
                </>)}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={() => handleReset(false)}>Reset</Button>
                        {currentTab == "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                        {currentTab !== "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchDxExps