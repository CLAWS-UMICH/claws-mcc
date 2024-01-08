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
    shorthands, Tooltip
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
    selected: BaseWaypoint | null;
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
    const [selectedType, setSelectedType] = React.useState<WaypointType>(props.waypoint.type)
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
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (selectedType === null) {
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
        const updated: BaseWaypoint = {
            waypoint_id: parseInt(form["waypoint-id"].value),
            type: selectedType,
            description: form["waypoint-description"].value,
            author: parseInt(form["waypoint-author"].value, 10),
            location: {
                latitude: parseFloat(matches[1]),
                longitude: parseFloat(matches[2])
            }
        }
        if (isEqual(updated, props.waypoint)) return;
        const res = await fetch("/api/waypoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                data: {
                    waypoints: [updated]
                }
            })
        });
        if (!res.ok) {
            alert("Failed to update waypoint");
            return;
        }
        props.dispatch({type: "update", payload: {old: props.waypoint, new: updated}});
    }
    return (
        <Card selected={props.selected}
              onSelectionChange={(event, data) =>
                  props.dispatch(data.selected ? {type: "select", payload: props.waypoint} : {
                      type: "deselect",
                      payload: props.waypoint
                  })
              }>
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
                              style={{width: "50%"}}
                />
                <Button style={{width: "50%"}}
                        icon={<DeleteFilled/>}
                        onClick={() => props.dispatch({type: "remove", payload: [props.waypoint]})}>Delete</Button>
            </div>
        </Card>
    );
}

interface WaypointFormProps {
    waypoint?: BaseWaypoint;
    dispatch: React.Dispatch<ListAction>;
    temp?: BaseWaypoint;
    text: string;
    buttonProps?: React.ComponentPropsWithRef<typeof Button>;
    style?: CSSProperties
}

const WaypointForm: React.FC<WaypointFormProps> = props => {
    const creating = isUndefined(props.waypoint);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState<WaypointType | undefined>(props.waypoint?.type)
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const styles = listStyles();
    const dropDownOptions = Object.keys(WaypointType).filter(key => isNaN(Number(key)));
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
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
            }
        };
        if (isEqual(newWaypoint, props.waypoint)) return;
        const res = await fetch("/api/waypoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                data: {
                    waypoints: [newWaypoint]
                }
            })
        });
        if (!res.ok) {
            alert("Failed to update waypoint");
            return;
        }
        props.dispatch(creating ?
            {type: "add", payload: newWaypoint} :
            {type: "update", payload: {old: props.waypoint as BaseWaypoint, new: newWaypoint}});
    }
    return (
        <div style={{...props.style}}>
            <Dialog open={dialogOpen || props.temp !== undefined}>
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
                                          onOptionSelect={(_, data) =>
                                              setSelectedType(parseInt(data.optionValue as string))}>
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
                                            defaultValue={isUndefined(props.temp) ? undefined :
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
            {props.waypoints.map((waypoint) =>
                (<WaypointListItem
                    key={waypoint.waypoint_id}
                    selected={props.selected === waypoint}
                    waypoint={waypoint}
                    dispatch={props.dispatch}/>)
            )}
            {/*TODO: remove waypoint props */}
            <WaypointForm style={{marginTop: "20px"}} dispatch={props.dispatch} text={"Add waypoint"}
                          buttonProps={{appearance: "primary"}}/>
        </div>
    );
};
