import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import strapi from '../../queries/strapi'
import { useCountries } from '../../hooks/useCountriesHook'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'

const FilterTravelogueExps = ({ type, filter, setFilter, cards }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState(false)
    const [allCards, setAllCards] = useState([])

    // const countries = useCountries(type || 'hotels', slug, aff)
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [regions, setRegions] = useState([])
    const [selectedRegion, setSelectedRegion] = useState(null)

    const [tagGroups, setTagGroups] = useState([])
    const [selectedTagGroup, setSelectedTagGroup] = useState(null)

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (cards?.length && allCards.length === 0) {
            setAllCards(cards)
        }
    }, [cards, allCards])

    useEffect(() => {
        const countryMap = new Map()
        const regionMap = new Map()
        const tagGroupMap = new Map()
        const tagMap = new Map()

        const isCountrySelected = selectedCountry && selectedCountry.id !== -1
        const isRegionSelected = selectedRegion && selectedRegion.id !== -1
        const isTagGroupSelected = selectedTagGroup && selectedTagGroup.id !== -1

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

            // Tag group filter: must match selectedCountry and selectedRegion (if any)
            if (
                card?.tag_group?.id &&
                (!isCountrySelected || card.country?.id === selectedCountry.id) &&
                (!isRegionSelected || card.region?.id === selectedRegion.id)
            ) {
                tagGroupMap.set(card.tag_group.id, card.tag_group)
            }

            // Tag filter: must match selectedCountry, selectedRegion, and selectedTagGroup (if any)
            if (
                card?.tags?.length > 0 &&
                (!isCountrySelected || card.country?.id === selectedCountry.id) &&
                (!isRegionSelected || card.region?.id === selectedRegion.id) &&
                (!isTagGroupSelected || card.tag_group?.id === selectedTagGroup.id)
            ) {
                card.tags.forEach((tag) => {
                    tagMap.set(tag.id, tag)
                })
            }
        })

        setCountries(Array.from(countryMap.values()))
        setRegions(Array.from(regionMap.values()))
        setTagGroups(Array.from(tagGroupMap.values()))
        setTags(Array.from(tagMap.values()))
    }, [allCards, selectedCountry, selectedRegion, selectedTagGroup])

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
                    (tabName === 'tagGroup' && selectedTagGroup) ||
                    (tabName === 'interest' && selectedTags?.length > 0)
                )
                    return 'white'
                return '#EB836E'
            }
            // If modal is closed, use filter state
            else {
                if (
                    (tabName === 'country' && filter?.country) ||
                    (tabName === 'region' && filter?.region) ||
                    (tabName === 'tagGroup' && filter?.tagGroup) ||
                    (tabName === 'interest' && filter?.selectedTags?.length > 0)
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
            prevTags.some((t) => t.id === tag.id)
                ? prevTags.filter((t) => t.id !== tag.id)
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
            country: selectedCountry,
            region: selectedRegion,
            tagGroup: selectedTagGroup,
            selectedTags: selectedTags?.length > 0 ? selectedTags : [],
        });
        setOpen(false);
    };

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) setFilter({ country: null, region: null, tagGroup: null, selectedTags: null });
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
    useEffect(() => {
        if (open) {
            filter?.country && setSelectedCountry(filter?.country)
            filter?.region && setSelectedRegion(filter?.region)
            filter?.tagGroup && setSelectedTagGroup(filter?.tagGroup)
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

    // const filteredRegions = useMemo(() => {
    //     return regions?.filter((region) =>
    //         selectedCountry?.id ? region?.country?.id === selectedCountry?.id : true
    //     );
    // }, [regions, selectedCountry]);

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
                {tagGroups?.length > 0 && <FilterHeader
                    isFirst={false}
                    bg={calcBg("tagGroup")}
                    color={calcTextColor("tagGroup")}
                    zIndex={open ? 63 : 13}
                    onClick={(e) => handleOpen(e, "tagGroup")}
                    displayText={open ?
                        (selectedTagGroup ? truncateText(selectedTagGroup.name) : "Theme") :
                        (filter?.tagGroup ? truncateText(filter?.tagGroup.name) : "Theme")
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
                        setSelectedTagGroup(null)
                        setSelectedTags([])
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
                            // setCurrentTab("tagGroup");
                        }
                        setSelectedTagGroup(null)
                        setSelectedTags([])
                    }}
                    emptyState={"No Regions"}
                />}

                {currentTab == "tagGroup" && tagGroups?.length > 0 && <FilterDisplay
                    type={3}
                    animation={currentTab == "tagGroup"}
                    headerText={"SELECT THEME"}
                    selectedValue={selectedTagGroup}
                    onSelectAll={(e) => {
                        if (selectedTagGroup?.id == -1) {
                            setSelectedTagGroup(null)
                        }
                        else {
                            setSelectedTagGroup({ id: -1, name: "All Themes" });
                        }
                    }}
                    values={tagGroups}
                    onSelectValue={(tagGroup) => {
                        if (selectedTagGroup?.id == tagGroup?.id) {
                            setSelectedTagGroup(null)
                        }
                        else {
                            setSelectedTagGroup(tagGroup);
                            // setCurrentTab("interest");
                        }
                        setSelectedTags([])
                    }}
                    emptyState={"No Themes"}
                />}

                {currentTab == "interest" && tags?.length > 0 && <FilterDisplay
                    type={3}
                    animation={currentTab == "interest"}
                    headerText={"SELECT INTERESTS"}
                    selectedValue={selectedTags}
                    onSelectAll={(e) => {
                        if (tags?.length == selectedTags?.length) {
                            setSelectedTags([])
                        }
                        else {
                            setSelectedTags(tags)
                        }
                    }}
                    values={tags}
                    onSelectValue={(tag) => toggleTagSelection(tag)}
                    emptyState={"No Interests"}
                />}

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

export default FilterTravelogueExps