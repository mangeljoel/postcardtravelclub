import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Icon, Tooltip } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

const FloatingAddButton = ({ onClick, isVisible = true, containerRef, type = "memory", blocking = false }) => {
    const [showButton, setShowButton] = useState(false);
    const [isInSection, setIsInSection] = useState(false);
    const lastScrollY = useRef(0);
    const justEnteredSection = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef?.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const currentScrollY = window.scrollY;

            // Check if inside section (with expanded detection area from bottom)
            const bottomBuffer = 500; // pixels buffer below section for easier detection
            const inSection = containerRect.top < viewportHeight && containerRect.bottom > -bottomBuffer;

            // Detect section entry
            if (inSection && !isInSection) {
                justEnteredSection.current = true;
                setShowButton(true);
            }

            setIsInSection(inSection);

            if (inSection) {
                // If just entered section, show button regardless of scroll direction
                if (justEnteredSection.current) {
                    setShowButton(true);
                    justEnteredSection.current = false;
                } else {
                    // Within section: show on scroll up, hide on scroll down
                    if (currentScrollY < lastScrollY.current) {
                        // Scrolling up → show
                        setShowButton(true);
                    } else if (currentScrollY > lastScrollY.current) {
                        // Scrolling down → hide
                        setShowButton(false);
                    }
                }
            } else {
                // Outside section → hide
                setShowButton(false);
                justEnteredSection.current = false;
            }

            lastScrollY.current = currentScrollY;
        };

        lastScrollY.current = window.scrollY;
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [containerRef, isInSection]);

    if (!isVisible || !isInSection || !containerRef?.current) return null;

    return (
        <Tooltip
            label={
                type === "memory"
                    ? "Create New Memory"
                    : type === "shopping"
                        ? "Add New Shop"
                        : type === "restaurant"
                            ? "Add New Restaurant"
                            : type === "events"
                                ? "Add New Event"
                                : "Add New Item"
            }
            placement="left"
            hasArrow
            bg="gray.700"
            color="white"
        >
            <Box
                position="fixed"
                right={["10px", "30px", "40px"]}
                bottom={blocking ? ["25vw", "25vw", "8vw"] : ["5vw", "5vw", "3vw"]}
                zIndex={1000}
                cursor="pointer"
                opacity={showButton ? 1 : 0}
                transform={
                    showButton ? "scale(1) translateY(0)" : "scale(0.8) translateY(10px)"
                }
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                pointerEvents={showButton ? "auto" : "none"}
            >
                <IconButton
                    icon={<Icon as={FaPlus} w="24px" h="24px" />}
                    size="lg"
                    isRound
                    bg="linear-gradient(135deg, #EA6146 0%, #EB836E 100%)"
                    color="white"
                    w={["60px", "65px", "70px"]}
                    h={["60px", "65px", "70px"]}
                    fontSize="24px"
                    boxShadow="0 8px 25px rgba(234, 97, 70, 0.4)"
                    border="3px solid white"
                    _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "0 12px 35px rgba(234, 97, 70, 0.6)",
                        bg: "linear-gradient(135deg, #E94E2A 0%, #EA6146 100%)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="all 0.2s ease"
                    onClick={onClick}
                    aria-label="floating-add-button"
                />
            </Box>
        </Tooltip>
    );
};

export default FloatingAddButton;