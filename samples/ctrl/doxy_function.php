<?php

/*
  ---------------------------------------------------------------------------------------------------------------------------------------
  (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
  ---------------------------------------------------------------------------------------------------------------------------------------
  This file is part of WebFrameWork.

  WebFrameWork is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  WebFrameWork is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
  ---------------------------------------------------------------------------------------------------------------------------------------
 */

/**
 * @page wfw_data_model Data Model
 * 
 * # Retourne le modèle de données (dictionnaire)
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | -
 * | Rôle         | Visiteur
 * | UC           | wfw_datamodel
 * 
 * @param lang Langage pour les textes
 */
namespace application\doxy_function;

use \cApplication     as cApplication;
use \cApplicationCtrl as cApplicationCtrl;
use \iApplication     as iApplication;
use \XMLDocument      as XMLDocument;
use \cXMLTemplate     as cXMLTemplate;
use \cResult          as cResult;

class Ctrl extends cApplicationCtrl{
    public $fields    = array("doxygen_doc","doxygen_ref");
    public $op_fields = null;
    
    protected $cache_file = null; // fichier template intermediaire
    
    function main(iApplication $app, $app_path, $p) {
        $cache_file   = path( $app->getRootPath(), 'view/tmp', $p->doxygen_ref.'.html' );
        $doxygen_file = substr($p->doxygen_ref, 0, strrpos($p->doxygen_ref,'_')).'.xml';
        $doxygen_doc  = path( $app->getRootPath(), $app->getCfgValue('docs',$p->doxygen_doc) );

        //------------------------------------------------------------------
        //fabrique le template intermediaire
        //------------------------------------------------------------------
        $template = new cXMLTemplate();

        //charge le contenu en selection
        $select = new XMLDocument("1.0", "utf-8");
        if(!$select->load(path($doxygen_doc,$doxygen_file)))
            return RESULT(cResult::Failed,cApplication::ResourceNotFound,array("file"=>path($doxygen_doc,$doxygen_file)));
        $attributes = array("id" => $p->doxygen_ref);

        //transforme le fichier
        if(!$template->Initialise(
                    path($app->getRootPath(),'/view/doxy_function.html'),
                    NULL,
                    $select,
                    NULL,
                    $attributes ) )
            return false;

        file_put_contents($cache_file, $template->Make());
        
        $this->cache_file = $cache_file;

        return RESULT_OK();
    }
    
    // output
    function output(iApplication $app, $format, $att, $result)
    {
        if(!$result->isOk())
            return parent::output($app, $format, $att, $result);

        switch($format){
            case "text/html":
                return $app->makeXMLView($this->cache_file,array());
        }
        return parent::output($app, $format, $att, $result);
    }
};

?>