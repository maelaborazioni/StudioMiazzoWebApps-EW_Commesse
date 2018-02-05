dataSource:"db:/ma_presenze/commesse_giornaliera_ore",
encapsulation:36,
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.descrizionefase",
editable:false,
location:"85,115",
name:"fld_desc_fase",
size:"310,20",
typeid:4,
uuid:"09DD801C-BF48-4937-A03D-DC2F4663D558"
},
{
dataProviderID:"ore",
location:"85,142",
name:"fld_ore",
size:"40,20",
typeid:4,
uuid:"19025F26-6CAE-4D2F-AD84-4550C6F23CCA"
},
{
location:"5,5",
name:"lbl_cliente",
size:"350,20",
text:"Cliente",
transparent:true,
typeid:7,
uuid:"24DA7E3B-DBF6-4685-9EF4-8F372DE5A037"
},
{
location:"5,142",
name:"lbl_ore",
size:"80,20",
text:"Ore lavorate",
transparent:true,
typeid:7,
uuid:"2CC34840-3F23-4102-B8A5-2CCE30B6E1DF"
},
{
location:"370,290",
name:"btn_cancel",
onActionMethodID:"92C9E30D-6E3D-4F94-9110-CFBED01B5D8D",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_cancel_40",
transparent:true,
typeid:7,
uuid:"33CB0281-7D54-4881-AB7E-21ABC3FB1F77"
},
{
location:"340,290",
name:"btn_confirm",
onActionMethodID:"5414E7B9-5F75-467E-9F04-9018F1579BC1",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_confirm_40",
transparent:true,
typeid:7,
uuid:"38E023BA-5C3D-4459-9600-2E8B802DF620"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.codice",
editable:false,
location:"5,70",
name:"fld_cod_commessa",
size:"60,20",
typeid:4,
uuid:"3DC89395-6D91-4324-A108-C2A600CAE7F0"
},
{
location:"5,95",
name:"lbl_fase",
size:"350,20",
text:"Fase della commessa",
transparent:true,
typeid:7,
uuid:"64B09B14-668E-4B18-84FD-2B7E42F40936"
},
{
location:"5,50",
name:"lbl_commessa",
size:"350,20",
text:"Commessa",
transparent:true,
typeid:7,
uuid:"667ADBFC-9759-413D-8DC5-B3E9BB288E33"
},
{
enabled:false,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"65,115",
name:"btn_lkp_fase",
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"6F9DE5E6-FAD3-4153-A769-B9DEFEB77711"
},
{
enabled:false,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"65,25",
name:"btn_lkp_cliente",
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"85A8B745-AA9C-454A-B65C-41F2562F08D3"
},
{
dataProviderID:"noteutente",
displayType:1,
location:"5,190",
name:"fld_note_utente",
size:"390,90",
typeid:4,
uuid:"A95D3B1E-AD5B-4942-B44C-189DB1AF0A9D"
},
{
location:"5,170",
name:"lbl_note_utente",
size:"350,20",
text:"Note utente",
transparent:true,
typeid:7,
uuid:"B9A3CF53-C889-40F1-816E-C83E98F2010E"
},
{
enabled:false,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"65,70",
name:"btn_lkp_commessa",
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"BC8083E5-D66E-4FFE-BB11-AC0DE7BFC627"
},
{
height:325,
partType:5,
typeid:19,
uuid:"BE246E11-EC8E-4D15-8A0B-0E39F56D2A82"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_to_ditte.ragionesociale",
editable:false,
location:"85,25",
name:"fld_desc_cliente",
size:"310,20",
typeid:4,
uuid:"CB3771E7-0A09-4E2F-9DE3-309FD7F109B6"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.descrizione",
editable:false,
location:"85,70",
name:"fld_desc_commessa",
size:"310,20",
typeid:4,
uuid:"CF8F504A-1AB8-4FCB-9D3F-CEF8EA5E8B28"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.codicefase",
editable:false,
location:"5,115",
name:"fld_cod_fase",
size:"60,20",
typeid:4,
uuid:"DB8D1F78-8B3F-457E-9C7F-C32097EEA1BF"
},
{
dataProviderID:"commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.ditte_commesse_fasi_to_ditte_commesse.ditte_commesse_to_ditte.codice",
editable:false,
location:"5,25",
name:"fld_cod_cliente",
size:"60,20",
typeid:4,
uuid:"F1786A5B-7682-46A1-A414-B781358A9E34"
}
],
name:"comm_ore_riepilogo",
showInMenu:true,
size:"405,375",
styleName:"leaf_style",
typeid:3,
uuid:"C4130C76-B92B-4B00-99B5-EE97FB0146C0"