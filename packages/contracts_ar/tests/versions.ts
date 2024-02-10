import {expect, test} from 'vitest'
import Arweave from 'arweave';

const port = 1984;
const host ='127.0.0.1';


export const arweave = Arweave.init({
    host,
    port,
    protocol: 'http',
    timeout: 20000,
    logging: false,

});


test('Deploy Version class', () => {

})