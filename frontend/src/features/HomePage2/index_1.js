import {
    Box,
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import FlipCard from "./FlipCard";
import { useContext, useRef, useState } from "react";
import VideoPlayerWithCustomPlay from "../../patterns/VideoPlayerWithCustomPlay";
import AnimatedNumbersSection from "./AnimatedNumbersSection";
import {
    CloseIcon,
    FlipIcon,
    RightArrowIcon
} from "../../styles/ChakraUI/icons";
import AutoSlideshow from "./AutoSlideshow";
import ImageGallery from "./ImageGallery";
import LogoGallery from "./LogoGallery";
import { BsArrowRightCircle, BsArrowRightCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import AppContext from "../AppContext";
import VideoPlayer from "./VideoPlayer";
import SignUpInModal from "./SignUpInModal";
import SignUpInfoModal from "./SignUpInfoModal";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";

const index = () => {
    const { profile } = useContext(AppContext);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [showModal, setShowModal] = useState({
        isShow: false,
        mode: "login"
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const router = useRouter();
    const images = [
        "/assets/homepage/press_logo_1.webp",
        "/assets/homepage/press_logo_2.webp",
        "/assets/homepage/press_logo_3.webp",
        "/assets/homepage/press_logo_4.webp",
        "/assets/homepage/press_logo_5.webp",
        "/assets/homepage/press_logo_6.webp",
        "/assets/homepage/press_logo_7.webp",
        "/assets/homepage/press_logo_8.webp"
    ];

    const scrollContainerRef = useRef(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const scrollWidth = scrollContainerRef.current.scrollWidth;
            const clientWidth = scrollContainerRef.current.clientWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;

            // Check if the user has reached the end of the scrollable area
            if (scrollLeft + clientWidth >= scrollWidth) {
                // Reset to the start
                scrollContainerRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                // Scroll by a certain amount
                scrollContainerRef.current.scrollBy({
                    left: 300, // Adjust this value to control the scroll amount
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <Flex
            flexDirection={"column"}
            alignItems={"center"}
            gap={["40px", "80px"]}
            pb={8}
        >
            <SignUpInModal
                isShow={showModal.isShow}
                mode={showModal.mode}
                setShowModal={setShowModal}
                setShowSignModal={setShowSignModal}
            />
            <SignUpInfoModal
                state={showSignModal}
                setShowSignModal={setShowSignModal}
            />

            <Modal
                isOpen={isVideoModalOpen}
                size="full" // Set size to full for full-screen modal
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    background={"#307FE2"}
                    // background={"transparent"}
                    // backdropFilter={"blur(10px)"}
                    borderRadius={0} // Remove border radius if needed
                >
                    <Box
                        onClick={() => setIsVideoModalOpen(false)}
                        position={"absolute"}
                        top={"2%"}
                        right={"2%"}
                        width={["40px", "50px", "60px"]}
                        _hover={{
                            cursor: "pointer",
                            "svg .outer-rect": {
                                // Target only the specific rect element with the class
                                stroke: "#111111"
                            },
                            svg: {
                                fill: "#111111" // Change fill color on hover
                            }
                        }}
                    >
                        <CloseIcon width={"100%"} height={"100%"} />
                    </Box>
                    <ModalBody
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <VideoPlayer
                            boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                            width={["100%", "85%"]} // Ensure video takes up full width
                            height={["100%", "85%"]} // Ensure video takes up full height
                            url="https://images.postcard.travel/postcardv2/pc_video_63146e5d5e.mp4"
                            customPlay={true}
                            isPlaying={true}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Box mx={["5.55vw", "1.56vw"]}>
                <Flex
                    direction="column"
                    position={"relative"}
                    overflow="hidden"
                    // width="100%"
                    width={["88.9vw", "96.88vw"]}
                    borderRadius={["15px", "15px", "30px"]}
                    justifyContent={["space-between", "flex-end"]}
                    height={["65vh", "70vh", "80vh", "90vh", "100vh"]}
                >
                    <ChakraNextImage
                        src="/assets/homepage/background.webp"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        alt="Background Image"
                        noLazy={true}
                        priority
                    />
                    <Flex
                        w="100%"
                        direction={"column"}
                        justifyContent={["space-around", "auto"]}
                        pos="absolute"
                        h="100%"
                    >
                        <Flex
                            w="100%"
                            h="100%"
                            flex={[0, 2]}
                            mt={["17vh", "6vw"]}
                            direction={["column", "row"]}
                            justifyContent={["flex-start", "space-between"]}
                            textAlign="center"
                            mx="auto"
                        >
                            <Box
                                my="auto"
                                ml="6vw"
                                mr={["6vw", 0]}
                                color={"#EFE9E4"}
                                w="fit-content"
                                textAlign={"left"}
                            >
                                <Text
                                    fontFamily="raleway"
                                    fontWeight={600}
                                    fontSize={["28px", "4.5vw"]}
                                    lineHeight={["30px", "5vw"]}
                                    pr={[3]}
                                >
                                    Discover the world of{" "}
                                    <Text
                                        fontFamily="lora"
                                        as="span"
                                        fontStyle={"italic"}
                                        fontWeight={400}
                                        fontSize={["28px", "4.5vw"]}
                                        lineHeight={["30px", "4.5vw"]}
                                        // whiteSpace={["wrap", "wrap", "wrap"]} // Prevent text from wrapping
                                    >
                                        conscious luxury travel.
                                    </Text>
                                </Text>
                            </Box>
                            <Box
                                textAlign={["left", "center"]}
                                my="auto"
                                mr={["0vw", "8vw"]}
                                ml={["6vw", "0vw"]}
                            >
                                <Button
                                    mt={["8vw", "4vw"]}
                                    variant={"none"}
                                    color={"white"}
                                    borderColor={"white"}
                                    border={"2px"}
                                    py={[3, 6]}
                                    px={[3, 7, 7, 15, 44]}
                                    borderRadius={["24px", "32px", "40px"]}
                                    height={["30px", "50px"]}
                                    width={[
                                        "150px",
                                        "25vw",
                                        "25vw",
                                        "25vw",
                                        "auto"
                                    ]}
                                    fontFamily="raleway"
                                    fontWeight={600}
                                    // fontSize={["12px", "16px", "1.5vw"]}
                                    fontSize={[
                                        "12px",
                                        "18px",
                                        "18px",
                                        "21px",
                                        "24px"
                                    ]}
                                    lineHeight={["37px", "49px", "1.5vw"]}
                                    backdropFilter="blur(5px)"
                                    _hover={{
                                        background: "#EFE9E4",
                                        color: "#111111",
                                        borderColor: "white"
                                    }}
                                    onClick={() => setIsVideoModalOpen(true)}
                                >
                                    Play Video
                                </Button>
                            </Box>
                        </Flex>

                        {/* <Image
                    loading="lazy"
                    objectFit={"cover"}
                    // width="1200px"
                    height={["70vh", "70vh", "auto"]}
                    overflow={"hidden"}
                    width={"100%"}
                    src={"assets/homepage/background.png"}
                    alt="mountain"
                /> */}
                        {/* <Box
                    color="white"
                    position={"absolute"}
                    top={["35%", "40%", "40%", "42%"]}
                    left={["7%", "7%", "5%", "7%"]}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        fontSize={["28px", "46px", "64px", "4.5vw"]}
                        lineHeight={["30px", "49px", "68px", "5vw"]}
                    >
                        Discover the world of
                    </Text>
                    <Text
                        fontFamily="lora"
                        fontStyle={"italic"}
                        fontWeight={400}
                        fontSize={["30px", "49px", "68px","4.5vw"]}
                        lineHeight={["30px", "49px", "68px","4.5vw"]}
                    >
                        conscious luxury travel.
                    </Text>
                </Box>

                <Button
                    variant={"none"}
                    color={"white"}
                    borderColor={"white"}
                    border={"2px"}
                    px={[8, 12, 20, 40]}
                    borderRadius={["24px", "32px", "40px"]}
                    height={["40px", "45px", "50px"]}
                    width="300px"
                    fontFamily="raleway"
                    fontWeight={600}
                    fontSize={["12px", "16px", "20px", "24px"]}
                    lineHeight={["37px", "49px", "61px", "74px"]}
                    position={"absolute"}
                    top={["57%", "50%"]}
                    right={["auto", "5%", "5%", "7%"]}
                    left={["7%", "auto"]}
                    backdropFilter="blur(5px)"
                    _hover={{ background: "#EFE9E4", color: "#111111" }}
                    onClick={() => setIsVideoModalOpen(true)}
                >
                    Play Video
                </Button> */}

                        <Box width={"100%"} ml="6vw" mb={["10vw", "4vw"]}>
                            <Text
                                color={"#EFE9E4"}
                                fontWeight={600}
                                fontFamily="raleway"
                                fontSize={["12px", "16px", "20px", "21px"]}
                                lineHeight={["13px", "17px", "21px", "27px"]}
                                // pl={["7%", "7%", "5%", "7%"]}
                            >
                                As seen in
                            </Text>
                            <AutoSlideshow images={images} speed={16000} />
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {/* Definition of Conscious Luxury Traveller */}
            <Flex
                color={"#307FE2"}
                my={["7.24vw", 0, 0, "3vw"]}
                // ml="auto"
                // mr={["-5vw", "auto"]}
                //mt="3vw"
                width={["100%", "80%"]} // Adjust width as needed
                overflowX="scroll"
                className="no-scrollbar"
                justifyContent={["start", "center"]}
                px={["11.55vw", "0"]}
            >
                <Box
                    width={["100%", "50%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Do you seek
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        // fontSize={["0.875rem", "1.31rem"]}
                        // lineHeight={["1.06rem", "1.68rem"]}
                        fontSize={["3.75vw", "1.25vw"]}
                        lineHeight={["4.722vw", "1.563vw"]}
                        pr={["16", "6rem"]}
                    >
                        <Text as="span" fontWeight={600}>
                            Luxury travel
                        </Text>{" "}
                        with immersive experiences that showcase a place and its{" "}
                        <Text as="span" fontWeight={600}>
                            community, culture, history, food, nature, and
                            wildlife?
                        </Text>
                    </Text>
                </Box>
                <Box
                    width={["100%", "50%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Do you want
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        height={"1px"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        // fontSize={["0.875rem", "1.31rem"]}
                        // lineHeight={["1.06rem", "1.68rem"]}
                        fontSize={["3.75vw", "1.25vw"]}
                        lineHeight={["4.722vw", "1.563vw"]}
                        pr={["16", "4rem"]}
                    >
                        To make{" "}
                        <Text as="span" fontWeight={600}>
                            {" "}
                            a positive impact{" "}
                        </Text>{" "}
                        by supporting sustainable travel with{" "}
                        <Text as="span" fontWeight={600}>
                            boutique properties, travel designers and
                            destination experts?
                        </Text>{" "}
                    </Text>
                </Box>
                <Box
                    width={["100%", "40%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Then you are
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="lora"
                        fontStyle={"italic"}
                        fontWeight={400}
                        // fontSize={["2.18rem", "3.25rem"]} //35
                        // lineHeight={["2.37rem", "3.25rem"]} //38
                        fontSize={["9.72vw", "3.02vw"]}
                        lineHeight={["10.55vw", "3.54vw"]}
                    >
                        a conscious
                    </Text>
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        // fontSize={["2rem", "3rem"]} //32
                        // lineHeight={["2.37rem", "3rem"]} //38
                        fontSize={["9.17vw", "2.81vw"]}
                        lineHeight={["10.55vw", "3.54vw"]}
                    >
                        luxury traveller
                    </Text>
                </Box>
            </Flex>

            {/* Explore Postcards Section */}
            <Flex
                // height={["auto", "auto", "auto"]}
                // gap={["14px", "14px", "27px"]}
                width="100%"
                flexDirection={["column", "row"]}
                alignItems={["center"]}
                gap={["3.611vw", 0]}
                // gap={["14px", "14px", "27px"]}
                //mr={["auto", "-1.5vw!important"]}
            >
                <Flex
                    bg={"#111111"}
                    w={["88.9vw", "37.45vw"]}
                    h={["61.66vw", "32.65vw"]}
                    mx={["5.55vw", "1.56vw"]}
                    borderRadius={["3.611vw", "1.53vw"]}
                    flexDirection={"column"}
                    pl={["10vw", "5.56vw"]}
                    pt={["15.27vw", "9.28vw"]}
                    pb={["11.11vw", "6.58vw"]}
                    gap={["7.5vw", "5.1vw"]}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        fontSize={["5.833vw", "2.75vw"]}
                        lineHeight={["6.67vw", "3.265vw"]}
                        color={"#EFE9E4"}
                        textAlign={"left"}
                    >
                        We're here to <br />
                        help you&nbsp;
                        <Text
                            as="span"
                            fontFamily="lora"
                            fontStyle="italic"
                            fontSize={["6.38vw", "2.95vw"]}
                            lineHeight={["6.67vw", "3.265vw"]}
                        >
                            discover
                            <br />
                        </Text>
                        this wonderful world.
                    </Text>

                    <Button
                        variant={"none"}
                        color={"white"}
                        borderColor={"white"}
                        border={"2px"}
                        w={["63.05vw", "24.08vw"]}
                        h={["8.05vw", "3.06vw"]}
                        textAlign={"center"}
                        borderRadius={["5.55vw", "2.08vw"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["3.33vw", "1.22vw"]}
                        lineHeight={["10vw", "3.77vw"]}
                        _hover={{ background: "#EFE9E4", color: "#111111" }}
                        onClick={() => router.push("/experiences")}
                    >
                        Explore Postcard Experiences &nbsp;
                        <RightArrowIcon
                            style={{ paddingTop: "1%" }}
                            h={["8.05vw", "3.06vw"]}
                            width={["2.77vw", "1.5vw"]}
                        />
                    </Button>
                </Flex>

                <Box
                    position={"relative"}
                    w={["100%", "59.43vw"]}
                    // w={"auto"}
                    // mr={["-6vw", "-1.5vw"]}
                >
                    <Box
                        width="fit-content"
                        position={"absolute"}
                        cursor={"pointer"}
                        overflowY={"hidden"}
                        top={["47%"]}
                        right={"2%"}
                        zIndex={10}
                        onClick={scrollRight}
                        display={["none", "none", "block"]}
                    >
                        <Box
                            opacity={1}
                            borderRadius={"50%"}
                            backdropFilter={"blur(5px)"}
                            cursor={"pointer"}
                            overflowY={"hidden"}
                            w={"4.167vw"}
                            h={"4.167vw"}
                            transition="transform 0.2s ease-in-out" // Add transition for smooth scaling
                            // _hover={{
                            //     transform: "scale(1.1)" // Scale the box slightly on hover
                            // }}
                        >
                            <BsArrowRightCircle size={"full"} color="white" />
                        </Box>
                    </Box>
                    <Flex
                        overflowX={"auto"}
                        className="no-scrollbar"
                        overflowY={"hidden"}
                        // gap={["14px", "14px", "27px"]}
                        gap={["3.88vw", "1.56vw"]}
                        px={["5.55vw", "0"]}
                        py={[2, 8]}
                        ref={scrollContainerRef}
                    >
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/c1c0a0aa_2372_4a27_a1c5_ac3b06e827f2_15ed481744.jpg"
                            }
                            postcardName={
                                "Take a Scenic Drive from the Dune Camp for a Great Escape"
                            }
                            propertyName={"Dune Camp"}
                            country={"NAMIBIA"}
                            firstLoad={firstLoad}
                            setFirstLoad={setFirstLoad}
                        />
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/b7d7f85a_4353_4b9c_a625_fca5ef8f2db2_823e221285.jpg"
                            }
                            postcardName={
                                "Soak Up the Beauty of Nimali Mara's Location"
                            }
                            propertyName={"Nimali Mara"}
                            country={"TANZANIA"}
                            firstLoad={false}
                        />
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/04f47b86_8d1f_4b4d_91fc_be8d19d3094d_08455013f0.jpg"
                            }
                            postcardName={
                                "Delve into the Adventure of Horse Riding to Solor"
                            }
                            propertyName={"Explora Atacama"}
                            country={"CHILE"}
                            firstLoad={false}
                        />
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/f40dff32_361e_4ea7_95e6_bb2f2e356b4d_53588d5b8a.jpg"
                            }
                            postcardName={
                                "Join a Unique Retreat in the Mayan Jungle"
                            }
                            propertyName={"Destino Mio"}
                            country={"MEXICO"}
                            firstLoad={false}
                        />
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/b0213fcc_4a2b_4fae_90ce_5fcdb396f7f1_584dc5e4a6.jpg"
                            }
                            postcardName={
                                "Learn about the Magical Job of a Mask Maker"
                            }
                            propertyName={"Hotel Mama Cuchara"}
                            country={"ECUADOR"}
                            firstLoad={false}
                        />
                        <FlipCard
                            imageUrl={
                                "https://images.postcard.travel/postcardv2/938f06a1_be61_47af_a648_8ce0bfd22f22_b54e6fcbb5.jpg"
                            }
                            postcardName={
                                "Meet the Maasai Warriors of the Mara"
                            }
                            propertyName={"Cottar's Safari Services"}
                            country={"KENYA"}
                            firstLoad={false}
                        />
                    </Flex>
                </Box>
            </Flex>

            {/* Immersive Experience Section */}
            <Flex
                flexDirection={"column"}
                // width={"100%"}
                // ml={["35px", "138px"]}
                // mr={["20px", "25px", "30px"]}
                width={"100%"}
                mx="auto"
            >
                <Flex
                    flexDirection={["column", "column", "row"]}
                    // alignItems={"center"}
                    // mx={[2, 8, 20]}
                    w={["100%", "80%"]}
                    // mx="auto"
                    mx={["0", "8.65vw"]}
                    px={["11.55vw", "0"]}
                    gap={6}
                    justify={"space-between"}
                >
                    <Text
                        fontFamily={"raleway"}
                        fontWeight={500}
                        // ml={["5vw", "auto"]}
                        // fontSize={["24px", "48"]}
                        // lineHeight={["28px", "58px"]}
                        fontSize={["5.83vw", "2.81vw"]}
                        lineHeight={["6.67vw", "3.54vw"]}
                        color={"#307FE2"}
                        // px={[10, 16, 20]}
                    >
                        Connect with partners who{" "}
                        <Text
                            as="span"
                            // fontSize={["28px", "52px"]}
                            fontSize={["6.4vw", "3.02vw"]}
                            fontFamily="lora"
                            fontWeight={400}
                            fontStyle="italic"
                        >
                            curate
                        </Text>{" "}
                        immersive experiences and{" "}
                        <Text
                            as="span"
                            // fontSize={["28px", "52px"]}
                            fontSize={["6.4vw", "3.02vw"]}
                            fontFamily="lora"
                            fontWeight={400}
                            fontStyle="italic"
                        >
                            advance responsible tourism.
                        </Text>
                    </Text>
                    <Box mx="auto" textAlign={"center"}>
                        <Button
                            variant={"none"}
                            borderColor={"#307FE2"}
                            color={"#307FE2"}
                            border={"2px"}
                            width={["100%", "24.58vw"]}
                            minW={["256px", "300px"]}
                            height={["8.33vw", "3.125vw"]}
                            minH={["35px", "50px"]}
                            maxH={["40px", "60px"]}
                            my={[1, 3]}
                            borderRadius={["24px", "40px"]}
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["14px", "21px"]}
                            lineHeight={["14px", "27px"]}
                            gap={5}
                            _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                            onClick={() => router.push("/stays")}
                        >
                            Boutique Stays <RightArrowIcon width={22} />
                        </Button>
                        <Button
                            variant={"none"}
                            borderColor={"#307FE2"}
                            color={"#307FE2"}
                            border={"2px"}
                            width={["100%", "24.58vw"]}
                            minW={["256px", "300px"]}
                            height={["8.33vw", "3.125vw"]}
                            minH={["35px", "50px"]}
                            maxH={["40px", "60px"]}
                            my={[1, 3]}
                            borderRadius={["24px", "40px"]}
                            fontFamily={"raleway"}
                            fontWeight={600}
                            fontSize={["14px", "21px"]}
                            lineHeight={["14px", "27px"]}
                            gap={5}
                            _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                            onClick={() => router.push("/tours")}
                        >
                            Designer Tours <RightArrowIcon width={22} />
                        </Button>
                    </Box>
                </Flex>

                <ImageGallery />
            </Flex>

            {/* Start your Collection Section */}
            <Flex
                // mx={[2, 4, 6, 8]}
                bg={"#EA6146"}
                minHeight={"500px"}
                width={["88.9vw", "96.88vw"]}
                mx={["5.55vw", "1.56vw"]}
                borderRadius={"30px"}
                p={[5, 12, 16, 20, 24]}
                gap={4}
                flexDirection={["column", "column", "row"]}
                justifyContent={[
                    "space-around",
                    "space-around",
                    "space-around",
                    "space-between",
                    "space-around"
                ]}
                alignItems={["center", "center", "start"]}
            >
                <Flex
                    width={["90%", "90%", "50%", "50%", "40%"]}
                    flexDirection={"column"}
                    // justifyContent={"space-around"}
                    alignItems={"flex-start"}
                    gap={[8, 8, 12, 16, 20]}
                >
                    <Text
                        color={"#EFE9E4"}
                        fontFamily="raleway"
                        fontWeight={500}
                        fontSize={["20px", "30px", "48px"]}
                        lineHeight={["27px", "37px", "55px"]}
                    >
                        Build your{" "}
                        <Text
                            as="span"
                            fontFamily="lora"
                            fontStyle="italic"
                            fontWeight={500}
                            fontSize={["24px", "34px", "52px"]}
                            lineHeight={["27px", "37px", "55px"]}
                        >
                            wish-list
                        </Text>{" "}
                        for conscious luxury travel.
                    </Text>

                    <Button
                        variant={"none"}
                        borderColor={"#EFE9E4"}
                        color={"#EFE9E4"}
                        border={"2px"}
                        px={[6, 12, 16]}
                        height={["40px", "50px"]}
                        borderRadius={["24px", "32px", "40px"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["14px", "16px", "20px"]}
                        lineHeight={["14px", "16px", "20px"]}
                        gap={5}
                        _hover={{ background: "#EFE9E4", color: "#EA6146" }}
                        onClick={() => {
                            if (profile) {
                                if (
                                    profile &&
                                    profile.slug &&
                                    profile.firstName &&
                                    profile.firstName !== "" &&
                                    profile.lastName &&
                                    profile.lastName !== ""
                                ) {
                                    router.push(`/${profile?.slug}`);
                                } else router.push("/edit-profile");
                            } else {
                                setShowModal({ ...showModal, isShow: true });
                            }
                        }}
                    >
                        Start your collection <RightArrowIcon width={22} />
                    </Button>
                </Flex>
                <AnimatedNumbersSection />
            </Flex>

            {/* Concierge Section */}
            <Flex
                flexDirection={"column"}
                gap={["12.22vw", "4.42vw"]}
                mt={"20px"}
                mb={["14.16vw", "6.5vw"]}
                // mx="auto"
                w="100%"
                // mr={["20px", "25px", "30px"]}
                // alignItems={{ base: "flex", xl: "center" }}
            >
                <Flex
                    flexDirection={"column"}
                    gap={[8, 10]}
                    w={["100%", "82vw"]}
                    // mx={["5vw", "auto"]}
                    mx={["0", "8.65vw"]}
                    px={["11.55vw", "0"]}
                    // pr = 6.4 vw
                >
                    <Text
                        fontFamily={"raleway"}
                        fontWeight={500}
                        // fontSize={["21px", "48px"]}
                        // lineHeight={["24px", "56px"]}
                        fontSize={["5.83vw", "2.81vw"]}
                        lineHeight={["6.67vw", "3.33vw"]}
                        color={"#307FE2"}
                    >
                        <Text
                            as="span"
                            // fontSize={["23px", "52px"]}
                            // lineHeight={["24px", "58px"]}
                            fontSize={["6.4vw", "3.02vw"]}
                            lineHeight={["6.67vw", "3.33vw"]}
                            fontFamily="lora"
                            fontStyle="italic"
                        >
                            Schedule a call{" "}
                        </Text>
                        and speak with a{" "}
                        <Text
                            as="span"
                            // fontSize={["23px", "52px"]}
                            // lineHeight={["24px", "58px"]}
                            fontSize={["6.4vw", "3.02vw"]}
                            lineHeight={["6.67vw", "3.33vw"]}
                            fontFamily="lora"
                            fontStyle="italic"
                        >
                            destination expert
                        </Text>{" "}
                        for your next conscious luxury vacation.
                    </Text>
                    <Button
                        variant={"none"}
                        borderColor={"#307FE2"}
                        color={"#307FE2"}
                        textAlign={"center"}
                        border={"2px"}
                        height={["30px", "50px"]}
                        width={["238px", "475px"]}
                        borderRadius={["20px", "40px"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        fontSize={["12px", "20px"]}
                        lineHeight={["37px", "20px"]}
                        //  gap={5}
                        _hover={{ background: "#307FE2", color: "#EFE9E4" }}
                    >
                        Postcard Concierge - Coming Soon!
                    </Button>
                </Flex>

                <LogoGallery />
            </Flex>
        </Flex>
    );
};

export default index;
