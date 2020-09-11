//
//  Message Handling ....
//
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import io from 'socket.io-client';




export const socket = io('http://localhost:3030');
//socket.emit ('connection');


//-------------------------------
export const Socket = (() => {

	const [show, setShow] = useState ( true );
	const closeToast = () => setShow (false);

	const [data, setData] = useState('');
	//const alert = useAlert();

	socket.on ('FromAPI', (d) => {
		setData ('Hello Socket Event Nr. ' + d );
		setShow ( true);
	});

	return (
		<Toast show={show} onClose={closeToast}>
			<Toast.Header closeButton={false} >
				<strong>Kündigung</strong>
			</Toast.Header>
			<Toast.Body>
				<Row>
				{data}
				</Row>
				<Row><Button variant="primary" onClick={closeToast} >OK</Button></Row>
			</Toast.Body>
		</Toast>
	); 
});
