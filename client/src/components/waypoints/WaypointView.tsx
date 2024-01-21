import {ManagerAction, ManagerState} from "./WaypointManager.tsx";
import React from 'react';
import {isUndefined} from "lodash";

type WaypointViewProps = { dispatch: React.Dispatch<ManagerAction> } & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC = props => {
    return <div>TODO: New</div>
};

/**
 * Renders when a waypoint is selected, but there is no temp waypoint. This view has an edit mode and a view mode. The
 * edit mode allows the user to change the waypoint's properties. No changes to the manager's state will be made until
 * the user commits their changes. The view mode allows the user to view the waypoint's properties.
 * @param props
 * @constructor
 */
const SelectedView: React.FC = props => {
    return <div>TODO: Selected</div>
};

/**
 * Renders when no waypoint is selected and there is no temp waypoint.
 * @param props
 * @constructor
 */
const EmptyView: React.FC = props => {
    return <div>TODO: Empty</div>
}

/**
 * Renders the appropriate view based on the manager's state. This component does not affect the manager's state, but
 * its children do.
 * @param {WaypointViewProps} props
 * @constructor
 */
export const WaypointView: React.FC<WaypointViewProps> = props => {
    if (isUndefined(props.temp)) {
        if (isUndefined(props.selected)) return <EmptyView/>
        return <SelectedView/>
    }
    return <NewView/>
}