import { Flex, useStyleConfig } from "@chakra-ui/react";

export const FlexBox = (props) => {
    const { size, variant, ...rest } = props;
    const styles = useStyleConfig("FlexBox", { size, variant });
    return <Flex as="span" sx={styles} {...rest} />;
};
