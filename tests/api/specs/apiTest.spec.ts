import { test , expect } from "@playwright/test";
import { createPet } from "../endpoints/pets.endpoint"
import { createStoreOrder, petOrderIds, petOrderData } from "../endpoints/store.endpoint"
 

const baseUrl: string = process.env.API_URL || ''
const petCount: number = 4
let petIds: Array<number> = []

test.describe.serial('API test without authorisation', () => {
    let petOrderData: petOrderData = []

    test('Create pets', async ({request}) => {
        for (let i=0; i<petCount; i++){
            const petData = new createPet()
            const response = await request.post(`${baseUrl}/pet`, {
                data: petData
            })
            let responseBody = await response.json();
            expect(responseBody.id).toBe(petData.id);
            expect(responseBody.category.id).toBe(petData.category.id);
            expect(responseBody.category.name).toBe(petData.category.name)
            expect(responseBody.name).toBe(petData.name);
            expect(responseBody.photoUrls[0]).toBe(petData.photoUrls[0]);
            expect(responseBody.tags[0].id).toBe(petData.tags[0].id);
            expect(responseBody.tags[0].name).toBe(petData.tags[0].name);
            expect(responseBody.status).toBe(petData.status);
            petIds.push(responseBody.id)
        };
    });


    test('Create pet order', async ({request}) => {
        for (let i=0; i<petCount; i++){
            let orderIdsArray: Array<number> = new Array() 
            let numberOfOrders: number = Math.floor(Math.random() * 5) + 1;
            for(let n=0; n<numberOfOrders; n++){
                const orderData = new createStoreOrder(petIds[i])
                const response = await request.post(`${baseUrl}/store/order`, {
                    data: orderData
                });
                const responseBody = await response.json();
                expect(responseBody.id).toBe(orderData.id);
                expect(responseBody.petId).toBe(orderData.petId);
                expect(responseBody.quantity).toBe(orderData.quantity);
                expect(responseBody.shipDate).toBe(orderData.shipDate);
                expect(responseBody.status).toBe(orderData.status);
                expect(responseBody.complete).toBe(orderData.complete);
                orderIdsArray.push(orderData.id)
            }
            const petOrder: petOrderIds = {
                                            petId: petIds[i],
                                            petOrders: orderIdsArray
                                        };
            petOrderData.push(petOrder);
        };
    });

    test('Delete created pet orders, validate that order is deleted', async ({request}) => {
        for (let i=0; i<petCount; i++){
            const petOrder: petOrderIds = petOrderData[i]
            for(let n=0; n<petOrder.petOrders.length; n++){
                const deleteResponse = await request.delete(`${baseUrl}/store/order/${petOrder.petOrders[n]}`);
                const deleteResponseBody = await deleteResponse.json();
                expect(deleteResponseBody.code).toBe(200);
                expect(deleteResponseBody.type).toBe('unknown');
                expect(deleteResponseBody.message).toBe(petOrder.petOrders[n].toString());
                const getResponse = await request.get(`${baseUrl}/store/order/${petOrder.petOrders[n]}`);
                const getResponseBody = await getResponse.json();
                expect(getResponseBody.code).toBe(1);
                expect(getResponseBody.type).toBe('error');
                expect(getResponseBody.message).toBe('Order not found');
            };
        };
    });
});

test.describe.serial('API tests with authorisation' , () => {

    test.use({ extraHTTPHeaders: { 'api_key': process.env.API_KEY || '' } })

    test('Delete created pets, validate that pets are deleted', async ({request}) => {
        for (let i=0; i<petIds.length; i++){
            const petId: number = petIds[i]
            const maxRetries = 3;  
            let attempt = 0;  
            let success = false; 

            while (attempt < maxRetries && !success){
                try 
                {
                    const response = await request.delete(`${baseUrl}/pet/${petId}`);
                    expect(response.status()).toBe(200);
                    const responseBody = await response.json();
                    expect(responseBody.code).toBe(200);
                    expect(responseBody.type).toBe("unknown");
                    expect(responseBody.message).toBe(petId.toString());
                    success = true;
                } 
                catch(error)
                {
                    attempt++;
                    if (attempt >= maxRetries) {  
                        console.error('Max retries reached. Failing the test.');  
                        throw error;
                    };
                };
            };
        };
    });
});