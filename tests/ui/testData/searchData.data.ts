import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface product {
    ITEM_CATEGORY: string,
    ITEM_BRAND: string,
    MIN_PRICE: string,
    MAX_PRICE: string
}

interface searchData extends Array<product>{}


const records = parse(fs.readFileSync(
    path.join(__dirname, '/dataFiles/search.csv')), {
        columns: true,
        skip_empty_lines: true
});


export const searchData = records as searchData




