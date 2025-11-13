import { Flex, Input, Box, Button, Text } from "@chakra-ui/react";
import { useState, useContext } from "react";
import AppContext from "../../features/AppContext";
import LogInButtons from "../LogInButtons";
import { addToWaitList, slugify } from "../../services/utilities";
const EmailLogIn = () => {
    const [email, setEmail] = useState("");
    const { profile } = useContext(AppContext);
    const valideRegEx = /^\S+@\S+\.\S+$/;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return isLoggedIn ? (
        <Text
            borderColor="white"
            width={["100%", "80%"]}
            py="0.5em"
            mx="auto"
            fontSize={["1rem", "1.2rem"]}
            //borderRadius="20px"
            borderWidth="4px"
        >
            You Are In! Check your email and login.
        </Text>
    ) : (
        <Box
            my="1em"
            width="100%"
            mx="auto"
            display={profile ? "none" : "block"}
        >
            <Flex gap={2} justify={"center"}>
                <Box width="60%">
                    <Input
                        bg="white"
                        type="email"
                        color="black"
                        fontSize={["1rem", "1.2rem"]}
                        placeholder="Enter your Email"
                        borderColor="white"
                        // __focus={{ borderColor="white"}}
                        defaultValue={email}
                        onChange={(e) => {
                            // validateEmail(e.target.value);
                            setEmail(e.target.value);
                        }}
                    />

                    <Text mt="0.3em" color="white">
                        {email.length >= 1 && !email.match(valideRegEx)
                            ? "Enter a valid email id"
                            : ""}
                    </Text>
                </Box>
                <Button
                    onClick={() => {
                        if (email.length >= 1 && email.match(valideRegEx))
                            addToWaitList(email, {
                                email: email,
                                password: "test123",
                                username: email,
                                slug: slugify(email),
                                user_type: 1
                            }).then((resp) => {
                                setIsLoggedIn(true);
                            });
                    }}
                >
                    Sign Up
                </Button>
            </Flex>
            <LogInButtons
                mode="login"
                component={
                    <Text
                        mx="auto"
                        my="1em"
                        fontWeight={[600, 600]}
                        fontSize={["4vw", "1.2vw"]}
                        //w={["100%", "66%"]}
                        px="0.5em"
                        cursor="pointer"
                        // textAlign={"justify"}
                        // textShadow="1px 0px #000000"
                        lineHeight={["1.4", "1.2"]}
                        //pb={[8, 16]}
                    >
                        Already a member? <u>Sign In</u>
                    </Text>
                }
            />
        </Box>
    );
};
export default EmailLogIn;
