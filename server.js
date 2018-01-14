let server = require ( 'diet' );
let app  = server ();
const port = 5000;
const lookupTable = {
	"0":["I","II","III","IV","V","VI","VII","VIII","IX"],
    "1":["X","XX","XXX","XL","L","LX","LXX","LXXX","XC"],
    "2":["C","CC","CCC","CD","D","DC","DCC","DCCC","CM"],
	"3":["M","MM","MMM"],
};

/** GET /
 *
 *  default route
 *  prints out all the endpoints of the API
 *
 */
app.get ( '/', $ => {
   $.end ( 'Welcome to the api, please use one of the endpoints.\n\n' +
   		   '/convert - Converts between Arabic and Roman numerals between 1 - 3999. It will auto detect the source :)' );
} );

/** POST /convert
 *
 *  return Roman or Arabic number, depending on the source.
 *
 *  Input
 *  one value, that can be a number or a sting.
 *
 *  Output
 *  If input is a number returns the Roman equivalent and vice versa
 *
 * **/
app.post ( '/convert', $ => {
	$.header ( "Access-Control-Allow-Origin", "*" );
	$.header ( "Access-Control-Allow-Headers", "X-Requested-With" );
	let input =  ( typeof $.body === 'string' ) ? JSON.parse ( $.body ).input : $.body.input;
    $.end ( { "result": !isNaN ( input ) ? convertToRoman ( input ) : convertToArabic ( input.toUpperCase () ) } );
} );

const convertToRoman = number => {
	if ( parseInt ( number ) < 1 || parseInt ( number ) > 3999 ) return "Error: This service can only convert between 1 - 3999!";
	let numberChars, romanChars = [];
	// break the input into reversed chars
	numberChars = number.toString ().split ( "" ).reverse ();
  	// loop through the reversed characters and inject the lookup character in the beggining of the resulting array
  	numberChars.map ( ( char, i ) => {
		romanChars.unshift ( lookupTable [ i ] [ numberChars [ i ] - 1 ] );
		return null;
  	} );
  	// return the joined chars
	return romanChars.join ( "" );
}

const convertToArabic = number => {
	if ( number.indexOf ( 'MMMM') === 0 ) return "Error: This service can only convert between 1 - 3999!";
	if ( !/^[MDCLXVI]+$/.test ( number ) ) return "Error: Not a valid Roman numeral! Try again!";

	let numberChars = [], length = number.length;
	// as long as there are still characters left in the roman numeral keep searching
	while ( length > 0 ) {
		// loop through the first level of the lookup table, then the second in reverse order 
		// so we always find bigger numbers before smaller
		for ( let i = Object.keys ( lookupTable ).length - 1; i > -1; i-- ) {
			if ( length === 0 ) break;
			for ( let j = lookupTable [ i ].length - 1; j > -1; j-- ) {
				// if roman numeral is matched, remove it from the number provided 
				// and push it's arabic counterpart in our array, breaking if something is found
				if ( number.indexOf ( lookupTable [ i ] [ j ] ) === 0 ) {
            		numberChars.push ( Math.pow ( 10, i ) * ( j + 1 ) );
            		number = number.replace ( lookupTable [ i ] [ j ], '' );
            		length -= lookupTable [ i ] [ j ].length;
            		if ( length === 0 ) break;
      			}
			}
		}
	}
  	
  	// reduce the found numbers to produce the right number
  	return numberChars.reduce ( ( accumulator, currentValue ) => accumulator + currentValue ).toString ();
}

app.listen ( port );
console.log ( 'Skynet awakens at ' + port );