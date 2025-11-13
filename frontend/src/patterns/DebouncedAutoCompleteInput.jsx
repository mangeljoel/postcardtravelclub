import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    VStack,
    Flex,
    Button,
    Icon,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MdOutlineLocationOn } from 'react-icons/md';
import { BiHotel } from 'react-icons/bi';
import { FiTag } from "react-icons/fi";

const DebouncedAutoCompleteInput = ({
    inputValue,
    handleInputChange,
    resetInput,
    autoCompleteItems,
    loading,
    handleAutoCompleteSelect,
    loadMoreItems,
    hasMore,
    placeholder = "Search by country, region or interest",
    type = "default",
    onSearch,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const popoverRef = useRef(null);

    // Map types to icons
    const iconMap = {
        country: <MdOutlineLocationOn size={20} color={"#EA6146"} />,
        region: <MdOutlineLocationOn size={20} color={"#EA6146"} />,
        album: <BiHotel size={20} color={"#EA6146"} />,
        tag: <FiTag size={20} color={"#EA6146"} />,
        default: <SearchIcon boxSize={5} color={"#EA6146"} />,
    };

    const typePriority = {
        region: 1,
        country: 2,
        default: 3,
    };

    const uniqueItems = [...(autoCompleteItems || [])].reduce((acc, current) => {
        const displayText = current.text || current.name;
        const isDuplicate = acc.find(
            item => (item.text || item.name) === displayText && item.type === current.type
        );
        if (!isDuplicate) {
            acc.push({ ...current, text: displayText });
        }
        return acc;
    }, []);

    const sortedItems = uniqueItems.sort((a, b) => {
        const priorityA = typePriority[a.type] || typePriority.default;
        const priorityB = typePriority[b.type] || typePriority.default;

        if (priorityA === priorityB) {
            return a.text.localeCompare(b.text);
        }
        return priorityA - priorityB;
    });

    const extractRegionName = (item, itemType) => {
        const text = item.text || item.name || item;
        if (itemType === 'region' && text.includes('(')) {
            return text.substring(0, text.indexOf('(')).trim();
        }
        return text;
    };

    // Load suggestions when the input/popover becomes active OR when input changes (with debounce)
    useEffect(() => {
        if (isOpen && typeof loadMoreItems === 'function') {
            const timeoutId = setTimeout(() => {
                loadMoreItems();
            }, 300); // 300ms debounce

            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, inputValue]);

    // Reset input
    const resetInputBox = () => {
        resetInput();
        setIsOpen(false);
    };

    // Handle search button click
    const handleSearch = () => {
        if (onSearch) {
            onSearch(inputValue);
        }
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     if (!isOpen || !inputRef.current) return;

    //     const isMobile = window.innerWidth < 768;
    //     if (!isMobile) return;


    //     const id = setTimeout(() => {
    //         const rect = inputRef.current.getBoundingClientRect();
    //         const inputTop = rect.top + window.scrollY - 20;
    //         window.scrollTo({
    //             top: Math.max(0, inputTop),
    //             behavior: "smooth",
    //         });
    //     }, 80);

    //     return () => clearTimeout(id);
    // }, [isOpen]);



    useEffect(() => {
        // Keep behavior of collapsing results to top on new list
        const scrollableDiv = document.getElementById("scrollableDiv");
        if (scrollableDiv) {
            scrollableDiv.scrollTop = 0;
        }
    }, [autoCompleteItems]);

    // Render hero-style input
    if (type === "hero") {
        return (
            <Box position="relative" width={["80%", "100%"]} maxW={["400px", "600px"]} mx="auto" zIndex={20}>
                <Popover isOpen={isOpen}
                    initialFocusRef={inputRef}
                    placement="bottom-start"
                    strategy="absolute"
                    flip={false}
                    matchWidth
                >
                    <PopoverTrigger>
                        <InputGroup size="lg" w="full">
                            {/* Mobile: Search icon on left */}
                            <InputLeftElement
                                display={{ base: "flex", md: "none" }}
                                pointerEvents="none"
                                h="100%"
                            >
                                <SearchIcon color="gray.400" />
                            </InputLeftElement>

                            <Input
                                ref={inputRef}
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={handleInputChange}
                                onFocus={() => setIsOpen(true)}
                                bg="white"
                                color="gray.700"
                                fontSize={["16px", "md"]}
                                height={["40px", "50px"]}
                                borderRadius="full"
                                pl={[12, 6]}
                                // pr={[0, "10px"]}
                                pr="0!important"
                                _placeholder={[{ color: 'gray.400', fontSize: "12px" }]}
                                _hover={{ bg: 'white' }}
                                _focus={{
                                    bg: 'white',
                                    boxShadow: '0 0 0 1px rgba(159, 122, 234, 0.6)',
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />

                            {/* Mobile: Close icon when there's input */}
                            {inputValue && (
                                <InputRightElement
                                    h="100%"
                                    m="auto"
                                    cursor="pointer"
                                    onClick={resetInputBox}
                                    color="gray.400"
                                    display={{ base: "flex", md: "none" }}
                                >
                                    <IoIosClose size={24} />
                                </InputRightElement>
                            )}

                            {/* Desktop: Search button */}
                            <Button
                                display={{ base: "none", md: "inline-flex" }}
                                position="absolute"
                                right="4px"
                                top="50%"
                                transform="translateY(-50%)"
                                colorScheme="purple"
                                size="md"
                                borderRadius="full"
                                height="42px"
                                px={4}
                                onClick={handleSearch}
                                transition="all 0.3s"
                                fontSize="sm"
                            >
                                Try Postcard Search
                            </Button>
                        </InputGroup>
                    </PopoverTrigger>

                    {isOpen && (
                        <PopoverContent
                            ref={popoverRef}
                            borderRadius="20px"
                            border="2px"
                            borderColor="white"
                            w="full"
                            bg="rgba(255, 255, 255, 0.95)"
                            backdropFilter="blur(10px)"
                            minW={["90%", "100%"]}
                            py={3}
                            mt={2}
                        >
                            <PopoverBody py={0} overflowY="auto" w="full">
                                <Box id="scrollableDiv-hero" maxHeight="350px" overflowY="auto">
                                    <InfiniteScroll
                                        dataLength={autoCompleteItems?.length || 0}
                                        next={loadMoreItems}
                                        hasMore={hasMore}
                                        scrollableTarget="scrollableDiv-hero"
                                    >
                                        <VStack align="stretch" spacing={1} width="full">
                                            {sortedItems.length > 0 ? (
                                                sortedItems.map((option, index) => (
                                                    <Flex
                                                        key={index}
                                                        align="center"
                                                        px={3}
                                                        py={2}
                                                        cursor="pointer"
                                                        _hover={{ bg: "#EDB6A9" }}
                                                        onClick={() => {
                                                            const selectedText = extractRegionName(option.text, option.type);
                                                            handleAutoCompleteSelect(selectedText);
                                                            setIsOpen(false);
                                                        }}
                                                        borderRadius={8}
                                                        gap={2}
                                                    >
                                                        {iconMap[option.type] || iconMap.default}
                                                        <Text textTransform="capitalize" fontFamily="raleway" textAlign="left">
                                                            {option.text || option.name}
                                                        </Text>
                                                    </Flex>
                                                ))
                                            ) : inputValue ? (
                                                <Text
                                                    px={3}
                                                    py={2}
                                                    color="gray.500"
                                                    fontFamily="raleway"
                                                    textAlign="left"
                                                >
                                                    No results found
                                                </Text>
                                            ) : null}
                                        </VStack>
                                    </InfiniteScroll>
                                </Box>
                            </PopoverBody>
                        </PopoverContent>
                    )}
                </Popover>
            </Box>
        );
    }

    // Default style input (original)
    return (
        <Box position="relative" width={["full", "50%"]} mx="auto" mb={10} zIndex={20}>
            <Popover isOpen={isOpen} initialFocusRef={inputRef} placement="bottom" matchWidth>
                <PopoverTrigger>
                    <InputGroup h={["9.167vw", "3.472vw"]} w="full">
                        {/* Mobile: Search icon only */}
                        <InputLeftElement h="100%" pointerEvents="none" display={{ base: "flex", md: "none" }}>
                            <SearchIcon m="auto" color="gray.400" />
                        </InputLeftElement>

                        <Input
                            ref={inputRef}
                            h="100%"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setIsOpen(true)}
                            bg="white"
                            color="gray.700"
                            borderRadius="20px"
                            _focusVisible={{ outline: "none" }}
                            placeholder={placeholder}
                            fontFamily="lora"
                            fontStyle="italic"
                            pl={[12, 6]}
                            // pr={[12, "160px"]}
                            _placeholder={{ color: 'gray.400' }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    inputRef.current.blur();
                                    handleAutoCompleteSelect(inputValue);
                                    setIsOpen(false);
                                }
                            }}
                        />

                        {/* Mobile: Close icon when there's input */}
                        {inputValue && (
                            <InputRightElement
                                h="100%"
                                m="auto"
                                cursor="pointer"
                                onClick={resetInputBox}
                                color="gray.400"
                                display={{ base: "flex", md: "none" }}
                            >
                                <IoIosClose w={10} m="auto" size="md" />
                            </InputRightElement>
                        )}

                        {/* Desktop: Try Postcard Search button */}
                        {/* <InputRightElement display={{ base: "none", md: "flex" }} h="100%" pr={2} w="auto">
                            <Button
                                size="sm"
                                onClick={handleSearch}
                                borderRadius="md"
                                px={4}
                            >
                                Try Postcard Search
                            </Button>
                        </InputRightElement> */}
                    </InputGroup>
                </PopoverTrigger>

                {isOpen && (
                    <PopoverContent
                        ref={popoverRef}
                        borderRadius="20px"
                        border={["1px", "2px"]}
                        borderColor="primary_1!important"
                        w="full"
                        bg="white"
                        minW={["88vw", "100%"]}
                        py={3}
                        matchWidth
                    >
                        <PopoverBody py={0} overflowY="auto" w={"full"} zIndex={22}>
                            <Box id="scrollableDiv" maxHeight="350px" overflowY="auto">
                                <InfiniteScroll
                                    dataLength={autoCompleteItems?.length || 0}
                                    next={loadMoreItems}
                                    hasMore={hasMore}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <VStack align="stretch" spacing={1} width="full">
                                        {sortedItems.length > 0 ? (
                                            sortedItems.map((option, index) => (
                                                <Flex
                                                    key={index}
                                                    align="center"
                                                    px={3}
                                                    py={2}
                                                    cursor="pointer"
                                                    _hover={{ bg: "#EDB6A9" }}
                                                    onClick={() => {
                                                        const selectedText = extractRegionName(option.text, option.type);
                                                        handleAutoCompleteSelect(selectedText);
                                                        setIsOpen(false);
                                                    }}
                                                    borderRadius={8}
                                                    gap={2}
                                                >
                                                    {iconMap[option.type] || iconMap.default}
                                                    <Text
                                                        textTransform="capitalize"
                                                        fontFamily="raleway"
                                                        textAlign="left"
                                                    >
                                                        {option.text}
                                                    </Text>
                                                </Flex>
                                            ))
                                        ) : inputValue ? (
                                            <Text
                                                px={3}
                                                py={2}
                                                color="gray.500"
                                                fontFamily="raleway"
                                                textAlign="left"
                                            >
                                                No results found
                                            </Text>
                                        ) : null}
                                    </VStack>
                                </InfiniteScroll>
                            </Box>
                        </PopoverBody>
                    </PopoverContent>
                )}
            </Popover>
        </Box>
    );
};

export default DebouncedAutoCompleteInput;