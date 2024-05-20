import React from "react";
import { BaseGeosample } from "./GeosampleTypes.tsx";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    imageText: {
        fontSize: "13px",
        position: "absolute",
        marginTop: "-25.5px",
        marginLeft: "8px"
    }
});

interface SampleImageProps {
    sample: BaseGeosample,
};

const SampleImage : React.FC<SampleImageProps> = ({sample}) => {
    const styles = useStyles();

    return (
        <div style={{marginLeft: "-10px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13.5" fill="#006704" stroke="#4CAB50"/>
            </svg>
        <div className={styles.imageText}><b>{String.fromCharCode(Number(sample.zone_id))}{sample.geosample_id}</b></div>
        </div>
    );
};

export default SampleImage;