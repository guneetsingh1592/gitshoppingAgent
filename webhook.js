'use strict';
const Restify = require('restify');
const server = Restify.createServer({
	name : "Chat"
});
const request = require('request');
const firebaseURL = "https://productdetails-b0352.firebaseio.com/.json?auth=DNLAj3LVpQPRozhyFWX2he0dyBs1cKeK9odDQCXq";
const PORT =process.env.PORT || 3000;
server.use(Restify.plugins.bodyParser());
server.use(Restify.plugins.jsonp());


const getProductforCategory =(cat,cb) =>{

return request({
url: firebaseURL,
method: 'GET',
json: true
},(error, response, body) =>{
if(!error){
var productName = body.category[cat];
var key;
var result ="";
for(key in productName)
{ 
	result = result +" "+ key+"\n";
}

}
result = "Here is the product list:" +" "+result+ " \n"+"Which one you are looking for?";
cb(null, result);
}
)};


//POST Route handler
server.post('/', (req, res) => {

let result = req.body;
const action = result.result.action;
const category = result.result.parameters.category;
if(result.status.code === 200 && action === 'category' && (category === 'apparels')){
 getProductforCategory(category,(error, result) =>{
 	if(!error && result){
let responseText = `Well, this is your product`;
	res.json({
	speech:result,
	displayText: result,
	source: "agent"
});
}
 });


}

console.log(result);

});

server.listen(PORT, () => console.log(`Chat server running on ${PORT}`))