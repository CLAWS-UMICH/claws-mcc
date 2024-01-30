import React, {useState} from "react";
import {
    SelectTabData,
    SelectTabEvent,
    Divider,
  makeStyles,
  shorthands,
  Tab,
  TabList,
} from "@fluentui/react-components";
import {
  CalendarMonthRegular,
  CalendarMonthFilled,
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
import WaypointManager from "../../waypoints/WaypointManager.tsx";
import GeosampleManager from "../../geosamples/Geosamples.tsx";
import { Communication } from "../../comms/Communication.tsx";

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
    alignItems: "right",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    // marginTop: "10px",
    // ...shorthands.padding("50px", "20px"),
    rowGap: "5px",
  },
});

export const NavBar = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = useState<any>('conditions');

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  // need to add more values
  const renderSelectedTab = () => {
    switch (selectedValue) {
        case "taskTab":
            return <WaypointManager/>;
        case "navigationTab":
            return <WaypointManager/>;
        case "samplesTab":
            return <GeosampleManager/>;
        case "communicationsTab":
          return <Communication/>;
        default:
            break;
    }
    console.log(selectedValue);
  }

  const renderTabs = () => {
    return (
      <>
        <Tab icon={<ClipboardTaskList />} value="taskTab">
          Tasks
        </Tab>
        <Tab icon={<Book />} value="vitalsTab">
          Vitals
        </Tab>
        <Tab icon={<Hexagon />} value="samplesTab">
          Samples
        </Tab>
        <Tab icon={<Location />} value="navigationTab">
          Navigation
        </Tab>
        <Tab icon={<Truck />} value="roverTab">
          Rover
        </Tab>
        <Tab icon={<Person />} value="suitsTab">
          Suits
        </Tab>
        <Tab icon={<Chat />} value="messagesTab">
          Messages
        </Tab>
        <Tab icon={<Document />} value="communicationsTab">
          Communications
        </Tab>
      </>
    );
  };

  // need to change the default page to something
  return (
    <div className={styles.root}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} defaultSelectedValue="taskTab">{renderTabs()}</TabList>
      <Divider/>
    {renderSelectedTab()}
    </div>
  );
};