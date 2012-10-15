<?php
/*
  (C)2010 WebFrameWork
	  Ajoute une tache planifie
  
  Arguments:
  	cmd    : commande a executer
  	date   : date au format timestamp unix

  Retourne:
    result  : resultat de la requete.

  Revisions:
*/
define("ROOT_PATH", realpath("../")."/");
include(ROOT_PATH.'php/base.php');
include_path(ROOT_PATH.'php/');
include_path(ROOT_PATH.'php/class/bases/');
include_path(ROOT_PATH.'php/inputs/');

//
//verifie les champs obligatoires
//
rcheck(
  //requis
  array('domain'=>'','ext'=>'cInputIdentifier'),
  //optionnels
  null
);
   
//
//test
//  
      /*
$ret=array(            
    [0] => 
    [1] => Whois Server Version 2.0
    [2] => 
    [3] => Domain Name:         ID-INFORMATIK.COM           
    [4] => Registrar: GANDI SAS
    [5] => Server Name: ID-INFORMATIK.COM
    [6] => Updated Date: 15-sep-2010
    [7] => 
    [8] => Whois Server Version 2.0
    [9] => 
    [10] => Domain names in the .com and .net domains can now be registered
    [11] => with many different competing registrars. Go to http://www.internic.net
    [12] => for detailed information.
    [13] => 
    [14] =>    Domain Name: ID-INFORMATIK.COM
    [15] =>    Registrar: GANDI SAS
    [16] =>    Whois Server: whois.gandi.net
    [17] =>    Referral URL: http://www.gandi.net
    [18] =>    Name Server: A.DNS.GANDI.NET
    [19] =>    Name Server: B.DNS.GANDI.NET
    [20] =>    Name Server: C.DNS.GANDI.NET
    [21] =>    Status: clientTransferProhibited
    [22] =>    Updated Date: 23-aug-2010
    [23] =>    Creation Date: 23-aug-2010
    [24] =>    Expiration Date: 23-aug-2011
    [25] => 
    [26] => >>> Last update of whois database: Sat, 05 Feb 2011 18:42:00 UTC <<<
    [27] => 
    [28] => NOTICE: The expiration date displayed in this record is the date the
    [29] => registrar's sponsorship of the domain name registration in the registry is
    [30] => currently set to expire. This date does not necessarily reflect the expiration
    [31] => date of the domain name registrant's agreement with the sponsoring
    [32] => registrar.  Users may consult the sponsoring registrar's Whois database to
    [33] => view the registrar's reported date of expiration for this registration.
    [34] => 
    [35] => TERMS OF USE: You are not authorized to access or query our Whois
    [36] => database through the use of electronic processes that are high-volume and
    [37] => automated except as reasonably necessary to register domain names or
    [38] => modify existing registrations; the Data in VeriSign Global Registry
    [39] => Services' ("VeriSign") Whois database is provided by VeriSign for
    [40] => information purposes only, and to assist persons in obtaining information
    [41] => about or related to a domain name registration record. VeriSign does not
    [42] => guarantee its accuracy. By submitting a Whois query, you agree to abide
    [43] => by the following terms of use: You agree that you may use this Data only
    [44] => for lawful purposes and that under no circumstances will you use this Data
    [45] => to: (1) allow, enable, or otherwise support the transmission of mass
    [46] => unsolicited, commercial advertising or solicitations via e-mail, telephone,
    [47] => or facsimile; or (2) enable high volume, automated, electronic processes
    [48] => that apply to VeriSign (or its computer systems). The compilation,
    [49] => repackaging, dissemination or other use of this Data is expressly
    [50] => prohibited without the prior written consent of VeriSign. You agree not to
    [51] => use electronic processes that are automated and high-volume to access or
    [52] => query the Whois database except as reasonably necessary to register
    [53] => domain names or modify existing registrations. VeriSign reserves the right
    [54] => to restrict your access to the Whois database in its sole discretion to ensure
    [55] => operational stability.  VeriSign may restrict or terminate your access to the
    [56] => Whois database for failure to abide by these terms of use. VeriSign
    [57] => reserves the right to modify these terms at any time.
    [58] => 
    [59] => The Registry database contains ONLY .COM, .NET, .EDU domains and
    [60] => Registrars.
    [61] => --- #YAML:1.0
    [62] => # GANDI Registrar whois database for .COM, .NET, .ORG., .INFO, .BIZ, .NAME
    [63] => #
    [64] => # Access and use restricted pursuant to French law on personal data.
    [65] => # Copy of whole or part of the data without permission from GANDI
    [66] => # is strictly forbidden.
    [67] => # The sole owner of a domain is the entity described in the relevant
    [68] => # 'domain:' record.
    [69] => # Domain ownership disputes should be settled using ICANN's Uniform Dispute
    [70] => # Resolution Policy: http://www.icann.org/udrp/udrp.htm
    [71] => # For inquiries about 'by policy' protection, please check directly
    [72] => # with the appropriate registry (Eurid, AFNIC)
    [73] => #
    [74] => # Acces et utilisation soumis a la legislation francaise sur
    [75] => # les donnees personnelles.
    [76] => # Copie de tout ou partie de la base interdite sans autorisation de GANDI.
    [77] => # Le possesseur d'un domaine est l'entite decrite dans
    [78] => # l'enregistrement 'domain:' correspondant.
    [79] => # Un desaccord sur la possession d'un nom de domaine peut etre resolu
    [80] => # en suivant la Uniform Dispute Resolution Policy de l'ICANN:
    [81] => # http://www.icann.org/udrp/udrp.htm
    [82] => # Pour obtenir les informations en status 'Protected by policy', contactez
    [83] => # directement le registre concerne (Eurid, AFNIC)
    [84] => #
    [85] => # 2011-02-05 19:26:30 CET
    [86] => 
    [87] => domain: id-informatik.com
    [88] => reg_created: 2010-08-23 15:56:12
    [89] => expires: 2011-08-23 15:56:12
    [90] => created: 2010-08-23 17:49:35
    [91] => changed: 2010-10-06 17:36:53
    [92] => transfer-prohibited: yes
    [93] => ns0: a.dns.gandi.net
    [94] => ns1: b.dns.gandi.net
    [95] => ns2: c.dns.gandi.net
    [96] => owner-c:
    [97] =>   nic-hdl: TA1407-GANDI
    [98] =>   owner-name: thomas auguey
    [99] =>   organisation: ~
    [100] =>   person: thomas auguey
    [101] =>   address: 133 rue jean moulin
    [102] =>   zipcode: 50110
    [103] =>   city: tourlaville
    [104] =>   country: France
    [105] =>   phone: +33.233200648
    [106] =>   fax: +33.233200648
    [107] =>   email: acd17ad914f01358ca4f8d143a757956-1132010@contact.gandi.net
    [108] =>   lastupdated: 2010-08-22 12:21:51
    [109] => admin-c:
    [110] =>   nic-hdl: TA1407-GANDI
    [111] =>   owner-name: thomas auguey
    [112] =>   organisation: ~
    [113] =>   person: thomas auguey
    [114] =>   address: 133 rue jean moulin
    [115] =>   zipcode: 50110
    [116] =>   city: tourlaville
    [117] =>   country: France
    [118] =>   phone: +33.233200648
    [119] =>   fax: +33.233200648
    [120] =>   email: acd17ad914f01358ca4f8d143a757956-1132010@contact.gandi.net
    [121] =>   lastupdated: 2010-08-22 12:21:51
    [122] => tech-c:
    [123] =>   nic-hdl: TA1407-GANDI
    [124] =>   owner-name: thomas auguey
    [125] =>   organisation: ~
    [126] =>   person: thomas auguey
    [127] =>   address: 133 rue jean moulin
    [128] =>   zipcode: 50110
    [129] =>   city: tourlaville
    [130] =>   country: France
    [131] =>   phone: +33.233200648
    [132] =>   fax: +33.233200648
    [133] =>   email: acd17ad914f01358ca4f8d143a757956-1132010@contact.gandi.net
    [134] =>   lastupdated: 2010-08-22 12:21:51
    [135] => bill-c:
    [136] =>   nic-hdl: TA1407-GANDI
    [137] =>   owner-name: thomas auguey
    [138] =>   organisation: ~
    [139] =>   person: thomas auguey
    [140] =>   address: 133 rue jean moulin
    [141] =>   zipcode: 50110
    [142] =>   city: tourlaville
    [143] =>   country: France
    [144] =>   phone: +33.233200648
    [145] =>   fax: +33.233200648
    [146] =>   email: acd17ad914f01358ca4f8d143a757956-1132010@contact.gandi.net
    "lastupdated: 2010-08-22 12:21:51"
); */
     
$domain_name = $_REQUEST['domain'].".".$_REQUEST['ext'];
if(cmd("whois $domain_name",$ret)!=0){
  rpost_result(ERR_FAILED,"service not available");
}
//com,ru,? 
$fl_array = preg_grep("/^(?i)[ \t]*Domain Name:[ \t]*".$domain_name."[ \t]*$/",$ret);
if(!empty($fl_array)){
  rpost("available","no");
  rpost_result(ERR_OK);
} 
//fr,?   
$fl_array = preg_grep("/^(?i)[ \t]*domain:[ \t]*".$domain_name."[ \t]*$/",$ret);
if(!empty($fl_array)){
  rpost("available","no");
  rpost_result(ERR_OK);
} 
  
rpost("available","yes");  
rpost_result(ERR_OK);
?>