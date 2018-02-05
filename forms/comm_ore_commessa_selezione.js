/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"A8DB4BDA-A62F-4A33-BE69-383D124881A5",variableType:93}
 */
var vDal = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"DF961E2F-E215-43E3-82F9-D9348292EB66",variableType:93}
 */
var vAl = null;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B287537A-E648-4493-BB00-7FB92EF19EC5"}
 */
var vCommesse = '';
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"21542A9A-AA61-4F35-AB2D-8954510FAA5E",variableType:8}
 */
var vIdDitta = null;
/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"0713D1B7-AD24-47AF-AB1E-66C25ADEBF75",variableType:-4}
 */
var vArrLavoratori = [];
/**
 * @type {Array<Date>}
 * 
 * @properties={typeid:35,uuid:"B09214B9-C9C8-40E8-A2AF-105A44591495",variableType:-4}
 */
var vArrFestivita = [];
/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"0DD37D96-487B-4DB2-8842-6193A8EA3131",variableType:-4}
 */
var vArrCommesseFasi = [];
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DA853C9F-1248-4519-8CF4-C8D8A8CC4BB2"}
 */
function annullaSelezionePeriodoCommesse(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * @param {Boolean} [showWarning]
 * 
 * @properties={typeid:24,uuid:"4A1E1717-3668-4540-8F54-1D764CFDE527"}
 */
function validaSelezioneOpzioni(showWarning)
{
	if(vDal == null && vAl == null && vArrCommesseFasi.length == 0)
		return false;
	
	if(!vDal || !vAl)
	{
		globals.ma_utl_showWarningDialog('Inserire entrambe le date di inizio e fine del periodo','Opzioni per inserimento ore');
		return false;
	}
	
	if(vDal > vAl)
	{
		globals.ma_utl_showWarningDialog('La data di inizio non può superare la data di fine del periodo','Opzioni per inserimento ore');
		return false;
	}
	
	if(showWarning && vArrCommesseFasi.length == 0)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno una tra le commesse presenti','Opzioni per inserimento ore');
		return false;
	}
	
	return true;
}

/**
 * Aggiorna la visualizzazione delle fasi delle commesse selezionate per l'inserimento
 * 
 * @param {Array<JSRecord<db:/ma_anagrafiche/ditte_commesse_fasi>>} _recs
 *
 * @properties={typeid:24,uuid:"DFEFF909-1206-4B6C-A662-1199E670F23D"}
 */
function updateDitteCommesseFasi(_recs)
{ 
	vCommesse = '';
//	vArrCommesseFasi = _recs;
	for (var c = 0; c < _recs.length; c++)
	{
		 vCommesse += ('(' + globals.getCodiceClienteDaIdFase(_recs[c].iddittacommessafase) + ') ' +
				       '[' + globals.getCodiceCommessaDittaDaIdFase(_recs[c].iddittacommessafase) + 
				       '] ' + globals.getCodiceFaseCommessaDitta(_recs[c].iddittacommessafase) +
		               ' - ' + globals.getDescrizioneFase(_recs[c].iddittacommessafase) + '\n');
	}
}

/**
 *
 * @param event
 *
 * @properties={typeid:24,uuid:"FBCA1B05-57CB-46E6-8CDA-1D02C5FC8AE8"}
 */
function onHide(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
   _super.onHide(event)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"30BDE60B-8A7F-40FF-B69F-73A942C8B8B8"}
 */
function confermaSelezionePeriodoCommesse(event) 
{
	// TODO cosa dovrebbe fare?!?
	globals.ma_utl_showWarningDialog('Under construction...');
}