import { AspectRatio } from "@chakra-ui/react";
import NextImage from "next/image";
import { useEffect, useState } from "react";

export const ChakraNextImage = (props) => {
    const { src, alt, objectFit, noLazy, priority, sizes, fallbackImg, rel, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);
    return (
        <AspectRatio
            position="relative"
            overflow="hidden" // Prevent horizontal scrolling
            maxW="100%" // Ensure the container is responsive
            maxH="100%" // Prevent exceeding the parent's height
            {...rest}
        >
            <NextImage
                rel={rel}
                style={{ objectFit: objectFit || "contain" }}
                fill={true}
                src={imgSrc}
                loading={noLazy ? "eager" : "lazy"}
                alt={alt}
                priority={priority}
                sizes={sizes ? sizes : "100vw"}
                onError={() => fallbackImg && setImgSrc(fallbackImg)
                }
            />
        </AspectRatio>
    );
};
