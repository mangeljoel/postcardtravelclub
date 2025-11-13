import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import React from "react";
import RenderMarkdown from "../../../patterns/RenderMarkdown";
import LoadingGif from "../../../patterns/LoadingGif";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const AIInfoModal = React.memo(({
    isOpen,
    onClose,
    aiInfo,
    isMobile
}) => {
    const content = (
        <>
            <Text fontSize="large" fontWeight="bold">
                {aiInfo?.title || "AI Response"}
            </Text>
            {!aiInfo?.loading && aiInfo?.message ? (
                <Flex
                    flex={1}
                    flexDirection="column"
                    maxH={isMobile ? "100%" : "calc(80vh - 160px)"}
                    overflowY="auto"
                    px={isMobile ? 0 : 6}
                    pb={isMobile ? 0 : 4}
                >
                    <RenderMarkdown content={aiInfo?.message} />
                    <Button mx="auto" py={2} mt={6} onClick={onClose}>
                        Close
                    </Button>
                </Flex>
            ) : (
                <Flex flex={1} flexDirection="column" justifyContent="center">
                    <LoadingGif />
                    <Text fontFamily="lora" fontStyle="italic" align="center">
                        Fetching more information for you...
                    </Text>
                </Flex>
            )}
        </>
    );

    if (isMobile) {
        return (
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent
                    borderTopRadius="5vw"
                    bg="#efe9e4 !important"
                    as={MotionBox}
                    minW="100vw"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) =>
                        info.offset.y > window.innerHeight * 0.2 && onClose()
                    }
                    py={8}
                    px={4}
                >
                    <DrawerHeader>
                        <Box
                            w="23.6vw"
                            h="5px"
                            bg="#111111"
                            opacity="0.25"
                            borderRadius="2vw"
                            mx="auto"
                        />
                    </DrawerHeader>
                    <DrawerBody p={0} h="100%" display="flex" flexDirection="column" gap={4}>
                        {content}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={["15px", "30px"]} py={8} px={4}>
                <ModalHeader>{aiInfo?.title || "AI Response"}</ModalHeader>
                <ModalBody p={0}>{content}</ModalBody>
            </ModalContent>
        </Modal>
    );
});