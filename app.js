
// *** Algorithm
//
// Create a validationList:array via iexTrading API call t
// Display form with button for user to add stock button 
// onClick, capture user stock symbol input: string  (i.e. 'TSLA' or 'tsla')  call checkInput() function (which also clears input form)
// checkInput(input: string) function checks that input.toUpperCase is valid stock symbol, if so => calls updateStockList() function
// updateStockList(symbol: string) => adds symbol to stockList: array (via .push) then calls a renderStockButtons() function
// renderStockButtons(stockList: array) will re-write the list of stocks to be shown as buttons that can be clicked in the DOM
// ...
// when User clicks a stock button => run getStockInfo() function to do iexTrading API call and store: 
//          1. Name  2. Logo  3.  Price   4.  up to 10 Articles 
// getStockInfo should call a renderResults() function that clears previous results and renders new results 


// wrap in Document Ready Function


// Initlization
let stockList = ['TSLA', 'AAPL', 'TWLO'];
let validationList =[];

console.log(stockList)

// Asynchronously create validationList: array
$.ajax({
    url: 'https://api.iextrading.com/1.0/ref-data/symbols',
    method: 'GET',
}).then( function(response) { 
    response.forEach( function( object, i ) { 
        validationList.push( object.symbol )
    })
    console.log( 'validation list = ', validationList )
} );



// checkInput Definition
const checkInput = function(e) {
    e.preventDefault();
    if ( $('#stock-input').val() == '' ) { alert( 'Please type a stock symbol first') }
    else {
        const symbol = $('#stock-input').val().trim().toUpperCase(); // store input value and trim and uppercase it
        $('#stock-input').val(); // reset input field to empty
        // check that symbol: string exists in the validation list 
        if ( validationList.includes(symbol) ) {
            updateStockList(symbol);
        }
        else { alert('Please enter a valid stock symbol' ) }
    }
}

// updateStockList Definition
const updateStockList = function( symbol ) {
    stockList.push( symbol );
    renderStockButtons( stockList );
}


// renderStockButtons Definition
const renderStockButtons = function ( stockList ) {
    let tempDiv = $('<div>');
    stockList.forEach( function(symbol, i) { 
        let buttonHTML = `<button id='${symbol}' class='btn btn-primary mb-2 shadow stockBtn'>${symbol}</button>`
        tempDiv.append( buttonHTML );
    })
    $('#buttonList').empty();
    $('#buttonList').append(tempDiv);
    console.log( buttonList, tempDiv)
};

renderStockButtons( stockList )

// *** create a renderStockButtons(stockList: array) function
// Takes stockList: array 
// create temp div to hold buttons
// for each symbol in the list => create HTML and append to temp div  (be sure to add class .stockBtns for event listener)
// append the entire temp div to #buttonList div 






// add dynamic event listener once to #buttonList, and filter for class .stockBtns

// add event listener to form submit button
$('#find-stock').on('click', checkInput)
