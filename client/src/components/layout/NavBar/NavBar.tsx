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
  ClipboardTaskList16Regular,
  ClipboardTaskList16Filled,
  Book16Regular,
  Book16Filled,
  Hexagon16Regular,
  Hexagon16Filled,
  Chat16Regular,
  Chat16Filled,
  Location16Regular,
  Location16Filled,
  VehicleTruckCube20Regular,
  VehicleTruckCube20Filled,
  DocumentText16Regular,
  DocumentText16Filled,
  PersonStanding16Regular,
  PersonStanding16Filled,
} from "@fluentui/react-icons";
import { Link } from 'react-router-dom';

const ClipboardTaskList = bundleIcon(ClipboardTaskList16Filled, ClipboardTaskList16Regular);
const Book = bundleIcon(Book16Filled, Book16Regular);
const Hexagon = bundleIcon(Hexagon16Filled, Hexagon16Regular);
const Chat = bundleIcon(Chat16Filled, Chat16Regular);
const Location = bundleIcon(Location16Filled, Location16Regular);
const Truck = bundleIcon(VehicleTruckCube20Filled, VehicleTruckCube20Regular); // change to rover icon
const Document = bundleIcon(DocumentText16Filled, DocumentText16Regular); // change to guides icon
const Person = bundleIcon(PersonStanding16Filled, PersonStanding16Regular); // change to suits icon

const useStyles = makeStyles({
  root: {
    // alignItems: "right",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // marginTop: "10px",
    // ...shorthands.padding("50px", "20px"),
    rowGap: "5px",
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
        <Tab icon={<Person />} value='suitsTab'>
          <Link to="/suits">Suits</Link>
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