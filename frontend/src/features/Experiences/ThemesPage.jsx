// src/features/ThemesPage.js
import { Box, Flex, Text, Button, useBreakpointValue, useToast, Grid, Tooltip } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../AppContext';
import CountryFilter from '../TagResultPage/CountryFilter';
import { useRouter } from 'next/navigation';
import HeroBanner from './HeroBanner';
import CustomCard from '../HomePage2/CustomCard';
import { createDBEntry } from '../../queries/strapiQueries';

const convertToSlug = (name) => {
    if (!name) return "";
    return name
        .toLowerCase()
        .replace(/,\s*/g, "_")
        .replace(/&/g, "and")
        .replace(/[\/|+(){}\[\]:;'"!?<>.*]/g, " ")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .trim();
};

const ThemesPage = () => {
    const { profile } = useContext(AppContext);
    const [filter, setFilter] = useState({});
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchThemes = async () => {
            setLoading(true);
            try {
                let endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=theme`;

                // Add country filter if selected (and not "All Countries")
                if (filter?.country && filter?.country?.id !== -1) {
                    endpoint += `&id=${filter.country.id}`;
                }

                const response = await axios.get(endpoint);

                if (response.data?.data) {
                    console.log('Themes data:', response.data.data);
                    setThemes(response.data.data);
                } else {
                    setThemes([]);
                }
            } catch (error) {
                console.error('Error fetching themes:', error);
                setThemes([]);
                toast({
                    title: 'Error fetching themes',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, [filter, toast]);

    return (
        <Flex w="100%" flexDirection="column">
            <HeroBanner
                title={"Postcard Themes"}
                subtitle={"Explore curated experiences organized by themes that inspire your travels."}
            />
            <Box
                pos="relative"
                w="100%"
                pl={{ base: '5%', lg: '10%' }}
                pr={{ base: '5%', lg: '10%' }}
                mx="auto"
                textAlign="center"
            >
                {/* <CountryFilter filter={filter} setFilter={setFilter} type={"themes"} /> */}
                <Box w="100%" mb="1em" mt={{ base: '3em', md: '1em' }}>
                    {loading ? (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            minH="200px"
                            mt={["4vw", "2.98vw"]}
                        >
                            <Text fontSize={["4vw", "1.5vw"]} color="gray.500" fontFamily="raleway">
                                Loading themes...
                            </Text>
                        </Flex>
                    ) : themes?.length > 0 ? (
                        <Grid
                            mt={["4vw", "2.98vw"]}
                            p={["2", "2.64vw"]}
                            gap={[7, 4]}
                            templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}
                        >
                            {themes.map((theme) => {
                                const themeSlug = convertToSlug(theme.name);
                                return (
                                    <Box
                                        key={theme.id}
                                        cursor="pointer"
                                        onClick={async () => {
                                            await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: theme?.name, type: "theme", searchFor: "experience" } });
                                            router.push(`/experiences/themes/${encodeURIComponent(themeSlug)}`)
                                        }}
                                        transition="transform 0.2s"
                                        _hover={{ transform: "scale(1.02)" }}
                                    >
                                        <CustomCard
                                            story={{
                                                name: theme.name,
                                                imageUrl: theme.coverImage[0]?.url || "/assets/default-theme.jpg",
                                                stats: theme.stats
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            minH="200px"
                            mt={["4vw", "2.98vw"]}
                        >
                            <Text fontSize={["4vw", "1.5vw"]} color="gray.500" fontFamily="raleway">
                                {filter?.country && filter?.country?.id !== -1
                                    ? `No themes found for ${filter.country.name}`
                                    : "No themes available"}
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Box>
        </Flex>
    );
};

export default ThemesPage;