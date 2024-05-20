import React, { useCallback } from 'react';
import { BaseWaypoint, ManagerAction, useAstronaut } from "./WaypointManager.tsx";
import { DrawerBody, Body1, Body1Stronger, Skeleton, CompoundButton } from "@fluentui/react-components";
import { isEqual } from "lodash";
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

function SampleImage({ astro }: { astro: number }) {
    const intToChar = (i: number): string => {
        // If i > 26, add another letter.
        if (i > 26) return String.fromCharCode((i - 1) / 26 + 65) + String.fromCharCode(i % 26 + 65);
        return String.fromCharCode(i - 1 + 65);
    };
    return (
        <div className={"waypoint-image"}>
            <img style={{ alignSelf: "center", padding: "0 15px 0 0" }} width={27} height={31} src={waypointImage}
                alt={"Waypoint Icon"} />
            <div className={'waypoint-image-text'}>
                {intToChar(astro)}
            </div>
        </div>
    );
}

const DrawerSubItem: React.FC<DrawerSubItemProps> = ({ waypoint, selected, dispatch }) => {
    const [hovering, setHovering] = React.useState(false);
    let preview_length = 25;
    let details = waypoint.details;
    if (!details) details = "";
    if (details.length > preview_length) {
        details = details.substring(0, (preview_length - 3)) + "...";
    }
    return <div key={waypoint._id}
        onClick={() => {
            // If already selected, deselect.
            if (selected)
                dispatch({ type: 'deselect' });
            // Otherwise, select.
            else {
                dispatch({ type: 'clearTemp' });
                dispatch({ type: 'select', payload: waypoint });
            }
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={"drawer-sub-item"}
        style={{ display: "flex" }}>
        <CompoundButton
            style={{
                fontSize: "13px", width: "100%", height: "45px", border: "0px",
                backgroundColor: hovering ? "#2b2b2b" : "#0F0F0F",
                transition: "background-color 0.2s ease",

            }}
            shape='circular'
            secondaryContent={<span style={{ display: "inline-block", width: "150px" }}>{details}</span>}
            icon={<SampleImage astro={waypoint.waypoint_id} />}
        >
            Waypoint {waypoint.waypoint_id}
        </CompoundButton>
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
        <h3 style={{ paddingLeft: "10px" }}>{name}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {props.waypoints.map((waypoint) => <DrawerSubItem key={waypoint._id} dispatch={props.dispatch} waypoint={waypoint}
                selected={isEqual(props.selected, waypoint)} />)}
        </div>
    </div>
}


export const WaypointDrawer: React.FC<WaypointsDrawerProps> = props => {
    // Key by which to group waypoints.
    const [key, setKey] = React.useState<GroupKey>(GroupKey.Astronaut);

    const grouper = useCallback((waypoints: BaseWaypoint[]) => {
        if (waypoints.length === 0) return <Body1>No waypoints found</Body1>;
        const astronauts: Map<number, BaseWaypoint[]> = new Map();
        waypoints?.forEach((waypoint) => {
            if (!astronauts.has(waypoint.author)) {
                astronauts.set(waypoint.author, []);
            }
            astronauts.get(waypoint.author)?.push(waypoint);
        });
        const astronautList: React.ReactNode[] = [];
        astronauts?.forEach((waypoints, astronaut) =>
            astronautList.push(<DrawerItem dispatch={props.dispatch} astronaut={astronaut} waypoints={waypoints}
                                           selected={props.selected}/>));
        return astronautList;
    }, [key, props.selected, props.waypoints])
    if (!props.ready) {
        return <Skeleton />
    }
    return (
        <DrawerBody style={{ backgroundColor: "#0F0F0F" }}>
            <div className={'drawer-content'}>
                {grouper(props.waypoints)}
            </div>
        </DrawerBody>
    );
}