 /**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4C0F5574-0B29-427C-9351-F80B6CD51075"}
 */
function onDataChangeEsclusivoDitta(oldValue, newValue, event) 
{
	return true;
}


 
 /**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2F0A175E-2206-4983-B06C-2F3C5362DF62"}
 */
function onDataChangeEvGenerato(oldValue, newValue, event)
{
	// TODO Auto-generated method stub
	return true;
}
 
 /**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7E3F076B-0B51-4720-BEB8-F3DD576B33E4"}
 */
function onActionEvGenerato(event)
{
	// TODO Auto-generated method stub
	globals.ma_utl_showWarningDialog('Under construction...','Evento generato dalla commessa');
}
 
/**
 *
 * @param {JSEvent} _event
 * @param {String} _form
 *
 * @properties={typeid:24,uuid:"41B2151E-053A-4983-BD94-C0FE81CDD55A"}
 */
function onRecordSelection(_event, _form)
{
	_super.onRecordSelection(_event, _form);
	
	var frm = forms.comm_gestione_commesse_tab;
	
	frm.elements.btn_edit_commessa.enabled =
		frm.elements.btn_delete_commessa.enabled = true;
	
	frm.elements.btn_add_fase_commessa.enabled = true;
	
	var enableFasi = ditte_commesse_to_ditte_commesse_fasi != null ? ditte_commesse_to_ditte_commesse_fasi.getSize() : 0;
	var enableLav = (ditte_commesse_to_ditte_commesse_fasi != null 
			         && ditte_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_lavoratori_commesse != null ?
	                 ditte_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_lavoratori_commesse.getSize() : 0);
	
	frm.elements.btn_edit_fase_commessa.enabled = 
	    frm.elements.btn_delete_fase_commessa.enabled = 
		    frm.elements.btn_lavoratori_commessa.enabled = enableFasi;
	
	frm.elements.btn_lavoratori_elimina.enabled
	  frm.elements.btn_lavoratori_info.enabled = enableLav;	
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4C4B887F-3562-40CA-94E6-4B9848AC71F8"}
 */
function onRenderMonteOreCommessa(event)
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['monteore'])
	{
		var monteOre = _rec['monteore'];
	    var totOreLavorate = _rec['totale_ore_lavorate_commessa'];
	    var deltaOre = monteOre - totOreLavorate;
	    var scostamento = totOreLavorate / monteOre;
	    
		if (deltaOre < 0)
		{
			if(Math.abs(scostamento) > 0.25)
			  _recRen.bgcolor = 'red';
		    else
			  _recRen.bgcolor = 'orange';
			_recRen.toolTipText = 'Superamento budget pari al : ' + Math.abs(scostamento) * 100 + '%';
		}
		else if(deltaOre > 0)
		{
			if(Math.abs(scostamento) > 0.25)
			  _recRen.bgcolor = 'green';
		    else
			  _recRen.bgcolor = 'yellow';
			_recRen.toolTipText = 'Percentuale di completamento : ' + Math.abs(scostamento) * 100 + '%';
		}
		
		_recRen.fgcolor = 'white';		
	}
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A3F6AB2A-AF53-4212-B984-6541105C47CE"}
 */
function onRenderPianificate(event) 
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['monteore'])
	{
		var monteOre = _rec['monteore'];
	    var totOrePianificate = _rec['totale_ore_pianificate_commessa'];
	    var deltaOre = monteOre - totOrePianificate;
	    var scostamento = deltaOre / monteOre;
	    
		if (deltaOre < 0)
		{
			if(Math.abs(scostamento) > 0.25)
			  _recRen.bgcolor = 'red';
		    else
			  _recRen.bgcolor = 'orange';
			
			_recRen.fgcolor = 'white';
			_recRen.toolTipText = 'Superamento budget pari al : ' + Math.abs(scostamento * 100) + '%';
		    
		}
		else
			_recRen.toolTipText = 'Le ore pianificate corrispondono al : ' + Math.abs((totOrePianificate / monteOre) * 100) + '% del budget';
		
	}
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"709790EF-65E0-46F3-9A80-795E5FEEE8BB"}
 */
function onRenderLavorate(event) 
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['totale_ore_pianificate_commessa'])
	{
		var totOrePianificate = _rec['totale_ore_pianificate_commessa'];
		var totOreLavorate = _rec['totale_ore_lavorate_commessa'];
	    var deltaOre = totOrePianificate - totOreLavorate;
	    var scostamento = deltaOre / totOrePianificate;
	    
		if (deltaOre < 0)
		{
			if(Math.abs(scostamento) > 0.25)
			  _recRen.bgcolor = 'red';
		    else
			  _recRen.bgcolor = 'orange';
			
			_recRen.fgcolor = 'white';
			_recRen.toolTipText = 'Superamento pianificazione pari al : ' + Math.abs(scostamento * 100) + '%';
		}
		else
			_recRen.toolTipText = 'Avanzamento lavori pari al : ' + Math.abs((totOreLavorate / totOrePianificate) * 100) + '%';
	
	}
}
