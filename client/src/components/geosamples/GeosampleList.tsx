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
import { BaseGeosample, BaseZone, ManagerAction } from './Geosamples';
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
})

interface SampleListProps {
    sample_zones: BaseZone[];
    selected?: BaseGeosample;
    dispatch: React.Dispatch<ManagerAction>;
    ready: boolean;
}

const GeosampleList: React.FC<SampleListProps> = props => {
    const styles = useStyles();
    const [openItems, setOpenItems] = React.useState(["1"]);
    const [hovering, setHovering] = React.useState(false);

    const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
        setOpenItems(data.openItems);
    };

    const handleSelect = (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
        if (geosample && props.selected?.geosample_id === geosample.geosample_id) {
            dispatch({type: 'deselect'});
        }
        else if (geosample) {
            dispatch({type: 'select', payload: geosample});
        }
    };

    if (!props.ready || !props.sample_zones || props.sample_zones.length === 0) {
        return <Skeleton />
    };
 
    // TODO: add hovering effect with select dispatch event
    return (
        <Accordion className={styles.container} onToggle={handleToggle} openItems={openItems} multiple collapsible>
            {props.sample_zones.map((zone) =>             
                <AccordionItem key={zone.zone_id} value={zone.zone_id}>
                    <AccordionHeader key={zone.zone_id} className={styles.header} size="large" expandIcon={openItems.includes(zone.zone_id) ? <ChevronDown16Regular /> : <ChevronUp16Regular />} expandIconPosition="end">
                        <b style={{fontSize:"15px"}}>Zone {zone.zone_id}</b>
                    </AccordionHeader>
                    {zone.geosample_ids && zone.geosample_ids.map((sample, index) => (
                        <AccordionPanel style={{marginLeft: "-15px", marginRight: "-12px", marginBottom: "1px"}} className={styles.sampleContainer} key={index}>
                            <CompoundButton
                                style={{fontSize: "13px", width: "210px", height: "45px", border: "0px"}}
                                onClick={() => handleSelect(props.dispatch, sample)}
                                shape='circular'
                                secondaryContent={sample.rock_type}
                                icon={sample.starred ? <SampleImage sample={sample} index={index}/> : <StarredSample sample={sample} index={index}/>}
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

