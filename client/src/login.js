import React, { useState, useContext } from 'react';
import Container  from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';  
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
//import Alert from 'react-bootstrap/Alert';
//import * as VAPI from './requests.js';

import axios from 'axios';
import { UserContext } from './App.js';
import { useHistory } from 'react-router-dom';

import { FehlerMsg } from './fehler.js';
import { ErrorContext } from './App.js';

import './login.css';
require ('dotenv').config();

const url = 'http://localhost:3030/admin/api/post/userauth';

const Login = ((props) => {

	const [Info, setInfo] = useState ({ name: '', passwort: ''});
	//const [Fehler, setFehler]  = useState ({fehler: false, text: ''});
	//const [Display, setDisplay] = useState ( true);

	const { User, setName} = useContext ( UserContext );
	const { Error, setError} = useContext ( ErrorContext );

	const history = useHistory();
	//  .env testen
	//let lazy = process.env.PORT ;
	//console.log ( lazy );

	const changeUser = ((e) => {
		const { name, value} = e.target;
		setInfo ( prevInfo => ({...prevInfo, [name]: value}));
	});
  
	const authenticate = ((e) => {

		e.preventDefault();

		if ( Info.name === '') {
			setError ({ show: true, title: "Eintrag fehlt", text: "Bitte Anmeldenamen eingeben!"});
			setInfo ({"name": '', "passwort": ''});
			return false;
		}
		if ( Info.passwort === '') {
			setError ({ show: true, title: "Eintrag fehlt", text: "Bitte Passwort eingeben!"});
			setInfo ({"name": '', "passwort": ''});
			return false;
		}


 		axios
		.post ( url, { data: { name: Info.name, passwort: Info.passwort }})
		.then ( res => { 
			console.log ( " ----- .then ");
			if ( res.status === 200 ) {
				setName ( Info.name );
				history.push ("/");
				return true;
			}
		})
		
		.catch ( err => { 
			console.log (" ----  .catch ");

			if ( err.response.status === 404 ) {
				setError ({ show: true, title: "Loginfehler", text: "Authentifizierung fehlgeschlagen!"});
				setInfo ({"name": '', "passwort": ''});
				return false;	
			}
			else {
				setError ({ show: true, title: "Netzwerkfehler", text: <><p>{err.response.status}</p><p>{err.response.statusText}</p></>});
				setInfo ({"name": '', "passwort": ''});
				return false;
			}
		})
		
	});

	return (
			<div className="text-center login-total">
				<FehlerMsg />
				<Form className="form-signin" onSubmit={authenticate}>
					<h1 className="h3 mb-3 font-weight-normal">Lwerk Account</h1>
					<br />
					<Form.Group>
						<Form.Label htmlFor="inputUsername">Anmeldename: </Form.Label>
              			<Form.Control className="form-control" type="text" id="inputUsername" name="name" value={Info.name} onChange={changeUser} />
					</Form.Group>
					<Form.Group>
              			<Form.Label htmlFor="inputUserpasswort">Passwort: </Form.Label>
              			<Form.Control className="form-control" type="password" id="inputUserpasswort" name="passwort" value={Info.passwort} onChange={changeUser} />
				    </Form.Group>
					<br />
					<Button className="btn btn-lg btn-info btn-block" type="submit">
            			Anmelden
          			</Button>
				</Form>
			</div>	
	);
});

export default Login;

//<Alert variant="danger" show={Fehler.fehler} transition={null} >
//{Fehler.text}
//</Alert>