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
  PopoverProps
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
  Save16Regular
} from "@fluentui/react-icons";
import './Geosamples.css';
import { BaseGeosample, EvaData, ManagerAction } from "./Geosamples";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    ...shorthands.gap("2px"),
    maxWidth: "350px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    width: "160px"
  },
  quad: {
    display: "flex",
    flexDirection: "column",
    width: "135px"
  },
  composition: {
    display: "flex",
    flexDirection: "column",
    width: "39px",
    alignContent: "center",
  },
  dropdown: { 
    minWidth: '160px', 
    ...shorthands.padding('0', tokens.spacingHorizontalM),
  },
  line: {
    display: "flex",
    marginBottom: "1rem",
    alignContent:"center", 
    justifyContent:"space-between"
  },
});

interface CompositionValuesProps {
  sample: EvaData
}

const CompositionValues : React.FC<CompositionValuesProps> = ({sample}) => {
  const styles = useStyles();
  let other = 100 - (sample.data.SiO2 + sample.data.Al2O3 + sample.data.CaO + sample.data.FeO + sample.data.K2O + sample.data.MgO + sample.data.MnO + sample.data.P2O3 + sample.data.TiO2);

  return (
    <div style={{display: "flex"}}>
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
    console.log(other);
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
      "Other": other}

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
              className={classes.join(' ')}
              style={{
                  width: `${wdth}%`,
                  backgroundColor: comp_colors[index],
              }}
          />
        );
    });

    return (
      <div style={{marginRight:"-14px"}}>
        <p style={{ marginTop:"0rem"}}>Composition</p>
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
    console.log("props changed");
  }, [props.geosample]);

  if (!props.geosample) {
    return (
        <div style={{width: "100%"}}>
          <div>
            <Divider style={{marginLeft:'-24px', marginTop:'-9.1px', marginBottom:'.75rem', width:'1120px'}}></Divider>
          </div>
        </div>
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
        // TODO: send message to hololens 
      }
      else {
        geosample.starred = false;
        dispatch({type: 'update', payload: geosample});
        // TODO: send message to hololens
      }
    }
  }


  const handleDelete = async (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
    if (geosample) {
      console.log(geosample)
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
    <div style={{width: "100%"}}>
        <div>
          <h4 style={{marginTop:'.7rem', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap:'10px' }}>
                <Input style={{border: "0px", width: "150px", fontSize: "17.5px", font: "bold", marginLeft:"-10px", marginRight: "0px"}} 
                       appearance="outline" 
                       id="geosample_name" 
                       readOnly={!edit} 
                       defaultValue={props.geosample.eva_data.name}
                       value={edit ? editedSample?.eva_data.name : currentSample?.eva_data.name || ''} 
                       onChange={(e) => handleChange('eva_data', e.target.value)} />
                <Button icon={props.geosample.starred ? <Star16Filled style={{color:"#EAA300"}}/> : <Star16Regular />} onClick={() => handleFavoriting(props.dispatch, props.geosample)}></Button>
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
          <Divider style={{marginLeft:'-24px', marginTop:'-9.1px', marginBottom:'.75rem', width:'1120px'}}></Divider>
        </div>
        <div style={{display:"flex", marginBottom:'1rem', justifyContent: 'space-between'}}>
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
              </Dropdown> ) : <Input style={{width: "160px"}} appearance="outline" id="shape_dropdown" readOnly={true} value={currentSample ? currentSample?.shape.charAt(0).toUpperCase() + currentSample?.shape.slice(1) : ""} />}
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
                </Dropdown>) : <Input style={{width: "160px"}} appearance="outline" id="color_dropdown" readOnly={true} value={currentSample ? currentSample?.color.charAt(0).toUpperCase() + currentSample?.color.slice(1) : ""} /> }
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
          <div style={{display: "flex", flexDirection: "column"}}>
            <Label htmlFor="description">Description<sub></sub></Label>
            <Input style={{width: "452.5px", height: "110px"}} appearance="outline" id="description" readOnly={!edit} defaultValue={props.geosample.description} value={edit ? editedSample?.description : currentSample?.description || ''}  onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <img src={props.geosample.image} height={134.5} width={220}/>
        </div>
        <div style={{gap: "10px"}} className={styles.line}>
          <CompositionVisualization sample={props.geosample.eva_data}/>
          <div className={styles.quad} style={{marginLeft: "-22.5px"}}>
            <Label htmlFor="location">Location<sub></sub></Label>
            <Input contentBefore={<Location16Regular/>} appearance="outline" id="location" readOnly={true} value={location_string} />
          </div>
          <div className={styles.quad}>
            <Label htmlFor="time">Time<sub></sub></Label>
            <Input contentBefore={<Clock16Regular/>} appearance="outline" id="time" readOnly={true} value={props.geosample.time} />
          </div>
        </div>
        <div style={{display: "flex", marginTop: "-2.5px"}}>
          <div className={styles.line}>
            <CompositionValues sample={props.geosample.eva_data} />
            <div style={{marginLeft: "17.5px", display:"flex", gap: "15px"}}>
              <div className={styles.quad}>
                <Label htmlFor="date">Date<sub></sub></Label>
                <Input contentBefore={<Calendar16Regular/>} appearance="outline" id="date" readOnly={true} value={props.geosample.date} />
              </div>
              <div className={styles.quad}>
                <Label htmlFor="zone">Zone<sub></sub></Label>
                <Input appearance="outline" id="zone" readOnly={true} value={props.geosample.zone_id} />
              </div>
            </div>
          </div>
        </div>
        { edit && <div style={{display: "flex", float: "right", gap: "15px", marginBottom: "1rem"}}>
                    <Button style={{background: "#009B00"}} iconPosition="before" icon={<Save16Regular/>} onClick={() => handleSave(props.dispatch, editedSample)}>Save</Button>
                    <Button onClick={() => handleCancel()}>Cancel</Button>
                 </div>
        }
    </div>
  );
};

export default DetailScreen;