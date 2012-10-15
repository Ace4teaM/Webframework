<?php
/*

	(R)WebFrameWork - (C)2010 Avalanche, Tout droits reserver.
	Expressions regulieres
	
	PHP Code

	AUTHOR: Auguey Thomas
	MAIL  : dev@aceteam.fr

*/

// quelques format utile dans les expressions regulieres
class cRegExpFmt
{
	public static function id()
		{ return "[a-zA-Z_]{1}[a-zA-Z0-9_]*"; }

	public static function int()
		{ return "[0-9]+"; }

	public static function filename()
		{ return "[^\\\/:*?\"<>\|]+"; }
}

?>
