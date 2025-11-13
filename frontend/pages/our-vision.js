import { Box, AspectRatio, Image, Text } from "@chakra-ui/react";
import SEOContainer from "../src/features/SEOContainer";
const OurVision = () => {
  const getSeoValues = () => {
    let seoData = {
      title: "Postcard - Our Vision",
      description: "Building a global community to advance mindful travel.",
      url: "https://postcard.travel/our-vision",
      image: "/assets/images/p_stamp.png",
    };
    return seoData;
  };

  return (
    <>
      <SEOContainer seoData={getSeoValues()} />
      <Box
        mt={["6%", "3%"]}
        mb={["33%", "18%"]}
        paddingLeft={["5%", "10%"]}
        paddingRight={["5%", "10%"]}
      >
        <AspectRatio
          w={["95%", "20%"]}
          h={["100%", "20%"]}
          ratio={1}
          borderRadius="8px"
          padding="0px"
          margin="auto"
          pos="relative"
        >
          <Image
            loading="lazy"
            borderRadius="8px"
            w="100%"
            h="100%"
            src={"/assets/images/p_stamp.png"}
            alt={"Postcard Logo"}
            fallbackSrc={"/assets/images/p_stamp.png"}
          ></Image>
        </AspectRatio>
        <Text
          mt={["6%", "3%"]}
          pt="20px"
          variant="Heading"
          textAlign={"center"}
        >
          One Humanity
        </Text>
        <Text
          mt={["6%", "3%"]}
          width={["100%", "66%"]}
          variant="subHeading"
          fontSize={["1.1rem", "1.1rem"]}
          whiteSpace={"pre-line"}
          textAlign={"justify"}
        >
          The idea behind mindful travel is still niche and the space is an
          emerging industry - accessible to only a small portion of travellers
          that are more spiritually aware and awakened.
          <br />
          <br />
          But how do we scale the idea and make this movement mainstream?
          <br />
          We believe it is by showcasing local stories of people and places as
          they are relatable to everyone…
          <br />
          Local stories can help build empathy, And through it we can celebrate
          our diversity. This when done at scale can lead to changes in global
          perspectives which could then help overcome discrimination on the
          basis of race, color, religion, politics and more…
          <br />
          <br />
          THIS could lead to a more inclusive world!
          <br />
          <br />
          It’s been said, “We do not inherit the earth from our ancestors; we
          borrow it from our children”
          <br />
          <br />
          Let’s do what we can to make this a better world for them!
        </Text>
      </Box>
    </>
  );
};

export default OurVision;
