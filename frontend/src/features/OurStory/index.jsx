import {
    Box,
    Img,
    Heading,
    Flex,
    AspectRatio,
    Image,
    Text
} from "@chakra-ui/react";
import FlipGridImage from "./FlipGridImage";

const OurStory = ({ aboutUsSections, config }) => {
    return (
        <Box
            mt={["6%", "3%"]}
            mb={["33%", "18%"]}
            paddingLeft={["5%", "10%"]}
            paddingRight={["5%", "10%"]}
        >
            {/* <Box
                position="relative"
                width={["60vw", "20vw"]}
                mt={"3%"}
                mx="auto"
            >
                <GridImage />
                <Image
                    // loader={myLoader}
                    src="/assets/new_ui/stamp.png"
                    alt="homepage"
                    layout="fill"
                    priority
                    objectFit="contain"
                />
            </Box> */}
            <Img
                loading="lazy"
                width={["300px", "350px"]}
                m="auto"
                height={["120px", "130px"]}
                objectFit={"cover"}
                src={"/assets/new_ui/icons/logo_noshad.png"}
                alt="logo"
            />

            {/* <Text
                mt={["6%", "3%"]}
                pt="20px"
                variant="Heading"
                textAlign={"center"}
            >
                Inspiring a New Generation of Mindful Travelers Through
                Storytelling
            </Text> */}
            {/* <Text
                mt={["6%", "3%"]}
                width={["100%", "52%"]}
                variant="subHeading"
                // fontSize={["1.1rem", "1.1rem"]}
                whiteSpace={"pre-line"}
                fontWeight="bold"
                textAlign={"center"}
            >
                Inspiring a New Generation of Mindful Travelers Through
                Storytelling
            </Text> */}
            <Box>
                {config?.ourStoryDescription && (
                    <Text
                        mt={["6%", "3%"]}
                        variant="aboutsection"
                        width={["100%", "80%"]}
                        // fontSize={["1.1rem", "1.1rem"]}
                        // fontSize={["0.82rem", "1.1rem"]}
                        whiteSpace={"pre-line"}
                        textAlign={"justify"}
                    >
                        {config?.ourStoryDescription}
                    </Text>
                )}

                {aboutUsSections?.map((section, index) => {
                    return (
                        <Box
                            key={index}
                            mb={["30%", "10%"]}
                            id={section?.name
                                ?.toLowerCase()
                                .replace("%", "")
                                .replace(/\s/g, "")}
                        >
                            <Text
                                mt={["6%", "3%"]}
                                variant="subHeading"
                                fontSize={["24px", "2rem"]}
                                lineHeight={["35px", "50px"]}
                                whiteSpace={"pre-line"}
                                fontWeight="bold"
                                width={["100%", "60%"]}
                                textAlign={"center"}
                            >
                                {section.name}
                            </Text>
                            <Text
                                //mt={["3%", "1%"]}
                                mb={["15%", "5%"]}
                                width={["100%", "70%"]}
                                variant="subHeading"
                                fontSize={["1rem", "1.2rem"]}
                                whiteSpace={"pre-line"}
                                textAlign={"justify"}
                            >
                                {section.description}
                            </Text>

                            <FlipGridImage
                                profiles={section.about_us_profiles}
                                columnLimit={[
                                    section.name === "Our Team" ||
                                        section.name === "Global Brand Ambassadors"
                                        ? 1
                                        : section.columns / 2,
                                    section.name === "Our Team" ||
                                        section.name === "Global Brand Ambassadors"
                                        ? 3
                                        : section.columns
                                ]}
                                onlyImage={
                                    !(
                                        section.name === "Our Team" ||
                                        section.name ===
                                        "Global Brand Ambassadors"
                                    )
                                }
                            />
                        </Box>
                    );
                })}

                {/* <Text mt={["6%", "3%"]} variant="homeSection">
                    Our Advisors
                </Text>
                <Text
                    mt={["6%", "3%"]}
                    width={["100%", "80%"]}
                    variant="subHeading"
                >
                    We lean on a community of advisors who are international
                    advocates for responsible tourism.
                </Text>
                <FlipGridImage />
                <Text mt={["6%", "3%"]} variant="homeSection">
                    Champions of Change
                </Text>
                <Text
                    mt={["6%", "3%"]}
                    width={["100%", "80%"]}
                    variant="subHeading"
                >
                    We partner with the people behind hotels, tours and industry
                    groups that are aligned with our vision for responsible
                    tourism
                </Text>
                <FlipGridImage imageList={communityList} columnLimit={[2, 4]} />
                <Text mt={["6%", "3%"]} variant="homeSection">
                    Founding Members
                </Text>
                <Text
                    mt={["6%", "3%"]}
                    width={["100%", "80%"]}
                    variant="subHeading"
                >
                    We partner with luxury hotels and tours looking to connect
                    with luxury travellers interested in promoting responsible
                    tourism.
                </Text>
                <FlipGridImage imageList={businessList} columnLimit={[2, 4]} />
                <Text mt={["6%", "3%"]} variant="homeSection">
                    Affiliations
                </Text>
                <Text
                    mt={["6%", "3%"]}
                    width={["100%", "80%"]}
                    variant="subHeading"
                >
                    We partner with industry groups and tourism boards and
                    invite them the bring on like-minded members to the Postcard
                    platform.
                </Text>
                <FlipGridImage imageList={affiliations} columnLimit={[1, 3]} />
                <Text mt={["6%", "3%"]} variant="homeSection">
                    10% Pledge to Conservation
                </Text>
                <Text
                    mt={["6%", "3%"]}
                    width={["100%", "80%"]}
                    variant="subHeading"
                >
                    With a vision to grow Postcard as a social enterprise, we
                    have taken steps to make supportIng local community and land
                    part of our culture and DNA. We pledge to donate 10% of all
                    revenue towards community and nature conservation. We intend
                    to increase this % as we grow.
                </Text> */}
            </Box>
        </Box>
    );
};
export default OurStory;
