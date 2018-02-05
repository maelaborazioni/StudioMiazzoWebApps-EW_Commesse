/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AAD79956-A6B0-4B24-94EE-11DBE9BC2975"}
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
 * Consolida le ore il cui campo 'Consolidato' è stato selezionato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"46651F0C-06C7-459C-8029-A2D96503903F"}
 */
function onActionConfermaConsolidamento(event) 
{
	var params = {
        processFunction: process_conferma_consolidamento_ore,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"FFC0CEF3-13E2-4ECD-9917-D6467FEC774B"}
 */
function process_conferma_consolidamento_ore(event)
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
		databaseManager.rollbackTransaction();
		var msg = 'Metodo process_conferma_consolidamento_ore : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_comm_auth_giornalieraore_tbl.controller.getName());
		globals.svy_mod_closeForm(event);
		var idLavoratore = forms.comm_lav_header_dtl.idlavoratore;
		var frmSel = forms.comm_ore_inserimento_selezione;
		var vArrCommesseFasi = frmSel.vArrCommesseFasi;
		var vArrFestivita = frmSel.vArrFestivita;
		var vDal = frmSel.vDal;
		var vAl = frmSel.vAl;
		globals.preparaInserimentoOreCommesseLavoratore(event, idLavoratore, vArrCommesseFasi, vDal, vAl, vArrFestivita);
		globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event, idLavoratore, vArrCommesseFasi, vDal, vAl, vArrFestivita)
	    plugins.busy.unblock();
	}
		
}

/**
 * Invia al dipendente la comunicazione inerente alle ore non ancora consolidate per il periodo selezioanto
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B9020665-CB47-480D-A655-2DF6A903B602"}
 */
function onActionAlertOreDaConsolidare(event)
{
	// TODO raccolta informazioni ed invio comunicazione
	globals.ma_utl_showInfoDialog('Under construction...');
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3F822978-67CF-4DD4-AF7C-7A0B46B1DD06"}
 */
function onHide(event)
{
	return onActionAnnullaAutorizzazione(event);
}

/**
*
* @param {Boolean} _firstShow
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"C5EFC2DD-4C5E-42B5-930A-0E64B7C9C679"}
*/
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.giorn_comm_cons_giornalieraore_tbl.controller.getName());
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
