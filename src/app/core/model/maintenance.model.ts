import {Product} from './product.model';

interface Inspector {
    first_name: string;
    id: number;
    last_name: string;
}

export interface Maintenance {
    category: string;
    date: string;
    id: number;
    inspector: Inspector;
    product: Product;
}
