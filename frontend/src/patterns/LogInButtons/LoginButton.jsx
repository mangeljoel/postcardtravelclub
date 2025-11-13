import { Button } from "@chakra-ui/react";
const LogInButton = (props) => {
    const { buttontext } = props;
    return (
        <Button
            {...props}
            mx="auto"
            my="1em"
            fontSize={["lg", "xl"]}
            p="1.5em"
            w={"auto"}
        >
            {buttontext}
        </Button>
    );
};
export default LogInButton;
