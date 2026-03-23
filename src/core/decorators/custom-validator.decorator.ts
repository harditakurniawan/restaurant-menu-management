import { UseInterceptors, UsePipes, applyDecorators } from '@nestjs/common';
import { InjectUserInterceptor } from '@core-interceptors/inject-user.interceptor';
import { StripRequestContextPipe } from '../pipes/strip-request-context.pipe';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { IsUniqueEmailConstraint } from '@core-constraint/is-unique-email.constraint';
import { Utils } from '@utils/utils.service';

const utils = new Utils();

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}

export function IsValidOpeningHour(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidOpeningHour',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          return utils.validateOpeningHour(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must follow the format HH:mm - HH:mm (e.g., 09:00 - 22:00)`;
        },
      },
    });
  };
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: string, args: ValidationArguments) {
          return utils.validatePhoneNumber(value);
        },

        defaultMessage(args: ValidationArguments) {
          return '$property is not valid';
        },
      },
    });
  };
}

export function InjectUserToQuery() {
  return applyDecorators(InjectUserTo('query'));
}

export function InjectUserToBody() {
  return applyDecorators(InjectUserTo('body'));
}

export function InjectUserToParam() {
  return applyDecorators(InjectUserTo('params'));
}

export function InjectUserTo(context: 'query' | 'body' | 'params') {
  return applyDecorators(
    UseInterceptors(new InjectUserInterceptor(context)),
    UsePipes(StripRequestContextPipe),
  );
}