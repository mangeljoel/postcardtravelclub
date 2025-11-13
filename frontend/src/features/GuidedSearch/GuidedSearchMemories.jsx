import { Box, Button, Flex, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState, useContext } from 'react'
import { CloseIcon } from '../../styles/ChakraUI/icons'
import strapi from '../../queries/strapi'
import FilterDisplay from './FilterDisplay'
import FilterHeader from './FilterHeader'
import AppContext from '../AppContext'
import { MEMORY_FILTER_CONFIG, getFilterKeys, getNextFilter, isLastFilter } from '../../config/memoryFilterConfig'

const GuidedSearchMemories = ({ filter, setFilter, slug, form = "default" }) => {
    const [open, setOpen] = useState(false)
    const [currentTab, setCurrentTab] = useState('year')

    const { isActiveProfile } = useContext(AppContext)
    const isOwner = isActiveProfile({ slug })

    const [filterData, setFilterData] = useState({})
    const [selectedFilters, setSelectedFilters] = useState({})

    const isMobile = useBreakpointValue({ base: true, md: false })
    const filterKeys = getFilterKeys()

    const handleOpen = (e, tabName) => {
        e.stopPropagation()
        setCurrentTab(tabName)
        if (!open) {
            setOpen(true)
        }
    }

    const calcBg = useMemo(() => {
        return (tabName) => {
            if (open) {
                if (currentTab === tabName) return '#EDB6A9'
                if (selectedFilters[tabName] || filter?.[tabName]) return 'white'
                return '#EB836E'
            } else {
                if (filter?.[tabName]) return 'white'
                return '#EB836E'
            }
        }
    }, [open, currentTab, selectedFilters, filter])

    const calcTextColor = useMemo(() => {
        return (tabName) => {
            const bg = calcBg(tabName)
            return bg === 'white' ? 'primary_1' : 'white'
        }
    }, [calcBg])

    const handleNextClick = () => {
        const nextFilter = getNextFilter(currentTab)
        if (nextFilter) {
            setCurrentTab(nextFilter)
        }
    }

    const handleApply = (overrideFilters = null) => {
        const filtersToApply = overrideFilters || selectedFilters
        setFilter(filtersToApply)
        setOpen(false)
    }

    const handleReset = (withoutFilter = false) => {
        if (!withoutFilter) {
            const emptyFilters = {}
            filterKeys.forEach(key => {
                emptyFilters[key] = null
            })
            setFilter(emptyFilters)
        }
        setSelectedFilters({})
        setOpen(false)
    }

    const centerElementInView = () => {
        const element = document.getElementById("GuidedSearchMemories")
        const modalBody = document.getElementById("GuidedSearchMemoriesBody")

        if (element && modalBody) {
            const elementRect = element.getBoundingClientRect()
            const bodyRect = modalBody.getBoundingClientRect()
            const elementTop = elementRect.top + window.scrollY
            const windowHeight = window.innerHeight
            const bodyHeight = bodyRect.height

            const scrollPosition = elementTop - (windowHeight - bodyHeight) / 2
            window.scrollTo({ top: scrollPosition, behavior: "smooth" })
        }
    }

    useEffect(() => {
        if (open) {
            centerElementInView()
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [open])

    // Set selected filters when modal opens
    useEffect(() => {
        if (open) {
            const newSelected = {}
            filterKeys.forEach(key => {
                if (filter?.[key]) {
                    newSelected[key] = filter[key]
                }
            })
            setSelectedFilters(newSelected)
        }
    }, [open, filter])


    useEffect(() => {
        if (!slug) return

        const fetchFilters = async () => {
            const queryParts = [`slug=${slug}`, `isOwner=${isOwner}`]

            filterKeys.forEach(key => {
                const selected = selectedFilters[key]
                if (selected && selected.id !== -1) {
                    queryParts.push(`${key}=${selected.id}`)
                }
            })

            try {
                console.log('Fetching filters with privacy:', { slug, isOwner })

                const response = await strapi.request(
                    "get",
                    `/memories/getFilters?${queryParts.join('&')}`
                )
                setFilterData(response || {})
            } catch (error) {
                console.error('Error fetching memory filters:', error)
                // Set empty data for all filters
                const emptyData = {}
                filterKeys.forEach(key => {
                    emptyData[key] = []
                })
                setFilterData(emptyData)
            }
        }

        fetchFilters()
    }, [selectedFilters, slug, isOwner])

    const handleSelectValue = (filterKey, value) => {
        const currentSelected = selectedFilters[filterKey]
        let newSelected = { ...selectedFilters }

        if (currentSelected?.id === value?.id) {
            newSelected[filterKey] = null
        } else {
            newSelected[filterKey] = value

            const nextFilter = getNextFilter(filterKey)
            if (nextFilter) {
                setCurrentTab(nextFilter)
            }
        }

        const currentConfig = MEMORY_FILTER_CONFIG[filterKey]
        filterKeys.forEach(key => {
            const keyConfig = MEMORY_FILTER_CONFIG[key]
            if (keyConfig.order > currentConfig.order) {
                newSelected[key] = null
            }
        })

        setSelectedFilters(newSelected)
    }

    const handleSelectAll = (filterKey) => {
        const currentSelected = selectedFilters[filterKey]
        const filterConfig = MEMORY_FILTER_CONFIG[filterKey]
        let newSelected = { ...selectedFilters }

        if (currentSelected?.id === -1) {
            newSelected[filterKey] = null
        } else {
            newSelected[filterKey] = filterConfig.allOption
        }

        // Clear dependent filters
        const currentConfig = MEMORY_FILTER_CONFIG[filterKey]
        filterKeys.forEach(key => {
            const keyConfig = MEMORY_FILTER_CONFIG[key]
            if (keyConfig.order > currentConfig.order) {
                newSelected[key] = null
            }
        })

        setSelectedFilters(newSelected)

        if (isLastFilter(filterKey)) {
            handleApply(newSelected)
        } else {
            const nextFilter = getNextFilter(filterKey)
            if (nextFilter) {
                setCurrentTab(nextFilter)
            }
        }
    }

    const getDisplayText = (filterKey) => {
        const config = MEMORY_FILTER_CONFIG[filterKey]
        const selected = open ? selectedFilters[filterKey] : filter?.[filterKey]
        return selected?.name || config.label
    }

    const getEmptyStateText = (filterKey) => {
        const config = MEMORY_FILTER_CONFIG[filterKey]
        const baseText = config.emptyText

        if (config.contextualEmpty) {
            return baseText + config.contextualEmpty(selectedFilters)
        }
        return baseText
    }

    const truncateText = (text, maxLength = isMobile ? 8 : 10) =>
        text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text

    // Check if any filter is active for button display
    const hasActiveFilter = filter?.country || filter?.region || filter?.year || open;

    // Determine if we should show expanded filters (diary form or has active filters)
    const shouldShowExpandedFilters = form === "diary" || hasActiveFilter;

    return (
        // <div ref={ref} className="GuidedSearchMemories">
        <Box id={"GuidedSearchMemories"} w={"auto"} px={["0%", "20%"]} position={"relative"}>

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
                />
            )}

            {/* Dynamic Filter Headers - Generated from config */}
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
                        onClick={(e) => handleOpen(e, "year")}
                    >
                        Try Postcard Guided Search
                    </Button>
                ) : (
                    <>
                        {filterKeys.map((filterKey, index) => (
                            <FilterHeader
                                key={filterKey}
                                isFirst={index === 0}
                                bg={calcBg(filterKey)}
                                color={calcTextColor(filterKey)}
                                zIndex={open ? (65 - index) : (15 - index)}
                                onClick={(e) => handleOpen(e, filterKey)}
                                displayText={truncateText(getDisplayText(filterKey))}
                            />
                        ))}
                    </>)}
            </Flex>

            {/* Modal Body */}
            <Flex
                id={"GuidedSearchMemoriesBody"}
                flexDirection={"column"}
                display={open ? "flex" : "none"}
                maxH={["85vh", "43.96vw"]}
                h={["auto", "43.96vw"]}
                mt={["-9.167vw", "-3.472vw"]}
                borderRadius={["4.5vw", "2.083vw"]}
                px={["8.33vw", "3.05vw"]}
                py={["7.77vw", "2.64vw"]}
                w={["100%", "60%"]}
                mx={[0, "20%"]}
                bg={"white"}
                zIndex={60}
                position={"absolute"}
                left={0}
                justifyContent={"space-between"}
            >
                {/* Generic Filter Display */}
                {currentTab && MEMORY_FILTER_CONFIG[currentTab] && (
                    <FilterDisplay
                        type={1}
                        animation={true}
                        headerText={`SELECT ${MEMORY_FILTER_CONFIG[currentTab].label.toUpperCase()}`}
                        selectedValue={selectedFilters[currentTab]}
                        onSelectAll={() => handleSelectAll(currentTab)}
                        values={filterData[currentTab] || []}
                        onSelectValue={(value) => handleSelectValue(currentTab, value)}
                        emptyState={getEmptyStateText(currentTab)}
                        isActive={(filter?.country || filter?.region || filter?.year)}
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
                        {isLastFilter(currentTab) ? (
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
        </Box>

        // </div>
    )
}




export default GuidedSearchMemories