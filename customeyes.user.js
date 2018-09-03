// ==UserScript==
// @name         CustomEyes Integration
// @namespace    https://the-eye.eu/
// @version      0.4
// @description  File browsing UI enhancements
// @author       Nem3sis, oduska
// @match        https://the-eye.eu/public/*
// @grant        none
// ==/UserScript==

(function($){

    // Add stylesheet to head
    $.ajax({
        url: "//raw.githubusercontent.com/Nem3sisTE/customeyes/master/customeyes.css",
        success: function(data) {
            $("<style></style>").appendTo("head").html(data);
        }
    });

    $('.directory.status .content').after('<button class="ui button" id="customize"><i class="icon paint brush"></i> Customize Layout</button>');

    $( "#customize" ).click(function() {
        $( ".customeyes-toolbar" ).toggle( "slow", function() {});
    });


    var $customizationdisabled = false;

    if ( localStorage.getItem('cust-disabled') == 'true' ) {
        $customizationdisabled = true;
    }

    // Directory/file type icons
    var icons = '<svg style="display: none;" class="mimetype-icons" xmlns="http://www.w3.org/2000/svg">' +
        '<symbol id="disc-image" viewBox="0 0 48 48"><path d="M24 4C12.954 4 4 12.955 4 24s8.954 20 20 20 20-8.955 20-20S35.046 4 24 4zm0 23.684c-2.035 0-3.684-1.649-3.684-3.684s1.649-3.684 3.684-3.684 3.684 1.649 3.684 3.684-1.649 3.684-3.684 3.684z" fill="#90caf9"/><g fill="#cfe8f9"><path d="M28.022 22.645l10.902-8.699c-1.326-1.963-3.033-3.645-5.008-4.955l-8.759 10.925c1.348.384 2.417 1.407 2.865 2.729zM19.934 25.214L8.999 33.927c1.333 2.008 3.057 3.734 5.065 5.068l8.665-10.946c-1.344-.426-2.39-1.484-2.795-2.835z"/></g><path d="M24 18c-3.314 0-6 2.688-6 6s2.686 6 6 6c3.313 0 6-2.688 6-6s-2.687-6-6-6zm0 8c-1.104 0-2-.895-2-2s.896-2 2-2 2 .895 2 2-.896 2-2 2z" fill="#1e88e5"/></symbol>' +
        '<symbol id="archive" viewBox="0 0 48 48"><path d="M8 3h32v42H8z" fill="#ffca28"/><path d="M22 21h4v2h-4zM22 15h4v2h-4zM22 18h4v2h-4zM22 24h4v2h-4zM22 9h4v2h-4zM22 3h4v2h-4zM22 6h4v2h-4zM22 12h4v2h-4z" fill="#828282"/><path d="M26 27h-4c0 3-2 6-2 8 0 2.210938 1.789063 4 4 4 2.210938 0 4-1.789062 4-4 0-2-2-5-2-8zm-2 10c-1.105469 0-2-.894531-2-2s.894531-2 2-2 2 .894531 2 2-.894531 2-2 2z" fill="#4c4c4c"/></symbol>' +
        '<symbol id="image" viewBox="0 0 48 48"><path d="M40 41H8c-2.2 0-4-1.8-4-4V11c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v26c0 2.2-1.8 4-4 4z" fill="#1e88e5"/><path d="M38 16c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3z" fill="#fff59d"/><path d="M20 16L9 32h22L20 16z" fill="#e3f2fd"/><path d="M31 22l-8 10h16l-8-10z" fill="#cfdce5"/></symbol>' +
        '<symbol id="video" viewBox="0 0 48 48"><path d="M42 41V7H6v34zM12 18v4H8v-4zm0 8v4H8v-4zm0 8v4H8v-4zm0-24v4H8v-4zm28 8v4h-4v-4zm0 8v4h-4v-4zm0 8v4h-4v-4zm0-24v4h-4v-4z" fill="#3f51b5"/><path d="M30 24l-10-6v12z" fill="#fff"/></symbol>' +
        '<symbol id="audio" viewBox="0 0 48 48"><g fill="#e91e63"><path d="M28 33c0 4.96875-4.03125 9-9 9s-9-4.03125-9-9 4.03125-9 9-9 9 4.03125 9 9z"/><path d="M24 6v27h4V14l11 3v-7z"/></g></symbol>' +
        '<symbol id="folder" viewBox="0 0 48 48"><path d="M40 12H22l-4-4H8c-2.199219 0-4 1.800781-4 4v8h40v-4c0-2.199219-1.800781-4-4-4z" fill="#ffa000"/><path d="M40 12H8c-2.199219 0-4 1.800781-4 4v20c0 2.199219 1.800781 4 4 4h32c2.199219 0 4-1.800781 4-4V16c0-2.199219-1.800781-4-4-4z" fill="#ffca28"/></symbol>' +
        '<symbol id="text" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#efefef"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#cccccc"/><path class="st3" d="M16 21h17v2H16v-2zM16 27h17v2H16v-2zM16 33h13v2H16v-2z"/></symbol>' +
        '<symbol id="nfo" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#90caf9"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#e1f5fe"/><path fill="#1976d2" d="M16 21h17v2H16v-2zM16 27h17v2H16v-2zM16 33h13v2H16v-2z"/></symbol>' +
        '<symbol id="pdf" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#ff5722"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#fbe9e7"/><path d="M16 39c-.4 0-.7-.1-1-.2-1.1-.6-1.2-1.5-1-2.2.4-1.2 2.6-2.7 5.5-4 1.3-2.4 2.3-4.9 2.9-7-1-1.9-1.5-3.7-1.5-5 0-.7.2-1.3.5-1.8.4-.5 1-.8 1.8-.8.9 0 1.6.5 1.9 1.4.5 1.2.2 3.4-.5 5.9 1 1.7 2.2 3.3 3.5 4.5 1.9-.4 3.6-.6 4.7-.4 1.9.3 2.2 1.6 2.2 2.1 0 2.1-2.2 2.1-3 2.1-1.5 0-3-.6-4.3-1.7-2.4.6-4.8 1.4-6.7 2.3-1 1.7-2 3.1-2.9 3.9-.9.7-1.6.9-2.1.9zm1.2-2.9c-.5.3-.9.6-1.1.9.2-.1.6-.3 1.1-.9zm13.6-4.7c.4.1.8.2 1.2.2.6 0 .9-.1 1-.1-.1-.1-.8-.3-2.2-.1zm-7-3.6c-.4 1.2-1 2.5-1.5 3.7 1.2-.4 2.4-.8 3.6-1.1-.8-.8-1.5-1.7-2.1-2.6zm-.6-7.8h-.1c-.1.1-.2.8.2 2.3.1-1.2.1-2.1-.1-2.3z" fill="#fff"/></symbol>' +
        '<symbol id="ebook" viewBox="0 0 48 48"><path d="M38 5l-24-.003906c-2.207031 0-4.816406 1.070312-4.984375 6.003906H9v28l.019531-.054687C9.199219 42.585938 11.566406 43 12.605469 43H37c2 0 2-2 2-2V6c0-.554687-.445312-1-1-1z" fill="#7e57c2"/><path d="M36 36H12.605469C11.273438 36 11 37.117188 11 38.5c0 1.382813.273438 2.503906 1.605469 2.503906L36 41z" fill="#ffe0b2"/><path d="M12.605469 36c-1.164063 0-1.519531.859375-1.589844 2H36v-2z" fill="#e0b990"/><path d="M14 10.996094h21v5H14z" fill="#ffecb3"/><path d="M38 36h-2v7h1c2 0 2-2 2-2v-5.996094C39 35.554688 38.554688 36 38 36z" fill="#311b92"/></symbol>' +
        '<symbol id="windows" viewBox="0 0 48 48"><g fill="#03a9f4"><path d="M20 25H6v12.074219l14 1.917969zM20 9.101563L6 11.066406V23h14zM22 8.820313V23h20V6.011719zM22 25v14.269531l20 2.742188V25z"/></g></symbol>' +
        '<symbol id="torrent" viewBox="0 0 48 48"><path d="M42 38c0 2.210938-1.789062 4-4 4H10c-2.210937 0-4-1.789062-4-4V10c0-2.210937 1.789063-4 4-4h28c2.210938 0 4 1.789063 4 4z" fill="#4caf50"/><path d="M15.5 19l8.5-8.5 8.5 8.5zM15.5 30l8.5 8.5 8.5-8.5z" fill="#dcedc8"/><path d="M21 17h6v15h-6z" fill="#dcedc8"/></symbol>' +
        '<symbol id="bookmark"><path d="M24 13l2.898438 5.898438.902343 1.902343 2.097657.300782 6.5.898437-4.699219 4.601563-1.5 1.5.402344 2.097656 1.097656 6.5-5.800781-3.097656-1.898438-1-1.898437 1-5.800782 3.097656 1.097657-6.5.402343-2.097656-1.5-1.5L11.601563 22l6.5-.898437 2.097656-.300782.902344-1.902343L24 13m0-9l-6.5 13.199219L3 19.300781 13.5 29.5 11 44l13-6.800781L37 44l-2.5-14.5L45 19.300781l-14.5-2.101562z" fill="#ffca28"/></symbol>' +
        '<symbol id="bookmark-added"><path d="M24 4.050781L30.488281 17.1875 45 19.289063 34.5 29.511719l2.476563 14.4375L24 37.136719l-12.976562 6.8125L13.5 29.511719 3 19.289063 17.511719 17.1875z" fill="#ffca28"/></symbol>' +
        '</svg>';

    // Build toolbar object
    var toolbar = '<div class="customeyes-toolbar" style="display: none;">' +
        '<div class="settings-group">' +
        '<h3>Icons</h3>' +
        '<div class="option-group"><input type="checkbox" id="enable-icons"> <label for="enable-icons">Enable</label></div>' +
        '<div class="option-group"><input type="checkbox" id="colored-icons"> <label for="colored-icons">Colored</label></div>' +
        '</div>' +
        '<div class="settings-group">' +
        '<h3>Bookmarks</h3>' +
        '<div class="option-group"><input type="checkbox" id="enable-bookmarks"> <label for="enable-bookmarks">Bookmarks</label></div>' +
        '<div class="option-group"><input type="checkbox" id="show-bookmarks-list"> <label for="show-bookmarks-list">Bookmarks List</label></div>' +
        '</div>' +
        '<div class="settings-group">' +
        '<h3>Misc.</h3>' +
        '<div class="option-group"><input type="checkbox" id="cust-disabled"> <label for="cust-disabled">Customization Disabled</label></div>' +
        '<div class="option-group"><input type="checkbox" id="focus-highlight"> <label for="focus-highlight">Hover/Focus Highlight</label></div>' +
        '</div>' +
        '</div>';

    // File formats
    var videos = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'gifv', 'mng', 'avi', 'mov', 'wmv', 'yuv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4v', 'mpg', 'mpeg', 'mpv', 'm2v', '3gp', 'nsv', 'flv', 'f4v'],
        audio = ['wav', 'aiff', 'au', 'pcm', 'mp3', 'flac', 'm4a', 'wma', 'webm'],
        archives = ['zip', '7z', 'tar', 'targz', 'bz2', 'gz', 'lz', 'lzma', 'lzo', 'rz', 'sfark', 'z', 'ace', 'apk', 'arc', 'cab', 'lzh', 'pak', 'rar', 'sfx', 'sit'],
        images = ['jpg', 'jpeg', 'tiff', 'exif', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'pcx', 'tga'],
        discImages = ['iso', 'bin', 'cue', 'ciso', 'nrg', 'mdf', 'mds', 'img'],
        ebooks = ['cbr', 'cbz', 'cb7', 'cbt', 'cba', 'djvu', 'epub', 'fb2', 'ibook', 'azw', 'lit', 'prc', 'mobi', 'pdb'];

    //$('pre').before('<style type="text/css">' + css + '</style>');

    if ($customizationdisabled == false) {
        // Add class and prepend toolbar to file list
        $('pre').addClass('customeyes-files').before(toolbar).before(icons);
    } else {
        // Add class and prepend toolbar to file list
        $('pre').before(toolbar).before(icons);
        $('#cust-disabled').prop('checked', true);
    }



    var $customeyesFiles = $('.customeyes-files');

    // Toggle toolbar options
    $('body').on('click', '#enable-icons', function() {
        $customeyesFiles.toggleClass('icons-enabled');

        if ( $customeyesFiles.hasClass('icons-enabled') ) {
            localStorage.setItem('icons-enabled', true);
        }
        else {
            localStorage.setItem('icons-enabled', false);
        }
    });

    $('body').on('click', '#colored-icons', function() {
        $customeyesFiles.toggleClass('colored-icons');

        if ( $customeyesFiles.hasClass('colored-icons') ) {
            localStorage.setItem('colored-icons', true);
        }
        else {
            localStorage.setItem('colored-icons', false);
        }
    });

    $('body').on('click', '#cust-disabled', function() {
        $customeyesFiles.toggleClass('cust-disabled');

        if ( $customeyesFiles.hasClass('cust-disabled') ) {
            localStorage.setItem('cust-disabled', true);
        }
        else {
            localStorage.setItem('cust-disabled', false);
        }
        location.reload();
    });

    $('body').on('click', '#focus-highlight', function() {
        $customeyesFiles.toggleClass('focus-highlight');

        if ( $customeyesFiles.hasClass('focus-highlight') ) {
            localStorage.setItem('focus-highlight', true);
        }
        else {
            localStorage.setItem('focus-highlight', false);
        }
    });

    $('body').on('click', '#enable-bookmarks', function() {
        $('html').toggleClass('bookmarks-enabled');

        if ( $('html').hasClass('bookmarks-enabled') ) {
            localStorage.setItem('bookmarks-enabled', true);
        }
        else {
            localStorage.setItem('bookmarks-enabled', false);
        }
    });

    $('body').on('click', '#show-bookmarks-list', function() {
        $('html').toggleClass('show-bookmarks-list');

        if ( $('html').hasClass('show-bookmarks-list') ) {
            localStorage.setItem('show-bookmarks-list', true);
        }
        else {
            localStorage.setItem('show-bookmarks-list', false);
        }
    });

    $('body').on('focus', '.customeyes-files .name', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('focusout', '.customeyes-files .name', function() {
        $(this).parent().removeClass('focus');
    });


    if ($customizationdisabled == false) {

        // Add class to file URLs
        $('pre a:not(:first-child)').addClass('name');


        // Find and wrap date/time and file size with span tags
        $customeyesFiles.contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            $(this).replaceWith( $(this).text().replace(/([0-9]{1,2}-[a-zA-Z]{3}-[0-9]{4} [0-9]{2}:[0-9]{2})/, '<span class="date-time">$1</span>') );
        });

        $customeyesFiles.contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            $(this).replaceWith( $(this).text().replace(/([0-9-].*)/, '<span class="size">$1</span>') );
        });


        // Wrap each single file with a container
        $('.name').each(function() {
            $(this).nextUntil('.name').addBack().wrapAll('<div class="single-item"/>');
        });

        // Show full file name
        $('pre a:not(:first)').each(function(){
            var url = $(this).attr('href');
            var decodedUrl = decodeURIComponent(url);

            $(this).text( decodedUrl );
        });


        // Add item type
        $('.size').each(function(){
            if ( $(this).text() == '-' ) {
                $(this).parent().addClass('directory');
                $(this).parent().find('.name').prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="folder" xlink:href="#folder" /></svg>');
            }
            else {
                $(this).parent().addClass('file');
            }
        });


        $('.file .name').each(function() {
            var file = $(this).text();
            var extension = file.substr( (file.lastIndexOf('.') + 1) ).toLowerCase();

            if ( file.match('tar\.gz') ) {
                $(this).parent().addClass('mimetype-tar' + extension);
                $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="archive" xlink:href="#archive" /></svg>');
            }
            else {
                $(this).parent().addClass('mimetype-' + extension);

                if ( extension == 'txt' || extension == 'srt' || extension == 'sub' ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="text" xlink:href="#text" /></svg>');
                }
                else if ( extension == 'pdf' ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="pdf" xlink:href="#pdf" /></svg>');
                }
                else if ( extension == 'exe' ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="windows" xlink:href="#windows" /></svg>');
                }
                else if ( extension == 'torrent' ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="torrent" xlink:href="#torrent" /></svg>');
                }
                else if ( extension == 'nfo' ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="nfo" xlink:href="#nfo" /></svg>');
                }
                else if ( $.inArray(extension, ebooks) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="ebook" xlink:href="#ebook" /></svg>');
                }
                else if ( $.inArray(extension, images) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="image" xlink:href="#image" /></svg>');
                }
                else if ( $.inArray(extension, videos) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="video" xlink:href="#video" /></svg>');
                }
                else if ( $.inArray(extension, audio) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="audio" xlink:href="#audio" /></svg>');
                }
                else if ( $.inArray(extension, archives) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="archive" xlink:href="#archive" /></svg>');
                }
                else if ( $.inArray(extension, discImages) != -1 ) {
                    $(this).prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="disc-image" xlink:href="#disc-image" /></svg>');
                }
            }
        });


        // Bookmarks
        // Add bookmark icons to files/directories
        var bookmarkUrl = '',
            bookmarkName = '',
            bookmarkDate = '',
            bookmarkSize = '';

        $('.single-item').each(function() {
            bookmarkName = decodeURIComponent( $(this).find('.name').attr('href') );
            bookmarkUrl = $(this).find('.name').prop('href');
            bookmarkDate = $(this).find('.date-time').text();
            bookmarkSize = $(this).find('.size').text();
            var bookmarkIcon = '<button class="bookmark" data-bookmark-name="' + bookmarkName + '" data-bookmark-url="' + bookmarkUrl + '" data-bookmark-date="' + bookmarkDate + '" data-bookmark-size="' + bookmarkSize + '">' +
                '<span>Bookmark</span>' +
                '</button>';

            $(this).prepend( bookmarkIcon );
        });

        // Create bookmarks list
        var bookmarksList = '<div class="bookmarks-list">' +
            '<ul></ul>' +
            '</div>';

        $('.customeyes-toolbar').after(bookmarksList);

        // Create bookmarks object
        var bookmarks = [];

        $('body').on('click', '.bookmark', function() {
            updateBookmarks($(this));
        });

        function updateBookmarks($this) {
            var $bookmarksList = $('.bookmarks-list');
            var bookmark = {};

            bookmark.bookmark = $this.data('bookmark-url');
            bookmark.name = $this.data('bookmark-name');
            bookmark.date = $this.data('bookmark-date');
            bookmark.size = $this.data('bookmark-size');

            var bookmarkHTML = '<li class="bookmark-item" data-bookmark-url="' + bookmark.bookmark + '">' +
                '<p class="name">' + bookmark.name + '</p>' +
                '<p class="url"><a href="' + bookmark.bookmark + '">' + bookmark.bookmark + '</a></p>' +
                '</li>';

            $bookmarksList.find('ul').append(bookmarkHTML);

            if ( $this.hasClass('added') ) {
                $this.removeClass('added');

                $bookmarksList.find('[data-bookmark-url="' + $this.data('bookmark-url') + '"]').remove();

                var remove = $this.data('bookmark-url');

                bookmarks = bookmarks.filter(function(val) {
                    return (remove.indexOf(val.bookmark) == -1 ? true : false)
                });
            }
            else {
                $this.addClass('added');

                bookmarks.push(bookmark);
            }

            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }

    }

    // Load settings on page load

    if ( localStorage.getItem('icons-enabled') == 'true' ) {
        $('#enable-icons').prop('checked', true);
        $customeyesFiles.addClass('icons-enabled');
    }

    if ( localStorage.getItem('colored-icons') == 'true' ) {
        $('#colored-icons').prop('checked', true);
        $customeyesFiles.addClass('colored-icons');
    }

    if ( localStorage.getItem('focus-highlight') == 'true' ) {
        $('#focus-highlight').prop('checked', true);
        $customeyesFiles.addClass('focus-highlight');
    }

    if ( localStorage.getItem('bookmarks-enabled') == 'true' ) {
        $('#enable-bookmarks').prop('checked', true);
        $('html').addClass('bookmarks-enabled');
    }

    if ( localStorage.getItem('show-bookmarks-list') == 'true' ) {
        $('#show-bookmarks-list').prop('checked', true);
        $('html').addClass('show-bookmarks-list');
    }

    if ( localStorage.getItem('bookmarks') ) {
        bookmarks = $.parseJSON(localStorage.getItem('bookmarks'));

        $(bookmarks).each(function(i,val){
            $('.single-item .bookmark[data-bookmark-url="' + val.bookmark + '"]').addClass('added');

            var bookmarkHTML = '<li class="bookmark-item" data-bookmark-url="' + val.bookmark + '">' +
                '<p class="name">' + val.name + '</p>' +
                '<p class="url"><a href="' + val.bookmark + '">' + val.bookmark + '</a></p>' +
                '</li>';

            $('.bookmarks-list').find('ul').append(bookmarkHTML);
        });
    }

})(jQuery);
