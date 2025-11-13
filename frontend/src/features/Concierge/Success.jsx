import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const Success = () => {
    return (
        <Flex flexDirection={"column"} alignItems={"center"} pb={-5}>
            <IoIosCheckmarkCircleOutline color="#16BE27" size={"70"} />
            <Text
                fontFamily="raleway"
                fontSize={[16, 20]}
                fontWeight={600}
                textAlign={"center"}
                mt={10}
                color={"#5A5A5A"}
            >
                Congratulations!
            </Text>
            <Text
                fontFamily="raleway"
                fontSize={[16, 20]}
                fontWeight={600}
                textAlign={"center"}
                mb={8}
                color={"#5A5A5A"}
            >
                You're payment was successful
            </Text>
            <Text
                fontFamily="raleway"
                fontSize={[16, 20]}
                fontWeight={600}
                textAlign={"center"}
                color={"#5A5A5A"}
            >
                You can now avail concierge service & other benefits
            </Text>

            <Button variant={"outline"} mt={28}>
                View transaction details
            </Button>
            <Button my={5}>Continue</Button>
        </Flex>
    );
};

export default Success;
