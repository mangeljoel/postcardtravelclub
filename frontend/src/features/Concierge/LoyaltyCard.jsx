import React from "react";
import { LoyaltyCardImage } from "../../styles/ChakraUI/icons";
import { Box, Text } from "@chakra-ui/react";

const LoyaltyCard = ({ loyaltyCard }) => {
    return (
        <Box width={"fit-content"} position={"relative"}>
            <LoyaltyCardImage width="360" />
            <Text
                color="white"
                position={"absolute"}
                left={5}
                top={3}
                fontSize={24}
                fontFamily={"raleway"}
                fontWeight={600}
            >
                {loyaltyCard.name}
            </Text>
            <Text
                color="white"
                position={"absolute"}
                left={5}
                top={12}
                fontSize={15}
                fontFamily={"raleway"}
                fontWeight={500}
            >
                Postcard Traveler
            </Text>
            <Text
                color="white"
                position={"absolute"}
                left={5}
                bottom={12}
                fontSize={15}
                fontFamily={"raleway"}
                fontWeight={500}
            >
                Membership #
            </Text>
            <Text
                color="white"
                position={"absolute"}
                left={5}
                bottom={7}
                fontSize={15}
                fontFamily={"raleway"}
                fontWeight={500}
            >
                {loyaltyCard.cardNumber}
            </Text>
            <Text
                color="white"
                position={"absolute"}
                right={5}
                bottom={12}
                fontSize={15}
                fontFamily={"raleway"}
                fontWeight={500}
            >
                Expiry date
            </Text>
            <Text
                color="white"
                position={"absolute"}
                right={5}
                bottom={7}
                fontSize={15}
                fontFamily={"raleway"}
                fontWeight={500}
            >
                {new Date(loyaltyCard.expiryDate).toLocaleDateString("en-GB")}
            </Text>
        </Box>
    );
};

export default LoyaltyCard;
