const { request, response } = require('express');
const { v4: uuid } = require('uuid');
const express = require('express');

const app = express();
app.use(express.json());

const customers = [];

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;

    const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if(customersAlreadyExists){
        return response.status(400).json({ error: "Customer already exists!" })
    }
    
    customers.push({
        cpf,
        name,
        id: uuid(),
        statement: []
    });

    return response.status(201).send();
});

app.listen(3333, _ => console.log('server running'));