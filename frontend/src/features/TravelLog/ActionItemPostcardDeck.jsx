import { Button, Flex } from '@chakra-ui/react'
import React from 'react'

const ActionItemPostcardDeck = ({ profile, showActionButton, isFooterInView, onSave, onComplete }) => {
    return (

        profile && showActionButton && (
            <Flex
                id="ActionItemsDestinationExpertPostcardDeck"
                w={["30%", "15%"]}
                // h="15%"
                flexDirection={"column"}
                gap={4}
                right={isFooterInView ? 8 : 8}
                bottom={!isFooterInView ? 8 : 8}
                pos={!isFooterInView ? "fixed" : "absolute"}
                zIndex={102}
                justifyContent={"center"}
                alignItems={!isFooterInView ? "center" : "flex-end"}
            >
                <Button
                    variant="none"
                    w={["100%", "80%"]}
                    // px={8}
                    bg={"white"}
                    color={"primary_1"}
                    borderColor={"primary_1!important"}
                    border={"2px"}
                    onClick={onSave}
                >
                    Save
                </Button>

                <Button
                    variant="none"
                    w={["100%", "80%"]}
                    // px={8}
                    bg={"white"}
                    color={"primary_1"}
                    borderColor={"primary_1!important"}
                    border={"2px"}
                    onClick={onComplete}
                >
                    Publish
                </Button>

            </Flex>
        )

    )
}

export default ActionItemPostcardDeck