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
 * PHP-Unit test file for XMLTemplate
 */

class XMLTemplateTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . __DIR__ . '/../wfw/php'
                . PATH_SEPARATOR . __DIR__
        );
        //require_once 'base.php';
        require_once 'templates/xml_template.php';
    }

    public function testActionSelect()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/select/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/select/template.html',
                NULL,
                $selDoc,
                NULL,
                array()
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/select/expected.html'), $tempDoc->Make() );
    }
    
    public function testActionExists()
    {
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/exists/template.html',
                NULL,
                NULL,
                NULL,
                array("one"=>"1", "two"=>"2", "three"=>"3")
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/exists/expected.html'), $tempDoc->Make() );
    }
    
    public function testActionAll()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/all/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/all/template.html',
                NULL,
                $selDoc,
                NULL,
                array()
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/all/expected.html'), $tempDoc->Make() );
    }
    
    public function testActionOne()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/one/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/one/template.html',
                NULL,
                $selDoc,
                NULL,
                array()
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/one/expected.html'), $tempDoc->Make() );
    }
    
    public function testActionMerge()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/merge/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/merge/template.html',
                NULL,
                $selDoc,
                NULL,
                array()
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/merge/expected.html'), $tempDoc->Make() );
    }
    
    public function testActionInclude()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/include/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/include/template.html',
                NULL,
                $selDoc,
                NULL,
                array()
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/include/expected.html'), $tempDoc->Make() );
    }
    
    public function testMarkers()
    {
        // charge la selection
        $selDoc = new XMLDocument("1.0", "utf-8");
        $selDoc->load(__DIR__.'/template_xml/markers/select.xml');
        
        //transforme
        $tempDoc = new cXMLTemplate();
        $tempDoc->Initialise(
                __DIR__.'/template_xml/markers/template.html',
                NULL,
                $selDoc,
                NULL,
                array(
                    "HelloWorld" => "Hello-World (case sensitive)",
                    "helloworld" => "Hello-World"
                )
        );
        
        //assert
        $this->assertXmlStringEqualsXmlString(file_get_contents(__DIR__.'/template_xml/markers/expected.html'), $tempDoc->Make() );
    }
    
    
}
?>