/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"414C5AC3-84A8-4D1B-9D92-36B914D74ACC",variableType:4}
 */
var lastModifiedValue = -1;
/**
 * Restituisce il codice di verifica della timbratura per la commessa inserita
 *
 * @param {Number} idLavoratore
 * @param {Number} idCommessaGiorn
 * @param {Date} timbraturaInserita
 * @param {Number} senso
 *
 * @properties={typeid:24,uuid:"B4E863A8-24EC-46C1-8A87-B97169D6FADE"}
 */
function validaInserimentoTimbraturaCommesse(idLavoratore, idCommessaGiorn, timbraturaInserita, senso) {

	var _nrBadge = globals.getNrBadge(idLavoratore, new Date(timbraturaInserita.getFullYear(), timbraturaInserita.getMonth(), timbraturaInserita.getDate()));

	// caso campi non compilati
	if (timbraturaInserita == null || senso == null)
		return 1;

	var sqlTimb = "SELECT idcommessagiornalieratimbrature FROM Commesse_Giornaliera_Timbrature \
	               WHERE badge = ? AND idcommessagiornaliera = ? AND timbratura = ?;"
	var arrTimb = [_nrBadge, idCommessaGiorn, timbraturaInserita];
	var dsTimb = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlTimb, arrTimb, -1);
	if (dsTimb.getValue(1, 1))
	// timbratura già presente
		return 2;
	else
	// caso valori timbratura corretti
		return 0;
}

/**
 * @properties={typeid:24,uuid:"197EF225-2F3D-488C-865B-F58B3572767A"}
 */
function selezione_opzioni_commesse() {
	globals.ma_utl_showFormInDialog(forms.comm_inserimento.controller.getName(), 'Opzioni commesse');
}

/**
 * @properties={typeid:24,uuid:"197268EB-A653-47CB-AB61-71F4E78E7AB5"}
 */
function selezione_opzioni_report() {
	globals.ma_utl_showFormInDialog(forms.comm_report_selezione.controller.getName(), 'Opzioni reportistica commesse');
}

/**
 * @properties={typeid:24,uuid:"E6EB19D2-4FC7-410C-9109-52B9B0BA3CA6"}
 */
function selezione_opzioni_riepilogo_report() {
	globals.ma_utl_showFormInDialog(forms.comm_report_riepilogo_selezione.controller.getName(), 'Opzioni reportistica riepilogo commesse');
}

/**
 * @properties={typeid:24,uuid:"266EFFA1-7CF8-4858-949D-8FDFFEAC5809"}
 */
function selezione_gestione_commesse() 
{
	var recSingolaDitta = getSingolaDitta(globals.Tipologia.CLIENTE);
	recSingolaDitta ? forms.comm_gestione_commesse_tbl.elements.fld_esclusivo_ditta.visible = false :
	                  forms.comm_gestione_commesse_tbl.elements.fld_esclusivo_ditta.visible = true;
		
	ApriCommDitta();
}

/**
 * @properties={typeid:24,uuid:"D7387892-0BA4-441D-9F74-97F001F0272C"}
 */
function selezione_ore_commesse() 
{
	var form = forms.comm_selezione;
	var formName = form.controller.getName();

	globals.ma_utl_setStatus(globals.Status.EDIT, formName);

	// Prevent the double click on the menu to open two windows
	if (!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo per la programmazione delle commesse');

	//	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ore_commessa_selezione.controller.getName());
	//	globals.ma_utl_showFormInDialog(forms.comm_ore_commessa_selezione.controller.getName(),'Opzioni selezione');
}

/**
 * @properties={typeid:24,uuid:"0C05FA87-616F-42F2-98B7-43783A3F21AE"}
 */
function selezione_OC() {
	globals.ma_utl_showFormInDialog(forms.comm_report_selezione.controller.getName(), 'Opzioni reportistica commesse');
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"AA1045A4-819D-4A1C-B2E8-AA70958B1737"}
 * @AllowToRunInFind
 */
function ApriCommLavoratore(_rec) {
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if (_rec)
		_filter.filter_value = _rec['idditta'];
	else {
		_filter.filter_value = currDitta;
		_rec = { idditta: currDitta }
	}

	var _programName = '';
	if (globals.getTipologiaDitta(_filter.filter_value)) {
		_programName = 'Commesse_Lavoratore';
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
		if (fs.find()) {
			fs['idditta'] = _rec['idditta'];
			if (fs.search() == 0) {
				globals.ma_utl_showWarningDialog('Nessun lavoratore inserito per la ditta selezionata', 'Inserimento ore commesse');
				return;
			}
		}
	} else
		_programName = 'Commesse_Lavoratore';

	var _progObj = globals.nav.program[_programName];
	_progObj.filter = [_filter];
	_progObj.foundset = null;

	globals.openProgram(_programName, true);

}

/**
 * @properties={typeid:24,uuid:"E4959448-6996-4108-BCF2-C23578767979"}
 * @AllowToRunInFind
 */
function ApriCommDitta() {
	var _programName = 'Commesse_Anagrafiche';

	var _filter = new Object();
	_filter.filter_name = 'ftr_tipologia_ditta';
	_filter.filter_field_name = 'tipologia';
	_filter.filter_operator = '=';
	_filter.filter_value = 4;

	var _progObj = globals.nav.program[_programName];
	_progObj.filter = [_filter];
	_progObj.foundset = null;

	globals.openProgram(_programName,null, true);
}

/**
 * Recupera i dati relativi alle ore delle commesse precedentemente inserite e
 * visualizza la situazione di inserimento
 *
 * @param {JSEvent} event
 * @param {Number} idLavoratore
 * @param {Array<Number>} vArrCommesseFasi
 * @param {Date} vDal
 * @param {Date} vAl
 * @param {Array<Date>} vArrFestivita
 * @param {Boolean} [forzaRidisegno]
 * @param {Boolean} [inserimentoRapido]
 * @param {Number} [dxEvComm]
 * 
 * @properties={typeid:24,uuid:"D42EB561-CAFF-4477-B798-7F92886B2CEC"}
 * @SuppressWarnings(unused)
 */
function preparaInserimentoOreCommesseLavoratore(event, idLavoratore, vArrCommesseFasi, vDal, vAl,
	                                             vArrFestivita, forzaRidisegno, inserimentoRapido, dxEvComm) 
{
	// creazione dataset per gestione commesse nel periodo
	var numGiorni = globals.dateDiff(vDal,vAl,1000 * 60 * 60 * 24);
	var numCommesseFasi = vArrCommesseFasi.length;

	// costruzione colonne necessarie e tipi di dato da associare
	var numColStd = 16;
	var colNames = ['idcliente','codcliente','desccliente',
	                'idcommessa','codcommessa','desccommessa','iniziovaliditacommessa','finevaliditacommessa','terminatacommessa',
				    'idcommessafase','codcommessafase','desccommessafase','iniziovaliditacommessafase','finevaliditacommessafase','chiusafasecommessa',
					'giorniconsolidati'];
	var types = [JSColumn.NUMBER, JSColumn.TEXT, JSColumn.TEXT,
	             JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.NUMBER,
				 JSColumn.TEXT];

	// ciclo per determinare il numero di colonne per il mese selezionato
	for (var g = 1; g <= numGiorni; g++) {
		colNames.push('commessa_' + g);
		types.push(JSColumn.NUMBER);
	}
	colNames.push('totaleorecommessa');
	types.push(JSColumn.NUMBER);
    colNames.push('descrizionecommessa');
    types.push(JSColumn.TEXT);
    colNames.push('descrizionecommessafase');
    types.push(JSColumn.TEXT);
    
	var dsOreCommesse = databaseManager.createEmptyDataSet(numCommesseFasi, colNames);
	var currGiorno;

	// compilazione campi dataset per le righe delle commesse
	for (var comm = 1; comm <= numCommesseFasi; comm++) {
		// dati cliente
		var idCliente =  globals.getDittaDaIdFase(vArrCommesseFasi[comm - 1]);
		dsOreCommesse.setValue(comm, 1, idCliente); // identificativo cliente
		dsOreCommesse.setValue(comm, 2, globals.getCodDitta(idCliente)); // codice cliente
		dsOreCommesse.setValue(comm, 3, globals.getRagioneSociale(idCliente)); // ragione sociale cliente
		
		// dati commessa
		var idCommessa = globals.getIdCommessaDaIdFase(vArrCommesseFasi[comm - 1]);
		dsOreCommesse.setValue(comm, 4, idCommessa);
		dsOreCommesse.setValue(comm, 5, getCodiceCommessaDitta(idCommessa));
		dsOreCommesse.setValue(comm, 6, getDescrizioneCommessa(idCommessa));
		dsOreCommesse.setValue(comm, 7, getDataInizialeCommessa(idCommessa));
		dsOreCommesse.setValue(comm, 8, getDataFinaleCommessa(idCommessa));
		dsOreCommesse.setValue(comm, 9, getChiusuraCommessa(idCommessa));
		
		// dati fase commessa
		var idCommessaFase = vArrCommesseFasi[comm - 1];
		dsOreCommesse.setValue(comm, 10, idCommessaFase);
		dsOreCommesse.setValue(comm, 11, getCodiceFaseCommessaDitta(idCommessaFase)); // codice fase commessa
		dsOreCommesse.setValue(comm, 12, getDescrizioneFase(idCommessaFase));
		dsOreCommesse.setValue(comm, 13, getDataInizialeFaseCommessa(idCommessaFase));
		dsOreCommesse.setValue(comm, 14, getDataFinaleFaseCommessa(idCommessaFase));
		dsOreCommesse.setValue(comm, 15, getChiusuraFaseCommessa(idCommessaFase));
		
		// dati indici giorni consolidati
		dsOreCommesse.setValue(comm, 16, '');
		
		var totOreCommessa = 0;

		for (g = 1; g <= numGiorni; g++) 
		{
			currGiorno = new Date(vDal.getFullYear(), vDal.getMonth(), vDal.getDate() + g - 1);

			var oreGiornoDipCommessa = (globals.getOreGiornoDipendenteFaseCommessa(vArrCommesseFasi[comm - 1], idLavoratore, currGiorno));
			if (oreGiornoDipCommessa) {
				dsOreCommesse.setValue(comm, g + numColStd, oreGiornoDipCommessa);
				totOreCommessa += oreGiornoDipCommessa;
			}
			
			if(isStatoOreFaseCommessaConsolidato(idLavoratore,currGiorno,vArrCommesseFasi[comm - 1]))
				if(dsOreCommesse.getValue(comm,16) == '')
					dsOreCommesse.setValue(comm,16,dsOreCommesse.getValue(comm,16) + g);
				else
					dsOreCommesse.setValue(comm,16,dsOreCommesse.getValue(comm,16) + ',' + g);
		}

		dsOreCommesse.setValue(comm, g + numColStd, totOreCommessa); // totale ore commessa nel periodo
		dsOreCommesse.setValue(comm, g + numColStd + 1,globals.getDescrizioneCommessa(globals.getIdCommessaDaIdFase(vArrCommesseFasi[comm - 1])));
		dsOreCommesse.setValue(comm, g + numColStd + 2,globals.getDescrizioneFase(vArrCommesseFasi[comm - 1]));
	}

	// creazione data source
	var dSOreCommesse = dsOreCommesse.createDataSource('dsOreCommesse_' + (inserimentoRapido ? 'rapido' : '')+ numGiorni + '_' + numCommesseFasi + '_' + globals.dateFormat(vDal,globals.ISO_DATEFORMAT), types);

	// disegno della tabella per inserimento ore commesse periodo
	disegnaInserimentoOreCommesseLavoratore(event, //dSOreCommesse,
	                                        dsOreCommesse,
											numGiorni, 
											vArrCommesseFasi, 
											vDal, 
											vArrFestivita, 
											forzaRidisegno || inserimentoRapido, 
											inserimentoRapido,
											dxEvComm);
}

/**
 * Recupera i dati relativi alle ore delle commesse precedentemente inserite e
 * visualizza la situazione di inserimento
 *
 * @param {JSEvent} event
 * @param {Number} idLavoratore
 * @param {Array<Number>} vArrCommesse
 * @param {Date} vDal
 * @param {Date} vAl
 * @param {Array<Date>} vArrFestivita
 * @param {Boolean} [forzaRidisegno]
 * @param {Number} [dxEvComm]
 *
 * @properties={typeid:24,uuid:"22D0CA4C-6B02-4DB7-B460-7555A748F60D"}
 */
function preparaInserimentoOreCommesseLavoratoreRiepilogo(event, idLavoratore, vArrCommesse, vDal, vAl,
	                                                      vArrFestivita, forzaRidisegno, dxEvComm)
{
	// creazione dataset per gestione situazione ore lavorate/ore inserite nel periodo
	var numGiorni = globals.dateDiff(vDal,vAl,1000 * 60 * 60 * 24);

	// costruzione colonne necessarie e tipi di dato da associare
	var numColStd = 2;
	var colNames = ['idcommessa', 'desc_commessa']; // colonne standard, idcommessa e codice commessa
	var types = [JSColumn.NUMBER, JSColumn.TEXT];

	// ciclo per determinare il numero di colonne per il mese selezioanto
	for (var g = 1; g <= numGiorni; g++) {
		colNames.push('commessa_' + g);
		types.push(JSColumn.NUMBER);
	}
	colNames.push('totale_ore');
	types.push(JSColumn.NUMBER);

	// costruzione righe encessarie al riepilogo
	var numRowStd = 6; // teorico,inserito,ferie/permessi,certificazioni,festività,delta
	var dsOreRiep = databaseManager.createEmptyDataSet(numRowStd, colNames);
	var currGiorno;

	// preparazione compilazione campo con ore teoriche della giornata
	dsOreRiep.setValue(1, 1, 1);
	dsOreRiep.setValue(1, 2, 'TEORICO');

	// compilazione campi con calcolo riepilogo delle ore delle varie commesse
	var numCommesse = vArrCommesse.length;
		
	// preparazione compilazione campo inserito
	dsOreRiep.setValue(2, 1, 2);
	dsOreRiep.setValue(2, 2, 'INSERITO');

	// preparazione compilazione campi con ferie/permessi/ore studio/assemblea...
	dsOreRiep.setValue(3, 1, 3);
	dsOreRiep.setValue(3, 2, 'ASSENZE VARIE');

	// preparazione compilazione campi con assenze relative a certificazioni (malattie,infortuni,maternità,congedi)
	dsOreRiep.setValue(4, 1, 4);
	dsOreRiep.setValue(4, 2, 'CERTIFICAZIONI');

	// preparazione compilazione campi festività
	dsOreRiep.setValue(5, 1, 5);
	dsOreRiep.setValue(5, 2, 'FESTIVITA\'');
	
	// preparazione compilazione campi con delta orario
	dsOreRiep.setValue(6, 1, 6);
	dsOreRiep.setValue(6, 2, 'DELTA');

	var totTeorico = 0;
	var totInserito = 0;
	var totAssenze = 0;
	var totCertificazioni = 0;
	var totFestivita = 0;
	var totDelta = 0; 
	
	for (g = 1; g <= numGiorni; g++) 
	{
		currGiorno = new Date(vDal.getFullYear(), vDal.getMonth(), vDal.getDate() + g - 1);

		// compilazione campo teorico
		var oreTeoGiorno = globals.ottieniOreTeoricheGiorno(idLavoratore, currGiorno) / 100;
		if (oreTeoGiorno)
			dsOreRiep.setValue(1, g + numColStd, oreTeoGiorno);
		else
			dsOreRiep.setValue(1, g + numColStd, null);

		// aggiornamento totale teorico
		totTeorico += dsOreRiep.getValue(1,g + numColStd);
		
		// compilazione campo ore inserite su commesse
		var frm = forms[forms.comm_ore_inserimento_tab.elements.tab_inserimento.getTabFormNameAt(1)];
		if(frm != null)
		{
			var totComm = null;
			for (var comm = 1; comm <= numCommesse; comm++) 
			{
				var rec = frm.foundset.getRecord(comm);
				if (rec['commessa_' + g] != null)
					totComm += rec['commessa_' + g];
			}
		}
		
		// calcolare il totale della colonna/commessa per il periodo selezionato
		dsOreRiep.setValue(2, g + numColStd, totComm);
		// aggiornamento totale inserito
		totInserito += dsOreRiep.getValue(2,g + numColStd);
		
		// compilazione campi con assenze dovute a ferie,permessi,legge 104,etc. già confermate(presenti in giornaliera o in budget)
		var oreAssenza = 0;
		if(globals.isGiornoConteggiato(idLavoratore,currGiorno))
			oreAssenza = globals.ottieniOreAssenzaConfermateGiorno(idLavoratore,currGiorno,globals.TipoGiornaliera.NORMALE);
		else
			oreAssenza = globals.ottieniOreAssenzaConfermateGiorno(idLavoratore,currGiorno,globals.TipoGiornaliera.BUDGET); 
		dsOreRiep.setValue(3, g + numColStd, oreAssenza);
		// aggiornamento totale assenze
		totAssenze += dsOreRiep.getValue(3,g + numColStd);
		
		//compilazione campi con assenze relative a certificazioni
		var oreCertificazioni = globals.ottieniOreAssenzaCertificazioniGiorno(idLavoratore,currGiorno);
		dsOreRiep.setValue(4, g + numColStd, oreCertificazioni);
		// aggiornamento totale certificati
		totCertificazioni += dsOreRiep.getValue(4,g + numColStd);

		//compilazione campi con ore di festività
		if(vArrFestivita.indexOf(currGiorno) != -1)
		   dsOreRiep.setValue(5, g + numColStd, oreTeoGiorno);
		// aggiornamento totale certificati
		totFestivita += dsOreRiep.getValue(5,g + numColStd);
		
		//compilazione campi delta orario
		dsOreRiep.setValue(6, g + numColStd, dsOreRiep.getValue(2, g + numColStd) +
			                                 dsOreRiep.getValue(3, g + numColStd) +
											 dsOreRiep.getValue(4, g + numColStd) + 
											 dsOreRiep.getValue(5, g + numColStd) - dsOreRiep.getValue(1, g + numColStd)) ;
		// aggiornamento totale delta
		totDelta += dsOreRiep.getValue(6,g + numColStd);
	}
	
	// compilazione totale tipologie commesse
	dsOreRiep.setValue(1,g + numColStd,totTeorico);
	dsOreRiep.setValue(2,g + numColStd,totInserito);
	dsOreRiep.setValue(3,g + numColStd,totAssenze);
	dsOreRiep.setValue(4,g + numColStd,totCertificazioni);
	dsOreRiep.setValue(5,g + numColStd,totFestivita);
	dsOreRiep.setValue(6,g + numColStd,totDelta);
	
	// creazione data source
	var dSOreRiep = dsOreRiep.createDataSource('dsOreRiep_' + numGiorni + '_' + globals.dateFormat(vDal,globals.ISO_DATEFORMAT) + '_' + globals.dateFormat(vAl,globals.ISO_DATEFORMAT), types);

	// disegno della tabella per inserimento ore commesse periodo
	disegnaInserimentoOreCommesseLavoratoreRiepilogo(event, dSOreRiep, numGiorni, vArrCommesse, 
		                                             vDal, vArrFestivita, forzaRidisegno, dxEvComm);
}

/**
 * Disegna la tabella per l'inserimento delle ore delle commesse per il lavoratore
 *
 * @param {JSEvent} event
 * @param {JSDataSet} dsOc
 * @param {Number} numGiorni
 * @param {Array<Number>} arrCommesse
 * @param {Date} dal
 * @param {Array<Date>} arrFestivita
 * @param {Boolean} [forzaRidisegno]
 * @param {Boolean} [inserimentoRapido]
 * @param {Number} [dxEvComm]
 *  
 * @properties={typeid:24,uuid:"FADF75D8-B203-4968-A8DC-DD166200D8BC"}
 */
function disegnaInserimentoOreCommesseLavoratore(event, dsOc, numGiorni, arrCommesse, dal, 
	                                             arrFestivita, forzaRidisegno, inserimentoRapido, dxEvComm)
{
	var currFasiNo = -1;
	var currGiorniNo = -1;
	
	// numero commesse selezionate
	var numCommesse = arrCommesse.length;

	// definizione del nome della form
	var ocFormName = 'comm_ore_lavoratore_commesse_tbl';
	
	// selezione della form avente il tab panel relativo alla fase di inserimento
	var frmTab;
	switch(event.getFormName())
	{
		case forms.comm_ore_commessa_selezione.controller.getName():
			frmTab = forms.comm_ore_commessa_tab;
			break;
		default:
			if(inserimentoRapido)
			{
				frmTab = forms.comm_ore_inserimento_rapido;
				ocFormName += '_rapido';
			}
			else
				frmTab = forms.comm_ore_inserimento_tab;   
		    break;
	}
	
	/**
     * se è già presente la form recuperiamo il numero di righe (fasi selezionate) e colonne (giorni)
     */
	if(forms[ocFormName])
	{
		currGiorniNo = forms[ocFormName].foundset.alldataproviders.length - 20;
	    currFasiNo = forms[ocFormName].foundset.getSize();
	}
	
	// rimozione della eventuale form già presente dalla soluzione
	if (forzaRidisegno || !forms[ocFormName] || currFasiNo != numCommesse || numGiorni != currGiorniNo) 
	{
		// rimozione tab panel
		frmTab.elements.tab_inserimento.removeAllTabs();	

		history.removeForm(ocFormName);
		solutionModel.removeForm(ocFormName);

		if(arrCommesse.length == 0) 
		{
			frmTab.elements.tab_inserimento.transparent = true;
			return;
		} else
			frmTab.elements.tab_inserimento.transparent = false;

		// costruzione della nuova form da zero
		var dxDesc = 50;
		var dxComm = dxEvComm ? dxEvComm : 35;
		var dxTot = 50;
		var dy = 20;

		var ocForm = solutionModel.newForm(ocFormName, dsOc.createDataSource(application.getUUID().toString()), 'leaf_style_table', false, dxDesc + dxComm * (numGiorni + 1) + dxTot, dy * (numCommesse + 1));
		ocForm.navigator = SM_DEFAULTS.NONE;
		ocForm.view = JSForm.RECORD_VIEW;//JSForm.LOCKED_TABLE_VIEW;
        
		var lblDescCommessa = ocForm.newLabel('Com.', 0, 0, dxDesc, dy);
		lblDescCommessa.name = 'lbl_desc_giorno';
		lblDescCommessa.styleClass = 'table_header';
		lblDescCommessa.transparent = false;
		lblDescCommessa.horizontalAlignment = SM_ALIGNMENT.CENTER;

		var lblDescCommessaFase = ocForm.newLabel('Fase', dxDesc, 0, dxDesc, dy);
		lblDescCommessaFase.name = 'lbl_desc_giorno';
		lblDescCommessaFase.styleClass = 'table_header';
		lblDescCommessaFase.transparent = false;
		lblDescCommessaFase.horizontalAlignment = SM_ALIGNMENT.CENTER;
		for (var _g = 1; _g <= numGiorni; _g++) 
		{
			var lblDay = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate() + _g - 1);
				
			var lblComm = ocForm.newLabel(globals.getSiglaGiorno(lblDay) + ' ' + lblDay.getDate(), dxDesc * 2 + dxComm * (_g - 1), 0, dxComm, dy);
			lblComm.name = 'lbl_comm_' + _g;
			lblComm.styleClass = 'table_header';
			lblComm.transparent = false;
			lblComm.toolTipText = '';
			lblComm.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
			if(!inserimentoRapido)
			{
				var lblTotale = ocForm.newLabel('Totale', dxDesc * 2 + dxComm * _g, 0, dxTot, dy);
				lblTotale.name = 'lbl_totale';
				lblTotale.styleClass = 'table_header';
				lblTotale.transparent = false;
				lblTotale.toolTipText = '';
				lblTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
		    }
		}
		
		for (var c = 1; c <= arrCommesse.length; c++) 
		{
			var varDescCommessa = ocForm.newVariable('codcommessa_' + c,JSVariable.TEXT,"'" + dsOc.getValue(c,5) + "'");
			var fldDescCommessa = ocForm.newTextField(varDescCommessa.name, 0, dy * c, dxDesc, dy);
			fldDescCommessa.styleClass = 'table_tot';
			fldDescCommessa.editable = false;
			fldDescCommessa.enabled = true;
			fldDescCommessa.transparent = false;
			fldDescCommessa.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldDescCommessa.toolTipText = 'Cliente : ' + dsOc.getValue(c,2) + ' - ' + dsOc.getValue(c,3) + '\n' +
			                              'Commessa : ' + dsOc.getValue(c,5) + ' - ' + dsOc.getValue(c,6);
			fldDescCommessa.tabSeq = SM_DEFAULTS.IGNORE;

			var varDescCommessaFase = ocForm.newVariable('codcommessafase_' + c,JSVariable.TEXT,"'" + dsOc.getValue(c,11) + "'");
			var fldDescCommessaFase = ocForm.newTextField(varDescCommessaFase.name, dxDesc, dy * c, dxDesc, dy);
			fldDescCommessaFase.styleClass = 'table_tot'//'table_desc';
			fldDescCommessaFase.editable = false;
			fldDescCommessaFase.enabled = true;
			fldDescCommessaFase.transparent = false;
			fldDescCommessaFase.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldDescCommessaFase.toolTipText = 'Cliente : ' + dsOc.getValue(c,2) + ' - ' + dsOc.getValue(c,3) + '\n' +
                                              'Commessa : ' + dsOc.getValue(c,5) + ' - ' + dsOc.getValue(c,6) + '\n' + 
											  'Fase : ' + dsOc.getValue(c,11) + ' - ' + dsOc.getValue(c,12);
			fldDescCommessaFase.tabSeq = SM_DEFAULTS.IGNORE;

			for (var g = 1; g <= numGiorni; g++) 
			{
				var currDay = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate() + g - 1);
				var varComm = ocForm.newVariable('commessa_' + c + '_' + g,JSVariable.TEXT,"'" + dsOc.getValue(c,16 + g) + "'");
				var fldComm = ocForm.newTextField(varComm.name, dxDesc * 2 + dxComm * (g - 1), dy  * c, dxComm, dy);
				fldComm.name = varComm.name;
				switch (currDay.getDay()) {
				case 0:
					fldComm.styleClass = 'table_sun';
					break;
				case 6:
					fldComm.styleClass = 'table_sat';
					break;
				default:
					fldComm.styleClass = 'table';
					break;
				}
				if (arrFestivita.length != 0 && arrFestivita.indexOf(currDay) != -1)
					fldComm.styleClass = 'table_fest';

				fldComm.editable = true;
				fldComm.enabled = true;
				fldComm.transparent = false;
				fldComm.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldComm.tabSeq = (c - 1) * numGiorni + g;

				// caso inserimento con controlli in tempo reale
				if (!(inserimentoRapido == true)) {
					fldComm.onDataChange = solutionModel.getGlobalMethod('globals', 'onDataChangeOreCommessa');
					fldComm.onFocusGained = solutionModel.getGlobalMethod('globals', 'onFocusGainedOreCommessa');
					fldComm.onFocusLost = solutionModel.getGlobalMethod('globals', 'onFocusLostOreCommessa');
					fldComm.onRightClick = solutionModel.getGlobalMethod('globals', 'onRightClickOreCommessa');
				} else {
					fldComm.onDataChange = solutionModel.getGlobalMethod('globals', 'onDataChangeOreCommessaRapido');
					fldComm.onFocusGained = solutionModel.getGlobalMethod('globals', 'onFocusGainedOreCommessaRapido');
					fldComm.onFocusLost = solutionModel.getGlobalMethod('globals', 'onFocusLostOreCommessaRapido');
				}

				// RENDERING ORE COMMESSA GESTORE
				if (globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) && (!inserimentoRapido == true))
					fldComm.onRender = solutionModel.getGlobalMethod('globals', 'onRenderOreCommessaGestore');
				else if (!inserimentoRapido == true)
					fldComm.onRender = solutionModel.getGlobalMethod('globals', 'onRenderOreCommessa');
			}

			if (!inserimentoRapido) 
			{
				var varTotale = ocForm.newVariable('totaleorecommessa_' + c,JSVariable.NUMBER,"'" + dsOc.getValue(c,16 + g) + "'");
				var fldTotale = ocForm.newTextField(varTotale.name, dxDesc * 2 + dxComm * (g - 1), dy * c, dxTot, dy);
				fldTotale.name = 'fld_totale_ore_commessa_' + c;
				fldTotale.styleClass = 'table_tot';
				fldTotale.editable = false;
				fldTotale.enabled = true;
				fldTotale.transparent = false;
				fldTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldTotale.tabSeq = SM_DEFAULTS.IGNORE;

			}
		}
	}
	
 	frmTab.elements.tab_inserimento.addTab(ocFormName, ocFormName + '_' + application.getUUID());
}

/**
 * Disegna la tabella per l'inserimento delle ore delle commesse per il lavoratore
 *
 * @param {JSEvent} event
 * @param {String} dSOc
 * @param {Number} numGiorni
 * @param {Array<Number>} arrCommesse
 * @param {Date} dal
 * @param {Array<Date>} arrFestivita
 * @param {Boolean} [forzaRidisegno]
 * @param {Number} [dxEvComm]
 * 
 * @properties={typeid:24,uuid:"FFAC90CF-2A04-42F4-82CB-C566678C8806"}
 */
function disegnaInserimentoOreCommesseLavoratoreRiepilogo(event, dSOc, numGiorni, arrCommesse,
	                                                      dal, arrFestivita, forzaRidisegno, dxEvComm)
{
	var currGiorniNo = -1;
	
	// numero commesse selezionate
	var numCommesse = arrCommesse.length;

	// form avente il tab relativo al riepilogo 
	var frmTab = forms.comm_ore_inserimento_tab;
	
	// definizione del nome della form
	var ocFormName = 'comm_ore_lavoratore_commesse_riep_tbl';
	
	/**
     * se è già presente la form recuperiamo il numero di righe (fasi selezionate) e colonne (giorni)
     */
	if(forms[ocFormName])
		currGiorniNo = forms[ocFormName].foundset.alldataproviders.length - 4;
	
	// rimozione della eventuale form già presente dalla soluzione
	if (forzaRidisegno || !forms[ocFormName] || numGiorni != currGiorniNo || numCommesse == 0) 
	{
		frmTab.elements.tab_riepilogo.removeAllTabs();
		
		history.removeForm(ocFormName);
		solutionModel.removeForm(ocFormName);

		// costruzione della nuova form da zero
		var dxDesc = 100;
		var dxComm = dxEvComm ? dxEvComm : 35;
		var dxTot = 50;
		var dy = 20;

		var ocForm = solutionModel.newForm(ocFormName, dSOc, 'leaf_style_table', false, dxDesc + dxComm * (numGiorni + 1) + dxTot, dy * 6);
		ocForm.dataSource = dSOc;
		ocForm.width = dxDesc + dxComm * (numGiorni + 1) + dxTot
		ocForm.navigator = SM_DEFAULTS.NONE;
		ocForm.view = JSForm.LOCKED_TABLE_VIEW;

		var fldDescCommessa = ocForm.newTextField('desc_commessa', 0, dy, dxDesc, dy);
		fldDescCommessa.name = 'fld_desc_commessa';
		fldDescCommessa.styleClass = 'table_desc';
		fldDescCommessa.editable = false;
		fldDescCommessa.enabled = true;
		fldDescCommessa.transparent = false;
		fldDescCommessa.horizontalAlignment = SM_ALIGNMENT.LEFT;

		var lblDescCommessa = ocForm.newLabel('Riepilogo', 0, 0, dxDesc, dy);
		lblDescCommessa.name = 'lbl_desc_giorno';
		lblDescCommessa.styleClass = 'table_header';
		lblDescCommessa.labelFor = fldDescCommessa.name;
		lblDescCommessa.transparent = false;
		lblDescCommessa.horizontalAlignment = SM_ALIGNMENT.CENTER;

		for (var g = 1; g <= numGiorni; g++) {
			var currDay = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate() + g - 1);
			var fldComm = ocForm.newTextField('commessa_' + g, dxDesc + dxComm * (g - 1), dy, dxComm, dy);
			fldComm.name = 'fld_comm_' + g;
			switch (currDay.getDay()) {
			case 0:
				fldComm.styleClass = 'table_sun';
				break;
			case 6:
				fldComm.styleClass = 'table_sat';
				break;
			default:
				fldComm.styleClass = 'table';
				break;
			}
			if(arrFestivita.length != 0 
					&& arrFestivita.indexOf(currDay) != -1)
				fldComm.styleClass = 'table_fest';

			fldComm.editable = false;
			fldComm.enabled = true;
			fldComm.transparent = false;
			fldComm.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldComm.onRender = solutionModel.getGlobalMethod('globals', 'onRenderOreCommessaRiep');

			var lblComm = ocForm.newLabel(globals.getSiglaGiorno(currDay) + ' ' + currDay.getDate(), dxDesc + dxComm * (g - 1), 0, dxComm, dy);
			lblComm.name = 'lbl_comm_' + g;
			lblComm.styleClass = 'table_header';
			lblComm.labelFor = fldComm.name;
			lblComm.transparent = false;
			lblComm.toolTipText = '';
			lblComm.horizontalAlignment = SM_ALIGNMENT.CENTER;
		}

		var fldTotale = ocForm.newTextField('totale_ore', dxDesc + dxComm * g, dy, dxTot, dy);
		fldTotale.name = 'fld_totale_ore';
		fldTotale.styleClass = 'table_tot';
		fldTotale.editable = false;
		fldTotale.enabled = true;
		fldTotale.transparent = false;
		fldTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;

		var lblTotale = ocForm.newLabel('Totale', dxDesc + dxComm * g, 0, dxTot, dy);
		lblTotale.name = 'lbl_totale_ore';
		lblTotale.styleClass = 'table_header';
		lblTotale.labelFor = fldTotale.name;
		lblTotale.transparent = false;
		lblTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
	}
	
	frmTab.elements.tab_riepilogo.addTab(ocFormName,ocFormName + '_' + application.getUUID());
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DD5C678A-8109-4B79-9AA5-0FE79C6D21D4"}
 */
function onFocusGainedOreCommessa(event)
{
	forms.comm_ore_inserimento_tab.setStatusNeutral('');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"20F77EAF-ED82-43FB-B362-44D8C19363E4"}
 */
function onFocusLostOreCommessa(event)
{
	forms.comm_ore_inserimento_tab.setStatusNeutral('');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"693D2CEC-DCB8-447F-9655-CB10B4328B30"}
 */
function onFocusGainedOreCommessaRapido(event)
{
	forms.comm_ore_inserimento_rapido.setStatusNeutral('');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"631904EE-D145-46D1-8470-288105825D00"}
 */
function onFocusLostOreCommessaRapido(event)
{
	forms.comm_ore_inserimento_rapido.setStatusNeutral('');
}

/**
 * @param oldValue
 * @param newValue
 * @param event
 *
 * @properties={typeid:24,uuid:"DBAE5EC7-ABA0-47A7-91E4-A84D16B924CE"}
 */
function onDataChangeOreCommessa(oldValue, newValue, event) 
{
	var params = {
        processFunction: process_ondatachange_ore_commesse,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event,oldValue,newValue]
    };
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 * @param {String} oldValue
 * @param {string} newValue
 *
 * @properties={typeid:24,uuid:"9428C1CE-C3AF-4CC7-8B7A-AA93E95F5991"}
 */
function process_ondatachange_ore_commesse(event,oldValue,newValue)
{
    forms.comm_ore_inserimento_tab.setStatusWarning('Elaborazione in corso...');
	
	// variabile stringa per il messaggio di errore/warning a seguito di inserimenti delle ore
	var msg = '';
	
	if(oldValue != newValue)
	{
		var elemName = event.getElementName();
		var pos_1 = utils.stringPosition(elemName,'_',0,1);
		var pos_2 = utils.stringPosition(elemName,'_',0,2);
		var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
		var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
		var frmSel = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
		var giorno = new Date(frmSel.vDal.getFullYear(),frmSel.vDal.getMonth(),frmSel.vDal.getDate() + gIndex - 1);
		var giornoIso = utils.dateFormat(new Date(frmSel.vDal.getFullYear(),frmSel.vDal.getMonth(),frmSel.vDal.getDate() + gIndex - 1),globals.ISO_DATEFORMAT);
		
		var frm = forms[forms.comm_ore_inserimento_tab.elements.tab_inserimento.getTabFormNameAt(1)];//forms['comm_ore_lavoratore_commesse_tbl'];
		var fs = frm.foundset;
		var currRec = fs.getRecord(rIndex);
		fs['commessa_' + gIndex] = newValue;
		var recDittaCommessaFase = globals.getDittaCommessaFase(currRec['idcommessafase']);
		var totOreLavSuCommesse = getTotOreCommesseGiornoDipendente(giorno,forms.comm_lav_header_dtl.idlavoratore);
		newValue = (parseFloat(newValue) > 0 ? parseFloat(newValue) : 0);
		oldValue = (parseFloat(oldValue) > 0 ? parseFloat(oldValue) : 0);
		
		if((newValue + totOreLavSuCommesse - oldValue) > 13)
		{
		   msg = 'Il massimo numero di ore lavorate inseribili è stato superato';
		   forms.comm_ore_inserimento_tab.setStatusError(msg);
		   databaseManager.rollbackTransaction();	
		   return false;

		}
				
		// controllo su validità inserimento nel giorno per la commessa
		var dataInizialeComm = globals.getDataInizialeCommessa(recDittaCommessaFase.iddittacommessa);
		var dataFinaleComm = globals.getDataFinaleCommessa(recDittaCommessaFase.iddittacommessa);
	    
		if(newValue)
		{
			// verifica se commessa terminata manualmente
			var isCommessaTerminata = getChiusuraCommessa(recDittaCommessaFase.iddittacommessa);
			if(isCommessaTerminata)
			{
				plugins.busy.unblock();
				msg = 'La commessa risulta terminata';
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
			    return false;
			}
			
			if (dataInizialeComm && giorno < dataInizialeComm) 
			{
				plugins.busy.unblock();
				msg = 'La commessa non risulta ancora programmabile per il giorno selezionato';
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
				return false;
			}
			
			if(dataFinaleComm && giorno > dataFinaleComm)
			{
				plugins.busy.unblock();
				msg = 'La commessa non risulta più programmabile per il giorno selezionato'
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
				return false;
			}
			
			// controllo su validità inserimento nel giorno per la fase
			var dataInizialeFaseComm = globals.getDataInizialeFaseCommessa(recDittaCommessaFase.iddittacommessafase);
			var dataFinaleFaseComm = globals.getDataFinaleFaseCommessa(recDittaCommessaFase.iddittacommessafase);
			
			// verifica se fase della commessa terminata manualmente
			var isFaseCommessaTerminata = getChiusuraFaseCommessa(recDittaCommessaFase.iddittacommessafase);
			if(isFaseCommessaTerminata)
			{
				plugins.busy.unblock();
				msg = 'La fase della commessa risulta terminata';
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
			    return false;
			}
			
			// verifica se la fase ha una fase precedente bloccante non ancora terminata
			if(recDittaCommessaFase.iddittacommessafaseprecedente)
			{
				if(getChiusuraFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) != 1
				   && getBloccanteFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) == 1)
				{
					plugins.busy.unblock();
					msg = 'La fase della commessa segue una fase precedente che è bloccante e risulta non ancora terminata';
					forms.comm_ore_inserimento_tab.setStatusError(msg)
					databaseManager.rollbackTransaction();	
					return false;
				}
			}
				
			if (dataInizialeFaseComm && giorno < dataInizialeFaseComm)
			{
				plugins.busy.unblock();
				msg = 'La fase della commessa non risulta ancora programmabile per il giorno selezionato';
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
				return false;
			}
			if(dataFinaleFaseComm && giorno > dataFinaleFaseComm)
			{
				plugins.busy.unblock();
				msg = 'La fase della commessa non risulta più programmabile per il giorno selezionato';
				forms.comm_ore_inserimento_tab.setStatusError(msg);
				databaseManager.rollbackTransaction();	
				return false;
			}
		}	
		
		if(!globals.inserisciOreCommessa(forms.comm_lav_header_dtl.idlavoratore
								         ,giornoIso
								         ,recDittaCommessaFase.iddittacommessafase
								         ,parseFloat(newValue)
								         ,globals.ProprietaEventoBase.DIURNO)
		   )
		{
     	   plugins.busy.unblock();	
	       forms.comm_ore_inserimento_tab.setStatusError('Errore durante il salvataggio delle ore lavorate su commessa');
		   return false;
		}  				
		
		// controllo superamento monte ore fase e commessa
		var msgMonteOre = '';
		if(recDittaCommessaFase.monteorefase != null)
		{
			var totOreLavorateFase = globals.getTotaleOreLavorateSuFaseCommessa(recDittaCommessaFase.iddittacommessafase);
			if(totOreLavorateFase == recDittaCommessaFase.monteorefase)
				msgMonteOre += 'Il monte ore per la fase ' + recDittaCommessaFase.descrizionefase + ' è stato raggiunto!\n';
			else if(totOreLavorateFase == recDittaCommessaFase.monteorefase)
				msgMonteOre += 'Il monte ore per la fase ' + recDittaCommessaFase.descrizionefase + ' è stato superato!\n';
		}
		else if(recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.monteore != null)
		{
			var totOreLavorate = globals.getTotaleOreLavorateSuCommessa(recDittaCommessaFase.iddittacommessafase);
			if(totOreLavorate == recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.monteore)
				msgMonteOre += 'Il monte ore per la commessa ' + recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.descrizione + ' è stato raggiunto!\n';
			else if(totOreLavorate == recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.monteore)
				msgMonteOre += 'Il monte ore per la commessa ' + recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.descrizione + ' è stato superato!\n';
		}
		
		if(msgMonteOre.length != 0)
			forms.comm_ore_inserimento_tab.setStatusWarning(msgMonteOre);
		else
			forms.comm_ore_inserimento_tab.setStatusSuccess('Inserimento avvenuto correttamente',null,250);
			
		globals.preparaInserimentoOreCommesseLavoratore(event,
												        forms.comm_lav_header_dtl.idlavoratore,
														frmSel.vArrCommesseFasi,
														frmSel.vDal,
												        frmSel.vAl,
														frmSel.vArrFestivita,
														frmSel.serveRidisegno,
														null,
														frmSel.dxEvComm);
		globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event,
												        forms.comm_lav_header_dtl.idlavoratore,
														frmSel.vArrCommesseFasi,
														frmSel.vDal,
												        frmSel.vAl,
														frmSel.vArrFestivita,
														null,
														frmSel.dxEvComm);
	}	
	
	plugins.busy.unblock();
	
	return true;
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0B0FB02A-8D50-4415-AC77-CBA871DAB471"}
 */
function onDataChangeOreCommessaRapido(oldValue, newValue, event) 
{
   var elemName = event.getElementName();
   var pos_1 = utils.stringPosition(elemName,'_',0,1);
   var pos_2 = utils.stringPosition(elemName,'_',0,2);
   var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
   var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
   
   var frm = forms[forms.comm_ore_inserimento_rapido.elements.tab_inserimento.getTabFormNameAt(1)];
   var fs = frm.foundset;
   var currRec = fs.getRecord(rIndex);
   currRec['commessa_' + gIndex] = newValue;
   
}

/**
 * TODO tentativo salvataggio con onRecordEditStart
 * @param event
 *
 * @properties={typeid:24,uuid:"12B26662-CF87-442E-B56E-14B29A805ED1"}
 */
function onRecordEditStartOreCommessa(event)
{
	databaseManager.setAutoSave(true);
	forms.comm_ore_inserimento_tab.setStatusWarning('editing');
}

/**
 * TODO tentativo salvataggio con onRecordEditStop
 * @param record
 * @param event
 *
 * @properties={typeid:24,uuid:"DC1A08E0-85D8-4765-9684-C0A73D6A2052"}
 */
function onRecordEditStopOreCommessa(record,event)
{
	forms.comm_ore_inserimento_tab.setStatusSuccess('stop editing');
	saveRecordOreCommessa()
}

/**
 * @properties={typeid:24,uuid:"80B38018-9725-45E4-9B15-F3E6FA025CFD"}
 */
function saveRecordOreCommessa()
{
	forms.comm_ore_inserimento_tab.setStatusSuccess('saved');
	databaseManager.setAutoSave(false);
}

/**
 * @AllowToRunInFind
 *
 * Recuoera la descrizione della commessa a partire dall'id fornito
 *
 * @param {Number} idDittaCommessa
 *
 * @properties={typeid:24,uuid:"E77F97B5-68FF-4689-B7B2-6AF2E374A1A7"}
 */
function getDescrizioneCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsComm.find()) {
		fsComm.iddittacommessa = idDittaCommessa;
		if (fsComm.search())
			return fsComm.descrizione;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Recuoera la descrizione della commessa a partire dall'id della fase fornito
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"63B37F7C-E919-4538-8D69-945FB29D5EE1"}
 */
function getDescrizioneFase(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsCommFasi.find()) {
		fsCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsCommFasi.search())
			return fsCommFasi.descrizionefase;
	}

	return null;
}

/**
 * Restituisce il valore delle ore già presenti per la fase della commessa
 * riguardo al lavoratore nel giorno selezionato
 *
 * @param {Number} idCommessaFase
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 *
 * @return Number
 *
 * @properties={typeid:24,uuid:"892BE2E6-267A-4901-8BFC-A2252B88DD81"}
 * @AllowToRunInFind
 */
function getOreGiornoDipendenteFaseCommessa(idCommessaFase, idLavoratore, giorno, soloConsolidate, soloAutorizzate, soloFatturabili) {
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
	if (fs.find()) {
		fs.iddittacommessafase = idCommessaFase;
		fs.idlavoratore = idLavoratore;
		fs.giorno = '#'.concat(utils.dateFormat(giorno, globals.ISO_DATEFORMAT), '|', globals.ISO_DATEFORMAT);
		if (soloConsolidate)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.consolidato = 1;
		if (soloAutorizzate)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.autorizzato = 1;
		if (soloFatturabili)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.billable = 1;

		if (fs.search() && fs.commesse_giornaliera_to_commesse_giornaliera_ore)
			return fs.commesse_giornaliera_to_commesse_giornaliera_ore.ore;
	}

	return null;
}

/**
 *
 * Filtra i dipendenti selezionabili (all'interno della gestione commesse) in base alla commessa
 * al momento selezionata
 *
 * @param {JSFoundSet<db:/ma_anagrafiche/lavoratori_commesse>} _fs
 *
 * @properties={typeid:24,uuid:"6B12D5BA-8843-4D7E-9816-5F62F9F3915C"}
 */
function filterLavoratoriCommessa(_fs) {
	var frm = forms.comm_gestione_commesse_tbl;
	var rec = frm.foundset.getSelectedRecord();

	_fs.addFoundSetFilterParam('idditta', 'IN', rec.iddittaesclusiva != null ? [rec.iddittaesclusiva] : globals.getDitte());
	if (rec.finevalidita != null)
		_fs.addFoundSetFilterParam('assunzione', '<=', rec.finevalidita);

	if (rec.iniziovalidita != null)
		_fs.addFoundSetFilterParam('cessazione', '^||>=', rec.iniziovalidita);

	return _fs;
}

/**
 * Filtra le commesse valide e quindi selezionabili per il lavoratore corrente
 *
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"D80ADC15-A086-4C93-ABD4-27920323402E"}
 */
function filterLavoratoriCommessePeriodo(_fs) {
	var dsDitteCommesse = globals.getFasiCommesseLavoratore(forms.comm_lav_header_dtl.idlavoratore, forms.comm_ore_inserimento_selezione.vDal, forms.comm_ore_inserimento_selezione.vAl);

	_fs.addFoundSetFilterParam('iddittacommessafase', 'IN', dsDitteCommesse.getColumnAsArray(1));

	return _fs;
}

/**
 * @param {JSRecord<db:/ma_anagrafiche/ditte_commesse>} rec
 *
 * @properties={typeid:24,uuid:"92AC3BFD-43AF-43CF-8321-B47B83C5AA5E"}
 */
function validaGestioneCommesse(rec) {
	if (rec.codice == null || rec.codice == '') {
		globals.ma_utl_showWarningDialog('Inserire un valore per il codice della commessa', 'Gestione commesse');
		return false;
	}

	if (!isCodiceCommessaDisponibile(rec.codice, rec.idditta)) {
		globals.ma_utl_showWarningDialog('Il codice inserito è già stato utilizzato in precedenza.<br/>\
		                                  Si prega di sceglierne un altro.', 'Gestione commesse');
		return false;
	}

	return true;
}

/**
 * @param {String} codiceCommessa
 * @param {Number} idDitta
 *
 * @properties={typeid:24,uuid:"CD77BCA0-D3F0-422F-807E-7BDA95839F8D"}
 * @AllowToRunInFind
 */
function isCodiceCommessaDisponibile(codiceCommessa, idDitta) 
{
	// verifica se il codice non sia stato precedentemente utilizzato per la stessa ditta
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>} */
	var fsDitte = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
    if(fsDitte.find())
    {
    	fsDitte.idditta = idDitta;
    	fsDitte.codice = codiceCommessa;
    	if(fsDitte.search())
    		return false;
    }
    
    return true;
}

/**
 * Aggiorna la selezione dei dipendenti
 *
 * @param {Array<JSRecord>} _recs
 *
 * @properties={typeid:24,uuid:"4ACCBD3A-CEA4-4BA4-ABC8-BD6A6D959896"}
 */
function updateLavoratoriCommesse(_recs) { }


/**
 * @param {JSRenderEvent} event
 *
 * @properties={typeid:24,uuid:"1F8FA3C1-4875-4B86-9147-9B08074FBFC7"}
 */
function onRenderOreCommessaGestore(event)
{
	var _recRen = event.getRenderable();
	var _name = _recRen.getName();
    var _frm = forms.comm_ore_inserimento_selezione;
	var _fs = forms['comm_ore_lavoratore_commesse_tbl'].foundset;
    
	if (_name) 
	{
		// ottenimento del giorno considerato
		var pos_1 = utils.stringPosition(_name,'_',0,1);
		var pos_2 = utils.stringPosition(_name,'_',0,2);
		var rIndex = parseInt(utils.stringMiddle(_name,pos_1 + 1,pos_2 - 1));
		var gIndex = parseInt(utils.stringMiddle(_name,pos_2 + 1,_name.length));
		
		var gg = new Date(_frm.vDal.getFullYear(),
						  _frm.vDal.getMonth(),
						  _frm.vDal.getDate() + gIndex - 1);
		var _rec =  _fs.getRecord(rIndex);
		
		if (_rec) 
		{
			// colorazione giorni disabilitati (verifica la validità temporale commessa)
			if (_rec['iniziovaliditacommessa'] && gg < _rec['iniziovaliditacommessa'] 
			    || _rec['finevaliditacommessa'] && gg > _rec['finevaliditacommessa'])
			{
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.fgcolor = 'red';
				_recRen.toolTipText = 'Commessa non valida nel giorno';
			}
			
			// verifica se commessa terminata manualmente
			if(_rec['terminatacommessa'])
			{
				_recRen.enabled = false;
				_recRen.toolTipText = 'La commessa è terminata';
			}

			// colorazione giorni disabilitati (verifica la validità temporale fase commessa)
			if (_rec['iniziovaliditacommessafase'] && gg < _rec['iniziovaliditacommessafase'] 
			    || _rec['finevaliditacommessafase'] && gg > _rec['finevaliditacommessafase']) {
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.fgcolor = 'red';
				_recRen.toolTipText = 'Fase commessa non valida nel giorno';
			}
			
			// verifica se fase della commessa terminata manualmente
			if(_rec['chiusafasecommessa'])
			{
				_recRen.enabled = false;
				_recRen.toolTipText = 'La fase della commessa è terminata';
			}
			
			if(forms.comm_lav_header_dtl.assunzione > gg 
					|| forms.comm_lav_header_dtl.cessazione != null && forms.comm_lav_header_dtl.cessazione < gg)
			{
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.toolTipText = 'Dipendente non in forza nel giorno';
			}
			
			// verifica consolidamento ore
			if(_name == ('commessa_'+ rIndex + '_' + gIndex) &&
			 	isStatoOreFaseCommessaConsolidato(forms.comm_lav_header_dtl.idlavoratore
					                              ,gg
												  ,_rec['idcommessafase']))	
			{
				_recRen.bgcolor = globals.Colors.CONSOLIDATED.background;
				_recRen.fgcolor = globals.Colors.CONSOLIDATED.foreground; 
				_recRen.toolTipText = 'Ore consolidate';
			}

		}
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSRenderEvent} event
 *
 * @properties={typeid:24,uuid:"BEADA273-3581-44E8-8B76-B345ADA6522A"}
 */
function onRenderOreCommessa(event)
{
	var _recRen = event.getRenderable();
	var _name = _recRen.getName();
    var _frm = forms.comm_ore_inserimento_utente_selezione;
    var _fs = forms['comm_ore_lavoratore_commesse_tbl'].foundset;
    
	if (_name) 
	{
		// ottenimento del giorno considerato
		var pos_1 = utils.stringPosition(_name,'_',0,1);
		var pos_2 = utils.stringPosition(_name,'_',0,2);
		var rIndex = parseInt(utils.stringMiddle(_name,pos_1 + 1,pos_2 - 1));
		var gIndex = parseInt(utils.stringMiddle(_name,pos_2 + 1,_name.length));
		
		var gg = new Date(_frm.vDal.getFullYear(),
						  _frm.vDal.getMonth(),
						  _frm.vDal.getDate() + gIndex - 1);
		var _rec =  _fs.getRecord(rIndex);
		
		if (_rec) 
		{
			// colorazione giorni disabilitati (verifica la validità temporale commessa)
			if (_rec['iniziovaliditacommessa'] && gg < _rec['iniziovaliditacommessa'] 
			    || _rec['finevaliditacommessa'] && gg > _rec['finevaliditacommessa'])
			{
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.fgcolor = 'red';
				_recRen.toolTipText = 'Commessa non valida nel giorno';
			}
			
			// verifica se commessa terminata manualmente
			if(_rec['terminatacommessa'])
			{
				_recRen.enabled = false;
				_recRen.toolTipText = 'La commessa è terminata';
			}

			// colorazione giorni disabilitati (verifica la validità temporale fase commessa)
			if (_rec['iniziovaliditacommessafase'] && gg < _rec['iniziovaliditacommessafase'] 
			    || _rec['finevaliditacommessafase'] && gg > _rec['finevaliditacommessafase']) {
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.fgcolor = 'red';
				_recRen.toolTipText = 'Fase commessa non valida nel giorno';
			}
			
			// verifica se fase della commessa terminata manualmente
			if(_rec['chiusafasecommessa'])
			{
				_recRen.enabled = false;
				_recRen.toolTipText = 'La fase della commessa è terminata';
			}
			
			if(forms.comm_lav_header_dtl.assunzione > gg 
					|| forms.comm_lav_header_dtl.cessazione != null && forms.comm_lav_header_dtl.cessazione < gg)
			{
				_recRen.enabled = false;
				_recRen.bgcolor = globals.Colors.DISABLED.background;
				_recRen.toolTipText = 'Dipendente non in forza nel giorno';
			}
			
			// verifica consolidamento ore
			if(_name == ('commessa_'+ rIndex + '_' + gIndex)
				&& isStatoOreFaseCommessaConsolidato(forms.comm_lav_header_dtl.idlavoratore
					                                 ,gg
													 ,_rec['idcommessafase']))
			{
				_recRen.bgcolor = globals.Colors.CONSOLIDATED.background;
				_recRen.fgcolor = globals.Colors.CONSOLIDATED.foreground; 
				_recRen.enabled = false;
				_recRen.toolTipText = 'Ore consolidate non più modificabili';
			}
			
		}
	}
}

/**
 * @param {JSRenderEvent} event
 *
 * @properties={typeid:24,uuid:"F477FBBA-4340-4EAF-BF54-DBAB1068E13D"}
 */
function onRenderOreCommessaRiep(event) {
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	var elemName = _recRen.getName();

	var g = parseInt(utils.stringMiddle(elemName, 10, elemName.length - 9), 10);

	if (event.getRecordIndex() == 6) {
		if (_rec['commessa_' + g] < 0)
		{
			_recRen.bgcolor = 'red';
		    _recRen.toolTipText = Math.abs(_rec['commessa_' + g]) + ' ore rimanenti da inserire';
		}
		else if(_rec['commessa_' + g] > 0)
		{
			_recRen.bgcolor = 'orange';
			_recRen.toolTipText = _rec['commessa_' + g] + ' ore extra orario inserite';
		}
		else
		{
			_recRen.bgcolor = 'green';
			_recRen.toolTipText = 'Inserimento corretto';
		}
		_recRen.fgcolor = 'white';
	}
}

/**
 * Mostra il menu contestuale per la form di inserimento ore su commesse
 *
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"E97121A7-A88A-400E-9888-2C8832B64071"}
 */
function onRightClickOreCommessa(_event)
{
	var _source = _event.getSource();
	var _elemName = _event.getElementName();
	var pos_1 = utils.stringPosition(_elemName,'_',0,1);
	var pos_2 = utils.stringPosition(_elemName,'_',0,2);
	var rIndex = parseInt(utils.stringMiddle(_elemName,pos_1 + 1,pos_2 - 1));
	var gIndex = parseInt(utils.stringMiddle(_elemName,pos_2 + 1,_elemName.length));
	
	var _popUpMenu = plugins.window.createPopupMenu();
    var frmOpt = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
    
    var _gDate = new Date(frmOpt.vDal.getFullYear(),frmOpt.vDal.getMonth(),frmOpt.vDal.getDate() + gIndex - 1);
	
	if(globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE))
	{
		var _item1;
		if(!isStatoOreFaseCommessaConsolidato(forms.comm_lav_header_dtl.idlavoratore
			                                 ,_gDate
											 ,forms[_event.getFormName()].foundset['idcommessafase']))
		{
		    _item1  = _popUpMenu.addMenuItem('Consolida stato', consolidaStatoOreSelezionate);
		    _item1.methodArguments = [_event,
			                         forms.comm_lav_header_dtl.idlavoratore,
			                         forms[_event.getFormName()].foundset.getRecord(rIndex)['idcommessafase'],
									 _gDate];
		}
		else
		{
			_item1  = _popUpMenu.addMenuItem('Resetta stato', resettaStatoOreSelezionate);
		    _item1.methodArguments = [_event,
			                         forms.comm_lav_header_dtl.idlavoratore,
			                         forms[_event.getFormName()].foundset.getRecord(rIndex)['idcommessafase'],
									 _gDate];
		}
		
		var _menu1 = _popUpMenu.addMenu('Gestione autorizzazione ore');
		var _item1_1 = _menu1.addMenuItem('Dipendente selezionato', gestisciAutorizzazioneCommesseDaMenu);
		_item1_1.methodArguments = [_event,
								 frmOpt.vDal,
								 frmOpt.vAl,
								 [forms.comm_lav_header_dtl.idlavoratore]];
		var _item2_1 = _menu1.addMenuItem('Tutti i dipendenti', gestisciAutorizzazioneCommesseDaMenu);
		_item2_1.methodArguments = [_event,
								 frmOpt.vDal,
								 frmOpt.vAl,
								 globals.foundsetToArray(forms.comm_lav_header_dtl.foundset,'idlavoratore')];
		_popUpMenu.addSeparator();
	}

	var _item3 = _popUpMenu.addMenuItem('Rapportino utente',gestioneRapportinoUtente);
	_item3.methodArguments = [_event,
							  forms.comm_lav_header_dtl.idlavoratore,
	                          _gDate,
							  forms[_event.getFormName()].foundset.getRecord(rIndex)['idcommessafase']];

	_popUpMenu.addSeparator();
		
	var _item5 = _popUpMenu.addMenuItem('Imposta termine fase',gestioneTermineFase);
	_item5.methodArguments = [_event,
							  forms.comm_lav_header_dtl.idlavoratore,
	                          forms[_event.getFormName()].foundset.getRecord(rIndex)['idcommessafase']];
	
	_popUpMenu.show(_source);
}

/**
 * TODO generated, please specify type and doc for the params
 *
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} _event
 * @param {Number} idLavoratore
 * @param {Number} idFaseCommessa
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"D3187AAC-A091-43F0-9483-8C9E9C61C9D3"}
 */
function consolidaStatoOreSelezionate(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,idLavoratore,idFaseCommessa,giorno)
{
	consolidaStatoOreFaseCommessa([idLavoratore],giorno,giorno,idFaseCommessa);
    
	var frmSel = forms.comm_ore_inserimento_selezione;
	preparaInserimentoOreCommesseLavoratore(_event
		                                    ,idLavoratore
											,frmSel.vArrCommesseFasi
											,frmSel.vDal
											,frmSel.vAl
											,frmSel.vArrFestivita
											,frmSel.serveRidisegno
											,null
											,frmSel.dxEvComm);
}

/**
 * TODO generated, please specify type and doc for the params
 *
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} _event
 * @param {Number} idLavoratore
 * @param {Number} idFaseCommessa
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"F604672A-5952-4FAD-8137-E7063E43810E"}
 */
function resettaStatoOreSelezionate(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,idLavoratore,idFaseCommessa,giorno)
{
	resettaStatoOreFaseCommessa([idLavoratore],giorno,giorno,idFaseCommessa);
    
	var frmSel = forms.comm_ore_inserimento_selezione;
	preparaInserimentoOreCommesseLavoratore(_event
		                                    ,idLavoratore
											,frmSel.vArrCommesseFasi
											,frmSel.vDal
											,frmSel.vAl
											,frmSel.vArrFestivita
											,frmSel.serveRidisegno
											,null
											,frmSel.dxEvComm);
}


/**
 * Imposta la fase della commessa come terminata
 *
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} _event
 * @param {Number} idLavoratore
 * @param {Number} idFaseCommessa
 *
 * @properties={typeid:24,uuid:"54A43CA7-7516-4978-9261-6BDACABD620C"}
 * @AllowToRunInFind
 */
function gestioneTermineFase(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,idLavoratore,idFaseCommessa)
{
	/** @type{JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_COMMESSE_FASI);
	if(fs.find())
	{
		fs.iddittacommessafase = idFaseCommessa;
		fs.search();
		
		if(fs.terminata == 0)
		   globals.ma_utl_showWarningDialog('La fase della commessa risulta già essere terminata!','Gestione termine fase');
		else
		{
			databaseManager.startTransaction();
			fs.terminata = 1;
			fs.terminatada = idLavoratore;
			if(!databaseManager.commitTransaction())
			{
				globals.ma_utl_showErrorDialog('Errore durante il salvataggio dei dati, riprovare','Gestione termine fase');
				databaseManager.rollbackTransaction();
			}
		}
		
	}
}

/**
 * Richiama la form per l'inserimento di una richiesta di ferie/permessi
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt 
 * @param {JSEvent} _event
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Number} idFaseCommessa
 *
 * @properties={typeid:24,uuid:"61C0512C-05DD-4548-B56C-6CF1CE015D0D"}
 * @AllowToRunInFind
 */
function gestioneRapportinoUtente(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,idLavoratore,giorno,idFaseCommessa)
{
    var frm = forms.comm_ore_riepilogo;
    /** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_ORE);
	if(fs.find())
	{
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = idLavoratore;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(giorno,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.iddittacommessafase = idFaseCommessa;
		
		fs.search();
		
		if(fs.getSize())
		{	
			if(frm.foundset.find())
			{
				frm.foundset.idcommessagiornaliera = fs.idcommessagiornaliera;
				frm.foundset.search();
				
				if(frm.foundset.getSize())
				{
					globals.ma_utl_showFormInDialog(frm.controller.getName(),'Gestione rapportino');
				    return;
				}
			}
		}
	}
	
	globals.ma_utl_showWarningDialog('Nessun rapportino associato','Gestione rapportino');
	
	
}

/**
 * Recupera le timbrature relative alla commessa indicata per i giorni specificati
 *
 * @param {JSEvent} event
 * @param {Number} idLavoratore
 * @param {Number} idDittaCommessaFase
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"E1507E22-01A1-4E86-8C98-929394B37F0A"}
 * @AllowToRunInFind
 */
function preparaTimbratureCommessePerCommessa(event, idLavoratore, idDittaCommessaFase, dal, al) {

// TODO
	
//	var stdColComm = 1; //numero di colonne per timbrature standard = 4 (2 coppie entrata/uscita)
//	var colNames = ['giorno', 'nome_giorno', 'timbrature', 'ore'];
//	var colTypes = [JSColumn.TEXT, JSColumn.TEXT, JSColumn.TEXT, JSColumn.NUMBER];
//
//	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>} */
//	var fsComm = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
//	if (fsComm.find()) {
//		fsComm.idlavoratore = idLavoratore;
//		fsComm.giorno = (utils.dateFormat(dal, globals.ISO_DATEFORMAT), '|', globals.ISO_DATEFORMAT) + '...' + (utils.dateFormat(al, globals.ISO_DATEFORMAT), '|', globals.ISO_DATEFORMAT);
//		fsComm.iddittacommessafase = idDittaCommessaFase;
//
//		if (fsComm.search()) {
//			fsComm.sort('giorno asc');
//
//			var dsCommTimbr = databaseManager.createEmptyDataSet(stdColComm + 3, colNames);
//
//			// ciclo sulle commesse del foundset ottenuto
//			for (var c = 1; c <= fsComm.getSize(); c++) {
//				dsCommTimbr.setValue(c, 1, globals.getNumGiorno(fsComm.getRecord(c).giorno));
//				dsCommTimbr.setValue(c, 2, globals.getNomeGiorno(fsComm.getRecord(c).giorno));
//				var fsTimbr = fsComm.getRecord(c).commesse_giornaliera_to_commesse_giornaliera_timbrature;
//				for (var t = 1; t <= fsTimbr.getSize(); t++) {
//					// TODO calcolo ore in base alle timbrature della giornata
//					dsCommTimbr.setValue(t, 6, 0.00);
//				}
//			}
//
//			var dSCommTimbr = dsCommTimbr.createDataSource('dSCommTimbr', colTypes);
//
//			globals.disegnaTimbratureCommessePerCommessa(dSCommTimbr);
//		}
//	}
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il record relativo alla tabella ditte_commesse riferito all'identificativo della commessa specificato
 *
 * @param {Number} comm
 *
 * @return {JSRecord<db:/ma_anagrafiche/ditte_commesse>}
 *
 * @properties={typeid:24,uuid:"ED745189-AF14-4DCB-AD99-3619D4D84F3B"}
 */
function getDittaCommessa(comm) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsDitteCommesse = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsDitteCommesse.find()) {
		fsDitteCommesse.iddittacommessa = comm;
		if (fsDitteCommesse.search())
			return fsDitteCommesse.getSelectedRecord();

	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il record relativo alla tabella ditte_commesse_fasi riferito all'identificativo della fase della commessa specificato
 *
 * @param {Number} commFase
 *
 * @properties={typeid:24,uuid:"9C97EB03-0F12-446B-9C61-8036F244890E"}
 */
function getDittaCommessaFase(commFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommesseFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommesseFasi.find()) {
		fsDitteCommesseFasi.iddittacommessafase = commFase;
		if (fsDitteCommesseFasi.search())
			return fsDitteCommesseFasi.getSelectedRecord();

	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il record relativo alla tabella ditte_commesse_fasi riferito all'identificativo della fase della commessa specificato
 *
 * @param {Number} commFase
 * 
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"240BE7C3-11DC-4FD8-8B9E-3D6733206F98"}
 */
function getDittaCommessaDaIdFase(commFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommesseFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommesseFasi.find()) {
		fsDitteCommesseFasi.iddittacommessafase = commFase;
		if (fsDitteCommesseFasi.search())
			return fsDitteCommesseFasi.ditte_commesse_fasi_to_ditte_commesse.iddittacommessa;

	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce l'identificativo della ditta riferito all'identificativo della fase della commessa specificato
 *
 * @param {Number} commFase
 * 
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"F3801D5C-945F-426A-97B4-127D57A2DD0B"}
 */
function getDittaDaIdFase(commFase)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommesseFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommesseFasi.find()) {
		fsDitteCommesseFasi.iddittacommessafase = commFase;
		if (fsDitteCommesseFasi.search())
			return fsDitteCommesseFasi.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_to_ditte.idditta;

	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce un array con gli identificativi dei lavoratori ai quali sono associate
 * le fasi sulle commesse specificate
 *
 * @param {Array<Number>} arrCommesseFasi
 *
 * @return {Array<Number>}
 *
 * @properties={typeid:24,uuid:"1460DF53-1353-49D8-AF4B-D697C25B2E7B"}
 */
function getLavoratoriAssociatiFasiCommesse(arrCommesseFasi)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori_commesse>}*/
	var fsLavComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI_COMMESSE);
	if (fsLavComm.find())
	{
		fsLavComm.iddittacommessafase = arrCommesseFasi;
		if (fsLavComm.search()) {
			fsLavComm.sort('lavoratori_commesse_to_lavoratori.lavoratori_to_persone.nominativo asc');
			var arrLavoratori = [];
			for(var l = 1; l <= fsLavComm.getSize(); l++)
			{
				if(arrLavoratori.indexOf(fsLavComm.getRecord(l).idlavoratore) == -1)
					arrLavoratori.push(fsLavComm.getRecord(l).idlavoratore);
			}
			return arrLavoratori;
		}
	}

	return [];
}

/**
 * Restituisce l'array di lavoratori associati alla particolare commessa
 *
 * @param {Number} idDittaCommessa
 *
 * @return Array<Number>
 *
 * @properties={typeid:24,uuid:"2B386370-A233-4AB7-B8CC-804E54663B3E"}
 * @AllowToRunInFind
 */
function getLavoratoriAssociatiCommessa(idDittaCommessa) 
{
	var arrLavComm = [];
	var arrLavFasi = [];
	
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>} */
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_COMMESSE);
	if(fsDitteComm.find())
	{
		fsDitteComm.iddittacommessa = idDittaCommessa;
		if(fsDitteComm.search())
		{
			var fsDitteCommFasi = fsDitteComm.ditte_commesse_to_ditte_commesse_fasi;
			fsDitteCommFasi.loadAllRecords();
			for(var cf = 1; cf <= fsDitteCommFasi.getSize(); cf++)
			{
			   var fsDitteCommFasiLav = fsDitteCommFasi.getRecord(cf).ditte_commesse_fasi_to_lavoratori_commesse; 
			   if(fsDitteCommFasiLav && fsDitteCommFasiLav.getSize())
			   {
				   for(var l = 1; l <= fsDitteCommFasiLav.getSize(); l++)
				   	   arrLavFasi.push(fsDitteCommFasiLav.getRecord(l).idlavoratore)
				   
			   }
			}
		}
	}
	
	for(var i = 0; i < arrLavFasi.length; i++)
	{
		if(arrLavComm.indexOf(arrLavFasi[i]) == -1)
		   arrLavComm.push(arrLavFasi[i]);
	}
	
	return arrLavComm;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce l'identificativo della ditta esclusiva alla quale è associata la commessa avente identificativo idDittaCommessa
 *
 * @param {Number} idDittaCommessa
 *
 * @return Number
 *
 * @properties={typeid:24,uuid:"6B520137-3699-4FF2-BBA7-0095B1A962CD"}
 */
function getDittaEsclusivaCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsComm.find()) {
		fsComm.iddittacommessa = idDittaCommessa;
		if (fsComm.search())
			return fsComm.iddittaesclusiva;
	}

	return null;
}

/**
 * Restituisce il valore delle ore già presenti per la commessa nel giorno selezionato
 *
 * @param {Date} giorno
 * @param {Number} idCommessa
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 *
 * @return Number
 *
 * @properties={typeid:24,uuid:"B5D4D305-106D-48E1-BD51-57C0ED29E5E1"}
 * @AllowToRunInFind
 */
function getOreGiornoCommessa(giorno, idCommessa, soloAutorizzate, soloFatturabili) {
	var totOreCommGiorno = 0;
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>} */
	var fsCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsCommFasi.find()) {
		fsCommFasi.iddittacommessa = idCommessa;
		var totRec = fsCommFasi.search();
		if (totRec) {

			for (var fc = 1; fc <= totRec; fc++)
				totOreCommGiorno += getOreGiornoFaseCommessa(giorno, fsCommFasi.iddittacommessafase);
		}
	}

	return totOreCommGiorno;
}

/**
 * Restituisce il valore delle ore già presenti per la commessa nel giorno selezionato
 *
 * @param {Date} giorno
 * @param {Number} idCommessaFase
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 *
 * @return Number
 *
 * @properties={typeid:24,uuid:"17510C67-B627-4024-9222-C0AC9893F7D0"}
 * @AllowToRunInFind
 */
function getOreGiornoFaseCommessa(giorno, idCommessaFase, soloConsolidate, soloAutorizzate, soloFatturabili) {
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
	if (fs.find()) {
		fs.iddittacommessafase = idCommessaFase;
		fs.giorno = '#'.concat(utils.dateFormat(giorno, globals.ISO_DATEFORMAT), '|', globals.ISO_DATEFORMAT);
		if (soloConsolidate)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.consolidato = 1;
		if (soloAutorizzate)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.autorizzato = 1;
		if (soloFatturabili)
			fs.commesse_giornaliera_to_commesse_giornaliera_ore.ore = 1;
		if (fs.search() && fs.commesse_giornaliera_to_commesse_giornaliera_ore)
			return fs.commesse_giornaliera_to_commesse_giornaliera_ore.ore;
	}

	return 0;
}

/**
 * Calcola il numero di ore lavorate immesse per la commessa indicata
 * nel periodo specificato
 *
 * @param {Number} idDittaCommessa
 * @param {Date} [dal]
 * @param {Date} [al]
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 *
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"22552C2C-DE14-472C-B26A-529231CE3F3E"}
 * @AllowToRunInFind
 */
function getTotaleOreLavorateSuCommessa(idDittaCommessa, dal, al, soloConsolidate, soloAutorizzate, soloFatturabili) {
	var totOre = null;

	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>} */
	var fsCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsCommFasi.find()) {
		fsCommFasi.iddittacommessa = idDittaCommessa;
		var totRecord = fsCommFasi.search();

		for (var cf = 1; cf <= totRecord; cf++)
			totOre += getTotaleOreLavorateSuFaseCommessa(fsCommFasi.getRecord(cf).iddittacommessafase,
				dal,
				al,
				soloConsolidate,
				soloAutorizzate,
				soloFatturabili);

	}
	return totOre;
}

/**
 * Calcola il numero di ore lavorate immesse per la fase della commessa indicata
 * nel periodo specificato (tiene conto anche di eventuali lavoratori non più associati)
 *
 * @param {Number} idDittaCommessaFase
 * @param {Date} [dal]
 * @param {Date} [al]
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate] 
 * @param {Boolean} [soloFatturabili]
 *
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"43E35A88-56E2-4491-819A-074B0962F03C"}
 * @AllowToRunInFind
 */
function getTotaleOreLavorateSuFaseCommessa(idDittaCommessaFase, dal, al, soloConsolidate,soloAutorizzate, soloFatturabili)
{
	var totOreFase = null;

	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>}*/
	var fsCommGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
	if (fsCommGiorn.find()) 
	{
		fsCommGiorn.iddittacommessafase = idDittaCommessaFase;

		if (dal && al)
			fsCommGiorn.giorno = utils.dateFormat(dal, globals.ISO_DATEFORMAT) + '...' + utils.dateFormat(al, globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		
		var totCommGiorn = fsCommGiorn.search();
		if (totCommGiorn) 
		{
			for(var cg = 1; cg <= totCommGiorn; cg++)
			{
				var fsCommGiornOre = fsCommGiorn.getRecord(cg).commesse_giornaliera_to_commesse_giornaliera_ore;
				if(fsCommGiornOre.find())
				{
					if(soloConsolidate)
						fsCommGiornOre.consolidato = 1;
					if(soloAutorizzate)
						fsCommGiornOre.autorizzato = 1;
					if(soloFatturabili)
						fsCommGiornOre.billable = 1;
					var totCommGiornOre = fsCommGiornOre.search();
					if(totCommGiornOre)
					   for(var cgo = 1; cgo <= totCommGiornOre; cgo++)
							totOreFase += fsCommGiornOre.ore;
											
				}
//				if(soloAutorizzate && soloFatturabili)
//						fsCommGiornOre.autorizzato 
//						&& fsCommGiornOre.billable ?
//	    			               totOreFase += fsCommGiornOre.ore : totOreFase += 0;
//	    			else if(soloAutorizzate)
//						fsCommGiornOre.autorizzato ?
//	    			               totOreFase += fsCommGiornOre.ore : totOreFase += 0;
//	                else if(soloFatturabili)
//						fsCommGiornOre.billable ?
//	    			               totOreFase += fsCommGiornOre.ore : totOreFase += 0;               
//	    			else
//	    			    totOreFase += fsCommGiornOre.ore;
				
			}
		}
	}
	return totOreFase;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce la data di inizio validità (se presente) della commessa indicata
 *
 * @param {Number} idDittaCommessa
 *
 * @return {Date}
 *
 * @properties={typeid:24,uuid:"B6760B3D-5A05-43BB-96F9-1EC84D23EF94"}
 */
function getDataInizialeCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsDitteComm.find()) {
		fsDitteComm.iddittacommessa = idDittaCommessa;
		if (fsDitteComm.search())
			return fsDitteComm.iniziovalidita;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce la data di inizio validità (se presente) della fase della commessa indicata
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"B3DC58A9-AC8F-4BCF-A46D-BF35D93F76EE"}
 */
function getDataInizialeFaseCommessa(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search())
			return fsDitteCommFasi.iniziovaliditafase;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce la data di inizio validità (se presente) della commessa indicata
 *
 * @param{Number} idDittaCommessa
 *
 * @return {Date}
 *
 * @properties={typeid:24,uuid:"E4F5EFC0-9A5B-45E8-8417-80C198020D56"}
 */
function getDataFinaleCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsDitteComm.find()) {
		fsDitteComm.iddittacommessa = idDittaCommessa;
		if (fsDitteComm.search())
			return fsDitteComm.finevalidita;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce la data di inizio validità (se presente) della fase della commessa indicata
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"4FBF9C4A-B557-4280-B597-B1502195DE00"}
 */
function getDataFinaleFaseCommessa(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search())
			return fsDitteCommFasi.finevaliditafase;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il monte ore della commessa indicata
 *
 * @param {Number} idDittaCommessa
 *
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"EF8F7675-F08B-439A-A37A-A99AD3C46C27"}
 */
function getMonteOreCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsDitteComm.find()) {
		fsDitteComm.iddittacommessa = idDittaCommessa;
		if (fsDitteComm.search())
			return fsDitteComm.monteore;
	}
	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il monte ore della fase della commessa indicata
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"3EDB7C62-69B4-4204-9643-1904B699D5AD"}
 */
function getMonteOreFaseCommessa(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search())
			return fsDitteCommFasi.monteorefase;
	}
	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il monte ore della commessa indicata
 *
 * @param {Number} idDittaCommessa
 * @param {Number} idDittaCommessaFase
 * 
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"2F2BD582-96C3-4101-97D5-9F5A77455EC3"}
 */
function getTotaleMonteOreCommessaDaFasi(idDittaCommessa,idDittaCommessaFase) 
{
	var totMonteOreDaFasi = 0;
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteComm.find()) {
		fsDitteComm.iddittacommessa = idDittaCommessa;
		fsDitteComm.iddittacommessafase = '!' + idDittaCommessaFase;
		var totFasiCommessa = fsDitteComm.search(); 
		if (totFasiCommessa)
		{
			for(var f = 1; f <= totFasiCommessa; f++)
				totMonteOreDaFasi += fsDitteComm.getRecord(f).monteorefase;
			
		}
	}
	
	return totMonteOreDaFasi;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il valore del campo indicante l'eventuale chiusura della commessa
 *
 * @param {Number} idDittaCommessa
 *
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"26710EF3-DD93-470D-B1C4-61EBBC6ED1AE"}
 */
function getChiusuraCommessa(idDittaCommessa) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>}*/
	var fsDitteComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE);
	if (fsDitteComm.find()) {
		fsDitteComm.iddittacommessa = idDittaCommessa;
		if (fsDitteComm.search())
			return fsDitteComm.terminata;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il valore del campo indicante l'eventuale chiusura della fase della commessa
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"76668719-91A6-4556-95C3-061088B101E8"}
 */
function getChiusuraFaseCommessa(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search())
			return fsDitteCommFasi.terminata;
	}

	return null;
}

/**
 * @AllowToRunInFind
 *
 * Restituisce il valore del campo indicante se la fase della commessa è bloccante
 *
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"FCC076A3-B88B-47CB-807D-6D9D9352C3CD"}
 */
function getBloccanteFaseCommessa(idDittaCommessaFase) {
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search() == 1)
			return fsDitteCommFasi.bloccante;
		else
			return getBloccanteFaseCommessa(fsDitteCommFasi.iddittacommessafaseprecedente);
	}

	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce il valore dell'identificativo della fase precedente della commessa 
 * 
 * @param {Number} idDittaCommessaFase
 *
 * @properties={typeid:24,uuid:"D8DEFB24-25B7-4A63-8682-E354959AC0CA"}
 */
function getFasePrecedente(idDittaCommessaFase)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsDitteCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsDitteCommFasi.find()) {
		fsDitteCommFasi.iddittacommessafase = idDittaCommessaFase;
		if (fsDitteCommFasi.search())
			return fsDitteCommFasi.iddittacommessafaseprecedente;
	}

	return null;
}

/**
 * Apre il program per la programmazione delle commesse
 *
 * @param {JSEvent} _event
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {String} _grLav
 * @param {Number} _grInst
 * @param {Number} [_idLavSelezionato]
 * @param {Boolean} [_inserimentoUtente]
 *
 * @properties={typeid:24,uuid:"F67572F6-25F6-4289-9247-EB9AD927774C"}
 */
function apriProgrammazioneCommesse(_event, _idditta, _anno, _mese, _grLav, _grInst, _idLavSelezionato, _inserimentoUtente) {
	
	var periodo = _anno * 100 + _mese
	var periodoFiltroMP = periodo;
	if (globals.isDittaMesePrecedente(_idditta,periodo) == 1) 
	{
		if (_mese < 12)
			periodoFiltroMP = _anno * 100 + _mese + 1;
		else
			periodoFiltroMP = (_anno + 1) * 100 + 1;
	}

	var primoGiorno = globals.getFirstDatePeriodo(periodo);
	var ultimoGiorno = globals.getLastDatePeriodo(periodoFiltroMP);

	var gruppoInst = -1
	var gruppoLav = ''

	if (_grLav)
		gruppoLav = _grLav;
	if (_grInst)
		gruppoInst = _grInst;

	var filterDittaCommesse = { filter_name: 'ftr_idditta', filter_field_name: 'idditta', filter_operator: '=', filter_value: _idditta };
	var filterAssunzione = { filter_name: 'ftr_data_assunzione', filter_field_name: 'assunzione', filter_operator: '^||<=', filter_value: ultimoGiorno };
	var filterCessazione = { filter_name: 'ftr_data_fine_rapporto', filter_field_name: 'cessazione', filter_operator: '^||>=', filter_value: primoGiorno };
	var filterGruppoLav = null;

	//ottieni stringa per filtro, recupera l'array di iddip per il filtraggio
	var params = globals.inizializzaParametriAttivaMese
	(_idditta,
		periodo,
		gruppoInst,
		gruppoLav,
		globals._tipoConnessione
	);

	if (_event)
		globals.svy_mod_closeForm(_event);

	var progName = 'Commesse_Lavoratore';
	var progObj = globals.nav.program[progName];

	// evita che sia caricato l'ultimo foundset del program
	progObj.foundset = null;

	var frmSel;
	
	if (_inserimentoUtente) 
	{
		// impostazioni dati per opzioni inserimento ore su commesse (caso utente)
		forms.comm_ore_inserimento_tab.elements.tab_selezione.addTab(forms.comm_ore_inserimento_utente_selezione.controller.getName());
		frmSel = forms.comm_ore_inserimento_utente_selezione;
		var today = globals.TODAY;
		var primoGgSett;
		var ultimoGgSett;
		var arrDescSett = [];
		var arrSett = [];
		var numSett = globals.getNumSettimaneAnno(today.getFullYear());
		
		for(var sett = 1; sett <= numSett; sett++)
		{
			primoGgSett = globals.getDateOfISOWeek(sett,today.getFullYear());
			ultimoGgSett = new Date(primoGgSett.getFullYear(),primoGgSett.getMonth(),primoGgSett.getDate() + 6);
			arrSett.push(sett);
			arrDescSett.push('Settimana ' + sett + ' - dal ' + globals.dateFormat(primoGgSett,'dd/MM') + 
				             ' al ' + globals.dateFormat(ultimoGgSett,'dd/MM'));
		}
		application.setValueListItems('vls_settimane',arrDescSett,arrSett); 
		/**Object { int week, int year }*/
		var dayStruct = globals.getWeekNumber(today);
		frmSel.vSettimana = dayStruct['week'];
		frmSel.vDal = globals.getDateOfISOWeek(frmSel.vSettimana,today.getFullYear());
		frmSel.vAl = new Date(frmSel.vDal.getFullYear(), frmSel.vDal.getMonth(), frmSel.vDal.getDate() + 6);
		frmSel.vAnno = today.getFullYear();
		var filterLavoratore = { filter_name: 'ftr_lavoratore', filter_field_name: 'idlavoratore', filter_operator: '=', filter_value: _idLavSelezionato };
		progObj.filter = [filterLavoratore];
	} 
	else
	{
		// impostazioni dati per opzioni inserimento ore su commesse (caso gestore commessa)
		forms.comm_ore_inserimento_tab.elements.tab_selezione.addTab(forms.comm_ore_inserimento_selezione.controller.getName());
		frmSel = forms.comm_ore_inserimento_selezione;
		frmSel.vDal = new Date(_anno, _mese - 1, 1);
		frmSel.vAl = new Date(_anno, _mese - 1, globals.getTotGiorniMese(_mese,_anno));
		frmSel.elements.btn_acquisisci_file_ore_commesse.enabled = forms.comm_ore_inserimento_selezione.elements.btn_invia_report.enabled = ! (_inserimentoUtente != null && _inserimentoUtente);
		
		var dipendenti = globals.getLavoratoriGruppo(params, _idditta);
		if (dipendenti) {
			if (dipendenti.length > 0) {
				filterGruppoLav = { filter_name: 'ftr_gruppo_lav', filter_field_name: 'idlavoratore', filter_operator: 'IN', filter_value: dipendenti };
				progObj.filter = [filterDittaCommesse, filterAssunzione, filterCessazione, filterGruppoLav];
			} else
				progObj.filter = [filterDittaCommesse, filterAssunzione, filterCessazione];
		} else
			globals.ma_utl_showErrorDialog('La richiesta al server è fallita, riprovare', 'Errore di comunicazione');
	}

	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);

	for (var f in progObj.filter)
		fs.addFoundSetFilterParam(progObj.filter[f].filter_field_name, progObj.filter[f].filter_operator, progObj.filter[f].filter_value, progObj.filter[f].filter_name);

	if (fs.loadAllRecords() && fs.getSize() === 0)
		globals.ma_utl_showInfoDialog('Nessun dipendente per il periodo selezionato', 'i18n:svy.fr.lbl.excuse_me');
	else
		globals.openProgram(progName, params, true);

	if ( (_inserimentoUtente != null && !_inserimentoUtente) && _idLavSelezionato)
		globals.lookupFoundset(_idLavSelezionato, forms.comm_lav_header_dtl.foundset);

}

/**
 * Importa il tracciato attraverso il file caricato
 *
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"A85AD9B3-D55E-4E63-90B5-F85C63E31878"}
 */
function importaTracciatoOreCommesse(files) {
	// lunghezza della singola stringa
	var rowLength = 32;

	if (files && files[0])// && globals.endsWith('.txt', files[0].getName(), true))
	{
		var file = files[0];
//		var fileName = file.getName();
//		var fileSize = file.getBytes();
		var txtFile = plugins.file.readTXTFile(file);

		databaseManager.startTransaction();

		/** @type {JSFoundSet<db:/ma_log/operationuser>}*/
		var fsOpUser = databaseManager.getFoundSet(globals.Server.MA_LOG, globals.Table.OPERATION_USER);
		var recOpUser = fsOpUser.getRecord(fsOpUser.newRecord());
		recOpUser.op_id = application.getUUID().toString().toLowerCase();
		recOpUser.user_id = security.getUserName()
		recOpUser.client_id = security.getClientID();

		/** @type {JSFoundSet<db:/ma_log/operationlog>}*/
		var fsOpLog = databaseManager.getFoundSet(globals.Server.MA_LOG, globals.Table.OPERATION_LOG);
		var recOpLogIndex = fsOpLog.newRecord();
		if (recOpLogIndex != -1) {
			var recOpLog = fsOpLog.getRecord(recOpLogIndex);
			var today = globals.TODAY;
			recOpLog.op_id = recOpUser.op_id;
			recOpLog.op_hash = utils.stringMD5HashBase64(forms.comm_lav_header_dtl.idditta + today.toString());
			recOpLog.op_start = today;
			recOpLog.op_end = null;
			recOpLog.op_status = globals.OpStatus.ONGOING;
			recOpLog.op_progress = 0;
			recOpLog.op_message = "Inizio importazione tracciato ore commesse";
			recOpLog.op_type = getOpType(globals.OpType.ITCom);
			recOpLog.op_ditta = forms.comm_lav_header_dtl.idditta;
			recOpLog.op_periodo = today.getFullYear() * 100 + today.getMonth() + 1;
			recOpLog.op_lastprogress = today;
			recOpLog.hidden = 0;

			if (databaseManager.commitTransaction())
				globals.openProgram('MA_StoricoOperazioni', null, true);
			else 
			{
				databaseManager.rollbackTransaction();
				globals.ma_utl_showErrorDialog('Errore nel salvataggio delle informazioni : ', 'Importazione tracciato ore commesse');
			}
		} else {
			globals.ma_utl_showErrorDialog('Errore durante la creazione del record per la gestione dell\'operazione lunga', 'Importazione tracciato ore commesse');
			return;
		}

		// otteniamo l'array di stringhe di ore lavorate sulle commesse
		var arrFile = txtFile.split('\n');

		// una volta ottenuto l'array con le ore di commessa, ogni riga corrisponderà a delle ore di lavoro
		// di un dipendente	sulla particolare commessa
		for (var row = 0; row < arrFile.length; row++) {
			/** @type Array */
			var arrRow = arrFile[row];

			if (arrRow.length == rowLength) 
			{
				// codice dipendente ricavato da anagrafica di PresenzaSemplice (tabella lavoratori)
				var codDipendente = parseInt(arrRow.substring(0, 8), 10);
				
				// codice commessa ricavato da anagrafica di PresenzaSemplice (tabella ditte_commesse)
				var codCommessaRaw = arrRow.substring(8, 13);
				var firstOccCharCom = utils.stringPosition(codCommessaRaw, '#', 1, 1);
				var codCommessa = utils.stringMiddle(codCommessaRaw, 1, firstOccCharCom - 1);
				
				// codice della fase della commessa ricavato da anagrafica (tabella ditte_commesse_fasi)
				var codCommessaFaseRaw = arrRow.substring(13, 18);
				var firstOccCharFase = utils.stringPosition(codCommessaFaseRaw,'#',1,1);
				var codCommessaFase = utils.stringMiddle(codCommessaFaseRaw,1,firstOccCharFase - 1);
				
				// giorno in formato iso (yyyyMMdd)
				var giorno = arrRow.substring(18, 26);
							
                // numero di ore lavorate (tipologia centesimi di ora) moltiplicate per 100 (se < 1000 vanno aggiunti
				// in testa tanti zeri quanti ne servono a raggiungere la cifra)
				var oreLavorate = parseInt(arrRow.substring(26, 30), 10) / 100;
				
				// proprietà dell'evento associato (se effettivamente associato)
				var propGiorno = arrRow.substring(30, 32);
								
				var idLavoratore = globals.getIdLavoratoreDaCodice(codDipendente);
				var idDittaCommessa = globals.getIdCommessaDaCodice(codCommessa);
				var idDittaCommessaFase = globals.getIdFaseCommessaDaCodice(codCommessaFase);

				databaseManager.startTransaction();
				recOpLog.op_progress = row / arrFile.length;
				recOpLog.op_message = 'Dipendente : ' + globals.getNominativo(idLavoratore) + ' - Importazione ore su commessa ' + globals.getCodiceCommessaDitta(idDittaCommessa);

				// inserimento ore
				globals.inserisciOreCommessa(idLavoratore
					                         , giorno
											 , idDittaCommessaFase
											 , oreLavorate
											 , propGiorno);
			} else {
				recOpLog.op_status = globals.OpStatus.ERROR;
				recOpLog.op_progress = 100;
				recOpLog.op_message = 'Formato della stringa di ordine ' + (row + 1) + ' non riconosciuto, controllare il file tracciato';
				databaseManager.commitTransaction();
				return;
			}

			recOpLog.op_status = globals.OpStatus.SUCCESS;
			recOpLog.op_progress = 100;
			recOpLog.op_message = 'Tracciato ore su commessa importato correttamente';
			databaseManager.commitTransaction();
		}

	} else {
		globals.ma_utl_showErrorDialog('Selezionare un file TXT', 'i18n:svy.fr.lbl.excuse_me');
		return;
	}
}

/**
 * @properties={typeid:24,uuid:"32E5B3DC-2FE8-4AA3-9439-59F63F8CD628"}
 */
function gestisciOreCommesseUtente() {
	var idLavoratoreUtente = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	var idDitta = globals.getDitta(idLavoratoreUtente);
	var today = globals.TODAY;
	apriProgrammazioneCommesse(null,
		idDitta,
		today.getFullYear(),
		today.getMonth() + 1,
		'',
		globals.getGruppoInstallazioneLavoratore(idLavoratoreUtente),
		idLavoratoreUtente,
		true);

}

/**
 * @properties={typeid:24,uuid:"0B580411-34BB-4699-A26F-041DC022C435"}
 */
function aggiornaTotaleOreInseriteGiorno(elemName) 
{
	var g = parseInt(utils.stringMiddle(elemName, 10, elemName.length - 9), 10);
	var frm = forms[forms.comm_ore_inserimento_tab.elements.tab_inserimento.getTabFormNameAt(1)];
	var fs = frm.foundset;

	var totComm = 0;
	for (var comm = 1; comm <= fs.getSize(); comm++) {
		var rec = fs.getRecord(comm);
		if (rec['commessa_' + g] != null)
			totComm += rec['commessa_' + g];
	}
	
	// aggiornamento della cella corrispondete alla somma delle ore lavorate su commessa
	aggiornaTotaleOreRiepilogo(g,2,totComm);
	
	if(totComm > 13)
		globals.ma_utl_showWarningDialog('Le ore inserite superano il massimo numero di ore lavorative giornaliere consentite.<br/>\
		                                  Controllare i valori immessi prima di proseguire.','Inserimento ore commessa');
}

/**
 * Aggiorna i valori del riepilogo
 * 
 * @param indiceGiorno
 * @param indiceRiga
 * @param valore
 *
 * @properties={typeid:24,uuid:"F2928F53-5B61-430E-9FB3-3FBBE9C37081"}
 */
function aggiornaTotaleOreRiepilogo(indiceGiorno,indiceRiga,valore)
{
	var frmSel = forms.comm_ore_inserimento_selezione;
	var totGiorni = globals.dateDiff(frmSel.vDal,frmSel.vAl,1000 * 60 * 60 * 24);
	var frmRiep = forms[forms.comm_ore_inserimento_tab.elements.tab_riepilogo.getTabFormNameAt(1)];
	var fsRiep = frmRiep.foundset;

	// aggiorna valore
    fsRiep.getRecord(indiceRiga)['commessa_' + indiceGiorno] = valore;
    
    // aggiorna delta giorno
    fsRiep.getRecord(5)['commessa_' + indiceGiorno] = fsRiep.getRecord(1)['commessa_' + indiceGiorno] 
                                                      - fsRiep.getRecord(2)['commessa_' + indiceGiorno]
                                                      - fsRiep.getRecord(3)['commessa_' + indiceGiorno]
                                                      - fsRiep.getRecord(4)['commessa_' + indiceGiorno];
    
    // aggiorna valore del totale ore
    for(var r = 1; r <= fsRiep.getSize(); r++)
    {
    	var totRiga = 0;
    	for(var g = 1; g <= totGiorni; g++)
    	    totRiga += fsRiep.getRecord(r)['commessa_' + g];
    	
    	fsRiep.getRecord(r)['totale_ore'] = totRiga;
    }
    
}

/**
 * Applica il filtro per la selezione delle commesse per il lavoratore corrente
 *  
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"F6FBF183-7567-411D-9D0D-277D0D309563"}
 */
function FiltraLavoratoriCommesseFasiPeriodo(fs)
{
	var dsFasi = globals.getFasiCommesseLavoratore(forms.comm_lav_header_dtl.idlavoratore,
		                                            forms.comm_ore_inserimento_selezione.vDal || forms.comm_ore_inserimento_utente_selezione.vDal,
													forms.comm_ore_inserimento_selezione.vAl || forms.comm_ore_inserimento_utente_selezione.vAl);
	var arrFasi = dsFasi.getColumnAsArray(1);
	fs.addFoundSetFilterParam('iddittacommessafase',globals.ComparisonOperator.IN,arrFasi);
	
	return fs;
}

/**
 * @AllowToRunInFind
 * 
 * Ritorna lo stato della gestione delle ore su commessa :
 * 
 * 0 - non gestita / ore non presenti
 * 1 - consolidata
 * 2 - autorizzata
 * 3 - consolidata ed autorizzata
 * 4 - in fatturazione
 * 5 - consolidata ed in fatturazione (...ha senso?)
 * 6 - autorizzata ed in fatturazione (...ha senso?)
 * 7 - consolidata, autorizzata ed in fatturazione
 * 
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Number} idCommessaFase
 *
 * @properties={typeid:24,uuid:"566811E2-8CB1-4E2A-8074-FAF14BC5E196"}
 */
function getStatoOreFaseCommessa(idLavoratore,giorno,idCommessaFase)
{
	// variabile numerica per l'identificazione dello stato a seconda delle proprietà delle ore
	var stato = 0;
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_ORE);
	if(fs.find())
	{
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(giorno,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = idLavoratore;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.iddittacommessafase = idCommessaFase;
		
		if(fs.search())
		{
			if(fs.consolidato)
				stato += 1;
			if(fs.autorizzato)
				stato += 2;
			if(fs.billable)
				stato += 4;
		}
	}
	
	return stato;
}

/**
 * @AllowToRunInFind
 * 
 * Ritorna true se le ore relative alla fase della commessa nel giorno sono state consolidate,
 * false altrimenti
 * 
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Number} idCommessaFase
 *
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"9E348DE9-E6D7-40CD-BC60-6632F5ABBA0A"}
 */
function isStatoOreFaseCommessaConsolidato(idLavoratore,giorno,idCommessaFase)
{
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_ORE);
	if(fs.find())
	{
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(giorno,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = idLavoratore;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.iddittacommessafase = idCommessaFase;
		
		if(fs.search())
		return fs.consolidato;
	}
	
	return 0;
}

/**
 * @AllowToRunInFind
 * 
 * Consolida le ore su commessa non ancora consolidate per il periodo indicato e per i lavoratori scelti
 * Se indicata la fase della commessa, consoliderà unicamente per la singola fase 
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 * @param {Number} [idFaseCommessa]
 * 
 * @properties={typeid:24,uuid:"9FAEB153-023E-42A7-A68B-18B9306B0102"}
 */
function consolidaStatoOreFaseCommessa(arrLavoratori,dal,al,idFaseCommessa)
{
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_ORE);
	if(fs.find())
	{
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = arrLavoratori;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + 
		                                                             globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
//		fs.consolidato = 0; // le ore già consolidate non vanno considerate
		if(idFaseCommessa)
			fs.commesse_giornaliera_ore_to_commesse_giornaliera.iddittacommessafase = idFaseCommessa;
		                                                             
		var totOreDaConsolidare = fs.search();
		if(totOreDaConsolidare)
		{
			var fsUpdater = databaseManager.getFoundSetUpdater(fs);
			fsUpdater.setColumn('consolidato',1);
			return fsUpdater.performUpdate();
		}
	}
	return false;
}

/**
 * @AllowToRunInFind
 * 
 * Resetta lo stato delle ore su commessa precedentemente consolidate per il periodo indicato e per i lavoratori scelti
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 * @param {Number} [idFaseCommessa]
 *
 * @properties={typeid:24,uuid:"90F355F8-43F7-4F51-921E-6C70A31426CE"}
 */
function resettaStatoOreFaseCommessa(arrLavoratori,dal,al,idFaseCommessa)
{
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_ORE);
	if(fs.find())
	{
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = arrLavoratori;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + 
		                                                             globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
        if(idFaseCommessa)
 		   fs.commesse_giornaliera_ore_to_commesse_giornaliera.iddittacommessafase = idFaseCommessa;
		                                                             
        var totOreDaConsolidare = fs.search();
		if(totOreDaConsolidare)
		{
			var fsUpdater = databaseManager.getFoundSetUpdater(fs);
			fsUpdater.setColumn('consolidato',0);
			return fsUpdater.performUpdate();
		}
	}
	return false;
}

/**
 * @properties={typeid:24,uuid:"B8C30315-AF8E-4C59-ACFD-C910265BEBA2"}
 */
function aggiungi_timbratura_dipendente_commessa()
{
	var form = forms.comm_timbr_commessa_tab;
	globals.ma_utl_setStatus(globals.Status.EDIT,form.controller.getName());
	globals.ma_utl_showFormInDialog(form.controller.getName(),'Inserisci timbratura');
}

/**
 * @param {JSRecord<db:/ma_richieste/ditte_commesse>} record
 * 
 * @properties={typeid:24,uuid:"17B015A5-D7E7-45B4-B963-0332B147AF2D"}
 * @AllowToRunInFind
 */
function validateCommessa(record)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse>} */
	var fs = record.foundset.duplicateFoundSet();
	if (fs && fs.find())
	{
		fs.iddittacommessa = '!=' + record.iddittacommessa;
		fs.codice  		   = 		record.codice;
		fs.idditta 		   = 		record.idditta;
		
		if(fs.search() > 0)
			throw new Error('Il codice ' + fs.codice + ' è già presente per la ditta ' + fs.ditte_commesse_to_ditte.codice);
		
		return true;
	}
	
	return false;
}

/**
 * Restituisce il dataset con le eventuali incongruenze tra le ore di presenza e quelle
 * inserite su commesse
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"8B953FAB-E84B-4BF1-8DCE-78EB9BEE879D"}
 */
function ottieniDatasetIncongruenzeGiornalieraCommesse(arrLavoratori,dal,al)
{
	var sqlInc = "SELECT \
O.IdLavoratore, \
L.Codice, \
P.Nominativo, \
O.Giorno, \
CASE WHEN O.OreLavorate > 0 \
     THEN O.OreLavorate \
	 ELSE 0 \
END AS OreLavorate, \
CASE \
     WHEN K.OreCommessa > 0 \
     THEN K.OreCommessa \
	 ELSE 0 \
END AS OreCommessa, \
O.OreLavorate - OreCommessa AS DifferenzaOre \
FROM \
( \
SELECT \
	G.IdDip AS IdLavoratore, \
    G.Giorno, \
	SUM(CASE \
	        WHEN EC.Tipo = 'S' \
			THEN 0 \
			ELSE CAST(GE.Ore/100. AS decimal(5,2)) \
		END) AS OreLavorate \
	FROM E2Giornaliera G \
    LEFT OUTER JOIN E2GiornalieraEventi GE \
	ON G.IdGiornaliera = GE.idGiornaliera \
	INNER JOIN E2Eventi E \
                  ON GE.IdEvento = E.idEvento \
                  INNER JOIN E2EventiClassi EC \
                  ON E.IdEventoClasse = EC.IdEventoClasse \
	WHERE EC.Tipo IN ('O','A','S') \
	AND G.TipoDiRecord = 'N' \
	GROUP BY G.Giorno,G.IdDip \
) O \
INNER JOIN Lavoratori L \
ON O.IdLavoratore = L.idLavoratore \
INNER JOIN Persone P \
ON L.CodiceFiscale = P.CodiceFiscale \
INNER JOIN \
(SELECT \
   CG.Giorno, \
   SUM(CGO.Ore) AS OreCommessa, \
   CG.idLavoratore \
   FROM \
   Commesse_Giornaliera CG \
   INNER JOIN \
   Commesse_Giornaliera_Ore CGO \
   ON CG.idCommessaGiornaliera = CGO.idCommessaGiornaliera \
   WHERE \
   CG.idLavoratore IN (" + arrLavoratori.map(function(lav){return lav}).join(',') + ") \
   AND \
   CGO.Autorizzato = 1 \
   GROUP BY CG.Giorno,CG.idLavoratore) K \
ON K.Giorno = O.Giorno \
AND K.idLavoratore = O.idLavoratore \
WHERE \
K.idLavoratore IN (" + arrLavoratori.map(function(lav){return lav}).join(',') + ") \
AND O.Giorno BETWEEN ? AND ?";
	
var par = [utils.dateFormat(dal,globals.ISO_DATEFORMAT),
		   utils.dateFormat(al,globals.ISO_DATEFORMAT)];

var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlInc,par,-1);
return ds;


}

/**
 * Procedura per l'inserimento delle ore per la commessa inserite in tabella per il singolo lavoratore
 *
 * @param {Number} idLav
 * @param {String} giornoIso
 * @param {Number} idDittaCommessaFase
 * @param {Number} ore
 * @param {String} proprieta
 * @param {Boolean} [consolidato]
 * @param {Boolean} [autorizzato]
 * @param {Boolean} [billable]
 * 
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"B41D9B3F-F942-41DC-AF8F-E0A8BA4D3CC0"}
 * @AllowToRunInFind
 */
function inserisciOreCommessa(idLav,giornoIso,idDittaCommessaFase,ore,proprieta,consolidato,autorizzato,billable)
{
	/** @type {JSRecord<db:/ma_presenze/commesse_giornaliera_ore>}*/
	var recOre = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_ORE);
	var successOre = false;
	var failedrecords = null;
	
	// verifichiamo se esiste un record per il lavoratore riguardo alla fase della commessa nel giorno inserito
	// ossia nella tabella commesse_giornaliera
	var recGcomm = globals.getGiornalieraCommessa(idLav, giornoIso, idDittaCommessaFase);
	
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>} */
	var fsGiornComm = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_GIORNALIERA);
    if(fsGiornComm.find())
	{
		fsGiornComm.idlavoratore = idLav;
		fsGiornComm.giorno = '#'.concat(giornoIso,'|',globals.ISO_DATEFORMAT);
		fsGiornComm.iddittacommessafase = idDittaCommessaFase;
		
		if(fsGiornComm.search())
			recGcomm = fsGiornComm;
	}
	else return false;

	// se fossimo in presenza di un nuovo inserimento
	if (!recGcomm) 
	{
		// caso "non" inserimento 
		if(ore == null)		
			return true;
		
		// caso inserimento con indicazione del numero di ore
		/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>}*/
		var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
		/** @type {JSRecord<db:/ma_presenze/commesse_giornaliera>}*/
		var recGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
		recGiorn = fsGiorn.getRecord(fsGiorn.newRecord());
		recGiorn.giorno = utils.parseDate(giornoIso,globals.ISO_DATEFORMAT);
		recGiorn.iddittacommessafase = idDittaCommessaFase;
		recGiorn.idlavoratore = idLav;
		
		databaseManager.startTransaction();
		var successGiorn = databaseManager.commitTransaction();//databaseManager.saveData();
		
		if(successGiorn)
		{
			recOre = recGiorn.commesse_giornaliera_to_commesse_giornaliera_ore.getRecord(recGiorn.commesse_giornaliera_to_commesse_giornaliera_ore.newRecord());
		    recOre.ore = ore;
		    if(consolidato != null && consolidato)
		    	recOre.consolidato = 1;
		    else
		    	recOre.consolidato = 0;
		    if(autorizzato != null && autorizzato)
		       recOre.autorizzato = 1;
		    else
		    	recOre.autorizzato = 0;
		    if(billable != null && billable)
		       recOre.billable = 1;
		    else 
		    	recOre.billable = 0;				
		    
		    databaseManager.startTransaction();
		    successOre = databaseManager.commitTransaction();//databaseManager.saveData();
		}
		
		if(!(successGiorn && successOre))
		{
		   failedrecords = databaseManager.getFailedRecords();
		   if (failedrecords && failedrecords.length > 0)
		   {//	   throw new Error('<html>Inserimento ore commessa non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.</html>');
		       globals.ma_utl_showErrorDialog('Inserimento non riuscito di : ' + failedrecords,'Inserimento ore commesse lavoratore');
			   databaseManager.rollbackTransaction();
		       return false;
		   }
		}
		
		return true;
	}
	else
	{
		// se il record è già esistente (ore precedentemente inserite) e lo stiamo cancellando
		if(recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore && ore == null)
		{
			if(!recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore.deleteRecord() || !recGcomm.commesse_giornaliera_to_commesse_giornaliera.deleteRecord())
			{
				globals.ma_utl_showErrorDialog('Eliminazione di : ' + failedrecords + ' non riuscita','Inserimento ore commesse lavoratore');
				databaseManager.rollbackTransaction();
		        return false;
			}
			
			return true;
		}
		// se il record è già esistente (ore precedentemente inserite) allora sovrascriviamo il valore eventualmente modificato
		else if(recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore.getSize() != 0)
			recOre = recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore.getSelectedRecord();
		// altrimenti creiamo un nuovo record
		else
			recOre = recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore.getRecord(recGcomm.commesse_giornaliera_to_commesse_giornaliera_ore.newRecord());
		
		recOre.ore = ore;
		if(consolidato != null && consolidato)
	    	recOre.consolidato = 1;
	    else
	    	recOre.consolidato = 0;
		if(autorizzato != null && autorizzato)
		    recOre.autorizzato = 1;
		else
			recOre.autorizzato = 0
		    
		if(billable != null && billable)
		    recOre.billable = 1;
		else
			recOre.billable = 0;
		
		databaseManager.startTransaction();
		successOre = databaseManager.commitTransaction();//databaseManager.saveData();
		
		if (!successOre) {
			failedrecords = databaseManager.getFailedRecords();
			if (failedrecords && failedrecords.length > 0)
			{
				globals.ma_utl_showErrorDialog('Inserimento non riuscito di : ' + failedrecords,'Inserimento ore commesse lavoratore');
				databaseManager.rollbackTransaction();
		        return false;
			}
		}
		return true;
	}

}

/**
 * Restituisce il valore delle ore già presenti per la commessa
 * riguardo al lavoratore nel giorno selezionato
 *
 * @param {Number} idDittaCommessa
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 *
 * @properties={typeid:24,uuid:"ABE167E5-D6ED-465A-96B1-656FDD2D7184"}
 * @AllowToRunInFind
 */
function getOreGiornoDipendenteCommessa(idDittaCommessa, idLavoratore, giorno, soloConsolidate, soloAutorizzate, soloFatturabili) {
	var totOreCommGiornoDip = null;
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_commesse_fasi>} */
	var fsCommFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE_COMMESSE_FASI);
	if (fsCommFasi.find()) {
		fsCommFasi.iddittacommessa = idDittaCommessa;
		if (fsCommFasi.search()) {
			for (var f = 1; f <= fsCommFasi.getSize(); f++) {
				totOreCommGiornoDip += getOreGiornoDipendenteFaseCommessa(fsCommFasi.getRecord(f).iddittacommessafase,
																		  idLavoratore,
																		  giorno,
																		  soloConsolidate,
																		  soloAutorizzate,
																		  soloFatturabili);
			}
		}
	}

	return totOreCommGiornoDip;
}

/**
 * Recupera, se esiste, il record della tabella Commesse_giornaliera per il lavoratore selezionato nel giorno selezionato
 * per la specifica commessa
 * 
 * @param {Number} idLavoratore
 * @param {String} giornoIso
 * @param {Number} idFaseCommessa
 *
 * @return {JSRecord<db:/ma_presenze/commesse_giornaliera>}
 *  
 * @properties={typeid:24,uuid:"9DBE6BE3-5A9D-4880-8AE7-9943F87D4E01"}
 * @AllowToRunInFind
 */
function getGiornalieraCommessa(idLavoratore,giornoIso,idFaseCommessa)
{
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>} */
	var fsGiornComm = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.COMMESSE_GIORNALIERA);
	if(fsGiornComm.find())
	{
		fsGiornComm.idlavoratore = idLavoratore;
		fsGiornComm.giorno = '#'.concat(giornoIso,'|',globals.ISO_DATEFORMAT);
		fsGiornComm.iddittacommessafase = idFaseCommessa;
		
		if(fsGiornComm.search())
			return fsGiornComm.getSelectedRecord();
	}
	
	return null;
}

/**
 * Restituisce il dataset con le ore su commessa da autorizzare e non ancora autorizzate
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 *
 * @properties={typeid:24,uuid:"D6ACACA4-7B0E-4641-9B73-C7700BB32857"}
 */
function ottieniDatasetOreCommesseDaAutorizzare(arrLavoratori,dal,al)
{
	var sqlDaAuth = "SELECT \
CGO.idCommessaGiornalieraOre, \
CGO.idCommessaGiornaliera, \
CGO.Ore, \
DCF.idDittaCommessaFase, \
CG.idLavoratore \
FROM Commesse_Giornaliera_Ore CGO \
INNER JOIN Commesse_Giornaliera CG \
ON CGO.idCommessaGiornaliera = CG.idCommessaGiornaliera \
INNER JOIN Ditte_Commesse_Fasi DCF \
ON CG.idDittaCommessaFase = DCF.idDittaCommessaFase \
INNER JOIN Ditte_Commesse DC \
ON DCF.idDittaCommessa = DC.idDittaCommessa \
WHERE DCF.DaAutorizzare = 1 \
AND CGO.Autorizzato = 0 \
AND CG.idLavoratore IN (" + arrLavoratori.map(function(lav){return lav}).join(',') + ")";

	var par = []; 
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlDaAuth,par,-1);
	return ds;
}

/**
 * Restituisce le commesse attive e selezionabili per il lavoratore valide tra i giorni dal ed al
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"3E0BC631-E389-4673-B97B-CC894B4BCE75"}
 */
function getFasiCommesseLavoratore(idLavoratore,dal,al)
{
	var sqlCommLav = "SELECT DCF.idDittaCommessaFase,'[' + DC.Codice + '] ' + DCF.CodiceFase + ' - ' + DCF.DescrizioneFase AS Descrizione \
                      FROM Ditte_Commesse_Fasi DCF \
                      INNER JOIN Ditte_Commesse DC \
                      ON DC.idDittaCommessa = DCF.idDittaCommessa \
                      WHERE (DC.InizioValidita IS NULL OR DC.InizioValidita <= ?) \
                      AND (DC.FineValidita IS NULL OR DC.FineValidita >= ?) \
                      AND (DC.Terminata IS NULL OR DC.Terminata = 0) \
                      AND (DCF.InizioValiditaFase IS NULL OR DCF.InizioValiditaFase <= ?) \
                      AND (DCF.FineValiditaFase IS NULL OR DCF.FineValiditaFase >= ?) \
                      AND (DCF.Terminata IS NULL OR DCF.Terminata = 0) \
                      AND (DCF.idDittaCommessaFase IN \
                      (SELECT DISTINCT idDittaCommessaFase FROM Lavoratori_Commesse \
                       WHERE idLavoratore = ?))";
	
	var arrComLav = [al,dal,al,dal,idLavoratore];
	
	var dsComLav = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlCommLav,arrComLav,-1);
		
	return dsComLav;
}

/**
 * Restituisce le commesse attive e selezionabili per il lavoratore valide tra i giorni dal ed al
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"637D0C1B-EE1D-42B2-BAC2-4A03851A1BE2"}
 */
function getCommesseLavoratore(idLavoratore,dal,al)
{
	var sqlCommLav = "SELECT DC.idDittaCommessa,DC.Codice + ' - ' + DC.Descrizione AS Descrizione \
                      FROM Ditte_Commesse_Fasi DCF \
                      INNER JOIN Ditte_Commesse DC \
                      ON DC.idDittaCommessa = DCF.idDittaCommessa \
                      WHERE (DC.InizioValidita IS NULL OR DC.InizioValidita <= ?) \
                      AND (DC.FineValidita IS NULL OR DC.FineValidita >= ?) \
                      AND (DC.Terminata IS NULL OR DC.Terminata = 0) \
                      AND (DCF.InizioValiditaFase IS NULL OR DCF.InizioValiditaFase <= ?) \
                      AND (DCF.FineValiditaFase IS NULL OR DCF.FineValiditaFase >= ?) \
                      AND (DCF.Terminata IS NULL OR DCF.Terminata = 0) \
                      AND (DCF.idDittaCommessaFase NOT IN \
                      (SELECT DISTINCT idDittaCommessaFase FROM Lavoratori_Commesse) \
                       OR DCF.idDittaCommessaFase IN \
                      (SELECT DISTINCT idDittaCommessaFase FROM Lavoratori_Commesse \
                       WHERE idLavoratore = ?))";
	
	var arrComLav = [utils.dateFormat(al,globals.ISO_DATEFORMAT),
	                 utils.dateFormat(dal,globals.ISO_DATEFORMAT),
	                 utils.dateFormat(al,globals.ISO_DATEFORMAT),
	                 utils.dateFormat(dal,globals.ISO_DATEFORMAT),
					 idLavoratore];
	
	var dsComLav = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlCommLav,arrComLav,-1);
		
	return dsComLav;
}

/**
 * Restituisce il numero di ore lavorate su commesse dal lavoratore selezionato 
 * nel giorno selezionato
 * 
 * @param {Date} giorno
 * @param {Number} idLavoratore
 * @param {Number} [soloConsolidate]
 * @param {Number} [soloAutorizzate]
 *
 * @properties={typeid:24,uuid:"EBF465AE-41D0-45F4-A4EF-B6A08F3FBEE9"}
 * @AllowToRunInFind
 */
function getTotOreCommesseGiornoDipendente(giorno,idLavoratore,soloConsolidate,soloAutorizzate)
{
	var totOreCommDip = 0;
	
	/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera_ore>}*/
	var fsOre = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_ORE);
	if(fsOre.find())
	{
		fsOre.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = giorno;
		fsOre.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = idLavoratore;
		
		if(soloConsolidate)
			fsOre.commesse_giornaliera_ore_to_commesse_giornaliera_ore.consolidato = 1;
		
		if(soloAutorizzate)
			fsOre.commesse_giornaliera_ore_to_commesse_giornaliera_ore.autorizzato = 1;
		
		if(fsOre.search())
		{
			var size = fsOre.getSize();
			for(var i = 1; i <= size; i++)
			    totOreCommDip += fsOre.getRecord(i).ore;
			
		}
	}
	
	return totOreCommDip;
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Date} _dal
* @param {Date} _al
* @param {Array<Number>} _arrIdLavoratori
* 
* @properties={typeid:24,uuid:"E39D0AA1-1655-4FF4-816C-056AFBFD3BD8"}
* @AllowToRunInFind
*/
function gestisciAutorizzazioneCommesseDaMenu(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_dal,_al,_arrIdLavoratori)
{
	gestioneAutorizzazioneCommesse(_dal,_al,_arrIdLavoratori);
}

/**
 * @AllowToRunInFind
 * 
 * Apre la finestra per la gestione delle autorizzazioni e/o fatturazione delle varie commesse
 * 
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} arrIdLavoratori
 *
 * @properties={typeid:24,uuid:"BE09E8CB-211C-41F4-92E5-2427F199BEFE"}
 */
function gestioneAutorizzazioneCommesse(dal,al,arrIdLavoratori)
{
	var frm = forms.giorn_comm_auth_giornalieraore_tab;
	var fs = frm.foundset;
	var frmTbl = forms.giorn_comm_auth_giornalieraore_tbl;
	
	// la visualizzazione delle colonne di autorizzazione per presenze e per fatturazione
	// è legata al possesso delle rispettive chiavi da parte dell'utente loggato
	frmTbl.elements.fld_autorizzato.visible = globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA);
	frmTbl.elements.fld_billable.visible = globals.ma_utl_hasKey(globals.Key.COMMESSE_FATTURA);
	
	fs.find();
	fs.consolidato = 1; // consideriamo solamente le ore consolidate
	fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = arrIdLavoratori;
	fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = utils.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' +
	                                                             utils.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
	fs.search();                                                            
	
	fs.sort('commesse_giornaliera_ore_to_commesse_giornaliera.giorno asc');
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frmTbl.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Gestione autorizzazione commesse');
}

/**
 * Compila la giornaliera dei dipendenti per i giorni selezionati
 * a partire dalle ore su commessa presenti (ed eventualmente autorizzate)
 * 
 * @param {Array} employeesId
 * @param {Array} arrayGiorni
 *
 * @properties={typeid:24,uuid:"0131453F-726D-4A41-BCAD-061EBFF0DC8E"}
 */
function compilaDalAlCommesse(employeesId, arrayGiorni)
{
	try
	{
		var idDitta = globals.getDittaTab();
		var periodo = globals.getPeriodo();
		
		var values = 
		{
			op_hash		: utils.stringMD5HashBase64(idDitta.toString() + periodo.toString() + new Date()),
			op_ditta	: idDitta,
			op_message	: 'Inizio compilazione da ore su commessa',
			op_periodo 	: periodo
		};
		
		globals.startAsyncOperation
		(
		  globals.compilaGiorniDaCommesse
		  ,[
		      employeesId
			  ,arrayGiorni
			  ,idDitta
			  ,periodo
		   ]
		  ,null
		  ,null
		  ,globals.OpType.CGC
		  ,values
		);
		
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex)
	}
}

/**
 * Metodo che si occupa di effettuare le due macro-operazioni per la compilazione a partire 
 * dalle ore su commessa :
 * 1 - compilazione teorica (il compila dal...al... standard)
 * 2 - ciclo su lavoratori e giorni per l'inserimento degli eventi relativi al delta di orario (straordinari o assenze)
 *  
 * @param {Array<Number>} employeesId
 * @param {Array<Number>} arrayGiorni
 * @param {Number} idDitta
 * @param {Number} periodo
 * @param {JSRecord<db:/ma_log/operationlog>} operation
 *
 * @properties={typeid:24,uuid:"9AB18D7C-F1FB-4CB2-8957-AD0339696E87"}
 */
function compilaGiorniDaCommesse(employeesId,arrayGiorni,idDitta,periodo,operation)
{
	try
	{
		var anno = globals.getAnnoDaPeriodo(periodo);
		var mese = globals.getMeseDaPeriodo(periodo);
		var idEv;
		var propEv;
		var oreEv;
		
		// inizializzazione parametri per la compilazione
		var params = globals.inizializzaParametriCompila
        (
	          idDitta
	      	  ,periodo
			  ,globals.TipoGiornaliera.NORMALE
			  ,globals.TipoConnessione.CLIENTE
			  ,arrayGiorni
			  ,employeesId
         );
		
		// lancio del calcolo per la compilazione teorico 
		var url = WS_EVENT + "/Calendar32/CompilaDalAlSingoloSync"
		
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesId, idDitta,periodo))
			return;
		
		var objResp = globals.getWebServiceResponse(url, params);
		if(objResp.ReturnValue == false)
			throw new Error('Compilazione teorica non effettuata correttamente!');
		
		databaseManager.startTransaction();
		operation.op_progress = 50;
		operation.op_message = 'Compilazione teorica terminata, completamento con eventi di assenza od aggiuntivi';
		databaseManager.commitTransaction();
		
		for(var l = 0; l < employeesId.length; l++)
		{
			var op_msg = globals.getNominativo(employeesId[l]);
			var arrGiorniFestivi = [];
			var arrFestivitaDip = globals.getFestivitaDipendente(globals.getDitta(employeesId[l]),
				                                                 employeesId[l],
																 anno * 100 + mese);
			for(var f = 0; f < arrFestivitaDip.length; f++)
				arrGiorniFestivi.push(new Date(anno, mese - 1, arrFestivitaDip[f]));
			
			for(var g = 0; g < arrayGiorni.length; g++)
			{
				var currGiorno = new Date(anno, mese - 1, arrayGiorni[g]);
				var isFestivo = arrGiorniFestivi.indexOf(currGiorno) != -1;
				
				var oreTeo = (globals.ottieniOreTeoricheGiorno(employeesId[l], currGiorno) / 100);
				var oreComm = globals.getTotOreCommesseGiornoDipendente(currGiorno, employeesId[l],1);
				
				op_msg += ' - ' + globals.dateFormat(currGiorno,globals.EU_DATEFORMAT);
				databaseManager.startTransaction();
				operation.op_message = 'Inserimento eventi dipendente : ' + op_msg;
				databaseManager.commitTransaction();
				
				if(oreComm == null)
				oreComm = 0;
			
				if (oreComm > oreTeo || oreComm > 0 && isFestivo) 
				{
					// evento aggiuntivo da inserire : LS (D) per dipendente part time, S (D) per dipendente full time
					// in futuro potrebbe essere lo straordinario da definire 672 oppure direttamente l'evento indicato come
					// da generare per la specifica commessa
					// evento aggiuntivo da inserire : LS (D) per dipendente part time, S (D) per dipendente full time
					// in futuro potrebbe essere lo straordinario da definire 672 oppure direttamente l'evento indicato come
					// da generare per la specifica commessa
					if(getPercentualePartTime(employeesId[l]) != 0)
						idEv = 602 //681; // LSD lavoro supplementare da definire
					else
						idEv = 480 //672; // SD straordinario da definire 
						
					var arrProp = globals.getProprietaSelezionabili(idEv,employeesId[l],periodo,arrayGiorni[g],globals.TipoGiornaliera.NORMALE).ReturnValue;	
					propEv = globals.getCodiceProprieta(arrProp);
					oreEv = isFestivo ? oreComm : oreComm - oreTeo;
				}
				else
				{
					var oreSostBudget = globals.getTotaleOreSostitutiveInBudget(employeesId[l],currGiorno,currGiorno);
					// TODO PD solamente se previsto, altrimenti F/ROL
					idEv = 630;
					propEv = '';
					oreEv = oreTeo - (oreComm + oreSostBudget);
					oreEv > 0 ? oreEv : 0;
				}
				
				if(oreEv != 0)
				{
					params = globals.inizializzaParametriEvento
					         (
					        	idDitta
								, periodo
								, [arrayGiorni[g]]
								, globals.TipoGiornaliera.NORMALE
								, globals.TipoConnessione.CLIENTE
								, [employeesId[l]]
								, idEv
								, propEv
								, oreEv
								, 0
								, -1
								, ''
								, 0);
				
					globals.salvaEvento(params);
				}
				
			}
		}
		
		databaseManager.startTransaction();
		operation.op_status = globals.OpStatus.SUCCESS;
		operation.op_end = new Date();
		operation.op_progress = 100;
		operation.op_message = 'Compilazione eventi da ore su commesse in giornaliera terminata';
		databaseManager.commitTransaction();
		
		forms.mao_history_main_lite.elements.lbl_op_confirm.enabled = true;
		forms.mao_history_lite.elements.lbl_prog_fg.setSize(400,20);
		forms.mao_history_lite.elements.lbl_prog_fg.bgcolor = globals.Colors.ATTENDANT.background;
			
	}
	catch(ex)
	{
		databaseManager.startTransaction();
		operation.op_status = globals.OpStatus.ERROR;
		operation.op_end = new Date();
		operation.op_progress = 100;
		operation.op_message = 'Errore durante la compilazione di eventi in giornaliera terminata';
		databaseManager.commitTransaction();
		
		forms.mao_history_main_lite.elements.lbl_history_msg.visible = true;
		
		application.output(ex.message, LOGGINGLEVEL.ERROR);
	}
}

/**
 * Restituisce il periodo a cui corrisponde il primo mese di gestione delle presenze 
 * 
 * @param {Number} idDitta
 *
 * @return Number
 * 
 * @properties={typeid:24,uuid:"1457A755-4F7E-400C-97DA-74C62E565481"}
 * @AllowToRunInFind
 */
function getPeriodoInizialeGestionePresenze(idDitta)
{
	/** @type{JSFoundSet<db:/ma_anagrafiche/ditte_presenze>} */
	var fsPres = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'ditte_presenze');
	if(fsPres.find())
	{
		fsPres.idditta = idDitta;
		if(fsPres.search())
			return fsPres.ore_iniziogestione;
	}
	return null;
}

/**
 * Restituisce il periodo a cui corrisponde l'ultimo mese di gestione delle presenze 
 * 
 * @param {Number} idDitta
 *
 * @return Number
 * 
 * @properties={typeid:24,uuid:"DF6F04CE-6C5E-4358-AA84-B1807C9FE015"}
 * @AllowToRunInFind
 */
function getPeriodoFinaleGestionePresenze(idDitta)
{
	/** @type{JSFoundSet<db:/ma_anagrafiche/ditte_presenze>} */
	var fsPres = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'ditte_presenze');
	if(fsPres.find())
	{
		fsPres.idditta = idDitta;
		if(fsPres.search())
			return fsPres.ore_finegestione;
	}
	return null;
}

/**
 * Restituisce il dataset per il confronto tra le ore inserite in giornaliera
 * e quelle inserite come ore su commessa nei giorni che intercorrono tra dal e al
 * 
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 *
 * @properties={typeid:24,uuid:"59688EAE-0B35-47E9-87C3-7ED76220BD67"}
 */
function ottieniDatasetOreGiornalieraOreCommessa(arrLavoratori,dal,al)
{
	var sqlOre = 'SELECT \
	              G.IdDip AS IdLavoratore, \
                  L.Codice, \
                  P.Nominativo, \
 	              G.Giorno, \
	              SUM(CAST(GE.Ore/100 AS decimal(5,2))) AS OreGiornaliera, \
	              K.OreCommessa AS OreCommessa, \
	              SUM( \
		             CASE WHEN GE.Ore > 0 \
		             THEN \
 			         CAST(GE.Ore/100 AS decimal(5,2)) \
		             ELSE \
			         0 \
		             END \
		             ) - \
		             CASE WHEN K.OreCommessa >= 0 \
		             THEN K.OreCommessa \
		             ELSE 0 \
		             END \
		             AS DifferenzaOre \
		             FROM E2Giornaliera G \
                     INNER JOIN Lavoratori L \
                     ON G.idDip = L.idLavoratore \
                     INNER JOIN \
                     Persone P \
                     ON L.CodiceFiscale = P.CodiceFiscale \
                     LEFT OUTER JOIN E2GiornalieraEventi GE \
                     ON G.IdGiornaliera = GE.idGiornaliera \
                     INNER JOIN E2Eventi E \
                     ON GE.IdEvento = E.idEvento \
                     INNER JOIN E2EventiClassi EC \
                     ON E.IdEventoClasse = EC.IdEventoClasse \
                     LEFT OUTER JOIN \
                     (SELECT \
                          CG.Giorno, \
                          SUM(CGO.Ore) AS OreCommessa \
                      FROM \
                          Commesse_Giornaliera CG \
                      INNER JOIN \
                          Commesse_GiornalieraOre CGO \
                      ON CG.idCommessaGiornaliera = CGO.idCommessaGiornaliera \
                      WHERE CG.idLavoratore IN (' + arrLavoratori.join(',') +') \
                      GROUP BY CG.Giorno) K \
                      ON K.Giorno = G.Giorno \
                      WHERE G.idDip IN (' + arrLavoratori.join(',') + ') \
                      AND G.Giorno BETWEEN ? AND ? \
                      AND G.TipoDiRecord = \'N\' \
                      AND EC.Tipo IN (\'O\',\'A\') \
                      GROUP BY G.IdDip,G.TipoDiRecord,G.Giorno,K.OreCommessa,GE.Ore,L.Codice,P.Nominativo \
                 HAVING ( \
                      SUM( \
		                  CASE WHEN GE.Ore > 0 \
		                       THEN	CAST(GE.Ore/100 AS decimal(5,2)) \
		                       ELSE	0 \
                          END \
                    	) - \
		                CASE WHEN K.OreCommessa >= 0 \
		                     THEN K.OreCommessa \
		                     ELSE 0 \
		                END) <> 0'
	

	var arrOre = [utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT)];
	var dsOre = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlOre,arrOre,-1);
	return dsOre;
}