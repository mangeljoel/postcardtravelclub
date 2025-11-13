import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'
import { set } from 'lodash'
import { ca } from 'date-fns/locale'
import FilterItem from './FilterItem'
import { useRouter } from 'next/router'

const GuidedSearchDxRes = ({ type, filter, setFilter, hasAccess, filterData }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const router = useRouter()
    // const [allCards, setAllCards] = useState([])

    // const countries = useCountries(type || 'hotels', slug, aff)
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [selectAll, setSelectAll] = useState({
        countries: false,
        regions: false,
    })

    const isMobile = useBreakpointValue({ base: true, md: false });
    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    useEffect(() => {
        const selectedJson = (() => {
            if (selectedCountry) {
                return filterData["countries"][selectedCountry]
            } else {
                return filterData["countries"]
            }
        })()

        const selectedFilter = () => {
            if (selectedRegion) {
                return [null]
            } else {
                return [selectedRegion ? selectedRegion : null, null]
            }
        }
        if (Array.isArray(selectedJson)) {
            setRegions(selectedJson)
            return
        }
        const result = filterByLevels(selectedJson, selectedFilter())
        // console.log("selectedJson", selectedJson)
        // console.log("filterData", result)

        if (Object.keys(result).length == 2) {
            // console.log("result", result)
            if (!selectedCountry) setCountries(result.level1)
            setRegions(result.level2)
        } else {
            setRegions(result.level1)
        }
    }, [filterData, selectedCountry, selectedRegion])

    function filterByLevels(data, filter = []) {
        // console.log("filterByLevels", data, filter)
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
                    (tabName === 'region' && (selectedRegion || selectAll?.regions))
                )
                    return '#EB836E'
                return 'white'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && (filter?.country || selectAll?.countries)) ||
                    (tabName === 'region' && (filter?.region || selectAll?.regions))
                )
                    return '#EB836E'
                return 'white'
            }
        }
    }, [open, currentTab, selectedCountry, selectedRegion, filter])

    // Calculate text color based on background
    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const handleNextClick = () => {
        if (currentTab === 'country') {
            if (regions?.length > 0) setCurrentTab('region');
            else handleApply();
        }
    }

    const handleApply = () => {
        // if (callBeforeApply) callBeforeApply();
        setFilter({
            country: selectedCountry ? { name: selectedCountry } : null,
            region: selectedRegion ? { name: selectedRegion } : null,
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, });
        const { country, region, ...rest } = router.query;
        router.push({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
        setSelectedCountry(null);
        setSelectedRegion(null);
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
    useEffect(() => {
        if (open) {
            filter?.country && setSelectedCountry(filter?.country?.name)
            filter?.region && setSelectedRegion(filter?.region?.name)
        }
    }, [open, filter])

    useEffect(() => {
        async function changeTab() {
            if (selectedCountry) {
                // console.log(regions)
                if (regions?.length > 0) setCurrentTab('region');
                else handleApply();
            }
        }
        changeTab()
    }, [selectedCountry, selectedRegion, regions,])

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
                            flexDirection={"column"} h={"100%"} pt={["6.4vw", "2.64vw"]} overflow={"hidden"} position={"relative"}>
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
                                flexDirection={"column"} h={"100%"} pt={["6.4vw", "2.64vw"]} overflow={"hidden"} position={"relative"}>
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

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={() => handleReset(false)}>Reset</Button>
                        {currentTab == "region" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                        {currentTab !== "region" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchDxRes