
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"92C9E30D-6E3D-4F94-9110-CFBED01B5D8D"}
 */
function onActionAnnulla(event) 
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5414E7B9-5F75-467E-9F04-9018F1579BC1"}
 */
function onActionConferma(event) 
{
	var frmSel = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? forms.comm_ore_inserimento_selezione 
			                                                           : forms.comm_ore_inserimento_utente_selezione;
	
	if(!databaseManager.commitTransaction())
	{
		application.output(databaseManager.getFailedRecords());
    	databaseManager.rollbackTransaction();
    	globals.ma_utl_showWarningDialog('Consolidamento ore non riuscito');
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
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
													true,
													frmSel.dxEvComm);
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"5F50CD57-E269-4ADD-A16D-4B3EE773B290"}
*/
function onHide(event)
{
	onActionAnnulla(event);
}

/**
*
* @param {Boolean} _firstShow
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"B83523C3-FA7A-408E-B1BD-2FE801E96C80"}
*/
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	if(!globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE))
	{
		globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
		databaseManager.startTransaction();
	}	
}
