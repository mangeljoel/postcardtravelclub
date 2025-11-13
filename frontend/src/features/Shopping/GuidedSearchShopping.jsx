import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import { fetchPaginatedResults, getCountries } from '../../queries/strapiQueries'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from '../GuidedSearch/FilterDisplay'
import FilterHeader from '../GuidedSearch/FilterHeader'
import { apiNames, populateAlbumData } from '../../services/fetchApIDataSchema'
import LoadingGif from '../../patterns/LoadingGif'

const GuidedSearchShopping = ({ getFilters, isDiary, filter, setFilter, slug, aff, callBeforeApply }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const [totalFnds, setTotalFnds] = useState([]);
    const [displayFnds, setDisplayFnds] = useState([]);
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const [environments, setEnvironments] = useState([])
    const [selectedEnvironment, setSelectedEnvironment] = useState(null)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])

    const [tagGroups, setTagGroups] = useState([])
    const [selectedTagGroup, setSelectedTagGroup] = useState(null)

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const isMobile = useBreakpointValue({ base: true, md: false });
    const baseFilter = isDiary ? {
        isActive: true,

        directories: { slug: { $in: ["shopping-conscious-luxury-travel"] } },
        follow_albums: {
            follower: { slug: { $in: [slug] } }
        }
    } : {
        isActive: true,

        directories: { slug: { $in: ["shopping-conscious-luxury-travel"] } }
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
                    (tabName === 'country' && selectedCountry) ||
                    (tabName === 'region' && selectedRegion) ||
                    (tabName === 'type' && selectedEnvironment) ||
                    (tabName === 'cuisines' && selectedCategory.length > 0)
                )

                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'region' && filter?.region) ||
                    (tabName === 'type' && filter?.environment) ||
                    (tabName === 'cuisines' && filter?.category?.length > 0)
                )

                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedCountry, selectedEnvironment, selectedCategory, selectedTagGroup, selectedTags, filter])

    // Calculate text color based on background
    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const toggleTagSelection = (tag) => {
        setSelectedCategory((prevTags) =>
            prevTags.some((t) => t.id === tag.id)
                ? prevTags.filter((t) => t.id !== tag.id)
                : [...prevTags, tag]
        );
    };

    const handleNextClick = () => {
        if (currentTab === 'country') setCurrentTab('region');
        else if (currentTab === 'region') setCurrentTab('type');
        else if (currentTab === 'type') setCurrentTab('cuisines');
        else setCurrentTab('cuisines');


    };

    const handleApply = () => {
        if (callBeforeApply) callBeforeApply();
        setFilter({
            country: selectedCountry,
            region: selectedRegion,
            environment: selectedEnvironment,
            selectedCategory,

        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, environment: null, category: null, tagGroup: null, selectedTags: [] })
        setSelectedCountry(null);
        setSelectedEnvironment(null);
        setSelectedRegion(null);
        setSelectedCategory([]);
        setSelectedTagGroup(null);
        setSelectedTags([]);
        setOpen(false);
    };

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
        fetchInitialData(baseFilter);

    }, [])
    const fetchInitialData = async (filter) => {
        strapi.request("get", `/albums/findCountries?type=fnd`, {}).then((countries) => { if (countries) setCountries(countries || []) });

        const totalFnds = await fetchPaginatedResults(apiNames.album,
            filter ? filter : baseFilter,
            populateAlbumData);
        setTotalFnds(Array.isArray(totalFnds) ? totalFnds : [totalFnds]);
        setDisplayFnds(Array.isArray(totalFnds) ? totalFnds : [totalFnds]);


    }
    useEffect(() => {

        let filter = baseFilter;
        if (selectedCountry?.id && selectedCountry?.id != -1) filter = { ...filter, country: selectedCountry.id };
        if (selectedRegion?.id && selectedRegion?.id != -1) filter = { ...filter, region: selectedRegion.id };
        if (selectedEnvironment?.id && selectedEnvironment?.id != -1) filter = { ...filter, environment: selectedEnvironment.id };
        //if (selectedCategory && selectedCategory.length > 1) filter = { ...filter, cuisines: { name: { $in: selectedCategory.map((cat => cat.name)) } } }
        fetchInitialData(filter);

    }, [selectedCountry, selectedRegion, selectedEnvironment])

    useEffect(() => { calculateFilters(); }, [displayFnds])
    const calculateFilters = () => {
        if (displayFnds && displayFnds.length) {
            let regions = [...new Map(displayFnds.map((fnd) => [fnd.region?.id.toString(), fnd.region])).values()];
            let environments = [...new Map(displayFnds.map((fnd) => [fnd.environment?.id.toString(), fnd.environment])).values()]

            let cuisines = [];
            displayFnds.map((fnd) => {
                fnd.cuisines.map((cusine) => { cuisines.push(cusine) })
            })
            // setRegions([...new Map(displayFnds.map((fnd) => [fnd.region.id.toString(), fnd.region])).values()]);
            // setEnvironments([...new Map(displayFnds.map((fnd) => [fnd.environment.id.toString(), fnd.environment])).values()])
            // setCategories([...new Map(cuisines.map((fnd) => [fnd.name.toString(), fnd])).values()]);
            let cuisineSet = [...new Map(cuisines.map((fnd) => [fnd.name.toString(), fnd])).values()]
            if (selectedEnvironment) {
                setCategories(cuisineSet);
            }
            else if (selectedRegion) {
                setCategories(cuisineSet);
                setEnvironments(environments);
            }
            else if (selectedCountry) {
                setCategories(cuisineSet);
                setEnvironments(environments);
                setRegions(regions);
            } else {
                setCategories(cuisineSet);
                setEnvironments(environments);
                setRegions(regions);
            }
            // else if (selectedRegion) {

            // }


        }


    }
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
            filter?.tagGroup && setSelectedTagGroup(filter?.tagGroup)
            filter?.environment && setSelectedEnvironment(filter?.environment)
            filter?.category && setSelectedCategory(filter?.category)
            filter?.selectedTags && setSelectedTags(filter?.selectedTags || [])
        }
    }, [open, filter])



    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return (
        <Box id={"GuidedSearchAlbum"} w={"100%"} px={["0%", "10%"]} position={"relative"} >
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

            {totalFnds && totalFnds.length > 0 && <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
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
                <FilterHeader
                    isFirst={false}
                    bg={calcBg("region")}
                    color={calcTextColor("region")}
                    zIndex={open ? 63 : 13}
                    onClick={(e) => handleOpen(e, "region")}
                    displayText={open ?
                        (selectedRegion ? truncateText(selectedRegion.name) : "Region") :
                        (filter?.region ? truncateText(filter?.region.name) : "Region")
                    }
                />
                <FilterHeader
                    isFirst={false}
                    bg={calcBg("type")}
                    color={calcTextColor("type")}
                    zIndex={open ? 62 : 12}
                    onClick={(e) => handleOpen(e, "type")}
                    displayText={open ?
                        (selectedEnvironment ? truncateText(selectedEnvironment.name) : "Type") :
                        (filter?.environment ? truncateText(filter?.environment.name) : "Type")
                    }
                />
                {/* <FilterHeader
                    isFirst={false}
                    bg={calcBg("cuisines")}
                    color={calcTextColor("cuisines")}
                    zIndex={open ? 63 : 13}
                    onClick={(e) => handleOpen(e, "cuisines")}
                    displayText={open ?
                        (selectedCategory ? truncateText(selectedCategory.name) : "Cuisines") :
                        (filter?.category ? truncateText(filter?.category.name) : "Cuisines")
                    }
                /> */}
                {/* <FilterHeader
                    isFirst={false}
                    bg={calcBg("tag-group")}
                    color={calcTextColor("tag-group")}
                    zIndex={open ? 62 : 12}
                    onClick={(e) => handleOpen(e, "tag-group")}
                    displayText={open ?
                        (selectedTagGroup ? truncateText(selectedTagGroup.name) : "Theme") :
                        (filter?.tagGroup ? truncateText(filter?.tagGroup.name) : "Theme")
                    }
                /> */}
                <FilterHeader
                    isFirst={false}
                    bg={calcBg("cuisines")}
                    color={calcTextColor("cuisines")}
                    zIndex={open ? 61 : 11}
                    onClick={(e) => handleOpen(e, "cuisines")}
                    displayText={
                        open
                            ? selectedCategory?.length > 0
                                ? truncateText(`${selectedCategory.length} Interests`)
                                : "Interests"
                            : filter?.selectedCategory?.length > 0
                                ? truncateText(`${filter.selectedCategory.length} Interests`)
                                : "Interests"
                    }
                />
            </Flex>}
            <Flex id={"GuidedSearchBody"} flexDirection={"column"} display={open ? "flex" : "none"} maxH={["85vh", "43.96vw"]} h={["auto", "43.96vw"]} mt={["-9.167vw", "-3.472vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} py={["7.77vw", "2.64vw"]} w={["100%", "80%"]} mx={[0, "10%"]} bg={"white"} zIndex={60} position={"absolute"} left={0} justifyContent={"space-between"}>

                {/* {loading && <LoadingGif />} */}
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
                        setSelectedRegion(null)
                        setSelectedEnvironment(null)
                        setSelectedCategory([])

                    }}
                    values={countries}
                    onSelectValue={(country) => {
                        if (selectedCountry?.id == country?.id) {
                            setSelectedCountry(null)
                        }
                        else {
                            setSelectedCountry(country);
                            setCurrentTab("region");
                        }
                        setSelectedRegion(null)
                        setSelectedEnvironment(null);
                        setSelectedCategory([])

                    }}
                    emptyState={"No Countries"}
                />}
                {currentTab == "region" && <FilterDisplay
                    type={1}
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
                        setSelectedEnvironment(null)
                        setSelectedCategory([])

                    }}
                    values={regions}
                    onSelectValue={(region) => {
                        if (selectedRegion?.id == region?.id) {
                            setSelectedRegion(null)
                        }
                        else {
                            setSelectedRegion(region);
                            setCurrentTab('type');
                        }
                        setSelectedEnvironment(null);
                        setSelectedCategory([])

                    }}
                    emptyState={"No Regions"}
                />}

                {currentTab == "type" && <FilterDisplay
                    type={2}
                    animation={currentTab == "type"}
                    headerText={"SELECT TYPE"}
                    selectedValue={selectedEnvironment}
                    onSelectAll={() => {
                        if (selectedEnvironment?.id == -1) {
                            setSelectedEnvironment(null);
                        }
                        else {
                            setSelectedEnvironment({ id: -1, name: "All Types" });
                        }
                        setSelectedCategory([])

                    }}
                    values={environments}
                    onSelectValue={(environment) => {
                        if (selectedEnvironment?.id == environment?.id) {
                            setSelectedEnvironment(null)
                        }
                        else {
                            setSelectedEnvironment(environment);
                            setCurrentTab('cuisines')
                        }
                        setSelectedCategory([])

                    }}
                    emptyState={"No Environments" + (selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                />}


                {currentTab == "cuisines" && <FilterDisplay
                    type={3}
                    animation={currentTab === "cuisines"}
                    headerText={"SELECT Interests"}
                    selectedValue={selectedCategory}
                    onSelectAll={() => {
                        if (categories?.length == selectedCategory?.length) {
                            setSelectedCategory([]);
                        }
                        else {
                            setSelectedCategory(categories)
                        }
                    }}
                    values={categories}
                    onSelectValue={(category) => toggleTagSelection(category)}
                    emptyState={"No Interests" + (selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                />}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={() => handleReset(false)}>Reset</Button>
                        {currentTab == "cuisines" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>}
                        {currentTab !== "cuisines" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchShopping