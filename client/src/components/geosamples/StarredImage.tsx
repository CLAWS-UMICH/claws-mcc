import React from "react";
import { BaseGeosample } from "./Geosamples";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    imageText: {
        fontSize: "13px",
        position: "absolute",
        marginTop: "-27.5px",
        marginLeft: "8.5px"
    }
});

interface StarredImageProps {
    sample: BaseGeosample,
    index: number,
};

const StarredImage : React.FC<StarredImageProps> = ({sample, index}) => {
    const styles = useStyles();

    return (
        <div style={{marginLeft: "-8.5px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="34.5" height="34.5" viewBox="0 0 32 32" fill="none">
                <g clipPath="url(#clip0_10547_22927)">
                    <circle cx="16" cy="16" r="13.5" fill="#835B00" stroke="#F2C661"/>
                </g>
            </svg>
        <div className={styles.imageText}><b>{sample.zone_id}{index + 1}</b></div>
        </div>
    );
};

export default StarredImage;