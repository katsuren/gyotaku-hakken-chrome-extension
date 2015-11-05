var gyotakuUrl = "http://megalodon.jp/";

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var currentUrl= tabs[0].url;
    var lastRequestUrl = localStorage['lastRequestUrl'];
    var lastResult = localStorage['lastResult'];
    var lastSearchUrl = localStorage['lastSearchUrl'];
    var lastSearchResult = localStorage['lastSearchResult'];

    // なんとなく復元すると嫌なので、キャッシュだけにする
    // if (lastSearchUrl) {
    //     $('#urlinput').val(lastSearchUrl);
    // }
    // if (lastSearchResult) {
    //     $('.search-result-container').html(lastSearchResult);
    // }

    if (currentUrl == lastRequestUrl) {
        if (lastResult) {
            $('.current-archive-container').html(lastResult);
        }
        // 直前取得したURLと同じならリクエストしない
        return;
    }

    $('.current-archive-container').html('データ取得中です...');
    $('#currentLoading').removeClass('disabled');
    var requestUrl = gyotakuUrl + '?url=' + encodeURIComponent(currentUrl);
    $.ajax({
        url: requestUrl
            , method: "GET"
            , dataType: "html"
    }).done(function(data, textStatus, jqXHR) {
        $('#currentLoading').addClass('disabled');
        localStorage['lastRequestUrl'] = currentUrl;
        var archiveElement = $(data).find(".row:contains('取得済み')");
        if (archiveElement.text()) {
            var list = archiveElement.next();
            list.find('a').attr({target: '_blank'});
            $('.current-archive-container').html(list.html());
            localStorage['lastResult'] = list.html();
        } else {
            $('.current-archive-container').html('魚拓はありませんでした');
            localStorage['lastResult'] = '魚拓はありませんでした';
        }
    }).always(function(dataOrJqXHR, textStatus, jqXHROrErrorThrown) {
        $('#currentLoading').addClass('disabled');
    });
});

$('#searchForm').on('submit', function(e) {
    var url = $('#urlinput').val();
    var lastSearchUrl = localStorage['lastSearchResult'];
    var lastSearchResult = localStorage['lastSearchResult'];

    if (url == lastSearchUrl) {
        // 直前取得したURLと同じならリクエストしない
        return;
    }

    $('.search-result-container').html('データ取得中です...');
    $('#searchLoading').removeClass('disabled');
    var requestUrl = gyotakuUrl + '?url=' + encodeURIComponent(url);
    $.ajax({
        url: requestUrl
            , method: "GET"
            , dataType: "html"
    }).done(function(data, textStatus, jqXHR) {
        $('#searchLoading').addClass('disabled');
        localStorage['lastSearchUrl'] = url;
        var archiveElement = $(data).find(".row:contains('取得済み')");
        if (archiveElement.text()) {
            var list = archiveElement.next();
            list.find('a').attr({target: '_blank'});
            $('.search-result-container').html(list.html());
            localStorage['lastSearchResult'] = list.html();
        } else {
            $('.search-result-container').html('魚拓はありませんでした');
            localStorage['lastSearchResult'] = '魚拓はありませんでした';
        }
    }).always(function(dataOrJqXHR, textStatus, jqXHROrErrorThrown) {
        $('#searchLoading').addClass('disabled');
    });

    return false;
});
