/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"65038B8A-F479-48D8-AB13-DBA85E101EA8",variableType:93}
 */
var vDal = null;

/**
 * @type {Date}
 *  
 * @properties={typeid:35,uuid:"38C32AE3-28A2-40C8-B901-658E787FFA01",variableType:93}
 */
var vAl = null;
/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"0928D49C-1138-4C5F-AEB7-D007B3424C19",variableType:-4}
 */
var vArrClienti = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"23898461-FBC2-47EB-B510-C6C74B5A66A7",variableType:4}
 */
var vChkSoloDatiFatturazione = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"ADBBD661-86D6-4FBF-9FE2-40B2E3400F1D",variableType:4}
 */
var vChkDettaglioFasi = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8A6015C2-F711-4F61-B791-200BD9FB3880",variableType:4}
 */
var vChkDettaglioSituazioneOre = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"28868CC7-524D-40AC-BE67-CEF80DBEEB87"}
 */
var vClienti = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"287EFDE0-E88E-46BB-978B-0D4A08F9737B",variableType:4}
 */
var vFormat = 0;

/**
 * Aggiorna la visualizzazione dei clienti selezionati per il report
 * 
 * @param {Array<JSRecord<db:/ma_anagrafiche/ditte>>} _recs
 *
 * @properties={typeid:24,uuid:"B7CA2C98-34CB-4B0D-8807-6787EBEE67AB"}
 */
function updateClienti(_recs)
{ 
	vClienti = '';
	vArrClienti = [];
	vArrClienti = _recs;
	for (var c = 0; c < _recs.length; c++)
		vClienti += (globals.getCodDitta(_recs[c].idditta) + ' - ' + globals.getRagioneSociale(_recs[c].idditta) + '\n');
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AB96977E-89B2-4980-BFD6-AC4E3A943F00"}
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
 * @properties={typeid:24,uuid:"BEEC0AAA-DD01-44B9-BB98-0D77E36F1A4D"}
 */
function onActionConferma(event) 
{
	var params = {
        processFunction: process_report_riepilogo_ore,
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
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8C223EE2-BD4E-4120-8BF6-9C206586163E"}
 */
function process_report_riepilogo_ore(event)
{
	try
	{
		// lancio dei reports
		switch(vFormat)
		{
			case 0: // report
				if(vChkSoloDatiFatturazione) // solo i dati con la somma delle ore fatturabili
				{
					if(vChkDettaglioFasi) 
						scopes.comm_reports.exportReportRiepilogoFasiDalAlFatturazione(vDal,vAl,vArrClienti);	
					else 
						scopes.comm_reports.exportReportRiepilogoDalAlFatturazione(vDal,vAl,vArrClienti);
				}
				else // tutto l'insieme di dati sulle ore
				{
					if(vChkDettaglioFasi) 
						scopes.comm_reports.exportReportRiepilogoFasiDalAl(vDal,vAl,vArrClienti);	
					else 
						scopes.comm_reports.exportReportRiepilogoDalAl(vDal,vAl,vArrClienti);
				}
				break;
			    
			case 1: // excel
				if(vChkSoloDatiFatturazione)
				{
					if(vChkDettaglioFasi)
					   scopes.comm_reports.createExcelRiepilogoFasiDalAlFatturazione(vDal,vAl,vArrClienti);
					else
						scopes.comm_reports.createExcelRiepilogoDalAlFatturazione(vDal,vAl,vArrClienti);
				}
				else
				{
					if(vChkDettaglioFasi)
					   scopes.comm_reports.createExcelRiepilogoFasiDalAl(vDal,vAl,vArrClienti);
					else
	                   scopes.comm_reports.createExcelRiepilogoDalAl(vDal,vAl,vArrClienti);
				}
				break;
			    
			default:
				break;
		}
		
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_chiusura_mese : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"C806B00E-4815-4533-A4A0-BB3B2F0C25E0"}
 * @AllowToRunInFind
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	plugins.busy.prepare();
	
	if(firstShow)
	{
		var today = globals.TODAY;
		vDal = new Date(today.getFullYear(),today.getMonth(),1);
		vAl = today;
	}	
	
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
	if(fs.find())
	{
		fs.tipologia = globals.Tipologia.CLIENTE;
		fs.search();
		vArrClienti = globals.foundsetToArray(fs,'idditta');
		vClienti = '';
	}
		
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"B1C437AD-D0E2-4BF1-A4B5-9FD1E85BF7B1"}
*/
function onHide(event)
{
	onActionAnnulla(event);
}