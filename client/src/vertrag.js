import React, { useState, useEffect, useContext } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as moment from 'moment';
import 'moment/locale/de';

import { sprintf } from 'sprintf-js';

//---------------------------------------------------------------------------------------------------------
//import socket from './socket.js';
//import TestChat from './chat.js';
//---------------------------------------------------------------------------------------------------------


import * as VAPI from './requests.js';
import { KundenTypeAhead, VertragsartTypeAhead, NummerTypeAhead } from './customtypeahead.js';
import Anstehende from './anstehende.js';
//import { Navi } from "./nav.js";
//import Login from './login.js';

//import { ErrorContext } from './App.js';

//import 'bootstrap/dist/css/bootstrap.min.css';
//import './Typeahead.css';
import './vertrag.css';
import { FehlerMsg } from './fehler.js';

//require ('dotenv').config();


const Standorte = [
{ id: 1, name: 'BRAU' },
{ id: 2, name: 'BRB' },
{ id: 3, name: 'BUERK' },
{ id: 4, name: 'ERGO' },
{ id: 5, name: 'ERK' },
{ id: 6, name: 'GAE_14' },
{ id: 7, name: 'GAE_57' },
{ id: 8, name: 'HAG' },
{ id: 9, name: 'HZD' },
{ id: 10, name: 'KD' },
{ id: 11, name: 'KWB' },
{ id: 12, name: 'KWS_TW' },
{ id: 13, name: 'MARZ' },
{ id: 14, name: 'PLAU' },
{ id: 15, name: 'POT' },
{ id: 16, name: 'STW' },
{ id: 17, name: 'Teltow_Lanky' },
{ id: 18, name: 'WEX' },
{ id: 19, name: 'WI' },
{ id: 20, name: 'WVS' }
];

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

const VertragHome = (() => {

  //const { Error, setError} = useContext ( ErrorContext );

  const [Vertrag, setVertrag] = useState ({
    Id: -1,
    Aktiv: true,
    VertragsNummer: '',
    IdKunde: -1,
    KName: '',
    IdArt: 1,
    Art: '',
    IdStandort: 10,
    Standort: 'KD',
    VStart: "2020-08-01", //moment().format('YYYY-MM-DD'), // Vertragsstart
    VLaufzeit: 12,         // Laufzeit
    VNext: "2021-08-01",  // Naechste Verl., Vstart + VLaufzeit
    KueFrist: 3,          // Monate 
    KueNext: '2021-05-01',          // VNext - KueFrist
    Vorlauf: 30,           // Tage
    KueEff: '2021-04-01',           // KueNext - Vorlauf
    ZahlungMon: 0.00,
    ZahlungpviertelA: 0.00,
    ZahlungphalbA: 0.00,
    ZahlungpA: 0.00,
    KostenpA: 0.00,
    KNummer: '',
    KStrasse: '',
    KPlzOrt: '',
    KTel: '',
    KFax: '',
    KMail: '',  
    Sonstiges: '',
    LastMod: '',
    File: '',
    Pfad: ''
  });

  // SearchArry fuer Kundendropdown
  const [Kunden, setKunden] = useState ({isLoading: false, options: []});

  // Vertragsartdropdown
  const [VArt, setVArt] = useState ({isLoading: false, options: []});

  // Vertragsnummerdropdown
  const [VNummer, setVNummer]  = useState ({isLoading: false, options: []});

  
  
  //  Vertragskosten
  useEffect (() => {
    let mon = 0.00, viertel = 0.00, halb = 0.00, jahr = 0.00, total = 0.00;
    setVertrag (prevVertrag => ({...prevVertrag, "ZahlungMon": mon, "ZahlungpviertelA": viertel, "ZahlungphalbA": halb, "ZahlungpA": jahr, "KostenpA": total }));
  }, []);
  
  //----- aktiv Toggle
  const toggleAktiv = ((e) => {

    const { name, checked} = e.target;
    setVertrag ( prevVertrag => ({...prevVertrag, [name]: checked}));
  });

  //
  //  setVertragStandart --- alles ohne Sonderfälle
  //
  const setVertragStandart = ((e) => {
      const { name, value} = e.target;
      setVertrag ( prevVertrag => ({...prevVertrag, [name]: value}));
  });

  const setVertragStandort = ((e) => {

    const value = e.target.value;
    const elem = Standorte.find (item => item.name === value);

    setVertrag ( prevVertrag => ({...prevVertrag, "Standort": value, "IdStandort": elem.id}));
  });

  //---------  Vertragszeiten

  const setVertragszeiten = ((e) => {
  
    const { name, value } = e.target;

    let start = Vertrag.VStart; 
    let    dauer = Vertrag.VLaufzeit;
    let    kfrist = Vertrag.KueFrist;
    let    vorlauf = Vertrag.Vorlauf;
    

    console.log ("VStart: " + start + ", VLaufzeit: " + dauer + ", Kuefrist: " + kfrist + ", Vorlauf: " + vorlauf );    

    switch ( name ) {
      case "VStart":
        start = moment(value).format('YYYY-MM-DD');
        break;
      case "VLaufzeit":
        dauer = value;
        break;  
      case "KueFrist":
        kfrist = value;
        break;
      case "Vorlauf":
        vorlauf = value;
        break;  
      default:
        alert ("Fehler: Ungültiges Feld --> " + name );
        break;    
      }
    let ende  = moment(start).add ( dauer, 'months').format('YYYY-MM-DD');
    let next   = moment(ende).subtract( kfrist, 'months').subtract( 1, 'days').format('YYYY-MM-DD');
    let keff = moment(next).subtract( vorlauf, 'days').format('YYYY-MM-DD');

    setVertrag (prevVertrag => ({...prevVertrag, "VStart": start, "VLaufzeit": dauer, "VNext": ende, "KueFrist": kfrist, "KueNext": next,
                                                  "Vorlauf": vorlauf, "KueEff": keff }));
  });

  //-- Zahlungupdate ---------------------------------

  const setZahlung = ((e) => {

    const { name, value } = e.target;
    let mon = 0.00, viertel = 0.00, halb = 0.00, jahr = 0.00, total = 0.00;
 
    switch ( name ) {
      case "ZahlungMon": 
        mon = value;
        total = value * 12.0;
        break;
      case "ZahlungpviertelA":
        viertel = value;
        total = value * 4.0;
        break;
      case "ZahlungphalbA": 
        	halb = value;
          total = value * 2.0;
          break;
      case "ZahlungpA": 
          jahr = value * 1.0;
          total = value * 1.0;
          break;
      default:
        alert ("Fehler: Ungültiges Feld --> " + name );
        break;    
    }
    let total_out = sprintf ("%.2f €", total  );
    setVertrag (prevVertrag => ({...prevVertrag, "ZahlungMon": mon, "ZahlungpviertelA": viertel, "ZahlungphalbA": halb, "ZahlungpA": jahr, "KostenpA": total_out }));
  });

  // rein in die Datenbank  --------------------------------------------------------------------------------------------
  //
  const sendData = ((e) => {

    e.preventDefault();

    if ( VAPI.appendVertrag ( Vertrag )) {
      ClearForm ();
    }
  });

  /********************************************************************************************************************
   * erfolgreiche Speicherung - 
   */
  const ClearForm = (() => {

    setVertrag (prevVertrag => ({...prevVertrag, 
      "Id": -1,
      "Aktiv": true,
      "VertragsNummer": '',
      "IdKunde": -1,
      "KName": '',
      "IdArt": 1,
      "Art": '',
    }));

    setVertrag (prevVertrag => ({...prevVertrag, "ZahlungMon": 0.00, "ZahlungpviertelA": 0.00, "ZahlungphalbA": 0.00, "ZahlungpA": 0.00, "KostenpA": 0.00 }));

    let start = moment().format('YYYY-MM-DD'); 
    let    dauer = 12;
    let    kfrist = 3;
    let    vorlauf = 30;
    let ende  = moment(start).add ( dauer, 'months').format('YYYY-MM-DD');
    let next   = moment(ende).subtract( kfrist, 'months').subtract( 1, 'days').format('YYYY-MM-DD');
    let keff = moment(next).subtract( vorlauf, 'days').format('YYYY-MM-DD');

    setVertrag (prevVertrag => ({...prevVertrag, "VStart": start, "VLaufzeit": dauer, "VNext": ende, "KueFrist": kfrist, "KueNext": next,
                                                  "Vorlauf": vorlauf, "KueEff": keff }));

    setVertrag (prevVertrag => ({...prevVertrag,
      "KNummer": '',
      "KStrasse": '',
      "KPlzOrt": '',
      "KTel": '',
      "KFax": '',
      "KMail": '',  
      "Sonstiges": '',
      "LastMod": '',
      "File": '',
      "Pfad": ''
    }));                                                  
  });

/**************************************************************************************************************************************
 *  Validieren
 */  
  const validateForm = (() => {
 
    if (  Vertrag.VertragsNummer !== '' &&
          Vertrag.KName !== '' &&
          Vertrag.Art !== ''   &&
          Vertrag.VLaufzeit !== 0  &&         // Laufzeit
          Vertrag.KueFrist !== 0 &&          // Monate 
          Vertrag.Vorlauf !== 0 &&           // Tage
          Vertrag.KostenpA != 0 &&
          Vertrag.KNummer !==  '' &&
          Vertrag.KStrasse !== '' &&
          Vertrag.KPlzOrt !== '' &&
          Vertrag.KTel !==  '' &&
          Vertrag.KMail !==  '' ) {
      return true;      
    }  
    return false;
});



return (
    <div className="vertrag-home">
      <FehlerMsg />
      <Row>
        <Col lg={8}>

        <Form className="Form-Total" onSubmit={sendData} >

            <fieldset className="input-vertrag">      
            <legend>Vertrag</legend>
            <Form.Group as={Row} id="my-form-row">
              <Form.Check type="checkbox" label="Aktiv" onChange={toggleAktiv} name="Aktiv" checked={Vertrag.Aktiv} />
            </Form.Group> 
            <Form.Group as={Row} id="my-form-row"> 
              <Form.Label className="label-vdata" column sm={2} htmlFor="inputVertragsnummer">Vertragsnummer:</Form.Label>
              <Col sm={4}>
                <NummerTypeAhead  id="inputVertragsnummer" className="rounded-0" vertrag={Vertrag} vertragf={setVertrag} nummer={VNummer} nummerf={setVNummer} />
              </Col>
              <Form.Label className="label-vdata" column sm={2} htmlFor="inputAktualisiert">Letzter Zugriff:</Form.Label>
              <Col sm={4}>
                <Form.Control type="text"  className="rounded-0" id="inputAktualisiert" name="LastMod" value={Vertrag.LastMod} disabled />
              </Col>
            </Form.Group>
            <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputVertragspartner">Vertrag mit:</Form.Label>
              <Col sm={4}>    
                <KundenTypeAhead  id="inputVertragspartner" className="rounded-0" vertrag={Vertrag} vertragf={setVertrag} kunden={Kunden} kundenf={setKunden} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} id="my-form-row">          
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputVertragsart">Vertragsart:</Form.Label>
              <Col sm={4}>   
                <VertragsartTypeAhead id="inputVertragsart" className="rounded-0" vertrag={Vertrag} vertragf={setVertrag} vart={VArt} vartf={setVArt} />
              </Col>
            </Form.Group>          
            <Form.Group as={Row} id="my-form-row">  
                <Form.Label column sm={2} className="label-vdata" htmlFor="inputStandort">Standort:</Form.Label>
                <Col sm={4}>
                  <Form.Control as="select" className="rounded-0" id="inputStandort" value={Vertrag.Standort} name="Standort" onChange={setVertragStandort} custom>
                    <option>{Standorte[0].name}</option> 
                    <option>{Standorte[1].name}</option>
                    <option>{Standorte[2].name}</option>
                    <option>{Standorte[3].name}</option>
                    <option>{Standorte[4].name}</option>
                    <option>{Standorte[5].name}</option>
                    <option>{Standorte[6].name}</option>
                    <option>{Standorte[7].name}</option>
                    <option>{Standorte[8].name}</option>
                    <option>{Standorte[9].name}</option>
                    <option>{Standorte[10].name}</option>
                    <option>{Standorte[11].name}</option>
                    <option>{Standorte[12].name}</option>
                    <option>{Standorte[13].name}</option>
                    <option>{Standorte[14].name}</option>
                    <option>{Standorte[15].name}</option>
                    <option>{Standorte[16].name}</option>
                    <option>{Standorte[17].name}</option>
                    <option>{Standorte[18].name}</option>
                    <option>{Standorte[19].name}</option>
                  </Form.Control>
                </Col>
            </Form.Group>
          </fieldset>

          <fieldset className="input-laufzeit">
          <legend>Laufzeit</legend> 
          <Form.Group as={Row} id="my-form-row">
            <Form.Label column sm={2} className="label-vdata" htmlFor="inputVStart">Vertragsstart:</Form.Label>
            <Col sm={3}>
              <Form.Control type="date" className="rounded-0" id="inputVStart" name="VStart" value={Vertrag.VStart} onChange={setVertragszeiten} />
            </Col>
            <Form.Label column sm={2} className="label-vdata" htmlFor="inputNextV">Nächste Verlängerung:</Form.Label>
            <Col sm={3}>
              <Form.Control type="date" className="rounded-0" id="inputNextV" name="VNext" value={Vertrag.VNext} disabled />
            </Col>  
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputLaufzeit">Laufzeit [Monate]:</Form.Label>
              <Col sm={3}>
                <Form.Control type="number" className="rounded-0" id="inputLaufzeit" name="VLaufzeit" value={Vertrag.VLaufzeit} onChange={setVertragszeiten} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">    
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKFrist">Kündigungsfrist[Monate]:</Form.Label>
              <Col sm={3}>
                <Form.Control type="number" className="rounded-0" id="inputKFrist" name="KueFrist" value={Vertrag.KueFrist} onChange={setVertragszeiten} />
              </Col>  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKNext">Nächste Kündigung:</Form.Label>
              <Col sm={3}>
                <Form.Control type="date" className="rounded-0" id="inputKNext" name="KueNext" value={Vertrag.KueNext} disabled/>
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">   
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputVorlauf">Vorlauf [Tage]:</Form.Label>
              <Col sm={3}>
                <Form.Control type="number" className="rounded-0" id="inputVorlauf" name="Vorlauf" value={Vertrag.Vorlauf} onChange={setVertragszeiten} />
              </Col>
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKmVorlauf">Kündigung mit Vorlauf:</Form.Label>
              <Col sm={3}>
                <Form.Control type="date" className="rounded-0" id="inputKmVorlauf" name="KueEff" value={Vertrag.KueEff} disabled/>
              </Col>
          </Form.Group>
          </fieldset>


          <fieldset className="input-zahlung"> 
          <legend>Zahlung</legend>
          <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputZahlungMo">Zahlung monatlich:</Form.Label>
              <Col sm={3}>
                <Form.Control className="rounded-0" type="number" min="0.00" step="0.01" id="inputZahlung12" name="ZahlungMon" 
                              value={Vertrag.ZahlungMon > 0 ? Vertrag.ZahlungMon : ""} 
                              onChange={setZahlung} />
              </Col>
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKostenpA">Kosten pro Jahr:</Form.Label>
              <Col sm={3}>
                <Form.Control className="rounded-0" type="text" id="inputKostenpA" name="KostenpA" value={Vertrag.KostenpA} disabled />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputZahlung">Zahlung vierteljährlich:</Form.Label>
              <Col sm={3}>
                <Form.Control className="rounded-0" type="number" min="0.00" step="0.01" id="inputZahlung4" name="ZahlungpviertelA" 
                                value={Vertrag.ZahlungpviertelA > 0 ? Vertrag.ZahlungpviertelA : ""} 
                                onChange={setZahlung} />
              </Col>  
          </Form.Group>  
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputhJZahlung">Zahlung halbjährlich:</Form.Label>
              <Col sm={3}>
                <Form.Control className="rounded-0" type="number" min="0.00" step="0.01" id="inputZahlung2" name="ZahlungphalbA" 
                                value={Vertrag.ZahlungphalbA > 0 ? Vertrag.ZahlungphalbA : ""} 
                                onChange={setZahlung} />
              </Col>  
          </Form.Group>  
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputJZahlung">Zahlung jährlich:</Form.Label>
              <Col sm={3}>
               	<Form.Control className="rounded-0" type="number" min="0.00" step="0.01" pattern="\d+(,\d{2})" placeholer="0.00" id="inputZahlung1" name="ZahlungpA" 
                                value={Vertrag.ZahlungpA > 0 ? Vertrag.ZahlungpA : ""} onChange={setZahlung} />
              </Col>    
          </Form.Group>  
          </fieldset>

          <fieldset className="input-kunde">
          <legend>Vertragspartner</legend>
          <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKundenNr">Kundennummer:</Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenNr" name="KNummer" value={Vertrag.KNummer} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKundenName">Name: </Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenName" name="KName" value={Vertrag.KName} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2}  className="label-vdata" htmlFor="inputKundenStr">Straße:</Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenStr" name="KStrasse" value={Vertrag.KStrasse} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2}  className="label-vdata" htmlFor="inputKundenOrt">PLZ + Ort:</Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenOrt" name="KPlzOrt" value={Vertrag.KPlzOrt} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2}  className="label-vdata" htmlFor="inputKundenTelefon">Telefon:</Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenTelefon" name="KTel" value={Vertrag.KTel} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKundenFax">Fax:</Form.Label>
              <Col>
              <Form.Control type="text" className="rounded-0" id="inputKundenFax" name="KFax" value={Vertrag.KFax} onChange={setVertragStandart} />
              </Col>
          </Form.Group>  
          <Form.Group as={Row} id="my-form-row">  
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputKundenEmail">Mail:</Form.Label>
              <Col>
              <Form.Control type="email" className="rounded-0" id="inputKundenEmail" name="KMail" value={Vertrag.KMail} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          </fieldset>

          <fieldset className="input-sonstiges">
          <legend>Sonstiges</legend>
          <Form.Group as={Row} id="my-form-row">
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputSonstiges">Bemerkung:</Form.Label>
              <Col>
                <Form.Control as="textarea" rows="4" className="rounded-0" id="inputSonstiges" name="Sonstiges" value={Vertrag.Sonstiges} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">    
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputDatei">Datei:</Form.Label>
              <Col>
                <Form.Control type="text" className="rounded-0" id="inputDatei" name="File" value={Vertrag.File} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} id="my-form-row">    
              <Form.Label column sm={2} className="label-vdata" htmlFor="inputDateiPfad">Pfad:</Form.Label>
              <Col>
                <Form.Control type="text" className="rounded-0" id="inputDateiPfad" name="Pfad" value={Vertrag.Pfad} onChange={setVertragStandart} />
              </Col>
          </Form.Group>
          </fieldset>
          <fieldset className="input-buttons">
          <Form.Group as={Row} id="my-form-row">
            <Col lg={2}></Col>
            <Col lg={6}> 
            <Button variant="dark" size="lg" type="submit"  block 
              disabled={
                !(  Vertrag.VertragsNummer !== '' &&
                    Vertrag.KName !== '' &&
                    Vertrag.Art !== ''   &&
                    Vertrag.VLaufzeit !== 0  &&         // Laufzeit
                    Vertrag.KueFrist !== 0 &&          // Monate 
                    Vertrag.Vorlauf !== 0 &&           // Tage
                    Vertrag.KostenpA != 0 &&
                    Vertrag.KNummer !==  '' &&
                    Vertrag.KStrasse !== '' &&
                    Vertrag.KPlzOrt !== '' &&
                    Vertrag.KTel !==  '' &&
                    Vertrag.KMail !==  '' )}>
                    Speichern
            </Button>
            </Col>
          </Form.Group>
          </fieldset>
        </Form>
        </Col>
        <Col>
            <Anstehende />
        </Col>
      </Row>
    </div>
  );
});
//<Button variant="primary" onClick={debugData} >Testen</Button>
//<TestChat user={User.name} />

export default VertragHome;

//<Form.Control type="text" className="mx-sm-3" id="inputTest" name="iTest" value={TestVal} />

//<Col>
//<div className="form-group">
//  <label htmlFor="inputVArt">Vertragsart: </label>
//  <select className="form-control" id="inputVArt" value={Vertrag.Art} name="Art" onChange={setVertragsArt} >
//  <option>{VArten[0].name}</option> 
//  <option>{VArten[1].name}</option>
//  <option>{VArten[2].name}</option>
//  <option>{VArten[3].name}</option>
//  </select>
//</div>
//</Col>

//<header className="App-header">
//<img
//          src="lwerk-logo.png"
//          className="d-inline-block align-top"
          //className ="align-center"
//          width="200"
//          height="60"
//          alt="lwerk"
//      />
//</header>