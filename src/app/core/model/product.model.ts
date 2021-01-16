import {Ship} from './ship.model';

export interface Product {
    build_number: string;
    build_year: string;
    category: string;
    chain_type: string;
    created_at: string;
    id: number;
    length_extended: string;
    length_in: string;
    length_out: string;
    name: string;
    oil_pressure: string;
    power: string;
    ship: Ship;
    ship_id: number;
    type: string;
    updated_at: string;
    weight: string;
}
