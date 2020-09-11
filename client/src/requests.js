//-------------------------------------------------------------------------------
//  gesammelte Axios calls
//-------------------------------------------------------------------------------

import axios from 'axios';
import * as moment from 'moment';
import 'moment/locale/de';

import { FehlerMsg, FT } from './fehler.js';


const baseurl = "http://localhost:3030";

//-------------------------------------------------------------------------------
export const appendVertrag = ((vertrag) => {

	console.log ( "appendVertrag entered !!");

	const url = baseurl + "/api/post/vertrag";
	axios.post ( url, { data: vertrag})
		.then ((response) => {
			console.log ('OK ' + response );
			return true;
		})
		.catch ((error) => {
			console.log ('ERROR ' + error );
			FehlerMsg (FT.Network, error );
			return false;			
		})	
	return true;	
});

//-------------------------------------------------------------------------------
export const updateVertrag = ((vertrag) => {
	return true;
});

			//console.log ("e[0].id: " + e[0].id);
			// Kunden holen

			/*
			let url = baseurl + '/api/get/vertrag';
			axios.get ( url, {params: { id: e[0].id }})
			.then (res => {
				console.log ( res.data );
				props.vertragf ( prevVertrag => ({...prevVertrag, 
					Aktiv: true,
					Id: res.data.id,
					VertragsNummer: res.data.nummer,
					IdKunde:  res.data.id_kunde,
					KName: '',
					IdArt: res.data.id_vertragsart,
					Art: '',
					IdStandort: res.data.id_standort,
					Standort: '',
					VStart: '', // Vertragsstart
					VLaufzeit: 12,         // Laufzeit
					VNext: '',  // Naechste Verl., Vstart + VLaufzeit
					KueFrist: 3,          // Monate 
					KueNext: '',          // VNext - KueFrist
					Vorlauf: 7,           // Tage
					KueEff: '',           // KueNext - Vorlauf
					ZahlungMon: '',
					ZahlungpviertelA: '',
					ZahlungphalbA: '',
					ZahlungpA: '',
					KostenpA: '',
					KNummer: '',
					KStrasse: '',
					KPlzOrt: '',
					KTel: '',
					KFax: '',
					KMail: '',  
					Sonstiges: '',
					LastMod: '',
					File: ''
				}));
*/

// Vertrag aus Datenbank

//-------------------------------------------------------------------------------
export const getVertrag = ( async (id, vertragf ) => {

	var vdata = {}; 
	var kdata = {}; // Kunde aus Datenbank
	var sdata = {}; // Standort aus Datenbank
	var adata = {}; // Vertragsart aus Datenbank

	// Vertrag
	//let url = baseurl + "/api/get/vertrag";

	await axios.get ( baseurl + "/api/get/vertrag", {params: { id: id}})
		.then ( resp => {
			console.log ( "/api/get/vertrag: " + JSON.stringify(resp.data));
			//let k = resp.data.id_kunde;
			//console.log ( k) ;

			vdata = resp.data;
			//console.log ( "1. " + vdata.id_kunde );
			
		})
		.catch ( (error) => {
			console.log ( error );
			return false; 
		}) 

	await axios.get ( baseurl + "/api/get/kunde", {params: { id: vdata.id_kunde}})
	.then (resp => {
		//console.log ( "/api/get/kunde: " + resp.data );
		kdata = resp.data;

	})
	.catch ( (error) => {
		console.log ( error );
		return false; 
	}) 

	// Standort
	await axios.get ( baseurl + "/api/get/standort", {params: { id: vdata.id_standort}})
	.then ((response) => {
		//console.log ( "/api/get/standort: " + response.data );
		sdata = response.data;
	})
	.catch ( (error) => {
		console.log ( error );
		return false; 
	}) 

	// Vertragsart
	//url = baseurl + "/api/get/vart";	
	await axios.get ( baseurl + "/api/get/vart", {params: { id: vdata.id_vertragsart }})
	.then ((response) => {
		//console.log ( "/api/get/vart: " + response.data );
		adata = response.data;
	})
	.catch ( (error) => {
		console.log ( error );
		return false; 
	}) 

	//--zahlungen
	let zm = '', z4 = '', z2 = '', z1 = '';
	let fak = vdata.faktor;
	let val = parseFloat (vdata.betrag);
	switch ( fak ) {
		case 1:
			z1 = val;
			break;
		case 2:
			z2 = val;
			break;
		case 4:		
			z4 = val;
			break;
		case 12:
			zm = val;
			break;
		default:
			break;	
	}	
	let total = val * fak;

	console.log ("val: " + val + " fak: " + fak + " total: " + total);

	vertragf ( prevVertrag => ({...prevVertrag, 
		"Id": vdata.id,
    	"Aktiv": vdata.flag > 0,
    	"VertragsNummer": vdata.nummer,
    	"IdKunde": vdata.id_kunde,
    	"KName": kdata.name,
    	"IdArt": vdata.id_vertragsart,
    	"Art": adata.name,
    	"IdStandort": vdata.id_standort,
    	"Standort": sdata.name,
    	"VStart": moment (vdata.start).format ('YYYY-MM-DD'), //moment().format('YYYY-MM-DD'), // Vertragsstart
    	"VLaufzeit": vdata.laufzeit,         // Laufzeit
    	"VNext": moment ( vdata.start ).add ( vdata.laufzeit, 'months').format("YYYY-MM-DD"),  // Naechste Verl., Vstart + VLaufzeit
    	"KueFrist": vdata.kuefrist,          // Monate 
    	"KueNext": moment ( vdata.start ).add ( vdata.laufzeit, 'months').subtract (vdata.kuefrist, 'months').format ('YYYY-MM-DD'),          // VNext - KueFrist
    	"Vorlauf": vdata.vorlauf,           // Tage
    	"KueEff": moment(vdata.kueinfo).format('YYYY-MM-DD'),           // KueNext - Vorlauf
    	"ZahlungMon": zm ,
    	"ZahlungpviertelA": z4,
    	"ZahlungphalbA": z2,
    	"ZahlungpA": z1,
    	"KostenpA": total,
    	"KNummer": kdata.nummer,
    	"KStrasse": kdata.strasse,
    	"KPlzOrt": kdata.plzort,
    	"KTel": kdata.telefon,
    	"KFax": kdata.fax,
    	"KMail": kdata.mail,  
		"Pfad": vdata.pfad,	
		"File": vdata.file,
    	"Sonstiges": vdata.sonstiges,
    	"LastMod": moment( vdata.lastmod ).format ('DD.MM.YYYY HH:MM')
	}));

	return true;
});

//----------------------------------------------------------------------------------------------
//
export const getKunde = ( async ( id, vertragf ) => {

	let kunde = {};

	await axios.get ( baseurl + "/api/get/kunde", {params: { id: id}})
	.then ( rsp => {
		console.log ( rsp.data );
		kunde = rsp.data;
	})
	.catch ( err => {
		return false;
	})

	vertragf ( prevVertrag => ({...prevVertrag, 
		  "IdKunde": kunde.id, 
		  "KName": kunde.name,
		  "KNummer": kunde.nummer,
		  "KStrasse": kunde.strasse,
		  "KPlzOrt": kunde.plzort,
		  "KTel": kunde.telefon,
		  "KFax": kunde.fax,
		  "KMail": kunde.mail  
	}));

	return true;
});


//--------------------------------------------------------------------------------
export const getStandorte = (() => {

	let arr = new Array(32);

	axios.get ( baseurl + '/api/get/standorte')
		.then ((response) => {
			console.log (response.data);
			arr = response.data;
			console.log (arr);
		})
		.catch ((error) => {
			alert ('ERROR => /api/get/standorte');
		})	
	return arr;	
});

//---------------------------------------------------------------------------------
export const authUser = ( async (name, passwort) => {

	let url = baseurl + '/api/post/userauth';
	// let ret = true;

	console.log ("authUser entered mit " + name + "/"  + passwort);

	var res, error;


	await axios
	.post ( url, { data: { name: name, passwort: passwort }})
		.then (rsp => {
			console.log ( rsp );
			res = rsp;
			//if ( rsp.status === 200 ) {
			//	console.log ("authUser OK");
			//	return true;
			//}
			//else {
			//	console.log ("authUser ERROR");
			//	return false;
			//}
		})
		.catch ((err) => {
			console.log ( err );
			error = err;
			//return false;
		})	
		console.log (res);
		console.log ( error );
});



export const getTest = (() => {
	axios.get ('/api/get/test')
		.then (( response ) => {
			console.log (response);
			return ( response);
		})
		.then((error) => {
			console.log(error);
			return (error);
		})
});