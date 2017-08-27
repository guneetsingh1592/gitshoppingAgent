'use strict';
const Restify = require('restify');
var firebase = require("firebase");
const server = Restify.createServer({
	name : "Chat"
});
const request = require('request');
const firebaseURL = "https://productdetails-b0352.firebaseio.com/.json?auth=DNLAj3LVpQPRozhyFWX2he0dyBs1cKeK9odDQCXq";
const PORT =process.env.PORT || 3000;
server.use(Restify.plugins.bodyParser());
server.use(Restify.plugins.jsonp());

var config = {
  apiKey: "DNLAj3LVpQPRozhyFWX2he0dyBs1cKeK9odDQCXq",
  authDomain: "productdetails-b0352.firebaseapp.com",
  databaseURL: "https://productdetails-b0352.firebaseio.com/",
  storageBucket: "productdetails-b0352.appspot.com",
};
firebase.initializeApp(config);



/*const getCategoryType = (categoryList,cb) =>{
return request({
url: firebaseURL,
method: 'GET',
json: true
},(error, response, body) =>{
if(!error){
	var result ="";
	var categories = body['category'];
	for(var listofCategories in categories){
		result = result+listofCategories;

	}
}
console.log("results:: "+result);
//result = categories;
cb(null, result);
}

)};

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
	result = result +"\n"+ key+"\n";
}

}
result = "Here is the product list:" +" "+result+ " \n"+"Which one you are looking for?";
cb(null, result);
}
)};

*/
//POST Route handler
server.post('/', (req, res) => {
 

var database = firebase.database();
var ref = database.ref('category');



function errData(err){
	console.log("Err!!");
	console.log(err);
}


let result = req.body;
const action = result.result.action;
const category = result.result.parameters.category;
console.log("Category:"+category);
var productName = database.ref('category'+'/'+category);
console.log("ProductName"+productName);




if(result.status.code === 200 && action === 'category'){


productName.on('value', productData, productErrData);
function productData(data){

	var productsName = data.val();
	var productKeys = Object.keys(productsName);
	console.log(productKeys);
	
var result ="";
for(var key in productKeys)
{ 
	result = result + productKeys[key];
	result = result+ ",";

}
console.log(result);
var responseText = "I found few products for you: "+result+": which one you want to buy?";
res.json({
	speech:responseText,
	displayText: responseText,
	source: "agent"
});


}
function productErrData(err){
console.log(err);
}

 /*getProductforCategory(category,(error, result) =>{
 	if(!error && result){
let responseText = `Well, this is your product`;
	res.json({
	speech:result,
	displayText: result,
	source: "agent"
});
}
 });
*/

}

if(result.status.code === 200 && action === 'wineVariantAction')
{
const wineVarient = result.result.parameters.wineVariant;
console.log("WineVarient::"+wineVarient);
var categoryName = database.ref('category');
categoryName.on('value', categoryData, categoryErrData);
function categoryData(data){
var categorysName = data.val();
	var categoryKeys = Object.keys(categorysName);
	console.log(categoryKeys);
	for(var x in categoryKeys){
var ref = database.ref('category'+'/'+categoryKeys[x]);
console.log("Ref="+ref);
ref.on('value', function(data){
var varient = data.val();
var varientKeys = Object.keys(varient);
console.log(varientKeys);
if(varientKeys.indexOf(wineVarient)>-1){
	 console.log("Ref="+ref);

ref.on('child_added', function (data) {
                if(data.key===wineVarient){
                	var value = data.val();
       			console.log(value['price']);
       			var title = value['title'];
       			var price = value['price'];
       			var response = "The cost of 1"+" "+title +" "+"is"+" "+ price+" "+"$";
       			res.json({
				speech:response,
				displayText: response,
				source: "agent"
});

                }
            });

}

});

	}
}


function categoryErrData(err){

	console.log(err);
}

}

if(result.status.code === 200 && action === 'addCart'){
	console.log("Add to cart");
	const sessionId = result.sessionId;
	console.log("SessionId::" +sessionId);
const wineVarient = result.result.parameters.wineVariant;
const quantity = result.result.parameters.number;
console.log("WineVarient::"+wineVarient);
var categoryName = database.ref('category');
categoryName.on('value', categoryData, categoryErrData);
function categoryData(data){
var categorysName = data.val();
	var categoryKeys = Object.keys(categorysName);
	console.log(categoryKeys);
	for(var x in categoryKeys){
var ref = database.ref('category'+'/'+categoryKeys[x]);

ref.on('value', function(data){
var varient = data.val();
var varientKeys = Object.keys(varient);
console.log("Variant Keys::"+varientKeys);
if(varientKeys.indexOf(wineVarient)>-1){
	 

ref.on('child_added', function (data) {
                if(data.key===wineVarient){
                	var value = data.val();
                	var price = value['price'];
                	console.log(price);
                	var total = (parseInt(price))*(parseInt(quantity));
                	console.log("Total::"+total);
                	
       			
       	var session = database.ref('sessionId');		
       			session.child(sessionId+'/'+wineVarient).update({
  				product: wineVarient,
  				quantity: quantity,
  				price: total
  				
});
       			var responseText = quantity + " "+ wineVarient + " "+ "is added to your cart.";
       			res.json({
				speech:responseText,
				displayText: responseText,
				source: "agent"
});

                }
            });

}

});

	}
}


function categoryErrData(err){

	console.log(err);
}

}


if(result.status.code === 200 && action === 'getCart'){
console.log("Get cart values");
const sessionId = result.sessionId;
var session = database.ref('sessionId'+'/'+sessionId);
console.log("Session url :: "+session);	
var finalResponse;

session.on('value', function (data) {	

var dataValue = data.val();
var skeys = Object.keys(dataValue);
//console.log(dataValue);
var finalValue="";
var price =0;
for(var x in skeys){

var ref = database.ref('sessionId'+'/'+sessionId+'/'+skeys[x]);


ref.on('value', function(data){
var cartvalue = data.val();
var cartDetail = cartvalue['quantity'] +" "+ cartvalue['product'];
finalValue = finalValue+cartDetail+":" +"\n";
	price = Number(price)+ Number(cartvalue['price']);
}); 

}
var responseText = "You have "+finalValue +" & total cart value is "+ price +"$";
console.log(responseText);

res.json({
				speech:responseText,
				displayText: responseText,
				source: "agent"
});

});

//console.log("Final::"+finalResponse);

}


console.log(result);

});

server.listen(PORT, () => console.log(`Chat server running on ${PORT}`))