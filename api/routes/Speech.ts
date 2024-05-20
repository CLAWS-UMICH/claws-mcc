import { Db } from "mongodb";
import Base from "../Base";
import Logger from "../core/logger";
import whisper from 'whisper-node';
import * as fs from 'fs';

interface SpeechMessage {
    id: number;
    type: string;
    use: 'PUT';
    data: {
        base_64_audio: string;
        text_from_VEGA: string;
        command: string[];
    };
}

interface ProcessedSpeechMessage {
    id: number;
    type: string;
    use: 'PUT';
    data: {
        base_64_audio: string;
        text_from_VEGA: string;
        command: string[];
    };
}

export default class Speech extends Base {
    private logger = new Logger('Speech');

    public events = [
        {
            type: 'AUDIO',
            handler: this.handleSpeechMessage.bind(this),
        },
        {
            type: 'AUDIO_PROCESSED',
            handler: this.handleProcessedSpeechMessage.bind(this),
        },
    ];

    constructor(db: Db) {
        super(db);
    }

    async handleSpeechMessage(data: SpeechMessage) {
        this.logger.info(`Received speech message, dispatching to VEGA for processing`);

        const audio_base64 = data.data.base_64_audio;
        const audioBuffer = Buffer.from(audio_base64, "base64");
        this.logger.info(`processing audio buffer: ${audioBuffer.length} bytes`)

        // save to local wav file
        await fs.promises.writeFile("data/speech.wav", audioBuffer);
        const transcript = await whisper('data/speech.wav');

        this.logger.info(`Transcript: ${JSON.stringify(transcript)}`);

        this.dispatch('AR', {
            id: data.id,
            type: 'AUDIO_PROCESSED',
            use: 'PUT',
            data: {
                base_64_audio: transcript[0].speech,
                text_from_VEGA: data.data.text_from_VEGA,
                command: data.data.command,
            },
        });

        // this.dispatch('VEGA', {
        //     id: data.id,
        //     type: 'AUDIO',
        //     use: 'PUT',
        //     data: {
        //         base_64_audio: data.data.base_64_audio,
        //         text_from_VEGA: data.data.text_from_VEGA,
        //         command: data.data.command,
        //     },
        // });
    }

    async handleProcessedSpeechMessage(data: ProcessedSpeechMessage) {
        this.logger.info(`Received processed speech message, dispatching to AR for use`);

        this.dispatch('AR', {
            id: data.id,
            type: 'AUDIO_PROCESSED',
            use: 'PUT',
            data: {
                base_64_audio: data.data.base_64_audio,
                text_from_VEGA: data.data.text_from_VEGA,
                command: data.data.command,
            },
        });
    }
}