// DropdownMenu.tsx
import React from 'react';
import { 
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionToggleEventHandler,
    Skeleton,
    CompoundButton,
    makeStyles
} from '@fluentui/react-components';
import { ChevronUp16Regular, ChevronDown16Regular } from '@fluentui/react-icons';
import { BaseGeosample, BaseZone, ManagerAction } from './Geosamples.tsx';
import './Geosamples.css'
import StarredSample from './StarredImage.tsx';
import SampleImage from './SampleImage.tsx';

const useStyles = makeStyles({
    container: {
        marginLeft: ".2rem",
    },
    header: {
        marginLeft: "-15px",
        marginRight: "-15px"
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
    sampleContainer: {
      display: "flex",
      alignItems: "left",
      cursor: "pointer",
    },
    imageText: {
        fontSize: "12.5px",
        position: "absolute",
        marginTop: "-29.5px",
        marginLeft: "6px"
    },
});

interface SampleListProps {
    sample_zones: BaseZone[];
    dispatch: React.Dispatch<ManagerAction>;
    ready: boolean;
    selected?: BaseGeosample;
};

const GeosampleList: React.FC<SampleListProps> = ({sample_zones, dispatch, ready, selected}) => {
    const styles = useStyles();
    const [openItems, setOpenItems] = React.useState<string[]>(sample_zones.map(zone => zone.zone_id));

    // Maintain state of accordion panels
    const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
        setOpenItems(data.openItems);
    };

    // Handle selecting sample from list & displaying corresponding detail screen
    const handleSelect = (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
        if (geosample && selected?.geosample_id === geosample.geosample_id) { // change to id after finishing with front & back end
            dispatch({type: 'deselect'});
        }
        else if (geosample) {
            dispatch({type: 'select', payload: geosample});
        }
    };

    // If no zones are available or page is not ready, return empty list
    if (!ready || !sample_zones || sample_zones.length === 0) {
        return <Skeleton />
    };
 
    return (
        <Accordion className={styles.container} onToggle={handleToggle} openItems={openItems} multiple collapsible>
            {sample_zones.map((zone) =>             
                <AccordionItem key={zone.zone_id} value={zone.zone_id}>
                    {zone.geosample_ids.length > 0 &&
                        <AccordionHeader key={zone.zone_id} className={styles.header} size="large" expandIcon={openItems.includes(zone.zone_id) ? <ChevronDown16Regular /> : <ChevronUp16Regular />} expandIconPosition="end">
                            <b style={{fontSize:"15px"}}>Zone {zone.zone_id}</b>
                        </AccordionHeader>}
                    {zone.geosample_ids && zone.geosample_ids.map((sample, index) => (
                        <AccordionPanel style={{marginLeft: "-15px", marginRight: "-12px", marginBottom: "1px"}} className={styles.sampleContainer} key={index}>
                            <CompoundButton
                                style={{fontSize: "13px", width: "210px", height: "45px", border: "0px"}}
                                onClick={() => handleSelect(dispatch, sample)}
                                shape='circular'
                                secondaryContent={sample.rock_type}
                                icon={!sample.starred ? <SampleImage sample={sample} index={index}/> : <StarredSample sample={sample} index={index}/>}
                            >
                                {sample.eva_data.name}
                            </CompoundButton>
                        </AccordionPanel>
                    ))}
                </AccordionItem>
            )}
        </Accordion>
    );
}

export default GeosampleList;

