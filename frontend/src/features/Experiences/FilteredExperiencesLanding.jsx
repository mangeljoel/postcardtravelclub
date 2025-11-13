import { Box, Text, Flex, Button, useBreakpointValue, Spinner, useToast } from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef, useMemo } from "react";
import SearchResults from "./SearchResults";
import AppContext from "../AppContext";
import GuidedSearchPostcard from "../GuidedSearch/GuidedSearchPostcard";
import SelectedTagList from "./SelectedTagList";
import { FiShare2 } from "react-icons/fi";

const FilteredExperiencesLanding = ({ filterType, filterValue, filterId, initialFilter }) => {
    const { profile } = useContext(AppContext);
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({});
    const [appliedTag, setAppliedTag] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Use ref to prevent duplicate stats fetches
    const isFetchingStatsRef = useRef(false);
    const lastFetchedStatsParamsRef = useRef(null);

    // Initialize filter from props ONCE when initialFilter changes
    useEffect(() => {
        if (initialFilter) {
            console.log("Setting initial filter:", initialFilter);
            setFilter(initialFilter);
        }
    }, [initialFilter]); // Only depend on initialFilter

    // Fetch stats based on filterType and filterValue using getAllStats API
    useEffect(() => {
        const fetchStats = async () => {
            if (!filterType || (!filterValue && !filterId)) {
                setStats(null);
                return;
            }

            // Create a unique key for current params
            const currentStatsKey = JSON.stringify({ filterType, filterValue, filterId });

            // Skip if already fetching or params haven't changed
            if (isFetchingStatsRef.current || lastFetchedStatsParamsRef.current === currentStatsKey) {
                return;
            }

            isFetchingStatsRef.current = true;
            lastFetchedStatsParamsRef.current = currentStatsKey;
            setStatsLoading(true);

            try {
                const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats`;
                let statsType = '';
                let queryParam = '';

                // Map filterType to statsType
                switch (filterType) {
                    case 'countries':
                        statsType = 'country';
                        // Prefer ID over slug
                        queryParam = filterId ? `id=${filterId}` : `slug=${filterValue}`;
                        break;
                    case 'region':
                        statsType = 'region';
                        queryParam = filterId ? `id=${filterId}` : `slug=${filterValue}`;
                        break;
                    case 'theme':
                        statsType = 'theme';
                        queryParam = filterId ? `id=${filterId}` : `slug=${filterValue}`;
                        break;
                    case 'interests':
                        statsType = 'interest';
                        queryParam = filterId ? `id=${filterId}` : `name=${filterValue}`;
                        break;
                    default:
                        setStatsLoading(false);
                        isFetchingStatsRef.current = false;
                        return;
                }

                const endpoint = `${baseUrl}?statsType=${statsType}&${queryParam}`;
                console.log('Fetching stats from:', endpoint);

                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`Failed to fetch stats: ${response.statusText}`);
                }

                const responseData = await response.json();
                console.log('Stats response:', responseData);

                // Extract the first item from the data array
                if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
                    setStats(responseData.data[0]);
                } else {
                    setStats(null);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats(null);
            } finally {
                setStatsLoading(false);
                isFetchingStatsRef.current = false;
            }
        };

        fetchStats();
    }, [filterType, filterValue, filterId]);

    // Reset applied tag when filter changes
    useEffect(() => {
        setAppliedTag(null);
    }, [filter]);

    // Memoize display title to avoid recalculation
    const displayTitle = useMemo(() => {
        if (!filterValue) return "Experiences";

        let str = decodeURIComponent(filterValue);
        str = str.replace(/-/g, " ");
        str = str.replace(/_/g, ", ");
        str = str.replace(/\band\b/g, "&");
        str = str
            .split(" ")
            .map((word) => {
                if (!word) return "";
                if (word === "&" || word.length === 1) return word;

                if (word.endsWith(",")) {
                    const wordWithoutComma = word.slice(0, -1);
                    return wordWithoutComma.charAt(0).toUpperCase() + wordWithoutComma.slice(1).toLowerCase() + ",";
                }

                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");

        return str.replace(/\s+/g, " ").trim();
    }, [filterValue]);

    // Memoize subtitle to avoid recalculation
    const subtitle = useMemo(() => {
        switch (filterType) {
            case "countries":
                return `Discover curated experiences in ${displayTitle}`;
            case "theme":
                return `Explore ${displayTitle} experiences around the world`;
            case "interests":
                return `Find experiences focused on ${displayTitle}`;
            case "region":
                return `Explore experiences in ${displayTitle}`;
            default:
                return "Find curated experiences by boutique properties";
        }
    }, [filterType, displayTitle]);

    // Memoize stats display using the new API response format
    const statsDisplay = useMemo(() => {
        if (!stats || !stats.stats) return null;

        const statsConfig = {
            countries: [
                { label: 'Experiences', value: stats.stats.experiences || 0 },
                { label: 'Properties', value: stats.stats.properties || 0 },
                { label: 'Regions', value: stats.stats.regions || 0 }
            ],
            region: [
                { label: 'Experiences', value: stats.stats.experiences || 0 },
                { label: 'Properties', value: stats.stats.properties || 0 }
            ],
            theme: [
                { label: 'Experiences', value: stats.stats.experiences || 0 },
                { label: 'Properties', value: stats.stats.properties || 0 },
                { label: 'Countries', value: stats.stats.countries || 0 }
            ],
            interests: [
                { label: 'Experiences', value: stats.stats.experiences || 0 },
                { label: 'Properties', value: stats.stats.properties || 0 },
                { label: 'Countries', value: stats.stats.countries || 0 }
            ]
        };
        return statsConfig[filterType] || null;
    }, [stats, filterType]);

    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            }).catch((err) => {
                console.error('Error sharing:', err);
            });
        } else {
            navigator.clipboard.writeText(currentUrl)
                .then(() => {
                    toast({
                        title: 'URL Copied',
                        status: 'success',
                        isClosable: true,
                        position: 'top',
                        variant: "subtle"
                    });
                })
                .catch((err) => {
                    console.error('Error copying URL:', err);
                    toast({
                        title: 'Failed to copy URL',
                        status: 'error',
                        isClosable: true,
                        position: 'top',
                        variant: "subtle"
                    });
                });
        }
    };

    return (
        <Flex w={"100%"} flexDirection={"column"}>
            {/* Hero Section */}
            <Flex
                flexDirection={"column"}
                w={"98%"}
                mb={["10vw", "3vw"]}
                bgImage="url('/assets/landingbanner.jpeg')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                borderRadius={["4.167vw", "2.083vw"]}
                position="relative"
                color="white"
                justifyContent="center"
                textAlign="left"
                mx="auto"
                px={["8.33vw", "5.83vw"]}
            >
                <Flex
                    position="relative"
                    zIndex={2}
                    w="100%"
                    flexDirection="column"
                    py={["10vw", "5vw"]}
                    gap={["6vw", "3vw"]}
                >
                    {/* TITLE + SHARE BUTTON on same line */}
                    <Flex
                        justifyContent={["center", "left"]}
                        alignItems={["center", ""]}
                        flexDirection={["column", "row"]}
                        gap={["4vw", "1.5vw"]}
                        w="100%"
                    >
                        <Text
                            as="h1"
                            fontSize={["9.44vw", "5vw"]}
                            lineHeight={["10.55vw", "5.5vw"]}
                            fontFamily="lora"
                            fontStyle="italic"
                            color="white"
                            textAlign={["center", "left"]}
                        >
                            {displayTitle}
                        </Text>

                        <Button
                            variant="none"
                            fontSize={["3.33vw", "1.3vw"]}
                            borderRadius={["5.55vw", "2.64vw"]}
                            h={["8.33vw", "2.46vw"]}
                            px={["9.167vw", "1.9vw"]}
                            flex={true}
                            alignItems={"center"}
                            gap="3"
                            border="2px"
                            borderColor="white"
                            color="white"
                            fontFamily="raleway"
                            fontWeight={400}
                            _hover={{ bg: "white", color: "#111111" }}
                            onClick={handleShareClick}
                        >
                            <FiShare2 />
                            Share Directory
                        </Button>
                    </Flex>

                    {/* Stats section (below title + button) */}
                    {statsLoading ? (
                        <Flex alignItems="center" gap={2}>
                            <Spinner size="sm" color="white" />
                            <Text fontSize={["3.5vw", "1.2vw"]} color="#EFE9E4" fontFamily="raleway">
                                Loading stats...
                            </Text>
                        </Flex>
                    ) : statsDisplay ? (
                        <Flex gap={["6vw", "1.5vw"]} alignItems="center" flexWrap="wrap">
                            {statsDisplay.map((stat, index) => (
                                <Flex key={index} alignItems="baseline" gap={["2vw", "0.8vw"]}>
                                    <Text fontSize={["5vw", "2.5vw"]} fontWeight="600" color="white">
                                        {stat.value}
                                    </Text>
                                    <Text fontSize={["3.5vw", "1.3vw"]} color="#EFE9E4" fontFamily="raleway">
                                        {stat.label}
                                    </Text>
                                    {index < statsDisplay.length - 1 && (
                                        <Text fontSize={["4vw", "2vw"]} color="#EFE9E4" ml={["3vw", "1.5vw"]} opacity={0.7}>
                                            |
                                        </Text>
                                    )}
                                </Flex>
                            ))}
                        </Flex>
                    ) : null}
                </Flex>
            </Flex>

            {/* Main Content */}
            <Box
                pos="relative"
                w={"100%"}
                pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
                mx="auto"
            >
                {/* Guided Search */}
                <Box mb={6}>
                    <GuidedSearchPostcard
                        type={filterType}
                        filter={filter}
                        setFilter={setFilter}
                        callBeforeApply={() => { }}
                    />
                </Box>

                {/* Selected Tags Display */}
                {!initialFilter?.selectedTags?.length && (
                    <SelectedTagList
                        filter={filter}
                        appliedTag={appliedTag}
                        setAppliedTag={setAppliedTag}
                    />
                )}

                {/* Search Results */}
                <Box w="100%" mb="2em" mt={["1em", "2em"]}>
                    <SearchResults
                        searchFilter={filter}
                        type="experiences"
                        profile={profile}
                        loading={loading}
                        setLoading={setLoading}
                        appliedTag={appliedTag}
                    />
                </Box>
            </Box>
        </Flex>
    );
};

export default FilteredExperiencesLanding;