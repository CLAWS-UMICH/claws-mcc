// ARWebConnection.ts
import Base, {RouteEvent} from "../Base";
import { Db } from 'mongodb';
import { readdirSync, readFileSync } from 'fs';
import express, { Request, Response } from 'express';

/*
 TODO:
 - Implement frontend function to return Image ID and/or string (might need a function to do combine functionality)
 - Call these functions to add the screens to the database and tell AR that the aspect ratio is 1 / 1:  "add screens to collection" function
 - Remember that you can delete images using delete image by ScreenID and i can add any functions to add screens individually by index of the hardcoded array, or by passing in a particular object, filepath or however u want

 */ 

//-----------
// STRUCTURE
//-----------
// Defines the structure for each string to be sent to the HUD (img-- converted to binary)
interface ScreenInfo {
    title: string; // Format: type_descriptor_enumeration
    img_binary: Buffer; // Good for handling binary data in Node.js!
    id: string; // ID representing the image
    height: number;
    width: number;
}

//----------
// GLOBALS
//-----------

const IMG_ASPECT_RATIO = 1 / 1;

const presetScreens: ScreenInfo[] = [
    {
        title: 'connection_instr_1.png',
        img_binary: readImageFile('./assets/connection_instr_1.png'),
        id: 'aB2cD',
        height: 614,
        width: 614
    },
    {
        title: 'pressure_instr_2.png',
        img_binary: readImageFile('./assets/pressure_instr_2.png'),
        id: 'eFgHi',
        height: 768,
        width: 768
    },
    {
        title: 'suit_instr_1.png',
        img_binary: readImageFile('./assets/suit_instr_1.png'),
        id: 'kLmNo',
        height: 768,
        width: 768
    },
    {
        title: 'hardware_instr_1.png',
        img_binary: readImageFile('./assets/hardware_instr_1.png'),
        id: 'pQrSt',
        height: 614,
        width: 614
    },
    {
        title: 'rover_instr_1.png',
        img_binary: readImageFile('./assets/rover_instr_1.png'),
        id: 'uVwXy',
        height: 614,
        width: 614
    },
    {
        title: 'terrain_visual_1.png',
        img_binary: readImageFile('./assets/terrain_visual_1.png'),
        id: 'z12a3',
        height: 768,
        width: 768
    },
    {
        title: 'mars_instr_1.png',
        img_binary: readImageFile('./assets/mars_instr_1.png'),
        id: '45abc',
        height: 614,
        width: 614
    },
    {
        title: 'rover_instr_2.png',
        img_binary: readImageFile('./assets/rover_instr_2.png'),
        id: 'd1e2f',
        height: 768,
        width: 768
    },
    {
        title: 'terrain_visual_2.png',
        img_binary: readImageFile('./assets/terrain_visual_2.png'),
        id: 'ghi12',
        height: 768,
        width: 768
    },
];

//----------
// UTILITIES
//-----------

// FUNC: Reads image file and converts it to binary data to be sent to HUD
export function readImageFile(filePath: string): Buffer {
    return readFileSync(filePath);
}

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

    public routes = [
        {
            path: '/api/astronaut/:screens',
            method: 'get',
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
    public async sendAllScreensToFrontend(req: Request, res: Response): Promise<void> { 
        try {
            const screensCollection = this.db.collection('screens');
            const allScreens = await screensCollection.find().toArray();

            res.send({
                type: 'PICTURE',
                use: 'GET',
                data: allScreens,
            });

            console.log('All screens sent to API successfully! Slay!');
        } catch (error) {
            console.error('Error sending screens to API:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    

    // FUNC: Send a specific ScreenInfo object to AR over our WebSocket
    public async sendScreenToAR(imageID: string, astronautID: number): Promise<void> {
        try {
            const screensCollection = this.db.collection('screens'); // Get collection of ScreenInfo objects
            const screen = await screensCollection.findOne({ id: imageID }); // Find the screen by ID
        
            if (screen) {
                // Send the screen to the 'AR' WebSocket target
                this.dispatch('AR', {
                    id: astronautID, // Assuming astronautID is the ID of the astronaut
                    type: 'PICTURE',
                    use: 'PUT',
                    data: {
                        title: screen.title,
                        img_binary: screen.img_binary                    },
                });

                console.log('Screen sent to AR successfully! Slay!');
            } else {
                console.error('Screen not found with ID:', imageID);
            }
        } catch (error) {
            console.error('Error sending screen to AR:', error);
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