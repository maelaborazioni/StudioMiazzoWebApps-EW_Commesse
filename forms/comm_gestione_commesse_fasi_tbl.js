/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
* @param {Boolean} _noConfirm
*
* @properties={typeid:24,uuid:"A284DDEF-7BFC-4DAA-8D68-73FB41942E7F"}
*/
function dc_delete(_event, _triggerForm, _forceForm, _noConfirm) 
{
	// TODO aggiungere controllo per presenza di ore/timbrature esistenti già associate alla commessa
	globals.ma_utl_showWarningDialog('TODO non c\'è ancora il controllo esistenza ore/timbrature associate alla commessa da cancellare','Elimina commessa');
	return _super.dc_delete(_event, _triggerForm, _forceForm, _noConfirm)
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"86CD1113-CD1C-4590-B02F-023AEACB827E"}
*/
function dc_edit(_event, _triggerForm, _forceForm) 
{
	_super.dc_edit(_event, _triggerForm, _forceForm)
	return; 
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"07C78737-83A5-46B6-8207-087062843C63"}
*/
function dc_new(_event, _triggerForm, _forceForm) 
{
	_super.dc_new(_event, _triggerForm, _forceForm);
	return; 
}

/**
*
* @param {JSEvent} _event
* @param {String} _triggerForm
* @param {String} _forceForm
*
* @properties={typeid:24,uuid:"B2B419E2-26E2-4AC5-A8B5-440424103FD1"}
*/
function dc_save(_event, _triggerForm, _forceForm) 
{
	return _super.dc_save(_event, _triggerForm, _forceForm)
}



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
 * @properties={typeid:24,uuid:"2D2867EA-51D1-4D83-B62A-7C77F07798E2"}
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
 * @properties={typeid:24,uuid:"AC0C044B-E8DC-4CAD-B034-6CEB02253E34"}
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
 * @properties={typeid:24,uuid:"A04004BA-71E2-4F35-BF14-1057AAD32F15"}
 */
function onActionEvGenerato(event) {
	// TODO Auto-generated method stub
	globals.ma_utl_showWarningDialog('Under construction...','Evento generato dalla commessa');
}

/**
 *
 * @param {JSEvent} _event
 * @param {String} _form
 *
 * @properties={typeid:24,uuid:"2078DBF7-5200-426F-8FE2-17EC00538F0F"}
 */
function onRecordSelection(_event, _form) 
{
	_super.onRecordSelection(_event, _form);

	var frm = forms.comm_gestione_commesse_tab;
//	var frmLav = forms.comm_gestione_commesse_fasi_lavoratori_tab;
	
	frm.elements.btn_edit_fase_commessa.enabled =
		frm.elements.btn_delete_fase_commessa.enabled = 
		    frm.elements.btn_lavoratori_commessa.enabled = true;
	
	var enableLav = (ditte_commesse_fasi_to_lavoratori_commesse != null ?
                     ditte_commesse_to_ditte_commesse_fasi.ditte_commesse_fasi_to_lavoratori_commesse.getSize() : 0);	

	frm.elements.btn_lavoratori_elimina.enabled =
	  frm.elements.btn_lavoratori_info.enabled = enableLav;	
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DA8EC96E-ACE2-43CC-B2D5-E198A6E68A49"}
 */
function onRenderMonteOreFase(event)
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['monteorefase'])
	{
		var monteOre = _rec['monteorefase'];
	    var totOreLavorate = _rec['totale_ore_lavorate_fase'];
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
 * @properties={typeid:24,uuid:"3140BF39-5D71-4D07-AF49-47CE5BE56C31"}
 */
function onRenderPianificate(event) 
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['monteorefase'])
	{
		var monteOre = _rec['monteorefase'];
	    var totOrePianificate = _rec['totale_ore_pianificate_fase'];
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
 * @properties={typeid:24,uuid:"CE97DBED-B473-4396-B1AE-40D8B75B1320"}
 */
function onRenderLavorate(event) 
{
	var _rec = event.getRecord();
	var _recRen = event.getRenderable();
	if(_rec && _rec['totale_ore_pianificate_fase'])
	{
		var totOrePianificate = _rec['totale_ore_pianificate_fase'];
		var totOreLavorate = _rec['totale_ore_lavorate_fase'];
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
