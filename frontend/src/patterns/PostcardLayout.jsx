import { AspectRatio, Flex, Button, Box, Image, Text } from "@chakra-ui/react";
import DotsDivider from "../features/DotsDivider";

const PostcardLayout = ({ image, name, company, country, intro, story }) => {
    return (
        <Box w="100%" px={["4%", "25%"]}>
            <Text mt="1em" mb="1em" textAlign="left" variant="blogTitle">
                {name}
            </Text>
            <Text
                my="2em"
                fontSize={"1rem"}
                fontFamily={"raleway"}
                //variant="storyDescription"
                textAlign={"left"}
                whiteSpace={"pre-line"}
            >
                {intro}
            </Text>
            {/* <Text mb="1em" fontWeight={"bold"} color={"primary_3"}>
                {company}
            </Text> */}
            <AspectRatio
                // ratio={1}
                w={["100%", "100%"]}
                maxW={["100%", "500px"]}
                mx="auto"
                my="2em"
            >
                <Image
                    borderRadius={["8px", "8px"]}
                    boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                    src={image}
                    objectFit="contain"
                    alt="postcard cover image"
                />
            </AspectRatio>
            <Box>
                {/* <Text mt="2em" mb="1em" variant="profileName">
                    {name}
                </Text>
                {company && (
                    <Flex w="100%" mx="auto" my="2em" justifyContent="center">
                        <Text> published by</Text> &nbsp;
                        <Text mb="1em" fontWeight={"bold"} color={"primary_3"}>
                            {company}
                        </Text>
                    </Flex>
                )}

                <Text mb="1em" variant="storyProfileName">
                    {country}
                </Text>
                <DotsDivider /> */}
                <Text
                    my="2em"
                    fontFamily={"raleway"}
                    fontSize={"1rem"}
                    //variant="storyDescription"
                    textAlign={"left"}
                    whiteSpace={"pre-line"}
                >
                    {story}
                </Text>
            </Box>
        </Box>
    );
};
export default PostcardLayout;
