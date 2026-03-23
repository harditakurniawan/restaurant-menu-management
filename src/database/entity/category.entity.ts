import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { MenuItem } from './menu-item.entity';

@Entity()
export class Category extends Base {
    @Index()
    @Column({ length: 100 })
    name: string;

    @Index()
    @Column({ length: 100 })
    code: string;

    @Column({ type: 'int' })
    ord: number;

    @OneToMany(() => MenuItem, (menuItem) => menuItem.category, { cascade: true })
    menuItems: MenuItem[];
}
