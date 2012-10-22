<?php

/*
  WebFrameWork, v1.3 - Templates
  template.php
  (C)2009-2010 Avalanche, Tout droits reserver

  CODE  : PHP 5.3.0+

  AUTHOR: Auguey Thomas
  MAIL  : admin@aceteam.fr

  < rev.1.0.1 >, MakeArgumentTemplate::onData(), stocke maintenant les valeurs multiples d'un meme 'id' dans un tableau.
  < rev.1.0.2 >, templateMaker::onParseText() et ::onParseInline(), gere l'attribut 'else' comme valeur texte alternative si l'item n'existe pas.
  < rev.1.0.3 >, Separe les commandes de parser '::onParse...' dans des classes externes stockes dans '$callbacks'
  < rev 1.0.4 >, Ajout de la methode 'MakeArgumentTemplate::create', celle ci crée le contenu texte d'un fichier XML a partir d'un tableau associatif simple.
  < rev 1.0.5 >, Modification du format cDocumentParserXML::onTagClose
 */

/*
  Parser XML de base
  Evenements:
  onTagOpen, onTagClose : ouverture et fermeture d'element
  onCDATA               : lit des donnees texte non balise
 */

class cDocumentParserXML {

    var $parser;

    function cDocumentParserXML() {
        $this->parser = xml_parser_create();

        xml_set_object($this->parser, $this);
        xml_set_element_handler($this->parser, "tag_open", "tag_close");
        xml_set_character_data_handler($this->parser, "cdata");
    }

    function onTagOpen($parser, $tag, $attributes) {
        
    }

    function onTagClose($parser, $tag) {
        
    }

    function onCDATA($parser, $cdata) {
        
    }

    function parse($data) {
        xml_parse($this->parser, $data);
    }

    function tag_open($parser, $tag, $attributes) {
        $tag = strtolower($tag);

        $this->onTagOpen($parser, $tag, $attributes);
    }

    function cdata($parser, $cdata) {
        $cdata = ltrim($cdata, "\n\r\t\0 \x0B");
        $cdata = rtrim($cdata, "\n\r\t\0 \x0B");
        if (empty($cdata))
            return;
        $this->onCDATA($parser, $cdata);
    }

    function tag_close($parser, $tag) {
        $tag = strtolower($tag);

        $this->onTagClose($parser, $tag);
    }

}

/*
  Template XML, Callback defaut
  Elements:
  text: colle du text
  inline: colle du text sur une seule ligne.
  element: colle un element
 */

class template_callback_Default {

    function Begin($temp, $att) {
        return NULL;
    }

    function CDATA($temp, $cdata) {
        return $cdata;
    }

    function onParseText($temp, $tag, $cmd, $attributes) {
        $id = $attributes["ID"];

        // colle le texte en entree
        if (isset($temp->pin[$id])) {
            if (is_array($temp->pin[$id]))
                return $temp->pin[$id][0];
            else
                return $temp->pin[$id];
        }
        // < rev.1.0.2 > valeur alternative
        else if (isset($attributes["ELSE"]))
            return $attributes["ELSE"];

        return NULL;
    }

    function onParseInline($temp, $tag, $cmd, $attributes) {
        return $this->onParseText($temp, $tag, $cmd, $attributes);
    }

    function onParseElement($temp, $tag, $cmd, $attributes) {
        $id = $attributes["TARGET"];
        print_d('onParseElement into (' . $id . ')');

        if (isset($temp->pin[$id]))
            return $temp->pin[$id];

        return NULL;
    }

    function End() {
        return NULL;
    }

}

/*
  Template XML
 */

class templateMaker extends cDocumentParserXML {

    var $curPath; // path en cours
    var $out;     // elements de sorties
    var $out_att; // proprietes des elements de sorties
    var $in;      // elements d'entrees
    var $pin;     // l'element d'entree en cours
    var $pin_prev; // l'element d'entree precedent
    var $pout;    // l'element de sortie en cours
    var $callback; // tableau associatif des callback
    var $callback_order; // pile des callback ouverts
    var $callback_current; // callback en cours ( dernier de la pile $callback_order )

    function templateMaker() {
        $this->cDocumentParserXML();
        $this->curPath = '';
        $this->in = NULL;
        $this->pin = NULL;
        $this->pin_prev = NULL;
        $this->out = Array('/' => ''); //l'element racine
        $this->pout = &$this->out['/'];
        $this->callback = array(
            'default' => (new template_callback_Default()),
        );
    }

    function make($text, $elements) {
        $this->cDocumentParserXML();
        $this->curPath = '';
        $this->in = $elements;
        $this->pin = $elements;
        $this->pin_prev = $elements;
        $this->out = Array('/' => ''); //l'element racine
        $this->pout = &$this->out['/'];
        $this->callback_order = array($this->callback['default']);
        $this->callback_current = &end($this->callback_order);

        $this->parse($text);

        return $this->out;
    }

    function SetCallback($name, $class) {
        $this->callback[$name] = $class;
    }

    //
    // Begin/Close ....
    //
    
    function onBeginElement($tag, $cmd, $attributes) {
        print_d('onBeginElement (' . $attributes["ID"] . ') for (' . $attributes["TARGET"] . ')');

        $id = $attributes["ID"];
        $target = $attributes["TARGET"];

        //initialise l'element dans la sortie
        /* 	$this->out_att[$id] = $attributes;
          $this->out[$id]     = '';
          $this->pout         = &$this->out[$id]; */
        $this->out_att[$target] = $attributes;
        //    $this->out[$target]     = ''; //rev 1.0.4, accumule le texte des cibles en plusieurs exemplaires
        $this->pout = &$this->out[$target];

        //verifie la presence de l'element dans les entrees        
        if (isset($this->pin[$id])) {
            $this->pin_prev = $this->pin;
            $this->pin = $this->pin[$id];
        }

        //actualise le path en cours
        $this->curPath .= (empty($this->curPath) ? $id : '/' . $id);
        //et ajoute aux attributs de sortie
        //	$this->out_att[$id]['path'] = $this->curPath;
        $this->out_att[$target]['path'] = $this->curPath;

        //attributs entree
        $in_att = $this->arrayPathToRef($this->curPath, $this->in);
        if ($in_att != false)
            print_d("($this->curPath) as inputs");
        //print_d("($this->curPath) as inputs : ".print_r($in_att,true));
        else
            print_d("($this->curPath) as not inputs");
        return '';
    }

    function onEndBeginElement($tag, $cmd) {
        print_d("onEndElement\n");
        $this->curPath = substr($this->curPath, -1, strlen($attributes['ID']));

        $this->pin = $this->pin_prev;
        $this->pout = &$this->out['/']; // retourne a l'element racine
        return '';
    }

    function onBeginCallback($tag, $cmd, $attributes) {
        $id = $attributes["ID"];

        if (isset($this->callback[$id])) {
            //ajoute a liste des callbacks
            $this->callback_order[] = $this->callback[$id];
            //pointe sur le dernier
            $this->callback_current = &end($this->callback_order);
            //debute
            $this->callback_current->Begin($this, $attributes);
        }
    }

    function onEndBeginCallback($tag, $cmd) {
        if (isset($this->callback_current)) {
            //	print_r("onEndBeginCallback\n");
            $this->pout .= $this->callback_current->End();
            array_pop($this->callback_order);
            $this->callback_current = &end($this->callback_order); // precedent 
        }
    }

    //
    // Parser Events ....
    //
    
    function onTagOpen($parser, $tag, $attributes) {
        $cmd = explode(':', $tag);
        //
        // commande pour le parser?
        if (count($cmd) > 1)
            $func = "on" . $cmd[0] . $cmd[1];
        else
            $func = "on" . $cmd[0];

        switch ($cmd[0]) {
            case 'parse':
                if (method_exists($this->callback_current, $func)) {
                    $this->pout .= $this->callback_current->$func($this, $tag, $cmd[0], $attributes);
                } else {
                    // sinon, recherche dans les callbacks precedents
                }
                break;

            case 'begin':
                if (method_exists($this, $func))
                    $this->pout .= $this->$func($tag, $cmd[0], $attributes);
                break;

            //sinon, simple tag
            default:
                $this->pout .= $this->callback_current->CDATA($this, $this->makeTag($tag, $attributes));
                break;
        }
    }

    function onTagClose($parser, $tag) {
        $cmd = explode(':', $tag);
        //
        // commande pour le parser?
        if (count($cmd) > 1)
            $func = "onend" . $cmd[0] . $cmd[1];
        else
            $func = "onend" . $cmd[0];

        switch ($cmd[0]) {
            //parser
            case 'parse':
                if (method_exists($this->callback_current, $func)) {
                    $this->pout .= $this->callback_current->$func($this, $tag, $cmd[0], $attributes);
                } else {
                    // sinon, recherche dans les callbacks precedents...
                    print_d('unknow method::' . $func);
                }
                break;

            //begin/close
            case 'begin':
                if (method_exists($this, $func))
                    $this->pout .= $this->$func($tag, $cmd[0], $attributes);
                break;

            //sinon, simple tag
            default:
                $this->pout .= $this->callback_current->CDATA($this, '</' . $tag . '>');
                break;
        }

        $this->pout .= "\n"; // !! DEBUG: Augemente la lisibilite du code de sortie !!
    }

    function onCDATA($parser, $cdata) {
        if (method_exists($this->callback_current, 'CDATA')) {
            $this->pout .= $this->callback_current->CDATA($this, $cdata);
        } else {
            // sinon, recherche dans les callbacks precedents...
            print_d('ignore cdata:' . $cdata);
        }
    }

    //
    // Utils ....
    //
    
    function makeTag($tag, $attributes) {
        $inline = '<' . $tag;
        if (count($attributes) > 0) {
            foreach ($attributes as $key => $value)
                $inline .= ' ' . $key . '="' . $value . '"';
        }
        $inline .= '>';
        return $inline;
    }

    function arrayPathToRef($path, $ar) {
        $dir = explode('/', $path);
        //	print_d(print_r($dir,true));
        foreach ($dir as $key => $name) {
            if (isset($ar[$name])) {
                //	print_d($name." as input");
                $ar = &$ar[$name];
            } else {
                //	print_d('('.$name.") as no input");
                return false;
            }
        }
        return $ar;
    }

}

class MakeArgumentTemplate extends cDocumentParserXML {

    var $arg;    // elements des templates
    var $name;    // texte de sortie

    function documentMaker() {
        $this->cDocumentParserXML();
    }

    function make($text) {
        $this->arg = NULL;
        $this->name = NULL;
        $this->parse($text);
        return $this->arg;
    }

    // < rev.1.0.4 >
    function create($title, $arg) {
        $text = "<$title>";
        foreach ($arg as $name => $value) {
            $text .= "<$name>$value</$name>\n";
        }
        $text.="</$title>";
        return $text;
    }

    //
    // XML Events ....
    //
    
    function onTagOpen($parser, $tag, $attributes) {
        if ($this->name != NULL && !empty($this->name))
            $this->name .= '.';
        $this->name .= $tag;
    }

    function onTagClose($parser, $tag) {
        $szName = strlen($this->name);
        $szTag = strlen($tag);
        if ($szName <= $szTag)
            $this->name = NULL;
        else
            $this->name = substr($this->name, 0, $szName - ($szTag + 1));
    }

    function onCDATA($parser, $cdata) {
        // < rev.1.0.1 >
        if ($this->name != NULL) {

            //si plusieurs arguments pour ce meme nom, place automatiquement dans un tableau
            if (!empty($this->arg[$this->name])) {
                //sauve l'item existant
                if (!is_array($this->arg[$this->name]))
                    $this->arg[$this->name] = array($this->arg[$this->name]);
                //ajoute l'item en cours
                $this->arg[$this->name][] = $cdata;
            }
            //sinon definit comme unique valeur associative du nom
            else {
                $this->arg[$this->name] = $cdata;
            }
        }
    }

}

?>
