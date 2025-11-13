import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'
import { set } from 'lodash'
import { ca } from 'date-fns/locale'

const FilterTravelogueStays = ({ type, filter, setFilter, cards }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const [allCards, setAllCards] = useState([])

    // const countries = useCountries(type || 'hotels', slug, aff)
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [envs, setEnvs] = useState([])
    const [selectedEnv, setSelectedEnv] = useState(null)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (cards?.length && allCards.length === 0) {
            setAllCards(cards)
        }
    }, [cards, allCards])

    useEffect(() => {
        const countryMap = new Map()
        const regionMap = new Map()
        const environmentMap = new Map()
        const categoryMap = new Map()

        const isCountrySelected = selectedCountry && selectedCountry.id !== -1
        const isRegionSelected = selectedRegion && selectedRegion.id !== -1
        const isEnvSelected = selectedEnv && selectedEnv.id !== -1

        allCards?.forEach((card) => {
            // Always collect country (independent)
            if (card?.country?.id) {
                countryMap.set(card.country.id, card.country)
            }

            // Region filter: must match selectedCountry (if any)
            if (
                card?.region?.id &&
                (!isCountrySelected || card.country?.id === selectedCountry.id)
            ) {
                regionMap.set(card.region.id, card.region)
            }

            // Environment filter: must match selectedCountry and selectedRegion (if any)
            if (
                card?.environment?.id &&
                (!isCountrySelected || card.country?.id === selectedCountry.id) &&
                (!isRegionSelected || card.region?.id === selectedRegion.id)
            ) {
                environmentMap.set(card.environment.id, card.environment)
            }

            // Category filter: must match selectedCountry, selectedRegion, and selectedEnv (if any)
            if (
                card?.category?.id &&
                (!isCountrySelected || card.country?.id === selectedCountry.id) &&
                (!isRegionSelected || card.region?.id === selectedRegion.id) &&
                (!isEnvSelected || card.environment?.id === selectedEnv.id)
            ) {
                categoryMap.set(card.category.id, card.category)
            }
        })

        setCountries(Array.from(countryMap.values()))
        setRegions(Array.from(regionMap.values()))
        setEnvs(Array.from(environmentMap.values()))
        setCategories(Array.from(categoryMap.values()))
    }, [allCards, selectedCountry, selectedRegion, selectedEnv])

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
                    (tabName === 'region' && selectedRegion) ||
                    (tabName === 'environment' && selectedEnv) ||
                    (tabName === 'category' && selectedCategory)
                )

                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'region' && filter?.region) ||
                    (tabName === 'environment' && filter?.environment) ||
                    (tabName === 'category' && filter?.category)
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
            country: selectedCountry,
            region: selectedRegion,
            environment: selectedEnv,
            category: selectedCategory,
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, environment: null, category: null });
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
            filter?.country && setSelectedCountry(filter?.country)
            filter?.region && setSelectedRegion(filter?.region)
            filter?.environment && setSelectedEnv(filter?.environment)
            filter?.category && setSelectedCategory(filter?.category)
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
                console.log(regions)
                if (regions?.length > 0) setCurrentTab('region');
                else if (envs?.length > 0) setCurrentTab('environment');
                else if (categories?.length > 0) setCurrentTab('category');
                else handleApply();
            }
        }
        changeTab()
    }, [selectedCountry, selectedRegion, selectedEnv, regions, envs, categories])

    useEffect(() => console.log(currentTab), [currentTab])
    // useEffect(() => console.log(regions), [regions])
    // const filteredRegions = useMemo(() => {
    //     return regions?.filter((region) =>
    //         selectedCountry?.id ? region?.country?.id === selectedCountry?.id : true
    //     );
    // }, [regions, selectedCountry]);

    // const filteredEnvs = useMemo(() => {
    //     return environmenList?.filter((env) =>
    //         selectedRegion?.id ? env?.region?.id === selectedRegion?.id : true
    //     );
    // }, [environmenList, selectedRegion, selectedCountry]);

    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

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
                        (selectedCountry ? truncateText(selectedCountry.name) : "Country") :
                        (filter?.country ? truncateText(filter?.country.name) : "Country")
                    }
                />
                {regions?.length > 0 && <FilterHeader
                    isFirst={false}
                    bg={calcBg("region")}
                    color={calcTextColor("region")}
                    zIndex={open ? 64 : 14}
                    onClick={(e) => handleOpen(e, "region")}
                    displayText={open ?
                        (selectedRegion ? truncateText(selectedRegion.name) : "Region") :
                        (filter?.region ? truncateText(filter?.region.name) : "Region")
                    }
                />}
                {envs?.length > 0 && <FilterHeader
                    isFirst={false}
                    bg={calcBg("environment")}
                    color={calcTextColor("environment")}
                    zIndex={open ? 63 : 13}
                    onClick={(e) => handleOpen(e, "environment")}
                    displayText={open ?
                        (selectedEnv ? truncateText(selectedEnv.name) : "Environment") :
                        (filter?.environment ? truncateText(filter?.environment.name) : "Environment")
                    }
                />}
                {categories?.length > 0 && <FilterHeader
                    isFirst={false}
                    bg={calcBg("category")}
                    color={calcTextColor("category")}
                    zIndex={open ? 62 : 12}
                    onClick={(e) => handleOpen(e, "category")}
                    displayText={open ?
                        (selectedCategory ? truncateText(selectedCategory.name) : "Type") :
                        (filter?.category ? truncateText(filter?.category.name) : "Type")
                    }
                />}
            </Flex>
            <Flex id={"GuidedSearchBody" + type} flexDirection={"column"} display={open ? "flex" : "none"} maxH={["85vh", "43.96vw"]} minH={["30vh"]} h={["auto", "43.96vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} pb={["7.77vw", "2.64vw"]} pt={["10%", "5%"]} w={["100%", "100%"]} bg={"white"} zIndex={60} position={"absolute"} left={0} justifyContent={"space-between"}>

                {currentTab == "country" && <FilterDisplay
                    type={1}
                    animation={currentTab == "country"}
                    headerText={"SELECT COUNTRY"}
                    selectedValue={selectedCountry}
                    onSelectAll={(e) => {
                        if (selectedCountry?.id == -1) {
                            setSelectedCountry(null)
                        }
                        else {
                            setSelectedCountry({ id: -1, name: "All Countries" });
                        }
                    }}
                    values={countries}
                    onSelectValue={(country) => {
                        if (selectedCountry?.id == country?.id) {
                            setSelectedCountry(null)
                        }
                        else {
                            setSelectedCountry(country);
                            // setRegions(regions.filter((region) => region?.country?.id == country?.id))
                            // setCurrentTab("region");
                        }
                        setSelectedRegion(null)
                        setSelectedEnv(null)
                        setSelectedCategory(null)
                    }}
                    emptyState={"No Countries"}
                />}

                {currentTab == "region" && regions?.length > 0 && <FilterDisplay
                    type={2}
                    animation={currentTab == "region"}
                    headerText={"SELECT REGION"}
                    selectedValue={selectedRegion}
                    onSelectAll={(e) => {
                        if (selectedRegion?.id == -1) {
                            setSelectedRegion(null)
                        }
                        else {
                            setSelectedRegion({ id: -1, name: "All Regions" });
                        }
                    }}
                    values={regions}
                    onSelectValue={(region) => {
                        if (selectedRegion?.id == region?.id) {
                            setSelectedRegion(null)
                        }
                        else {
                            setSelectedRegion(region);
                            // setCurrentTab("environment");
                        }
                        setSelectedEnv(null)
                        setSelectedCategory(null)
                    }}
                    emptyState={"No Regions"}
                />}

                {currentTab == "environment" && envs?.length > 0 && <FilterDisplay
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
                />}

                {currentTab == "category" && categories?.length > 0 && <FilterDisplay
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
                />}

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

export default FilterTravelogueStays