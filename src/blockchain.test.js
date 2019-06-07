const assert = require('assert');
const hex2ascii = require('hex2ascii');
const SHA256 = require('crypto-js/sha256');

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

    });
});