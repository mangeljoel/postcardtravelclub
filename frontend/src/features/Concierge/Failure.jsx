import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const Failure = () => {
    return (
        <Flex flexDirection={"column"} alignItems={"center"} pb={-5}>
            <IoIosCloseCircleOutline color="#FF633A" size={"70"} />
            <Text
                fontFamily="raleway"
                fontSize={[16, 20]}
                fontWeight={600}
                textAlign={"center"}
                mt={10}
                color={"#5A5A5A"}
            >
                OOPS!
            </Text>
            <Text
                fontFamily="raleway"
                fontSize={[16, 20]}
                fontWeight={600}
                textAlign={"center"}
                mb={8}
                color={"#5A5A5A"}
            >
                You're transaction has failed
            </Text>

            <Button mt={40} mb={5}>
                Try Again
            </Button>
        </Flex>
    );
};

export default Failure;
