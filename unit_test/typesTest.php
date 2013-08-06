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
 * PHP-Unit test file for Base types Library
 */

class TypesTest extends PHPUnit_Framework_TestCase{
    public function setUp(){
        $root = __DIR__;

        set_include_path(
                get_include_path()
                . PATH_SEPARATOR . $root.'/../wfw/php'
                . PATH_SEPARATOR . $root
        );
        require_once 'base.php';
    }

    public function testBoolFormat()
    {
        require_once 'inputs/bool.php';
        
        $this->assertTrue(cInputBool::isValid("0"),'0');
        $this->assertTrue(cInputBool::isValid("1"),'1');
        $this->assertTrue(cInputBool::isValid("yes"),'yes');
        $this->assertTrue(cInputBool::isValid("no"),'no');
        $this->assertTrue(cInputBool::isValid("on"),'on');
        $this->assertTrue(cInputBool::isValid("off"),'off');
        $this->assertTrue(cInputBool::isValid("true"),'true');
        $this->assertTrue(cInputBool::isValid("false"),'false');
        $this->assertTrue(cInputBool::isValid("FalsE"),'accept case insensitive');
    }
    
    public function testIntegerFormat()
    {
        require_once 'inputs/integer.php';
        
        $this->assertTrue( cInputInteger::isValid("2013"),  "Number" );
        $this->assertTrue( cInputInteger::isValid("0"),  "Zero" );
        $this->assertTrue( cInputInteger::isValid("-456"),  "Negative" );
        $this->assertFalse( cInputInteger::isValid(""),  "Not empty" );
        $this->assertFalse( cInputInteger::isValid("456.0"),  "Not integer" );
        $this->assertFalse( cInputInteger::isValid("5456454444444444444444444444440"), "Not Big" );
    }
    
    public function testFloatFormat()
    {
        require_once 'inputs/float.php';
        
        $this->assertTrue( cInputFloat::isValid("2013.0"), "Number with point" );
        $this->assertTrue( cInputFloat::isValid("2013,45"), "Number with comma" );
        $this->assertTrue( cInputFloat::isValid("0.0"), "Zero" );
        $this->assertTrue( cInputFloat::isValid("-456.0"), "Negative" );
        $this->assertTrue( cInputFloat::isValid("456"), "Integer" );
        $this->assertFalse( cInputFloat::isValid(""), "Not empty" );
        $this->assertFalse( cInputFloat::isValid("123.456.14"), "Not multiple points" );
    }
    
    public function testFactorFormat()
    {
        require_once 'inputs/factor.php';
        
        $this->assertTrue( cInputFactor::isValid("1"), "One" );
        $this->assertTrue( cInputFactor::isValid("1.0"), "One" );
        $this->assertTrue( cInputFactor::isValid("0.0"), "Zero" );
        $this->assertTrue( cInputFactor::isValid("1"), "One" );
        $this->assertFalse( cInputFactor::isValid("-1.0"), "Not Negative" );
        $this->assertFalse( cInputFactor::isValid(""), "Not empty" );
    }
    
    public function testDateFormat()
    {
        require_once 'inputs/date.php';
        
        $fmt = '31-08-2013';
        $this->assertTrue(cInputDate::isValid($fmt),"Format DD-MM-YYYY");
        $fmt = '2013-08-31';
        $this->assertTrue(cInputDate::isValid($fmt),"Format YYYY-MM-DD");
        $fmt = 'identifier';
        $this->assertFalse(cInputDate::isValid($fmt),"Invalid format");
        /*
        $fmt = '08-31-2013';
        $this->assertTrue(cInputDate::isValid($fmt));*/
    }
    
    public function testDateTimeFormat()
    {
        require_once 'inputs/datetime.php';
        
        $fmt = '31-08-2013 14:40:20';
        $this->assertTrue(cInputDateTime::isValid($fmt),"Format DD-MM-YYYY HH:MM:SS");
        $fmt = '2013-08-31 14:40:20';
        $this->assertTrue(cInputDateTime::isValid($fmt),"Format YYYY-MM-DD HH:MM:SS");
        $fmt = '2013 08 31 14 40 20';
        $this->assertTrue(cInputDateTime::isValid($fmt),"With spaces");
        $fmt = 'identifier';
        $this->assertFalse(cInputDateTime::isValid($fmt),"Invalid format");
        /*
        $fmt = '08-31-2013';
        $this->assertTrue(cInputDate::isValid($fmt));*/
    }
    
    public function testIdentifierFormat()
    {
        require_once 'inputs/identifier.php';
        
        $this->assertTrue( cInputIdentifier::isValid("stack"), "Simple" );
        $this->assertTrue( cInputIdentifier::isValid("stack_house"), "Underscore" );
        $this->assertFalse( cInputIdentifier::isValid("stack-house"), "Not -" );
        $this->assertFalse( cInputIdentifier::isValid("stack house"), "Not space" );
        $this->assertFalse( cInputIdentifier::isValid("1One"), "Not begin by number" );
    }
    
    public function testMailFormat()
    {
        require_once 'inputs/mail.php';
        
        $this->assertTrue( cInputMail::isValid("foo@bar.com"), "Simple" );
        $this->assertTrue( cInputMail::isValid("foo.foo@bar.com"), "Sub Domain" );
        $this->assertTrue( cInputMail::isValid("foo@bar"), "Without extension" );
        $this->assertFalse( cInputMail::isValid("foo@"), "Not empty domain" );
        $this->assertFalse( cInputMail::isValid("@foo"), "Not empty name" );
        $this->assertFalse( cInputMail::isValid("bar..foo@foo"), "Not double point" );
    }
    
    public function testUNIXFileNameFormat()
    {
        require_once 'inputs/filename.php';
        
        $this->assertTrue( cInputUNIXFileName::isValid("setup.exe"), "Simple" );
        $this->assertTrue( cInputUNIXFileName::isValid("doxygen-1.8.3.1-setup.exe"), "Complex" );
        $this->assertFalse( cInputUNIXFileName::isValid("../setup.exe"), "Not return path" );
        $this->assertFalse( cInputUNIXFileName::isValid("base/setup.exe"), "Not path" );
        
        $this->assertTrue( cInputWindowsFileName::isValid("setup.exe"), "Simple" );
        $this->assertTrue( cInputWindowsFileName::isValid("doxygen-1.8.3.1-setup.exe"), "Complex" );
        $this->assertFalse( cInputWindowsFileName::isValid("..\\setup.exe"), "Not return path" );
        $this->assertFalse( cInputWindowsFileName::isValid("base\\setup.exe"), "Not path" );
    }

    public function testIPv4Format()
    {
        require_once 'inputs/ip.php';
        
        $this->assertTrue( cInputIPv4::isValid("0.0.0.0"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("192.168.1.1"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("192.168.1.100"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("192.168.1.199"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("192.168.1.249"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("192.168.1.255"), "Simple" );
        $this->assertTrue( cInputIPv4::isValid("255.255.255.255"), "Simple" );
        $this->assertFalse( cInputIPv4::isValid("255.255.999.255"), "Not Invalid Number Range" );
        $this->assertFalse( cInputIPv4::isValid("192.168.1"), "Not Uncomplete" );
        $this->assertFalse( cInputIPv4::isValid("192.168.1.x"), "Not Non Number" );
    }
    
    public function testNameFormat()
    {
        require_once 'inputs/name.php';
        
        $this->assertTrue( cInputName::isValid("setup.exe"), "Simple" );
        $this->assertTrue( cInputName::isValid("doxygen_1.8.3.1-setup.exe"), "Complex" );
        $this->assertFalse( cInputName::isValid("setup$1.exe"), "Not Special Char" );
        $this->assertFalse( cInputName::isValid("setup 1.exe"), "Not Spacing Char" );
    }
    
    public function testNumericFormat()
    {
        require_once 'inputs/numeric.php';
        
        $this->assertTrue( cInputNumeric::isValid("12"), "Integer" );
        $this->assertTrue( cInputNumeric::isValid("3.1"), "Float" );
    }
    
    public function testPasswordFormat()
    {
        require_once 'inputs/password.php';
        
        $this->assertTrue( cInputPassword::isValid("azerty"), "Minimal" );
        $this->assertTrue( cInputPassword::isValid("-------------"), "Repetitive" );
        $this->assertTrue( cInputPassword::isValid("@titi-lolo"), "Exemple" );
        $this->assertTrue( cInputPassword::isValid("azAZ09_-@#&+~"), "Specials chars" );
        $this->assertFalse( cInputPassword::isValid("12"), "Not To Small" );
    }
    

    public function testStringFormat()
    {
        require_once 'inputs/string.php';
        
        $this->assertTrue( cInputString::isValid("azerty"), "Minimal" );
        $this->assertTrue( cInputString::isValid("Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression."), "Specials chars" );
        $this->assertFalse( cInputString::isValid("Hello \"World\""), "Not double comma" );
        $this->assertFalse( cInputString::isValid("Hello \n World"), "Not line feed" );
        $this->assertFalse( cInputString::isValid("Hello \r World"), "Not carriage return" );
    }
    
    public function testTextFormat()
    {
        require_once 'inputs/text.php';
        
        $this->assertTrue( cInputText::isValid("Le Lorem \n\r Ipsum est \"simplement\" du faux texte employé dans la composition et la mise en page avant impression."), "Accept all chars" );
    }
    
    public function testURLFormat()
    {
        require_once 'inputs/url.php';
        
        $this->assertTrue( cInputURL::isValid("google.fr"), "Simple" );
        $this->assertTrue( cInputURL::isValid("www.google.fr"), "Simple" );
        $this->assertTrue( cInputURL::isValid("http://www.google.fr"), "Simple" );
        $this->assertTrue( cInputURL::isValid("http://google.fr"), "Simple" );
        $this->assertTrue( cInputURL::isValid("http://www.google.fr?a=b"),"Simple" );
        $this->assertTrue( cInputURL::isValid("http://www.google.fr?a=b&b=c"), "Simple" );
        $this->assertTrue( cInputURL::isValid("http://www.google.fr?a=b&b=c#titi"), "Simple" );
        $this->assertTrue( cInputURL::isValid("http://www.google.fr#titi"), "Simple" );
        //$this->assertTrue( cInputURL::isValid("https://www.google.fr/webhp?source=searchapp#hl=fr&gsrn=11&gsri=psy-ab&tok=DJ3PqQ3S3DzU4t0230ADEQ&cp=4&gsid=e&xhr=t&q=actualit%C3%A9&esnrs=true&pf=p&output=search&sclient=psy-ab&oq=actu&gsl=&pbx=1&bav=on.2,or.rcp.rqf.&bvm=bv.45580626,d.d2k&fp=35b5c03ba0c6d3fa&biw=1680&bih=989"), "Complex" );
    }
    
}
?>