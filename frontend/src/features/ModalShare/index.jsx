import React, { useState } from "react";
import {
    FacebookShareButton,
    FacebookIcon,
    PinterestShareButton,
    PinterestIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "next-share";

import { Box, IconButton, useToast } from "@chakra-ui/react";
import { Label } from "../../patterns/Typography";
import "../../../src/global.js";
import { root, body, copy_layout } from "./index.module.scss";
import { LinkIcon } from "@chakra-ui/icons";

const ModalShare = ({
    url,
    title,
    description,
    imageUrl,
    fbDescription,
    hashtags
}) => {
    const [shareStart, setShareStart] = useState(false);
    const toast = useToast();
    const id = "toast-present";

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        if (!toast.isActive(id)) {
            toast({
                id,
                title: "Link Copied!",
                duration: 2000,
                isClosable: true
            });
        }
    };

    return (
        <>
            <Box className={root}>
                <Box className={body}>
                    <Label copy={title} size="lg" color="primary-2" />

                    {!shareStart && (
                        <Box
                            className={copy_layout}
                            display="flex"
                            gap={["3", "10"]}
                            my="8"
                            width={"100%"}
                            justifyContent="center"
                            flexWrap="nowrap"
                        >
                            <FacebookShareButton url={url}>
                                <FacebookIcon size={40} round />
                            </FacebookShareButton>
                            <PinterestShareButton url={url}>
                                <PinterestIcon size={40} round />
                            </PinterestShareButton>
                            <LinkedinShareButton url={url}>
                                <LinkedinIcon size={40} round />
                            </LinkedinShareButton>
                            <WhatsappShareButton url={url} separator=":: ">
                                <WhatsappIcon size={40} round />
                            </WhatsappShareButton>
                            <IconButton
                                icon={<LinkIcon />}
                                onClick={handleCopy}
                                variant="solid"
                                aria-label="Copy"
                                isRound={true}
                                colorScheme="primary_1"
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ModalShare;
