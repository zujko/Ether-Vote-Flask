from flask import Flask, request, render_template
from web3 import Web3, HTTPProvider
from solc import compile_source
from web3.contract import ConciseContract
#from flask_cors import CORS, cross_origin
import json
import time


print('Waiting for blockchain to start')
time.sleep(3)

web3 = Web3(HTTPProvider('http://blockchain:8545'))

# Get contract as text
with open('ElectionContract.sol', 'r') as contract:
    contract_text=contract.read()

# Compile the contract
compiled_sol = compile_source(contract_text)


# Get Interface
contract_interface = compiled_sol['<stdin>:Election']

contract = web3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])

tx_hash = contract.deploy(args=('Test Election', 10, ['Person 1', 'Person 2', 'Person 3']), transaction={'from': web3.eth.accounts[0], 'gas': 4800000})
tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
contract_address = tx_receipt['contractAddress']

# Contract instance in concise mode
contract_instance = web3.eth.contract(contract_interface['abi'], contract_address, ContractFactoryClass=ConciseContract)

def authorize_all():
    """
    Gives all accounts in the test blockchain access to vote
    """
    voters = []
    for x in range(0, 10):
        voters.append(web3.eth.accounts[x])
    contract_instance.authorizeVoters(voters, transact={'from': web3.eth.accounts[0]})

def authorize_users(contract, voters, author):
    for voter in voters:
        voterList = []
        voterList.append(voter)
        try:
            contract.authorizeVoters(voterList, transact={'from': author})
        except ValueError:
            print(ValueError)
            print('error'+author)


authorize_all()

app = Flask(__name__)
#CORS(app)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/newElection')
def new_election():
    return render_template('newElection.html')

@app.route('/createNewElection', methods=['POST'])
def make_new_election():
    content = request.get_json(silent=True)
    print(content)

    contract_interface = compiled_sol['<stdin>:Election']
    constract = web3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])
    canidates = content['canidates'].split(",")
    voters = content['voters'].split(",")

    try:
        tx_hash = contract.deploy(args=(content['title'], 99999, canidates), \
            transaction={'from': content['author'], 'gas': 4800000})
        tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
        contract_address = tx_receipt['contractAddress']
        contract_instance = web3.eth.contract(contract_interface['abi'], contract_address, ContractFactoryClass=ConciseContract)
        authorize_users(contract_instance, voters, content['author'])
        response = app.response_class(
            response= json.dumps('made election\n'+ request.url_root+'/Election/'+ contract_address),
            status=200,
            mimetype='application/json'
        )
        return response
    except ValueError:
        print(ValueError)
        response = app.response_class(
            response= json.dumps('error creating election'),
            status=400,
            mimetype='application/json'
        )
        return response


@app.route('/candidates')
def show_entries():
    length = contract_instance.getCandidatesCount()
    candidates = []
    for a in range (0,length):
        listy = contract_instance.getCanidate(a)
        name = str(listy[0]).rstrip('\x00')
        candidates.append({'candidateName':name, 'votes':listy[1] })

    response = app.response_class(
        response=json.dumps(candidates),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/vote', methods=['POST'])
def vote():
    content = request.get_json(silent=True)
    index = -1
    length = contract_instance.getCandidatesCount()
    for a in range (0,length):
        listy = contract_instance.getCanidate(a)
        name = str(listy[0]).rstrip('\x00')
        if name == content['candidateName']:
            index = a
    if index != -1:
        contract_instance.vote(index, transact={'from': content['userAddress']})

    response = app.response_class(
        status=200,
        mimetype='application/json'
    )
    return response
