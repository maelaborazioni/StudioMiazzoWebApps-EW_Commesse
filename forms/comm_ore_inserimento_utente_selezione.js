/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"419E68E2-AC62-481A-A065-C179F3959D12",variableType:8}
 */
var vSettimana = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"FCA9F0FE-F009-4C66-BA6D-52E622E4D99C",variableType:8}
 */
var vAnno = null;
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
 * @properties={typeid:24,uuid:"2E7D18A4-A1C3-44DC-9F39-346B84C482E4"}
 */
function onDataChangeSettimana(oldValue, newValue, event) 
{
	vDal = globals.getDateOfISOWeek(vSettimana,vAnno);
	vAl = new Date(vDal.getFullYear(), vDal.getMonth(), vDal.getDate() + 6);
	
	// aggiornamento commesse selezionabili
	var dsCommLav = globals.getFasiCommesseLavoratore(forms.comm_lav_header_dtl.idlavoratore,vDal,vAl);
	var arrCommLav = dsCommLav.getColumnAsArray(1);
	vArrCommesseFasi = arrCommLav;
	updateDitteCommesseFasi(arrCommLav);
	
	return true;
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5EA45C21-BBBF-4B59-9567-719C0E301F53"}
 */
function onActionGoToEdit(event) 
{
	_super.onActionGoToEdit(event)
	elements.btn_annulla_inserimento.enabled = true;
	elements.btn_refresh.enabled = true;
	elements.btn_edit.enabled = false;
	
	elements.fld_dal.enabled = elements.fld_al.enabled = true;
//	elements.cmb_settimana.enabled = true;
	elements.btn_lkp_commesse.enabled = true;
	
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.enabled = false;
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.toolTipText = 'Non sarà possibile inserire valori prima di aver selezionato periodo e commesse da inserire';
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());	
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"2E48E6BC-42FF-4EC6-8CD0-EE1817F1D284"}
*/
function onActionAnnulla(event) 
{
	elements.btn_annulla_inserimento.enabled = false;
	elements.btn_refresh.enabled = false;
	elements.btn_edit.enabled = true;
	elements.fld_dal.enabled = false;
	elements.fld_al.enabled = false;
	
//	elements.cmb_settimana.enabled = false;
//	elements.btn_lkp_commesse.enabled = false;
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"A77D3E9B-DCC5-4F2C-977F-6A55B8F229CD"}
*/
function confermaSelezioneRefresh(event) 
{
	_super.confermaSelezioneRefresh(event);
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
 * @properties={typeid:24,uuid:"04F0DC2D-6227-4E8F-91A3-6C8F6B1B66C4"}
 */
function onDataChangeAnno(oldValue, newValue, event)
{
	var primoGgSett;
	var ultimoGgSett;
	var arrSett = [];
	var arrDescSett = [];
	var numSett = globals.getNumSettimaneAnno(newValue);
	
	for(var sett = 1; sett <= numSett; sett++)
	{
		primoGgSett = globals.getDateOfISOWeek(sett,newValue);
		ultimoGgSett = new Date(primoGgSett.getFullYear(),primoGgSett.getMonth(),primoGgSett.getDate() + 6);
		arrSett.push(sett);
		arrDescSett.push('Settimana ' + sett + ' - dal ' + globals.dateFormat(primoGgSett,'dd/MM') + 
			             ' al ' + globals.dateFormat(ultimoGgSett,'dd/MM'));
	}
	application.setValueListItems('vls_settimane',arrDescSett,arrSett); 
	vSettimana = 1;
	vDal = globals.getDateOfISOWeek(vSettimana,vAnno);
	vAl = new Date(vDal.getFullYear(), vDal.getMonth(), vDal.getDate() + 6);
	
	return true;
}

