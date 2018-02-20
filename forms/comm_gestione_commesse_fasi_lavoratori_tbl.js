
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"20581F29-A7A1-4F73-8ADE-0A5F4E22D3F6"}
 */
function eliminaLavoratoreFaseCommessa(event) 
{
	if(foundset.lavoratori_commesse_to_commesse_giornaliera.commesse_giornaliera_to_commesse_giornaliera_ore)
	{
		globals.ma_utl_showWarningDialog('Il lavoratore ha delle ore inserite per la fase visualizzata.<br/>\
		                                 L\'associazione non può essere eliminata','Elimina lavoratore per la fase');             
	    return;
	}
	
	if(!foundset.deleteRecord())
	{
		globals.ma_utl_showWarningDialog('Associazione non eliminata, si prega di riprovare','Elimina lavoratore per la fase');
	    return;
	}
	
	var answer = globals.ma_utl_showYesNoQuestion('Inviare una mail per informare il dipendente?','Elimina lavoratore per la fase');
	if(answer)
	{
		// recupera i valori di oggetto e testo del messaggio iniziale
		var userId = globals.getUserIdFromIdLavoratore(idlavoratore,_to_sec_user$user_id.owner_id.toString());
		
		if(userId)
		{
			var msg = 'plain msg<html><head></head><body>Gentile <b>' + globals.getNominativo(idlavoratore) + '</b>,<br/>'
			msg += 'con la presente la informiamo che è stato rimosso dalla seguente fase : <br/><br/><b><i>';
			msg += lavoratori_commesse_to_ditte_commesse_fasi.descrizionefase + '<br/>';
			msg += '</i></b><br/> relativa alla commessa : <br/><br/><b><i>';
			msg += lavoratori_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.descrizione;
			msg += '</i></b><br/><br/>';
			msg += '</i></b><br/> facente capo al cliente : <br/><br/><b><i>';
			msg += lavoratori_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_to_ditte.ragionesociale;
			msg += '</i></b><br/><br/>';
			if(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori && _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore)
			   msg += ' da parte del signor ' + globals.getNominativo(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore) + '.<br/><br/>';
			msg += '<br/>';
			msg += 'Cordiali saluti.';
			msg += '</body></html>';
			
			// invio comunicazione
			var userMail = globals.getMailUtente(userId);
			if(userMail == '')
			{
				globals.ma_utl_showWarningDialog('L\'utente non ha associato un indirizzo mail.','Elimina lavoratore per la fase');
				return;
			}
			if(!plugins.mail.isValidEmailAddress(userMail))
			{
				globals.ma_utl_showWarningDialog('L\'utente non ha associato un indirizzo mail valido.','Elimina lavoratore per la fase');
				return;
			}
			var vOggetto = 'Gestione commesse - ' + lavoratori_commesse_to_ditte_commesse_fasi.descrizionefase;
			globals.sendMailAdviceToUser(userMail,vOggetto,msg,'Comunicazione gestione commesse <assistenza@studiomiazzo.it>');
			
		}
		else
			globals.ma_utl_showWarningDialog('Il lavoratore non ha associato un utente! Controllare la gestione utenze.','Elimina lavoratore per la fase');
	}
	
    var frmLav = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	
	var enableLav = foundset.getSize();	

	frmLav.elements.btn_lavoratori_elimina.enabled =
	  frmLav.elements.btn_lavoratori_info.enabled = enableLav;
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3B37C8DD-8528-4E96-8D74-411CCFF8338D"}
 */
function onActionAlertLavoratore(event) 
{
	// recupera i valori di oggetto e testo del messaggio iniziale
	var userId = globals.getUserIdFromIdLavoratore(idlavoratore,_to_sec_user$user_id.owner_id.toString());
	
	if(userId)
	{
		var msg = 'plain msg<html>Gentile <b>' + globals.getNominativo(idlavoratore) + '</b>,<br/>'
		msg += 'con la presente la informiamo che le è stata commissionata la seguente fase : <br/><br/><b><i>';
		msg += lavoratori_commesse_to_ditte_commesse_fasi.descrizionefase + '<br/>';
		msg += '</i></b><br/> relativa alla commessa : <br/><br/><b><i>';
		msg += lavoratori_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.descrizione;
		msg += '</i></b><br/><br/>';
		msg += '</i></b><br/> facente capo al cliente : <br/><br/><b><i>';
		msg += lavoratori_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_to_ditte.ragionesociale;
		msg += '</i></b><br/><br/>';
		if(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori && _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore)
		   msg += ' da parte del signor ' + globals.getNominativo(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore) + '.<br/><br/>';
		if(lavoratori_commesse_to_ditte_commesse_fasi.iniziovaliditafase)
		   msg += 'La fase potrà avere inizio dal giorno ' + globals.dateFormat(lavoratori_commesse_to_ditte_commesse_fasi.iniziovaliditafase,globals.EU_DATEFORMAT) + '.<br/>';
		if(lavoratori_commesse_to_ditte_commesse_fasi.finevaliditafase)
		   msg += 'La fase dovrà essere portata a termine entro il giorno ' + globals.dateFormat(lavoratori_commesse_to_ditte_commesse_fasi.finevaliditafase,globals.EU_DATEFORMAT) + '.<br/>';
		if(lavoratori_commesse_to_ditte_commesse_fasi.monteorefase)
		   msg += 'Il monte ore è stato impostato a ' + lavoratori_commesse_to_ditte_commesse_fasi.monteorefase + ' ore di lavoro.'	
		msg += '<br/>';
		msg += 'Cordiali saluti.';
		msg += '</html>';
		
		// visualizzazione della finestra di gestione del testo ed invio
		var frm = forms.comm_alert;
		var userMail = globals.getMailUtente(userId);
		if(userMail == '')
		{
			globals.ma_utl_showWarningDialog('L\'utente non ha associato un indirizzo mail.','Invia comunicazione al lavoratore');
			return;
		}
		if(!plugins.mail.isValidEmailAddress(userMail))
		{
			globals.ma_utl_showWarningDialog('L\'utente non ha associato un indirizzo mail valido.','Invia comunicazione al lavoratore');
			return;
		}
		frm.vDestinatario = userMail;
		frm.vOggetto = 'Gestione commesse - ' + lavoratori_commesse_to_ditte_commesse_fasi.descrizionefase;
		frm.vMessaggio = msg;
		
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Invia comunicazione al lavoratore');
	}
	else
		globals.ma_utl_showWarningDialog('Il lavoratore non ha associato un utente! Controllare la gestione utenze.','Invia comunicazione al lavoratore');
}
