<?php
class BaseTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . 'C:\Users\developpement\Documents\GitHub\Webframework\wfw\php'
                . PATH_SEPARATOR . 'C:\Users\developpement\Documents\GitHub\Webframework\unit_test'
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
        $filelist = include_path('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_includes');
        $expected = array(
            'C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_includes\a.php',
            'C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_includes\b.PHP'
        );
        $this->assertTrue(constant('TEST_CONST_A'));
        $this->assertTrue(constant('TEST_CONST_B'));
    }
    
    public function testClass()
    {
        include_once('C:\Users\developpement\Documents\GitHub\Webframework\unit_test\test_includes\testClass.inc');
        $this->assertEquals(array('testClass','testClass2'), get_declared_classes_of('testClassBase'), 'get declared classes of');
    }
    
    public function testSizeConversion()
    {
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
}
?>