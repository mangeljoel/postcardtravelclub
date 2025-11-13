import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import TestimonialCard from "../../DestinationExpert/About/TestimonialCard";

const TestimonialsSection = ({ testimonials }) => {
    // Only take the first 8 testimonials
    const limitedTestimonials = testimonials?.slice(0, 3) || [];

    const staticTestimonial = [
        {
            name: "Shruti",
            message: "Planning my Bali trip with Matteo through Postcard Travel Club was effortless. I usually spend hours researching. but Matteo's postcard boards saved me time and introduced me to unique experiences I'd never have found. He and his team booked us a stunning 10-bedroom boutique hotel in Uluwatu-the highlight of our trip. As two women travelers. we felt safe with the reliable driver and constant on-call support. From restaurant reservations to a local astrologer. every detail was thoughtfully handled.",
        },
        {
            name: "Amit",
            message: "Our Shimla journey with Shilpa Sharma and Postcard Travel Club was truly incredible. For my father's 75th birthday. she curated experiences that brought depth and meaning beyond the usual five-star stay. We enjoyed a private Himachali lunch at a charming guest house, followed by a forest walk where we saw a sacred tree the locals worshipped. A private tour of the Viceregal Lodge with noted historian Dr. Raja Bhasin and a local cheese-tasting made the celebration memorable and engaging for our entire family from ages 7-75.",
        },
        {
            name: "Nimisha",
            message: "Designing our Spain journey with Thomas through Postcard Travel Club was such a joyful experience! He curated an itinerary that brought the local culture to life in ways we could truly enjoy as a family. The highlight was the flamenco dance experience we shared together - even our 10-year-old son loved it - along with the beautiful mosaic workshop with a Local artist We would happily recommend Thomas to other travellers looking for something truly special?",
        }
    ]

    return (
        <Flex
            width="100%"
            h="auto"
            flexDirection="column"
            alignItems="center"
            py={["6vw", "6vw"]}
        >
            {/* Heading */}
            <Text
                fontFamily="lora"
                fontStyle="italic"
                fontWeight={500}
                fontSize={["6vw", "3vw"]}
                lineHeight={["7vw", "2.4vw"]}
                color="primary_3"
                mb={["6vw", "3vw"]}
                textAlign="center"
            >
                What Our Guests Say
            </Text>

            {/* Testimonials Grid */}
            <Box
                w="100%"
                overflowX="auto"
                overflowY="hidden"
                className="no-scrollbar" // or use css to hide scrollbar
                pb={4} // padding bottom for shadow
                px={["0%", "10%"]}
            >
                <Flex
                    gap={["16px", "24px"]}
                    px={["16px", "24px"]}
                    py={2}
                    w="max-content" // Important: makes flex container as wide as its content
                >
                    {staticTestimonial.map((testimonial, index) => (
                        <TestimonialCard key={index} data={testimonial} />
                    ))}
                </Flex>
            </Box>

        </Flex>
    );
};

export default TestimonialsSection;
