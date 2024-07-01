import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Utils } from '@utils/utils.service';
import { ROLES_KEY } from '@core-decorators/roles.decorator';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const utils = new Utils();

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY , [
            context.getHandler(),
            context.getClass(),
        ]);

        if (utils.isNull(requiredRoles)) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
    
        // is at least one of the required roles a role that the user has
        return requiredRoles.some((role) => user.roles.includes(role));
    }
} 
