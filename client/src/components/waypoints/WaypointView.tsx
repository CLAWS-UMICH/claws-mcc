import {
  BaseWaypoint,
  ManagerAction,
  ManagerState,
} from "./WaypointManager.tsx";
import React from "react";
import { isUndefined } from "lodash";
import {
  Checkbox,
  Display,
  Dropdown,
  Input,
  Label,
  Textarea,
  Title3,
} from "@fluentui/react-components";
// import { log } from "console";

type WaypointViewProps = {
  dispatch: React.Dispatch<ManagerAction>;
} & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC = (props) => {
  return <div>TODO: New</div>;
};

type SelectedViewProps = {
  selected?: BaseWaypoint;
  dispatch: React.Dispatch<ManagerAction>;
};

/**
 * Renders when a waypoint is selected, but there is no temp waypoint. This view has an edit mode and a view mode. The
 * edit mode allows the user to change the waypoint's properties. No changes to the manager's state will be made until
 * the user commits their changes. The view mode allows the user to view the waypoint's properties.
 * @param props
 * @constructor
 */
const SelectedView: React.FC<SelectedViewProps> = (props) => {
  // console.log(props)
  return (
    <div>
      <Title3>Edit Waypoint</Title3>
      <form
        style={{ display: "flex", width: "100%" }}
        onSubmit={() => console.log("Hello")}
      >
        <div
          className="left-view"
          style={{
            display: "flex",
            width: "60%",
            flexDirection: "column",
            padding: "2%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label htmlFor={"waypoint-type"}>Type</Label>
            <Dropdown
              style={{
                width: "60%",
              }}
              placeholder={"Select a waypoint type"}
              id={"waypoint-type"}
            ></Dropdown>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label htmlFor={"waypoint-name"}>Name</Label>
            <Input
              style={{
                width: "60%",
              }}
              type="text"
              id={"waypoint-name"}
              value={props.selected?.description}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label htmlFor={"waypoint-identifier"}>Identifier</Label>
            <Input
              style={{
                width: "60%",
              }}
              type="text"
              id={"waypoint-identifier"}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label htmlFor={"waypoint-coords"}>Coordinates</Label>
            <div style={{ display: "flex", width: "60%" }}>
              <Input
                disabled
                style={{ width: "48%" }}
                type="number"
                id={"waypoint-coords-lat"}
                value={props.selected?.location.latitude.toString(10)}
              />{" "}
              º
              <Input
                disabled
                style={{ width: "48%" }}
                type="number"
                id={"waypoint-coords-long"}
                value={props.selected?.location.longitude.toString(10)}
              />{" "}
              º
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label htmlFor={"waypoint-time-log"}>Time Logged</Label>
            <Checkbox label="Time Logged" />
          </div>
        </div>
        <div
          className="right-view"
          style={{ border: "1px solid", width: "100%", margin: "0% 2%" }}
        >
          <Textarea
            style={{ width: "100%", height: "100%" }}
            value={props.selected?.description}
          ></Textarea>
        </div>
      </form>
    </div>
  );
};

/**
 * Renders when no waypoint is selected and there is no temp waypoint.
 * @param props
 * @constructor
 */
const EmptyView: React.FC = (props) => {
  return <div>TODO: Empty</div>;
};

/**
 * Renders the appropriate view based on the manager's state. This component does not affect the manager's state, but
 * its children do.
 * @param {WaypointViewProps} props
 * @constructor
 */
export const WaypointView: React.FC<WaypointViewProps> = (props) => {
  if (isUndefined(props.temp)) {
    if (isUndefined(props.selected)) return <EmptyView />;
    return <SelectedView dispatch={props.dispatch} selected={props.selected} />;
  }
  return <NewView />;
};
