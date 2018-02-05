/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7B5CC8F8-7368-43C0-9377-F1BA2F8DF75A"}
 */
function dc_new_commessa(event) 
{
	// inserimento nuova anagrafica commessa
	var frm = forms.comm_gestione_commesse_dtl;
	var singDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD) != null ? true : false; 
	frm.elements.fld_esclusivo_ditta.enabled = 
		frm.elements.lbl_esclusivo_ditta.enabled = 
			frm.elements.lbl_codice_ditta.enabled =
				frm.elements.fld_codice_ditta.enabled =
					frm.elements.fld_ragione_sociale.enabled = 
						frm.elements.fld_ragione_sociale.enabled = !singDitta;
	if(singDitta)
		frm.elements.fld_esclusivo_ditta.toolTipText = 'Nel caso di una singola ditta standard la commessa è automaticamente associata alla ditta stessa';
	else
		frm.elements.fld_esclusivo_ditta.toolTipText = '';
						
	databaseManager.startTransaction();
	var fs = frm.foundset;
	if(fs.newRecord() != -1)
	{
		fs.idditta = foundset.idditta;
		globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci una nuova anagrafica commessa');
	}
	else
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Errore durante al creazione del nuovo record di anagrafica commessa');
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"745F62ED-8E08-4C45-9AD0-540E2347974E"}
 */
function dc_edit_commessa(event) 
{
    var frm = forms.comm_gestione_commesse_dtl;
	
	databaseManager.startTransaction();
	var fs = frm.foundset;
	if(fs.loadRecords(forms.comm_gestione_commesse_tbl.iddittacommessa) && fs.getSize())
	{
		if(fs.iddittaesclusiva != null)
		   frm.onDataChangeDitta(-1,fs.iddittaesclusiva,event);
		
		globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci una nuova anagrafica commessa');
	}
	else
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Errore durante il caricamento del record selezionato di anagrafica commessa');
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FAA6973E-940D-4C3A-A4B6-6DC6C536C946"}
 */
function dc_new_commessa_fase(event) 
{
	// inserisci una nuova fase della commessa sopra selezionata
	var frm = forms.comm_gestione_commesse_fasi_dtl;
	var fs = frm.foundset;
	var frmComm = forms.comm_gestione_commesse_tbl;
	var fsComm = frmComm.foundset;
	
	databaseManager.startTransaction();
	
	if(fs.newRecord() != -1)
	{
	   frm.isNuovaFase = true;
	   fs.iddittacommessa = fsComm.getSelectedRecord().iddittacommessa;
	   globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
       globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci una nuova fase per la commessa');
	}
	else
	{
	   databaseManager.rollbackTransaction();
	   globals.ma_utl_showWarningDialog('Errore durante al creazione del nuovo record di fase per la commessa');
	}
	
}



/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0C9EB9C7-1DA1-4F3F-A7A0-58720E8135C2"}
 */
function dc_edit_commessa_fase(event)
{
	// modifica la fase selezionata della commessa
	var frm = forms.comm_gestione_commesse_fasi_dtl;
	
	databaseManager.startTransaction();
	var fs = frm.foundset;
	if(fs.loadRecords(forms.comm_gestione_commesse_fasi_tbl.foundset.getSelectedRecord().iddittacommessafase) && fs.getSize())
	{
		frm.isNuovaFase = false;
		globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci una fase per la commessa');
	}
	else
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Errore durante il caricamento del record selezionato di fase per la commessa');
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"41DF7DD6-B9F0-4888-85FD-01243689CC5D"}
 */
function dc_delete_commessa(event) 
{
	// elimina anagrafica commessa selezionata
	if(foundset.ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.getSize())
	{
		globals.ma_utl_showWarningDialog('Impossibile eliminare una commessa con fasi associate.','Elimina commessa');
	    return;
	}
	
	if(!foundset.ditte_to_ditte_commesse.deleteRecord())
	   globals.ma_utl_showWarningDialog('Eliminazione non completata, si prega di riprovare.','Elimina commessa');
    
	if(foundset.ditte_to_ditte_commesse.getSize() == 0)
	{
		var frm = forms.comm_gestione_commesse_tab;
		frm.elements.btn_edit_commessa.enabled = 
			frm.elements.btn_delete_commessa.enabled = false;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6CE90333-E84B-476B-9377-1B35E63FEE76"}
 */
function dc_delete_commessa_fase(event) 
{
	// elimina la fase della commessa selezionata
	if(foundset.ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_lavoratori_commesse.getSize())
	{
		globals.ma_utl_showWarningDialog('Impossibile eliminare una fase avente ancora lavoratori associati.','Elimina fase commessa');
	    return;
	}
	
	if(!foundset.ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_lavoratori_commesse.deleteRecord())
	{
		globals.ma_utl_showWarningDialog('Eliminazione associazione lavoratori fase commessa non completata, si prega di riprovare.','Elimina fase commessa');
	    return;
	}
	
	if(!foundset.ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.deleteRecord())
	{
		globals.ma_utl_showWarningDialog('Eliminazione della fase commessa non completata, si prega di riprovare.','Elimina fase commessa');
	    return;
	}
	
	if(foundset.ditte_to_ditte_commesse.ditte_commesse_to_ditte_commesse_fasi.getSize() == 0)
	{
		var frm = forms.comm_gestione_commesse_tab;
		frm.elements.btn_edit_fase_commessa.enabled = 
			frm.elements.btn_delete_fase_commessa.enabled = false;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"ED841FEB-4059-4A7E-A379-0B8FEE27E467"}
 */
function onActionBtnImportaCommesse(event) 
{
	// TODO Importazione automatica delle fasi commessa da file esterno creato ad hoc
	globals.ma_utl_showWarningDialog('Under construction...');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DB528747-0F62-4A8D-B4A0-438F34062085"}
 */
function onActionBtnImportaFasiCommessa(event) 
{
	// TODO Importazione automatica delle fasi commessa da file esterno creato ad hoc
	globals.ma_utl_showWarningDialog('Under construction...');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6B31CB0E-29B4-40B7-A2CD-C87663BE5DC3"}
 * @AllowToRunInFind
 */
function onActionBtnLavoratoriFasi(event) 
{
	var frm = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	var fs = frm.foundset;
	
	var recDittaCommessaFase = fs.getSelectedRecord(); 

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
 * @properties={typeid:24,uuid:"5A2D110A-2E88-441A-B283-1CC76876E370"}
 */
function FiltraLavoratoriFaseCommessa(fs)
{
	var frm = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	var fSet = frm.foundset;
	
	if(fSet.ditte_commesse_fasi_to_ditte_commesse.iddittaesclusiva)
	   fs.addFoundSetFilterParam('idditta','=',fSet.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_esclusivo_ditta_to_ditte.idditta);
	
	fs.addFoundSetFilterParam('cessazione','=',null);
	
	return fs;
}

/**
 * Aggiorna la selezione dei lavoratori associati alla fase della commessa
 * 
 * @param _recs
 *
 * @properties={typeid:24,uuid:"B5196F3C-8C19-419F-AEF9-CB69C19CDA1C"}
 */
function updateLavoratoriFaseCommessa(_recs)
{
	var frm = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	var fs = frm.foundset;
	
	for(var r = 1; r <= _recs.length; r++)
	{
		var rec = fs.ditte_commesse_fasi_to_lavoratori_commesse.getRecord(fs.ditte_commesse_fasi_to_lavoratori_commesse.newRecord()); 
			//foundset.ditte_commesse_fasi_to_lavoratori_commesse.getRecord(foundset.ditte_commesse_fasi_to_lavoratori_commesse.newRecord());
	    rec.idlavoratore = _recs[r - 1];
	}
	
	elements.btn_lavoratori_commessa.enabled = true;
	
	var enableLav = fs.ditte_commesse_fasi_to_lavoratori_commesse.getSize();	

	elements.btn_lavoratori_elimina.enabled =
	 elements.btn_lavoratori_info.enabled = enableLav;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A0E199C8-7041-46B5-8988-AA33AB820337"}
 * @AllowToRunInFind
 */
function onActionBtnEliminaLavoratoriCommessa(event) 
{
	var frm = forms.comm_gestione_commesse_fasi_lavoratori_tab;
//	var fSet = frm.foundset;
	var fs = frm.foundset.ditte_commesse_fasi_to_lavoratori_commesse;
	
	if(fs && fs.find())
	{
		fs.iddittacommessafase = forms.comm_gestione_commesse_fasi_tbl.foundset.iddittacommessafase;
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
	
	var enableLav = forms.comm_gestione_commesse_fasi_tbl.foundset.ditte_commesse_fasi_to_lavoratori_commesse.getSize();	

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
 * @properties={typeid:24,uuid:"BFA39597-B2B7-4FB2-A4A1-521AD0B696A7"}
 */
function onActionInfoLavoratoreFaseCommessa(event) 
{
	// TODO Auto-generated method stub
	globals.ma_utl_showInfoDialog('Under construction...','Visualizza informazioni sulle ore lavorate nella fase');
}