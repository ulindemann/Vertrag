//
//    CustomTypeAhead - erweiterung von Typeahead ( async )
//

import React from 'react';
import { AsyncTypeahead} from 'react-bootstrap-typeahead';
import axios from 'axios';
import * as VAPI from './requests.js';

//import './vertrag.css';
//import 'react-bootstrap-typeahead/css/Typeahead.css';


const baseurl = "http://localhost:3030";

//--------------------------------------------------------------------------------------
// async
//--------------------------------------------------------------------------------------
// Kundeneingabe
//
const KundenTypeAhead = ((props) => {

  //----------------------------------------------------------------------------------
  // Vertrag mit....
  //----------------------------------------------------------------------------------
  const setVPartner = ((e) => {

    console.log ( "setVPartner : " );
    console.log (e.length);
    console.log (e[0]);

    if ( e.length === 0 ) {
		props.vertragf ( prevVertrag => ({...prevVertrag, "IdKunde": -1, "KName": "" }));
    }
    else { 
    // neu oder alt?
      if ( e[0].customOption === true ) {
        props.vertragf ( prevVertrag => ({...prevVertrag, 
                                "IdKunde": -1, 
                                "KName": e[0].label,
                                "KNummer": '',
                                "KStrasse": '',
                                "KPlzOrt": '',
                                "KTel": '',
                                "KFax": '',
                                "KMail": ''  
        }));
      }
      else {
		VAPI.getKunde ( e[0].id, props.vertragf );
		// TODO Fehler ausgeben 
      }
	}  
	return true;
  });

  //-------  Daten holen  --------------------------------------------
  //-------  1. Kunden

  
  const FillMe = ((query) => {

	const url = baseurl + "/api/search/kunden";

	props.kundenf ({ "isLoading": true, "options": []});
	let tmp = [];

	axios.get ( url, {params: { qry: query}})
		.then (res => {
			console.log ( res.data );
			if ( res.data.length > 0 ) {
				res.data.map (data =>  {
						tmp.push ({ id: data.id, label: data.name });
						//console.log ( KundenSearch);
						props.kundenf ({ "isLoading": false, "options": tmp });
						return null;
				 })
			}
		})
	props.kundenf ({ "isLoading": false, "options": tmp });
  });


	return (
		<AsyncTypeahead
			onSearch={FillMe}
			isLoading={props.kunden.isLoading}
			allowNew={true}
			id="typeahead-kunde"
			onChange={setVPartner}
			options={props.kunden.options}
			placeholder={props.vertrag.KName}
			clearButton={true}
			minLength={1}
			align='right'
			emptyLabel="Neuer Kunde"
			defaultInputValue={props.vertrag.KName}
		/>
	);
});

//-----------------------------------------------------------------------------------------------
// Eingabe Vertragsart
const VertragsartTypeAhead = ((props) => {

	const FillMe = ((query) => {

		const url = baseurl + "/api/search/vart";
	
		props.vartf ({ "isLoading": true, "options": []});
		let tmp = [];
	
		axios.get ( url, {params: { qry: query}})
			.then (res => {
				console.log ( res.data );
				if ( res.data.length > 0 ) {
					res.data.map (data =>  {
						tmp.push ({ id: data.id, label: data.name });
						//console.log ( KundenSearch);
						props.vartf ({ "isLoading": false, "options": tmp });
						return null;
					 })
				}
			})
		props.vartf ({ "isLoading": false, "options": tmp });
	});
	
	// und rein damit
	
	const setVArt = ((e) => {

		console.log ( "setVArt : " );
		console.log (e.length);
		console.log (e[0]);
	
		if ( e.length === 0 ) {
			props.vertragf ( prevVertrag => ({...prevVertrag, "IdArt": -1, "Art": "" }));
		}
		else { 
		// neu oder alt?
		  if ( e[0].customOption === true ) {
			props.vertragf ( prevVertrag => ({...prevVertrag, 
									"IdArt": -1, 
									"Art": e[0].label
			}));
		  }
		  else {
			//console.log ("e[0].id: " + e[0].id);
			// Kunden holen
			let url = baseurl + '/api/get/vart';
			axios.get ( url, {params: { id: e[0].id }})
			.then (res => {
				console.log ( res.data );
				props.vertragf ( prevVertrag => ({...prevVertrag, 
					  "IdArt": res.data.id, 
					  "Art": res.data.name
				}));
			})
		  }
		}  
	});  
	

	return (
		<AsyncTypeahead
			onSearch={FillMe}
			isLoading={props.vart.isLoading}
			allowNew={true}
			id="typeahead-vart"
			onChange={setVArt}
			options={props.vart.options}
			placeholder={props.vertrag.Art}
			clearButton={true}
			minLength={1}
			align='right'
			emptyLabel="Neue Vertragsart"
			defaultInputValue={props.vertrag.Art}
		/>
	);
});

//================================================================================================
//  Eingabe Vertragsnummer
//
const NummerTypeAhead = ((props) => {

	//-----------  search --------------
	const FillMe = ((query) => {

		const url = baseurl + "/api/search/vnummer";
	
		props.nummerf ({ "isLoading": true, "options": []});
		let tmp = [];
	
		axios.get ( url, {params: { qry: query}})
			.then (res => {
				console.log ( res.data );
				if ( res.data.length > 0 ) {
					res.data.map (data =>  {
						tmp.push ({ id: data.id, label: data.nummer });
						//console.log ( KundenSearch);
						//props.nummerf ({ "options": tmp });
						return null;
					 })
				}
				props.nummerf ({ "isLoading": false , "options": tmp });
			})
		props.nummerf ({ "isLoading": false , "options": tmp });
	});

	//------------ onChange -------------
	const setVNummer = ((e) => {

		//console.log ( "setVArt : " );
		console.log (e.length);
		//console.log ( "setVNummer: " + e[0].id + "/" + e[0].label );
	
		if ( e.length === 0 ) {
			props.vertragf ( prevVertrag => ({...prevVertrag, "Id": -1, "VertragsNummer": "" }));
		}
		else { 
		// neu oder alt?
		  if ( e[0].customOption === true ) {
			console.log ( "Vertragsnummer: " + e[0].label );

			props.vertragf ( prevVertrag => ({...prevVertrag, 
									"Id": -1, 
									"VertragsNummer": e[0].label
			}));
		  }
		  else {
			//console.log ("e[0].id: " + e[0].id);
			// Vertrag holen
			VAPI.getVertrag ( e[0].id, props.vertragf );

			
		  }
		}  		

	}); 

	return (
		<AsyncTypeahead
			onSearch={FillMe}
			isLoading={props.nummer.isLoading}
			allowNew={true}
			id="typeahead-vnummer"
			onChange={setVNummer}
			options={props.nummer.options}
			placeholder={props.vertrag.VertragsNummer}
			clearButton={true}
			minLength={1}
			align='left'
			emptyLabel="Neue Vertragsnummer"
			defaultInputValue={props.vertrag.VertragsNummer}
		/>
	);
});

export { KundenTypeAhead, VertragsartTypeAhead, NummerTypeAhead };

//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================
//================================================================================================
//
//    ALT !!!!
//
/*
const KundenArr = [];
const SearchArr = [];

const CustomTypeAhead = ((props) => {

	//----------------------------------------------------------------------------------
  	// Kunden einlesen
  	useEffect (() => {
    	console.log ("");
    	axios.get ("/api/get/kunden")
      		.then ( res  => { 
        		let i;
        		console.log ( res.data );
        		for ( i = 0; i < res.data.length ; ++i ) {
          			KundenArr[i] = res.data[i];
          			SearchArr.push ({id: i, label: KundenArr[i].name});
        		}
      		})
      		.catch ( err => { alert (err.message)} )
	  },[]);
	  
  //----------------------------------------------------------------------------------
  // Vertrag mit....
  //----------------------------------------------------------------------------------
  const setVPartner = ((e) => {
    
    console.log ( "setVPartner : " );
    console.log (e.length);
    console.log (e[0]);

    if ( e.length === 0 ) {
		props.f ( prevVertrag => ({...prevVertrag, "IdKunde": -1, "KName": "" }));
    }
    else { 
    // neu oder alt?
      if ( e[0].customOption === true ) {
        props.f ( prevVertrag => ({...prevVertrag, 
                                "IdKunde": -1, 
                                "KName": e[0].label,
                                "KNummer": '',
                                "KStrasse": '',
                                "KPlzOrt": '',
                                "KTel": '',
                                "KFax": '',
                                "KMail": ''  
        }));
      }
      else {
        console.log ("e[0].id: " + e[0].id);
        let kunde = KundenArr[e[0].id];
        props.f ( prevVertrag => ({...prevVertrag, 
          "IdKunde": kunde.id, 
          "KName": kunde.name,
          "KNummer": kunde.nummer,
          "KStrasse": kunde.strasse,
          "KPlzOrt": kunde.plzort,
          "KTel": kunde.telefon,
          "KFax": kunde.fax,
          "KMail": kunde.mail  
        }));
      }
    }  
  });


	return (
		<AsyncTypeahead
			allowNew={true}
			id="basic-typeahead-example"
			onChange={setVPartner}
			options={SearchArr}
			placeholder="Vertragsparner"
			clearButton={true}
			minLength={3}
			align='right'
			emptyLabel="Neuer Kunde"
			defaultInputValue={props.v.KName}
		/>
	);
});

	//----------------------------------------------------------------------------------
  	// Kunden einlesen
  	//useEffect (() => {
    //	console.log ("");
    //	axios.get ("/api/get/kunden")
    //  		.then ( res  => { 
    //    		let i;
    //    		console.log ( res.data );
    //    		for ( i = 0; i < res.data.length ; ++i ) {
    //      			KundenArr[i] = res.data[i];
    //      			SearchArr.push ({id: i, label: KundenArr[i].name});
    //    		}
    //  		})
    //  		.catch ( err => { alert (err.message)} )
	//  },[]);
	  
*/