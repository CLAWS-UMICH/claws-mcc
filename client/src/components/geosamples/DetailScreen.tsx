import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Input,
  Label,
  makeStyles,
  Option,
  shorthands,
  Button,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  PopoverProps,
  Skeleton,
  Textarea
} from "@fluentui/react-components";
import { 
  Edit16Regular, 
  Delete16Regular, 
  Map16Regular, 
  Star16Regular, 
  Star16Filled,
  Circle16Regular, 
  Square16Regular, 
  PentagonRegular, 
  Triangle16Regular, 
  Question16Regular,
  Location16Regular,
  Calendar16Regular, 
  Clock16Regular,
  Dismiss16Regular,
  Save16Regular,
  Tag16Regular,
  Oval16Regular,
  Cone16Regular,
  ColumnSingle16Regular,
  Diamond16Regular,
  Cloud16Regular
} from "@fluentui/react-icons";
import './Geosamples.css';
import { BaseGeosample, EvaData, ManagerAction } from "./GeosampleTypes.tsx";
import GeosampleMap from "./GeosampleMap.tsx"

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
    flexGrow: "1",
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
  circle: {
    width: "25px",
    height: "25px",
    fontSize: "12.5px",
    color: "#fff",
    lineHeight: "25px",
    textAlign: "center",
    backgroundColor: "#006FD7",
    ...shorthands.borderRadius("50px"),
  }
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
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="sio2" readOnly={true} value={sample.data.SiO2.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{fontSize: "12.5px", textAlign:"center"}} htmlFor="tio2">TiO<sub>2</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="tio2" readOnly={true} value={sample.data.TiO2.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#EB5757", fontSize: "12.5px", textAlign:"center"}} htmlFor="al2o3">Al<sub>2</sub>O<sub>3</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="al2o3" readOnly={true} value={sample.data.Al2O3.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor="feo">FeO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="feo" readOnly={true} value={sample.data.FeO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#2D9CDB", fontSize: "12.5px", textAlign:"center"}} htmlFor="mno">MnO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="mno" readOnly={true} value={sample.data.MnO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#219653", fontSize: "12.5px", textAlign:"center"}} htmlFor="mgo">MgO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="mgo" readOnly={true} value={sample.data.MgO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#9B51E0", fontSize: "12.5px", textAlign:"center"}} htmlFor="cao">CaO<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="cao" readOnly={true} value={sample.data.CaO.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#F2C94C", fontSize: "12.5px", textAlign:"center"}} htmlFor="k2o">K<sub>2</sub>O</Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="k2o" readOnly={true} value={sample.data.K2O.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor="p2o3">P<sub>2</sub>O<sub>3</sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="p2o3" readOnly={true} value={sample.data.P2O3.toString()} />
      </div>
      <div className={styles.composition}>
        <Label style={{color: "#F2994A", fontSize: "12.5px", textAlign:"center"}} htmlFor="other">Other<sub></sub></Label>
        <Input style={{fontSize: "12px", padding: "0px 0px 0px 0px", background: "black"}} appearance="outline" id="other" readOnly={true} value={other.toString()} />
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
    let comp_colors = ['#BB6BD9', '#FFFFFF', '#EB5757', '#6FCF97', '#2D9CDB', '#219653', '#9B51E0', '#F2C94C', '#6FCF97'];
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

    if (other > 1) {
      compositions["Other"] = other;
      comp_colors.push('#F2994A');
    }

    for (var comp in compositions) {
      var value = compositions[comp];
      if (!isNaN(value)) {
          total += value;
      }
    }
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
  ready: boolean;
  geosample?: BaseGeosample;
}

const DetailScreen : React.FC<DetailScreenProps> = ({dispatch, ready, geosample}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedSample, setEditedSample] = useState<BaseGeosample | undefined>(geosample);
  const [currentSample, setCurrentSample] = useState<BaseGeosample | undefined>(geosample);

  useEffect(() => {
    setCurrentSample(geosample);
    setEditedSample(geosample);
  }, [geosample]);

  if (!ready || !geosample) {
    return (
      <div style={{background: "#141414"}}>
          <h4 style={{height: "53.111px", paddingLeft:'1rem', paddingRight:'1rem', display:'flex', justifyContent: 'space-between', marginTop: "0px", marginBottom: "0px", alignItems: "center"}}>
              <div>
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                  <Button style={{height: "30.556px"}} icon={<Map16Regular/>} disabled={true}>View on map</Button>
                  <Button style={{height: "30.556px"}} icon={<Edit16Regular/>} disabled={true}>Edit</Button>
                  <Button style={{height: "30.556px"}} icon={<Delete16Regular/>} disabled={true}>Delete</Button>
              </div>
          </h4>
          <Divider></Divider>
      </div>
    )
  }

  const color_options = [ ["Grey", "#7F7F7F"], ["Red", "#FF6060"], ["Blue", "#6091FF"], ["Green", "#76FF60"], ["Yellow", "#FCFF60"], ["Orange", "#FFA360"], ["Brown", "#804005"], ["Other", "Other"] ];
  const location_string = geosample.location.latitude.toFixed(6) + "˚ " + geosample.location.longitude.toFixed(6) + "˚";

  // TODO: make this send message to hololens if clicked
  const handleFavoriting = async (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
    console.log(editedSample);
    if (geosample) {   
      geosample.starred = !geosample.starred
      const res = await fetch("/api/geosamples/editGeosample", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: geosample
        })
      });
      if (res.status !== 200) {
        alert("Failed favoriting of sample");
        return;
      }  

      if (!geosample.starred) {
        dispatch({type: 'update', payload: geosample});
      }
      else {
        dispatch({type: 'update', payload: geosample});
      }
    }
  }


  const handleDelete = async (dispatch: React.Dispatch<ManagerAction>, geosample?: BaseGeosample) => {
    if (geosample) {
      const res = await fetch("/api/geosamples/deleteGeosample", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: geosample
        })
      });
      if (res.status !== 200) {
        alert("Failed to delete sample");
        return;
      }

      dispatch({type: 'delete', payload: geosample})
      dispatch({type: 'deselect'})
    }
  }

  const handleSave = async (dispatch: React.Dispatch<ManagerAction>, edited_sample?: BaseGeosample) => {    if (edited_sample) {
      const res = await fetch("/api/geosamples/editGeosample", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: editedSample
        })
      });
      // console.log(res.status)
      if (res.status !== 200) {
        alert("Failed to save edited sample");
        setCurrentSample(geosample);
        setEditedSample(geosample);
        setEdit(false);
        return;
      }
      dispatch({type: 'update', payload: edited_sample});
      setCurrentSample(editedSample);
      setEdit(false);
    }
  }

  const handleCancel = () => {
    setCurrentSample(geosample);
    setEditedSample(geosample);
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

  // TODO: change fonts!!!!!!!

  const splitTimeString: (input: string) => [string, string] = (input) => {
    // Define the regex pattern to match date and time
    const regex = /^(\d{1,2}\/\d{1,2}\/\d{4}) (\d{1,2}:\d{2} [AP]M)$/;

    // Apply the regex to the string
    const match = input.match(regex);
      // const match = input.match(/(.*) (.*? .*?)/);
      if (match) {
          return [match[1], match[2]]; // match[1] is the part before the second space
      }
      return [input, " "]; // In case the regex does not find two parts
  };

  return (
    <div>
        <div>
          <h4 style={{height: "53.111px", background: "#141414", paddingLeft:'1rem', paddingRight:'1rem', display:'flex', justifyContent: 'space-between', marginTop: "0px", marginBottom: "0px"}}>
              <div style={{ display: 'flex', alignItems: 'center', gap:'10px' }}>
                <Input style={{border: "0px", flexGrow: "1", fontSize: "17.5px", font: "bold", marginLeft:"-10px", background: edit ? "" : "#141414"}} 
                       appearance="outline" 
                       id="geosample_name" 
                       readOnly={!edit} 
                       defaultValue={geosample.eva_data.name}
                       value={edit ? editedSample?.eva_data.name : currentSample?.eva_data.name || ''} 
                       onChange={(e) => handleChange('eva_data', e.target.value)} />
                <Button icon={geosample.starred ? <Star16Filled style={{color:"#EAA300", flexGrow: "1"}}/> : <Star16Regular />} onClick={() => handleFavoriting(dispatch, geosample)}></Button>
              </div>
              <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                  <Button style={{height: "30.556px"}} icon={<Map16Regular/>}>View on map</Button>
                  <Button style={{height: "30.556px"}} icon={<Edit16Regular/>} onClick={() => setEdit(!edit)}>Edit</Button>
                  <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger disableButtonEnhancement>
                      <Button style={{height: "30.556px"}} icon={<Delete16Regular/>}>Delete</Button>
                    </PopoverTrigger>

                  <PopoverSurface aria-labelledby="delete_screen">
                    <div style={{display: "flex", marginTop: "-10px"}}>
                      <h3 style={{width: "175px"}} id="delete_text">
                        Delete {geosample.eva_data.name}?
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
                              onClick={() => handleDelete(dispatch, geosample)}>Delete</Button>
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
                  <Option text="Polygon">
                      <PentagonRegular/> Polygon 
                  </Option>
                  <Option text="Cube">
                      <Square16Regular/> Cube 
                  </Option>
                  <Option text="Sphere">
                      <Circle16Regular/> Sphere 
                  </Option>
                  <Option text="Ellipsoid">
                      <Oval16Regular/> Ellipsoid 
                  </Option>
                  <Option text="Cylinder">
                    <ColumnSingle16Regular/> Cylinder
                  </Option>
                  <Option text="Cone">
                      <Cone16Regular/> Cone
                  </Option>
                  <Option text="Crystalline">
                    <Diamond16Regular/> Crystalline
                  </Option>
                  <Option text="Irregular">
                    <Cloud16Regular/> Irregular
                  </Option>
                  <Option text="Unknown">
                      <Question16Regular/> Unknown
                  </Option>
              </Dropdown> ) : <Input style={{background: "black"}} appearance="outline" id="shape_dropdown" readOnly={true} value={currentSample ? currentSample?.shape.charAt(0).toUpperCase() + currentSample?.shape.slice(1) : ""} />}
          </div>
          <div className={styles.root}>
              <Label htmlFor="color_dropdown">Color</Label>
              {edit ?     
                (<Dropdown
                  className={styles.dropdown}
                  aria-labelledby="color_dropdown"
                  id="color_dropdown"
                  value={edit ? editedSample?.color : currentSample?.color || "Other"}
                  onOptionSelect={(e, data) => handleOption('color', data.optionText)}
                >
                  {color_options.map((option) => (
                    <Option text={option[1]}>
                      {option[0]}
                    </Option>
                  ))}
                </Dropdown>) : <Input style={{background: "black"}} appearance="outline" id="color_dropdown" readOnly={true} value={currentSample ? currentSample?.color.charAt(0).toUpperCase() + currentSample?.color.slice(1) : ""} /> }
          </div>
          <div className={styles.field}>
            <Label htmlFor="rock_type">Rock Type<sub></sub></Label>
            <Input style={{background: "black"}} appearance="outline" id="rock_type" readOnly={true} value={geosample.rock_type} />
          </div>
          <div className={styles.field}>
            <Label htmlFor="sample_id">ID<sub></sub></Label>
            <Input style={{background: "black"}} appearance="outline" id="sample_id" readOnly={true} value={geosample.eva_data.id.toString()} />
          </div>
        </div>
        <div className={styles.line}>
          <div style={{display: "flex", flexDirection: "column", flexGrow: "1"}}>
            <Label htmlFor="description">Description<sub></sub></Label>
            <Textarea style={{height: "120px", background: edit ? "" : "black"}} appearance="outline" id="description" readOnly={!edit} defaultValue={geosample.description} value={edit ? editedSample?.description : currentSample?.description || ''}  onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <img src={`data:image/jpeg;base64,${geosample.photo_jpg}`} height={143.8} width={230}/>
        </div>
        <div className={styles.line}>
          <CompositionVisualization sample={geosample.eva_data}/>
            <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "30%" }}>              
              <Label htmlFor="location">Location<sub></sub></Label>
              <Input style={{background: "black"}} contentBefore={<Location16Regular/>} appearance="outline" id="location" readOnly={true} value={location_string} />
            </div>
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "20%" }}>
              <Label htmlFor="time">Time<sub></sub></Label>
              <Input style={{background: "black"}} contentBefore={<Clock16Regular/>} appearance="outline" id="time" readOnly={true} value={splitTimeString(geosample.time)[1]} />
            </div>
        </div>
        <div className={styles.line}>
          <CompositionValues sample={geosample.eva_data} />
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "30%" }}>
              <Label htmlFor="date">Date<sub></sub></Label>
              <Input style={{background: "black"}} contentBefore={<Calendar16Regular/>} appearance="outline" id="date" readOnly={true} value={splitTimeString(geosample.time)[0]} />
            </div>
           <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", maxWidth: "20%" }}>
              <Label htmlFor="zone">Zone<sub></sub></Label>
              <Input style={{background: "black"}} contentBefore={<Tag16Regular/>} appearance="outline" id="zone" readOnly={true} value={String.fromCharCode(Number(geosample.zone_id))} />
            </div>
        </div>
        { edit && <div style={{paddingRight: "1rem", display: "flex", float: "right", gap: "15px", marginBottom: "1rem"}}>
                    <Button style={{background: "#009B00"}} iconPosition="before" icon={<Save16Regular/>} onClick={() => handleSave(dispatch, editedSample)}>Save</Button>
                    <Button onClick={() => handleCancel()}>Cancel</Button>
                 </div>
        }
    </div>
  );
};

export default DetailScreen;