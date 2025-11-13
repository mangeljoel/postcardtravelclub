import { FiShare2 } from "react-icons/fi"
import { Box, Text, Flex, Button, useToast } from "@chakra-ui/react";

const HeroBanner = ({ title, subtitle, backgroundImage }) => {
    const toast = useToast();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleShareClick = () => {
        const currentUrl = window.location.href;

        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
                .catch((error) => console.log('Error sharing', error));
        } else {
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        })
                    })
                    .catch((err) => {
                        console.log('Error copying URL:', err);
                    });
            } catch (err) {
                console.log('Error:', err);
            }
        }
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH={["20vh", "20vh"]}
            px={4}
            textAlign="center"
            mb={"4vw"}
        >
            <Flex
                alignItems="center"
                gap={["4vw", "1.5vw"]}
                mb={6}
                flexDirection={["column", "row"]}
            >
                <Text
                    fontSize={["8vw", "3.5vw"]}
                    fontFamily={"lora"}
                    fontWeight="bold"
                >
                    {title}
                </Text>

            </Flex>

            <Text
                fontSize={["4.5vw", "1.6vw"]}
                maxW={"90%"}
                fontWeight="medium"
                fontFamily={"lora"}
            >
                {subtitle}
            </Text>
        </Flex>
    )
}

export default HeroBanner