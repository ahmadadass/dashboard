/*const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.status(200).json({info: 'i am the js file hi'})
})

app.listen(port, () => console.log(`server on port: ${port}`))*/
const axios = require('axios');
const e = require('express');

const callback_api = {callback_query: {data: "statistics"}}
const response_ok = {statis: "good"}
const response_not_ok = {statis: "bad"}
let userkey;
exports.handler = async (event, context) => {
    // Get data from request body if it's a POST request
    const body = JSON.parse(event.body || '{}');

    // Example response message
    console.log('event: ', event);
    console.log('body: ', body);


    const message = body.car;
    let data;
    if (message == "thiscodeisnotforshaeringsenddata") { 
        if (event.logToken == userkey){
            data = await getdata(callback_api) || {};
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Enable CORS for local testing
                },
                body: JSON.stringify(response_not_ok)
            }
        }
    } else if (message == "thiscodeisnotforshaeringlogin"){
        if (body.username == "admin" && body.password == "adminisahmad"){
            userkey = event.logToken
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Enable CORS for local testing
                },
                body: JSON.stringify(response_ok)
            }
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Enable CORS for local testing
                },
                body: JSON.stringify(response_not_ok)
            }
        }
    }

    //console.log("data from : " , data);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Enable CORS for local testing
        },
        body: JSON.stringify(data),
    };
};


async function getdata(data) {
    try {
        const response =  await axios.post("https://ucasdashboard.netlify.app/.netlify/functions/handler", {
            data: data
        })
        console.log('response form fun getdata: ',response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

