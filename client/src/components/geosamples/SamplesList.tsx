// DropdownMenu.tsx
import React from 'react';
import { 
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel
} from '@fluentui/react-components';

// interface DropdownMenuProps {
//     header: string;
//     samples: string[];
// }


const SamplesList = () => {
    return (
        <Accordion multiple collapsible>
            <AccordionItem value='1'>
                <AccordionHeader expandIconPosition="end">
                    Zone A
                </AccordionHeader>
                <AccordionPanel>
                    <div>Geo Sample 1</div>
                </AccordionPanel>
                <AccordionPanel>
                    <div>Geo Sample 2</div>
                </AccordionPanel>
            </AccordionItem>
            <AccordionItem value='2'>
                <AccordionHeader expandIconPosition="end">
                    Zone B
                </AccordionHeader>
                <AccordionPanel>
                    <div>Geo Sample 3</div>
                </AccordionPanel>
                <AccordionPanel>
                    <div>Geo Sample 4</div>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
        // <Menu>
        //     <MenuTrigger>
        //         <Button>{header}</Button>
        //     </MenuTrigger>

        //     <MenuPopover>
        //         <MenuList>
        //             {samples.map((sample, index) => (
        //                 <MenuItem key={index}>{sample}</MenuItem>
        //             ))}
        //         </MenuList>
        //     </MenuPopover>
        // </Menu>
    );
}

export default SamplesList;
