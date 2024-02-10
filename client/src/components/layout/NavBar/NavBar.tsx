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
  PersonStanding16Regular,
  PersonStanding16Filled,
} from "@fluentui/react-icons";

const ClipboardTaskList = bundleIcon(ClipboardTaskListLtr24Filled, ClipboardTaskListLtr24Regular);
const Book = bundleIcon(BookPulse20Filled, BookPulse20Regular);
const Hexagon = bundleIcon(Hexagon20Filled, Hexagon20Regular);
const Chat = bundleIcon(Chat20Filled, Chat20Regular);
const Location = bundleIcon(Location20Filled, Location20Regular);
const Truck = bundleIcon(VehicleTruckCube20Filled, VehicleTruckCube20Regular); // change to rover icon
const Document = bundleIcon(DocumentText20Filled, DocumentText20Regular); // change to guides icon
const Person = bundleIcon(PersonStanding16Filled, PersonStanding16Regular); // change to suits icon

interface NavBarProps {
  onTabSelect: (selectedValue: any) => void;
}

const useStyles = makeStyles({
  root: {
    alignItems: "right",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    rowGap: "5px",
    backgroundColor: '#000000',
  },
  tab: {
    fontSize: '15px',
  },
});

const NavBar : React.FC<NavBarProps> = ({ onTabSelect }) => {
  const styles = useStyles();

  const handleTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    onTabSelect(data.value);
  };

  // need to change the default page to something
  return (
    <div className={styles.root}>
      <TabList onTabSelect={handleTabSelect} defaultSelectedValue='taskTab'>        
        <Tab icon={<ClipboardTaskList />} value='taskTab'>
          Tasks
        </Tab>
        <Tab icon={<Book />} value='vitalsTab'>
          Vitals
        </Tab>
        <Tab icon={<Hexagon />} value='samplesTab'>
          Samples
        </Tab>
        <Tab icon={<Location />} value='navigationTab'>
          Navigation
        </Tab>
        <Tab icon={<Truck />} value='roverTab'>
          Rover
        </Tab>
        <Tab icon={<Person />} value='suitsTab'>
          Suits
        </Tab>
        <Tab icon={<Chat />} value='messagesTab'>
          Messages
        </Tab>
        <Tab icon={<Document />} value='connectTab'>
          Connect
        </Tab>
      </TabList>
      <Divider/>
    </div>
  );
};

export default NavBar;