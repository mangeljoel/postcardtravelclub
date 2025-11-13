import React, { useState, useEffect, useRef } from 'react';
import {
    ChakraProvider, Box, Container, Heading, Text, Input, SimpleGrid, Image,
    InputGroup, Button, VStack, HStack, Icon, extendTheme, Center
} from '@chakra-ui/react';
import HeroSection from './HeroSection';
import CountriesSection from './CountriesSection';
import ThemesSection from './ThemesSection';
import InterestsSection from './InterestsSection';

const NewHomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const themesRef = useRef(null);
    const interestsRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === themesRef.current) {
                        setIsVisible(entry.isIntersecting);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (themesRef.current) {
            observer.observe(themesRef.current);
        }

        return () => {
            if (themesRef.current) {
                observer.unobserve(themesRef.current);
            }
        };
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    const countries = [
        { name: 'India', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80' },
        { name: 'Italy', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80' },
        { name: 'Iceland', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80' },
        { name: 'Peru', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80' },
        { name: 'Morocco', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80' },

    ];

    const interests = [
        { name: 'Hiking', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
        { name: 'Scuba Diving', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
        { name: 'Birdwatching', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
        { name: 'Stargazing', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' },
        { name: 'Beach Vibes', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
    ];

    const themes = [
        { name: 'Architecture & Design', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
        { name: 'Art, Craft & Textile', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
        { name: 'Food & Drink', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80' },
        { name: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' },
        { name: 'Nature & Wildlife', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },

    ];

    return (

        <Box position="relative" width="100%">
            <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
            />

            <Box position="relative" zIndex="1">
                <Box height="100vh" width="100%" />

                <Box position="relative">
                    <CountriesSection countries={countries} title={"Explore immersive experiences that showcase local stories."} />
                    <CountriesSection countries={themes} title={"Discover local experiences based on your favourite travel themes and interests."} />
                    <CountriesSection countries={interests} title={"Browse local experiences that match your personal interests and hobbies."} />
                    {/* <ThemesSection themes={themes} isVisible={isVisible} themesRef={themesRef} />
                    <InterestsSection interests={interests} interestsRef={interestsRef} /> */}
                </Box>
            </Box>
        </Box>

    );
}

export default NewHomePage;