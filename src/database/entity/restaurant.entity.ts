import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { MenuItem } from './menu-item.entity';

@Entity()
export class Restaurant extends Base {
    @Index()
    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ length: 15 })
    phone: string;

    @Column({ length: 15 })
    opening_hour: string;

    @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant, { cascade: true })
    menuItems: MenuItem[];
}
