import PulseReport from "../PulseReport";
import { Heading, Text, Box } from "@chakra-ui/react";

const UserWanderlust = ({ isDiary, header }) => {
    return <Box w="100%">
        {header && <Box mb={["1em", "3em"]} textAlign={"center"} w="100%"
            pl={{ base: "5%", lg: "10%" }}
            pr={{ base: "5%", lg: "10%" }}><Heading>{header.title}</Heading>
            <Text my="1em" fontFamily={"raleway"} fontSize={["4.5vw", "1.2vw"]} fontWeight={500} color="#494746">{header.subtitle}</Text>
        </Box>}
        <PulseReport isDiary={isDiary} />
    </Box>

}
export default UserWanderlust;