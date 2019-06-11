const assert = require('assert');
const hex2ascii = require('hex2ascii');
const SHA256 = require('crypto-js/sha256');

const Block = require('./block.js');

class DataTest {
    constructor(data, number) {
        this.data = data;
        this.number = number;
    }
}

describe('Test of Block class', function() {
    // The DataSet(body) used in unit tests
    let dataTest = new DataTest("String to test", 111);

    describe('Encode and decode Block Body', function() {
        it('should encode data field', function() {
            let block = new Block.Block(dataTest);
            let bodyAsHex = hex2ascii(block.body);
            let body = JSON.parse(bodyAsHex);

            assert.deepEqual(dataTest, body);
        });

        it('should decode data field', function() {
            let block = new Block.Block(dataTest);
            block.height = 1; // Because genesis block is not decode
            let body = block.getBData();

            assert.deepEqual(dataTest, body);
        });
    });

    describe('Test of Block validate method', function() {
        it('valid block', function() {
            let block = new Block.Block(dataTest);
            block.hash = block.generateHash();
            return block.validate().then(function() {
                assert.ok(true, "Block is intact");
            }).catch(function(error) {
                assert.fail("This block should be valid because it wasn't tempered");
            });
        });

        it('invalid block', function() {
            let invalidBlock = new Block.Block(dataTest);
            invalidBlock.hash = invalidBlock.generateHash();
            invalidBlock.height = 1; // Change block
            invalidBlock.validate().then(function() {
                assert.fail("This block should be tempered and invalid");
            }).catch(function(error) {
                assert.ok("The block was tempered")
            });
        });
    });
  });