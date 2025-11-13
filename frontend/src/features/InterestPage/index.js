import {
    Box,
    Flex,
    Text,
    Button,
    useBreakpointValue,
    useToast,
    Grid,
    Spinner
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AppContext from "../AppContext";
import CountryFilter from "../TagResultPage/CountryFilter";
import { useRouter } from "next/navigation";
import HeroBanner from "../Experiences/HeroBanner";
import InterestCard from "../HomePage2/InterestCard";
import { createDBEntry } from "../../queries/strapiQueries";

const InterestPage = () => {
    const { profile } = useContext(AppContext);
    const [filter, setFilter] = useState({});
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchInterests = async () => {
            setLoading(true);
            try {
                let endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=interest`;

                // Add country filter if selected (and not "All Countries")
                if (filter?.country && filter?.country?.id !== -1) {
                    endpoint += `&id=${filter.country.id}`;
                }

                console.log("Fetching interests from:", endpoint);

                const response = await axios.get(endpoint);

                if (response.data?.data) {
                    console.log("Interests data:", response.data.data);
                    setInterests(response.data.data);
                } else {
                    setInterests([]);
                }
            } catch (error) {
                console.error("Error fetching interests:", error);
                setInterests([]);
                toast({
                    title: "Error fetching interests",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInterests();
    }, [filter, toast]);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        if (isMobile && navigator.share) {
            navigator
                .share({
                    title: document.title,
                    url: currentUrl
                })
                .catch((error) => console.log("Error sharing", error));
        } else {
            try {
                navigator.clipboard
                    .writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: "success",
                            isClosable: true,
                            position: "top",
                            variant: "subtle"
                        });
                    })
                    .catch((err) => {
                        console.error("Error copying URL:", err);
                    });
            } catch (err) {
                console.log("Error:", err);
            }
        }
    };

    return (
        <Flex w="100%" flexDirection="column">
            <HeroBanner
                title={"Postcard Interests"}
                subtitle={
                    "Find experiences tailored to your specific travel interests and passions."
                }
            />
            <Box
                pos="relative"
                w="100%"
                pl={{ base: "5%", lg: "5%" }}
                pr={{ base: "5%", lg: "5%" }}
                mx="auto"
                textAlign="center"
            >
                {/* <CountryFilter
                    filter={filter}
                    setFilter={setFilter}
                    type={"hotels"}
                /> */}
                <Box w="100%" mb="1em" mt={{ base: "3em", md: "1em" }}>
                    {loading ? (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            minH="200px"
                            mt={["4vw", "2.98vw"]}
                        >
                            <Spinner
                                size="xl"
                                color="primary_1"
                                thickness="4px"
                            />
                            <Text
                                fontSize={["4vw", "1.5vw"]}
                                color="gray.500"
                                fontFamily="raleway"
                                ml={4}
                            >
                                Loading interests...
                            </Text>
                        </Flex>
                    ) : interests?.length > 0 ? (
                        <Grid
                            mt={["4vw", "2.98vw"]}
                            gap={[6, 4]}
                            templateColumns={[
                                "repeat(1, 1fr)",
                                "repeat(4, 1fr)"
                            ]}
                        >
                            {interests.map((interest) => (
                                <Box
                                    key={interest.id}
                                    cursor="pointer"
                                    onClick={async () => {
                                        await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: interest?.name, type: "interest", searchFor: "experience" } });
                                        router.push(
                                            `/experiences/interests/${interest.slug || interest.name
                                            }`
                                        )
                                    }}
                                    transition="transform 0.2s"
                                    _hover={{ transform: "scale(1.02)" }}
                                >
                                    <InterestCard
                                        name={interest.name}
                                        stats={interest.stats}
                                    />
                                </Box>
                            ))}
                        </Grid>
                    ) : (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            minH="200px"
                            mt={["4vw", "2.98vw"]}
                        >
                            <Text
                                fontSize={["4vw", "1.5vw"]}
                                color="gray.500"
                                fontFamily="raleway"
                            >
                                {filter?.country && filter?.country?.id !== -1
                                    ? `No interests found for ${filter.country.name}`
                                    : "No interests available"}
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Box>
        </Flex>
    );
};

export default InterestPage;
