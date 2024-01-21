import React, {useCallback} from 'react';
import {BaseWaypoint, ManagerAction, useAstronaut} from "./WaypointManager.tsx";
import {Body1, Body1Stronger, Skeleton} from "@fluentui/react-components";
import {isEqual} from "lodash";
// @ts-ignore
import waypointImage from '../../assets/waypoint.png';

interface WaypointsDrawerProps {
    waypoints: BaseWaypoint[];
    selected?: BaseWaypoint;
    dispatch: React.Dispatch<ManagerAction>;
    ready: boolean;
}

enum GroupKey {
    Astronaut = "author",
    Type = "type",
}

type DrawerSubItemProps = { waypoint: BaseWaypoint, selected: boolean, dispatch: React.Dispatch<ManagerAction> }

const DrawerSubItem: React.FC<DrawerSubItemProps> = ({waypoint, selected, dispatch}) => {
    const [hovering, setHovering] = React.useState(false);
    const intToChar = (i: number): string => {
        // If i > 26, add another letter.
        if (i > 26) return String.fromCharCode(i / 26 + 65) + String.fromCharCode(i % 26 + 65);
        return String.fromCharCode(i + 65);
    };
    return <div key={waypoint._id}
                onClick={() => {
                    // If already selected, deselect.
                    if (selected)
                        dispatch({type: 'deselect', payload: waypoint});
                    // Otherwise, select.
                    else
                        dispatch({type: 'select', payload: waypoint});
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={"drawer-sub-item"}
                style={{display: "flex", backgroundColor: selected || hovering ? "grey" : undefined}}>

        <div className={"waypoint-image"}>
            <img style={{alignSelf: "center", padding: "0 15px 0 0"}} width={27} height={31} src={waypointImage}
                 alt={"Waypoint Icon"}/>
            <div className={'waypoint-image-text'}>
                {intToChar(waypoint.waypoint_id)}
            </div>
        </div>
        <div key={waypoint._id} style={{
            opacity: 0.95,
            flexDirection: "column",
            display: "flex",
            alignItems: "start"
        }}>
            <Body1Stronger>Waypoint {waypoint.waypoint_id}</Body1Stronger>
            <Body1>{waypoint.description}</Body1>
        </div>
    </div>
}

const DrawerItem: React.FC<{
    astronaut: number,
    waypoints: BaseWaypoint[],
    selected?: BaseWaypoint,
    dispatch: React.Dispatch<ManagerAction>
}> = props => {
    const name = useAstronaut(props.astronaut)?.name ?? `Astronaut ${props.astronaut}`;
    return <div key={props.astronaut}>
        <h3>{name}</h3>
        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {props.waypoints.map((waypoint) => <DrawerSubItem dispatch={props.dispatch} waypoint={waypoint}
                                                              selected={isEqual(props.selected, waypoint)}/>)}
        </div>
    </div>
}


export const WaypointDrawer: React.FC<WaypointsDrawerProps> = props => {
    // Key by which to group waypoints.
    const [key, setKey] = React.useState<GroupKey>(GroupKey.Astronaut);
    const grouper = useCallback((waypoints: BaseWaypoint[]) => {
        const astronauts: Map<number, BaseWaypoint[]> = new Map();
        waypoints.forEach((waypoint) => {
            if (!astronauts.has(waypoint.author)) {
                astronauts.set(waypoint.author, []);
            }
            astronauts.get(waypoint.author)?.push(waypoint);
        });
        const astronautList: React.ReactNode[] = [];
        astronauts.forEach((waypoints, astronaut) =>
            astronautList.push(<DrawerItem dispatch={props.dispatch} astronaut={astronaut} waypoints={waypoints}
                                           selected={props.selected}/>));
        return astronautList;
    }, [key, props.selected, props.waypoints])
    if (!props.ready) {
        return <Skeleton/>
    }
    return (
        <div className={'drawer-content'}>
            {grouper(props.waypoints)}
        </div>
    );
}