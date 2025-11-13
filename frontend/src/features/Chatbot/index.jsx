import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
    Icon,
    useColorModeValue,
    Container,
    Divider,
    FormControl,
    List,
    ListItem,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { FiGlobe, FiMessageSquare, FiMic, FiPaperclip, FiPlus, FiSend } from 'react-icons/fi';
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search2Icon } from '@chakra-ui/icons';
import { MdOutlineClose } from 'react-icons/md';

// const API_PATH = "http://192.168.1.36:8000"
// const API_PATH = "http://localhost:5001"
const API_PATH = "http://13.201.222.193:5001"
// const API_PATH = "https://342b-49-36-11-123.ngrok-free.app"
const index = () => {
    const [chats, setChats] = useState([]);

    const [selectedChat, setSelectedChat] = useState(null);
    const [hoveredChat, setHoveredChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [priority, setPriority] = useState("location")

    const chatEndRef = useRef(null);


    // Color mode values
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');
    const selectedBg = useColorModeValue('gray.100', 'gray.700');

    const startNewChat = async () => {
        // const response = await axios.get(`${API_PATH}/generate_thread`);
        // if (response.data) {
        //     const newChat = {
        //         thread_id: response.data.thread_id,
        //         title: `New Chat ${chats.length + 1}`,
        //         timestamp: 'Just now'
        //     };
        //     setChats([newChat, ...chats]);
        //     setSelectedChat(newChat.thread_id);
        //     setMessages([]);
        //     setFollowUps([])
        //     setFaqs([]); // reset previous FAQ if any
        //     fetchFaqs(); // fetch new FAQs
        // }
        setSelectedChat(null)
        setMessages([])
    };

    const fetchFaqs = async () => {
        try {
            const response = await axios.get(`${API_PATH}/faq`);
            console.log(response.data)
            if (response?.data?.response) {
                setFaqs(response.data.response);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    const getChats = async () => {
        const response = await axios.get(`${API_PATH}/chat/threads`);
        console.log(response)
        if (response?.data) {
            setChats(response.data?.thread_ids || []);
        }
    }

    const onSelectChat = async (thread_id) => {
        setSelectedChat(thread_id);
        setMessages([]);
        const response = await axios.get(`${API_PATH}/chat/threads/${thread_id}`);
        if (response.data) {
            setMessages(response.data.messages || []);
        }
    }

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        if (!selectedChat) setSelectedChat(`temp-${Date.now()}`);

        try {
            // First, add the user message
            setMessages((prev) => [
                {
                    user_message: text,
                    bot_response: "", // Empty bot response for now
                    timestamp: new Date().toISOString(),
                },
                ...prev,
            ]);

            setInput("");
            setIsTyping(true);  // Show typing indicator for bot

            // Send the user query to the backend
            const response = await axios.post(`${API_PATH}/chat/${selectedChat ? selectedChat : ""}`, {
                query: text,
                priority_field: priority,
            });

            if (response.data) {
                const botMessage = response?.data?.response;

                // Once the response is received, update the message with the bot's response
                setSelectedChat(response?.data?.chat_id)
                setChats((prev) => [response?.data?.chat_id, ...prev])
                setMessages((prev) => {
                    // Find the last user message and update it with the bot's response
                    const updatedMessages = prev.map((msg) =>
                        msg.user_message === text && !msg.bot_response
                            ? { ...msg, bot_response: botMessage }
                            : msg
                    );
                    return updatedMessages;
                });

                setIsTyping(false); // Hide typing indicator
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setIsTyping(false); // Hide typing indicator in case of error
        }
    };

    const TypingAnimation = () => {
        return (
            <Box display="flex" gap="4px" >
                {[...Array(3)].map((_, i) => (
                    <Box
                        key={i}
                        w="10px"
                        h="10px"
                        bg="gray.500"
                        borderRadius="full"
                        animation={`typingAnimation 1.4s infinite ease-in-out ${i * 0.2}s`}
                    />
                ))}
                <style>
                    {`
          @keyframes typingAnimation {
            0%, 80%, 100% { opacity: 0; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}
                </style>
            </Box>
        );
    };

    useEffect(() => {
        getChats()
        // fetchFaqs();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Flex h="100vh" >
            {/* Sidebar */}
            <Flex
                w="64"
                // bg={"#D3CECA"}
                bg={"#B8B3AF"}
                // borderRightRadius={["4.167vw", "2.08vw"]}
                flexDirection="column"
            >
                <Box p={4}>
                    <Button
                        onClick={startNewChat}
                        width="full"
                        leftIcon={<Icon as={FiPlus} />}
                        bg={"primary_1"}
                        fontFamily={"raleway"}
                    >
                        New Chat
                    </Button>
                </Box>

                <VStack
                    spacing={2}
                    flex="1"
                    overflowY="auto"
                    px={4}
                >
                    {chats.map((chat, index) => (
                        <Flex w={"100%"} align="center" gap={3} px={4} py={2} color={"black"} _hover={{ bg: "#494746", color: "white" }} borderRadius={"lg"}
                            onClick={() => onSelectChat(chat)}
                        >
                            <Icon as={FiMessageSquare} />
                            <Box flex="1" minW={0}>
                                <Text fontWeight="medium" isTruncated>
                                    {"Chat " + (index + 1)}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </VStack>
            </Flex>

            {/* Main Chat Area */}
            <Flex flex="1" direction="column" bg={"#EFE9E4"}>
                {selectedChat ? (
                    <>
                        {/* Chat Messages Area */}
                        <Flex bg={"primary_3"} h={16} align="center" px={4}>
                            <Text fontFamily={"lora"} fontStyle={"italic"} fontSize={20} color={"white"}>Postcard AI Chatbot</Text>
                        </Flex>
                        <Box flex="1" p={6} overflowY="auto">
                            <Flex w={"100%"} mt={4} px={12} flexDirection={"column-reverse"}>
                                <div ref={chatEndRef} />
                                {isTyping && <TypingAnimation />}

                                {/* {messages.length === 0 && faqs.length > 0 ? (
                                    <VStack align="start" spacing={3} mb={6}>
                                        <Text fontWeight="bold" color="gray.300">Frequently Asked Questions:</Text>
                                        {faqs.map((faq, idx) => (
                                            <Text
                                                key={idx}
                                                variant="ghost"
                                                color={"primary_3"}
                                                borderRadius={"md"}
                                                onClick={() => { console.log(faq); handleSendMessage(faq); }}
                                                fontWeight="normal"
                                                fontFamily={"raleway"}
                                                justifyContent="flex-start"
                                                whiteSpace="normal"
                                                textAlign="left"
                                                p={2}
                                                _hover={{ bg: "gray.300", color: "#111111" }}
                                            >
                                                {faq}
                                            </Text>
                                        ))}
                                    </VStack>
                                ) : null} */}

                                {/* {!isTyping && followUps && followUps.length > 0 && (
                                    <Flex direction={"column"} align="flex-start" mt={2} gap={2}>
                                        <Text color={"white"} fontFamily={"lora"} fontStyle={"italic"} fontSize={"xl"}>Follow Up Questions</Text>
                                        <Flex flexWrap={"wrap"} gap={2}>
                                            {followUps.map((question, i) => (
                                                <Text
                                                    key={i}
                                                    // size="sm"
                                                    // variant="ghost"
                                                    // colorScheme="blue"
                                                    w={"48%"}
                                                    bg={"gray.500"}
                                                    color={"white"}
                                                    onClick={() => handleSendMessage(question)}
                                                    borderRadius={"md"}
                                                    fontWeight="normal"
                                                    fontFamily={"lora"}
                                                    justifyContent="flex-start"
                                                    whiteSpace="normal"
                                                    textAlign="left"
                                                    p={4}
                                                    _hover={{ bg: "gray.600" }}
                                                >
                                                    {question}
                                                </Text>
                                            ))}
                                        </Flex>
                                    </Flex>
                                )} */}

                                {messages?.map((message, index) => (
                                    <React.Fragment key={index}>
                                        {/* Bot Response */}
                                        {message.bot_response && <Flex mb={3} justify="flex-start">
                                            <Box
                                                bg="blue.500"
                                                color="white"
                                                px={4}
                                                py={2}
                                                borderRadius="md"
                                                maxW="60%"
                                                fontFamily="raleway"
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        ul: ({ node, ...props }) => <List styleType="disc" pl={4} {...props} />,
                                                        ol: ({ node, ...props }) => <List styleType="decimal" pl={4} {...props} />,
                                                        li: ({ node, ...props }) => <ListItem {...props} />,
                                                    }}
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {message.bot_response}
                                                </ReactMarkdown>
                                            </Box>
                                        </Flex>}

                                        {/* User Message */}
                                        {message.user_message && <Flex mb={3} justify="flex-end">
                                            <Box
                                                bg="gray.700"
                                                color="white"
                                                px={4}
                                                py={2}
                                                borderRadius="md"
                                                maxW="60%"
                                                fontFamily="raleway"
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        ul: ({ node, ...props }) => <List styleType="disc" pl={4} {...props} />,
                                                        ol: ({ node, ...props }) => <List styleType="decimal" pl={4} {...props} />,
                                                        li: ({ node, ...props }) => <ListItem {...props} />,
                                                    }}
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {message.user_message}
                                                </ReactMarkdown>
                                            </Box>
                                        </Flex>}
                                    </React.Fragment>
                                ))}


                            </Flex>
                        </Box>

                        {/* Message Input */}
                        <Box borderTop="1px" borderColor={borderColor} p={4}>
                            <Container maxW="3xl">
                                <FormControl as="form" onSubmit={(e) => {
                                    e.preventDefault(); // Prevents page reload
                                    handleSendMessage(input);
                                }}>
                                    <Flex gap={4}>
                                        <Input
                                            placeholder="Type your message..."
                                            size="lg"
                                            bg="white"
                                            focusBorderColor="blue.500"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                        <Button
                                            bg="primary_1"
                                            color="white"
                                            size="lg"
                                            leftIcon={<Icon as={FiSend} />}
                                            type="submit" // Makes Enter key trigger submit
                                        >
                                            Send
                                        </Button>
                                    </Flex>
                                </FormControl>

                            </Container>
                        </Box>
                    </>
                ) : (
                    <Flex direction="column" justify="flex-end" h="100vh" px={4} py={16} gap={40}>
                        <Flex w={"100%"} align={"center"} flexDirection={"column"}>
                            <Text fontSize="3xl" fontFamily={"lora"} fontStyle={"italic"} fontWeight="semibold" mb={6} textAlign="center">
                                What do you want to know?
                            </Text>

                            <Box
                                w="full"
                                maxW="600px"
                                bg="white"
                                border="1px solid"
                                borderColor="gray.300"
                                borderRadius="lg"
                                boxShadow="md"
                                p={4}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(input);
                                    }}
                                >
                                    <InputGroup size="md">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask anything..."
                                            fontSize="md"
                                            border="none"
                                            _focus={{ boxShadow: "none" }}
                                            _placeholder={{ color: "gray.500" }}
                                        />

                                        <InputRightElement w="fit-content" gap={2} pr={2}>
                                            <IconButton
                                                type="submit"
                                                bg={"primary_1"}
                                                icon={<FiSend />}
                                                aria-label="send"
                                                size="sm"
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </form>
                            </Box>

                        </Flex>

                        <Flex justify={"center"} gap={12}>
                            <Box w={"20%"} bg={"#A7C1E3"} p={8} borderRadius={["4.167vw", "2.08vw"]} borderWidth={4}
                                borderColor={priority == "properties" && "#307FE2"}
                                onClick={() => setPriority("properties")}
                            >
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"raleway"}>
                                    300+
                                </Text>
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"lora"}>
                                    Properties
                                </Text>
                            </Box>

                            <Box w={"20%"} bg={"#A7C1E3"} p={8} borderRadius={["4.167vw", "2.08vw"]} borderWidth={4}
                                borderColor={priority == "postcards" && "#307FE2"}
                                onClick={() => setPriority("postcards")}
                            >
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"raleway"}>
                                    600+
                                </Text>
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"lora"}>
                                    Postcards
                                </Text>
                            </Box>

                            <Box w={"20%"} bg={"#A7C1E3"} p={8} borderRadius={["4.167vw", "2.08vw"]} borderWidth={4}
                                borderColor={priority == "location" && "#307FE2"}
                                onClick={() => setPriority("location")}
                            >
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"raleway"}>
                                    35+
                                </Text>
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"lora"}>
                                    Locations
                                </Text>
                            </Box>

                            <Box w={"20%"} bg={"#A7C1E3"} p={8} borderRadius={["4.167vw", "2.08vw"]} borderWidth={4}
                                borderColor={priority == "activities" && "#307FE2"}
                                onClick={() => setPriority("activities")}
                            >
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"raleway"}>
                                    500+
                                </Text>
                                <Text fontSize={"2xl"} fontWeight={"semibold"} fontFamily={"lora"}>
                                    Experiences
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                )}
            </Flex>

        </Flex>
    );
};

export default index;