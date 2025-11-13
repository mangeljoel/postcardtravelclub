import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import { fetchPaginatedResults, getCountries } from '../../queries/strapiQueries'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'

const GuidedSearchAlbum = ({ getFilters, filterType, filter, setFilter, slug, aff, callBeforeApply, form = "default" }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)

    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

    const [tagGroups, setTagGroups] = useState([])
    const [selectedTagGroup, setSelectedTagGroup] = useState(null)

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const isMobile = useBreakpointValue({ base: true, md: false });

    // Determine which tabs to show based on filterType
    const shouldShowTab = (tabName) => {
        if (!filterType) return true;

        // Hide the tab that matches the filterType
        if (filterType === 'country' && tabName === 'country') return false;
        if (filterType === 'region' && tabName === 'region') return false;
        if (filterType === 'category' && tabName === 'category') return false;
        if (filterType === 'interest' && tabName === 'interest') return false;

        return true;
    };

    // Determine the first available tab
    const getFirstAvailableTab = () => {
        if (shouldShowTab('country')) return 'country';
        if (shouldShowTab('region')) return 'region';
        if (shouldShowTab('category')) return 'category';
        if (shouldShowTab('interest')) return 'interest';
        return null;
    };

    // Apply filter from URL on mount (when filterType exists)
    useEffect(() => {
        if (filter && filterType) {
            if (filterType === 'country' && filter.country) {
                setSelectedCountry(filter.country);
            }
            if (filterType === 'region' && filter.region) {
                setSelectedRegion(filter.region);
            }
            if (filterType === 'category' && filter.category) {
                setSelectedCategory(filter.category);
            }
            if (filterType === 'interest' && filter.interest) {
                setSelectedTags(filter.interest);
            }
        }
    }, [filter, filterType]);

    const handleOpen = (e, tabName) => {
        e.stopPropagation()
        setCurrentTab(tabName)
        if (!open) {
            setOpen(true);
        }
    }

    const calcBg = useMemo(() => {
        return (tabName) => {
            if (open) {
                if (currentTab === tabName) return '#EDB6A9'
                if (
                    (tabName === 'country' && selectedCountry) ||
                    (tabName === 'region' && selectedRegion) ||
                    (tabName === 'category' && selectedCategory) ||
                    (tabName === 'tag-group' && selectedTagGroup) ||
                    (tabName === 'interest' && selectedTags.length > 0)
                )
                    return 'white'
                return '#EB836E'
            }
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'region' && filter?.region) ||
                    (tabName === 'category' && filter?.category) ||
                    (tabName === 'tag-group' && filter?.tagGroup) ||
                    (tabName === 'interest' && filter?.selectedTags?.length > 0)
                )
                    return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedCountry, selectedRegion, selectedCategory, selectedTagGroup, selectedTags, filter])

    // Calculate text color based on background
    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const toggleTagSelection = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.some((t) => t.id === tag.id)
                ? prevTags.filter((t) => t.id !== tag.id)
                : [...prevTags, tag]
        );
    };

    const handleNextClick = () => {
        if (currentTab === 'country') {
            if (shouldShowTab('region')) setCurrentTab('region');
            else if (shouldShowTab('category')) setCurrentTab('category');
            else if (shouldShowTab('interest')) setCurrentTab('interest');
        }
        else if (currentTab === 'region') {
            if (shouldShowTab('category')) setCurrentTab('category');
            else if (shouldShowTab('interest')) setCurrentTab('interest');
        }
        else if (currentTab === 'category') {
            setCurrentTab('interest');
        }
    };

    const handleApply = (overrideTags = null) => {
        if (callBeforeApply) callBeforeApply();
        setFilter({
            country: selectedCountry,
            region: selectedRegion,
            tagGroup: selectedTagGroup,
            category: selectedCategory,
            selectedTags: overrideTags !== null ? overrideTags : selectedTags,
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        // Keep the filter from URL when resetting
        const keepFromUrl = filterType ? {
            country: filterType === 'country' ? filter?.country : null,
            region: filterType === 'region' ? filter?.region : null,
            category: filterType === 'category' ? filter?.category : null,
        } : {};

        if (!withoutFilter) {
            setFilter({
                country: keepFromUrl.country || null,
                region: keepFromUrl.region || null,
                category: keepFromUrl.category || null,
                tagGroup: null,
                selectedTags: []
            });
        }

        setSelectedCountry(keepFromUrl.country || null);
        setSelectedRegion(keepFromUrl.region || null);
        setSelectedCategory(keepFromUrl.category || null);
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
        if (open) {
            centerElementInView();
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    // Set internal states when modal opens
    useEffect(() => {
        if (open) {
            filter?.country && setSelectedCountry(filter?.country)
            filter?.region && setSelectedRegion(filter?.region)
            filter?.tagGroup && setSelectedTagGroup(filter?.tagGroup)
            filter?.category && setSelectedCategory(filter?.category)
            filter?.selectedTags && setSelectedTags(filter?.selectedTags || [])
        }
    }, [open, filter])

    useEffect(() => {
        const queryParts = []
        if (slug) {
            queryParts.push(`slug=${slug}`)
            queryParts.push(`forProfile=albums`)
        }
        if (selectedCountry && selectedCountry?.id !== -1) queryParts.push(`country=${selectedCountry?.id}`)
        if (selectedRegion && selectedRegion?.id !== -1) queryParts.push(`region=${selectedRegion?.id}`)
        if (selectedCategory && selectedCategory?.id !== -1) queryParts.push(`category=${selectedCategory?.id}`)
        if (aff) queryParts.push(`affiliation=${aff}`)
        if (selectedTagGroup && selectedTagGroup?.id !== -1) queryParts.push(`tagGroup=${selectedTagGroup?.id}`)

        strapi.request("post", `/albums/getFilters${queryParts?.length > 0 ? `?${queryParts.join('&')}` : ''}`, {
            body: {
                tags: selectedTags.map(tag => tag.id) || [],
            },
        }).then((response) => {
            if (selectedTagGroup) setTags(response?.tags || [])
            else if (selectedCategory) {
                setTagGroups(response?.tagGroup || [])
                setTags(response?.tags || [])
            }
            else if (selectedRegion) {
                setCategories(response?.category || [])
                setTagGroups(response?.tagGroup || [])
                setTags(response?.tags || [])
            }
            else if (selectedCountry) {
                setRegions(response?.region || [])
                setCategories(response?.category || [])
                setTagGroups(response?.tagGroup || [])
                setTags(response?.tags || [])
            }
            else {
                setCountries(response?.country || [])
                setRegions(response?.region || [])
                setCategories(response?.category || [])
                setTagGroups(response?.tagGroup || [])
                setTags(response?.tags || [])
            }
        })
    }, [selectedCountry, selectedRegion, selectedCategory, selectedTagGroup])

    const truncateText = (text, maxLength = isMobile ? 8 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    // Check if any filter is active for button display
    const hasActiveFilter = filter?.country || filter?.category || filter?.tagGroup || (filter?.selectedTags?.length > 0) || open;

    // Determine if we should show expanded filters (diary form or has active filters)
    const shouldShowExpandedFilters = form === "diary" || hasActiveFilter;

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
                    bg="rgba(0, 0, 0, 0.4)"
                    backdropFilter="blur(2px)"
                ></Box>
            )}

            <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
                {!shouldShowExpandedFilters ? (
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
                        onClick={(e) => handleOpen(e, getFirstAvailableTab())}
                    >
                        Try Postcard Guided Search
                    </Button>
                ) : (
                    <>
                        {shouldShowTab('country') && (
                            <FilterHeader
                                isFirst={true}
                                bg={calcBg("country")}
                                color={calcTextColor("country")}
                                zIndex={open ? 66 : 16}
                                onClick={(e) => handleOpen(e, "country")}
                                displayText={open ?
                                    (selectedCountry ? truncateText(selectedCountry.name) : "Country") :
                                    (filter?.country ? truncateText(filter?.country.name) : "Country")
                                }
                            />
                        )}
                        {shouldShowTab('region') && (
                            <FilterHeader
                                isFirst={!shouldShowTab('country')}
                                bg={calcBg("region")}
                                color={calcTextColor("region")}
                                zIndex={open ? 65 : 15}
                                onClick={(e) => handleOpen(e, "region")}
                                displayText={open ?
                                    (selectedRegion ? truncateText(selectedRegion.name) : "Region") :
                                    (filter?.region ? truncateText(filter?.region.name) : "Region")
                                }
                            />
                        )}
                        {shouldShowTab('category') && (
                            <FilterHeader
                                isFirst={!shouldShowTab('country') && !shouldShowTab('region')}
                                bg={calcBg("category")}
                                color={calcTextColor("category")}
                                zIndex={open ? 63 : 13}
                                onClick={(e) => handleOpen(e, "category")}
                                displayText={open ?
                                    (selectedCategory ? truncateText(selectedCategory.name) : "Type") :
                                    (filter?.category ? truncateText(filter?.category.name) : "Type")
                                }
                            />
                        )}
                        {shouldShowTab('interest') && (
                            <FilterHeader
                                isFirst={!shouldShowTab('country') && !shouldShowTab('region') && !shouldShowTab('category')}
                                bg={calcBg("interest")}
                                color={calcTextColor("interest")}
                                zIndex={open ? 61 : 11}
                                onClick={(e) => handleOpen(e, "interest")}
                                displayText={
                                    open
                                        ? selectedTags?.length > 0
                                            ? truncateText(`${selectedTags.length} Interests`)
                                            : "Interests"
                                        : filter?.selectedTags?.length > 0
                                            ? truncateText(`${filter.selectedTags.length} Interests`)
                                            : "Interests"
                                }
                            />
                        )}
                    </>
                )}
            </Flex>

            <Flex id={"GuidedSearchBody"} flexDirection={"column"} display={open ? "flex" : "none"} maxH={["85vh", "43.96vw"]} h={["auto", "43.96vw"]} mt={["-9.167vw", "-3.472vw"]} borderRadius={["4.5vw", "2.083vw"]} px={["8.33vw", "3.05vw"]} py={["7.77vw", "2.64vw"]} w={["100%", "80%"]} mx={[0, "10%"]} bg={"white"} zIndex={60} position={"absolute"} left={0} justifyContent={"space-between"}>

                {currentTab === "country" && shouldShowTab('country') && (
                    <FilterDisplay
                        type={1}
                        animation={currentTab === "country"}
                        headerText={"SELECT COUNTRY"}
                        selectedValue={selectedCountry}
                        onSelectAll={(e) => {
                            if (selectedCountry?.id === -1) {
                                setSelectedCountry(null)
                            }
                            else {
                                setSelectedCountry({ id: -1, name: "All Countries" });
                            }
                            setSelectedCategory(null)
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                            handleNextClick();
                        }}
                        values={countries}
                        onSelectValue={(country) => {
                            if (selectedCountry?.id === country?.id) {
                                setSelectedCountry(null)
                            }
                            else {
                                setSelectedCountry(country);
                                handleNextClick();
                            }
                            setSelectedRegion(null)
                            setSelectedCategory(null)
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                        }}
                        emptyState={"No Countries"}
                        isActive={(filter?.country || filter?.category || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                {currentTab === "region" && shouldShowTab('region') && (
                    <FilterDisplay
                        type={1}
                        animation={currentTab === "region"}
                        headerText={"SELECT REGION"}
                        selectedValue={selectedRegion}
                        onSelectAll={(e) => {
                            if (selectedRegion?.id === -1) {
                                setSelectedRegion(null)
                            }
                            else {
                                setSelectedRegion({ id: -1, name: "All Regions" });
                            }
                            setSelectedCategory(null)
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                            handleNextClick();
                        }}
                        values={regions}
                        onSelectValue={(region) => {
                            if (selectedRegion?.id === region?.id) {
                                setSelectedRegion(null)
                            }
                            else {
                                setSelectedRegion(region);
                                handleNextClick();
                            }
                            setSelectedCategory(null)
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                        }}
                        emptyState={"No Regions" + (selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                        isActive={(filter?.country || filter?.region || filter?.category || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                {currentTab === "category" && shouldShowTab('category') && (
                    <FilterDisplay
                        type={1}
                        animation={currentTab === "category"}
                        headerText={"SELECT TYPE"}
                        selectedValue={selectedCategory}
                        onSelectAll={() => {
                            if (selectedCategory?.id === -1) {
                                setSelectedCategory(null);
                            }
                            else {
                                setSelectedCategory({ id: -1, name: "All Types" });
                            }
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                            handleNextClick();
                        }}
                        values={categories}
                        onSelectValue={(category) => {
                            if (selectedCategory?.id === category?.id) {
                                setSelectedCategory(null)
                            }
                            else {
                                setSelectedCategory(category);
                                setCurrentTab('interest')
                            }
                            setSelectedTagGroup(null)
                            setSelectedTags([]);
                        }}
                        emptyState={"No Categories" + (selectedRegion ? ` in ${selectedRegion?.name}` : "") + (selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                        isActive={(filter?.country || filter?.category || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                {currentTab === "interest" && shouldShowTab('interest') && (
                    <FilterDisplay
                        type={3}
                        animation={currentTab === "interest"}
                        headerText={"SELECT INTERESTS"}
                        selectedValue={selectedTags}
                        onSelectAll={() => {
                            if (tags?.length === selectedTags?.length) {
                                const newSelection = [];
                                setSelectedTags(newSelection);
                                handleApply(newSelection);
                            } else {
                                const newSelection = tags;
                                setSelectedTags(newSelection);
                                handleApply(newSelection);
                            }
                        }}
                        values={tags}
                        onSelectValue={(tag) => toggleTagSelection(tag)}
                        emptyState={"No Interests" + (selectedTagGroup ? ` in ${selectedTagGroup?.name}` : selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                        isActive={(filter?.country || filter?.category || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={() => handleReset(false)}>Reset</Button>
                        {currentTab === "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={() => handleApply()}>Apply</Button>}
                        {currentTab !== "interest" && <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleNextClick}>Next</Button>}
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}

export default GuidedSearchAlbum