var fs = require('fs');
var hashFiles = require('hash-files');
var multer  = require('multer');
var Web3= require('web3');
var web3NodeB = new Web3();
web3NodeB.setProvider(new web3NodeB.providers.HttpProvider('http://localhost:8001')); 

var ABI=[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setRequired","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"docHash","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"clearContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"}],"name":"sendAsset","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"assetValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"compareHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"address"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"CompareHash","type":"event"}];

var Address="0xef4e11b86f84be8dc283a27fa307ab05e7b30afc";
var fraudPreventionContract = web3NodeB.eth.contract(ABI).at(Address);

var  LCABI=[{"constant":true,"inputs":[],"name":"buyerBolInvoiceHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"lcHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"a","type":"bytes32"},{"name":"b","type":"bytes32"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"sellerBolInvoiceHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"clearContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setLcHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setBuyerBolInvoiceHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"assetValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setSellerBolInvoiceHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"bytes32"},{"name":"_b","type":"bytes32"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"compareHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_value","type":"uint256"}],"name":"sendAsset","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"CompareHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"SetSellerBolInvoiceHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"SetBuyerBolInvoiceHash","type":"event"}];

var LcAddress="0x2bf475ea5e0a5de98bf6da592b7bd6ffa708d953";
var lc = web3NodeB.eth.contract(LCABI).at(LcAddress);



var appRouter = function(app) {
 app.get("/", function(req, res) {
    res.send("Hello World");
});
/* Alternative method to get only sha1 hash
var hash = require('files-hash');
 app.get("/getHash", function(req, res) {
  
    hash('./*', { cwd: './hash' })
    .then(function(hashes) {
        console.log(hashes);
 	res.send(hashes);
    });

})
*/
var upload = multer({dest:'./uploads/'});

var cpUpload = upload.single('myFile');
//app.use(multer({dest:'./uploads/'})).single('file');

 app.get("/getSha256", function(req, res) {
  
   var options={
		files:['./targetFiles/sellerFile'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log(hash);
	 	res.send(hash);
	});

})
app.post('/uploadSeller', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/sellerFile";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	var options={
		files:['./targetFiles/sellerFile'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log("SellerFile: "+hash);
	 	//res.send(hash);
		fraudPreventionContract.setHash(hash,{from:web3NodeB.eth.accounts[0]});
	});

	//res.status(204).end();
})
app.post('/uploadBuyer', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/buyerFile";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
            		//res.status(500).end();
        	});
    	});
	var options={
		files:['./targetFiles/buyerFile'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log("BuyerFile:"+hash);
	 	//res.send(hash);
		fraudPreventionContract.compareHash(hash,{from:web3NodeB.eth.accounts[0]});
	});
})


/////............. Lc contract related endpoints---------------------------------------------------------------------------------------////
app.post('/uploadLcBuyer', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/LOC/lcBuyer";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	var options={
		files:['./targetFiles/LOC/lcBuyer'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log("Buyer Lc File hash: "+hash);
	 	//res.send(hash);
		lc.setLcHash(hash,{from:web3NodeB.eth.accounts[0]});
	});

	//res.status(204).end();
})
app.post('/uploadInvoiceSeller', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/LOC/invoiceSeller";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	
	//res.status(204).end();
})
app.post('/uploadBolSeller', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/LOC/bolSeller";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	//res.status(204).end();
})
app.get('/sendDocuments', cpUpload,function(req, res) {
	var options={
		files:['./targetFiles/LOC/invoiceSeller','./targetFiles/LOC/bolSeller'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log("bolInvoiceSeller: "+hash);
	 	lc.setSellerBolInvoiceHash(hash,{from:web3NodeB.eth.accounts[0]})
		
	});
	
})
app.post('/uploadInvoiceBuyer', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/LOC/invoiceBuyer";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	
	//res.status(204).end();
})
app.post('/uploadBolBuyer', cpUpload,function(req, res) {
	//console.log(req.body);
	//console.log(req.files);
		console.log(req.file.path);
		//console.log(req);
	//res.status(204).end();
	var tmp_path = req.file.path;
	var target_path="./targetFiles/LOC/bolBuyer";
	fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        	fs.unlink(tmp_path, function() {
           	 	if (err) throw err;
        	});
    	});
	//res.status(204).end();
})
app.get('/verifyDocuments', cpUpload,function(req, res) {
	var options={
		files:['./targetFiles/LOC/invoiceBuyer','./targetFiles/LOC/bolBuyer'],
		algorithm: "sha256"
	}
	hashFiles(options, function(error, hash) {
    	// hash will be a string if no error occurred
		console.log("bolInvoiceBuyer: "+hash);
	 	lc.setBuyerBolInvoiceHash(hash,{from:web3NodeB.eth.accounts[0]})
		lc.compareHash({from:web3NodeB.eth.accounts[0]})
		
	});
	
})
}
module.exports = appRouter;
