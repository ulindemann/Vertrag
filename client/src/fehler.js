import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import {ErrorContext} from './App.js';

export const FT = {
	Login: "Authentifizierungsfehler!",
	Network: "Netzwerkfehler!"
};




export const FehlerMsg = (() => {

	const { Error, setError} = useContext ( ErrorContext );
	
	const ClearError = (() => {
		console.log ("ClearError");
		setError ({ show: false, title: '', text: ''});
	});

	return (
		<Modal show={Error.show} centered={true} animation={false}>
			<Modal.Header closeButton style={{backgroundColor: "darkred", color: "#fff"}}>
				<Modal.Title>{Error.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h5>{Error.text}</h5>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={ClearError}>OK</Button>
			</Modal.Footer>
		</Modal>
	);
});
