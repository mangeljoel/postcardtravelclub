import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Heading,
    Flex
} from "@chakra-ui/react";

import { root } from "./index.module.scss";

const PostcardModal = (props) => {
    const {
        isShow,
        handleClose,
        headerText,
        children,
        style,
        ModalContentW,
        ModalContentH,
        size,
        scrollBehavior,
        dontClose,
        footerChildren,
        headerRightComponent,
    } = props;

    return (
        <Modal
            className={root}
            isCentered
            isOpen={isShow}
            onClose={handleClose}
            zIndex={99999}
            size={size ? size : "xl"}
            // maxH="80vh"
            // minH="600px"
            {...props}
            closeOnOverlayClick={false}
            lockFocusAcrossFrames={false}
            scrollBehavior={scrollBehavior ? scrollBehavior : "inside"}
            borderRadius="12"
        >
            <ModalOverlay />
            <ModalContent
                width={ModalContentW ? ModalContentW : ["auto"]}
                height={ModalContentH ? ModalContentH : ["fit-content"]}
                overflow="hidden"
                backgroundColor="background"
                borderRadius="14"
                zIndex={1600}
            >
                {/* HEADER */}
                <ModalHeader
                    borderTopRadius="12"
                    backgroundColor="primary_3"
                    p={3}
                >
                    <Flex justify="space-between" align="center">
                        {/* Left: Close button */}
                        {!dontClose && (
                            <Flex align="center">
                                <ModalCloseButton
                                    position="static"   // reset absolute positioning
                                    color="#ffffff"
                                    outline="none"
                                    size="sm"           // makes it smaller, optional
                                    mr={2}
                                />
                            </Flex>
                        )}

                        {/* Center: Title */}
                        <Heading
                            textAlign="center"
                            fontSize={["4.8vw", "2vw", "1.7vw", "1vw"]}
                            color="#ffffff"
                            flex="1"
                        >
                            {headerText}
                        </Heading>

                        {/* Right: Optional Component */}
                        <Flex>{headerRightComponent}</Flex>
                    </Flex>
                </ModalHeader>


                {/* BODY */}
                <ModalBody
                    style={style}
                    alignSelf={["center", "normal"]}
                    backgroundColor="background"
                >
                    {children}
                </ModalBody>

                {/* FOOTER */}
                {footerChildren && <ModalFooter>{footerChildren}</ModalFooter>}
            </ModalContent>
        </Modal>
    );
};

export default PostcardModal;
