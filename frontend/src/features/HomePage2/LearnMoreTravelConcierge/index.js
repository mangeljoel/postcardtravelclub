import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import AppContext from "../../AppContext";
import { fetchPaginatedResults } from "../../../queries/strapiQueries";
import axios from "axios";
import FeaturedCountriesSection from "./FeaturedCountriesSection";
import FeaturedRegionsSection from "./FeaturedRegionsSection";
import MemoriesSection from "../LearnMorePostcardLibrary/MemoriesSection";
import FeaturedInterestsSection from "./FeaturedInterestsSection";
import FeaturedThemesSection from "./FeaturedThemesSection";
import TestimonialsSection from "./TestimonialSection";
import PostcardLibrary from "../../HomePage2/LearnMorePostcardLibrary";

const PostcardConcierge = () => {
    const { profile } = useContext(AppContext);
    const [countryStats, setCountryStats] = useState([]);
    const [regionStats, setRegionStats] = useState([]);
    const [themeStats, setThemeStats] = useState([]);
    const [interestStats, setInterestStats] = useState([]);
    const [memories, setMemories] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const slug = "amitjaipuria";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    countryStatsRes,
                    regionStatsRes,
                    themeStatsRes,
                    //interestStatsRes,
                    memoriesRes,
                    testimonialsRes
                ] = await Promise.all([
                    // Fetch country stats - limit to 6
                    axios.get(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=country&limit=6`
                    ),
                    // Fetch region stats - limit to 6
                    axios.get(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=region&limit=10`
                    ),
                    // Fetch theme stats - limit to 6
                    axios.get(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=theme&limit=6`
                    ),
                    // Fetch interest stats - limit to 6
                    // axios.get(
                    //     `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getAllStats?statsType=interest&limit=6`
                    // ),
                    // Fetch memories
                    fetchPaginatedResults(
                        "memories",
                        { user: { slug }, shareType: "public" },
                        { gallery: true, country: true, region: true },
                        "date:DESC",
                        0,
                        10
                    ),
                    // Fetch testimonials
                    axios.get(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/testimonials`
                    )
                ]);

                // Process country stats
                if (countryStatsRes?.data?.data) {
                    setCountryStats(countryStatsRes.data.data);
                }

                // Process region stats
                if (regionStatsRes?.data?.data) {
                    setRegionStats(regionStatsRes.data.data);
                }

                // Process theme stats
                if (themeStatsRes?.data?.data) {
                    setThemeStats(themeStatsRes.data.data);
                }

                // Process interest stats
                // if (interestStatsRes?.data?.data) {
                //     setInterestStats(interestStatsRes.data.data);
                // }

                // Process memories
                if (Array.isArray(memoriesRes) && memoriesRes.length > 0) {
                    let mem = memoriesRes
                        .filter((m) => m.gallery?.length > 1)
                        .slice(0, 3);
                    setMemories(mem);
                } else {
                    console.warn("No memories returned:", memoriesRes);
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
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Flex flexDirection="column" w="100%" mx="auto" gap={[4, 1]}>
            <FeaturedCountriesSection
                countryStats={countryStats}
                loading={loading}
            />
            <FeaturedRegionsSection
                regionStats={regionStats}
                loading={loading}
            />
            <FeaturedThemesSection themeStats={themeStats} loading={loading} />
            <FeaturedInterestsSection
                // interestStats={interestStats}
                // loading={loading}
            />
            {/* <MemoriesSection featuredMemories={memories} /> */}
            {/* <TestimonialsSection testimonials={testimonials} /> */}
            <PostcardLibrary />
        </Flex>
    );
};

export default PostcardConcierge;
