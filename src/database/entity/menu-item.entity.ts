import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Restaurant } from './restaurant.entity';
import { Category } from './category.entity';

@Entity()
export class MenuItem extends Base {
    @Index()
    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    is_available: boolean;

    @ManyToOne(() => Category, (category) => category.menuItems)
    category: Category;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems)
    restaurant: Restaurant;
}
