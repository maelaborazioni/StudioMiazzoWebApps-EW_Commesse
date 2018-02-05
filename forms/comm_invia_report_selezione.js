/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8F843A72-61D2-4CF2-BB47-947A8216D508",variableType:8}
 */
var vMeseDal = null//globals.TODAY.getMonth() + 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"43153404-63D2-41A7-B288-4E72B0B65C61",variableType:8}
 */
var vMeseAl = null//globals.TODAY.getMonth() + 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E4E10EE1-5202-4CB1-8BA5-626E03302EFD",variableType:4}
 */
var vAnnoDal = null//globals.TODAY.getFullYear();
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4F773ABB-67D4-43C5-8FAE-661DE1CBEE0C",variableType:4}
 */
var vAnnoAl = null//globals.TODAY.getFullYear();
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"49D13E3A-C09B-4162-AF45-1A5242333C29"}
 */
function onActionConferma(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	var vDal = new Date(vAnnoDal,vMeseDal - 1,1);
	var vAl = new Date(vAnnoAl, vMeseAl - 1, globals.getTotGiorniMese(vMeseAl,vAnnoAl));
	
	var params = {event : event,
				  lookup : 'AG_Lkp_Lavoratori',
				  methodToAddFoundsetFilter : 'FiltraLavoratoriCommesseFasiPeriodo',
				  multiSelect : true,
				  allowInBrowse : true};

	var arrLavSel = globals.ma_utl_showLkpWindow(params);
	
	for(var l = 0; l < arrLavSel.length; l++)
	{
		var bytes = scopes.comm_reports.createReportMensileLavoratore(arrLavSel[l]
		                                                              ,vDal
																	  ,vAl);
		var mailAttachment = plugins.mail.createBinaryAttachment('ore_commesse.pdf',bytes);
		var userId = globals.getUserIdFromIdLavoratore(arrLavSel[l],_to_sec_owner$owner_id.owner_id.toString());
		if(userId)
		{
			var mailAddress = globals.getMailUtente(userId);
			var msgText = "plain msg<html>";
			msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
			msgText += "<body>Gentile utente, <br/> in allegato la situazione delle ore su commessa "
			msgText += "relativo al periodo che va dal giorno " + utils.dateFormat(vDal,globals.EU_DATEFORMAT) + " al giorno " + utils.dateFormat(vAl,globals.EU_DATEFORMAT);
			msgText += ".<br/> Comunicare al responsabile la correttezza dei dati o le eventuali modifiche da apportare."
			msgText += "</body></html>";
			var success = plugins.mail.sendMail(mailAddress
								                ,'Gestione commesse <assistenza@studiomiazzo.it>'
												,'Rapporto ore inserite Gestione Commesse'
												,msgText
												,null
												,null
												,mailAttachment
												,globals.setSendGridSmtpProperties());
			
			if(!success)
				globals.ma_utl_showWarningDialog('Impossibile recapitare al dipendente : ' + globals.getNominativo(arrLavSel[l]),'Invio report situazione commesse');
    
		}
	}
    globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 * 
 * @properties={typeid:24,uuid:"B214736F-3833-4373-B5BD-EC3DC38500E4"}
 */
function onActionAnnulla(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"28FDAAA5-6B9B-4B77-BD9D-BBE9004F93A6"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	
	var frm = forms.comm_ore_inserimento_selezione;
	vAnnoDal = frm.vDal.getFullYear();
	vAnnoAl = frm.vAl.getFullYear();
	vMeseDal = frm.vDal.getMonth() + 1;
	vMeseAl = frm.vAl.getMonth() + 1;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
