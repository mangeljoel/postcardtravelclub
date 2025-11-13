import { Box, Flex, Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const DestinationExpertProfileCard = dynamic(() => import("./DestinationExpertProfileCard"), { ssr: false });
import CountryFilter from "../TagResultPage/CountryFilter";
import { useMemo, useState } from "react";

const LandingPage = ({ destinationExperts }) => {
    const [filter, setFilter] = useState({ country: null });

    // Responsive Chakra values
    const gapY = useBreakpointValue({ base: "11.9vw", md: "4vw" });
    const boxW = useBreakpointValue({ base: "100%", md: "28.82vw" });
    const boxH = useBreakpointValue({ base: "16.11vw", md: "7.22vw" });
    const boxRadius = useBreakpointValue({ base: "2.78vw", md: "1.04vw" });
    const boxPx = useBreakpointValue({ base: "5.83vw", md: "1.67vw" });
    const textSize = useBreakpointValue({ base: "6.67vw", md: "2.7vw" });

    // Deduplicate & sort country list
    const countryList = useMemo(() => {
        const countries = Object.values(
            destinationExperts
                ?.filter(c => c?.country)
                .reduce((acc, { country }) => {
                    if (country?.id && !acc[country.id]) acc[country.id] = country;
                    return acc;
                }, {})
        );
        return countries.sort((a, b) => a.name.localeCompare(b.name));
    }, [destinationExperts]);

    const filteredExperts = useMemo(() => {
        return destinationExperts?.filter((card) =>
            filter?.country?.id ? card.country?.id === filter?.country?.id : card.id !== 159
        );
    }, [destinationExperts, filter]);

    return (
        <Flex w="100%" flexDirection="column" px={{ base: "5%", lg: "10%" }} py={["2vw"]} pb={["10vw", "4vw"]} gap={gapY}>
            {/* <Box w={boxW} h={boxH} ml={{ base: "-2.5%", lg: "-5%" }} borderRadius={boxRadius} px={boxPx} bg="#111111" alignContent="center">
                <Text as="h1" fontSize={textSize} fontFamily="lora" fontStyle="italic" color="white">
                    Destination Experts
                </Text>
            </Box> */}

            <Flex
                direction="column"
                align="center"
                justify="center"
                minH={["20vh", "20vh"]}
                px={4}
                textAlign="center"
                mb={"4vw"}
            >
                <Text fontSize={["8vw", "3.5vw"]} fontFamily={"lora"} fontWeight="bold" mb={6}>
                    Destination Experts
                </Text>
                <Text fontSize={["4.5vw", "1.6vw"]} maxW={"90%"} fontWeight="medium" fontFamily={"lora"}>
                    Find local travel designers that curate personalised itineraies.
                </Text>
            </Flex>

            <CountryFilter filter={filter} setFilter={setFilter} countryList={countryList} />

            <Grid
                templateColumns={{ base: "repeat(1, auto)", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={["8.4vw", "2.22vw"]}
                placeItems="center"
            >
                {filteredExperts?.map((card, index) => (
                    <GridItem key={card.id ?? index}>
                        <DestinationExpertProfileCard index={index} card={card} />
                    </GridItem>
                ))}
            </Grid>

        </Flex>
    );
};

export default LandingPage;
