import { UseInterceptors, UsePipes, applyDecorators } from '@nestjs/common';
import { InjectUserInterceptor } from '@core-interceptors/inject-user.interceptor';
import { StripRequestContextPipe } from '../pipes/strip-request-context.pipe';
import { registerDecorator, ValidationOptions } from 'class-validator';

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