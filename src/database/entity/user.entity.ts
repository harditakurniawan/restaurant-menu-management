import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Base } from './base.entity';
import { Role } from '../../core/enum/role.enum';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ type: Boolean, default: false })
  isActive: boolean;

  @Column({ length: 100 })
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @BeforeInsert()
  hashingPassword = async () => {
    this.password = await this._utils.hashing(this.password);
  };

  comparePassword = (password: string): boolean => {
    return bcrypt.compareSync(password, this.password);
  };
}
