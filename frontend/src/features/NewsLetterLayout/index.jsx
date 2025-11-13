import { Box } from "@chakra-ui/react";
import PodNewsLayout from "../PodNewsLayout";
import { useEffect } from "react";
import { updateDBValue } from "../../queries/strapiQueries";
import { apiNames } from "../../services/fetchApIDataSchema";

function NewsLetterLayout({ newsData }) {
    return (
        <Box>
            <PodNewsLayout
                title="Wanderlust"
                description={
                    "Discover inspiration for your next adventure with boutique properties that advance responsible tourism."
                }
                stories={newsData}
                isNews={true}
            />
        </Box>
    );
}

export default NewsLetterLayout;
