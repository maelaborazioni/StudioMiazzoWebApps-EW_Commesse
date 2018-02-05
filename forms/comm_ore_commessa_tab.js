/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9A3EB6A3-CB00-4ED4-A35D-25E2F0964695"}
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
 * @properties={typeid:24,uuid:"1337D25F-ACE7-4023-9BA0-768DC600A632"}
 */
function confermaInserimento(event) 
{
	var frmSel = forms.comm_ore_commessa_selezione;
	var frm = forms['comm_ore_lavoratore_commesse_tbl'];
	var fs = frm.foundset;
	var arrCommesseFasi = frmSel.vArrCommesseFasi;
	var currRec;
	for(var g = 1; g <= fs.getSize(); g++)
	{
		currRec = fs.getRecord(g);
		for (var c = 0; c < arrCommesseFasi.length; c++)
		{
			if(currRec['commessa_' + arrCommesseFasi[c]])
			{
				for(var l = 0; l < frmSel.vArrLavoratori.length; l++)
				{
				globals.inserisciOreCommessa(frmSel.vArrLavoratori[l]
					                        ,utils.dateFormat(currRec['giorno'],globals.ISO_DATEFORMAT)
											,arrCommesseFasi[c]
											,currRec['commessa_' + arrCommesseFasi[c]]
											,'D');
				}
			}
		}
	}
	
	globals.svy_mod_closeForm(event);
}

