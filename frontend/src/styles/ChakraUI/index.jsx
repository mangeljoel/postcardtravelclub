import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import override from "./themes";

export default function ChakraUIContainer({ children }) {
    const theme = extendTheme(override);

    return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
