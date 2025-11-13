import { Box, Text, Stack, Link } from "@chakra-ui/react";

const DesktopSubItems = ({ label, href }) => {
    return (
        <Link href={href} role={"group"} display={"block"} p={1} rounded={"md"}>
            <Stack direction={"row"} align={"center"}>
                <Box>
                    <Text
                        color={"white"}
                        fontSize="14px"
                        fontFamily="raleway"
                        _hover={{
                            transform: `scale(1.1)`
                        }}
                        fontWeight="bold"
                    >
                        {label}
                    </Text>
                </Box>
            </Stack>
        </Link>
    );
};

export default DesktopSubItems;
