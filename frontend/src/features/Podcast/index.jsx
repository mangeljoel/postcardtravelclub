import { Box } from "@chakra-ui/react";
import PodNewsLayout from "../PodNewsLayout";

function Podcast({ podcasts }) {
    return (
        <Box>
            <PodNewsLayout
                title="Podcast"
                description="Listen to personal stories of impact entrepreneurs that are shaping the future of travel."
                stories={podcasts}
            />
        </Box>
    );
}

export default Podcast;
