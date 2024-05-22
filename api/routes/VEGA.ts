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
        classify: boolean;
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
        classify: boolean;
    };
}

export default class VEGA extends Base {
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
        {
            type: 'UIAIMAGE',
            handler: this.handleUIAIMAGE.bind(this),
        },
        {
            type: 'UIAIMAGE_PROCESSED',
            handler: this.handleUIAIMAGE.bind(this),
        }
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
                classify: data.data.classify,
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
                classify: data.data.classify,
            },
        });
    }

    async handleUIAIMAGE(data: any) {
        this.logger.info(`Received UIAIMAGE message, dispatching to AR for use`);

        this.dispatch('AR', {
            id: data.id,
            type: 'UIAIMAGE',
            use: 'PUT',
            data: {
                base_64_image: data.data.base_64_image,
                points: data.data.points,
                position: data.data.position,
                rotation: data.data.rotation,
            },
        });
    }

    async handleUIAIMAGE_PROCESSED(data: any) {
        this.logger.info(`Received UIAIMAGE_PROCESSED message, dispatching to AR for use`);

        this.dispatch('AR', {
            id: data.id,
            type: 'UIAIMAGE_PROCESSED',
            use: 'PUT',
            data: {
                base_64_image: data.data.base_64_image,
                points: data.data.points,
                position: data.data.position,
                rotation: data.data.rotation,
            },
        });
    }
}