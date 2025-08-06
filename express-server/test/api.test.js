const request = require('supertest');
require('dotenv').config();
const path = require('path');

const BASE_URL = `http://localhost:${process.env.PORT || 5555}`;

//this is uni-testing.
//api which doesnt require token verification = open API Test
//require token = 
//describe = main dev
//it hold a block of code
//form-data ma field
//.send for application json
//content-type ma field hunchha

//npm run test
//minimum 10 tests
//alos run backend