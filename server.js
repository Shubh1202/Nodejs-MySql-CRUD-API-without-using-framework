const http = require("http");
const querystring = require("querystring");
const database = require("./db_config");
// const routes = require("./routes/routes");
const get = require("./routes/GetRoutes");
const post = require("./routes/PostRoutes");
const put = require("./routes/PutRoutes");
const delete_r = require("./routes/DeleteRoutes");

const host = process.env.host || "127.0.0.1";
const PORT = process.env.PORT || 5050;8
http.createServer((request, response) => {
    const url_obj = new URL(request.url, `http://${request.headers.host}`);
    request.url_obj = url_obj;
    request.db = database;
    request.redirect = __redirect;
    switch (request.method) {
        case "GET":
            handel_param(request, response, get);
            break;
        case "POST":
            handel_param(request, response, post);
            break;
        case "PUT":
            handel_param(request, response, put);
            break;
        case "DELETE":
            handel_param(request, response, delete_r);
            break;
        default:
            request.response_data = {statusCode:405, msg:"Request method not allowed "};
            request.redirect(request, response);
            break;
    }

}).listen(PORT, (err) => {
    if (err) throw err
    console.log(`Your server running url http://${host}:${PORT}`);
});

/****
 * 
 */
const handel_param = (request, response, next_function) =>{
    let body_data = [];
    request.on("data", (dataChunk)=>{
        body_data.push(dataChunk);
    });

    request.on("end", ()=>{
        let data_string = Buffer.concat(body_data).toString();
        request.input = (request.headers["content-type"]=="application/json") ? JSON.parse(data_string) : querystring.parse(data_string);

        next_function(request, response);
    })
}

/***
 * 
 */
const __redirect = ((request, response)=>{


    let statusCode = request.response_data.statusCode || 405;
    let msg = request.response_data.msg || http.STATUS_CODES["405"];

    if(!statusCode){
        console.log(`\nError from redirect ---> Provide your response status code\n`);
        throw "Error from redirect ---> Provide your response status code";
    } 
    if(!msg){
        console.log(`\nError from redirect --> Provide your response message\n`);
        throw "Error from redirect --> Provide your response message";
    }
    response.writeHead(statusCode, {"Content-Type":"application/json"});
    response.end(msg);
    return false;
})