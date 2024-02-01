import {ManagerAction, ManagerState} from "./WaypointManager.tsx";
import React from 'react';
import {isUndefined} from "lodash";
import {Button} from "@fluentui/react-components";
import {Divider, InlineDrawer, DrawerHeader, DrawerHeaderTitle, Switch} from "@fluentui/react-components";
import {
    Checkbox,
    Dropdown,
    Input,
    Label,
    Textarea,
    Title3,
  } from "@fluentui/react-components";

type WaypointViewProps = { dispatch: React.Dispatch<ManagerAction> } & ManagerState;

/**
 * Renders when a temp waypoint is selected. Does not affect the state unless the user commits their changes
 * @param props
 * @constructor
 */
const NewView: React.FC = props => {
    return <div className='new-waypoint'>
        <div className='new-waypoint-header'>
            <span id='new-header-title'>New Waypoint</span>
            <div style={{display: "flex", flexDirection:"row"}}>
                <Button size={"medium"} style={{marginRight: '10px'}}>Confirm</Button>
                <Button size={"medium"}>Cancel</Button>
            </div>
        </div>
        <div>
            <InlineDrawer/>
        </div>

        {/* --------- form ------------ */}
    
        <form style={{backgroundColor: '#424242', display: 'flex', justifyContent: 'space-evenly',
            marginTop: '20px', height: '90%', alignItems: 'center', margin: '15px'}} 
            onSubmit={() => console.log("Hello")}>

            {/* --------- left side ------------ */}
            <div className="left-view">

            <header style={{display: 'flex', marginBottom: '12px'}}>New Waypoint</header>
            
            <div style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                <Label className="form-label" htmlFor={"waypoint-type"}>Type</Label>
                <Dropdown
                    placeholder={"Select a waypoint type"}
                    id={"waypoint-type"}
                    className='form-input'>
                </Dropdown>
            </div>

            <div style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                <Label className="form-label" htmlFor={"waypoint-name"}>Name</Label>
                <Input className='form-input' type="text" id={"waypoint-name"} placeholder="Enter a name"/>
            </div>

            <div style={{display: 'flex', marginBottom: '12px', alignItems: 'center'}}>
                <Label className="form-label" htmlFor={"waypoint-identifier"}>Identifier</Label>
                <Input className='form-input' type="text" id={"waypoint-identifier"}  placeholder="Enter an identifier"/>
            </div> 

            <div style={{
            display: "flex",overflow:"clip", marginBottom: '12px', alignItems: 'center'
            }}>
                <Label className="form-label" htmlFor={"waypoint-coords"}>Coordinates</Label>
                <Input className='form-input' type="number" id={"waypoint-coords-lat"}  placeholder="Enter a coordinate"/> º     
            </div>
            
            <div style={{display: 'flex',  marginBottom: '12px', justifyContent: 'space-between', alignItems: 'center'}}>
                <Label className="form-label" htmlFor={"waypoint-timelog"}>Time logged</Label>
                <Switch/>
            </div> 

            </div>

            {/* --------- right side ----------- */}
            <div className="right-view" style={{width: '45%', height: '70%', display: 'flex', flexDirection: 'column'}} >
            <div style={{marginBottom: '9px'}}>Waypoint Description</div>
                <Textarea style={{width:"100%",height:"100%"}}
                          placeholder="Enter a description...">   
                </Textarea>
            </div>

      </form>




    </div>
};

/**
 * Renders when a waypoint is selected, but there is no temp waypoint. This view has an edit mode and a view mode. The
 * edit mode allows the user to change the waypoint's properties. No changes to the manager's state will be made until
 * the user commits their changes. The view mode allows the user to view the waypoint's properties.
 * @param props
 * @constructor
 */
const SelectedView: React.FC = props => {
    return <div>TODO: Implement</div>
};

/**
 * Renders when no waypoint is selected and there is no temp waypoint.
 * @param props
 * @constructor
 */
const EmptyView: React.FC = props => {
    return <div>TODO: Implement</div>
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