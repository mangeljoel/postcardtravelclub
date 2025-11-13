import React from "react";
import {
    Flex,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Box
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const DesktopItems = ({ NAV_ITEMS, fontcolor }) => {
    const router = useRouter();

    return (
        <Flex gap={6} alignItems="center">
            {NAV_ITEMS.map((item, index) => (
                item.children ? (
                    <Popover key={index} trigger="hover" placement="bottom-start">
                        <PopoverTrigger>
                            <Flex
                                alignItems="center"
                                cursor="pointer"
                                _hover={{ opacity: 0.7 }}
                            >
                                <Text
                                    color={fontcolor === "white" ? "white" : "primary_3"}
                                    fontFamily={"raleway"}
                                    fontSize={["8px", "15px", "18px", "21px"]}
                                    fontWeight={"semibold"}
                                >
                                    {item.label}
                                </Text>
                                <ChevronDownIcon
                                    color={fontcolor === "white" ? "white" : "primary_3"}
                                    ml={1}
                                />
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent
                            bg="white"
                            border="1px solid #E2E8F0"
                            borderRadius="8px"
                            boxShadow="lg"
                            p={2}
                            width="200px"
                        >
                            {item.children.map((child, childIndex) => (
                                <Box
                                    key={childIndex}
                                    p={3}
                                    cursor="pointer"
                                    borderRadius="4px"
                                    _hover={{ bg: "#F7FAFC" }}
                                    onClick={() => router.push(child.href)}
                                >
                                    <Text
                                        color="primary_3"
                                        fontFamily={"raleway"}
                                        fontSize={["8px", "15px", "18px", "21px"]}
                                        fontWeight={"medium"}
                                    >
                                        {child.label}
                                    </Text>
                                </Box>
                            ))}
                        </PopoverContent>
                    </Popover>
                ) : item.label && item.href ? (
                    <Text
                        key={index}
                        color={fontcolor === "white" ? "white" : "primary_3"}
                        fontFamily={"raleway"}
                        fontSize={["8px", "15px", "18px", "21px"]}
                        fontWeight={"semibold"}
                        cursor="pointer"
                        _hover={{ opacity: 0.7 }}
                        onClick={() => router.push(item.href)}
                    >
                        {item.label}
                    </Text>
                ) : null
            ))}
        </Flex>
    );
};

export default DesktopItems;