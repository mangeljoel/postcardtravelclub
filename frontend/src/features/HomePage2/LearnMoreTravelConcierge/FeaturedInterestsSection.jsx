import { Box, Flex, Text, Button } from "@chakra-ui/react";
import React, { useRef, useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import CustomCard from "../CustomCard";
import { useRouter } from "next/router";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { createDBEntry } from "../../../queries/strapiQueries";

// Reusable text card component for interests
const InterestTextCard = ({ profile }) => {
    const router = useRouter();

    return (
        <Flex
            bg={"primary_1"}
            w={["88.9vw", "37.45vw"]}
            h={["auto", "460px"]}
            minH={["280px", "420px"]}
            mx={["5.55vw", "1.56vw"]}
            mr={["5.55vw", "0"]}
            borderRadius={["3.611vw", "1.53vw"]}
            flexDirection={"column"}
            p={"5.56vw"}
            pl={["10vw", "5.56vw"]}
            py={["18.65vw", "0vw"]}
            justifyContent="center"
            gap={["7vw", "4vw"]}
            style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
            flexShrink={0}
        >
            <Text
                fontFamily="raleway"
                fontWeight={500}
                fontSize={["5.833vw", "2.25vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                color={"#EFE9E4"}
                textAlign={"left"}
            >
                <Text
                    as="span"
                    fontFamily="lora"
                    fontStyle="italic"
                    fontSize={["6.38vw", "2.35vw"]}
                    lineHeight={["6.67vw", "2.65vw"]}
                >
                    Discover Postcard Experiences by personal interests and hobbies.
                </Text>
            </Text>

            <Button
                variant={"none"}
                color={"white"}
                borderColor={"white"}
                border={"2px"}
                w={["63.05vw", "24.08vw"]}
                h={["8.05vw", "3.06vw"]}
                textAlign={"center"}
                borderRadius={["5.55vw", "2.08vw"]}
                fontFamily={"raleway"}
                fontWeight={600}
                fontSize={["3.33vw", "1.22vw"]}
                lineHeight={["10vw", "3.77vw"]}
                _hover={{ background: "#EFE9E4", color: "primary_1" }}
                onClick={async () => {
                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: "View All", type: "interest", searchFor: "experience" } });
                    router.push("/experiences/interests")
                }}
            >
                View All &nbsp;
                <RightArrowIcon
                    style={{ paddingTop: "1%" }}
                    h={["8.05vw", "3.06vw"]}
                    width={["2.77vw", "1.5vw"]}
                />
            </Button>
        </Flex>
    );
};

const FeaturedInterestsSection = () => {
    const { profile } = useContext(AppContext);
    const scrollContainerRef = useRef(null);
    const router = useRouter();
    const [interestStats, setInterestStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const FEATURED_INTERESTS = [
        { name: "Wellness" },
        { name: "Local Food" },
        { name: "Wildlife" },
        { name: "Nature Retreat" },
        { name: "Ecolodge" },
        { name: "Spa Treatments" }
    ];

    useEffect(() => {
        const fetchInterestStats = async () => {
            setLoading(true);
            try {
                // Fetch stats for each interest in parallel
                const statsPromises = FEATURED_INTERESTS.map(async (interest) => {
                    try {
                        const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=interest&name=${interest.name}`;
                        const response = await fetch(endpoint);

                        if (!response.ok) {
                            console.warn(`Failed to fetch stats for ${interest.name}`);
                            return null;
                        }

                        const responseData = await response.json();
                        console.log("resp", responseData)

                        // Extract the first item from the data array
                        if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
                            return responseData.data[0];
                        }
                        return null;
                    } catch (error) {
                        console.error(`Error fetching stats for ${interest.name}:`, error);
                        return null;
                    }
                });

                const results = await Promise.all(statsPromises);
                console.log("featured interests", results)

                // Filter out any null results and set the stats
                const validStats = results.filter(stat => stat !== null);

                setInterestStats(validStats);
            } catch (error) {
                console.error("Error fetching interest stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterestStats();
    }, []);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = scrollContainerRef.current.clientWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;

            if (scrollLeft + clientWidth >= scrollWidth) {
                scrollContainerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                scrollContainerRef.current.scrollBy({
                    left: 300,
                    behavior: "smooth"
                });
            }
        }
    };

    // Show loading state
    if (loading) {
        return (
            <Flex
                width="100%"
                h={"auto"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">Loading interests...</Text>
            </Flex>
        );
    }

    // Show empty state
    if (!interestStats || interestStats.length === 0) {
        return (
            <Flex
                width="100%"
                h={"auto"}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">No interests available</Text>
            </Flex>
        );
    }

    // Transform interest stats to match CustomCard format
    const formattedInterests = interestStats.map(interest => ({
        name: interest.name,
        slug: interest.slug,
        imageUrl: interest.coverImage?.url || "/assets/default-interest.jpg",
        stats: interest.stats,
        link: `/experiences/interests/${interest.name}`
    }));

    return (
        <Flex
            width="100%"
            h={"auto"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
        >
            {/* Text card outside scroll for mobile */}
            <Box display={["block", "none"]}>
                <InterestTextCard profile={profile} />
            </Box>

            <Box position={"relative"} w="100%">
                <Flex
                    overflowX={"auto"}
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                >
                    {/* Text card inside scroll for tablet/desktop only */}
                    <Box display={["none", "block"]} py={["4.44vw", "3.33vw"]}>
                        <InterestTextCard profile={profile} />
                    </Box>

                    <Flex
                        overflowX={"auto"}
                        className="no-scrollbar"
                        gap={["3.88vw", "1.56vw"]}
                        pr={["5.55vw", "1.56vw"]}
                        pl={["5.55vw", "0.56vw"]}
                        ref={scrollContainerRef}
                        alignItems="stretch"
                        pb={["5vw", "1vw"]}
                        py={["8.5vw", "3.33vw"]}
                    >
                        {/* Interest Cards */}
                        {formattedInterests.map((interest, index) => (
                            <Box
                                key={interest.slug || index}
                                cursor="pointer"
                                onClick={async () => {
                                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: interest?.name, type: "interest", searchFor: "experience" } });
                                    router.push(interest.link)
                                }}
                                transition="transform 0.2s"
                                _hover={{ transform: "scale(1.02)" }}
                            >
                                <CustomCard story={interest} />
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default FeaturedInterestsSection;