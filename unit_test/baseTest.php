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
        $this->assertEquals($expected,$filelist,'include path');
        
    }
}
?>