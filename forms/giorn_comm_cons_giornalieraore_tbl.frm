dataSource:"db:/ma_presenze/commesse_giornaliera_ore",
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_lavoratori.lavoratori_to_persone.nominativo",
editable:false,
location:"50,20",
margin:"0,2,0,0",
name:"fld_nominativo",
size:"200,20",
styleClass:"table",
typeid:4,
uuid:"007A7103-DD41-4F22-83C2-DFE57DB3F80F"
},
{
horizontalAlignment:0,
location:"640,135",
name:"fld_billable_ore",
onRenderMethodID:"DFD2AED3-8784-4A62-870F-54B3FB3D1961",
size:"40,20",
styleClass:"table",
typeid:4,
uuid:"0282BBED-C92C-4A1A-93EC-1D6927BD4366",
visible:false
},
{
labelFor:"fld_billable_ore",
location:"640,115",
name:"lbl_billable_ore",
size:"40,20",
styleClass:"table_header",
text:"",
typeid:7,
uuid:"170CC114-E275-417C-A518-C36C46ABC142",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_fase_commessa",
location:"320,0",
name:"lbl_fase_commessa",
size:"70,20",
styleClass:"table_header",
text:"Fase",
typeid:7,
uuid:"30855D71-DC4B-4C44-A8E6-30112EA07B5A"
},
{
horizontalAlignment:0,
labelFor:"fld_ore",
location:"450,0",
name:"lbl_ore",
size:"60,20",
styleClass:"table_header",
text:"Ore",
typeid:7,
uuid:"4DB05F81-7A99-44F9-A5F3-AF5B1DF041D8"
},
{
dataProviderID:"ore",
editable:false,
format:"#0.00|#0.00|#(5)",
horizontalAlignment:0,
location:"450,20",
name:"fld_ore",
size:"60,20",
styleClass:"table",
typeid:4,
uuid:"5E0F110A-000E-4C49-8771-1B6BC9FA4296"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.codice",
editable:false,
horizontalAlignment:0,
location:"250,20",
name:"fld_codice_commessa",
size:"70,20",
styleClass:"table",
typeid:4,
uuid:"61039A5F-2441-44C3-8F24-DD6418869675"
},
{
labelFor:"fld_aut_ore",
location:"565,96",
name:"lbl_aut_ore",
size:"40,20",
styleClass:"table_header",
text:"",
typeid:7,
uuid:"6D5B185F-EED9-409F-9B9E-EF3BDDDBCF19",
visible:false
},
{
labelFor:"fld_nominativo",
location:"50,0",
margin:"0,2,0,0",
name:"lbl_nominativo",
size:"200,20",
styleClass:"table_header",
text:"Nominativo",
typeid:7,
uuid:"6DC12843-ABB8-49AC-8CE5-652ED79E9BCB"
},
{
horizontalAlignment:0,
labelFor:"fld_giorno",
location:"390,0",
name:"lbl_giorno",
size:"60,20",
styleClass:"table_header",
text:"Giorno",
typeid:7,
uuid:"7221783C-D8DC-4A76-B31B-3524FB725641"
},
{
editable:false,
horizontalAlignment:0,
location:"0,110",
name:"fld_proprieta",
size:"40,20",
styleClass:"table",
typeid:4,
uuid:"74EBA413-9795-45D8-A145-FA2AF6B9404C",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_proprieta",
location:"0,90",
name:"lbl_proprieta",
size:"40,20",
styleClass:"table_header",
text:"Prop.",
typeid:7,
uuid:"7D1D67F8-B4E1-493A-B96C-3DD8FA89239A",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_codice_commessa",
location:"250,0",
mnemonic:"",
name:"lbl_codice_commessa",
size:"70,20",
styleClass:"table_header",
text:"Commessa",
typeid:7,
uuid:"7D54F331-3BB0-478D-9D8A-411E8166CC15"
},
{
horizontalAlignment:0,
labelFor:"fld_consolidato",
location:"510,0",
name:"lbl_consolidato",
size:"65,20",
styleClass:"table_header",
text:"Consolidato",
typeid:7,
uuid:"921CD73D-DCB4-4EB7-AB0C-09060C62870B"
},
{
horizontalAlignment:0,
location:"565,116",
name:"fld_aut_ore",
onRenderMethodID:"D712EEB8-F60B-4A51-950C-A4CB6E41A33E",
size:"40,20",
styleClass:"table",
typeid:4,
uuid:"AA63FC04-26A9-4CC8-B00E-6FBB9E9341D3",
visible:false
},
{
height:40,
partType:5,
typeid:19,
uuid:"B0AA6CAC-277C-42C7-A537-921797F165AB"
},
{
horizontalAlignment:0,
labelFor:"fld_codice",
location:"0,0",
name:"lbl_codice",
size:"50,20",
styleClass:"table_header",
text:"Codice",
typeid:7,
uuid:"B63308A8-A142-425B-BE45-B874B3452351"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.giorno",
editable:false,
format:"dd/MM|mask",
horizontalAlignment:0,
location:"390,20",
name:"fld_giorno",
size:"60,20",
styleClass:"table",
typeid:4,
uuid:"BA0CD28D-A8BE-4876-B0A6-8186CC332784"
},
{
dataProviderID:"consolidato",
displayType:4,
horizontalAlignment:0,
location:"510,20",
name:"fld_consolidato",
onRenderMethodID:"-1",
onRightClickMethodID:"94F51414-A96D-4DC8-9670-7E224E01299B",
size:"65,20",
styleClass:"table",
typeid:4,
uuid:"E9F295DF-8DE9-4ED4-A119-458C43618BD1"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.codicefase",
editable:false,
horizontalAlignment:0,
location:"320,20",
name:"fld_fase_commessa",
size:"70,20",
styleClass:"table",
typeid:4,
uuid:"ED3BED76-2926-45E7-93F4-938D395C0DC8"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_lavoratori.codice",
editable:false,
format:"#",
horizontalAlignment:0,
location:"0,20",
name:"fld_codice",
size:"50,20",
styleClass:"table",
typeid:4,
uuid:"EED968C2-2F42-43A4-9062-50B1557E4879"
}
],
name:"giorn_comm_cons_giornalieraore_tbl",
onRenderMethodID:"-1",
size:"575,40",
styleName:"leaf_style",
typeid:3,
uuid:"3EF2CFA5-3C8A-4B6D-9E53-F1D46A3B81C6",
view:3