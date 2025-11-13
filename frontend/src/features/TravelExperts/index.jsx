import { useQuery } from "react-query";
import { Box } from "@chakra-ui/react";

import ExpertHeader from "./ExpertHeader";
import ExpertList from "./ExpertList";
import strapi from "../../queries/strapi.js";

const TravelExperts = ({ data, type }) => {
    //console.log(data);
    return (
        <Box
            mt={20}
            pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            textAlign="center"
        ></Box>
    );
};
export default TravelExperts;
