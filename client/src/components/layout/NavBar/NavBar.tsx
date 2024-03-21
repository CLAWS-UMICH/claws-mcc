import React from "react";
import {
  SelectTabData,
  SelectTabEvent,
  Divider,
  makeStyles,
  Tab,
  TabList,
} from "@fluentui/react-components";
import {
  bundleIcon,
  ClipboardTaskListLtr24Regular,
  ClipboardTaskListLtr24Filled,
  BookPulse20Regular,
  BookPulse20Filled,
  Hexagon20Regular,
  Hexagon20Filled,
  Chat20Regular,
  Chat20Filled,
  Location20Regular,
  Location20Filled,
  VehicleTruckCube20Regular,
  VehicleTruckCube20Filled,
  DocumentText20Regular,
  DocumentText20Filled,
  Accessibility20Regular,
  Accessibility20Filled,
} from "@fluentui/react-icons";
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'

const ClipboardTaskList = bundleIcon(ClipboardTaskListLtr24Filled, ClipboardTaskListLtr24Regular);
const Book = bundleIcon(BookPulse20Filled, BookPulse20Regular);
const Hexagon = bundleIcon(Hexagon20Filled, Hexagon20Regular);
const Chat = bundleIcon(Chat20Filled, Chat20Regular);
const Location = bundleIcon(Location20Filled, Location20Regular);
const Truck = bundleIcon(VehicleTruckCube20Filled, VehicleTruckCube20Regular); // change to rover icon
const Document = bundleIcon(DocumentText20Filled, DocumentText20Regular); // change to guides icon
const Accessibility = bundleIcon(Accessibility20Filled, Accessibility20Regular); // change to suits icon

const useStyles = makeStyles({
  root: {
    // alignItems: "right",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // marginTop: "10px",
    // ...shorthands.padding("50px", "20px"),
    rowGap: "5px",
    backgroundColor: '#000000',
    // marginLeft: "33.33%",
    height: "45px"
  },
  tab: {
    fontSize: '15px',
  },
});

const NavBar: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const handleTabSelect = (e: SelectTabEvent) => {
    navigate(e.currentTarget['value']);
  };

  return (
    <div className={styles.root}>
      <TabList className="NavBar" defaultSelectedValue='taskTab'>
        <Tab onClick={handleTabSelect} icon={<ClipboardTaskList />} value='/tasks'>
          <span>Tasks</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Book />} value='/vitals'>
          <span>Vitals</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Hexagon />} value='/samples'>
          <span>Samples</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Location />} value='/navigation'>
          <span>Navigation</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Truck />} value='/rover'>
          <span>Rover</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Accessibility />} value='/suits'>
          Suits
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Chat />} value='/messages'>
          <span>Messages</span>
        </Tab>
        <Tab onClick={handleTabSelect} icon={<Document />} value='/connect'>
          <span>Connect</span>
        </Tab>
      </TabList>
      <Divider />
    </div>
  );
};

export default NavBar;