export const abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "lastDrawingId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "x",
				"type": "uint32[]"
			},
			{
				"name": "y",
				"type": "uint32[]"
			},
			{
				"name": "p",
				"type": "bool[]"
			}
		],
		"name": "drawLines",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "resetDrawing",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "startDrawingId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "x",
				"type": "uint32[]"
			},
			{
				"indexed": false,
				"name": "y",
				"type": "uint32[]"
			},
			{
				"indexed": false,
				"name": "p",
				"type": "bool[]"
			}
		],
		"name": "DrawLines",
		"type": "event"
	}
];