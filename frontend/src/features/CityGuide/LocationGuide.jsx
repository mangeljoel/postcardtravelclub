import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { fetchPaginatedResults } from '../../queries/strapiQueries';
import { Box, Text, Icon, Button, Tooltip } from '@chakra-ui/react';
import LoadingGif from '../../patterns/LoadingGif';
import { FaWhatsapp } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";
import LandingHeroSection from '../../patterns/LandingHeroSection';
import SearchResultCard from './SearchResultCard';
import RestaurantFilters from './RestaurantFilters';
import AppContext from '../AppContext';
import SelectedTagList from '../Experiences/SelectedTagList';

const LocationGuide = ({ locationData, locationType, initialAlbums = [] }) => {
    const { profile } = useContext(AppContext);

    // Data states
    const [albums, setAlbums] = useState(initialAlbums);
    const [filteredAlbums, setFilteredAlbums] = useState([]);

    // UI states
    const [loading, setLoading] = useState(!initialAlbums.length);
    const [searchLoading, setSearchLoading] = useState(false);
    const [shoppingLoading, setShoppingLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    //  initial filter functions
    const createRestaurantBaseFilter = () => ({
        isActive: true,
        directories: { slug: { $in: ["food-and-beverages"] } },
        ...(locationType === 'country' && { country: locationData }),
        ...(locationType === 'region' && { region: locationData })
    });

    const createShoppingBaseFilter = () => ({
        isActive: true,
        directories: { id: { $in: [8] } },
        ...(locationType === 'country' && { country: locationData }),
        ...(locationType === 'region' && { region: locationData })
    });

    const createEventsBaseFilter = () => ({
        isActive: true,
        directories: { id: { $in: [9] } },
        ...(locationType === 'country' && { country: locationData }),
        ...(locationType === 'region' && { region: locationData })
    });

    // ✅ Separate filter states for each tab
    const [restaurantFilter, setRestaurantFilter] = useState(createRestaurantBaseFilter());
    const [shoppingFilter, setShoppingFilter] = useState(createShoppingBaseFilter());
    const [eventFilter, setEventFilter] = useState(createEventsBaseFilter());
    const [appliedTag, setAppliedTag] = useState(null);
    const [appliedShoppingTag, setAppliedShoppingTag] = useState(null);

    const tabs = [
        { name: "Restaurants", icon: IoRestaurant }
    ];

    //  Reset applied tags when filters change
    useEffect(() => {
        setAppliedTag(null);
    }, [restaurantFilter]);

    useEffect(() => {
        setAppliedShoppingTag(null);
    }, [shoppingFilter]);

    // Reset filters when location changes
    useEffect(() => {

        setRestaurantFilter(createRestaurantBaseFilter());
        setShoppingFilter(createShoppingBaseFilter());
        setAppliedTag(null);
        setAppliedShoppingTag(null);
    }, [locationData, locationType]);

    // Fetch albums when component loads
    useEffect(() => {
        if (locationData && !initialAlbums.length) {
            fetchAlbumsForLocation();
        } else if (initialAlbums.length) {
            setAlbums(initialAlbums);
            setLoading(false);
        }
    }, [locationData, locationType, initialAlbums]);

    // Filter albums when tab changes
    useEffect(() => {
        filterAlbumsByTab();
    }, [selectedTab, albums]);

    // ✅ Handle tab switching - close any open filter modals

    const fetchAlbumsForLocation = async () => {
        setLoading(true);
        try {
            let filters = { isActive: true };

            if (locationType === 'country') {
                filters.country = locationData.id;
            } else if (locationType === 'region') {
                filters.region = locationData.id;
            }

            // console.log('🔍 Fetching albums with filters:', filters);

            const albumsResponse = await fetchPaginatedResults(
                'albums',
                filters,
                {
                    gallery: true,
                    country: true,
                    region: true,
                    user: true,
                    coverImage: true,
                    directories: true,
                    tags: true
                },
                ['createdAt:desc']
            );

            const albumsArray = Array.isArray(albumsResponse) ? albumsResponse : (albumsResponse ? [albumsResponse] : []);

            // console.log('🏢 DIRECTORY DEBUG:');
            // console.log('Total albums fetched:', albumsArray.length);

            const allDirectories = albumsArray.flatMap(album => album.directories || []);

            // console.log('📂 Available directories:');
            // uniqueDirectories.forEach(dir => {
            //     console.log(`  - ID: ${dir.id}, Name: ${dir.name || dir.slug || 'No name'}`);
            // });

            setAlbums(albumsArray);
        } catch (error) {
            console.error('Error fetching albums:', error);
            setAlbums([]);
        } finally {
            setLoading(false);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const filterAlbumsByTab = () => {
        if (!albums.length) {
            // console.log('❌ No albums to filter');
            setFilteredAlbums([]);
            return;
        }

        const selectedTabName = tabs[selectedTab]?.name.toLowerCase();
        // console.log('🔍 Filtering for tab:', selectedTabName);
        // console.log('📚 Total albums before filtering:', albums.length);

        let directoryIds = [];
        switch (selectedTabName) {
            case 'shopping':
                directoryIds = [8];
                break;
            case 'restaurants':
                directoryIds = [6];
                break;
            case 'events':
                directoryIds = [9];
                break;
            default:
                directoryIds = [];
        }

        // console.log('🎯 Looking for directory IDs:', directoryIds);

        const filtered = albums.filter(album => {
            if (album.directories && Array.isArray(album.directories)) {
                return album.directories.some(directory => directoryIds.includes(directory.id));
            }
            return false;
        });

        // console.log(`✅ Filtered albums for ${selectedTabName}:`, filtered.length);
        setFilteredAlbums(filtered);
    };

    // WhatsApp community handler
    const handleWhatsAppClick = () => {
        const whatsappLink = "https://chat.whatsapp.com/Jh7IzpX1GqE7QxZb2aWmj4?mode=wwt";
        window.open(whatsappLink, '_blank');
    };
    const handleWhatsAppMobileClick = () => {
        if (!isOpen) {
            // First click: expand to show text
            setIsOpen(true);
        } else {
            handleWhatsAppClick();
            setIsOpen(false);
        }
    }

    if (loading) return <LoadingGif />;

    const isBengaluru = locationData?.name === "Bengaluru";

    return (
        <Box bg="#efe9e4" minH="100vh">
            {/* Hero Section with Gradient */}
            <Box

                pb={{ base: "8%", lg: "2%" }}
            >
                <LandingHeroSection
                    type="cityguide"
                    locationData={locationData}
                    locationType={locationType}
                    total={albums.length}
                />
            </Box>

            {/* Tabs Section */}
            <Box w="100%" position="relative">

                <Box
                    w={"100%"}
                    px={["5%", "10%"]}
                    mx="auto"

                >
                    <RestaurantFilters
                        filter={restaurantFilter}
                        setFilter={setRestaurantFilter}
                        callBeforeApply={() => { }}
                        locationData={locationData}
                        locationType={locationType}
                    />

                    <SelectedTagList filter={restaurantFilter} appliedTag={appliedTag} setAppliedTag={setAppliedTag} />
                    {restaurantFilter?.searchText && (
                        <Text
                            fontSize={["3vw", "1.46vw"]}
                            textAlign={"start"}
                            fontFamily={"lora"}
                            fontStyle={"italic"}
                            color={"#111111"}
                            mt={10}
                            mb={6}
                        >
                            Showing results for "<Text as={"span"} fontWeight={"600"}>{restaurantFilter.searchText}...</Text>"
                        </Text>
                    )}


                    <Box w="100%" mb="1em" mt={["0", "1em"]}>
                        <SearchResultCard
                            searchFilter={restaurantFilter}
                            type="restaurant"
                            profile={profile}
                            canEdit={profile && ["Admin", "SuperAdmin", "EditorInChief", "EditorialAdmin"].includes(profile?.user_type?.name)}
                            loading={searchLoading}
                            setLoading={setSearchLoading}
                            appliedTag={appliedTag}
                            useUniformGrid={true}
                            blocking={true}
                        />
                    </Box>



                    {isBengaluru && (
                        <Box
                            position="fixed"
                            right={["5px", "30px", "40px"]}
                            bottom={["5vw", "5vw", "3vw"]}

                        >
                            <Box display={{ base: "none", md: "block" }}>
                                <Tooltip
                                    label="Join Community"
                                    placement="left"
                                    hasArrow
                                    bg="gray.700"
                                    color="white"
                                    fontSize="sm"
                                    openDelay={200}
                                >
                                    <Button
                                        onClick={handleWhatsAppClick}
                                        bg="#25D366"
                                        color="white"
                                        borderRadius="full"
                                        boxShadow="0 8px 25px rgba(37, 211, 102, 0.4)"
                                        border="3px solid white"
                                        w="70px"
                                        h="70px"
                                        minW="unset"
                                        p={0}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _hover={{
                                            transform: "scale(1.1)",
                                            bg: "#20BA5A",
                                            boxShadow: "0 12px 35px rgba(37, 211, 102, 0.6)"
                                        }}
                                        _active={{
                                            transform: "scale(0.95)",
                                            bg: "#1DA851"
                                        }}
                                        transition="all 0.2s ease"
                                    >
                                        <Icon as={FaWhatsapp} w="28px" h="28px" />
                                    </Button>
                                </Tooltip>
                            </Box>

                            {/* Mobile version*/}
                            <Box display={{ base: "block", md: "none" }}>
                                {/* Toggle Button */}
                                {/* Small Toggle Icon */}
                                <Button

                                    onClick={handleWhatsAppMobileClick}
                                    bg="#25D366"
                                    color="white"
                                    borderRadius="full"
                                    h="50px"
                                    px={isOpen ? 4 : 0}
                                    w={isOpen ? "auto" : "50px"}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={isOpen ? 2 : 0}
                                    _hover={{
                                        bg: "#20BA5A",
                                        transform: "scale(1.05)"
                                    }}
                                    _focus={{ bg: "#20BA5A" }}
                                    _active={{ bg: "#20BA5A" }}
                                    transition="all 0.3s ease"
                                    boxShadow="0 4px 12px rgba(37, 211, 102, 0.4)"
                                >
                                    <Icon as={FaWhatsapp} w="22px" h="22px" />
                                    {isOpen && (
                                        <Box
                                            as="span"
                                            fontSize="sm"
                                            fontWeight="600"
                                            whiteSpace="nowrap"
                                        >
                                            Join Community
                                        </Box>
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    )}


                </Box>
            </Box>
        </Box>
    );
};

export default LocationGuide;