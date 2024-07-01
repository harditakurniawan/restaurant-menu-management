import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class AccessToken extends Base {
  @Column({ type: 'text' })
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
