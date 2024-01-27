// ARWebConnection.ts
import Base, {RouteEvent} from "../Base";
import { Db } from 'mongodb';
import { readdirSync, readFileSync } from 'fs';
import express, { Request, Response } from 'express';

/*
 * Questions to consider:
1) What format do you want your data in? Right now it's just in Mongo's default format
2) Computing aspect ratio-- hardcode or write a function?
3) Confirm type of sending over WebSocket
4) Confirm that binary data is okay to render for FRONTEND as well, or consider adding a new field (filepath) to screen info
5) Would you rather a traditional API request or to use the infrastructure set up for WebSocket?
 */ 

//-----------
// STRUCTURE
//-----------
// Defines the structure for each string to be sent to the HUD (img-- converted to binary)
interface ScreenInfo {
    title: string; // Format: type_descriptor_enumeration
    aspect_ratio: number; 
    img_binary: Buffer; // Good for handling binary data in Node.js!
    id: string; // ID representing the image
}

//----------
// GLOBALS
//-----------

const presetScreens: ScreenInfo[] = [
    {
        title: 'connection_instr_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/connection_instr_1.jpg'),
        id: 'aB2cD',
    },
    {
        title: 'pressure_instr_2.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/pressure_instr_2.jpg'),
        id: 'eFgHi',
    },
    {
        title: 'suit_instr_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/suit_instr_1.jpg'),
        id: 'kLmNo',
    },
    {
        title: 'hardware_instr_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/hardware_instr_1.jpg'),
        id: 'pQrSt',
    },
    {
        title: 'rover_instr_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/rover_instr_1.jpg'),
        id: 'uVwXy',
    },
    {
        title: 'terrain_visual_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/terrain_visual_1.jpg'),
        id: 'z12a3',
    },
    {
        title: 'mars_instr_1.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/mars_instr_1.jpg'),
        id: '45abc',
    },
    {
        title: 'rover_instr_2.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/rover_instr_2.jpg'),
        id: 'd1e2f',
    },
    {
        title: 'terrain_visual_2.jpg',
        aspect_ratio: 1 / 1,
        img_binary: readImageFile('./assets/terrain_visual_2.jpg'),
        id: 'ghi12',
    },
];

//----------
// UTILITIES
//-----------

// FUNC: Reads image file and converts it to binary data to be sent to HUD
function readImageFile(filePath: string): Buffer {
    return readFileSync(filePath);
}
export { readImageFile }; // So other files can use this function (maybe frontend?)

//-----------
// CLASS DEFN.
//-----------
export default class ARWebConnection extends Base {
    public events: RouteEvent[] = [
        {
            type: 'GET_ALL_SCREENS',
            handler: this.sendAllScreensToFrontend.bind(this)
        }
    ]
    constructor(db: Db) {
        super(db); // Calls superclass constructor (in this case Base! Wooo!!)
    }

    // FUNC: Adds all the preset screens to the collection
    public async addScreensToCollection(): Promise<void> {
        try {
            if (presetScreens.length > 0) {
                await this.db.collection('screens').insertMany(presetScreens); // Wait until you insert all these screens to DB (need bc async function #lit)
                console.log('Images added to screens collection successfully #slay');
            } else {
                console.log('No images to insert :( ');
            }
        } catch (error) {
            console.error('Error adding images to collection :( b/c:', error);
        }
    }

    // FUNC: Send all ScreenInfo objects to FRONTEND over our WebSocket
    public async sendAllScreensToFrontend(): Promise<void> {
        try {
            const screensCollection = this.db.collection('screens'); // Get collection of ScreenInfo objects
            const allScreens = await screensCollection.find().toArray(); // Wait until you get all the objects and convert to array
    
            // Send the screens to the 'FRONTEND' WebSocket target
            this.dispatch('FRONTEND', {
                id: -1, // TODO: What should go here?
                type: 'SCREEN',
                use: 'GET',
                data: allScreens,
            });
    
            console.log('All screens sent to FRONTEND successfully! Slay!');
        } catch (error) {
            console.error('Error sending screens to FRONTEND:', error);
            throw error; // Propagate the error if necessary
        }
    }
    
    // UTIL FUNC: Delete a screen by its ID from the database's screens collection
    // USAGE:  arConnectionObject.deleteScreenById('3mmaCaN7ugg1e');
    public async deleteScreenById(id: string): Promise<void> {
        try {
            const screensCollection = this.db.collection('screens');
            await screensCollection.deleteOne({ id: id }); // Peace out image
            console.log(`Screen with ID ${id} deleted successfully!`); // Bye screen
        } catch (error) {
            console.error(`Error deleting image with ID ${id}:`, error);
        }
    }

}
