/*const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.status(200).json({info: 'i am the js file hi'})
})

app.listen(port, () => console.log(`server on port: ${port}`))*/
const axios = require('axios');

const callback_api = {"callback_query": {"data": "statistics"}}

exports.handler = async (event, context) => {
    // Get data from request body if it's a POST request
    const body = JSON.parse(event.body || '{}');

    // Example response message
    console.log('start event ---------------------------------\n' + event + 'end event -------------------------\n')


    const message = body.car;
    let data = {error: 'error'} 
    if (message == "thiscodeisnotforshaering") { 
        data = await getdata(callback_api);
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Enable CORS for local testing
        },
        body: JSON.stringify({data}),
    };
};


async function getdata(data) {
    try {
        const response =  await axios.post("https://ucasdemo.netlify.app/.netlify/functions/telegramwebhook", {
            data:data
        })
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}
