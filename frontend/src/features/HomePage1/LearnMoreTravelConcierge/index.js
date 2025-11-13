import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import AppContext from "../../AppContext";
import { fetchPaginatedResults } from "../../../queries/strapiQueries";
import DestinationExpertsSection from "./DestinationExpertSection";
import StaysSection from "./StaysSection";
import axios from "axios";
import PersonalConciergeSection from "./PersonalConciergeSection";
import TestimonialsSection from "../../HomePage2/LearnMoreTravelConcierge/TestimonialSection";
import MembershipSection from "../MembershipSection";
import PostcardSection from "../PostcardSection";

const PostcardConcierge = () => {
    const { profile } = useContext(AppContext);
    const [destinationExperts, setDestinationExperts] = useState([]);
    const [stays, setStays] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const [albums, allExperts, testimonialsRes] = await Promise.all(
                    [
                        axios.post(
                            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAlbums?page=2&pageSize=3&type=mindful-luxury-hotels`,
                            { tags: [] }
                        ),
                        fetchPaginatedResults(
                            "destination-experts",
                            { status: "published" },
                            {
                                coverImage: true,
                                user: {
                                    populate: {
                                        company: {
                                            fields: ["id", "name", "icon"],
                                            populate: { icon: true }
                                        }
                                    }
                                },
                                founderMessage: {
                                    populate: {
                                        founderMessage: true,
                                        founderImage: true
                                    }
                                },
                                country: true
                            },
                            undefined, // ← don't pass 0 here
                            0, // start
                            3 // limit
                        ),
                        axios.get(
                            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/testimonials`
                        )
                    ]
                );

                const experts = Array.isArray(allExperts)
                    ? allExperts.slice(0, 3)
                    : [];

                if (albums?.data?.length) setStays(albums.data);
                if (Array.isArray(experts)) {
                    setDestinationExperts(experts);
                } else {
                    console.warn("Unexpected data format:", experts);
                }

                // Process testimonials
                if (
                    testimonialsRes?.data?.data &&
                    Array.isArray(testimonialsRes.data.data)
                ) {
                    setTestimonials(testimonialsRes.data.data);
                } else {
                    console.warn("No testimonials returned:", testimonialsRes);
                }
            } catch (error) {
                console.error("Failed to fetch destination experts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, []);

    return (
        <Flex flexDirection="column" w="100%" mx="auto" gap={[4, 1]}>
            {/* <Text
                fontFamily="raleway"
                fontWeight={600}
                fontSize={["6.83vw", "2.81vw"]}
                lineHeight={["8vw", "3.5vw"]}
                color="#307FE2"
                ml={["0", "7vw"]}
                px={["6.85vw", "0"]}
                mb={["40px", 0]}
            >
                {" "}
                Subscribe and join
                <br />
                <Text as="span" fontStyle="italic" fontFamily="lora">
                    Postcard Travel Concierge
                </Text>
            </Text> */}

            <PersonalConciergeSection />
            <StaysSection featuredAlbums={stays} />
            <DestinationExpertsSection
                destinationExperts={destinationExperts}
            />
            <TestimonialsSection testimonials={testimonials} />
            <PostcardSection />
        </Flex>
    );
};

export default PostcardConcierge;
