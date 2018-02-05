/**
 * @properties={typeid:24,uuid:"1DCFB33E-3C48-44BA-8C9D-6C962F530CEC"}
 */
function getButtonObject()
{
	var _enabled = idditta == null ? 1 : globals.getTipologiaDitta(idditta);
		
	var btnObj = _super.getButtonObject();
	
		btnObj.btn_new = { visible: _enabled, enabled: _enabled };
		btnObj.btn_edit = { visible: _enabled, enabled: _enabled };
		btnObj.btn_delete = { visible: _enabled, enabled: _enabled };
		btnObj.btn_duplicate = { visible: false, enabled: false };
		
	return btnObj;
}

/** 
 * @param _event
 * @param _triggerForm
 *
 * @properties={typeid:24,uuid:"CB23A59B-B809-4748-891F-DD0658CB36B9"}
 */
function dc_new(_event, _triggerForm)
{
	var frm = forms.agd_ditta_cliente;
	frm._tipologiaDitta = globals.Tipologia.CLIENTE;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Nuova anagrafica cliente');
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"9B25314F-AED4-427B-A025-C8600A833D48"}
*/
function dc_edit(_event, _triggerForm, _forceForm)
{
   return _super.dc_edit(_event, _triggerForm, _forceForm)
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
* @param {Boolean} _noConfirm
*
* @properties={typeid:24,uuid:"D331355E-7186-4ADD-B557-D9F80C57B7B7"}
*/
function dc_delete(_event, _triggerForm, _forceForm, _noConfirm)
{
	return _super.dc_delete(_event, _triggerForm, _forceForm, _noConfirm)
}
/**
 *
 * @param {JSEvent} event
 * @param _form
 *
 * @properties={typeid:24,uuid:"2D525731-C77B-45F6-82FC-CC9CB3403DB2"}
 */
function onRecordSelection(event, _form) 
{
	var frm = forms.comm_gestione_commesse_tab;
	
	frm.elements.btn_edit_commessa.enabled = 
		frm.elements.btn_delete_commessa.enabled = 
		    frm.elements.btn_add_fase_commessa.enabled =
		    ditte_to_ditte_commesse ? ditte_to_ditte_commesse.getSize() : 0;

	 
	frm.elements.btn_edit_fase_commessa.enabled =
		frm.elements.btn_delete_fase_commessa.enabled = 
		ditte_to_ditte_commesse &&
		ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi != null ? ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.getSize() : 0;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8A76F336-6A85-43F4-826F-8207665CBCF6"}
 * @AllowToRunInFind
 */
function onActionBtnAnagraficaDitta(event)
{
	var frm = forms.comm_ditta_anagrafica//forms.agd_da_dati_giuridici_dtl;
	frm.foundset.find();
	frm.foundset.idditta = idditta;
	frm.foundset.search();
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Dati anagrafici ditta cliente');
}
