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
import { Link } from 'react-router-dom';

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
    marginLeft: "33.33%",
  },
  tab: {
    fontSize: '15px',
  },
});

const NavBar: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <TabList className="NavBar" defaultSelectedValue='taskTab'>
        <Tab icon={<ClipboardTaskList />} value='taskTab'>
          <Link to="/tasks">Tasks</Link>
        </Tab>
        <Tab icon={<Book />} value='vitalsTab'>
          <Link to="/vitals">Vitals</Link>
        </Tab>
        <Tab icon={<Hexagon />} value='samplesTab'>
          <Link to="/samples">Samples</Link>
        </Tab>
        <Tab icon={<Location />} value='navigationTab'>
          <Link to="/navigation">Navigation</Link>
        </Tab>
        <Tab icon={<Truck />} value='roverTab'>
          <Link to="/rover">Rover</Link>
        </Tab>
        <Tab icon={<Accessibility />} value='suitsTab'>
          Suits
        </Tab>
        <Tab icon={<Chat />} value='messagesTab'>
          <Link to="/messages">Messages</Link>
        </Tab>
        <Tab icon={<Document />} value='connectTab'>
          <Link to="/connect">Connect</Link>
        </Tab>
      </TabList>
      <Divider />
    </div>
  );
};

export default NavBar;