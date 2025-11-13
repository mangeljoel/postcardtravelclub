import PropTypes from "prop-types";

import styles from "./index.module.scss";

const Label = ({
    size = "md",
    copy,
    color = "primary-1",
    fontStyle = "normal",
    fontFamily = "raleway",
    onClick,
    style
}) => {
    return (
        <label
            style={style}
            onClick={onClick}
            className={`${styles.heading} ${styles[size]} ${
                styles[fontFamily]
            } ${styles[`color-${color}`]} ${styles[fontStyle]}`}
        >
            {copy}
        </label>
    );
};

Label.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    color: PropTypes.oneOf([
        "primary-1",
        "primary-2",
        "primary-3",
        "primary-4",
        "primary-5",
        "primary-6",
        "primary-7",
        "primary-8",
        "primary-9",
        "error"
    ]),
    copy: PropTypes.string.isRequired,
    fontStyle: PropTypes.oneOf(["normal", "bold", "semibold"]),
    fontFamily: PropTypes.oneOf(["cabin", "raleway"]),
    onClick: PropTypes.func
};

// Label.defaultProps = {
//     color: "primary-1",
//     size: "md",
//     fontStyle: "normal",
//     fontFamily: "raleway"
// };

export default Label;
