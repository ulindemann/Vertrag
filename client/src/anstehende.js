import React, { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';

import Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import * as moment from 'moment';
import 'moment/locale/de';

import { UserContext } from './App.js';
import io from 'socket.io-client';

//import 'bootstrap/dist/css/bootstrap.min.css';
//import './anstehende.css';

const Anstehende = (() => {

	const [VListe, setVListe] = useState ([
		{
			nummer: "23567-2",
			partner: "Telefonica O2",
			next: moment('2021-11-01').format('DD.MM.YYYY'),
			kuendigung: moment('2021-08-01').subtract(1, 'days').format('DD.MM.YYYY')
		}
	]);
	/*	
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		},
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		},
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		},
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		},
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		},
		{
			nummer: "5688892-a1",
			partner: "Gauner Gmbh & Co KG",
			next: moment('2021-10-01').format('YYYY-MM-DD'),
			kuendigung: moment('2021-07-01').subtract(1, 'days').format('DD.MM.YYYY')
		}
	]);
	*/

	const { LoggedIn, User} = useContext ( UserContext );
	var socket; 

	useEffect (() => {

		//if ( LoggedIn) {
			console.log ("Anstehende -> useEffect");
			console.log ("Anstehende -> " + User);

			socket = io('http://localhost:3030');
		//}	
	},[]);

	return (
		<div id="anstehende-total">
			<h3>Anstehende Kündigungen:</h3>
			<br />
				{VListe.map ((data, i) => {
					return (
						<Card className="kuendigung-card" border="danger" key={i}>
							<Card.Header as="h5">{data.nummer}</Card.Header>
							<Card.Body>
								
							</Card.Body>
						</Card>
					);
				})}  
		</div>
	);
});

export default Anstehende;

/*
						<Card.Header as="h5">{data.nummer}</Card.Header>


<Card.Body>
<Button variant="primary">Quittieren</Button>
</Card.Body>
*/