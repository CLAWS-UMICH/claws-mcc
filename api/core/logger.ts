import winston from "winston";

export default class Logger {
	private logger: winston.Logger;

	constructor(loggerName: string) {
		this.logger = winston.createLogger({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ timestamp, level, message }) => {
					return `${timestamp} [${loggerName}]: ${message}`;
				})
			),
			transports: [new winston.transports.Console()],
		});
	}

	get info() {
		return this.logger.info.bind(this.logger);
	}

	// just to support replacements for console.log
	get log() {
		return this.logger.info.bind(this.logger);
	}

	get error() {
		return this.logger.error.bind(this.logger);
	}

	get debug() {
		return this.logger.debug.bind(this.logger);
	}
}