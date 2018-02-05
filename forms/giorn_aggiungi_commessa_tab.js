
/**
 *
 * @param {JSEvent} _event
 * @param {String} _triggerForm
 * @param {Boolean} _noConfirm
 *
 * @properties={typeid:24,uuid:"8A727CCB-0C41-48BA-89F4-EE4F76A1A092"}
 */
function dc_cancel(_event, _triggerForm, _noConfirm) {
	return _super.dc_cancel(_event, _triggerForm, _noConfirm)
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
* @param {Boolean} _noConfirm
*
* @properties={typeid:24,uuid:"97ED12A9-7D26-42CE-BEDD-CBC5B68C9301"}
*/
function dc_delete(_event, _triggerForm, _forceForm, _noConfirm) {
	return _super.dc_delete(_event, _triggerForm, _forceForm, _noConfirm)
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"C89BF1E7-BE06-4F6D-BCBF-C78BEAAAEABB"}
*/
function dc_edit(_event, _triggerForm, _forceForm) {
	return _super.dc_edit(_event, _triggerForm, _forceForm)
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"39C10572-6A9E-4CB8-9C89-DC13EC11A781"}
*/
function dc_new(_event, _triggerForm, _forceForm) {
	
	_super.dc_new(_event, _triggerForm, _forceForm);
	foundset.comportamentoesterne = 0;
	foundset.seguelatimbraturapresenza = 0;
	foundset.ideventodagenerare = null;
	foundset.note = null;
	foundset.comportamentointermedie = 0;
	foundset.generapausa = 0;
	foundset.arrminuti = 0;
	foundset.arrdifetto = 0;
	foundset.causaliorologio = "0";
	foundset.volte = 0;
	foundset.listapresentiassenti = 0;
	
	return 
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"A0F2F7BE-67B9-4284-BBDA-484B22FF9FDE"}
*/
function dc_save(_event, _triggerForm, _forceForm) {
	return _super.dc_save(_event, _triggerForm, _forceForm)
}
