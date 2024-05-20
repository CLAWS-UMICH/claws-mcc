import {
  BaseWaypoint,
  ManagerAction,
  ManagerState,
  WaypointType,
} from "./WaypointManager.tsx";
import React, { useState, useEffect } from "react";
import { isUndefined, set } from "lodash";
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
import Axios from "axios";

type WaypointViewProps = {
  dispatch: React.Dispatch<ManagerAction>;
} & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC<NewViewProps> = (props) => {
  const styles = listStyles();
  const dropDownOptions = Object.keys(WaypointType).filter((key) =>
    isNaN(Number(key))
  );

  useEffect(() => {
    setNewWaypoint((prev) => ({ ...prev, 
      details: "",
      type: 1,
      description: "",
      location: {latitude: props.temp.location.latitude || 0, longitude: props.temp.location.longitude || 0}}));
  } , [props.temp.location]);

  const [new_waypoint, setNewWaypoint] = useState<BaseWaypoint>({
    waypoint_id: -1,
    author: -1,
    description: "",
    type: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const handleAdd = async () => {
    setNewWaypoint((prev) => ({ ...prev }));
    const new_waypoints = [...props.waypoints, new_waypoint];
    try{
      const res = await Axios.put("/api/waypoint", {
        data: {
          waypoints: new_waypoints
        }
      });
      console.log({res});
    }catch (error) {
      console.error(error);
      return;
    }
  };

  const handleCancel = () => {
    props.dispatch({ type: "clearTemp" });
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
        <h4 style={{paddingLeft: 15}}>New Waypoint</h4>
        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-around",
          }}
        >
          <Button disabled>Send WayPoint</Button>
          <Button disabled>Edit</Button>
          <Button disabled>Delete</Button>
        </div>
      </div>

      <form style={{ padding: "0% 2%" }}>
        <div className={styles.container}>
          <Label htmlFor={"waypoint-details"}>Description</Label>
          <Input
            type="text"
            id={"waypoint-details"}
            value={new_waypoint.description}
            onChange={(e) => {
              setNewWaypoint((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
        </div>
        <br />
        <div className={styles.container2}>
          <div style={{ margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column", flexGrow: "1"}}>
            <Label htmlFor={"waypoint-type"}>Type</Label>
            <Dropdown 
              placeholder={"Select Waypoint Type"}
              onOptionSelect={(event, data) => {
                const option = data.optionValue;
                let type_num = 0; 
                console.log(option)
                if(option === "STATION") {
                  type_num = 0;
                }
                else if(option === "NAV") {
                  type_num = 1;
                }
                else if(option === "GEO") {
                  type_num = 2;
                }
                else if(option === "DANGER") {
                  type_num = 3;
                }
                setNewWaypoint((prev) => ({ ...prev, type: type_num}));
              }}
              {...props}
              >
                {dropDownOptions.map((option) => (
                  <Option key={option}
                  >{option}</Option>
                ))}
              </Dropdown>
          </div>
          <div style={{  margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column", flexGrow: "1" }}>
            <Label htmlFor={"waypoint-location"}>Latitude</Label>
              <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.latitude + ""}
              onChange={(e, data) => {
                  setNewWaypoint((prev) => ({ ...prev, location: {latitude: Number(data.value) , longitude: new_waypoint.location.longitude}}));
                }}
            />
          </div>
          <div style={{ margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column", flexGrow: "1" }}>
            <Label htmlFor={"waypoint-location"}>Longitude</Label>
              <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.longitude + ""}
              onChange={(e, data) => {
                  setNewWaypoint((prev) => ({ ...prev, location: {latitude: new_waypoint.location.latitude , longitude: Number(data.value)}}));
                }}
              />
          </div>
        </div>
      </form>
      <div id={"edit"} className={styles.edit} style={{gap: "10px"}}>
            <Button onClick={handleAdd} style={{backgroundColor: "green"}}>Create Waypoint</Button>
            <Button onClick={handleCancel} >Cancel</Button>
      </div>
    </div>
  );
};

type SelectedViewProps = {
  waypoints:BaseWaypoint[]
  selected?: BaseWaypoint;
  dispatch: React.Dispatch<ManagerAction>;
};

type NewViewProps = {
  waypoints:BaseWaypoint[]
  selected?: BaseWaypoint;
  dispatch: React.Dispatch<ManagerAction>;
  temp: BaseWaypoint;
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
    flexDirection: "row",
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    alignItems: "center",
  },
  edit: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    paddingTop: "20px",
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
  const [new_waypoint, setNewWaypoint] = useState<BaseWaypoint>({
    waypoint_id: -1,
    author: -1,
    description: "",
    type: WaypointType.NAV,
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    setIsEditing(false);
    if(!isUndefined(props.selected)) {
      setNewWaypoint(props.selected);
    }
  }, [props.selected]);

  const ToggleEdit = () => {
    setIsEditing(!isEditing);
    setNewWaypoint(props.selected!);
  };

  const handleSave = ({setIsEditing}) => {
    const idx = props.waypoints.findIndex((x) => x._id === props.selected?._id);
    if (idx >= 0) {
      //update waypoints to the value from input boxes
      props.waypoints[idx].description = new_waypoint.description;
      props.waypoints[idx].type = new_waypoint.type;
      props.waypoints[idx].location.latitude = new_waypoint.location.latitude;
      props.waypoints[idx].location.longitude = new_waypoint.location.longitude;

      console.log("Updated Waypoint: ");
      console.log(props.waypoints[idx]);
      console.log(typeof(props.waypoints))
      try{
        const res = Axios.post("/api/waypoint", {
          data: {
            waypoints: props.waypoints
          }
        });
      } catch (error) {
        console.error(error);
        return;
      }
      setIsEditing(false);
    }
  }

  const handleDelete = () => {
    const idx = props.waypoints.findIndex((x) => x._id === props.selected?._id);
    if (idx >= 0) {
      let new_waypoints = [...props.waypoints]
      new_waypoints.splice(idx, 1);
      console.log(typeof(new_waypoints))
      try{
        const res = fetch("/api/waypoint", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
            waypoints: new_waypoints
          }
        }),
        });
      } catch (error) {
        console.error(error);
        return;
      }
      props.dispatch({ type: "deselect" });
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{paddingLeft: 15}}>Waypoint {props.selected?.waypoint_id}</h4>
        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "space-around",
          }}
        >
          <Button appearance="primary">Send WayPoint</Button>
          {
            isEditing ?
          <Button disabled>Edit</Button>
          :
          <Button onClick={ToggleEdit}>Edit</Button>
          }
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <form style={{ padding: "0% 2%" }}>
        <div className={styles.container}>
          <Label htmlFor={"waypoint-details"}>Description</Label>
          {
            isEditing ? 
            <Input
            type="text"
            id={"waypoint-details"}
            value={new_waypoint?.description}
            onChange={(e) => {
              if(!new_waypoint) return; 
              setNewWaypoint((prev) => ({ ...prev, description: e.target.value }));
            }}
          /> : 
            <Input
            type="text"
            id={"waypoint-details"}
            style={{pointerEvents: "none"}}
            value={props.selected?.description}
          />
        } 
        </div>
        <br />
        <div className={styles.container2}>
          <div style={{ margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column" }}>
            <Label htmlFor={"waypoint-type"}>Type</Label>
            {
              isEditing ?
              <Dropdown 
              placeholder={WaypointType[new_waypoint.type]}
              onOptionSelect={(event, data) => {
                const option = data.optionValue;
                let type_num = 0; 
                console.log(option)
                if(option === "STATION") {
                  type_num = 0;
                }
                else if(option === "NAV") {
                  type_num = 1;
                }
                else if(option === "GEO") {
                  type_num = 2;
                }
                else if(option === "DANGER") {
                  type_num = 3;
                }
                setNewWaypoint((prev) => ({ ...prev, type: type_num}));
              }}
              {...props}
              >
                {dropDownOptions.map((option) => (
                  <Option key={option}
                  >{option}</Option>
                ))}
              </Dropdown>
              :
              <Dropdown 
              placeholder={WaypointType[new_waypoint.type]}
              style={{pointerEvents: "none"}}
              {...props}
              >
              </Dropdown>
            }
          </div>
          <div style={{ margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column", flexGrow: "1"  }}>
            <Label htmlFor={"waypoint-location"}>Latitude</Label>
            {
              isEditing ?
              <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.latitude + ""}
              onChange={(e, data) => {
                  setNewWaypoint((prev) => ({ ...prev, location: {latitude: Number(data.value) , longitude: new_waypoint.location.longitude}}));
                }
              }
            />
            :
            <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.latitude + ""}
              style={{pointerEvents: "none"}}
            />
            }
          </div>
          <div style={{ margin: "0% 1% 0% 0%", display:"flex", flexDirection: "column", flexGrow: "1"   }}>
            <Label htmlFor={"waypoint-location"}>Longitude</Label>
            {
              isEditing ?
              <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.longitude + ""}
              onChange={(e, data) => {
                  setNewWaypoint((prev) => ({ ...prev, location: {latitude: new_waypoint.location.latitude , longitude: Number(data.value)}}));
                }
              }
            />
            :
            <Input
              type="text"
              id={"waypoint-location"} 
              value={new_waypoint.location.longitude + ""}
              style={{pointerEvents: "none"}}
            />
            }
          </div>
        </div>
        {isEditing ? (
          <div id={"edit"} className={styles.edit} style={{gap: "10px"}}>
            <Button onClick={()=>handleSave({setIsEditing})} style={{backgroundColor: "green"}}>Save</Button>
            <Button onClick={ToggleEdit}>Cancel</Button>
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

  return <h1 style={{marginTop:"8%",textAlign:"center"}}>Select or Add </h1>;
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
    return <SelectedView waypoints={props.waypoints} dispatch={props.dispatch} selected={props.selected} />;
  }
  return <NewView waypoints={props.waypoints} dispatch={props.dispatch} selected={props.selected} temp={props.temp}/>;
};

