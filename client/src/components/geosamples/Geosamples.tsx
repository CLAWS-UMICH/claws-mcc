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
import SearchBox from '../common/SearchBox/SearchBox.tsx'


const useStyles = makeStyles({
  root: {
    ...shorthands.border("2px", "solid", "#ccc"),
    ...shorthands.overflow("hidden"),
    display: "flex",
    height: "100vh",
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
    const dropdownMenus = [
        <SamplesList header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} />,
        <SamplesList header="Header 2" samples={['Link 2.1', 'Link 2.2']} />,
    ];
    const styles = useStyles();
    const menuData = [
    {
        header: 'Header 1',
        samples: ['Link 1.1', 'Link 1.2', 'Link 1.3'],
    },
    {
        header: 'Header 2',
        samples: ['Link 2.1', 'Link 2.2'],
    },
    ];
    const dropdownTest = {
        header: 'test drop',
        samples: ['1', '2', '3'],
    };

    return (
        <SidebarMenu dropdownMenus={dropdownMenus}/>
        // <div className={styles.root}>
        // <InlineDrawer separator open>
        //     <DrawerHeader>
        //     <DrawerHeaderTitle>Samples</DrawerHeaderTitle>
        //     </DrawerHeader>
        //     <DrawerBody>
        //         <SearchBox/>
        //         <SamplesList/>
        //     </DrawerBody>
        // </InlineDrawer>
        // <div className={styles.content}>
        //     <p>This is the page content</p>
        // </div>
        // </div>
    );

    // return (
    //     <DropdownMenu/>
    //     // <SidebarMenu dropdownMenus={dropdownMenus} />
    // );
};

export default GeosampleManager;