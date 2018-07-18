/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"304B5AAD-E138-4FE2-920C-918AC7B5F833",variableType:8}
 */
var vIdDittaCommessa = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"FF178191-6AFC-400D-87CF-110ED7CF2E3E",variableType:93}
 */
var vTimbratura = null;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5B94F78A-9E35-4673-A5B0-C970575C469F",variableType:8}
 */
var vSenso = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"93A83ED8-A613-4A70-8DB0-A9BD32F0843A",variableType:8}
 */
var vBadge = null;

/** 
 * @param _firstShow
 * @param _event
 * 
 * @properties={typeid:24,uuid:"ADAF1587-8E66-425D-AF74-F50C2C278A90"}
 */
function onShowForm(_firstShow, _event) 
{ 	
	//inizializzazione valori della form
	vSenso = 0;
	vTimbratura = globals.TODAY;
	vBadge = globals.getNrBadge(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore,vTimbratura);
		
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	
}

/**
 * Annulla l'inserimento della timbratura inserita per la commessa
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"66ADBF5B-45B6-4B81-8F7C-E5D0FD4EEF68"}
 */
function annullaInserimento(event) 
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Salva la timbratura inserita per la commessa
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"32A62156-C7CB-4EFD-A9DA-69852EA75F74"}
 */
function confermaInserimento(event) 
{
	try {
		var giorno = new Date(vTimbratura.getFullYear(), vTimbratura.getMonth(), vTimbratura.getDate());
		var idLav = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
        
		/** @type {JSRecord<db:/ma_presenze/commesse_giornaliera_timbrature>}*/
		var recTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_TIMBRATURE);
		var successTimbr = false;
		
		// verifichiamo se esiste un record per il lavoratore riguardo alla commessa nel giorno inserito
		var recGcomm = globals.getGiornalieraCommessa(idLav, utils.dateFormat(giorno,globals.ISO_DATEFORMAT), idcommessagiornaliera);

		if (!recGcomm) {
			/** @type {JSFoundSet<db:/ma_presenze/commesse_giornaliera>}*/
			var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
			/** @type {JSRecord<db:/ma_presenze/commesse_giornaliera>}*/
			var recGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.COMMESSE_GIORNALIERA);
			recGiorn = fsGiorn.getRecord(fsGiorn.newRecord());
			recGiorn.giorno = giorno;
			recGiorn.idlavoratore = idLav;
			
			var successGiorn = databaseManager.saveData(recGiorn);
			if(successGiorn)
			{
				recTimbr = recGiorn.commesse_giornaliera_to_commesse_giornaliera_timbrature.getRecord(recGiorn.commesse_giornaliera_to_commesse_giornaliera_timbrature.newRecord());
			    recTimbr.badge = vBadge;
			    recTimbr.senso = vSenso;
			    recTimbr.timbratura = vTimbratura;
			    successTimbr = databaseManager.saveData(recTimbr);
			}
			
			if(!(successGiorn && successTimbr))
			{
			   var failedrecords = databaseManager.getFailedRecords();
			   if (failedrecords && failedrecords.length > 0)
				   throw new Error('Inserimento timbrature commessa non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.');
			   databaseManager.rollbackTransaction();
			}
		} else 
		{
			recTimbr = recGcomm.commesse_giornaliera_to_commesse_giornaliera_timbrature.getRecord(recGcomm.commesse_giornaliera_to_commesse_giornaliera_timbrature.newRecord());
		    recTimbr.badge = vBadge;
		    recTimbr.senso = vSenso;
		    recTimbr.timbratura = vTimbratura;
		    
			var validaTimbrature = globals.validaInserimentoTimbraturaCommesse(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
					, recGcomm.idcommessagiornaliera
					, vTimbratura
					, vSenso);

			switch (validaTimbrature) {
			case 0:
				// gestione inserimento timbrature valide
			    successTimbr = databaseManager.saveData(recTimbr);
			    if (!successTimbr) {
					var failedrecord = databaseManager.getFailedRecords();
					if (failedrecord && failedrecord.length > 0)
						throw new Error('Inserimento timbrature commessa non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.');
				    databaseManager.rollbackTransaction();
				}
			case 1:
				globals.ma_utl_showWarningDialog('>Controllare che tutti i campi necessari siano compilati', 'Inserimento timbratura commessa');
				break;
			case 2:
				globals.ma_utl_showWarningDialog('Esiste giÃ  una timbratura con questi valori!', 'Inserimento timbratura commessa');
				break;
			default:
				break;
			}
	
		}
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		globals.svy_mod_closeForm(event);
		
	} catch (ex) {
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
}



/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AB07B0A0-2270-4B73-BC9E-775EEB5BF6AF"}
 */
function onActionInfo(event) {

	globals.ma_utl_showInfoDialog('Under construction...');
}

/**
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D27F3CC7-9828-452D-B044-6E198F550E6C"}
 */
function onDataChangeTimbratura(oldValue, newValue, event)
{
	if(newValue != null)
	{
		if(event.getFormName() == 'comm_timbr_commessa_dtl')
		   elements.btn_conferma_inserimento.enabled = true;
		
		return true;
		
	}
	else
	{
		if(event.getFormName() == 'comm_timbr_commessa_dtl')
		   elements.btn_conferma_inserimento.enabled = false;
	    
		return false;
		
	}
}