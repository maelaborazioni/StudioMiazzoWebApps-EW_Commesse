/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"820E6C4F-5698-418D-9A52-E28EE94B2640"}
 */
function annullaInserimento(event)
{
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"74D95F99-BAB8-4E14-8C54-56646972ADD5"}
 */
function confermaInserimento(event) 
{
	// TODO Auto-generated method stub
	var frmSel = forms.comm_ore_inserimento_selezione;
	var frm = forms['comm_ore_lavoratore_commesse_tbl'];
	var fs = frm.foundset;
	var arrCommesseFasi = frmSel.vArrCommesseFasi;
	var currRec;
	for(var g = 1; g <= fs.getSize(); g++)
	{
		currRec = fs.getRecord(g);
		for (var c = 0; c < arrCommesseFasi.length; c++)
			if(currRec['commessa_' + arrCommesseFasi[c]])
				globals.inserisciOreCommessa(forms.comm_lav_header_dtl.idlavoratore
					                        ,utils.dateFormat(currRec['giorno'],globals.ISO_DATEFORMAT)
											,arrCommesseFasi[c]
											,currRec['commessa_' + arrCommesseFasi[c]]
											,'D');
	}
	
	globals.svy_mod_closeForm(event);
}
