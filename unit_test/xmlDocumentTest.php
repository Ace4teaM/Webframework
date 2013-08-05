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
 * PHP-Unit test file for XMLDocument
 */

class XMLDocumentTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . __DIR__ . '/../wfw/php'
                . PATH_SEPARATOR . __DIR__
        );
        //require_once 'base.php';
        require_once 'xdocument.php';
    }

    public function testOne()
    {
        $doc = new XMLDocument("1.0", "utf-8");
        $doc->load(__DIR__ . '/test/test.xml');
        
        //Child selector
        $node = $doc->one('>library');
        $this->assertInstanceOf('DOMElement',$node,'Child selector');
        
        //TagName selector
        $node = $doc->one('book');
        $this->assertInstanceOf('DOMElement',$node,'TagName selector');
        $this->assertEquals('Bible du C++',$node->nodeValue,'TagName selector (value)');
        
        //Attribute selector without quote
        $node = $doc->one('book[id=cpp]');
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector without quote');
        $this->assertEquals('Bible du C++',$node->nodeValue,'Attribute selector without quote (value)');
        
        //Attribute selector with quote
        $node = $doc->one("book[id='cpp']");
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector with quote');
        $this->assertEquals('Bible du C++',$node->nodeValue,'Attribute selector with quote (value)');
        
        //Multiple attribute selector
        $node = $doc->one("book[id=cpp,class]");
        $this->assertInstanceOf('DOMElement',$node,'Multiple attribute selector');
        $this->assertEquals('Bible du C++',$node->nodeValue,'Multiple attribute selector (value)');
        
        //Attribute selector
        $node = $doc->one("book[class]");
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector');
        $this->assertEquals('Bible du C++',$node->nodeValue,'Attribute selector (value)');
        
        //Attribute selector (~=)
        $node = $doc->one("book[class~=blue]");
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector (~=)');
        $this->assertEquals('Programmer en ASMx86',$node->nodeValue,'Attribute selector (~=) (value)');
        
        //Attribute selector random test 1
        $node = $doc->one(">long>far>item[id='my']");
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector random test 1');
        $this->assertEquals('Hello',$node->nodeValue,'Attribute selector random test 1 (value)');
        
        //Attribute selector random test 2
        $node = $doc->one("two four");
        $this->assertInstanceOf('DOMElement',$node,'Attribute selector random test 2');
        $this->assertEquals('4',$node->nodeValue,'Attribute selector random test 2 (value)');
    }
    
    public function testAll()
    {
        $doc = new XMLDocument("1.0", "utf-8");
        $doc->load(__DIR__ . '/test/test.xml');
        
        //Name selector
        $array = $doc->all("book");
        $this->assertContainsOnlyInstancesOf('DOMElement',$array,'Name selector (types)');
        $this->assertEquals(3,count($array),'Name selector (count)');
        
        //Attribute selector
        $array = $doc->all("book[class~=programming]");
        $this->assertContainsOnlyInstancesOf('DOMElement',$array,'Attribute selector (types)');
        $this->assertEquals(3,count($array),'Attribute selector (count)');
        
        //Multiple selectors
        /*$array = $doc->all("book[id=cpp],two,four");
        print_r($array);
        $this->assertContainsOnlyInstancesOf('DOMElement',$array,'Multiple selectors (types)');
        $this->assertEquals(3,count($array),'Multiple selectors (count)');*/
    }
    
    public function testInsertion()
    {
        $doc = new XMLDocument("1.0", "utf-8");
        $doc->load(__DIR__ . '/test/test.xml');
        
        //Append Associative Array
        $parent = $doc->createElement("assoc_array");
        $doc->appendAssocArray(
                $parent,
                array("bool"=>"A","int"=>"B","float"=>"C","char"=>"D")
        );
        $this->assertEquals("ABCD",$parent->nodeValue,'Append Associative Array');
        
        // Merge Arguments
        $a = $doc->createElement("h1");
        $b = $doc->createElement("h1");
        $a->setAttribute("class", "header");
        $a->setAttribute("color", "red");
        $b->setAttribute("class", "");
        $doc->mergeArguments($a, $b, "replace");
        $this->assertEquals($b->getAttribute("color"),"",'Merge Arguments (not exists)');
        $this->assertEquals($b->getAttribute("class"),"header",'Merge Arguments (merged)');
    }
}
?>