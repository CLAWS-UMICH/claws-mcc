import * as React from "react";
import {
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

const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
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
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: "10px",
    // ...shorthands.padding("50px", "20px"),
    rowGap: "20px",
  },
});

export const WithIcon = () => {
  const styles = useStyles();

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
        <Tab icon={<Document />} value="guidesTab">
          Guides
        </Tab>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <TabList defaultSelectedValue="tab2">{renderTabs()}</TabList>
    </div>
  );
};