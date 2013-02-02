<?php

/**
 * Interface module
 *
 * @author Thomas AUGUEY
 */
interface iModule {
    const CantFindTemplateFile = "MOD_CANT_FIND_MODULE";
    const CantLoadDefaultFile  = "MOD_CANT_LOAD_DEFAULT";
    public static function makeView($name,$attributes,$template_file);
}

?>
