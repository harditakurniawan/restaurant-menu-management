import { Cron, CronExpression } from "@nestjs/schedule";
import { InternalServerErrorException } from "@nestjs/common";
import * as moment from 'moment';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { IDataService } from "@core-abstraction/data-service.abstract";
import { Utils } from "@utils/utils.service";

export class CronJobService {
    constructor(
        protected readonly repositoryService                : IDataService,
        protected readonly utils                            : Utils,
        private eventEmitter                                : EventEmitter2,
    ) {}

    /**
     * CRON JOB
     */
    @Cron('5 0 * * *', { name: 'handlingJobEveryNight', timeZone: 'Asia/Jakarta' }) // At 00:05
    // @Cron(CronExpression.EVERY_5_SECONDS, { name: 'handlingJobEveryNight', timeZone: 'Asia/Jakarta' })
    async handlingJobEveryNight() {
        try {
            console.time('handlingJobEveryNight')

            console.timeEnd('handlingJobEveryNight')
        } catch (error) {
            console.log('error cronjob handlingJobEveryNight')
            console.log(error.message)

            this.writeFailedCronJobToFile('handlingJobEveryNight', error);

            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Log failed cron-job to file
     * 
     * @param functionName 
     * @param error 
     */
    private writeFailedCronJobToFile = (functionName: string, error: Error): void => {
        this.utils.writeLogToFile(
            'cronjob_error.log', 
            `${JSON.stringify({
                time: moment().utc().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                service: CronJobService.name,
                function: functionName,
                payload: null,
                error: error.message
            })}\n`,
        );
    }

    /**
     * Log succeess cron-job to file
     * 
     * @param functionName 
     * @param error 
     */
    private writeSuccessCronJobToFile = (functionName: string, message: string | object): void => {
        this.utils.writeLogToFile(
            'cronjob_success.log', 
            `${JSON.stringify({
                time: moment().utc().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                service: CronJobService.name,
                function: functionName,
                payload: null,
                message
            })}\n`,
        );
    }
}