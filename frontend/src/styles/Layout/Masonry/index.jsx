import { useContext } from "react";

import { Box, useStyleConfig } from "@chakra-ui/react";
import AppContext from "../../../features/AppContext";

export const Masonry = (props) => {
    const { isTablet } = useContext(AppContext);
    const { size, variant, isMobile, isSingleCard, ...rest } = props;
    const styles = useStyleConfig("Masonry", { size, variant });
    return (
        <Box
            as="span"
            sx={{
                columnCount: isSingleCard && !isMobile ? 1 : [1, 2, 2, 3],
                columnGap: "20px",
                width:
                    isSingleCard && !isMobile
                        ? ["100%", "50%", "50%", "33%"]
                        : "auto",
                margin: "auto",
                textAlign: "center"
            }}
            {...rest}
        />
    );
};
