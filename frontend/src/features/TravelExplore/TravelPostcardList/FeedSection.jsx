import { Box, Link, Flex, Text, Image } from "@chakra-ui/react";

const FeedSection = ({ postcard }) => {
    return (
        <Flex mt={10} mb={5} justify={"flex-start"}>
            <Image
                borderRadius="full"
                height={10}
                weight={10}
                src="/assets/karen-hastings.jpg"
                alt={"Karen Hastings"}
            />
            {/* <Text textAlign={"left"} ml={2} fontSize={"0.8em"}>
                <Link _hover={{ color: "primary_1", textDecor: "underline" }}>
                    <b>Karen Hastings</b>
                </Link>{" "}
                and 14 others have collected this postcard.
            </Text> */}
            <Text textAlign={"left"} ml={2} fontSize={"0.8em"} my="auto">
                {" "}
                <Link _hover={{ color: "primary_1", textDecor: "underline" }}>
                    <b>Karen Hastings</b>
                </Link>{" "}
                is the first to collect this postcard.
            </Text>
        </Flex>
    );
};
export default FeedSection;
