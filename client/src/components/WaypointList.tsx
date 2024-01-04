import React from "react";
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
    shorthands
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
import {BaseWaypoint, ManagerAction as ListAction, WaypointType} from "./WaypointManager.tsx";

type WaypointListProps = {
    temp?: BaseWaypoint; // Temporary waypoint for adding a new waypoint after clicking on the map
    waypoints: BaseWaypoint[];
    selected: BaseWaypoint | null;
    dispatch: React.Dispatch<ListAction>;
};

interface WaypointListItemProps {
    waypoint: BaseWaypoint;
    selected: boolean;
    updateWaypoint: (waypoint: BaseWaypoint) => void;
    deleteWaypoint: () => void;
    selectWaypoint: () => void;
    deselectWaypoint: () => void;
}

const listStyles = makeStyles({
    container: {
        ...shorthands.gap("16px"),
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
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
    const styles = listStyles();
    // Icon, Label, Data
    const metadata = [
        [<DocumentPageNumberFilled/>, "Waypoint ID", props.waypoint.waypoint_id],
        [iconFromWaypointType(props.waypoint.type), "Type",
            // Only first letter capitalized
            WaypointType[props.waypoint.type].charAt(0) + WaypointType[props.waypoint.type].substring(1).toLowerCase()],
        [<TextboxFilled/>, "Description", props.waypoint.description],
        [<PersonFilled/>, "Author ID", props.waypoint.author]
    ]
    return (
        <Card selected={props.selected}
              onSelectionChange={(event, data) => {
                  if (data.selected) {
                      props.selectWaypoint();
                  } else {
                      props.deselectWaypoint();
                  }
              }}>
            <div className={styles.container}>
                <Body1>
                    {metadata.map(([icon, label, data]) => {
                        return (<div key={label as string}>{icon}<Body1Stronger>{label}</Body1Stronger>: {data}</div>)
                    })}
                </Body1>
            </div>
            <div style={{display: "flex", columnGap: "1em"}}>
                <Button style={{width: "50%"}} appearance={"primary"}
                        icon={<EditFilled/>} onClick={() => props.updateWaypoint(props.waypoint)}>Update</Button>
                <Button style={{width: "50%"}}
                        icon={<DeleteFilled/>} onClick={() => props.deleteWaypoint()}>Delete</Button>
            </div>
        </Card>
    );
}

const AddWaypointDialog: React.FC<{ dispatch: WaypointListProps['dispatch'], temp?: BaseWaypoint }> = props => {
    const [selectedType, setSelectedType] = React.useState<WaypointType | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(props.temp !== undefined);
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const styles = dialogStyles();
    const dropDownOptions = Object.keys(WaypointType).filter(key => isNaN(Number(key)));
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
        const waypoint: BaseWaypoint = {
            waypoint_id: parseInt(form["waypoint-id"].value),
            type: selectedType,
            description: form["waypoint-description"].value,
            author: -1,
            location: {
                x: parseFloat(matches[1]),
                y: parseFloat(matches[2])
            }
        }
        // Send the waypoint to the server
        const res = await fetch("/api/waypoint", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({data: {waypoints: [waypoint]}})
        });
        if (!res.ok) {
            alert("Failed to add waypoint");
            return;
        }
        // Close the dialog
        form.reset();
    };
    return (
        <div style={{marginTop: "20px"}}>
            <Dialog open={dialogOpen || props.temp !== undefined}>
                <DialogTrigger>
                    <Button onClick={() => setDialogOpen(true)} appearance={"primary"}>
                        Add Waypoint
                    </Button>
                </DialogTrigger>
                <DialogSurface>
                    <form onSubmit={handleSubmit}>
                        <DialogBody>
                            <DialogTitle>Dialog title</DialogTitle>
                            <DialogContent className={styles.form}>
                                <Label htmlFor={"waypoint-id"}>
                                    Waypoint ID
                                </Label>
                                <Input className={styles.wide} required type="number" id={"waypoint-id"}/>
                                <Label htmlFor={"waypoint-type"}>Waypoint Type</Label>
                                <Dropdown className={styles.wide}
                                          placeholder={"Select a waypoint type"}
                                          id={"waypoint-type"}
                                          onOptionSelect={(_, data) =>
                                              setSelectedType(parseInt(data.optionValue))}>
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
                                <Input className={styles.wide} type="text" id={"waypoint-description"}/>
                                <Label htmlFor={"waypoint-author"}>
                                    Waypoint Author
                                </Label>
                                <Input defaultValue={props.temp?.description}
                                       className={styles.wide} type="text" id={"waypoint-author"}/>
                                <Label htmlFor={"waypoint-coords"}>
                                    Waypoint Coordinates
                                </Label>
                                <div className={styles.wide}>
                                    <Input
                                        defaultValue={props.temp === undefined ? undefined :
                                            `${props.temp.location.x.toString()},${props.temp.location.y.toString()}`}
                                        onFocus={() => setTooltipVisible(true)}
                                        onBlur={() => setTooltipVisible(false)}
                                        type="text"
                                        id={"waypoint-coords"}/>
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
        </div>)
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
                    updateWaypoint={wp => props.dispatch({
                        type: "update",
                        payload: {old: waypoint, new: wp}
                    })}
                    deleteWaypoint={() => props.dispatch({
                        type: "remove",
                        payload: [waypoint]
                    })}
                    selectWaypoint={() => props.dispatch({
                        type: "select",
                        payload: waypoint
                    })}
                    deselectWaypoint={() => props.dispatch({
                        type: "deselect",
                        payload: waypoint
                    })}/>)
            )}
            <AddWaypointDialog temp={props.temp} dispatch={props.dispatch}/>
        </div>
    );
};
