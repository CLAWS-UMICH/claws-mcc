import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Input,
  Label,
  makeStyles,
  Option,
  shorthands,
  tokens,
  Button,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  PopoverProps,
  Skeleton
} from "@fluentui/react-components";
import { 
  Edit16Regular, 
  Delete16Regular, 
  Map16Regular, 
  Star16Regular, 
  Star16Filled,
  Circle16Regular, 
  Square16Regular, 
  Hexagon16Regular, 
  Triangle16Regular, 
  Question16Regular,
  Location16Regular,
  Calendar16Regular, 
  Clock16Regular,
  Dismiss16Regular,
  Save16Regular,
  Tag16Regular
} from "@fluentui/react-icons";
import './Geosamples.css';
import { BaseGeosample, EvaData, ManagerAction } from "./Geosamples";
import { GeosampleMap } from "./GeosampleMap.tsx"

const useStyles = makeStyles({
  root: {
    ...shorthands.gap("3.5px"),
    display: "flex",
    flexDirection: "column",
    flexGrow: "1"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1"
  },
  composition: {
    display: "flex",
    flexDirection: "column",
    minWidth: "2.4375rem",
    flexGrow: "1",
    flexBasis: "10%",
    alignContent: "center",
  },
  dropdown: { 
    minWidth: '11.375rem', 
  },
  line: {
    display: "flex",
    marginBottom: "1rem",
    paddingLeft:'1rem', 
    paddingRight:'1rem',
    alignContent:"center",
    justifyContent:"space-between",
    ...shorthands.gap("15px"),
  },
});

interface CompositionValuesProps {
  sample: EvaData
}

const CompositionValues : React.FC<CompositionValuesProps> = ({sample}) => {
  const styles = useStyles();
  let other = 100 - (sample.data.SiO2 + sample.data.Al2O3 + sample.data.CaO + sample.data.FeO + sample.data.K2O + sample.data.MgO + sample.data.MnO + sample.data.P2O3 + sample.data.TiO2);

  return (
    <div style={{display: "flex", flexWrap: "wrap", flexGrow: "1", flexBasis: "50%", minWidth: "390px"}}>
      <div className={styles.composition}>
          <Label style={{color: "#BB6BD9", fontSize: "12.5px", textAlign: "center"}} htmlFor="sio2">SiO<sub>2</sub></Label>
          <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="sio2" readOnly={true} value={sample.data.SiO2.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{fontSize: "12.5px", textAlign:"center"}} htmlFor="tio2">TiO<sub>2</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="tio2" readOnly={true} value={sample.data.TiO2.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#EB5757", fontSize: "12.5px", textAlign:"center"}} htmlFor="al2o3">Al<sub>2</sub>O<sub>3</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="al2o3" readOnly={true} value={sample.data.Al2O3.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor="feo">FeO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="feo" readOnly={true} value={sample.data.FeO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#2D9CDB", fontSize: "12.5px", textAlign:"center"}} htmlFor="mno">MnO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="mno" readOnly={true} value={sample.data.MnO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#219653", fontSize: "12.5px", textAlign:"center"}} htmlFor="mgo">MgO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="mgo" readOnly={true} value={sample.data.MgO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#9B51E0", fontSize: "12.5px", textAlign:"center"}} htmlFor="cao">CaO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="cao" readOnly={true} value={sample.data.CaO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#F2C94C", fontSize: "12.5px", textAlign:"center"}} htmlFor="k2o">K<sub>2</sub>O</Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="k2o" readOnly={true} value={sample.data.K2O.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor="p2o3">P<sub>2</sub>O<sub>3</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="p2o3" readOnly={true} value={sample.data.P2O3.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#F2994A", fontSize: "12.5px", textAlign:"center"}} htmlFor="other">Other<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px"}} appearance="outline" id="other" readOnly={true} value={other.toString()} />
      </div>
    </div>
  )
}

// Composition visualization functions
function calculate(value, valueRangeStart, valueRangeEnd, newRangeStart, newRangeEnd) {
  return newRangeStart + (newRangeEnd - newRangeStart) * ((value - valueRangeStart) / (valueRangeEnd - valueRangeStart));
}

// Define the props type
interface CompositionVisualizationProps {
  sample: EvaData;
}

const CompositionVisualization: React.FC<CompositionVisualizationProps> = ({ sample }) => {
    var total = 0;
    let other = 100 - (sample.data.SiO2 + sample.data.Al2O3 + sample.data.CaO + sample.data.FeO + sample.data.K2O + sample.data.MgO + sample.data.MnO + sample.data.P2O3 + sample.data.TiO2);
    const compositions = {
      "SiO2": sample.data.SiO2, 
      "TiO2": sample.data.TiO2,
      "Al2O3": sample.data.Al2O3, 
      "FeO": sample.data.FeO, 
      "MnO": sample.data.MnO, 
      "MgO": sample.data.MgO, 
      "CaO": sample.data.CaO, 
      "K2O": sample.data.K2O, 
      "P2O3": sample.data.P2O3, 
    }

    if (other > 0) {
      compositions["Other"] = other
    }


    for (var comp in compositions) {
      var value = compositions[comp]
      if (!isNaN(value)) {
          total += value;
      }
    }

    const comp_colors = ['#BB6BD9', '#FFFFFF', '#EB5757', '#6FCF97', '#2D9CDB', '#219653', '#9B51E0', '#F2C94C', '#6FCF97', '#F2994A'];
    const components = Object.entries(compositions).map(([_, value], index) => {
        const wdth = Math.floor(calculate(value, 0, total, 0, 100));
        const classes: string[] = [];
        if (index === 0) classes.push('start');
        if (index === Object.entries(compositions).length - 1) classes.push('end');
        // For each entry, create a list item or any other suitable HTML
        return (
          <div
              key={index}
              className={`${index === 0 ? 'start' : ''} ${index === Object.entries(compositions).length - 1 ? 'end' : ''}`}
              style={{
                  width: `${value}%`, // Set width as a percentage
                  backgroundColor: comp_colors[index % comp_colors.length],
              }}
          />
        );
    });

    return (
      <div style={{display: "flex", flexDirection: "column", flexGrow: "1", flexBasis: "50%", minWidth: "390px"}}>
        <p style={{ marginTop:"0rem" }}>Composition</p>
          <div className="chart">
            {components}
          </div>
      </div>
    );
}

interface DetailScreenProps {
  dispatch: React.Dispatch<ManagerAction>;
  geosample?: BaseGeosample;
}

const DetailScreen : React.FC<DetailScreenProps> = props => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedSample, setEditedSample] = useState<BaseGeosample | undefined>(props.geosample);
  const [currentSample, setCurrentSample] = useState<BaseGeosample | undefined>(props.geosample);

  useEffect(() => {
    setCurrentSample(props.geosample);
    setEditedSample(props.geosample);
  }, [props.geosample]);

  if (!props.geosample) {
    return (
        <Skeleton/>
    )
  }

  const color_options = [ "Brown", "Copper Red", "Black", "Multi-color" ];
  const location_string = props.geosample.location.latitude + "˚ " + props.geosample.location.longitude + "˚";

  // TODO: make this send message to hololens if clicked
  const handleFavoriting = async (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
    if (geosample) {   
      const res = await fetch("/api/geosamples", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: geosample
        })
      });
      if (!res.ok) {
        alert("Failed favoriting of sample");
        return;
      }  

      if (!geosample.starred) {
        geosample.starred = true;
        dispatch({type: 'update', payload: geosample});
      }
      else {
        geosample.starred = false;
        dispatch({type: 'update', payload: geosample});
      }
    }
  }


  const handleDelete = async (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
    if (geosample) {
      const res = await fetch("/api/geosamples", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: geosample
        })
      });
      if (!res.ok) {
        alert("Failed to delete sample");
        return;
      }

      dispatch({type: 'delete', payload: geosample})
      dispatch({type: 'deselect'})
    }
  }

  const handleSave = async (dispatch: React.Dispatch<ManagerAction>, edited_sample?: BaseGeosample) => {
    if (edited_sample) {
      const res = await fetch("/api/geosamples", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: editedSample
        })
      });
      if (!res.ok) {
        alert("Failed to save edited sample");
        setCurrentSample(props.geosample);
        setEditedSample(props.geosample);
        setEdit(false);
        return;
      }
      dispatch({type: 'update', payload: edited_sample});
      setCurrentSample(editedSample);
      setEdit(false);
    }
  }

  const handleCancel = () => {
    setCurrentSample(props.geosample);
    setEditedSample(props.geosample);
    setEdit(false);
  }
    
  const handleOpenChange: PopoverProps["onOpenChange"] = (e, data) =>
    setOpen(data.open || false);

  const handleChange = (field: keyof BaseGeosample, value: string) => {
    if (editedSample) {
      setEditedSample((prev) => {
        if (!prev) {
          return undefined;
        }
        
        if (field === 'eva_data' && value) {
          return {
              ...prev,
              eva_data: {
                ...prev.eva_data,
                name: value,
              },
            };
        }
        else if (field === 'description') {
          return {
            ...prev,
            description: value
          };
        }
      });
    }
  };

  const handleOption = (field: keyof BaseGeosample, data?: string) => {
    if (editedSample) {
      setEditedSample((prev) => {
        if (!prev) {
          return undefined
        }

        if (field === 'shape' && data) {
          return {
            ...prev,
            shape: data
          };
        }
        else if (field === 'color' && data) {
          return {
            ...prev,
            color: data
          };
        }
      });
    }
  };

  return (
    <div>
        <div>
          <h4 style={{paddingLeft:'1rem', paddingRight:'1rem', display:'flex', justifyContent: 'space-between', marginTop: "11px", marginBottom: "11px"}}>
              <div style={{ display: 'flex', alignItems: 'center', gap:'10px' }}>
                <Input style={{border: "0px", flexGrow: "1", fontSize: "17.5px", font: "bold", marginLeft:"-10px"}} 
                       appearance="outline" 
                       id="geosample_name" 
                       readOnly={!edit} 
                       defaultValue={props.geosample.eva_data.name}
                       value={edit ? editedSample?.eva_data.name : currentSample?.eva_data.name || ''} 
                       onChange={(e) => handleChange('eva_data', e.target.value)} />
                <Button icon={props.geosample.starred ? <Star16Filled style={{color:"#EAA300", flexGrow: "1"}}/> : <Star16Regular />} onClick={() => handleFavoriting(props.dispatch, props.geosample)}></Button>
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                  <Button icon={<Map16Regular/>}>View on map</Button>
                  <Button icon={<Edit16Regular/>} onClick={() => setEdit(!edit)}>Edit</Button>
                  <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger disableButtonEnhancement>
                      <Button icon={<Delete16Regular/>}>Delete</Button>
                    </PopoverTrigger>

                  <PopoverSurface aria-labelledby="delete_screen">
                    <div style={{display: "flex", marginTop: "-10px"}}>
                      <h3 style={{width: "175px"}} id="delete_text">
                        Delete {props.geosample.eva_data.name}?
                      </h3>
                        <Button style={{marginTop: "-12.5px", marginRight: "-10px"}} 
                                icon={<Dismiss16Regular/>} 
                                appearance="transparent" 
                                onClick={() => setOpen(!open)}></Button>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-evenly"}}>
                      <Button style={{background: "#C50F1F"}}
                              size="small" 
                              iconPosition="before" 
                              icon={<Delete16Regular/>} 
                              onClick={() => handleDelete(props.dispatch, props.geosample)}>Delete</Button>
                      <Button size="small" onClick={() => setOpen(!open)}>Cancel</Button>
                    </div>
                  </PopoverSurface>
                </Popover>
              </div>
          </h4>
          <Divider style={{marginBottom:'.75rem'}}></Divider>
        </div>
        <div className={styles.line}>
          <div className={styles.root}>
              <Label htmlFor="shape_dropdown">Shape</Label>
              {edit ? (              
              <Dropdown
                  className={styles.dropdown}
                  aria-labelledby="shape_dropdown"
                  id="shape_dropdown"
                  value={edit ? editedSample?.shape : currentSample?.shape || "Unknown"}
                  onOptionSelect={(e, data) => handleOption('shape', data.optionText)}
              >
                  <Option text="Circle">
                      <Circle16Regular/> Circle 
                  </Option>
                  <Option text="Square">
                      <Square16Regular/> Square 
                  </Option>
                  <Option text="Hexagon">
                      <Hexagon16Regular/> Hexagon 
                  </Option>
                  <Option text="Triangle">
                      <Triangle16Regular/> Triangle
                  </Option>
                  <Option text="Unknown">
                      <Question16Regular/> Unknown
                  </Option>
              </Dropdown> ) : <Input appearance="outline" id="shape_dropdown" readOnly={true} value={currentSample ? currentSample?.shape.charAt(0).toUpperCase() + currentSample?.shape.slice(1) : ""} />}
          </div>
          <div className={styles.root}>
              <Label htmlFor="color_dropdown">Color</Label>
              {edit ?     
                (<Dropdown
                  className={styles.dropdown}
                  aria-labelledby="color_dropdown"
                  id="color_dropdown"
                  value={edit ? editedSample?.color : currentSample?.color || "Multicolor"}
                  onOptionSelect={(e, data) => handleOption('color', data.optionText)}
                >
                  {color_options.map((option) => (
                    <Option key={option}>
                        {option}
                    </Option>
                  ))}
                </Dropdown>) : <Input appearance="outline" id="color_dropdown" readOnly={true} value={currentSample ? currentSample?.color.charAt(0).toUpperCase() + currentSample?.color.slice(1) : ""} /> }
          </div>
          <div className={styles.field}>
            <Label htmlFor="rock_type">Rock Type<sub></sub></Label>
            <Input appearance="outline" id="rock_type" readOnly={true} value={props.geosample.rock_type} />
          </div>
          <div className={styles.field}>
            <Label htmlFor="sample_id">ID<sub></sub></Label>
            <Input appearance="outline" id="sample_id" readOnly={true} value={props.geosample.eva_data.id.toString()} />
          </div>
        </div>
        <div className={styles.line}>
          <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
            <Label htmlFor="description">Description<sub></sub></Label>
            <Input style={{height: "120px"}} appearance="outline" id="description" readOnly={!edit} defaultValue={props.geosample.description} value={edit ? editedSample?.description : currentSample?.description || ''}  onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <img src={props.geosample.image} height={143.8} width={230}/>
        </div>
        <div className={styles.line}>
          <CompositionVisualization sample={props.geosample.eva_data}/>
            <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "30%" }}>              
              <Label htmlFor="location">Location<sub></sub></Label>
              <Input contentBefore={<Location16Regular/>} appearance="outline" id="location" readOnly={true} value={location_string} />
            </div>
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "20%" }}>
              <Label htmlFor="time">Time<sub></sub></Label>
              <Input contentBefore={<Clock16Regular/>} appearance="outline" id="time" readOnly={true} value={props.geosample.time} />
            </div>
        </div>
        <div className={styles.line}>
          <CompositionValues sample={props.geosample.eva_data} />
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "30%" }}>
              <Label htmlFor="date">Date<sub></sub></Label>
              <Input contentBefore={<Calendar16Regular/>} appearance="outline" id="date" readOnly={true} value={props.geosample.date} />
            </div>
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "20%" }}>
              <Label htmlFor="zone">Zone<sub></sub></Label>
              <Input contentBefore={<Tag16Regular/>} appearance="outline" id="zone" readOnly={true} value={props.geosample.zone_id} />
            </div>
        </div>
        { edit && <div style={{paddingRight: "1rem", display: "flex", float: "right", gap: "15px", marginBottom: "1rem"}}>
                    <Button style={{background: "#009B00"}} iconPosition="before" icon={<Save16Regular/>} onClick={() => handleSave(props.dispatch, editedSample)}>Save</Button>
                    <Button onClick={() => handleCancel()}>Cancel</Button>
                 </div>
        }
        <GeosampleMap geosamples={[props.geosample]} dispatch={props.dispatch}/>
    </div>
  );
};

export default DetailScreen;