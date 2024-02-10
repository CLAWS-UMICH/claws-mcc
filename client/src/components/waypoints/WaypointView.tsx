import {
  BaseWaypoint,
  ManagerAction,
  ManagerState,
  WaypointType,
} from "./WaypointManager.tsx";
import React, { useState } from "react";
import { isUndefined } from "lodash";
import {
  Button,
  Checkbox,
  Display,
  Dropdown,
  Input,
  Label,
  Option,
  Textarea,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import { log } from "console";

type WaypointViewProps = {
  dispatch: React.Dispatch<ManagerAction>;
} & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC = (props) => {
  return <div>TODO:NEW</div>;
};

type SelectedViewProps = {
  selected?: BaseWaypoint;
  dispatch: React.Dispatch<ManagerAction>;
};

const listStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
  },
  edit: {
    display: "flex",
    justifyContent: "flex-end",
  },
});

/**
 * Renders when a waypoint is selected, but there is no temp waypoint. This view has an edit mode and a view mode. The
 * edit mode allows the user to change the waypoint's properties. No changes to the manager's state will be made until
 * the user commits their changes. The view mode allows the user to view the waypoint's properties.
 * @param props
 * @constructor
 */
const SelectedView: React.FC<SelectedViewProps> = (props) => {
  const styles = listStyles();
  const dropDownOptions = Object.keys(WaypointType).filter((key) =>
    isNaN(Number(key))
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4>Station B</h4>
        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-around",
          }}
        >
          <Button appearance="primary">Send WayPoint</Button>
          {/* <Button>View Route</Button> */}
          <Button onClick={handleEditButtonClick}>Edit</Button>
          <Button>Delete</Button>
        </div>
      </div>

      <Title3>Edit Waypoint</Title3>
      <form style={{ padding: "0% 2%" }} onSubmit={() => console.log("Hello")}>
        <div className={styles.container}>
          <Label htmlFor={"waypoint-details"}>Details</Label>
          <Input
            type="text"
            id={"waypoint-details"}
            value={props.selected?.details}
          />
        </div>
        <br />
        <div className={styles.container2}>
          <div style={{ margin: "0% 1% 0% 0%" }} className={styles.container}>
            <Label htmlFor={"waypoint-type"}>Type</Label>
            <Dropdown placeholder="Select station type" {...props}>
              {dropDownOptions.map((option) => (
                <Option key={option}>{option}</Option>
              ))}
            </Dropdown>
          </div>
          <div style={{ margin: "0% 1% 0% 0%" }} className={styles.container}>
            <Label htmlFor={"waypoint-location"}>Location</Label>
            <Input
              type="text"
              id={"waypoint-location"}
              value={
                props.selected?.location.latitude +
                "," +
                props.selected?.location.longitude
              }
            />
          </div>
          <div style={{ margin: "0% 1% 0% 0%" }} className={styles.container}>
            <Label htmlFor={"waypoint-time"}>Time</Label>
            <Input
              type="text"
              id={"waypoint-time"}
              value={props.selected?.time}
            />
          </div>
          <div className={styles.container}>
            <Label htmlFor={"waypoint-date"}>Date</Label>
            <Input
              type="text"
              id={"waypoint-date"}
              value={props.selected?.date}
            />
          </div>
        </div>

        {isEditing ? (
          <div style={{ margin: "2%" }} id={"edit"} className={styles.edit}>
            <Button appearance="secondary">Save</Button>
            <Button onClick={handleEditButtonClick}>Cancel</Button>
          </div>
        ) : (
          <div></div>
        )}
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
