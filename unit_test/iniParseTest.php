<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
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
 * PHP-Unit test file for Base Library
 */

class IniParseTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . 'C:\Users\developpement\Documents\GitHub\Webframework\wfw\php'
                . PATH_SEPARATOR . 'C:\Users\developpement\Documents\GitHub\Webframework\unit_test'
        );
        require_once 'ini_parse.php';
    }

    public function testFileInclude()
    {
        // default case
        $cfg = parse_ini_file_ex('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_ini\sectionA.ini',0);
        $expected = array(
            'sectionA'=>array('title'=>'Hello World')
        );
        $this->assertEquals($expected,$cfg,'default case');
        
        // force upper case
        $cfg = parse_ini_file_ex('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_ini\sectionA.ini',INI_PARSE_UPPERCASE);
        $expected = array(
            'SECTIONA'=>array('TITLE'=>'Hello World')
        );
        $this->assertEquals($expected,$cfg,'force upper case');
        
        // comment
        $cfg = parse_ini_file_ex('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_ini\comments.ini');
        $expected = array(
            'COMMENT'=>array('COLOR'=>'blue')
        );
        $this->assertEquals($expected,$cfg,'comments');
        
        // includes
        $cfg = parse_ini_file_ex('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_ini\includes.ini');
        $expected = array(
            'SECTIONA'=>array('TITLE'=>'Hello World'),
            'SECTIONB'=>array('TITLE'=>'Hello Guy'),
            'SECTIONC'=>array('TITLE'=>'Hello Friends')
        );
        $this->assertEquals($expected,$cfg,'includes');
        
        // constantes
        $cfg = parse_ini_file_ex('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_ini\constantes.ini');
        $expected = array(
            'CONSTANTE'=>array('FOO'=>'bar', 'FOO_WITH_ACCOLADE'=>'this is the foo value: bar')
        );
        $this->assertEquals($expected,$cfg,'constantes');
    }
    
}
?>