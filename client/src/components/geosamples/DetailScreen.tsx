import * as React from "react";
import {
  Dropdown,
  Input,
  Label,
  makeStyles,
  Option,
  shorthands,
  tokens,
  useId,
} from "@fluentui/react-components";
import { 
  Circle16Regular, 
  Square16Regular, 
  Hexagon16Regular, 
  Triangle16Regular, 
  Question16Regular,
  Location16Regular,
  Calendar16Regular, 
  Clock16Regular
} from "@fluentui/react-icons"
import tempImage from '../../assets/temp_sample_pic.png' 
import './Geosamples.css';

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

const CompositionValues = () => {
  const styles = useStyles();
  const outlineId = useId("");

  return (
    <div style={{display: "flex"}}>
      <div className={ styles.composition}>
          <Label style={{color: "#BB6BD9", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>SiO<sub>2</sub></Label>
          <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>TiO<sub>2</sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#EB5757", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>Ai<sub>2</sub>O<sub>3</sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>FeO<sub></sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#2D9CDB", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>MnO<sub></sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#219653", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>MgO<sub></sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#9B51E0", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>CaO<sub></sub></Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#F2C94C", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>K<sub>2</sub>O</Label>
        <Input appearance="outline" id={outlineId} />
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#6FCF97", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>P<sub>2</sub>O<sub>3</sub></Label>
        <Input appearance="outline" id={outlineId}/>
      </div>
      <div className={ styles.composition}>
        <Label style={{color: "#F2994A", fontSize: "12.5px", textAlign:"center"}} htmlFor={outlineId}>Other<sub></sub></Label>
        <Input appearance="outline" id={outlineId} />
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
  items: number[];
  colours: string[];
}

const CompositionVisualization: React.FC<CompositionVisualizationProps> = ({ items, colours }) => {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i];
    }

    return (
      <div style={{marginRight:"-14px"}}>
        <p style={{ marginTop:"0rem"}}>Composition</p>
          <div className="chart">
              {items.map((item, index) => {
                  const value = Math.floor(calculate(item, 0, total, 0, 100));
                  const classes: string[] = [];
                  if (index === 0) classes.push('start');
                  if (index === items.length - 1) classes.push('end');
                  return (
                      <div
                          key={index}
                          className={classes.join(' ')}
                          style={{
                              width: `${value}%`,
                              backgroundColor: colours[index],
                          }}
                      />
                  );
              })}
          </div>
      </div>
    );
}

export const DetailScreen = () => {
  const dropdownIdShape = useId("dropdown-default");
  const dropdownIdColor = useId("dropdown-default");
  const outlineId = useId("");
  const options = [
    "Brown",
    "Copper Red",
    "Black",
    "Multi-color"
  ];
  const styles = useStyles();
    // Sample data and labels
  var items = [300, 80, 270, 90, 100, 20, 160, 100, 90, 70];
  var colours = ['#BB6BD9', '#FFFFFF', '#EB5757', '#6FCF97', '#2D9CDB', '#219653', '#9B51E0', '#F2C94C', '#6FCF97', '#F2994A'];

  return (
    <div style={{width: "100%"}}>
        <div style={{display:"flex", marginBottom:'1rem', justifyContent: 'space-between'}}>
          <div className={styles.root}>
              <Label id={dropdownIdShape}>Shape</Label>
              <Dropdown
                  className={styles.dropdown}
                  aria-labelledby={dropdownIdShape}
                  placeholder="Select"
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
              </Dropdown>
          </div>
          <div className={styles.root}>
              <Label id={dropdownIdColor}>Color</Label>
              <Dropdown
                  className={styles.dropdown}
                  aria-labelledby={dropdownIdColor}
                  placeholder="Select"
              >
              {options.map((option) => (
              <Option key={option}>
                  {option}
              </Option>
              ))}
              </Dropdown>
          </div>
          <div className={ styles.field}>
            <Label htmlFor={outlineId}>Rock Type<sub></sub></Label>
            <Input appearance="outline" id={outlineId} />
          </div>
          <div className={ styles.field}>
            <Label htmlFor={outlineId}>ID<sub></sub></Label>
            <Input appearance="outline" id={outlineId} />
          </div>
        </div>
        <div className={styles.line}>
          <div style={{display: "flex", flexDirection: "column"}}>
            <Label htmlFor={outlineId}>Description<sub></sub></Label>
            <Input style={{width: "452.5px", height: "110px"}} appearance="outline" id={outlineId} />
          </div>
          <img src={tempImage} height={134.5} width={220}/>
        </div>
        <div style={{gap: "10px"}} className={styles.line}>
          <CompositionVisualization items={items} colours={colours}/>
          <div className={ styles.quad}>
            <Label htmlFor={outlineId}>Location<sub></sub></Label>
            <Input contentBefore={<Location16Regular/>} appearance="outline" id={outlineId} />
          </div>
          <div className={ styles.quad}>
            <Label htmlFor={outlineId}>Time<sub></sub></Label>
            <Input contentBefore={<Clock16Regular/>} appearance="outline" id={outlineId} />
          </div>
        </div>
        <div style={{display: "flex"}}>
          <div className={styles.line}>
            <CompositionValues/>
            <div style={{marginLeft: "17.5px", display:"flex", gap: "15px"}}>
              <div className={ styles.quad}>
                <Label htmlFor={outlineId}>Date<sub></sub></Label>
                <Input contentBefore={<Calendar16Regular/>} appearance="outline" id={outlineId} />
              </div>
              <div className={ styles.quad}>
                <Label htmlFor={outlineId}>Zone<sub></sub></Label>
                <Input appearance="outline" id={outlineId} />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};