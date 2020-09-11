//
import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import io from 'socket.io-client';
import { Form } from 'react-bootstrap';
import { socket } from './socket.js';



//const socket = io('http://localhost:3030');
//socket.emit ('connection');

const TestChat = ((props) => {

	const [ Message, setMessage ] = useState ("");
	const [ Chat, setChat ] = useState ([]); 

	useEffect (() => {

	//	console.log ("useEffect entered");

		socket.on ("chat", ((id, msg) => {
			console.log ( id + ": " + msg );
			let newitem = { "id": id, "msg": msg};
			setChat ( Chat => [...Chat, newitem ]);
		}));
	}, []);
	
	const onTextChange = ((e) => {
		setMessage (e.target.value);
	});

	const onMessageSubmit = (() => {
		socket.emit ("chat" , Message);
		setMessage ('');
	});

	const RenderChat = (() => {

		return (
			Chat.map (({ id, msg }, idx) => {
				return <div key={idx}>
					<span style={{ color: "green"}}>{id}: </span>
					<span>{msg}</span>
				</div>
			})
		);
	});

	return (
		<div>
			<Form.Control type="text" onChange={onTextChange} value={Message} />
			<Button variant="secondary" onClick={onMessageSubmit}>Ab</Button>
			<div>
				<RenderChat />
			</div>
		</div>
	);
});

export default TestChat;

