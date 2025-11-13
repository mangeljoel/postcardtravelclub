import { Box, Flex, Text, Link, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

const AboutPanel = ({ profile }) => {
    const router = useRouter();
    const hasSocialLinks =
        profile.blogURL ||
        profile.instaURL ||
        profile.facebookURL ||
        profile.linkedinURL ||
        profile.pinterestURL;
    return (
        <Box mt={["15%", "7%"]} w="100%">
            <Flex direction={["column", "row"]}>
                <Flex direction="column" w={["100%", "50%"]}>
                    {profile.Bio && (
                        <Box>
                            <Text variant="aboutTitles">Bio</Text>
                            <Text variant="aboutDesc">{profile.bio}</Text>
                        </Box>
                    )}

                    <Box mt="2%" width="100%">
                        <Text width="100%" variant="aboutTitles">
                            Postcard stories
                        </Text>
                        {/* <Link
                            width="100%"
                            href={
                                "https://postcard.travel/u/" + profile.Type
                                    ? profile.Type + "/"
                                    : "regular/" + profile.Userlink
                            }
                        > */}
                        <Text
                            width="100%"
                            display="inline-flex"
                            variant="aboutDescLink"
                            cursor="pointer"
                            wordBreak={["break-all", "keep-all"]}
                            onClick={() => {
                                // //console.log(profile, profile.Type);
                                let path =
                                    "https://postcard.travel/" + profile.slug;
                                router.push(path);
                            }}
                        >
                            https://postcard.travel/
                            {profile.slug}
                        </Text>
                        {/* </Link> */}
                    </Box>
                </Flex>
                {hasSocialLinks && (
                    <Flex w={["100%", "50%"]}>
                        <Box w="100%">
                            <Text variant="aboutTitles">Social</Text>
                            <Flex direction={["row", "column"]} flexWrap="wrap">
                                {profile.twitterURL && (
                                    <Link display="inline-flex" mr={"5%"}>
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/twitter-icon.png"
                                            }
                                            alt={"twitter"}
                                        />
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            Twitter
                                        </Text>
                                    </Link>
                                )}
                                {profile.facebookURL && (
                                    <Link
                                        display="inline-flex"
                                        mr={"5%"}
                                        href={profile.facebookURL}
                                        isExternal
                                    >
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/fb-icon.png"
                                            }
                                            alt={"facebook"}
                                        />{" "}
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            Facebook
                                        </Text>
                                    </Link>
                                )}
                                {profile.instaURL && (
                                    <Link
                                        display="inline-flex"
                                        mr={"5%"}
                                        href={profile.instaURL}
                                        isExternal
                                    >
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/instagram-icon.png"
                                            }
                                            alt={"instagram"}
                                        />
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            Instagram
                                        </Text>
                                    </Link>
                                )}
                                {profile.linkedinURL && (
                                    <Link
                                        display="inline-flex"
                                        mr={"5%"}
                                        href={profile.linkedinURL}
                                        isExternal
                                    >
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/linkedin-icon.png"
                                            }
                                            alt={"linkedin"}
                                        />
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            LinkedIn
                                        </Text>
                                    </Link>
                                )}
                                {profile.pinterestURL && (
                                    <Link
                                        display="inline-flex"
                                        mr={"5%"}
                                        href={profile.pinterestURL}
                                        isExternal
                                    >
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/pint-icon.png"
                                            }
                                            alt={"pinterest"}
                                        />
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            Pinterest
                                        </Text>
                                    </Link>
                                )}
                                {profile.blogURL && (
                                    <Link
                                        display="inline-flex"
                                        mr={"5%"}
                                        href={profile.blogURL}
                                        isExternal
                                    >
                                        <Image
                                            loading="lazy"
                                            h="19px"
                                            w="19px"
                                            src={
                                                "/assets/new_ui/icons/website-icon.png"
                                            }
                                            alt={"website"}
                                        />
                                        <Text
                                            mr={"5%"}
                                            ml={"1%"}
                                            variant="aboutDescLink"
                                        >
                                            Website
                                        </Text>
                                    </Link>
                                )}
                            </Flex>
                        </Box>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

export default AboutPanel;
