import {Company} from './company.model';

export interface Ship {
    id: number;
    company_id: number;
    name: string;
    type: string;
    eu_number: string;
    build_year: string;
    construction_site: string;
    nationality: string;
}
