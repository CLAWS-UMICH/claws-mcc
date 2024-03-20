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
        img_binary: readImageFile('./api/routes/assets/connection_instr_1.png'),
        id: 'aB2cD',
        height: 614,
        width: 614
    },
    {
        title: 'pressure_instr_2.png',
        img_binary: readImageFile('./api/routes/assets/pressure_instr_2.png'),
        id: 'eFgHi',
        height: 768,
        width: 768
    },
    {
        title: 'suit_instr_1.png',
        img_binary: readImageFile('./api/routes/assets/suit_instr_1.png'),
        id: 'kLmNo',
        height: 768,
        width: 768
    },
    {
        title: 'hardware_instr_1.png',
        img_binary: readImageFile('./api/routes/assets/hardware_instr_1.png'),
        id: 'pQrSt',
        height: 614,
        width: 614
    },
    {
        title: 'rover_instr_1.png',
        img_binary: readImageFile('./api/routes/assets/rover_instr_1.png'),
        id: 'uVwXy',
        height: 614,
        width: 614
    },
    {
        title: 'terrain_visual_1.png',
        img_binary: readImageFile('./api/routes/assets/terrain_visual_1.png'),
        id: 'z12a3',
        height: 768,
        width: 768
    },
    {
        title: 'mars_instr_1.png',
        img_binary: readImageFile('./api/routes/assets/mars_instr_1.png'),
        id: '45abc',
        height: 614,
        width: 614
    },
    {
        title: 'rover_instr_2.png',
        img_binary: readImageFile('./api/routes/assets/rover_instr_2.png'),
        id: 'd1e2f',
        height: 768,
        width: 768
    },
    {
        title: 'terrain_visual_2.png',
        img_binary: readImageFile('./api/routes/assets/terrain_visual_2.png'),
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
            type: 'SEND_SCREEN_TO_AR',
            handler: this.sendScreenToAR.bind(this)
        }
    ]

    public routes = [
        {
            path: '/api/screens',
            method: 'get',
            handler: this.sendAllScreensToFrontend.bind(this)
        },
        {
            path: '/api/sendimage',
            method: 'post',
            handler: this.sendScreenToAR.bind(this)
        },
        {
            path: '/api/highlightbutton',
            method: 'post',
            handler: this.highlightButton.bind(this)
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
    public async sendScreenToAR(req: Request, res: Response): Promise<void> {
        console.log('imageID: ' + req.body.data["imageID"]);
        console.log('astronautID: ' + req.body.data["astronautID"]);

        // Parse imageID and astronautID from the request body
        const imageID = req.body.data["imageID"];
        const astronautID = parseInt(req.body.data["astronautID"], 20);

        try {
            const screensCollection = this.db.collection('screens'); // Get collection of ScreenInfo objects
            const screen = await screensCollection.findOne({ id: imageID }); // Find the screen by ID

            // Additional checks to validate astronautID
            if (astronautID < 0 || astronautID > 10) {
                throw new Error('Invalid astronaut ID. Astronaut ID must be between 0 and 10.');
            }
        
            if (screen) {
                // Send the screen to the 'AR' WebSocket target
                this.dispatch('AR', {
                    id: astronautID,
                    type: 'PICTURE',
                    use: 'PUT',
                    data: {
                        title: screen.title,
                        img_binary: screen.img_binary                    
                    },
                });
                
                res.status(200).json({ message: 'Screen sent to AR successfully!' });
            } else {
                res.status(404).json({ error: 'Screen not found with ID: ' + imageID });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    public async highlightButton(req: Request, res: Response): Promise<void> {
        console.log('buttonID: ' + req.body.data["buttonID"]);
        console.log('astronautID: ' +req.body.data["astronautID"]);

        // Parse buttonID and astronautID from the request body
        const buttonID = parseInt(req.body.data["buttonID"], 10);
        const astronautID = parseInt(req.body.data["astronautID"], 20);


        // Check for parsing errors or NaN values
        if (isNaN(buttonID) || isNaN(astronautID)) {
            res.status(400).json({ error: 'Invalid button ID or astronaut ID. Must be a number.' });
            return;
        }
    
        try {
            // Additional checks to validate buttonID and astronautID
            if (buttonID < 0 || buttonID > 5) {
                throw new Error('Invalid button ID. Button ID must be between 0 and 5.');
            }
            if (astronautID < 0 || astronautID > 10) {
                throw new Error('Invalid astronaut ID. Astronaut ID must be between 0 and 10.');
            }
    
            // Send information about the highlighted button to the AR WebSocket target
            this.dispatch('AR', {
                id: astronautID,
                type: 'BUTTON_HIGHLIGHT',
                use: 'PUT',
                data: {
                    button_id: buttonID
                },
            });
    
            // If everything is successful, send a success response back
            res.status(200).json({ message: 'Button highlighted in AR successfully!' });
    
        } catch (error) {
            console.error('Error highlighting button in AR:', error);
            res.status(500).json({ error: error.message });
        }
    }


    // FUNC: Tell AR to highlight a specific button for a specific astronaut in AR over our WebSocket
    // This happens when the below function is used:   buttonID: [object Object]
    //                                                 astronautID: [object Object]
    //                                                 Invalid button ID. Button ID must be between 0 and 5.
    // public async highlightButton(buttonID: number, astronautID: number): Promise<void> {
        
    //     console.log('buttonID: ' + buttonID);
    //     console.log('astronautID: ' + astronautID);

    //     if (buttonID === null) {
    //         console.error('Invalid button ID. Cannot highlight a null button.');
    //         return;
    //     }

    //     try {
    //         // Additional checks to validate buttonID and astronautID
    //         if (buttonID < 0 || buttonID > 5) {
    //             console.error('Invalid button ID. Button ID must be between 0 and 5.');
    //             return;
    //         }

    //         if (!(buttonID >= 0 && buttonID <= 5)) {
    //             console.error('Invalid button ID. Button ID must be between 0 and 5.');
    //             return;
    //         }

    //         if (astronautID !== 1 && astronautID !== 2) {
    //             console.error('Invalid astronaut ID. Astronaut ID must be either 1 or 2.');
    //             return;
    //         }

    //         // Send information about the highlighted button to the AR WebSocket target
    //         this.dispatch('AR', {
    //             id: astronautID, // Assuming astronautID is the ID of the astronaut
    //             type: 'BUTTON_HIGHLIGHT',
    //             use: 'PUT',
    //             data: {
    //                 button_id: buttonID
    //             },
    //         });

    //         console.log('Button highlighted in AR successfully!');
    //     } catch (error) {
    //         console.error('Error highlighting button in AR:', error);
    //         throw error; // Propagate the error if necessary
    //     }
    // }
    

    
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