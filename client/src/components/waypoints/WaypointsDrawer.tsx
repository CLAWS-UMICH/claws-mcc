import React, {useCallback} from 'react';
import {BaseWaypoint, ManagerAction, useAstronaut} from "./WaypointManager.tsx";
import {Body1, Body1Stronger, Skeleton} from "@fluentui/react-components";
import {isEqual} from "lodash";

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

const DrawerItem: React.FC<{ astronaut: number, waypoints: BaseWaypoint[], selected?: BaseWaypoint }> = props => {
    const name = useAstronaut(props.astronaut)?.name ?? `Astronaut ${props.astronaut}`;
    return <div key={props.astronaut}>
        <h3>{name}</h3>
        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {props.waypoints.map((waypoint) => {
                return <div key={waypoint._id} style={{display: "flex", justifyContent: "space-between"}}>
                    <svg style={{alignSelf: "center"}} xmlns="http://www.w3.org/2000/svg" width="32"
                         height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M7.79073 6.09108C12.3246 1.5572 19.6755 1.5572 24.2094 6.09108C28.7432 10.625 28.7432 17.9758 24.2094 22.5097L22.6267 24.0749C21.4602 25.2198 19.9467 26.6917 18.0856 28.4912C16.9226 29.6156 15.0775 29.6155 13.9147 28.4908L9.25989 23.963C8.67487 23.3886 8.18518 22.9042 7.79073 22.5097C3.25685 17.9758 3.25685 10.625 7.79073 6.09108ZM22.7951 7.5053C19.0423 3.75247 12.9578 3.75247 9.20494 7.5053C5.45211 11.2581 5.45211 17.3427 9.20494 21.0955L11.1877 23.0521C12.2796 24.1207 13.6522 25.4546 15.3051 27.0532C15.6927 27.4281 16.3077 27.4281 16.6954 27.0533L21.2219 22.6514C21.8472 22.0377 22.3716 21.519 22.7951 21.0955C26.548 17.3427 26.548 11.2581 22.7951 7.5053ZM16 10.6653C18.2103 10.6653 20.0021 12.4571 20.0021 14.6674C20.0021 16.8776 18.2103 18.6694 16 18.6694C13.7898 18.6694 11.998 16.8776 11.998 14.6674C11.998 12.4571 13.7898 10.6653 16 10.6653ZM16 12.6653C14.8943 12.6653 13.998 13.5616 13.998 14.6674C13.998 15.7731 14.8943 16.6694 16 16.6694C17.1058 16.6694 18.0021 15.7731 18.0021 14.6674C18.0021 13.5616 17.1058 12.6653 16 12.6653Z"
                            stroke={"white"} strokeWidth={isEqual(props.selected, waypoint) ? 3 : 1} fill="white"/>
                    </svg>
                    {/*Div should be at the end of the flexbox*/}
                    <div key={waypoint._id} style={{
                        opacity: 0.95,
                        flexDirection: "column",
                        display: "flex",
                        alignItems: "end"
                    }}>
                        <Body1Stronger>Waypoint {waypoint.waypoint_id}</Body1Stronger>
                        <Body1>{waypoint.description}</Body1>
                    </div>
                </div>
            })}
        </div>
    </div>
}


export const WaypointsDrawer: React.FC<WaypointsDrawerProps> = props => {
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
            astronautList.push(<DrawerItem astronaut={astronaut} waypoints={waypoints} selected={props.selected}/>));
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