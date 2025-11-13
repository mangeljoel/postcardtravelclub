import { Box, Flex, Grid, Image } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";

const LogoGallery = () => {
    const galleryRef = useRef(null);
    const logos = [
        "/assets/homepage/six_senses.png",
        "/assets/homepage/images/logo_1.png",
        "/assets/homepage/logo_15.png",
        "/assets/homepage/images/logo_6.webp",
        "/assets/homepage/logo_3.webp",
        "/assets/homepage/images/logo_2.png",
        "/assets/homepage/logo_4.webp",
        "/assets/homepage/images/logo_4.png",
        "/assets/homepage/cempedak.png",
        "/assets/homepage/images/logo_7.webp",
        "/assets/homepage/tear_drop_hotels.png",
        "/assets/homepage/images/logo_8.webp",
        "/assets/homepage/logo_7.webp",
        "/assets/homepage/images/logo_3.jpg",
        "/assets/homepage/logo_8.webp",
        "/assets/homepage/images/logo_9.jpg",
        "/assets/homepage/logo_9.webp",
        "/assets/homepage/images/logo_5.webp",
        "/assets/homepage/logo_10.webp",
        "/assets/homepage/images/logo_10.png",
        "/assets/homepage/logo_14.png"
    ];

    const rows = 3;

    const logoRows = [];
    for (let i = 0; i < rows; i++) {
        logoRows.push(logos.filter((_, index) => index % rows === i));
    }

    // Effect to add animation when more than 50% of the gallery is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const logoElements =
                            entry.target.querySelectorAll("[data-animate]");
                        logoElements.forEach((logo) => {
                            logo.style.transform = "scale(1)";
                            logo.style.opacity = "1";
                        });
                        observer.unobserve(entry.target); // Stop observing once animation runs
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the gallery is visible
        );

        if (galleryRef.current) {
            observer.observe(galleryRef.current);
        }

        return () => {
            if (galleryRef.current) {
                observer.unobserve(galleryRef.current);
            }
        };
    }, []);

    return (
        // <Flex
        //     direction="column"
        //     gap={6}
        //     my="2vw"
        //     w={["100%", "80%"]}
        //     mx={["5vw", "auto"]}
        //     overflowX="scroll"
        //     className="no-scrollbar"
        //     justify={"flex-start"}
        // >
        <Grid
            ref={galleryRef}
            w={["100%", "100%", "100%", "100%"]}
            // ml={[0, 0, 0, "1.65vw"]}
            px={["6.56vw", "0"]}
            // my={[8, 8, 16]}
            // mr={["-5vw", "auto"]}
            // ml={["5vw", "auto"]}
            className="no-scrollbar"
            textAlign={"center"}
            h={["auto", "30vw"]}
            // overflowX={["auto", "hidden", "hidden"]}
            overflowX={["auto", "unset"]}
            templateColumns={["repeat(7, 1fr)"]}
            templateRows={["repeat(3, 1fr)"]}
            gap={["3.33vw", "1.8vw"]}
        >
            {logos.map((src, index) => (
                <Box
                    key={index}
                    borderRadius="50%"
                    overflow="hidden"
                    border="1px solid #4299E1"
                    width={["22.22vw", "8vw"]}
                    height={["22.22vw", "8vw"]}
                    flexShrink={0}
                    bg={src === "empty" ? "#D9D9D9" : "transparent"}
                    data-animate
                    style={{
                        transform: "scale(0.2)",
                        opacity: "0",
                        transition: "transform 0.5s ease, opacity 0.5s ease",
                        ratio: "1"
                    }}
                >
                    {src !== "empty" && (
                        <ChakraNextImage
                            src={src}
                            alt={`Logo ${index}`}
                            objectFit="cover"
                            width="100%"
                            height="100%"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                </Box>
            ))}
        </Grid>
        // </Flex>
    );
};

export default LogoGallery;
