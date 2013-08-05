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

class BaseTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        $root = __DIR__;

        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . $root.'/../wfw/php'
                . PATH_SEPARATOR . $root
        );
        require_once 'base.php';
    }

    public function testFileExt()
    {
        //simple file name
        $ext = file_ext('hello.world');
        $this->assertEquals('world',$ext,'simple file name');
        
        //character case insensitive
        $ext = file_ext('hello.WORLD');
        $this->assertEquals('world',$ext,'character case insensitive');
        
        //with path
        $ext = file_ext('/srv/var/hello.World');
        $this->assertEquals('world',$ext,'with file path');
        
        //without file path
        $ext = file_ext('/srv/var/hello');
        $this->assertEquals('',$ext,'with file path');
        
        //without file name
        $ext = file_ext('.htaccess');
        $this->assertEquals('htaccess',$ext,'without file name');
        
    }
    
    public function testSetFileExt()
    {
        //simple add
        $filename = set_fileext('hello','world');
        $this->assertEquals('hello.world',$filename,'simple add');
        
        //simple replace
        $filename = set_fileext('hello.test','world');
        $this->assertEquals('hello.world',$filename,'simple replace');
        
        //with path
        $filename = set_fileext('/srv/var/hello.test','world');
        $this->assertEquals('/srv/var/hello.world',$filename,'with file path');
        
        //without extension
        $filename = set_fileext('hello.test','');
        $this->assertEquals('hello.',$filename,'without extension');
        
        //without file name
        $filename = set_fileext('','htaccess');
        $this->assertEquals('.htaccess',$filename,'without file name');
        
    }
    
    public function testPath()
    {
        //simple
        $filename = path('/srv');
        $this->assertEquals('/srv',$filename,'simple');
        
        //auto file system separator
        $filename = path('srv','local_file');
        $this->assertEquals('srv'.SYSTEM_FILE_SEPARATOR.'local_file',$filename,'auto file system separator');
        
        //double slash resolve
        $filename = path('srv/','/local_file');
        $this->assertEquals('srv/local_file',$filename,'double slash resolve');
        
        //multiple items
        $filename = path('srv/','/www/','/index.html');
        $this->assertEquals('srv/www/index.html',$filename,'multiple items');
        
        //auto detect separator type
        $filename = path('/srv','www','index.html');
        $this->assertEquals('/srv/www/index.html',$filename,'auto detect separator type');
        
    }
    
    public function testIncludePath()
    {
        //include path
        $filelist = include_path('test_includes');
 //       print_r($filelist);
        $this->assertTrue(constant('TEST_CONST_A'));
        $this->assertTrue(constant('TEST_CONST_B'));
    }
    
    public function testClass()
    {
        // include
        
        include_once(__DIR__.'/test_includes/testClass.inc');
        $this->assertEquals(array('testClass','testClass2'), get_declared_classes_of('testClassBase'), 'get declared classes of');
        
        // cast
        $obj = new testClass();
        $obj = cast(new testClass2(),$obj);
        $this->assertInstanceOf('testClass2', $obj, 'Object type cast');
        $this->assertEquals('HelloWorld', $obj->getStr(), 'Object type cast (data)');
    }
    
    public function testSizeConversion()
    {
        // byteToSize
        
        $fmt = byteToSize(1024);
        $this->assertEquals('1.0 Ko',  $fmt, '1 Ko');
        $fmt = byteToSize(1024*2);
        $this->assertEquals('2.0 Ko',  $fmt, '2 Ko');
        $fmt = byteToSize(1024*2.5);
        $this->assertEquals('2.5 Ko',  $fmt, '2.5 Ko');
        $fmt = byteToSize(1024*1024);
        $this->assertEquals('1.0 Mo',  $fmt, '1 Mo');
        $fmt = byteToSize(pow(1024,3));
        $this->assertEquals('1.0 Go',  $fmt, '1 Go');
        $fmt = byteToSize(pow(1024,4));
        $this->assertEquals('1.0 To',  $fmt, '1 To');
        $fmt = byteToSize(pow(1024,5));
        $this->assertEquals('1.0 Po',  $fmt, '1 Po');
        $fmt = byteToSize(pow(1024,6));
        $this->assertEquals('1.0 Zo',  $fmt, '1 Zo');
        $fmt = byteToSize(pow(1024,7));
        $this->assertEquals('1.0 Yo',  $fmt, '1 Yo');

        // sizeToByte
        
        $num = sizeToByte('1.0 Ko');
        $this->assertEquals(1024,  $num, '1 Ko');
        $num = sizeToByte('2.0 Ko');
        $this->assertEquals(1024*2,  $num, '2 Ko');
        $num = sizeToByte('2.5 Ko');
        $this->assertEquals(1024*2.5,  $num, '2.5 Ko');
        $num = sizeToByte('1.0 Mo');
        $this->assertEquals(1024*1024,  $num, '1 Mo');
        $num = sizeToByte('1.0 Go');
        $this->assertEquals(pow(1024,3),  $num, '1 Go');
        $num = sizeToByte('1.0 To');
        $this->assertEquals(pow(1024,4),  $num, '1 To');
        $num = sizeToByte('1.0 Po');
        $this->assertEquals(pow(1024,5),  $num, '1 Po');
        $num = sizeToByte('1.0 Zo');
        $this->assertEquals(pow(1024,6),  $num, '1 Zo');
        $num = sizeToByte('1.0 Yo');
        $this->assertEquals(pow(1024,7),  $num, '1 Yo');
    }
    
    public function testString()
    {
        // empty_string
        
        $this->assertFalse(empty_string('h'), 'simple empty test');
        $this->assertFalse(empty_string('hello'), 'simple empty test');
        $this->assertTrue(empty_string(''), 'simple empty test');
        $this->assertTrue(empty_string(null), 'simple null test');
        $this->assertTrue(empty_string('      '), 'only spacing');
        $this->assertTrue(empty_string("\n"), 'only linefeed');
        
        // strexplode
        
        $values = strexplode('green;red;blue',';',true);
        $this->assertEquals(array('green','red','blue'),  $values, 'simple explode');
        
        $values = strexplode('green ; red; blue ',';',true);
        $this->assertEquals(array('green','red','blue'),  $values, 'simple explode with spaces');
        
        $values = strexplode('green ; red; 0; blue ',';',true);
        $this->assertEquals(array('green','red','0','blue'),  $values, 'simple explode ignore empty string');
        
        // nvl
        
        $values = nvl('0','REPLACE');
        $this->assertEquals('REPLACE',  $values, 'Zero is null');
        
        $values = nvl(NULL,'REPLACE');
        $this->assertEquals('REPLACE',  $values, 'NULL is null');
        
        $values = nvl('','REPLACE');
        $this->assertEquals('REPLACE',  $values, 'empty string is null');
        
        $values = nvl('NULL','REPLACE');
        $this->assertEquals('NULL',  $values, 'NULL string is not null');
        
        $values = nvl('FALSE','REPLACE');
        $this->assertEquals('FALSE',  $values, 'FALSE string is not null');
    }
    
}
?>