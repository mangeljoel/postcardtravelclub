import { Center, Image } from "@chakra-ui/react";
const LoadingGif = () => {
    return (
        <Center>
            <Image loading="lazy" src="/assets/balloon.gif" alt={"loading gif"} />
        </Center>
    );
};
export default LoadingGif;
