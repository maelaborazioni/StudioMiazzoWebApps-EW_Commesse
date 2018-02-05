/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"656AF9ED-C2B6-4DD5-944C-20D5656F5468"}
 * @AllowToRunInFind
 */
function onActionBtnLavoratoriFasi(event) 
{
	var recDittaCommessaFase = foundset.getSelectedRecord(); 

	// identificativo della fase della commessa 
    var idDittaCommessaFase = recDittaCommessaFase.iddittacommessafase;
    
    // array dei lavoratori già associati alla commessa
    var arrLavAss = globals.getLavoratoriAssociatiFasiCommesse([idDittaCommessaFase]);
    
    // selezione dei possibili nuovi lavoratori da associare alla commessa 
    globals.ma_utl_showLkpWindow({
                                   event : event,  
                                   lookup : 'AG_Lkp_Lavoratori',
                                   methodToAddFoundsetFilter : 'FiltraLavoratoriFaseCommessa',
                                   multiSelect : true,
                                   disabledElements : arrLavAss,
								   methodToExecuteAfterMultipleSelection : 'updateLavoratoriFaseCommessa'
                                  }); 

}

/**
 * Filtra i lavoratori associabili alla fase della commessa
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"44DE183E-275C-4471-A743-70174D121ADF"}
 */
function FiltraLavoratoriFaseCommessa(fs)
{
	if(foundset.ditte_commesse_fasi_to_ditte_commesse.iddittaesclusiva)
	   fs.addFoundSetFilterParam('idditta','=',foundset.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_esclusivo_ditta_to_ditte.idditta);
	
	fs.addFoundSetFilterParam('cessazione','=',null);
	
	return fs;
}

/**
 * Aggiorna la selezione dei lavoratori associati alla fase della commessa
 * 
 * @param _recs
 *
 * @properties={typeid:24,uuid:"749EC3C6-0F3A-45CA-AF58-EECC88987012"}
 */
function updateLavoratoriFaseCommessa(_recs)
{
	application.output('updateLavoratoriFaseCommessa')
	var fs = foundset;
	for(var r = 1; r <= _recs.length; r++)
	{
		var rec = fs.ditte_commesse_fasi_to_lavoratori_commesse.getRecord(fs.ditte_commesse_fasi_to_lavoratori_commesse.newRecord()); 
			//foundset.ditte_commesse_fasi_to_lavoratori_commesse.getRecord(foundset.ditte_commesse_fasi_to_lavoratori_commesse.newRecord());
	    rec.idlavoratore = _recs[r - 1];
	}
	
	var frmLav = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	frmLav.elements.btn_lavoratori_commessa.enabled = true;
	
	var enableLav = fs.ditte_commesse_fasi_to_lavoratori_commesse.getSize();	

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
 * @properties={typeid:24,uuid:"AB5DAAE3-2866-4141-8486-24ACF89013EE"}
 * @AllowToRunInFind
 */
function onActionBtnEliminaLavoratoriCommessa(event) 
{
	var fs = foundset.ditte_commesse_fasi_to_lavoratori_commesse;
	if(fs && fs.find())
	{
		fs.iddittacommessafase = foundset.iddittacommessafase;
		if(fs.search())
		{
			if(fs.lavoratori_commesse_to_commesse_giornaliera.commesse_giornaliera_to_commesse_giornaliera_ore)
			{
				globals.ma_utl_showWarningDialog('Alcuni lavoratori hanno delle ore inserite per la fase visualizzata.<br/>\
                                                  Le associazioni non possono essere eliminate','Elimina tutti i lavoratori associati alla fase');             
                return;
			}
			
			if(!fs.deleteAllRecords())
			{
		   	   globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione delle associazioni','Elimina tutti i lavoratori associati alla fase');
		   	   return;
			}
		}  
	}
	
	var frmLav = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	frmLav.elements.btn_lavoratori_commessa.enabled = true;
	
	var enableLav = foundset.ditte_commesse_fasi_to_lavoratori_commesse.getSize();	

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
 * @properties={typeid:24,uuid:"75C57696-764B-43FD-B749-20B268E7571C"}
 */
function onActionInfoLavoratoreFaseCommessa(event) 
{
	// TODO Auto-generated method stub
	globals.ma_utl_showInfoDialog('Under construction...','Visualizza informazioni sulle ore lavorate nella fase');
}