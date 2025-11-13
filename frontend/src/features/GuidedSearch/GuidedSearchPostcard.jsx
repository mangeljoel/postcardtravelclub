import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import axios from 'axios'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'

const GuidedSearchPostcard = ({ type, filter, setFilter, slug, aff, callBeforeApply, form = "default" }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)

    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [tagGroups, setTagGroups] = useState([])
    const [selectedTagGroup, setSelectedTagGroup] = useState(null)

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const isMobile = useBreakpointValue({ base: true, md: false });

    // Store initial filter from URL - this should never change
    const initialFilterRef = useRef(null);
    const isInitializedRef = useRef(false);

    // Initialize the initial filter reference once when filter is available
    useEffect(() => {
        if (filter && Object.keys(filter).length > 0 && !isInitializedRef.current) {
            initialFilterRef.current = { ...filter };
            isInitializedRef.current = true;

            // Set initial selected states
            if (filter.country) setSelectedCountry(filter.country);
            if (filter.region) setSelectedRegion(filter.region);
            if (filter.tagGroup) setSelectedTagGroup(filter.tagGroup);
            if (filter.selectedTags) setSelectedTags(filter.selectedTags);
        }
    }, [filter]);

    // Determine which tabs to show based on type
    const shouldShowTab = (tabName) => {
        if (!type) return true;
        // Hide the tab that matches the type
        if ((type === 'country' || type === 'countries' || type == 'region') && tabName === 'country') return false;
        if (type === 'region' && tabName === 'region') return false;
        if ((type === 'theme' || type === 'tag-group') && tabName === 'tag-group') return false;
        if ((type === 'interest' || type === 'interests') && (tabName === 'interest' || tabName == "tag-group")) return false;

        return true;
    };

    // Determine the first available tab
    const getFirstAvailableTab = () => {
        if (shouldShowTab('country')) return 'country';
        if (shouldShowTab('region')) return 'region';
        if (shouldShowTab('tag-group')) return 'tag-group';
        if (shouldShowTab('interest')) return 'interest';
        return null;
    };

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
                    (tabName === 'tag-group' && selectedTagGroup) ||
                    (tabName === 'interest' && selectedTags.length > 0)
                )
                    return 'white'
                return '#EB836E'

            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'region' && filter?.region) ||
                    (tabName === 'tag-group' && filter?.tagGroup) ||
                    (tabName === 'interest' && filter?.selectedTags?.length > 0)
                )
                    return 'white'
                return '#EB836E'

            }
        }
    }, [open, currentTab, selectedCountry, selectedRegion, selectedTagGroup, selectedTags, filter])

    const truncateText = (text, maxLength = isMobile ? 8 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

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
            else if (shouldShowTab('tag-group')) setCurrentTab('tag-group');
            else if (shouldShowTab('interest')) setCurrentTab('interest');
        }
        else if (currentTab === 'region') {
            if (shouldShowTab('tag-group')) setCurrentTab('tag-group');
            else if (shouldShowTab('interest')) setCurrentTab('interest');
        }
        else if (currentTab === 'tag-group') {
            setCurrentTab('interest');
        }
    };

    const handleApply = (overrideTags = null) => {
        if (callBeforeApply) callBeforeApply()

        // Build filter with current selections, preserving initial filter base
        const appliedFilter = {
            ...(initialFilterRef.current || {}),
        };

        // Only add non-initial filters if they differ from initial
        if (shouldShowTab('country')) {
            appliedFilter.country = selectedCountry;
        }
        if (shouldShowTab('region')) {
            appliedFilter.region = selectedRegion;
        }
        if (shouldShowTab('tag-group')) {
            appliedFilter.tagGroup = selectedTagGroup;
        }
        if (shouldShowTab('interest')) {
            appliedFilter.selectedTags = overrideTags !== null ? overrideTags : selectedTags;
        }

        setFilter(appliedFilter);
        setOpen(false);
    };

    const handleReset = (closeWithoutApply = false) => {
        // Get the initial filter from URL
        const initialFilter = initialFilterRef.current || {};


        // If it's the Reset button (not close icon), update the filter to initial state
        if (!closeWithoutApply) {
            setFilter({ ...initialFilter });
        }

        // Always reset the internal state to initial values
        setSelectedCountry(initialFilter.country || null);
        setSelectedRegion(initialFilter.region || null);
        setSelectedTagGroup(initialFilter.tagGroup || null);
        setSelectedTags(initialFilter.selectedTags || []);
        setOpen(false);
    };

    const centerElementInView = () => {
        const element = document.getElementById("GuidedSearchPostcard");
        const modalBody = document.getElementById("GuidedSearchBody");

        if (element && modalBody) {
            const elementRect = element.getBoundingClientRect();
            const bodyRect = modalBody.getBoundingClientRect();
            const elementTop = elementRect.top + window.scrollY;
            const windowHeight = window.innerHeight;
            const bodyHeight = bodyRect.height;

            const scrollPosition = elementTop - (windowHeight - bodyHeight) / 2;
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
            setSelectedCountry(filter?.country || null);
            setSelectedRegion(filter?.region || null);
            setSelectedTagGroup(filter?.tagGroup || null);
            setSelectedTags(filter?.selectedTags || []);
        }
    }, [open, filter])

    // Add this helper function to determine if current tab is the last one
    const isLastTab = () => {
        if (currentTab === 'interest' && shouldShowTab('interest')) return true;
        if (currentTab === 'tag-group' && !shouldShowTab('interest')) return true;
        if (currentTab === 'region' && !shouldShowTab('tag-group') && !shouldShowTab('interest')) return true;
        if (currentTab === 'country' && !shouldShowTab('region') && !shouldShowTab('tag-group') && !shouldShowTab('interest')) return true;
        return false;
    };

    useEffect(() => {
        const queryParts = []

        // Get initial filter constraints
        const initialCountry = initialFilterRef.current?.country;
        const initialRegion = initialFilterRef.current?.region;
        const initialTagGroup = initialFilterRef.current?.tagGroup;
        const initialTags = initialFilterRef.current?.selectedTags || [];

        let filterCountry, filterRegion, filterTagGroup, filterTags;

        if (open) {
            // Modal is open - determine what filters to send based on current tab
            // For the CURRENT tab being viewed, don't send its selection to allow all options to show
            // For tabs AFTER current tab, use initial filter values to constrain them
            // For tabs BEFORE current tab, use current selections to constrain subsequent tabs

            if (currentTab === 'country') {
                // Viewing countries - don't filter by country, but use initial filters for other tabs
                filterCountry = null;
                filterRegion = shouldShowTab('region') ? null : initialRegion;
                filterTagGroup = shouldShowTab('tag-group') ? null : initialTagGroup;
                filterTags = shouldShowTab('interest') ? [] : initialTags;
            } else if (currentTab === 'region') {
                // Viewing regions - use selected country to filter, don't filter by region
                filterCountry = shouldShowTab('country') ? selectedCountry : initialCountry;
                filterRegion = null;
                filterTagGroup = shouldShowTab('tag-group') ? null : initialTagGroup;
                filterTags = shouldShowTab('interest') ? [] : initialTags;
            } else if (currentTab === 'tag-group') {
                // Viewing tag groups - use previous selections to filter
                filterCountry = shouldShowTab('country') ? selectedCountry : initialCountry;
                filterRegion = shouldShowTab('region') ? selectedRegion : initialRegion;
                filterTagGroup = null;
                filterTags = shouldShowTab('interest') ? [] : initialTags;
            } else if (currentTab === 'interest') {
                // Viewing interests - use all previous selections to filter
                filterCountry = shouldShowTab('country') ? selectedCountry : initialCountry;
                filterRegion = shouldShowTab('region') ? selectedRegion : initialRegion;
                filterTagGroup = shouldShowTab('tag-group') ? selectedTagGroup : initialTagGroup;
                filterTags = [];
            }
        } else {
            // Modal is closed - constrain by initial interest if present to get relevant countries/regions
            // Use filter state or initial filter state for tags
            filterCountry = null;
            filterRegion = null;
            filterTagGroup = null;
            filterTags = (filter?.selectedTags && filter.selectedTags.length > 0)
                ? filter.selectedTags
                : (initialTags && initialTags.length > 0)
                    ? initialTags
                    : [];
        }

        // Build query parts for URL params - only for constraining, not for showing selections
        if (filterCountry && filterCountry?.id && filterCountry?.id !== -1) {
            queryParts.push(`country=${filterCountry.id}`)
        }
        if (filterRegion && filterRegion?.id && filterRegion?.id !== -1) {
            queryParts.push(`region=${filterRegion.id}`)
        }
        if (filterTagGroup && filterTagGroup?.id && filterTagGroup?.id !== -1) {
            queryParts.push(`tagGroup=${filterTagGroup.id}`)
        }
        if (aff) queryParts.push(`affiliation=${aff}`)
        if (slug) {
            queryParts.push(`slug=${slug}`)
            queryParts.push(`forProfile=postcards`)
        }

        // Build the tags array for the request body
        // Extract tag IDs, handling both direct tags and tags from filterTagGroup
        let tagsForBody = [];

        if (filterTags && filterTags.length > 0) {
            tagsForBody = filterTags.map(tag => tag.id).filter(Boolean);
        } else if (filterTagGroup && filterTagGroup.tags && filterTagGroup.tags.length > 0) {
            // If we have a tag group with tags, use those tags
            tagsForBody = filterTagGroup.tags.map(tag => tag.id).filter(Boolean);
        }

        // ALWAYS fetch filters
        axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getFilters${queryParts?.length > 0 ? `?${queryParts.join('&')}` : ''}`,
            {
                tags: tagsForBody,
            }
        ).then((response) => {

            if (response.data?.country) setCountries(response.data.country);
            if (response.data?.region) setRegions(response.data.region);
            if (response.data?.tagGroup) setTagGroups(response.data.tagGroup);
            if (response.data?.tags) setTags(response.data.tags);
        }).catch(error => {
            console.error("Error fetching filters:", error);
        })
    }, [selectedCountry, selectedRegion, selectedTagGroup, selectedTags, currentTab, aff, slug, open, type, filter])

    // Check if any filter is active for button display
    const hasActiveFilter = filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0) || open;

    // Determine if we should show expanded filters (diary form or has active filters)
    const shouldShowExpandedFilters = form === "diary" || hasActiveFilter;

    return (
        <Box id={"GuidedSearchPostcard"} w={"100%"} px={["0%", "10%"]} position={"relative"} >
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
                        {shouldShowTab('tag-group') && (
                            <FilterHeader
                                isFirst={!shouldShowTab('country') && !shouldShowTab('region')}
                                bg={calcBg("tag-group")}
                                color={calcTextColor("tag-group")}
                                zIndex={open ? 62 : 12}
                                onClick={(e) => handleOpen(e, "tag-group")}
                                displayText={open ?
                                    (selectedTagGroup ? truncateText(selectedTagGroup.name) : "Theme") :
                                    (filter?.tagGroup ? truncateText(filter?.tagGroup.name) : "Theme")
                                }
                            />
                        )}
                        {shouldShowTab('interest') && (
                            <FilterHeader
                                isFirst={!shouldShowTab('country') && !shouldShowTab('region') && !shouldShowTab('tag-group')}
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
                            setSelectedRegion(null)
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
                            setSelectedTagGroup(null)
                            setSelectedTags([])
                        }}
                        emptyState={"No Countries"}
                        isActive={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                {currentTab === "region" && shouldShowTab('region') && (
                    <FilterDisplay
                        type={1}
                        animation={currentTab === "region"}
                        headerText={"SELECT REGION"}
                        selectedValue={selectedRegion}
                        onSelectAll={() => {
                            if (selectedRegion?.id === -1) {
                                setSelectedRegion(null);
                            }
                            else {
                                setSelectedRegion({ id: -1, name: "All Regions" });
                            }
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
                            setSelectedTagGroup(null)
                            setSelectedTags([]);
                        }}
                        emptyState={"No Regions" + (selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                        isActive={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                {currentTab === "tag-group" && shouldShowTab('tag-group') && (
                    <FilterDisplay
                        type={2}
                        animation={currentTab === "tag-group"}
                        headerText={"SELECT THEME"}
                        selectedValue={selectedTagGroup}
                        onSelectAll={() => {
                            if (selectedTagGroup?.id === -1) {
                                setSelectedTagGroup(null);
                            }
                            else {
                                setSelectedTagGroup({ id: -1, name: "All Themes" });
                            }
                            setSelectedTags([])
                            handleNextClick();
                        }}
                        values={tagGroups}
                        onSelectValue={(tagGroup) => {
                            if (selectedTagGroup?.id === tagGroup?.id) {
                                setSelectedTagGroup(null)
                            }
                            else {
                                setSelectedTagGroup(tagGroup);
                                setCurrentTab('interest')
                            }
                            setSelectedTags([]);
                        }}
                        emptyState={"No Themes" + (selectedRegion ? ` in ${selectedRegion?.name}` : selectedCountry ? ` in ${selectedCountry?.name}` : "")}
                        isActive={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
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
                        emptyState={
                            "No Interests" +
                            (selectedTagGroup
                                ? ` in ${selectedTagGroup?.name}`
                                : selectedRegion
                                    ? ` in ${selectedRegion?.name}`
                                    : selectedCountry
                                        ? ` in ${selectedCountry?.name}`
                                        : "")
                        }
                        isActive={(filter?.country || filter?.region || filter?.tagGroup || (filter?.selectedTags?.length > 0))}
                    />
                )}

                <Flex justify={"space-between"}>
                    <Box w={["6.11vw", "2.36vw"]} h={["6.11vw", "2.36vw"]} onClick={() => handleReset(true)}>
                        <CloseIcon width={"100%"} height={"100%"} stroke={"#EA6146"} />
                    </Box>

                    <Flex gap={"1.46vw"}>
                        <Button
                            variant="none"
                            fontSize={["3.611vw", "1.46vw"]}
                            borderRadius={["7.22vw", "2.78vw"]}
                            px={["8.33vw", "4.34vw"]}
                            h={["8.33vw", "3.125vw"]}
                            bg={"white"}
                            color={"primary_1"}
                            border={"2px"}
                            fontFamily={"raleway"}
                            onClick={() => handleReset(false)}
                        >
                            Reset
                        </Button>

                        {isLastTab() ? (
                            <Button
                                variant="none"
                                fontSize={["3.611vw", "1.46vw"]}
                                borderRadius={["7.22vw", "2.78vw"]}
                                px={["8.33vw", "4.34vw"]}
                                h={["8.33vw", "3.125vw"]}
                                bg={"primary_1"}
                                color={"white"}
                                fontFamily={"raleway"}
                                onClick={() => handleApply()}
                            >
                                Apply
                            </Button>
                        ) : (
                            <Button
                                variant="none"
                                fontSize={["3.611vw", "1.46vw"]}
                                borderRadius={["7.22vw", "2.78vw"]}
                                px={["8.33vw", "4.34vw"]}
                                h={["8.33vw", "3.125vw"]}
                                bg={"primary_1"}
                                color={"white"}
                                fontFamily={"raleway"}
                                onClick={handleNextClick}
                            >
                                Next
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Flex>

        </Box >
    )
}

export default GuidedSearchPostcard