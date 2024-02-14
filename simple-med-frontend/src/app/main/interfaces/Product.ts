export interface ProductDisplay{
    id: string,
    cod: string,
    name: string,
    manufacturer: string,
    price: number,
    med_type_display?: string,
    med_type: number,
    description: string,
    adm_type_display?: string,
    adm_type: number,
    prospect: string | any,
    sold_per_unit: boolean,
    price_per_unit: number | null,
    units_per_box: number | null,
    is_prescribed: boolean
}

/*export function mapMedTypeToString(medType: number): string{
    switch( medType ){
        case(1):{
            return 'Antibiotice';
            break;
        }
        case(2):{
            return 'Antivirale';
            break;
        }
        case(3):{
            return 'Antiinflamatoare';
            break;
        }
        case(4):{
            return 'Antidepresive, anxiolitice și antipsihotice';
            break;
        }
        case(5):{
            return 'Antineoplazice';
            break;
        }
        case(6):{
            return 'Antidiabetice';
            break;
        }
        case(7):{
            return 'Anticoagulante și antiagregante plachetare';
            break;
        }
        case(8):{
            return 'Antipiretice';
            break;
        }
        case(9):{
            return 'Analgezice';
            break;
        }
            
    }

    return '';
}*/