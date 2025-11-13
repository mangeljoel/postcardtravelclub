import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import PostcardSection from "./PostcardSection";
import PartnerSection from "./PartnerSection";
import WishListSection from "./WishListSection";
import ConciergeSection from "./ConciergeSection/index";
import { RightArrowIcon } from "../../styles/ChakraUI/icons";
import { useRouter } from "next/navigation";
import strapi from "../../queries/strapi";
import MembershipSection from "./MembershipSection";
import PostcardLibrary from "./LearnMorePostcardLibrary";
import PostcardConcierge from "./LearnMoreTravelConcierge";
import AppContext from "../AppContext";
import { useSignupModal } from "../SignupModalContext";
import AutoSlideshow from "./HeroSection/AutoSlideshow";

const index = () => {
    const images = [
        "/assets/homepage/press_logo_1.png",
        "/assets/homepage/press_logo_2.png",
        "/assets/homepage/press_logo_3.png",
        "/assets/homepage/press_logo_4.png",
        "/assets/homepage/press_logo_5.png",
        "/assets/homepage/press_logo_6.png",
        "/assets/homepage/press_logo_7.png",
        "/assets/homepage/press_logo_8.png"
    ];
    const router = useRouter();
    const { profile } = useContext(AppContext);
    const { openLoginModal } = useSignupModal();

    // const [data, setData] = useState({});

    // useEffect(() => {
    //     strapi
    //         .find("config", {
    //             fields: ["id"],
    //             populate: {
    //                 featuredPostcards: {
    //                     fields: ["name"],
    //                     populate: {
    //                         coverImage: {
    //                             fields: ["url"]
    //                         },
    //                         album: {
    //                             fields: ["name", "country", "region"],
    //                             populate: {
    //                                 country: {
    //                                     fields: ["name"]
    //                                 },
    //                                 region: {
    //                                     fields: ["name"]
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 },
    //                 featuredAlbums: {
    //                     fields: ["name", "slug"],
    //                     populate: {
    //                         news_article: {
    //                             fields: ["image"],
    //                             populate: {
    //                                 image: {
    //                                     fields: ["url"]
    //                                 }
    //                             }
    //                         },
    //                         country: {
    //                             fields: ["name"]
    //                         },
    //                         region: {
    //                             fields: ["name"]
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    //         .then((response) => {
    //             setData(response?.data);
    //         });
    // }, []);

    return (
        <Flex
            flexDirection={"column"}
            alignItems={"center"}
            gap={["40px", "60px"]}
            // pb={8}
        >
            <HeroSection />

            {/* Definition of Conscious Luxury Traveller */}
            <IntroSection />
            <PostcardConcierge />

            {/* Membership Section */}
            {/* <MembershipSection /> */}

            {/* <PostcardLibrary /> */}

            {/* Explore Postcards Section */}
            {/* <PostcardSection /> */}

            {/* Immersive Experience / Partners Section */}
            {/* <PartnerSection featuredAlbums={data?.featuredAlbums || []} /> */}

            {/* Start your Collection Section */}
            {/* <WishListSection /> */}

            {/* Concierge Section */}
            {/* <ConciergeSection /> */}
            {/* <Button
                mb={["10vw", "4vw"]}
                w={["85%", "32.82vw"]}
                h={["16.11vw", "5.22vw"]}
                borderRadius={["2.78vw", "1.04vw"]}
                px={["5.83vw", "0.67vw"]}
                alignItems="center"
                justifyContent="center"
                fontSize={["4.47vw", "1.7vw"]}
                fontFamily="lora"
                fontStyle="italic"
                color="white"
                gap={["3vw", "1vw"]}
                onClick={() =>
                    profile?.slug
                        ? router.push(`/${profile.slug}`)
                        : openLoginModal()
                }
            >
                {profile
                    ? "My Postcard Travel Diary"
                    : "Join The Postcard Travel Club"}
                <RightArrowIcon
                    mt={["0.8vw", "0.4vw"]}
                    w={["6vw", "3.2vw"]}
                    maxW={["6vw", "2.2vw"]}
                />
            </Button> */}

            <Box width={"100%"} mb={["4vw"]} pb={["6vw", "2vw"]}>
                <Text
                    // color={"#EFE9E4"}
                    fontWeight={600}
                    fontFamily="raleway"
                    // fontStyle="italic"
                    fontSize={["6.38vw", "2vw"]}
                    lineHeight={["6.67vw", "2.65vw"]}
                    textAlign={"center"}
                >
                    As featured in
                </Text>
                <AutoSlideshow images={images} speed={16000} />
            </Box>
        </Flex>
    );
};

export default index;
