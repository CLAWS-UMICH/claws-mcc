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
    );
}

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
        </div>
    );
};
