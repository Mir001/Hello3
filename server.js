'use strict' 


const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');


let todoList = [
    {
        id: Math.random() + '',
        message: "Wake up early",
        checked: false
    },
    {
        id: Math.random() + '',
        message: "Go to university",
        checked: false
    },
    {
        id: Math.random() + '',
        message: "Go to work",
        checked: false
    }
]

//  server inside constant

const todoServer = http.createServer(function (req, res){

   

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

   

    fs.readFile('./public' + req.url, function(err,data)
    {
        if(err) {
            res.statusCode = 404;
            res.end("The file isn't found")
        }
        else{
            res.statusCode = 200;
            res.end(data);
        }
    });

    //  request types

    if(req.url.indexOf('/todo') === 0)
    {

        // For giving information to the client and for Search function

        if(method === "GET"){

            res.setHeader('Content-Type','application/json');
            let localList = todoList;

            if(parsedQuery.searchText){
                localList = localList.filter(function(obj){
                    return obj.message.indexOf(parsedQuery.searchText) >= 0;
                });
                res.end(JSON.stringify(localList));
            }

            res.end(JSON.stringify(todoList));
        }

        // add new data to the list using Post method

        if(method === "POST"){

            let listAdd = '';
            req.on('data',function(chunk){
                listAdd = listAdd + chunk;
            });

            req.on('end',function(){
                let parsedAdd = JSON.parse(listAdd);
                parsedAdd.id = Math.random() + '';
                todoList.push(parsedAdd);

                res.setHeader('Content-Type','application/json');
                return res.end(JSON.stringify(todoList));
            })
        }

        //  delete data from the server using Delete method

        if(method === 'DELETE'){

            let listDel = '';
            req.on('data',function(chunk){
                listDel = listDel + chunk;
            });

            req.on('end',function(){ 
                let parsedDel = JSON.parse(listDel);
                for(let i=1;i<=todoList.length;i = i + 1) {
                    if (parsedDel.id === todoList[i-1].id) {
                        todoList.splice(i-1 , 1);
                    }
                }
                res.end(JSON.stringify(todoList));
                });
        }

        // For updating information inside the data in server, using PUT (checkbox)

        if(method === 'PUT'){
            let listUp = '';
            req.on('data',function(chunk){
                listUp = listUp + chunk;
            });

            req.on('end',function(){
                let parsedUp = JSON.parse(listUp);
                for(let i = 1;i <= todoList.length;i = i +1){
                    if(parsedUp.id === todoList[i - 1].id){
                        todoList[i-1].checked = parsedUp.checked;
                    }
                }
                res.end(JSON.stringify(todoList));
            });
        }
    }

});

// Start listening to the specified port

todoServer.listen(3002);

