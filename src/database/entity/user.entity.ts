import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Base } from './base.entity';
import { Role } from './role.entity';

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

  comparePassword = (password: string): boolean => {
    return bcrypt.compareSync(password, this.password);
  };

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  roles: Role[];
}
