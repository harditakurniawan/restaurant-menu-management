import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { Utils } from '@utils/utils.service';
import { ErrorMessageExpression } from '@core-enum/error-message-expression.enum';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
    constructor(
        protected readonly repositoryService    : IDataService,
        protected readonly utils                : Utils,
    ) {}

    async validate(email: string, args: ValidationArguments) {
        const existingEmail = await this.repositoryService.users.findOne({ where: { email } });

        if (!this.utils.isNull(existingEmail)) {
            return false;
        }

        return true;
    }

    defaultMessage = (args: ValidationArguments) => {
        return ErrorMessageExpression.EMAIL_EXIST;
    };
}