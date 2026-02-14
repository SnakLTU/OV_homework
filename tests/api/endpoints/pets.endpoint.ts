import { faker } from '@faker-js/faker';

interface Category {
  id: number;
  name: string;
};

interface Tag {
  id: number;
  name: string;
};

export class createPet {
    id: number;
    category: Category;
    name: string;
    photoUrls: string[];
    tags: Tag[];
    status: string;
    
    constructor(){
        this.id = faker.number.int();
        this.category = {id: 0, name: faker.animal.dog()};
        this.name = faker.animal.petName();
        this.photoUrls = [faker.image.url()];
        this.tags = [{id: 0, name: faker.word.noun()}];
        this.status = 'available';
    };
};
