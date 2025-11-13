import { Flex, Box } from "@chakra-ui/react";

const DotsDivider = () => {
    return (
        <Flex
            w="100%"
            pb="3"
            pt="3"
            mb="14px"
            mt="14px"
            justifyContent={"center"}
        >
            <Box
                w="3px"
                mr="20px"
                h="3px"
                borderRadius={"50%"}
                bg="rgba(36, 32, 28, 1)"
                display="inline-block"
            ></Box>
            <Box
                w="3px"
                mr="20px"
                h="3px"
                borderRadius={"50%"}
                bg="rgba(36, 32, 28, 1)"
                display="inline-block"
            ></Box>
            <Box
                w="3px"
                h="3px"
                borderRadius={"50%"}
                bg="rgba(36, 32, 28, 1)"
                display="inline-block"
            ></Box>
        </Flex>
    );
};

export default DotsDivider;
