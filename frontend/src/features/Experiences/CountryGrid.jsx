import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import CustomCard from "../HomePage2/CustomCard";
import { createDBEntry } from "../../queries/strapiQueries";

const CountryGrid = ({ countries, profile }) => {
    const gradients = [
        "linear(to-br, purple.100, pink.100)",
        "linear(to-br, blue.100, cyan.100)",
        "linear(to-br, green.100, teal.100)",
        "linear(to-br, orange.100, yellow.100)",
        "linear(to-br, red.100, pink.100)",
        "linear(to-br, indigo.100, purple.100)",
    ];

    const getGradient = (index) => gradients[index % gradients.length];
    const textColor = "white";
    const iconColor = useColorModeValue("gray.600", "gray.300");

    return (
        <Box p={{ base: 4, md: 8 }}>
            {countries.length === 0 ? (
                <Text fontSize="xl" textAlign="center" color="gray.500">
                    No countries found
                </Text>
            ) : (
                <SimpleGrid
                    spacing={{ base: 6, md: 8, lg: 10 }}
                    columns={{
                        base: 1,     // 0–479px → mobile portrait
                        sm: 2,       // ≥480px → mobile landscape / small tablets
                        md: 2,       // ≥768px → tablets
                        lg: 3,       // ≥992px → small laptops
                        xl: 3,       // ≥1280px → desktops
                        '2xl': 4,  // ≥1536px → large screens (FIXED: was 5, now 4)
                    }}
                >
                    {countries.map((country, index) => (
                        <Link
                            key={country.id}
                            href={`/experiences/countries/${encodeURIComponent(country.name)}`}
                            style={{ textDecoration: "none" }}
                            onClick={async () => { await createDBEntry("events", { event_master: 12, user: profile?.id, searchData: { searchText: country?.name, type: "country", searchFor: "experience" } }); }}
                        >
                            <CustomCard
                                story={country}
                                gradient={getGradient(index)}
                                textColor={textColor}
                                iconColor={iconColor}
                            />
                        </Link>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default CountryGrid;