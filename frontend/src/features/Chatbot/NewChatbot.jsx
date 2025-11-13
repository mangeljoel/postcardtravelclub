import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    Input,
    VStack,
    HStack,
    Link,
    Spinner,

} from '@chakra-ui/react';
import { keyframes } from "@emotion/react";
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

const BASE_URL = 'http://13.201.222.193:5000';

const NewChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [priority, setPriority] = useState('');
    const [priorityMessages, setPriorityMessages] = useState({});
    const [topLocations, setTopLocations] = useState([]);
    const [moreLocations, setMoreLocations] = useState([]);
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [topActivities, setTopActivities] = useState([]);
    const [moreActivities, setMoreActivities] = useState([]);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [topProperties, setTopProperties] = useState([]);
    const [moreProperties, setMoreProperties] = useState([]);
    const [showAllProperties, setShowAllProperties] = useState(false);
    const [followups, setFollowups] = useState([]);

    const messagesEndRef = useRef(null);
    const threadIdRef = useRef(crypto.randomUUID());
    const threadId = threadIdRef.current;

    useEffect(() => {
        const fetchWelcome = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/chat/startup-messages/welcome`);
                const msg = res.data.response;
                setMessages(prev => {
                    if (prev.length === 0 || !prev.some(m => m.text === msg)) {
                        return [...prev, { sender: "bot", text: msg }];
                    }
                    return prev;
                });
                scrollToBottom();
            } catch (err) {
                console.error("Error fetching welcome message:", err);
            }
        };

        fetchWelcome();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { sender: "user", text: input }]);
        scrollToBottom();
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/chat/${threadId}`, {
                query: input,
                priority_field: priority
            });

            setInput("");
            const botResponse = res.data.response || "No response from LLM.";
            const followupSuggestions = res.data.followups || [];
            setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
            setFollowups(Array.isArray(followupSuggestions) ? followupSuggestions : []);
            scrollToBottom();
        } catch (err) {
            console.error("❌ Error:", err);
            setMessages(prev => [...prev, { sender: "bot", text: "Error talking to backend." }]);
            setFollowups([]);
            scrollToBottom();
            setInput("");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // ✅ Trigger priority message on button click
    const handlePriorityClick = async (field) => {
        setPriority(field);
        try {
            const res = await axios.get(`${BASE_URL}/chat/startup-messages/${field}`);
            const msg = res.data.response;
            setMessages(prev => {
                if (prev.some(m => m.text === msg)) return prev; // prevent duplicates
                return [...prev, { sender: "bot", text: msg }];
            });
            scrollToBottom();

            if (field === "location" && res.data.top_locations) {
                setTopLocations(res.data.top_locations);
                setMoreLocations(res.data.more_locations || []);
                setShowAllLocations(false);
                setTopActivities([]);
                setTopProperties([]);
            } else if (field === "activities" && res.data.top_activities) {
                setTopActivities(res.data.top_activities);
                setMoreActivities(res.data.more_activities || []);
                setShowAllLocations(false);
                setTopLocations([]);
                setTopProperties([]);
            } else if (field === "properties" && res.data.top_properties) {
                setTopProperties(res.data.top_properties);
                setMoreProperties(res.data.more_properties || []);
                setShowAllLocations(false);
                setTopLocations([]);
                setTopActivities([]);
            }
        }
        catch (error) {
            console.error("Failed to fetch priority message:", error);
        }
    };
    const handleLocationSelect = async (location) => {
        setMessages(prev => [...prev, { sender: "user", text: location }]);
        scrollToBottom();
        setTopLocations([]);
        setMoreLocations([]);
        setShowAllLocations(false);
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/chat/${threadId}`, {
                query: location,
                priority_field: "location"
            });

            setMessages(prev => [...prev, { sender: "bot", text: res.data.response }]);
            scrollToBottom();
        } catch (err) {
            console.error("Error submitting location:", err);
            setMessages(prev => [...prev, { sender: "bot", text: "Failed to fetch results for this location." }]);
            scrollToBottom();
        } finally {
            setLoading(false);
        }
    };
    const handleSendFromButton = async (text) => {
        setMessages(prev => [...prev, { sender: "user", text }]);
        setLoading(true);

        try {
            const res = await axios.post(`${BASE_URL}/chat/${threadId}`, {
                query: text,
                priority_field: priority
            });
            setMessages(prev => [...prev, { sender: "bot", text: res.data.response }]);
            scrollToBottom();
        } catch (err) {
            console.error("❌ Error sending button text:", err);
            setMessages(prev => [...prev, { sender: "bot", text: "Error processing your selection." }]);
            scrollToBottom();
        } finally {
            setLoading(false);
        }
    };

    const handleFollowupClick = async (text) => {
        setMessages(prev => [...prev, { sender: "user", text }]);
        scrollToBottom();
        setLoading(true);

        try {
            const res = await axios.post(`http://localhost:5000/chat/${threadId}`, {
                query: text // ❌ No priority field here
            });

            const botResponse = res.data.response || "No response from LLM.";
            const followupSuggestions = res.data.followups || [];

            setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
            setFollowups(Array.isArray(followupSuggestions) ? followupSuggestions : []);  // 👈 update followups
            scrollToBottom();
        } catch (err) {
            console.error("❌ Error sending follow-up:", err);
            setMessages(prev => [...prev, { sender: "bot", text: "Error processing follow-up." }]);
            setFollowups([]); // Clear followups on error
            scrollToBottom();
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fadeInUp = keyframes`
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    `;

    const sharedButtonStyle = {
        m: '6px',
        px: '18px',
        py: '10px',
        borderRadius: '20px',
        bg: 'white',
        border: '1px solid #ddd1c1',
        color: '#5a4a3f',
        fontFamily: `'Georgia', serif`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        _hover: { bg: '#f9f6f2' },
        cursor: 'pointer'
    };

    const showMoreButtonStyle = {
        ...sharedButtonStyle,
        border: '1px dashed #b69b7f',
        fontStyle: 'italic',
    };

    return (
        <Box fontFamily="Georgia, serif">
            {/* Main Content */}
            <Flex justify="center" align="center" h="85vh" px={4}>
                <Flex w="95%" h="92%" borderRadius="16px" bg="#f9f4ef" boxShadow="0 10px 30px rgba(0,0,0,0.1)" overflow="hidden">
                    {/* Chat Area */}
                    <Flex flex={3} direction="column" p="10px">
                        <Text fontSize="2rem" fontWeight="600" color="#5a4a3f" textAlign="center" mb="18px">
                            Postcard Travel Chatbot 🌍
                        </Text>

                        <Box
                            flex={1}
                            bg="#f5ebe0"
                            borderRadius="12px"
                            p="10px"
                            overflowY="auto"
                            border="1px solid #e0d6c5"
                            mb="20px"
                        >
                            {messages.map((msg, idx) => (
                                <Flex
                                    key={idx}
                                    justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                    align="flex-start"
                                    mb="12px"
                                >
                                    {msg.sender === 'bot' && (
                                        <Box
                                            w="40px"
                                            h="45px"
                                            borderRadius="55%"
                                            overflow="hidden"
                                            mx="15px"
                                            flexShrink={0}
                                        >
                                            <Image src="/assets/stamp_icon.png" alt="Bot" objectFit={"contain"} borderRadius="50%" />
                                        </Box>
                                    )}
                                    <Box
                                        bg={msg.sender === 'user' ? '#b69b7f' : '#fff6e5'}
                                        color={msg.sender === 'user' ? 'white' : '#5a4a3f'}
                                        p="14px 20px"
                                        borderRadius="20px"
                                        maxW="75%"
                                        fontSize="1rem"
                                        boxShadow="0 1px 4px rgba(0,0,0,0.05)"
                                    // dangerouslySetInnerHTML={{ __html: msg.text }}
                                    >
                                        <Markdown>{msg.text}</Markdown>
                                    </Box>

                                    {msg.sender === 'user' && (
                                        <Box
                                            w="40px"
                                            h="45px"
                                            borderRadius="55%"
                                            overflow="hidden"
                                            mx="15px"
                                            flexShrink={0}
                                        >
                                            <Image src="/assets/images/p_stamp.png" alt="You" borderRadius="50%" />
                                        </Box>
                                    )}
                                </Flex>
                            ))}

                            {loading && (
                                <Flex align="center" gap="8px" mt="12px">
                                    <Spinner size="sm" />
                                    <Text fontSize="sm" color="#8e7b6c" fontStyle="italic">⏳ Bot is typing...</Text>
                                </Flex>
                            )}

                            {followups.length > 0 && (
                                <Box mt="12px">
                                    <Text fontWeight="bold" color="#5a4a3f" fontFamily="Georgia, serif">
                                        {/* Optional heading here */}
                                    </Text>
                                    {followups.map((item, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => handleSendFromButton(item)}
                                            mt="6px"
                                            mr="6px"
                                            px="18px"
                                            py="10px"
                                            borderRadius="20px"
                                            bg="white"
                                            border="1px solid #ddd1c1"
                                            color="#5a4a3f"
                                            fontFamily="Georgia, serif"
                                            boxShadow="0 2px 6px rgba(0,0,0,0.04)"
                                            cursor="pointer"
                                            animation={`${fadeInUp} 0.4s ease ${idx * 0.1}s forwards`}
                                            opacity={0}
                                            _hover={{
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                transform: 'translateY(-2px)',
                                            }}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            {topLocations.length > 0 && (
                                <Box mt="12px">
                                    <Text fontWeight="bold" color="#5a4a3f" fontFamily="'Georgia', serif" mb="8px">
                                        ✨ Here are some destinations you can start exploring:
                                    </Text>
                                    {[...(showAllLocations ? [...topLocations, ...moreLocations] : topLocations)].map((loc, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => handleLocationSelect(loc)}
                                            {...sharedButtonStyle}
                                            animation={`${fadeInUp} 0.4s ease ${idx * 0.1}s forwards`}
                                            opacity={0}
                                        >
                                            {loc}
                                        </Button>
                                    ))}
                                    {!showAllLocations && moreLocations.length > 0 && (
                                        <Button onClick={() => setShowAllLocations(true)} {...showMoreButtonStyle}>
                                            Show More
                                        </Button>
                                    )}
                                </Box>
                            )}

                            {topActivities.length > 0 && (
                                <Box mt="12px">
                                    <Text fontWeight="bold" color="#5a4a3f" fontFamily="'Georgia', serif" mb="8px">
                                        🌿 What kind of experiences interest you?
                                    </Text>
                                    {[...(showAllActivities ? [...topActivities, ...moreActivities] : topActivities)].map((activity, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => handleSendFromButton(activity)}
                                            {...sharedButtonStyle}
                                            animation={`${fadeInUp} 0.4s ease ${idx * 0.1}s forwards`}
                                            opacity={0}
                                        >
                                            {activity}
                                        </Button>
                                    ))}
                                    {!showAllActivities && moreActivities.length > 0 && (
                                        <Button onClick={() => setShowAllActivities(true)} {...showMoreButtonStyle}>
                                            Show More
                                        </Button>
                                    )}
                                </Box>
                            )}

                            {topProperties.length > 0 && (
                                <Box mt="12px">
                                    <Text fontWeight="bold" color="#5a4a3f" fontFamily="'Georgia', serif" mb="8px">
                                        🏨 What kind of stays are you curious about?
                                    </Text>
                                    {[...(showAllProperties ? [...topProperties, ...moreProperties] : topProperties)].map((prop, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => handleSendFromButton(prop)}
                                            {...sharedButtonStyle}
                                            animation={`${fadeInUp} 0.4s ease ${idx * 0.1}s forwards`}
                                            opacity={0}
                                        >
                                            {prop}
                                        </Button>
                                    ))}
                                    {!showAllProperties && moreProperties.length > 0 && (
                                        <Button onClick={() => setShowAllProperties(true)} {...showMoreButtonStyle}>
                                            Show More
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>

                        <Box ref={messagesEndRef} />

                        <Flex gap="10px" align="center">
                            <Input
                                flex={1}
                                p="14px 16px"
                                borderRadius="10px"
                                border="1px solid #c1b1a0"
                                fontSize="1rem"
                                bg="#fffaf2"
                                color="#4b3f36"
                                placeholder="Ask about properties, locations, experiences..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                bg="#b69b7f"
                                color="white"
                                border="none"
                                p="14px 20px"
                                borderRadius="10px"
                                fontWeight="bold"
                                onClick={handleSend}
                                isLoading={loading}
                            >
                                Send
                            </Button>
                        </Flex>
                    </Flex>

                    {/* Sidebar */}
                    <Box
                        flex={1}
                        borderLeft="1px solid #e0d6c5"
                        p="20px"
                        bg="#f5ebe0"
                        borderTopRightRadius="16px"
                        borderBottomRightRadius="16px"
                    >
                        <Text fontSize="1rem" fontWeight="bold" mb="8px" color="#5a4a3f">
                            Guide your journey by telling me what matters most:
                        </Text>
                        <Text fontSize="0.95rem" mb="12px" color="#7a6a58" lineHeight={1.5}>
                            Choose what you'd like me to prioritize first while planning your travel discovery —
                            whether you're drawn to stunning <Text as="strong">locations</Text>, soulful <Text as="strong">properties</Text>,
                            immersive <Text as="strong">experiences</Text>, or inspiring <Text as="strong">postcards</Text>.
                        </Text>

                        <VStack spacing="12px" align="stretch">
                            {["properties", "location", "postcards", "activities"].map((field) => (
                                <Button
                                    variant={"none"}
                                    _hover={{ bg: 'primary_1', color: 'white' }}
                                    key={field}
                                    onClick={() => handlePriorityClick(field)}
                                    p="10px 14px"
                                    borderRadius="8px"
                                    border="2px solid"
                                    fontWeight="bold"
                                    fontSize="0.95rem"
                                    w="100%"
                                    textAlign="left"
                                    bg={priority === field ? '#b69b7f' : '#fffaf2'}
                                    color={priority === field ? '#fff' : '#5a4a3f'}
                                    borderColor={priority === field ? '#b69b7f' : '#d3c0ab'}
                                    textTransform="capitalize"
                                    transition="all 0.2s ease-in-out"
                                    justifyContent="flex-start"
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </Button>
                            ))}
                        </VStack>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default NewChatbot;