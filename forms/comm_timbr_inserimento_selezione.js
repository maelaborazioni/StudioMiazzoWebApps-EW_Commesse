/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"C0ADD4B5-53E7-4ED4-A58E-4D46D3CA46B2",variableType:93}
 */
var vData = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"06FC1AAC-D17E-4EB3-AE53-D4564085C6D7",variableType:8}
 */
var vIdDittaCommessa = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D3AC794C-A215-4327-A675-2EAAE2B8FC99"}
 */
var vDittaCommessa = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 * 
 * @properties={typeid:24,uuid:"9AC3FC1B-F84E-4B3E-8E15-A300544D61EC"}
 */
function confermaSelezioneRefresh(event) 
{
	if(validaSelezioneOpzioni(true))
	   globals.preparaInserimentoOreCommesseLavoratore(event,
		                                               forms.comm_lav_header_dtl.idlavoratore,
													   vArrCommesseFasi,
													   vDal,
													   vAl,
													   vArrFestivita);
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"5D11F47C-D90A-437B-8A12-6F7F460185F0"}
 */
function updateDittaCommessa(rec)
{
	vDittaCommessa = rec['codice'] + ' - ' + rec['descrizione'];
}
