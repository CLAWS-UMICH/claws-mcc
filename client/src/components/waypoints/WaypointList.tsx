import React, {CSSProperties} from "react";
import {
    Body1,
    Body1Stronger,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Dropdown,
    Input,
    Label,
    makeStyles,
    Option,
    shorthands, Tooltip,
    CompoundButton
} from "@fluentui/react-components"
import {
    BuildingFilled,
    DataLineFilled,
    DeleteFilled,
    DocumentPageNumberFilled,
    EarthFilled,
    EditFilled,
    ImportantFilled,
    PersonFilled,
    TextboxFilled,
} from "@fluentui/react-icons";
import {isEqual, isNil, isUndefined} from "lodash";
import {BaseWaypoint, ManagerAction as ListAction, WaypointType, useAstronaut} from "./WaypointManager.tsx";

type WaypointListProps = {
    temp?: BaseWaypoint; // Temporary waypoint for adding a new waypoint after clicking on the map
    waypoints: BaseWaypoint[];
    selected?: BaseWaypoint;
    dispatch: React.Dispatch<ListAction>;
};

interface WaypointListItemProps {
    waypoint: BaseWaypoint;
    selected: boolean;
    dispatch: React.Dispatch<ListAction>;
}


const listStyles = makeStyles({
    container: {
        ...shorthands.gap("16px"),
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
    },
    form: {
        display: "grid",
        gridTemplateColumns: "30% 1fr 20%",
        alignItems: "center",
        justifyItems: "left",
        ...shorthands.gap("0", "10px"),
    },
    wide: {
        gridColumnEnd: "span 2"
    }
});

const iconFromWaypointType = (type: WaypointType) => {
    switch (type) {
        case WaypointType.STATION:
            return <BuildingFilled/>;
        case WaypointType.NAV:
            return <DataLineFilled/>;
        case WaypointType.GEO:
            return <EarthFilled/>;
        case WaypointType.DANGER:
            return <ImportantFilled/>;
    }
}

const WaypointListItem: React.FC<WaypointListItemProps> = props => {
    const author = useAstronaut(props.waypoint.author);
    const styles = listStyles();
    // Icon, Label, Data
    const metadata = [
        [<DocumentPageNumberFilled/>, "Waypoint ID", props.waypoint.waypoint_id],
        [iconFromWaypointType(props.waypoint.type), "Type",
            // Only first letter capitalized
            WaypointType[props.waypoint.type].charAt(0) + WaypointType[props.waypoint.type].substring(1).toLowerCase()],
        [<TextboxFilled/>, "Description", props.waypoint.description],
        [
            <PersonFilled/>, "Author ID", isNil(author) ? props.waypoint.author : `${author.name} (${author.id})`]
    ]
    const handleDelete = async () => {
        const res = await fetch("/api/waypoint", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                data: {
                    waypoints: [props.waypoint]
                }
            })
        });
        if (!res.ok) {
            alert("Failed to delete waypoint");
            return;
        }
    }
    return (
        <Card className='waypoint' onSelectionChange={(e, v) =>
            props.dispatch({type: v.selected ? "select" : "deselect", payload: props.waypoint})
        } selected={props.selected}>
            <div className={styles.container}>
                <Body1>
                    {metadata.map(([icon, label, data]) => {
                        return (<div key={label as string}>{icon}<Body1Stronger>{label}</Body1Stronger>: {data}</div>)
                    })}
                </Body1>
            </div>
            <div style={{display: "flex", columnGap: "1em"}}>
                <WaypointForm waypoint={props.waypoint} dispatch={props.dispatch} text={"Edit"}
                              buttonProps={{icon: <EditFilled/>, appearance: "primary", style: {width: "100%"}}}
                              style={{width: "50%"}}/>
                <Button style={{width: "50%"}}
                        icon={<DeleteFilled/>}
                        onClick={handleDelete}>Delete</Button>
            </div>
        </Card>
    //     <CompoundButton
    //         style={{fontSize: "13px", width: "210px", height: "45px", border: "0px",
    //         backgroundColor: hoveredButton === index ? "#2b2b2b" : "#0F0F0F",
    //         transition: "background-color 0.2s ease",
    //         width: "100%",
    //         }}
    //         shape='circular'
    //         secondaryContent="Recent Message"
    //         // icon={<SampleImage astro={astro}/> }
    //         // onClick={()=>{
    //         //     setActiveConversation(astro);
    //         // }}
    //         // onMouseEnter={()=>{
    //         //     handleMouseEnter(index);
    //         // }}
    //         // onMouseLeave={()=>{
    //         //     handleMouseLeave();
    //         // }}
    //     >
    //     Astronaut 1
    // </CompoundButton>
    );
}

interface WaypointFormProps {
    waypoint?: BaseWaypoint;
    dispatch: React.Dispatch<ListAction>;
    temp?: BaseWaypoint;
    text: string;
    buttonProps?: React.ComponentPropsWithRef<typeof Button>;
    style?: CSSProperties
    primary?: boolean;
    afterSubmit?: () => void;
}

export const WaypointForm: React.FC<WaypointFormProps> = props => {
    const creating = isUndefined(props.waypoint);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState<WaypointType | undefined>(props.waypoint?.type)
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const styles = listStyles();
    const dropDownOptions = Object.keys(WaypointType).filter(key => isNaN(Number(key)));
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        // TODO: Add validation
        e.preventDefault();
        // const selectedType = parseInt(e.currentTarget["waypoint-type"].value, 10);
        if (selectedType === undefined) {
            alert("Please select a waypoint type");
            return;
        }
        const form = e.currentTarget;
        const coords = form["waypoint-coords"].value;
        const matches = coords.match(/(.*),(.*)/);
        if (matches === null) {
            alert("Invalid coordinates");
            return;
        }
        const newWaypoint: BaseWaypoint = {
            waypoint_id: parseInt(form["waypoint-id"].value),
            type: selectedType,
            description: form["waypoint-description"].value,
            author: parseInt(form["waypoint-author"].value, 10),
            location: {
                latitude: parseFloat(matches[1]),
                longitude: parseFloat(matches[2])
            },
            details: "",
            time:"",
            date:""
        };
        if (isEqual(newWaypoint, props.waypoint)) return;
        const res = await fetch("/api/waypoint", {
            method: creating ? "put" : "post",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                data: {
                    waypoints: [newWaypoint]
                }
            })
        });
        if (!res.ok) {
            alert("failed to update waypoint");
            return;
        }
        setDialogOpen(false);
        !isUndefined(props.afterSubmit) && props.afterSubmit();
    }
    return (
        <div className={props.primary ? 'add-waypoint-btn' : undefined} style={{...props.style}}>
            <Dialog open={dialogOpen}>
                <DialogTrigger>
                    <Button {...props.buttonProps} children={props.text} onClick={() => setDialogOpen(true)}/>
                </DialogTrigger>
                <DialogSurface>
                    <form onSubmit={handleSubmit}>
                        <DialogBody>
                            <DialogTitle>Dialog title</DialogTitle>
                            <DialogContent className={styles.form}>
                                <Label htmlFor={"waypoint-id"}>
                                    Waypoint ID
                                </Label>
                                <Input defaultValue={props.waypoint?.waypoint_id.toString(10)} className={styles.wide}
                                       required type="number" id={"waypoint-id"}/>
                                <Label htmlFor={"waypoint-type"}>Waypoint Type</Label>
                                <Dropdown className={styles.wide}
                                          placeholder={"Select a waypoint type"}
                                          id={"waypoint-type"}
                                          onOptionSelect={(e, data) => setSelectedType(parseInt(data.optionValue!, 10))}
                                >
                                    {dropDownOptions.map(option =>
                                        (<Option key={option}
                                                 value={String(Object.entries(WaypointType).filter(
                                                     x => x[0] === option)[0][1])}>
                                            {option}
                                        </Option>))}
                                </Dropdown>
                                <Label htmlFor={"waypoint-description"}>
                                    Waypoint description
                                </Label>
                                <Input defaultValue={props.waypoint?.description} className={styles.wide} type="text"
                                       id={"waypoint-description"}/>
                                <Label htmlFor={"waypoint-author"}>
                                    Waypoint Author
                                </Label>
                                <Input defaultValue={props.waypoint?.author.toString(10)} disabled={!creating}
                                       className={styles.wide} type="text" id={"waypoint-author"}/>
                                <Label htmlFor={"waypoint-coords"}>
                                    Waypoint Coordinates
                                </Label>
                                <div className={styles.wide}>
                                    <Tooltip visible={tooltipVisible} content={"Latitude, Longitude"}
                                             relationship={"label"}>
                                        <Input
                                            defaultValue={isUndefined(props.temp) ?
                                                isUndefined(props.waypoint) ? undefined :
                                                    props.waypoint.location.latitude.toString(10) + "," + props.waypoint.location.longitude.toString(10) :
                                                `${props.temp.location.latitude.toString(10)},${props.temp.location.longitude.toString(10)}`}
                                            onFocus={() => setTooltipVisible(true)}
                                            onBlur={() => setTooltipVisible(false)}
                                            type="text"
                                            id={"waypoint-coords"}/>
                                    </Tooltip>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <DialogTrigger disableButtonEnhancement>
                                    <Button onClick={() => {
                                        if (props.temp !== undefined) props.dispatch({type: "clearTemp"});
                                        setDialogOpen(false);
                                    }} appearance="secondary">Close</Button>
                                </DialogTrigger>
                                <DialogTrigger disableButtonEnhancement>
                                    <Button onClick={() => {
                                        if (props.temp !== undefined) props.dispatch({type: "clearTemp"});
                                        setDialogOpen(false);
                                    }} type="submit" appearance="primary">
                                        Submit
                                    </Button>
                                </DialogTrigger>
                            </DialogActions>
                        </DialogBody>
                    </form>
                </DialogSurface>
            </Dialog>
        </div>
    )
}

const dialogStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        width: "90%",
        justifyItems: "center",
        ...shorthands.margin(0, "5%")
    },
    form: {
        display: "grid",
        gridTemplateColumns: "30% 1fr 20%",
        alignItems: "center",
        justifyItems: "left",
        ...shorthands.gap("0", "10px"),
    },
    wide: {
        gridColumnEnd: "span 2"
    }
});

export const WaypointList: React.FC<WaypointListProps> = props => {
    const styles = dialogStyles();
    return (
        <div className={styles.content}>
            <WaypointForm primary={true} dispatch={props.dispatch} text={"Add waypoint"}
                          buttonProps={{appearance: "primary"}}/>
            <div className='waypoints-list'>
                {props.waypoints.map((waypoint) =>
                    (<WaypointListItem
                        key={waypoint.waypoint_id}
                        selected={props.selected === waypoint}
                        waypoint={waypoint}
                        dispatch={props.dispatch}/>)
                )}
            </div>
            {/*TODO: remove waypoint props */}

        </div>
    );
};
