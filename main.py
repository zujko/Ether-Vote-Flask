from flask import Flask
from web3 import Web3, HTTPProvider
from solc import compile_source
from web3.contract import ConciseContract

web3 = Web3(HTTPProvider('http://localhost:8545'))

# Get contract as text
with open('ElectionContract.sol', 'r') as contract:
    contract_text=contract.read()

# Compile the contract
compiled_sol = compile_source(contract_text)

# Get Interface
contract_interface = compiled_sol['<stdin>:Election']

contract = web3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])

tx_hash = contract.deploy(args=('Test Election', 10, ['Person 1','Person 2','Person 3']), transaction={'from': web3.eth.accounts[0], 'gas': 4800000})

tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
contract_address = tx_receipt['contractAddress']

# Contract instance in concise mode
contract_instance = web3.eth.contract(contract_interface['abi'], contract_address, ContractFactoryClass=ConciseContract)

print(contract_instance.getElectionName())
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World'