// Geosamples.tsx
import React from 'react';
import SidebarMenu from './SidebarMenu.tsx';
import SamplesList from './SamplesList.tsx';
import {
    Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";


const useStyles = makeStyles({
  root: {
    ...shorthands.border("2px", "solid", "#ccc"),
    ...shorthands.overflow("hidden"),
    display: "flex",
    height: "500px",
    backgroundColor: "#fff",
  },

  content: {
    ...shorthands.flex(1),
    ...shorthands.padding("16px"),
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

const GeosampleManager: React.FC = () => {
    // const dropdownMenus = [
    //     <DropdownMenu header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} />,
    //     <DropdownMenu header="Header 2" samples={['Link 2.1', 'Link 2.2']} />,
    // ];
    const styles = useStyles();

    return (
        <div className={styles.root}>
        <InlineDrawer separator open>
            <DrawerHeader>
            <DrawerHeaderTitle>Samples</DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <SamplesList/>
            </DrawerBody>
        </InlineDrawer>
        <div className={styles.content}>
            <p>This is the page content</p>
        </div>
        </div>
    );

    // return (
    //     <DropdownMenu/>
    //     // <SidebarMenu dropdownMenus={dropdownMenus} />
    // );
};

export default GeosampleManager;
