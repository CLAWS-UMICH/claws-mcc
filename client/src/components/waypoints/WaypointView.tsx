import {
  BaseWaypoint,
  ManagerAction,
  ManagerState,
} from "./WaypointManager.tsx";
import React from "react";
import { isUndefined } from "lodash";
import {
  Button,
  Checkbox,
  Display,
  Dropdown,
  Input,
  Label,
  Textarea,
  Title3,
  makeStyles,
} from "@fluentui/react-components";

type WaypointViewProps = {
  dispatch: React.Dispatch<ManagerAction>;
} & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC = (props) => {
  return (
      <div>TODO:NEW</div>
  );
};

type SelectedViewProps = {
  selected?: BaseWaypoint;
  dispatch: React.Dispatch<ManagerAction>;
};

const listStyles = makeStyles({
  red: {
    color: "red",
  },
  form: {
    display: "flex",
    width: "100%",
  },
  leftview: {
    display: "flex",
    width: "60%",
    flexDirection: "column",
    //padding: 2%//maybe not working
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  boxwide: {
    width: "60%",
  },
  smallboxwide: {
    width: "48%",
  },
  rightview: {
    width: "100%",
    marginTop: "0%",
    marginBottom: "0%",
    marginLeft: "2%",
    marginRight: "2%",
  },
  description: {
    width: "100%",
    height: "100%",
    // borderRadius:"2%" //doesn't work
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
  // console.log(props)
  const styles = listStyles();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center" }}>
        <h4>Station B</h4>
        <div style={{ display: "flex",width:"50%",justifyContent:"space-around"}}>
          <Button appearance="primary">Send WayPoint</Button>
          <Button>View Route</Button>
          <Button>Edit</Button>
          <Button>Delete</Button>
        </div>
      </div>
      <Title3>Edit Waypoint</Title3>
      <form className={styles.form} onSubmit={() => console.log("Hello")}>
        <div className={styles.leftview} style={{ padding: "2%" }}>
          <div className={styles.container}>
            <Label htmlFor={"waypoint-type"}>Type</Label>
            <Dropdown
              className={styles.boxwide}
              placeholder={"Select a waypoint type"}
              id={"waypoint-type"}
            ></Dropdown>
          </div>

          <div className={styles.container}>
            <Label htmlFor={"waypoint-name"}>Name</Label>
            <Input
              className={styles.boxwide}
              type="text"
              id={"waypoint-name"}
              value={props.selected?.description}
            />
          </div>

          <div className={styles.container}>
            <Label htmlFor={"waypoint-identifier"}>Identifier</Label>
            <Input
              className={styles.boxwide}
              type="text"
              id={"waypoint-identifier"}
            />
          </div>

          <div className={styles.container}>
            <Label htmlFor={"waypoint-coords"}>Coordinates</Label>
            <div className={styles.boxwide} style={{ display: "flex" }}>
              <Input
                disabled
                className={styles.smallboxwide}
                type="number"
                id={"waypoint-coords-lat"}
                value={props.selected?.location.latitude.toString(10)}
              />{" "}
              º
              <Input
                disabled
                className={styles.smallboxwide}
                type="number"
                id={"waypoint-coords-long"}
                value={props.selected?.location.longitude.toString(10)}
              />{" "}
              º
            </div>
          </div>
          <div className={styles.container}>
            <Label htmlFor={"waypoint-time-log"}>Time Logged</Label>
            <Checkbox label="Time Logged" />
          </div>
        </div>
        <div className={styles.rightview}>
          <Textarea
            className={styles.description}
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
