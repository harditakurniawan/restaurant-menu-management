import { Column, Entity, ManyToMany } from "typeorm";
import { Role } from "./role.entity";
import { Base } from "./base.entity";

@Entity()
export class Permission extends Base {
    @Column({ length: 100 })
    groupName: string;

    @Column({ length: 100 })
    name: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];
}