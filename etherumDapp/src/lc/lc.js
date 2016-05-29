module.exports=function($scope,$http,fileUpload){



$scope.viewInvoice = function(){
$scope.modalTitle="Invoice";
$scope.imageUri="/assets/images/invoice.jpg";
}
$scope.viewBol = function(){
$scope.modalTitle="Bill Of Lading";
$scope.imageUri="/assets/images/bl.jpg";
}
$scope.ViewLc = function(){
$scope.modalTitle="Letter Of Credit";
$scope.imageUri="/assets/images/lc.jpg";
}
$scope.issueBol = function(){
toastr.success('Bill Of Lading has been issued ');
}
$scope.issueTransportDoc = function(){
toastr.success('All Transport documents have been issued');
}

$scope.sendDocs =function(){
	$http.get("http://localhost:3344/sendDocuments");
}
$scope.verifyDocs =function(){
	$http.get("http://localhost:3344/verifyDocuments");
}
//toastr.success('Have fun storming the castle!', 'Miracle Max Says')
var web3NodeB = new Web3();
web3NodeB.setProvider(new web3NodeB.providers.HttpProvider('http://localhost:8001')); 
$scope.nodeB_Accounts=web3NodeB.eth.accounts;

var nodeBbalances=[];
for(var i=0;i<$scope.nodeB_Accounts.length;i++){
	nodeBbalances[i]=web3NodeB.fromWei(web3NodeB.eth.getBalance($scope.nodeB_Accounts[i]), "ether");
	
}
web3NodeB.personal.unlockAccount(web3NodeB.eth.accounts[0],'1234');
web3NodeB.personal.unlockAccount(web3NodeB.eth.accounts[1],'1234');
web3NodeB.personal.unlockAccount(web3NodeB.eth.accounts[2],'1234');

$scope.nodeB_Balances=nodeBbalances;

var ABI=[{"constant":true,"inputs":[],"name":"buyerBolInvoiceHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"lcHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"a","type":"bytes32"},{"name":"b","type":"bytes32"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"sellerBolInvoiceHash","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[],"name":"clearContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setLcHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setBuyerBolInvoiceHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"assetValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setSellerBolInvoiceHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"bytes32"},{"name":"_b","type":"bytes32"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"compareHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_value","type":"uint256"}],"name":"sendAsset","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"CompareHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"SetSellerBolInvoiceHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"SetBuyerBolInvoiceHash","type":"event"}];

var Address="0x2bf475ea5e0a5de98bf6da592b7bd6ffa708d953";
var lc = web3NodeB.eth.contract(ABI).at(Address);

$scope.contractValue=5;
$scope.contractAddress=lc.address;
$scope.fromAddress=lc.from();
$scope.toAddress=lc.to();
$scope.contractBalance= web3NodeB.fromWei(web3NodeB.eth.getBalance(lc.address), "ether");
$scope.assetValue= web3NodeB.fromWei(lc.assetValue(),"ether");
$scope.lcHash=lc.lcHash;
$scope.bolInvoiceHash=lc.sellerBolInvoiceHash;
//$scope.docHash= lc.docHash();


$scope.makePayement= function(){
var txId=lc.sendAsset($scope.nodeB_Accounts[0],5,{from: $scope.nodeB_Accounts[1],value: web3NodeB.toWei($scope.contractValue, 'ether')});
$scope.transaction = web3NodeB.eth.getTransaction(txId);
}

var event = lc.CompareHash();

// watch for changes
event.watch(function(error, result){
    // result will contain various information
    // including the argumets given to the Deposit
    // call.
    if (!error)
        {
		//console.log(result.args.transactionSuccess);
		if(result.args.transactionSuccess){
		toastr.success('Success', 'Letter of credit');
		}
		else{
		toastr.success('Failed', 'Letter of credit');
		}
	}
});

}
