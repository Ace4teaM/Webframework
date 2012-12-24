<?php

/**
 * Interface module
 *
 * @author Thomas AUGUEY
 */
interface iModule {
    const CantFindTemplateFile = 6001;
    const CantLoadDefaultFile  = 6002;
    public static function makeView($name,$attributes,$template_file);
}

?>
