import {
    Box,
    Button,
    Flex,
    Image,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // For validation
import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion"; // Import motion
import {
    addToWaitList,
    checkUserAvailability,
    slugify
} from "../../services/utilities";
import AppContext from "../AppContext";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";

// Motion components for overlay and modal
const MotionOverlay = motion(ModalOverlay);
const MotionContent = motion(ModalContent);

const SignUpInModal = ({ isShow, mode, setShowModal, setShowSignModal, isClosable = true }) => {
    const { callAuthService } = useContext(AppContext);

    // Validation schema for Formik
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required")
    });

    const signIn = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setShowModal((prev) => ({ ...prev, isShow: false }));
            callAuthService("google", tokenResponse.access_token, false);
        },
        onError: () => {
            console.error("Login Failed");
        }
    });

    // Handle form submission
    const handleSubmit = (values, { resetForm }) => {
        if (mode === "signup") {
            addToWaitList(values.email, {
                email: values.email,
                password: "test123",
                username: values.email,
                slug: slugify(values.email),
                user_type: 1
            }).then((resp) => {
                setShowModal((prev) => ({ ...prev, isShow: false }));
                setShowSignModal((prev) => ({
                    ...prev,
                    isShow: true,
                    title: resp.title,
                    message: resp.message
                }));
            });
        } else {
            let data = { email: values.email };
            checkUserAvailability(values.email, data).then((response) => {
                if (response.toggle) {
                    setShowModal((prev) => ({ ...prev, mode: "signup" }));
                    resetForm();
                    return;
                }
                setShowModal((prev) => ({ ...prev, isShow: false }));
                setShowSignModal({
                    isShow: true,
                    title: response.title,
                    message: response.message
                });
            });
        }
    };

    return (
        <Modal
            isOpen={isShow}
            size={["xs", "lg"]}
            bgColor={"#EFE9E4"}
            isCentered
            onClose={isClosable ? () => setShowModal((prev) => ({ ...prev, isShow: false })) : undefined}
        >
            <MotionOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            <MotionContent
                borderRadius={["15px", "30px"]}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                maxW={["xs", "lg"]}
                h={["60vh", "auto"]}
            >
                {isClosable && <ModalCloseButton />}
                <ModalBody
                    as={Flex}
                    flexDirection={"column"}
                    // alignItems={"center"}
                    justifyContent={"space-between"}
                    px={["25px", "50px"]}
                    py={["28px", "56px"]}
                    gap={["15px", "22px"]}
                >
                    <ChakraNextImage
                        src={"/assets/postcard-logo-blue.png"}
                        width={["80px", "100px"]}
                        height={["80px", "100px"]}
                        alt={"Postcard Logo"}
                        ml={"auto"}
                    />
                    <Flex
                        width={"100%"}
                        color={"primary_3"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    // mt={20}
                    >

                        <Box>
                            <Text
                                fontSize={["22px", "27px"]}
                                lineHeight={["28px", "32px"]}
                                fontFamily={"raleway"}
                                fontWeight={500}
                            >
                                {/* {mode === "signup"
                                    ? "Continue exploring the"
                                    : "Welcome back to"} */}
                                Continue exploring
                            </Text>
                            <Text
                                fontSize={["22px", "29px"]}
                                fontFamily={"lora"}
                                fontStyle={"italic"}
                                fontWeight={500}
                                lineHeight={["21px", "37px"]}
                            >
                                Postcard Travel Club
                            </Text>
                        </Box>

                    </Flex>

                    <Box
                        bgColor={"primary_3"}
                        height={["1px", "2px"]}
                        width={"100%"}
                        mt={["0px", "4px"]}
                        mb={["4.5px", "9px"]}
                    ></Box>

                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isValid, dirty }) => (
                            <Form>
                                <Field name="email">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            bg={"#D3CECA"}
                                            placeholder="Email"
                                            _placeholder={{
                                                fontFamily: "raleway",
                                                fontWeight: 500,
                                                fontSize: ["16px", "21px"],
                                                lineHeight: ["22px", "27px"],
                                                color: "#646260"
                                            }}
                                            height={["30px", "50px"]}
                                        />
                                    )}
                                </Field>
                                {errors.email && touched.email && (
                                    <Text color="red" ml={1}>
                                        {errors.email}
                                    </Text>
                                )}

                                <Button
                                    borderRadius={"40px"}
                                    height={["30px", "50px"]}
                                    w={["200px", "300px"]}
                                    bg={"primary_1"}
                                    mt={4}
                                    type="submit"
                                    isDisabled={!isValid || !dirty}
                                    _disabled={{ bg: "#EB836E" }}
                                    _hover={{
                                        bg:
                                            !isValid || !dirty
                                                ? "#EB836E"
                                                : "primary_1"
                                    }}
                                >
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={["13px", "21px"]}
                                        lineHeight={["19px", "27px"]}
                                        color={"#EFE9E4"}
                                    >
                                        {/* {mode === "signup"
                                            ? "Use Email To Sign Up"
                                            : "Use Email To Log In"} */}
                                        Sign in with email
                                    </Text>
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <Button
                        borderRadius={"40px"}
                        height={["30px", "50px"]}
                        w={["200px", "300px"]}
                        onClick={() => signIn()}
                    >
                        <Text
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["13px", "21px"]}
                            lineHeight={["19px", "27px"]}
                        >
                            {/* {mode === "signup"
                                ? "Sign up with Google"
                                : "Log in with Google"} */}
                            Sign in with Google
                        </Text>
                    </Button>

                    <Flex mt={["16px", "21px"]} gap={["6px", "11px"]}>
                        <Text
                            as={Link}
                            href={"/terms-conditions"}
                            textDecoration={"underline"}
                            fontFamily={"raleway"}
                            fontWeight={500}
                            fontSize={["13px", "21px"]}
                            lineHeight={["19px", "27px"]}
                            color={"primary_3"}
                        >
                            {/* {mode === "signup"
                                ? "Already a Member?"
                                : "Not a Member?"} */}
                            Terms & Conditions
                        </Text>
                        {/* <Text
                            fontFamily={"raleway"}
                            fontWeight={500}
                            fontSize={["13px", "21px"]}
                            lineHeight={["19px", "27px"]}
                            color={"primary_1"}
                            textDecoration={"underline"}
                            cursor="pointer"
                            onClick={() => {
                                setShowModal((prev) => ({
                                    ...prev,
                                    mode:
                                        mode === "signup" ? "signin" : "signup"
                                }));
                            }}
                        >
                            {mode === "signup"
                                ? "Sign In Here!"
                                : "Sign Up Here!"}
                        </Text> */}
                    </Flex>
                </ModalBody>
            </MotionContent>
        </Modal>
    );
};

export default SignUpInModal;
