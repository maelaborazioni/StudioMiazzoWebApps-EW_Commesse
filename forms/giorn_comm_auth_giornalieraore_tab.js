/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"08BF3E61-6DF3-4B1F-A720-BF8AA63E79E3"}
 */
function onActionAnnullaAutorizzazione(event)
{
	// rollback transazioni e modalità browse
	databaseManager.rollbackTransaction();
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_comm_auth_giornalieraore_tbl.controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A5D50516-ABA2-4CBE-B7EE-BAFE06E77B9B"}
 */
function onActionConfermaAutorizzazione(event) 
{
	try
	{
		// update delle ore su commessa con il nuovo valore dello stato di autorizzazione 
		var success = databaseManager.commitTransaction(); 
		if(!success)
		{
			var failedrecords = databaseManager.getFailedRecords();
			if (failedrecords && failedrecords.length > 0)
			{
				for(var f = 0; f < failedrecords.length; f++)
					application.output(failedrecords[f].exception.getErrorCode() + ' - ' + failedrecords[f].exception.getMessage(),LOGGINGLEVEL.WARNING);
				
				throw new Error('Errore durante la conferma delle autorizzazioni.');
			}
			
		}
	}
	catch(ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
	finally
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_comm_auth_giornalieraore_tbl.controller.getName());
		globals.svy_mod_closeForm(event);
		var idLavoratore = forms.comm_lav_header_dtl.idlavoratore;
		var frmSel = forms.comm_ore_inserimento_selezione;
		var vDal = frmSel.vDal;
		var vAl = frmSel.vAl;
		globals.preparaInserimentoOreCommesseLavoratore(event, idLavoratore, frmSel.vArrCommesseFasi, vDal, vAl, frmSel.vArrFestivita);
		globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event, idLavoratore, frmSel.vArrCommesseFasi, vDal, vAl, frmSel.vArrFestivita);
	}
		
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C75E198D-0501-4A65-93D9-C62808EE06C0"}
 */
function onHide(event)
{
	return onActionAnnullaAutorizzazione(event);
}
