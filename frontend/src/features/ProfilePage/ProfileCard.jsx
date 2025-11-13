import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue
} from "@chakra-ui/react";

export default function ProfileCard() {
    return (
        <Center py={6}>
            <Box
                maxW={"240px"}
                w={"full"}
                bg={useColorModeValue("white", "gray.800")}
                boxShadow={"2xl"}
                rounded={"md"}
                overflow={"hidden"}
            >
                {/* <Image
                    h={"120px"}
                    w={"full"}
                    src={
                        "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    }
                    objectFit={"cover"}
                /> */}
                <Flex justify={"center"} mt={4}>
                    <Avatar
                        width="100px"
                        height="100px"
                        src={
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                        }
                        alt={"Author"}
                        css={{
                            border: "2px solid white"
                        }}
                    />
                </Flex>

                <Box p={6} mx="auto" textAlign={"center"}>
                    <Stack spacing={2} align={"center"} mb={5}>
                        <Heading
                            fontSize={"md"}
                            fontWeight={500}
                            fontFamily={"body"}
                        >
                            John Doe
                        </Heading>
                        {/* <Text color={"gray.500"}>Frontend Developer</Text> */}
                        <Text fontSize={"xs"} textAlign={"center"} mt={5}>
                            Join a global membership community interested in
                            immersive travel experiences, self-growth and
                            personal transformation.
                        </Text>
                    </Stack>

                    <Stack direction={"row"} justify={"center"} spacing={6}>
                        <Stack spacing={0} align={"center"}>
                            <Text fontSize={"xs"} fontWeight={600}>
                                23
                            </Text>
                            <Text
                                fontSize={"xs"}
                                fontWeight={600}
                                color={"primary_3"}
                            >
                                Postcards
                            </Text>
                        </Stack>
                        <Stack spacing={0} align={"center"}>
                            <Text fontSize={"xs"} fontWeight={600}>
                                10
                            </Text>
                            <Text
                                fontSize={"xs"}
                                fontWeight={600}
                                color={"primary_3"}
                            >
                                Countries
                            </Text>
                        </Stack>
                    </Stack>

                    <Button
                        w={"auto"}
                        mt={6}
                        mx="auto"
                        height="35px"
                        // bg={useColorModeValue("#151f21", "gray.900")}
                        color={"white"}
                        rounded={"md"}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                        }}
                        fontSize={"sm"}
                    >
                        View Collection
                    </Button>
                </Box>
            </Box>
        </Center>
    );
}
