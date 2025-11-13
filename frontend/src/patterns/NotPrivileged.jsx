import { Box, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
const NotPrivileged = ({ profile }) => {
    const router = useRouter();
    return (
        <Box mx="auto" textAlign={"center"}>
            <Heading my="5%">You are not privileged to view this page</Heading>
            <Button
                mb="2%"
                onClick={() => {
                    router.push("/");
                }}
            >
                Go to HomePage
            </Button>
        </Box>
    );
};
export default NotPrivileged;
