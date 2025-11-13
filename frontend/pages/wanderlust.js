import { Box, Text } from "@chakra-ui/react";
import PulseReport from "../src/features/PulseReport";
import SEOContainer from "../src/features/SEOContainer";


const PulsePage = () => {
  const getSeoValues = () => {
    let seoData = {};
    seoData = {
      title: "Postcard Wanderlust",
      description: "Follow friends, family, destination experts and discover the world of conscious luxury travel together.",
      url: "https://www.postcard.travel/wanderlust",
      image: "/assets/images/wanderlust_seo.jpg",
      keywords: "Wanderlust, travel wish, postcard wanderlust",
    };

    return seoData;
  }
  return <>
    <SEOContainer seoData={getSeoValues()} />
    <Box w={["90%", "28.82vw"]} mt={"2vw"} h={["16.11vw", "7.22vw"]} borderRadius={["2.78vw", "1.04vw"]} px={["5.83vw", "1.67vw"]} bg="#111111" mb={["10vw","0vw"]} alignContent="center" mx={["5vw", "4vw"]}>
                    <Text as="h1" fontSize={["6.67vw", "2.7vw"]} fontFamily="lora" fontStyle="italic" color="white">Wanderlust</Text>
                </Box>
    <PulseReport />
  </>;
};
export default PulsePage;
