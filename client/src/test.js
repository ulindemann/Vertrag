import React, {useEffect, useState } from 'react';
import io from 'socket.io-client';
import ReactSpeedometer from "react-d3-speedometer"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { FehlerMsg, FT } from './fehler.js';
import "./test.css"; 


const TestPage = (() => {

	const [ value, setValue ] = useState ( 0 );

	useEffect (() => {

		let inter = setInterval (() => {
			let val = value;
			val += 10;
			if ( val > 1000)
				val = 0;
			setValue ( val );
		}, 100 );

		return () => {
			clearInterval (  inter );
		}
	}, [value] );

	var socket; 

	useEffect (() => {
			socket = io('http://localhost:3030');
	},[]);


	return (
		<Container className="test-container">
			<h1>Test</h1>
			<br />
			<Row>
				<Col>
					<ReactSpeedometer 
						value={value}
						needleTransition={"easeElastic"}
				//needleTransitionDuration={100}
					/>
				</Col>
				<Col></Col>	
			</Row>
		</Container>
	);
});

export default TestPage;

//{FehlerMsg ("Unmöglicher Fehlertext")}
//<Button onClick={FehlerMsg('Möglicher Fehlertext')}>Fehler</Button>
