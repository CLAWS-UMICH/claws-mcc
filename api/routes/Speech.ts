import { Db } from "mongodb";
import Base from "../Base";
import Logger from "../core/logger";

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

        this.dispatch('VEGA', {
            id: data.id,
            type: 'AUDIO',
            use: 'PUT',
            data: {
                base_64_audio: data.data.base_64_audio,
                text_from_VEGA: data.data.text_from_VEGA,
                command: data.data.command,
            },
        });
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