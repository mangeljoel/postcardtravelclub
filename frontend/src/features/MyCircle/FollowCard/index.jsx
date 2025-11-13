import { Flex, Avatar, Text, Button, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

const FollowCard = ({
    followData,
    listNumber,
    itemId,
    BtnInfo,
    btnAction,
    onClose
}) => {
    const router = useRouter();

    const handleCardClick = () => {
        if (followData && followData.link) {
            router.push("/" + followData.link).then(() => {
                if (onClose) onClose();
            });
        }
    };

    const handleButtonClick = () => {
        if (btnAction) {
            btnAction(itemId);
        }
    };

    const renderPostcardText = () => {
        if (followData && followData.noOfbkmpc) {
            const postcardText =
                followData.noOfbkmpc > 1 ? " postcards" : " postcard";
            return `${followData.noOfbkmpc}${postcardText}`;
        }
        return "";
    };

    const renderCountryText = () => {
        if (followData && followData.noOfbkmCountries) {
            const countryText =
                followData.noOfbkmCountries > 1 ? " countries" : " country";
            return `${followData.noOfbkmCountries}${countryText}`;
        }
        return "";
    };

    return (
        <Flex my="0.8em" w="100%" justifyContent="space-between">
            <Flex onClick={handleCardClick} cursor="pointer">
                <Avatar mr="1em" src={followData?.picUrl} />
                <Box>
                    <Text my="auto">{followData?.fullName}</Text>
                    <Text
                        my="auto"
                        fontSize="11px"
                        color="primary_3"
                        fontWeight="semibold"
                    >
                        {renderPostcardText()} | {renderCountryText()}
                    </Text>
                </Box>
            </Flex>
            <Button
                width="30%"
                fontSize={["12px", "18px"]}
                isLoading={BtnInfo?.btnLoading}
                onClick={handleButtonClick}
            >
                {BtnInfo?.btnText}
            </Button>
        </Flex>
    );
};

export default FollowCard;
