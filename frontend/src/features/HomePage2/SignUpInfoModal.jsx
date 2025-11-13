import {
    Box,
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import React from "react";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";

const SignUpInfoModal = ({ state, setShowSignModal }) => {
    return (
        <Modal
            isOpen={state.isShow}
            size={["xs", "lg"]}
            bgColor={"#EFE9E4"}
            isCentered
            onClose={() =>
                setShowSignModal((prev) => ({ ...prev, isShow: false }))
            }
        >
            <ModalOverlay />
            <ModalContent borderRadius={["15px", "30px"]}>
                <ModalCloseButton />
                <ModalBody
                    as={Flex}
                    flexDirection={"column"}
                    px={["25px", "50px"]}
                    py={["28px", "56px"]}
                    gap={["15px", "22px"]}
                >
                    <Flex
                        width={"100%"}
                        color={"primary_3"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Box>
                            <Text
                                fontSize={["18px", "29px"]}
                                fontFamily={"lora"}
                                fontStyle={"italic"}
                                fontWeight={500}
                                lineHeight={["21px", "37px"]}
                            >
                                {state.title}
                            </Text>
                        </Box>

                        <ChakraNextImage
                            src={"/assets/postcard-logo-blue.png"}
                            width={["45px", "90px"]}
                            height={["45px", "90px"]}
                            alt={"Postcard Logo"}
                        />
                    </Flex>

                    <Box
                        bgColor={"primary_3"}
                        height={["1px", "2px"]}
                        width={"100%"}
                        mb={["4.5px", "9px"]}
                    ></Box>

                    {state.message.split("Can't").map((part, index) => (
                        <Text
                            key={index}
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["12px", "21px"]}
                            lineHeight={["18px", "24px"]}
                        >
                            {index === 0 ? part.trim() : `Can't ${part.trim()}`}
                        </Text>
                    ))}

                    {/* <Text
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["12px", "21px"]}
                        lineHeight={["13px", "29px"]}
                    >
                        {state.message}
                    </Text> */}

                    <Button
                        borderRadius={["20px", "40px"]}
                        mt={["4px", "8px"]}
                        h={["30px", "40px"]}
                        fontSize={["14px", "20px"]}
                        onClick={() =>
                            setShowSignModal((prev) => ({
                                ...prev,
                                isShow: false
                            }))
                        }
                    >
                        Close
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SignUpInfoModal;
