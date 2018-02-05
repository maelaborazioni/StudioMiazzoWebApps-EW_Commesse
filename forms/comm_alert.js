/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FCF07044-0AAC-4975-8C11-162B1F940F32"}
 */
var vDestinatario = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D7FCF312-A2A4-4F38-983E-02C32EEE9A64"}
 */
var vOggetto = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"557035EF-37DC-47A7-B9A4-621AEBD9DC4A"}
 */
var vMessaggio = '';


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FEABBD8E-D74F-4729-81F0-BC1DA5780319"}
 */
function onActionAnnulla(event)
{
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
 * @properties={typeid:24,uuid:"FB439C88-ACFC-4F63-AF81-FD14358ECD2A"}
 */
function onActionConferma(event)
{
	// gestione invio comunicazione inerente la fase della commessa
	globals.sendMailAdviceToUser(vDestinatario,vOggetto,vMessaggio,'Presenza Semplice Studio Miazzo - Comunicazione gestione commesse <assistenza@studiomiazzo.it>');
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"8F5D1A75-1E6E-4BB8-A3ED-626F12DAE17A"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
