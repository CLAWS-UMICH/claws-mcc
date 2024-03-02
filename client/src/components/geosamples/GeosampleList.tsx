// DropdownMenu.tsx
import React from 'react';
import { 
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionToggleEventHandler,
    makeStyles
} from '@fluentui/react-components';
import { ChevronUp16Regular, ChevronDown16Regular } from '@fluentui/react-icons';
import sampleIcon from '../../assets/geosample.png';
import starredSampleIcon from '../../assets/starred_sample_pic.png'


interface SampleListProps {
    header: string;
    samples: string[];
}

const useStyles = makeStyles({
    container: {
        marginLeft: ".2rem",
    },

    header: {
        marginLeft: "-15px",
        marginRight: "-15px"
    },

    sampleContainer: {
        display: "flex",
        marginLeft: "-10px"
    },

    sample: {
        fontSize: "14px",
        marginTop: ".25rem",
        marginBottom: "0px"
    },

    type: {
        fontSize: "12.25px",
        marginTop: "-20px",
        marginBottom: "17.5px",
        marginLeft: "32.5px"
    },

    imageText: {
        fontSize: "12.5px",
        position: "absolute",
        marginTop: "-29px",
        marginLeft: "7px"
    }
})

const GeosampleList = ({header, samples, isStarred}) => {
    const [openItems, setOpenItems] = React.useState(["1"]);
    const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
        setOpenItems(data.openItems);
    };
    const styles = useStyles();

    return (
        <Accordion className={styles.container} onToggle={handleToggle} openItems={openItems} multiple collapsible>
            <AccordionItem value="1">
                <AccordionHeader className={styles.header} size="large" expandIcon={openItems[0] === "1" ? <ChevronDown16Regular /> : <ChevronUp16Regular />} expandIconPosition="end">
                    <b style={{fontSize:"15px"}}>Zone A</b>
                </AccordionHeader>
                {samples.map((sample: any) => (
                    <AccordionPanel>
                        <div className={styles.sampleContainer}>
                            <div>
                                <img style={{alignSelf: "center", padding: "7px 15px 0 0"}} 
                                    width={28} height={28} src={isStarred ? starredSampleIcon : sampleIcon}/>
                                <div className={styles.imageText}><b>B1</b></div>
                            </div>
                            <div className={styles.sample}><b>{sample}</b></div>
                        </div>
                        <div className={styles.type}>Rock Type</div>
                    </AccordionPanel>
                ))}
            </AccordionItem>
        </Accordion>
    );
}

export default GeosampleList;

