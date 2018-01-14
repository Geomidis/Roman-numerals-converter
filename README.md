# Roman numerals conterter service

This is a roman numberals converter (from and to), built in Node. It will convert any number from 1 to 3999.

It is built on Node.js. The only dependency is [diet](http://dietjs.com/) a really slim http library that simplifies setting up routes greatly, allowing you to spend your time building the solution, rather than headaches around code. It is also faster than Express or others by a big margin.

Compatible with Node v8.9.4+.

The approach here, after careful consideration to both code readability as well as less lines of code but not ignoring performance, was:

1. To use a single lookup table that will list all of the Roman numerals, to be used when converting to/from Roman
2. Use 1 endpoint `/convert` that will autodetect the input type (number/string) sent to it, then use 2 different functions (1 for each conversion type) that use the same lookup table (for DRY reasons)
3. Apply a few obvious checks to see if the input is compatible (1 - 3999), making sure there is no garbade characters in the Roman string (i.e. other symbols and letters not part of the Roman numeral system).

The functions have comments, but the Arabic -> Roman function will reverse the characters of the input (so 3999 will be 9993) and the results will be unshifted rather than pushed in an array that will be joined when done, to help with the reverse nature of conversion here.
The Roman -> Arabic function will loop in reverse order through the lookup table for as long as there are more Roman characters to convert, then calculate the right number using simple Math (since the lookup table is done in an array of arrays, this is easy - check the code!). The reverse order here is again necessary as X is contained in both X but *also* XC, meaning if not done in reverce it would work as X then C, rather than XC.

The `/convert` endpoint expects an object of this structure, sent as the BODY (application/json):

`{
	"input": YOUR_NUMBER_HERE
}`

and the response looks like this:

`{
	"result": RESULT_HERE
}`

In case you have trouble with the tester.html utility, you can always use [Postman](https://www.getpostman.com/) to test more quickly.

## What it will do:

1. It will convert arabic numbers to roman
2. Or roman numbers to arabic
3. If rogue characters are in the input box of the front-end testing utility, the result will be an error message to try again

## How to run

npm install will take care of all dependencies. After that, simply running `node server.js` will run the service

  - The front end utility is a simple static file built with vanilla js to test the api endpoints
  - There is only 1 endpoint, `host:5000/convert/` that accepts a JSON body like the example in the introduction
  - It is configured to run on port 5000

Open [http://localhost:5000](http://localhost:5000) to see the description of the service

## What can be done better/differently

1. Provide a bigger range of conversion (more than 3999)
2. Make this part of another transformation API perhaps or a utility/helper function
3. If this was going on production, i would look for the more performant solution rather than the easier to read but it all depends on the scope of this.