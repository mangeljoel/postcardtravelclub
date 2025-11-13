import PropTypes from "prop-types";
import { Img } from "@chakra-ui/react";

import styles from "./index.module.scss";
import { headerRdSmall } from "./index.module.scss";

const sizes = { md: "h3", lg: "h2", sm: "h4", sh: "h3" };

const Heading = ({ size, copy, color, underline }) => {
    const Tag = sizes[size];

    return (
        <Tag
            className={`${styles.heading} ${styles[size]} ${styles.fontfamily
                } ${styles[`color-${color}`]}`}
        >
            {copy}
            <br />
            {underline && (
                <Img
                    loading="lazy"
                    src={"assets/popup-postal-stripes.svg"}
                    alt={"underline"}
                    className={headerRdSmall}
                    layout="fill"
                />
            )}
        </Tag>
    );
};

Heading.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg", "sh"]),
    color: PropTypes.oneOf([
        "primary-1",
        "primary-2",
        "primary-3",
        "primary-4"
    ]),
    copy: PropTypes.string.isRequired,
    underline: PropTypes.oneOf([true, false])
};

Heading.defaultProps = {
    color: "primary-1",
    size: "md",
    underline: false,
    fontfamily: "font-header"
};

export default Heading;
