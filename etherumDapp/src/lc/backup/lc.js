module.exports=function($scope,fileUpload){
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

var ABI=[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setRequired","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"setHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"compare","outputs":[{"name":"","type":"int256"}],"type":"function"},{"constant":true,"inputs":[],"name":"docHash","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"string"},{"name":"_b","type":"string"}],"name":"equal","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"clearContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"}],"name":"sendAsset","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"assetValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"string"}],"name":"compareHash","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"address"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"transactionSuccess","type":"bool"}],"name":"CompareHash","type":"event"}];

var Address="0xef4e11b86f84be8dc283a27fa307ab05e7b30afc";
var lc = web3NodeB.eth.contract(ABI).at(Address);

$scope.contractValue=5;
$scope.contractAddress=lc.address;
$scope.fromAddress=lc.from();
$scope.toAddress=lc.to();
$scope.contractBalance= web3NodeB.fromWei(web3NodeB.eth.getBalance(lc.address), "ether");
$scope.assetValue= web3NodeB.fromWei(lc.assetValue(),"ether")
$scope.docHash= lc.docHash();


$scope.makePayement= function(){
var txId=lc.sendAsset($scope.nodeB_Accounts[0],{from: $scope.nodeB_Accounts[1],value: web3NodeB.toWei($scope.contractValue, 'ether')});
$scope.transaction = web3NodeB.eth.getTransaction(txId);
lc.setRequired($scope.contractValue,{from: $scope.nodeB_Accounts[1]});
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
