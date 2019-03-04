let limitWords = (textToLimit, wordLimit) => {
  let array = textToLimit.split(' ');
  array.length = wordLimit;
  let string = array.toString().replace(/,/g, ' ');

  return string + '...';
}

let myTrim = x => x.replace(/\s+/g,'+');

var googleAPI = 'https://www.googleapis.com/books/v1/volumes?q=';

$('.loader').hide();
$('.warning-text').hide();

let handleRequest = () => {
    let value = $('input').val();
    let query = myTrim(value);
    let newGoogleAPI = googleAPI + query;

    $('#content').empty();

    if (value) {
      $('.loader').show();
      $('.warning-text').hide();
      $('input').removeClass('warning');
    } else {
      document.getElementById('content').innerHTML += '<span class="empty-content mx-auto">Nothing found! Try another query.</span>';
      $('input').addClass('warning');
      $('.warning-text').show();
    }
    
    $.getJSON(newGoogleAPI, response => {
        for (var i = 0; i < response.items.length; i ++) {
            let item = response.items[i];

            let cardImage = item.volumeInfo.imageLinks.thumbnail;
            let cardImageLink = item.volumeInfo.previewLink;
            let cardTitle = item.volumeInfo.title;
            let cardAuthors = item.volumeInfo.authors;
            let cardPublisher = item.volumeInfo.publisher;
            let cardInfo = item.volumeInfo.infoLink;

            let card = 
            "<div class=\"bookCard col-md-6 col-sm-12\">" + 
              "<div class=\"bookCard__inner row\">" +
                  "<div class=\"col-md-5 col-sm-12\"> " +
                    "<div class=\"bookCard__image\">"+
                      "<a href=\"" + cardImageLink + "\" title=\"Look Inside the Book\"><img src=\""+ cardImage + "\"/></a>" +
                    "</div>" +
                  "</div>" +
                  "<div class=\"col-md-7 col-sm-12\"> " + 
                    "<h3 class=\"bookCard__title\">" + limitWords(cardTitle, 6) + "</h3>" + 
                    "<p class=\"bookCard__info\"> by: " + cardAuthors + "</p>" +
                    "<p class=\"bookCard__info\"> published by: " + cardPublisher + "</p>" +
                    "<button class=\"bookCard__btn\"><a href=\"" + cardInfo + "\"> See this book </a></button>" + 
                  "</div>" +
              "</div>" +
            "</div>" 
            ;

            setTimeout(() => {
                document.getElementById('content').innerHTML += card;
                $('.loader').hide();
            }, 1200);
        }
    })
};

$('button').on('click', () => handleRequest());

$('input')
  .on('keypress input', e => { 
      if (e.which == 13) { 
          handleRequest()
      } else {
          $('#content').empty();
          document.getElementById('content').innerHTML += '<span class="empty-content mx-auto">Nothing here yet - Try searching for a book!</span>';
          $('.warning-text').hide();
          $('input').removeClass('warning');
      } 
  })
  .on('focus', () => ( $(window).width() < 780) ? $('html, body').animate({scrollTop: $('#bookSearch').offset().top}, 100) : '' );
