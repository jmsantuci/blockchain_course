const assert = require('assert');
const hex2ascii = require('hex2ascii');
const SHA256 = require('crypto-js/sha256');
// const sinon = require('sinon');

const Block = require('./block.js');
const BlockChain = require('./blockchain.js');

class DataTest {
    constructor(data, number) {
        this.data = data;
        this.number = number;
    }
}

describe("BlockChain Class Test", function() {
    describe("BlockChain creation test", function() {
        let blockChain = new BlockChain.Blockchain();
        it("Test BlockChain creation", function() {
            assert.equal(1, blockChain.chain.length, "After creation BlockChain has only Genesis block");
            assert.equal(0, blockChain.height);
        });

        it("Test genesis Block creation", function() {
            let genesisBlock = blockChain.chain[0];
            assert.notEqual(null, genesisBlock);
            // TODO: create a aux method
            let genesisBodyAsHex = hex2ascii(genesisBlock.body);
            let genesisBody = JSON.parse(genesisBodyAsHex);
            // assert.equal('7b2264617461223a2247656e6573697320426c6f636b227d', genesisBlock.body);
            assert.equal('Genesis Block', genesisBody.data);
            assert.equal(null, genesisBlock.previousBlockHash);
        });

    });

    describe("BlockChain addBlock test", function() {
        let blockChain = new BlockChain.Blockchain();
        let data = new DataTest("Fist block", 1);

        it("Test adding new Block to BlockChain", function() {
            let block = new Block.Block(data);
            blockChain._addBlock(block);
            assert.equal(2, blockChain.chain.length);
            assert.equal(1, blockChain.height);
        });

        it("Test Block after adding it to BlockChain", function() {
            let blockChainHeight = blockChain.height;
            let lastBlock = blockChain.chain[blockChain.chain.length -1];
            let block = new Block.Block(data);

            blockChain._addBlock(block).then(function(block) {
                assert.equal(blockChainHeight + 2, blockChain.chain.length);
                assert.equal(blockChainHeight + 1, blockChain.height);
                // check Block attributes
                assert.equal(blockChain.height, block.height);
                assert.notEqual(null, block.time);
                assert.notEqual(null, block.hash);
                assert.equal(lastBlock.hash, block.previousBlockHash);
            }).catch(function(error) {
                assert.fail("Error on validate Block attributes after adding it to BlockChain");
            });
        });
    });
    
    describe("BlockChain get block by hash", function() {
        
        it("Test get block by hash with only genesis", function() {
            let blockChain = new BlockChain.Blockchain();
            blockChain.getBlockByHash("00001ff").then(function(block) {
                fail("The shouldn't be found");
            }).catch(function(error) {
                // Ok !
            });
        });

        it("Test get block when it finds the block", function() {
            let blockChain = new BlockChain.Blockchain();
            let data1 = new DataTest("Fist block", 1);
            let data2 = new DataTest("Second block", 2);
            let data3 = new DataTest("Third block", 3);
            let blockToFind = new Block.Block(data2);

            blockChain._addBlock(new Block.Block(data1));
            blockChain._addBlock(blockToFind);
            blockChain._addBlock(new Block.Block(data3));

            blockChain.getBlockByHash(blockToFind.hash).then(function(block) {
                assert.deepEqual(blockToFind, block);
            }).catch(function(error) {
                fail("The block slould be found");
            });
        });

        it("Test get block when it doesn't find the block", function() {
            let blockChain = new BlockChain.Blockchain();
            let data1 = new DataTest("Fist block", 1);
            let data2 = new DataTest("Second block", 2);
            let data3 = new DataTest("Third block", 3);
            let blockToFind = new Block.Block(data2);

            blockChain._addBlock(new Block.Block(data1));
            blockChain._addBlock(new Block.Block(data2));
            blockChain._addBlock(new Block.Block(data3));

            blockChain.getBlockByHash("00001ff").then(function(block) {
                fail("The block slouldn't be found");
                assert.deepEqual(blockToFind, block);
            }).catch(function(error) {
                // Ok!
            });
        });
    });

    describe("BlockChain add Star", function() {
        
        it("Test requestMessageOwnershipVerification method", function() {
            let blockChain = new BlockChain.Blockchain();
            
            blockChain.requestMessageOwnershipVerification("12345").then(function(message) {
                assert.notEqual(null, message);
                assert.ok(message.length > 0)

                // Checking each part of message
                let parts = message.split(':');

                assert.equal(3, parts.length);
                assert.equal("12345", parts[0]);
                assert.ok(new Date().getTime() > parts[1]);
                assert.equal("starRegistry", parts[2]);
            }).catch(function() {
                assert.fail("Invalid message");
            });
        });

        it("Test submitStar method", function() {
            let blockChain = new BlockChain.Blockchain();
            // let spy = sinon.spy();
            // let mock = sinon.mock(blockChain);
            // mock.expects("_verifyMessage").returns(true);
            let address = "12345";
            let message = address + ':' + new Date().getTime().toString().slice(0,-3) + ':starRegistry';
            let signature = "54321";
            let star =
                '{"star": {'
                    + '"dec": "68° 52\' 56.9",'
                    + '"ra": "16h 29m 1.0s",'
                    + '"story": "Testing the story 4"'
                + '}}';

            blockChain.submitStar(address, message, signature, star).then(function(block) {
                assert.notEqual(null, block);
                assert.equal(1, block.height);
            }).catch(function() {
                assert.fail("Invalid Star");
            });
        });

        it("Test getStarsByWalletAddress method", function() {
            let blockChain = new BlockChain.Blockchain();
            let addressOne = "12345";
            let addressTwo = "23456";
            let messageOne = addressOne + ':' + new Date().getTime().toString().slice(0,-3) + ':starRegistry';
            let messageTwo = addressTwo + ':' + new Date().getTime().toString().slice(0,-3) + ':starRegistry';
            let signature = "54321";
            let starOne =
                '{"star": {'
                    + '"dec": "68° 52\' 56.9",'
                    + '"ra": "16h 29m 1.0s",'
                    + '"story": "Testing the story 1"'
                + '}}';
            let starTwo =
                '{"star": {'
                    + '"dec": "68° 52\' 56.9",'
                    + '"ra": "16h 29m 1.0s",'
                    + '"story": "Testing the story 2"'
                + '}}';
            let starThree =
                '{"star": {'
                    + '"dec": "68° 52\' 56.9",'
                    + '"ra": "16h 29m 1.0s",'
                    + '"story": "Testing the story 2"'
                + '}}';
            blockChain.submitStar(addressOne, messageOne, signature, starOne).catch(function() {
                assert.fail("Invalid Star One");
            });
            blockChain.submitStar(addressTwo, messageTwo, signature, starTwo).catch(function() {
                assert.fail("Invalid Star Two");
            });
            blockChain.submitStar(addressOne, messageOne, signature, starThree).catch(function() {
                assert.fail("Invalid Star Three");
            });

            assert.equal(4, blockChain.chain.length);

            blockChain.getStarsByWalletAddress(addressOne).then(function(stars) {
                assert.notEqual(null, stars);
                assert.equal(2, stars.length);
            });
            blockChain.getStarsByWalletAddress(addressTwo).then(function(stars) {
                assert.notEqual(null, stars);
                assert.equal(1, stars.length);
            });
        });

        it("Test validateChain method", function() {
            let blockChain = new BlockChain.Blockchain();
            let data1 = new DataTest("Fist block", 1);
            let data2 = new DataTest("Second block", 2);
            let data3 = new DataTest("Third block", 3);
            let invalidPreviousBlockHash = new Block.Block(data2);
            let invalidBlockAttribute = new Block.Block(data3);

            blockChain._addBlock(new Block.Block(data1));
            blockChain._addBlock(invalidPreviousBlockHash);
            blockChain._addBlock(invalidBlockAttribute);

            // Change third block previous hash
            invalidPreviousBlockHash.previousBlockHash = invalidBlockAttribute.hash;
            invalidBlockAttribute.hash = invalidBlockAttribute.generateHash();
            // Change second block attribute
            invalidBlockAttribute.height = 5;

            blockChain.validateChain().then(function(errorLog) {
                assert.notEqual(null, errorLog);
                assert.equal(2, errorLog.length);
                assert.equal('Error: Previous block hash attribute doesn\'t match hash of previous block', errorLog[0].toString());
                assert.equal('Error: Block has a invalid hash', errorLog[1].toString());
            });
        });

    });

});