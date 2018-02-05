/**
 * @properties={type:8,typeid:36,uuid:"FDD49A13-2E94-4AB3-B508-3E6663C65976"}
 */
function totale_ore_lavorate()
{
	var totOre = 0;
	var fsOre = commesse_giornaliera_to_commesse_giornaliera_ore;
	if(fsOre)
	{
		for(var i = 1; i <= fsOre.getSize(); i++)
			if(fsOre.getRecord(i).consolidato)
				totOre += fsOre.getRecord(i).ore;
	}
	return totOre;
}

/**
 * @properties={type:8,typeid:36,uuid:"F1114731-6892-4E03-85B2-9D92B5AFBDE7"}
 */
function totale_ore_pianificate()
{
	var totOre = 0;
	var fsOre = commesse_giornaliera_to_commesse_giornaliera_ore;
	if(fsOre)
	{
		for(var i = 1; i <= fsOre.getSize(); i++)
			totOre += fsOre.getRecord(i).ore;
	}
	return totOre;
}

