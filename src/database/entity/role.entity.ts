import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Base } from "./base.entity";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";

@Entity()
export class Role extends Base {
    @Column({ length: 100 })
    name: string;
    
    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({ name: 'role_permission' })
    permissions: Permission[];

    @ManyToMany(() => User, (user) => user.roles)
    users: Permission[];
}