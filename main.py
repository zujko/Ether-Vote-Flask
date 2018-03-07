from flask import Flask
from web3 import Web3, HTTPProvider
from solc import compile_source

web3 = Web3(HTTPProvider('http://localhost:8545'))

# Get contract as text
with open('ElectionContract.sol', 'r') as contract:
    contract_text=contract.read()

# Compile the contract
compiled_sol = compile_source(contract_text)

# Get Interface
contract_interface = compiled_sol['<stdin>:Election']

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World'


