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

const GuidedSearchDxStays = ({ type, filter, setFilter, hasAccess, filterData }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const router = useRouter()
    // const [allCards, setAllCards] = useState([])

    // const countries = useCountries(type || 'hotels', slug, aff)
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [envs, setEnvs] = useState([])
    const [selectedEnv, setSelectedEnv] = useState(null)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

    const [selectAll, setSelectAll] = useState({
        countries: false,
        regions: false,
        environment: false,
        category: false,
    })

    const isMobile = useBreakpointValue({ base: true, md: false });
    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    useEffect(() => {
        const selectedJson = (() => {
            if (selectedEnv) {
                return filterData["environments"][selectedEnv]
            } else if (selectedRegion) {
                return filterData["regions"][selectedRegion]
            } else if (selectedCountry) {
                return filterData["countries"][selectedCountry]
            } else {
                return filterData["countries"]
            }
        })()

        const selectedFilter = () => {
            if (selectedEnv) {
                return [selectedEnv ? selectedEnv : null, null]
            } else if (selectedRegion) {
                return [selectedEnv ? selectedEnv : null, null]
            } else {
                return [selectedRegion ? selectedRegion : null, selectedEnv ? selectedEnv : null, null]
            }
        }
        if (Array.isArray(selectedJson)) {
            setCategories(selectedJson)
            return
        }
        // console.log("selectedJson", selectedJson)
        // console.log("filterData", result)
        const routerCountry = router.query.country || null
        const routerRegion = router.query.region || null
        const result = filterByLevels(selectedJson, selectedFilter())

        if (routerCountry || routerRegion) {
            // if (result?.level1?.length == 0) {
            //     setEnvs([])
            //     setCategories([])
            //     return
            // }
            if (!selectedJson) {
                !routerRegion && setRegions([])
                setEnvs([])
                setCategories([])
            }
        }
        if (Object.keys(result).length == 4) {
            // console.log("result", result)
            if (!selectedCountry) setCountries(result.level1)
            setRegions(result.level2)
            setEnvs(result.level3)
            setCategories(result.level4)
        } else if (Object.keys(result).length == 3) {
            if (!selectedRegion) setRegions(result.level1)
            setEnvs(result.level2)
            setCategories(result.level3)
        } else if (Object.keys(result).length == 2) {
            if (!selectedEnv) setEnvs(result.level1)
            setCategories(result.level2)
        } else {
            setCategories(result.level1)
        }
    }, [filterData, selectedCountry, selectedRegion, selectedEnv])

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
                    (tabName === 'region' && (selectedRegion || selectAll?.regions)) ||
                    (tabName === 'environment' && (selectedEnv || selectAll?.environment)) ||
                    (tabName === 'category' && (selectedCategory || selectAll?.category))
                )
                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && (filter?.country || selectAll?.countries)) ||
                    (tabName === 'region' && (filter?.region || selectAll?.regions)) ||
                    (tabName === 'environment' && (filter?.environment || selectAll?.environment)) ||
                    (tabName === 'category' && (filter?.category || selectAll?.category))
                )
                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedCountry, selectedRegion, selectedEnv, selectedCategory, filter])

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
            else if (envs?.length > 0) setCurrentTab('environment');
            else if (categories?.length > 0) setCurrentTab('category');
            else handleApply();
        }
        else if (currentTab === 'region') {
            if (envs?.length > 0) setCurrentTab('environment');
            else if (categories?.length > 0) setCurrentTab('category');
            else handleApply();
        }
        else if (currentTab === 'environment') {
            if (categories?.length > 0) setCurrentTab('category');
            else handleApply();
        }
        else setCurrentTab('category');
    };

    const handleApply = () => {
        // if (callBeforeApply) callBeforeApply();
        setFilter({
            country: selectedCountry ? { name: selectedCountry } : null,
            region: selectedRegion ? { name: selectedRegion } : null,
            environment: selectedEnv ? { name: selectedEnv } : null,
            category: selectedCategory ? { name: selectedCategory } : null,
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, environment: null, category: null });
        const { country, region, ...rest } = router.query;
        router.push({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
        setSelectedCountry(null);
        setSelectedRegion(null);
        setSelectedEnv(null);
        setSelectedCategory(null);
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
            filter?.environment && setSelectedEnv(filter?.environment?.name)
            filter?.category && setSelectedCategory(filter?.category?.name)
        }
    }, [open, filter])

    useEffect(() => {
        async function changeTab() {
            if (selectedEnv) {
                if (categories?.length > 0) setCurrentTab('category');
                else handleApply();
            }
            else if (selectedRegion) {
                if (envs?.length > 0) setCurrentTab('environment');
                else if (categories?.length > 0) setCurrentTab('category');
                else handleApply();
            }
            else if (selectedCountry) {
                // console.log(regions)
                if (regions?.length > 0) setCurrentTab('region');
                else if (envs?.length > 0) setCurrentTab('environment');
                else if (categories?.length > 0) setCurrentTab('category');
                else handleApply();
            }
        }
        changeTab()
    }, [selectedCountry, selectedRegion, selectedEnv, regions, envs, categories])

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
        country || region && setEnvs([])
        country || region && setCategories([])
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
                {!(filter?.country || filter?.region || filter?.environment || filter?.category) ? (
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
                        {envs?.length > 0 && <FilterHeader
                            isFirst={false}
                            bg={calcBg("environment")}
                            color={calcTextColor("environment")}
                            zIndex={open ? 63 : 13}
                            onClick={(e) => handleOpen(e, "environment")}
                            displayText={open ?
                                (selectAll?.environment ? truncateText("All Environments") : selectedEnv ? truncateText(selectedEnv) : "Environment") :
                                (selectAll?.environment ? truncateText("All Environments") : filter?.environment ? truncateText(filter?.environment.name) : "Environment")
                            }
                        />}
                        {categories?.length > 0 && <FilterHeader
                            isFirst={false}
                            bg={calcBg("category")}
                            color={calcTextColor("category")}
                            zIndex={open ? 62 : 12}
                            onClick={(e) => handleOpen(e, "category")}
                            displayText={open ?
                                (selectAll?.category ? truncateText("All Types") : selectedCategory ? truncateText(selectedCategory) : "Type") :
                                (selectAll?.category ? truncateText("All Types") : filter?.category ? truncateText(filter?.category.name) : "Type")
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
                            flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.environment || filter?.category) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
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
                                        setSelectedEnv(null);
                                        setSelectedCategory(null)
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
                                                setSelectedEnv(null)
                                                setSelectedCategory(null)
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
                                flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.environment || filter?.category) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
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
                                            setSelectedEnv(null);
                                            setSelectedCategory(null)
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
                                                    setSelectedEnv(null)
                                                    setSelectedCategory(null)
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

                {/* {currentTab == "environment" && envs?.length > 0 && <FilterDisplay
                    type={3}
                    animation={currentTab == "environment"}
                    headerText={"SELECT ENVIRONMENT"}
                    selectedValue={selectedEnv}
                    onSelectAll={(e) => {
                        if (selectedEnv?.id == -1) {
                            setSelectedEnv(null)
                        }
                        else {
                            setSelectedEnv({ id: -1, name: "All Environments" });
                        }
                    }}
                    values={envs}
                    onSelectValue={(env) => {
                        if (selectedEnv?.id == env?.id) {
                            setSelectedEnv(null)
                        }
                        else {
                            setSelectedEnv(env);
                            // setCurrentTab("category");
                        }
                        setSelectedCategory(null)
                    }}
                    emptyState={"No Environments"}
                />} */}

                {currentTab == "environment" && (<>
                    {
                        envs?.length > 0 ?
                            <Flex
                                animation={
                                    currentTab == "environment"
                                        ? "fadeIn 1s ease-in-out forwards"
                                        : "fadeOut 1s ease-in-out forwards"
                                }
                                flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.environment || filter?.category) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
                                <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT ENVIRONMENT"}</Text>
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
                                            setSelectAll((prev) => ({ ...prev, environment: !prev.environment }));
                                            setSelectedEnv(null);
                                            setSelectedCategory(null)
                                        }}
                                        selectedState={selectAll?.environment}
                                        displayText={selectAll?.environment ? "Clear All" : "Select All"}
                                    />

                                    <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                        {envs.map((value, index) => (
                                            <FilterItem
                                                type={1}
                                                key={index}
                                                onClick={() => {
                                                    setSelectAll((prev) => ({ ...prev, environment: false }));
                                                    selectedEnv == value ? setSelectedEnv(null) : setSelectedEnv(value)
                                                    setSelectedCategory(null)
                                                }
                                                }
                                                selectedState={selectedEnv == value || selectAll?.environment}
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
                                    {"No Environments"}
                                </Text>
                            </Flex>
                    }</>)}

                {/* {currentTab == "category" && categories?.length > 0 && <FilterDisplay
                    type={3}
                    animation={currentTab == "category"}
                    headerText={"SELECT TYPE"}
                    selectedValue={selectedCategory}
                    onSelectAll={(e) => {
                        if (selectedCategory?.id == -1) {
                            setSelectedCategory(null)
                        }
                        else {
                            setSelectedCategory({ id: -1, name: "All Types" });
                        }
                    }}
                    values={categories}
                    onSelectValue={(cat) => {
                        if (selectedCategory?.id == cat?.id) {
                            setSelectedCategory(null)
                        }
                        else {
                            setSelectedCategory(cat);
                            // setCurrentTab("category");
                        }
                    }}
                    emptyState={"No Types"}
                />} */}

                {currentTab == "category" && (<>
                    {
                        categories?.length > 0 ?
                            <Flex
                                animation={
                                    currentTab == "category"
                                        ? "fadeIn 1s ease-in-out forwards"
                                        : "fadeOut 1s ease-in-out forwards"
                                }
                                flexDirection={"column"} h={"100%"} pt={(filter?.country || filter?.region || filter?.environment || filter?.category) ? ["6.4vw", "2.64vw"] : ""} overflow={"hidden"} position={"relative"}>
                                <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{"SELECT TYPE"}</Text>
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
                                        onClick={() => {
                                            setSelectAll((prev) => ({ ...prev, category: !prev.category }));
                                            setSelectedCategory(null)
                                        }}
                                        selectedState={selectAll?.category}
                                        displayText={selectAll?.category ? "Clear All" : "Select All"}
                                    />

                                    <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                                        {categories.map((value, index) => (
                                            <FilterItem
                                                type={3}
                                                key={index}
                                                onClick={() => {
                                                    setSelectAll((prev) => ({ ...prev, category: false }));
                                                    selectedCategory == value ? setSelectedCategory(null) : setSelectedCategory(value)
                                                }
                                                }
                                                selectedState={selectedCategory == value || selectAll?.category}
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
                                    {"No Types"}
                                </Text>
                            </Flex>
                    }</>)}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={() => handleReset(false)}>Reset</Button>
                        {currentTab == "category" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                        {currentTab !== "category" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchDxStays