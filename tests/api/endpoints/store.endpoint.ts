import { faker } from '@faker-js/faker';


export interface petOrderIds {
    petId: number;
    petOrders: number[];
}
export interface petOrderData extends Array<petOrderIds>{};


export class createStoreOrder {
    id: number;
    petId: number;
    quantity: number;
    shipDate: string;
    status: string;
    complete: boolean;
    
    constructor(petId: number){
        this.id = faker.number.int();
        this.petId = petId;
        this.quantity = faker.number.int({min: 1, max: 10});
        this.shipDate = new Date().toISOString().replace('Z', '+0000');
        this.status = 'placed';
        this.complete = true;
    };
};
