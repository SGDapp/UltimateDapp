var angular= require('angular');
var web3= require('web3');
var hashFiles = require('hash-files');
var fs= require('fs');
require('angular-ui-router');
require('ng-upload');
var app = angular.module('app', ['ui.router','ngUpload']);


var lcCtrl=require('../lc/lc');




app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
	console.log("success");
        })
        .error(function(){
		console.log("error");
        });
    }
}]);

app.controller('lcCtrl', ['$scope','$http','fileUpload', lcCtrl]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/wallet');
    
    $stateProvider
        
        // WALLET PAGE
        .state('wallet', {
            url: '/wallet',
            templateUrl: './src/wallet/wallet.html'
        })
        
              
        
        // Multisign PAGE 
        .state('multisign', {
            url: '/multisign',
            templateUrl: './src/multisign/multisign.html' ,
	    controller: 'multisignCtrl'
         })
        
	 .state('lc', {
            url: '/lc',
            templateUrl: './src/lc/lc.html' ,
	    controller: 'lcCtrl'
         });
        
});

app.controller('homeCtrl', function($scope,$timeout) {

$scope.isAlert=true;

//toastr.success('Have fun storming the castle!', 'Miracle Max Says')
var web3NodeA = new Web3();
//console.log(web3NodeA);
web3NodeA.setProvider(new web3NodeA.providers.HttpProvider('http://localhost:8000')); 
web3NodeA.personal.unlockAccount(web3NodeA.eth.accounts[0],'1234',50000);
$scope.nodeA_Accounts=web3NodeA.eth.accounts;
var nodeAbalances=[];
for(var i=0;i<$scope.nodeA_Accounts.length;i++){
	nodeAbalances[i]=web3NodeA.fromWei(web3NodeA.eth.getBalance($scope.nodeA_Accounts[i]), "ether");
	
}
web3NodeA.personal.unlockAccount(web3NodeA.eth.accounts[0],'1234');
web3NodeA.personal.unlockAccount(web3NodeA.eth.accounts[1],'1234');
web3NodeA.personal.unlockAccount(web3NodeA.eth.accounts[2],'1234');

$scope.nodeA_Balances=nodeAbalances;
$scope.transaction=null;
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

// Add asset to Master Wallet
$scope.addAsset = function(){
var txId=web3NodeA.eth.sendTransaction({from: web3NodeA.eth.accounts[0], to: web3NodeA.eth.accounts[2], value: web3NodeA.toWei($scope.assetValue, 'ether'), data: "Adding Asset To Master Wallet"});
$scope.transaction = web3NodeA.eth.getTransaction(txId);
console.log(txId);
console.log($scope.transaction);
toastr.success('Have fun storming the castle!', 'Miracle Max Says')
}

//Transfer Asset from from Master Wallet to a wallet 
$scope.transferAsset = function(){
var txId=web3NodeA.eth.sendTransaction({from: web3NodeA.eth.accounts[2], to: $scope.walletTo, value: web3NodeA.toWei($scope.masterAssetValue, 'ether')});
$scope.transaction = web3NodeA.eth.getTransaction(txId);
}

// Transfer coins between wallets  
$scope.transfer =function(){

console.log($scope.from);
var txId=web3NodeB.eth.sendTransaction({from: $scope.from, to: $scope.to, value: web3NodeB.toWei($scope.value, 'ether')});
$scope.transaction = web3NodeB.eth.getTransaction(txId);
console.log($scope.to);
}



});

app.controller('multisignCtrl', function($scope) {

$scope.isAlert=true;
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
$scope.senderBalance= $scope.nodeB_Balances[0];

var ABI=[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_owner1","type":"address"},{"name":"_owner2","type":"address"},{"name":"_owner3","type":"address"}],"name":"setOwners","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"approve","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"accepted","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_toAddress","type":"address"}],"name":"sendAsset","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"setRequired","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"assetValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"yetNeeded","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"address"}],"type":"function"}];
var Address="0xbf4f97b01b5cf8cb0095a17cf5d655dc7e062e13";
var multisign = web3NodeB.eth.contract(ABI).at(Address);

$scope.ownersAccepted=[];
$scope.buttonVisibility=false;
$scope.contractAddress=multisign.address;
$scope.yetNeeded=multisign.yetNeeded();
$scope.owner1=multisign.owners();
$scope.owner2=multisign.owners(1);
$scope.owner3=multisign.owners(2);
$scope.ownersAccepted[0]=multisign.accepted($scope.nodeB_Accounts[0]);
$scope.ownersAccepted[1]=multisign.accepted($scope.nodeB_Accounts[1]);
$scope.ownersAccepted[2]=multisign.accepted($scope.nodeB_Accounts[2]);
$scope.fromAddress=multisign.from();
$scope.toAddress=multisign.to();
$scope.yetNeeded=multisign.yetNeeded();
$scope.contractBalance= web3NodeB.fromWei(web3NodeB.eth.getBalance(multisign.address), "ether");
$scope.assetValue= web3NodeB.fromWei(multisign.assetValue(),"ether")
$scope.needed = {
  name:"1"
};
if($scope.yetNeeded!="0"){
$scope.buttonVisibility=true;
}

$scope.transfer =function(){

console.log($scope.from);
var txId=multisign.sendAsset($scope.to,{from: $scope.from,value: web3NodeB.toWei($scope.value, 'ether')});
$scope.transaction = web3NodeB.eth.getTransaction(txId);
multisign.setRequired($scope.needed.name,$scope.value,{from: $scope.from});
}

$scope.accept= function(index){
//alert(index);

multisign.approve({from: $scope.nodeB_Accounts[index]});
$scope.ownersAccepted[index]=true;
}


});
