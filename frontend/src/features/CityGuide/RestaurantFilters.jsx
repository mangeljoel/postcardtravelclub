import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import { fetchPaginatedResults } from '../../queries/strapiQueries'
import FilterDisplay from '../GuidedSearch/FilterDisplay'
import FilterHeader from '../GuidedSearch/FilterHeader'
import { apiNames, populateAlbumData } from '../../services/fetchApIDataSchema'

const RestaurantFilters = ({ filter, setFilter, callBeforeApply, locationData, locationType }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const [totalFnds, setTotalFnds] = useState([]);
    const [displayFnds, setDisplayFnds] = useState([]);

    const [environments, setEnvironments] = useState([])
    const [selectedEnvironment, setSelectedEnvironment] = useState(null)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])

    const isMobile = useBreakpointValue({ base: true, md: false });


    const baseFilter = {
        isActive: true,

        directories: { slug: { $in: ["food-and-beverages"] } }
    };

    // ✅ Add location constraint

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
                    (tabName === 'type' && selectedEnvironment) ||
                    (tabName === 'cuisines' && selectedCategory.length > 0)
                )
                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'type' && filter?.environment) ||
                    (tabName === 'cuisines' && filter?.selectedCategory?.length > 0)
                )
                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedEnvironment, selectedCategory, filter])

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
        if (currentTab === 'type') setCurrentTab('cuisines');
        else setCurrentTab('cuisines');
    };

    const handleApply = () => {
        if (callBeforeApply) callBeforeApply();
        setFilter({
            ...filter,
            environment: selectedEnvironment,
            selectedCategory,
            selectedTags: selectedCategory
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ ...filter, environment: null, selectedCategory: [], selectedTags: [], selectedCuisine: [] })
        setSelectedEnvironment(null);
        setSelectedCategory([]);
        setOpen(false);
    };

    const centerElementInView = () => {
        const element = document.getElementById("RestaurantFilters");
        const modalBody = document.getElementById("RestaurantFiltersBody");

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
        if (locationData && locationType === 'country') {
            baseFilter.country = locationData?.country?.id;
        } else if (locationData && locationType === 'region') {
            baseFilter.region = locationData?.id;
        }
        fetchInitialData(baseFilter);
    }, [])

    const fetchInitialData = async (filterForAPI) => {
        // console.log()
        const apiFilter = { ...filterForAPI };
        if (apiFilter.country?.id) {
            apiFilter.country = apiFilter.country.id;
        }
        if (apiFilter.region?.id) {
            apiFilter.region = apiFilter.region.id;
        }

        const totalFnds = await fetchPaginatedResults(
            apiNames.album,
            apiFilter,
            populateAlbumData
        );
        setTotalFnds(Array.isArray(totalFnds) ? totalFnds : [totalFnds]);
        setDisplayFnds(Array.isArray(totalFnds) ? totalFnds : [totalFnds]);
    }

    useEffect(() => {

        if (locationData && locationType === 'country') {
            baseFilter.country = locationData?.country?.id;
        } else if (locationData && locationType === 'region') {
            baseFilter.region =
                locationData?.id;
        }
        let filterForAPI = baseFilter;
        if (selectedEnvironment?.id && selectedEnvironment?.id != -1) {
            filterForAPI = { ...filterForAPI, environment: selectedEnvironment.id };
        }
        fetchInitialData(filterForAPI);
    }, [selectedEnvironment])

    useEffect(() => {
        calculateFilters();
    }, [displayFnds])

    const calculateFilters = () => {
        if (displayFnds && displayFnds.length) {
            let environments = [...new Map(displayFnds.map((fnd) => [fnd.environment?.id.toString(), fnd.environment])).values()]

            let cuisines = [];
            displayFnds.map((fnd) => {
                if (fnd.cuisines && Array.isArray(fnd.cuisines)) {
                    fnd.cuisines.map((cuisine) => { cuisines.push(cuisine) })
                }
            })

            let cuisineSet = [...new Map(cuisines.map((fnd) => [fnd.name.toString(), fnd])).values()]

            if (selectedEnvironment) {
                setCategories(cuisineSet);
            } else {
                setCategories(cuisineSet);
                setEnvironments(environments);
            }
        }
    }

    useEffect(() => {
        if (open) {
            centerElementInView();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);


    useEffect(() => {
        if (open) {
            filter?.environment && setSelectedEnvironment(filter?.environment)
            filter?.selectedCategory && setSelectedCategory(filter?.selectedCategory || [])
        }
    }, [open, filter])

    const truncateText = (text, maxLength = isMobile ? 6 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return (
        <Box id={"RestaurantFilters"} w={"100%"} px={["0%", "20%"]} position={"relative"} >
            {/* Overlay */}
            {open && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    zIndex={59}
                    bg="rgba(0, 0, 0, 0.4)"
                    backdropFilter="blur(2px)"
                    onClick={() => handleReset(true)}
                ></Box>
            )}

            {totalFnds && totalFnds.length > 0 && <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
                <FilterHeader
                    isFirst={true}
                    bg={calcBg("type")}
                    color={calcTextColor("type")}
                    zIndex={open ? 65 : 15}
                    onClick={(e) => handleOpen(e, "type")}
                    displayText={open ?
                        (selectedEnvironment ? truncateText(selectedEnvironment.name) : "Type") :
                        (filter?.environment ? truncateText(filter?.environment.name) : "Type")
                    }
                />
                <FilterHeader
                    isFirst={false}
                    bg={calcBg("cuisines")}
                    color={calcTextColor("cuisines")}
                    zIndex={open ? 63 : 13}
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

            <Flex
                id={"RestaurantFiltersBody"}
                flexDirection={"column"}
                display={open ? "flex" : "none"}
                maxH={["85vh", "43.96vw"]}
                h={["auto", "43.96vw"]}
                mt={["-9.167vw", "-3.472vw"]}
                borderRadius={["4.5vw", "2.083vw"]}
                px={["8.33vw", "3.05vw"]}
                py={["7.77vw", "2.64vw"]}
                w={["100%", "80%"]}
                mx={[0, "10%"]}
                bg={"white"}
                zIndex={60}
                position={"absolute"}
                left={0}
                justifyContent={"space-between"}
            >

                {currentTab == "type" && <FilterDisplay
                    type={2}
                    animation={currentTab == "type"}
                    headerText={"SELECT RESTAURANT TYPE"}
                    selectedValue={selectedEnvironment}
                    onSelectAll={() => {
                        if (selectedEnvironment?.id == -1) {
                            setSelectedEnvironment(null);
                        }
                        else {
                            setSelectedEnvironment({ id: -1, name: "All Types" });
                        }
                        setSelectedCategory([]) // ✅ Clear categories when changing environment
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
                        setSelectedCategory([]) // ✅ Clear categories when changing environment
                    }}
                    emptyState={`No Restaurant Types in ${locationData?.name || 'this location'}`}
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
                    emptyState={`No Interests in ${locationData?.name || 'this location'}`}
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

export default RestaurantFilters