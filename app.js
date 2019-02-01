
// *** General Algorithm
//
// Create a validationList:array via iexTrading API call t
// Display form with button for user to add stock button 
// ...
// **ON FORM SUBMIT** capture user stock symbol input: string  (i.e. 'TSLA' or 'tsla')  call checkInput() function (which also clears input form)
// checkInput(input: string) function checks that input.toUpperCase is valid stock symbol, if so => calls updateStockList() function
// updateStockList(symbol: string) => adds symbol to stockList: array (via .push) then calls a renderStockButtons() function
// renderStockButtons(stockList: array) will re-write the list of stocks to be shown as buttons that can be clicked in the DOM
// ...
// **ON STOCK BUTTON CLICK** => run getStockInfo() function to do iexTrading API call and store: 
//          1. Name  2. Logo  3.  Price   4.  up to 10 Articles 
// getStockInfo should call a renderStockInfo() function that clears previous results and renders new results 


// wrap in Document Ready Function


// Initlization
let stockList = ['TSLA', 'AAPL', 'TWLO'];
let validationList =[];



// Create validationList: array
$.ajax({
    url: 'https://api.iextrading.com/1.0/ref-data/symbols',
    method: 'GET',
}).then( function(response) { 
    response.forEach( function( object, i ) { 
        validationList.push( object.symbol )
    })
} );



// checkInput()  Definition
const checkInput = function(e) {
    e.preventDefault();
    if ( $('#stock-input').val() == '' ) { alert( 'Please type a stock symbol first') }
    else {
        const symbol = $('#stock-input').val().trim().toUpperCase(); // store input value and trim and uppercase it
        $('#stock-input').val(''); // reset input field to empty
        // check that symbol: string exists in the validation list 
        if ( validationList.includes(symbol) ) {
            updateStockList(symbol);
        }
        else { alert('Please enter a valid stock symbol' ) }
    }
}

// updateStockList()  Definition
const updateStockList = function( symbol ) {
    stockList.push( symbol );
    renderStockButtons( stockList );
}


// renderStockButtons()  Definition
const renderStockButtons = function ( stockList ) {
    let tempDiv = $('<div>');
    stockList.forEach( function(symbol, i) { 
        let buttonHTML = `<button id='${symbol}' class='btn btn-primary mb-2 shadow stockBtn'>${symbol}</button>`
        tempDiv.append( buttonHTML );
    })
    $('#buttonList').empty();
    $('#buttonList').append(tempDiv);
};

// getStockInfo() Definition
const getStockInfo = function(e) {
    e.preventDefault();
    const symbol = e.target.id;
    $.ajax({
        url: `https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote,news,logo`,
        method: 'GET',
    }).then( function(response) {
        const stockInfo = {
            'symbol': response.quote.symbol,
            'companyName': response.quote.companyName, 
            'latestPrice': response.quote.latestPrice,
            'logoUrl': response.logo.url,
            'newsArray': response.news,
        };
        console.log( stockInfo )
        renderStockInfo( stockInfo );
    });

}


// renderStockInfo() Definition
const renderStockInfo = function( stockInfo ) {
    const logoHTML = `<img src='${stockInfo.logoUrl}'>`;
    const companyNameHTML = `<h1>${stockInfo.companyName}</h1>`;
    const latestPriceHTML = `<h3>$${stockInfo.latestPrice}</h3>`;
    const symbolHTML = `<h3>${stockInfo.symbol}</h3>`;
    const newsHTML = makeNewsHTML( stockInfo.newsArray );
    $('#resultsContent').append(logoHTML + companyNameHTML + '<br>' + symbolHTML + latestPriceHTML + '<br>' + newsHTML);
    console.log('renderStockInfo ran')
};


// makeNewsHTML()  Definition
const makeNewsHTML = function( newsArray ) {
    const tempDiv = $("<div>");
    newsArray.forEach( function( article, i ) {
        const imgHTML = `<img src='${article.image}'>`;
        const headlineHTML = `<h4>${article.headline}</h4>`;
        const urlHTML = `<a href='${article.url}'>Read More</a>`;
        console.log(' article.datetime = ', article.datetime)
        const dateHTML = `<h2>${article.datetime.slice(article.datetime.indexOf(':'))}</h2>`; // we only want the date
        tempDiv.append(imgHTML + headlineHTML + '<br>' + dateHTML + urlHTML + '<hr>')
    }) 
    console.log(tempDiv)
    return tempDiv;
}


// add dynamic event listener once to #buttonList, and filter for class .stockBtns
$('#buttonList').on('click', '.stockBtn', getStockInfo);

// add event listener to form submit button
$('#stock-form').on('submit', checkInput);

// show initial stock buttons
renderStockButtons( stockList );
