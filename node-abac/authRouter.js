
const app = require('express');

const nodeAbac = require('node-abac');
const policies = import('policies.js');


const Abac = new nodeAbac(policies);




