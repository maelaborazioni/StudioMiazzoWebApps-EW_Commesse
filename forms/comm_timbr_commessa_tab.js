/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"A5F9D482-44EF-449A-99E3-2ADCFF31DD22",variableType:8}
 */
var vIdLavoratore = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"3985CFAC-187D-4750-B577-B80CC3B00993",variableType:8}
 */
var vIdCommessa = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"76FDD81C-789F-43FC-9E72-7E88B6B87E35",variableType:8}
 */
var vIdCommessaFase = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"C340ED2C-7DBF-488F-AB52-5A159CA1D40E",variableType:93}
 */
var vGiorno = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A44BE351-AAA8-440F-962A-A0C0A93C2E40"}
 */
function annullaInserimento(event) {
		
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());

	// Rollback dei record inseriti
	databaseManager.rollbackTransaction();
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D77178D7-8D1E-4DB5-9D89-B88428249E5B"}
 */
function confermaInserimento(event) {
	
	// Valida e salva le timbrature inserite come nuove o modificate 
	var editedRecords = databaseManager.getEditedRecords();//getEditedRecords(foundset.commesse_giornaliera_to_commesse_giornalieratimbrature);
	for(var r = 0; r < editedRecords.length; r++)
	{
		var rec = editedRecords[r];
		application.output(rec,LOGGINGLEVEL.ERROR)
		switch(globals.validaInserimentoTimbraturaCommesse(vIdLavoratore
			                                               ,rec['idcommessagiornaliera']
			                                               ,rec['timbratura']
			                                               ,rec['senso']))
		{
			case 0:
				if(!databaseManager.saveData(rec))
					setStatusError('Timbratura ' + rec['timbratura'] + 'non inserita!',null,1000);
				else
				{
					setStatusSuccess('Timbratura ' + rec['timbratura'] + 'inserita correttamente',null,1000);
					globals.svy_mod_closeForm(event);
				}
				break;
			case 1:
				setStatusWarning('Controllare che tutti i campi necessari siano compilati',null,1000);
			    break;
		    case 2:
		    	setStatusWarning('Esiste già una timbratura con questi valori!',null,1000);
			    break;
		    default:
			    break;
		}
	}
	
	elements.btn_conferma_inserimento.enabled = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F219F997-0650-46A7-A0AC-71E99AEDC4E4"}
 */
function aggiungiNuovaTimbrMulti(event)
{
	databaseManager.setAutoSave(false);

	if(foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.newRecord() == -1)
    {
    	setStatusError('Errore durante la creazione della nuova timbratura per la commessa',null,1000);
        return;
    }
    
    foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.senso = 0;
	foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.timbratura = new Date(vGiorno);
	foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.badge = globals.getNrBadge(vIdLavoratore,vGiorno);
	 
	if(foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.getSize())
	 elements.btn_conferma_inserimento.enabled = true;
	else
	 elements.btn_conferma_inserimento.enabled = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"23532233-2A08-4068-AD9E-346A308CFD40"}
 */
function eliminaTimbrMulti(event) {
	
	// Elimina la timbratura selezionata
    if(!foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.deleteRecord())
    	globals.ma_utl_showWarningDialog('Timbratura non eliminata', 'Eliminazione timbratura commessa');
	if(foundset.commesse_giornaliera_to_commesse_giornaliera_timbrature.getSize())
		 elements.btn_conferma_inserimento.enabled = true;
	 else
		 elements.btn_conferma_inserimento.enabled = false;
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2B6C4FA8-7C4D-4269-AD92-16995B1A6D46"}
 * @AllowToRunInFind
 */
function onActionRefresh(event) 
{
	var idGiornalieraCommessa = null;
	var recGcomm = globals.getGiornalieraCommessa(vIdLavoratore,utils.dateFormat(vGiorno,globals.ISO_DATEFORMAT),vIdCommessaFase);
	if(!recGcomm)
	{
		/** @type {JSFoundset<db:/ma_presenze/commesse_giornaliera>}*/
		var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
		/** @type {JSRecord<db:/ma_presenze/commesse_giornaliera>}*/
		var recGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
		recGiorn = fsGiorn.getRecord(fsGiorn.newRecord());
		recGiorn.giorno = vGiorno;
		recGiorn.iddittacommessafase = vIdCommessaFase;
		recGiorn.idlavoratore = vIdLavoratore;
		
		var successGiorn = databaseManager.saveData(recGiorn);    
	    if(!successGiorn)
	    {
	    	setStatusError('Errore durante la creazione del nuovo record giornaliera commessa',null,1000)
	  	 	return;
	    }
	    else
	       	idGiornalieraCommessa = recGiorn.idcommessagiornaliera;
	}
	else
		idGiornalieraCommessa = recGcomm.idcommessagiornaliera;
	
	if(foundset.find())
	{	
	   foundset.idcommessagiornaliera = idGiornalieraCommessa;
	   elements.btn_add_timbr.enabled = true;
	   var numTimbr = foundset.search();
	   if(numTimbr > 0)
		   elements.btn_remove_timbr.enabled = true;
	}
	else
	{
		globals.ma_utl_showWarningDialog('Cannot go to find mode','Selezione timbrature commessa');
		return;
	}
}

/**
 *
 * @param event
 *
 * @properties={typeid:24,uuid:"6AC53E9E-6AFC-4F22-9159-4F52376FAE8D"}
 */
function onHide(event) 
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	_super.onHide(event);
}

/**
*
* @param {Boolean} firstShow
* @param {JSEvent} event
* @param {Boolean} svyNavBaseOnShow
*
* @properties={typeid:24,uuid:"75E8CF40-A3B3-41D0-A9DE-1985A2782503"}
*/
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	vIdLavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	vGiorno = globals.TODAY;
	if(vIdCommessa && vIdCommessaFase)
		elements.btn_add_timbr.enabled = elements.btn_remove_timbr.enabled = true;
	else
		elements.btn_add_timbr.enabled = elements.btn_remove_timbr.enabled = false;
}



/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3BB2022C-9D23-4EB3-B064-A2407B75B4BF"}
 * @AllowToRunInFind
 */
function onDataChangeCommessa(oldValue, newValue, event) 
{
	var arrFasi = [];
	var arrFasiDesc = [];
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_commesse_fasi>}*/
	var fsFasi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'ditte_commesse_fasi');
	if(fsFasi.find())
	{
		fsFasi.iddittacommessa = vIdCommessa;
		var numFasi = fsFasi.search();
		application.output('Fasi : ' + numFasi)
		if(numFasi)
		{			
			for(var f = 1; f <= numFasi; f++)
			{
			    arrFasi.push(fsFasi.getRecord(f).iddittacommessafase);
			    arrFasiDesc.push(fsFasi.getRecord(f).codicefase + ' - ' + fsFasi.getRecord(f).descrizionefase);
			}
		}
	}
	
	application.setValueListItems('vls_commesse_fasi',arrFasiDesc,arrFasi);
	
	return true;
}

/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A4480CB0-80F3-4BFA-8028-C9D35DBA71E8"}
 */
function onDataChangeData(oldValue, newValue, event) 
{
	// TODO viene modificata la visualizzazione delle timbrature su commessa relative al giorno!!!
	return true
}
