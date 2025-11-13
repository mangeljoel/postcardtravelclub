import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import CustomCard from "../CustomCard"; // Import CustomCard instead of AlbumCard
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { useRouter } from "next/router";
import { createDBEntry } from "../../../queries/strapiQueries";
import AppContext from "../../AppContext";

const TextCard = ({ profile }) => {
    const router = useRouter();
    return <Flex
        bg={"primary_1"}
        w={["88.9vw", "37.45vw"]}
        // h={["auto", "30vw"]}
        h={["auto", "460px"]}
        mx={["5.55vw", "1.56vw"]}
        mr={["5.55vw", "0"]}
        borderRadius={["3.611vw", "1.53vw"]}
        flexDirection={"column"}
        p={"5.56vw"}
        pl={["10vw", "5.56vw"]}
        py={["25.65vw", "0vw"]}
        justifyContent="center"
        gap={["8vw", "2vw"]}
        flexShrink={0}
        style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
    >
        <Text
            fontFamily={"raleway"}
            fontWeight={500}
            fontSize={["5.833vw", "2.25vw"]}
            lineHeight={["6.67vw", "2.65vw"]}
            color={"#EFE9E4"}
        >
            <Text
                as="span"
                fontSize={["6.38vw", "2.35vw"]}
                lineHeight={["6.67vw", "2.65vw"]}
                fontFamily="lora"
                fontStyle="italic"
            >
                Discover Postcard Experiences by country.
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
                await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: "View All", type: "country", searchFor: "experience" } });
                router.push("/experiences/countries");
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
};

const FeaturedCountriesSection = ({ countryStats = [], loading = false }) => {
    const router = useRouter();
    const scrollContainerRef = useRef(null);
    const { profile } = useContext(AppContext);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

            scrollContainerRef.current.scrollTo({
                left: atEnd ? 0 : scrollLeft + 300,
                behavior: "smooth",
            });
        }
    };

    // Show loading state
    if (loading) {
        return (
            <Flex
                flexDirection="column"
                gap={["12.22vw", "4.42vw"]}
                mb={["14.16vw", "0vw"]}
                w="100%"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">Loading countries...</Text>
            </Flex>
        );
    }

    // Show empty state
    if (!countryStats || countryStats.length === 0) {
        return (
            <Flex
                flexDirection="column"
                gap={["12.22vw", "4.42vw"]}
                mb={["14.16vw", "0vw"]}
                w="100%"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Text color="gray.500" fontSize="lg">No countries available</Text>
            </Flex>
        );
    }

    // Transform country stats to match CustomCard format
    const formattedCountries = countryStats.map(country => ({
        name: country.name,
        slug: country.slug,
        imageUrl: country.coverImage?.url || "/assets/default-country.jpg",
        stats: country.stats,
        link: `/experiences/countries/${country.slug}`
    }));

    return (
        <Flex
            flexDirection="column"
            gap={["12.22vw", "4.42vw"]}
            mb={["14.16vw", "0vw"]}
            w="100%"
        >
            {/* ---------- MOBILE VIEW (STACKED) ---------- */}
            <Box display={["block", "none"]}>
                <TextCard profile={profile} />
                <Flex
                    flexDirection="column"
                    mt="6vw"
                >
                    <Flex
                        overflowX="auto"
                        className="no-scrollbar"
                        gap={["3.88vw", "1vw"]}
                        px={["5.55vw", "0"]}
                        py={["4.44vw", "0"]}
                    >
                        {formattedCountries.map((country, index) => (
                            <Box
                                key={country.slug || index}
                                cursor="pointer"
                                onClick={async () => {
                                    await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: country?.name, type: "country", searchFor: "experience" } });
                                    router.push(country.link)
                                }}
                            >
                                <CustomCard story={country} />
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Box>

            {/* ---------- DESKTOP/TABLET VIEW (HORIZONTAL SCROLL) ---------- */}
            <Box position="relative" w="100%" display={["none", "block"]}>
                <Flex
                    className="no-scrollbar"
                    overflowY={"hidden"}
                    gap={["3.88vw", "1vw"]}
                    py={["4.44vw", "3.33vw"]}
                >
                    {/* Text card inside scroll for tablet/desktop only */}
                    <Box display={["none", "block"]}>
                        <TextCard profile={profile} router={router} />
                    </Box>

                    <Flex
                        overflowX={"auto"}
                        className="no-scrollbar"
                        pl={["5.55vw", "0vw"]}
                        ref={scrollContainerRef}
                    >
                        <Flex
                            overflowX={"auto"}
                            className="no-scrollbar"
                            gap={["3.88vw", "1.56vw"]}
                            pr={["5.55vw", "1.56vw"]}
                            pl={["5.55vw", "0.56vw"]}
                            alignItems="stretch"
                            pb={["5vw", "1vw"]}
                        >
                            {/* Country Cards */}
                            {formattedCountries.map((country, index) => (
                                <Box
                                    key={country.slug || index}
                                    cursor="pointer"
                                    onClick={async () => {
                                        await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: country?.name, type: "country", searchFor: "experience" } });
                                        router.push(country.link)
                                    }}
                                    transition="transform 0.2s"
                                    _hover={{ transform: "scale(1.02)" }}
                                // pt={["", "1vw"]}
                                >
                                    <CustomCard story={country} />
                                </Box>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

export default FeaturedCountriesSection;