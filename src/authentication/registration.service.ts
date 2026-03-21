import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDataService } from '@core-abstraction/data-service.abstract';
import { RegistrationDto } from './dto/registration.dto';
import { User } from '@database/entity/user.entity';
import { Role as RoleEntity } from '@database/entity/role.entity';
import { Utils } from '@utils/utils.service';
import { Role } from '@core-enum/role.enum';

@Injectable()
export class RegistrationService {
    constructor(
        protected readonly repositoryService    : IDataService,
        protected readonly utils                : Utils,
    ) {}

    /**
     * Get default role : user
     * 
     * @returns 
     */
    public async getUserRoles(): Promise<RoleEntity[]> {
        try {
            const role = await this.repositoryService.roles.getAll({ where: { name: Role.MEMBER } });

            return role;
        } catch (error) {
            const { message: errorMessage } = error;

            throw new InternalServerErrorException(errorMessage);
        }
    }

    /**
     * Sign Up
     * 
     * @param registrationDto 
     * @returns 
     */
    public async registration(registrationDto: RegistrationDto): Promise<User> {
        try {
            const { password } = registrationDto;

            registrationDto.password = await this.utils.hashing(password);

            const newUser = await this.repositoryService.users.save(registrationDto);

            return newUser;
        } catch (error) {
            const { message: errorMessage } = error;

            throw new InternalServerErrorException(errorMessage);
        }
    }
}
