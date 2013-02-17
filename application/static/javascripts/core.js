
/* notification */
var KNotification = KNotification || {
    width: 250,
    height: 75,
    prefix: 'n_',
    increment_id: 0,
    queue: [],
    hide: function (nid) {
        for (var index = 0; index < KNotification.queue.length; index ++) {
            var item = KNotification.queue.shift();
            if (item == nid) { break; }
            else { KNotification.queue.push(item); }
        }
        var remove_top = parseInt($('#' + nid).css('top'));
        $('#' + nid).animate({ right: -KNotification.width }, 400, 'easeInExpo', function () {
            $(KNotification.queue).each(function (index) {
                var top = parseInt($('#' + KNotification.queue[index]).css('top'));
                if (top > remove_top) {
                    top = $('#' + KNotification.queue[index]).attr('top') == undefined ? top - KNotification.height : parseInt($('#' + KNotification.queue[index]).attr('top')) - KNotification.height;
                    $('#' + KNotification.queue[index]).attr('top', top);
                    $('#' + KNotification.queue[index]).dequeue();
                    $('#' + KNotification.queue[index]).animate({ top: top }, 400, 'easeOutExpo');
                }
            });
            $(this).remove();
        });
    },
    pop: function (arg) {
        var arg = arg || {};
        arg.expire = arg.expire || 5000;
        arg.title = arg.title || '';
        arg.message = arg.message || '';
        var nid = KNotification.prefix + ++KNotification.increment_id;
        var box = $('<div id="' + nid + '" class="knotification"><div class="ntitle">' + arg.title + '</div><div class="nmessage">' + arg.message + '</div></div>');
        var top = KNotification.queue.length * KNotification.height;
        KNotification.queue.push(nid);
        $('body').append(box);
        $('#' + nid).css('right', -KNotification.width);
        $('#' + nid).css('top', top);

        // insert notification
        $('#' + nid).animate({ right: 0 }, 400, 'easeOutExpo', function () {
            if (arg.expire >= 0) {
                setTimeout(function () {
                    // remove notification
                    KNotification.hide(nid);
                }, arg.expire);
            }
        });

        return nid;
    }
};


/* core */
var noop = function () { };
var takanashi = takanashi || {
    text_loading: 'Loading...',
    is_ie: false,
    get_url_vars: function (key) {
        var result;
        var parts = location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,skey,value) {
            if (key == skey) {
                result = value;
                return;
            }
        });
        return result;
    },
    // みこ ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    pop_state: function (state) {
        if (state) {
            $('.modal.in').modal('hide');
            takanashi.nav_select(state.nav_select_index);
            takanashi.miko(state, false);
        }
    },
    miko: function(state, push) {
        var before_index = $('#nav_bar li.select').index();
        $.ajax({ url: state.href,
            type: 'get',
            data: state.data,
            cache: false,
            beforeSend: function (xhr) {
                var index = state.href == '/' ? 1 : $('#nav_bar li a[href*="' + state.href + '"]').parent().index();
                takanashi.nav_select(index);

                xhr.setRequestHeader('X-Miko', 'miko');
                takanashi.loading_on(takanashi.text_loading);
            },
            error: function (xhr) {
                takanashi.loading_off();
                takanashi.error_message();
                takanashi.nav_select(before_index);
            },
            success: function (result) {
                takanashi.loading_off();
                var miko = result.match(/<!miko>/);
                if (!miko) {
                    // the result is not miko content
                    location.reload();
                    return;
                }

                var title = result.match(/<title>(.*)<\/title>/);
                result = result.replace(title[0], '');
                document.title = title[1];
                var content = result.match(/\s@([#.]?\w+)/);
                if (content) {
                    $(content[1]).html(result.replace(content[0], ''));
                }
                takanashi.setup_datetime();
                takanashi.setup_focus();
                takanashi.setup_tooltip();

                if (push) {
                    if (state.href != location.pathname || location.href.indexOf('?') >= 0) {
                        state.nav_select_index = $('#nav_bar li.select').index();
                        history.pushState(state, document.title, state.href);
                    }
                    $('html,body').animate({scrollTop: (0)}, 500, 'easeOutExpo');
                }
                else {
                    takanashi.nav_select(state.nav_select_index);
                }
            }
        });
    },
    setup_link: function() {
        // link
        $(document).on('click', 'a:not([href*="#"])', function (e) {
            // menu
            if ($(this).parent().hasClass('active')) { return false; }

            // open in a new tab
            if (e.metaKey) { return; }

            var href = $(this).attr('href');
            if (href && !$(this).attr('target')) {
                takanashi.miko({ href: href }, true);
                return false;
            }
        });
        // from get
        $(document).on('submit', 'form[method=get]:not([action*="#"])', function () {
            var href = $(this).attr('action') + '?' + $(this).serialize();
            takanashi.miko({ href: href }, true);
            return false;
        });
        // from post
        $(document).on('submit', 'form[method=post]:not([action*="#"])', function () {
            if (takanashi.validation($(this))) {
                var href = $(this).attr('action');
                takanashi.miko({ href: href, data: $(this).serialize() }, false);
            }
            return false;
        });
    },

    error_message: function () {
        KNotification.pop({ title: 'Failed', message: 'Loading failed, please try again later.' });
    },

    // validation ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    validation: function ($form) {
        var success = true;
        $form.find('input').each(function () {
            var validation = $(this).attr('validation');
            if (validation && validation.length > 0) {
                if ($(this).val().match(validation)) {
                    $(this).closest('.control-group').removeClass('error');
                    $(this).parent().find('.error_msg').remove();
                }
                else {
                    $(this).closest('.control-group').addClass('error');
                    $(this).parent().find('.error_msg').remove();
                    if ($(this).attr('msg')) {
                        $(this).parent().append($('<label for="' + $(this).attr('id') + '" class="error_msg help-inline">' + $(this).attr('msg') + '</label>'));
                    }
                    success = false;
                }
            }
        });

        return success;
    },

    // datetime ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_datetime: function () {
        $('.datetime').each(function () {
            var date = new Date($(this).attr('datetime'));
            $(this).html(date.toFormat($(this).attr('format')));
        });
    },

    // focus ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_focus: function () {
        $('.focus').select();
    },

    // tool tip ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_tooltip: function () {
        $("[rel='tooltip']").tooltip();
    },

    // loading ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    loading_on: function (message) {
        $('body').css('cursor', 'wait');
        $('a').css('cursor', 'wait');
        $('.table-pointer tbody tr').css('cursor', 'wait');
        if (takanashi.is_ie) { return; }
        if ($('#loading').length > 0) {
            $('#loading .message').html(message);
            return;
        }
        var loading = $('<div id="loading"><div class="spin"></div><div class="message">' + message + '</div><div class="clear"></div></div>');
        $('body').append(loading);
        var loading_height = $('#loading').height();
        $('#loading').css('bottom', -loading_height);
        $('#loading').animate({ bottom: '+=' + (loading_height + 10) }, 400, 'easeOutExpo');
        Spinner({ color: '#444', width: 2, length: 4, radius: 4 }).spin($('#loading .spin')[0]);
    },
    loading_off: function () {
        $('body').css('cursor', 'default');
        $('a').css('cursor', 'pointer');
        $('.table-pointer tbody tr').css('cursor', 'pointer');
        if (takanashi.is_ie) { return; }
        $('#loading').dequeue();
        var loading_height = $('#loading').height() + 10;
        $('#loading').animate({ bottom: '-=' + loading_height }, 400, 'easeInExpo', function () {
            $('#loading').remove();
        });
    },

    // nav ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    nav_select: function (index) {
        if (index > 0 && !$($('#nav_bar li')[index]).hasClass('select')) {
            $('#nav_bar li').removeClass('select');
            $($('#nav_bar li')[index]).addClass('select');
            $($('#nav_bar li')[index]).mouseover();
        }
    },
    setup_nav: function () {
        var match = location.href.match(/\w(\/\w*)/);
        if (match) {
            var index = match[1] == '/' ? 0 : $('#nav_bar li a[href*="' + match[1] + '"]').parent().index();
            $('#nav_bar li').removeClass('select');
            $($('#nav_bar li')[index]).addClass('select');
        }

        $('#nav_bar li.select').parent().prepend($('<li class="top"></li>'));
        $('#nav_bar li.top').css('width', $('#nav_bar li.select').css('width'));
        $('#nav_bar li.top').css('left', $('#nav_bar li.select').position().left);
        $('#nav_bar li.top').css('top', $('#nav_bar li.select').position().top);

        $('#nav_bar li[class!=top]').hover(function () {
            $('#nav_bar li.top').each(function () {
                $(this).dequeue();
            }).animate({
                    width: this.offsetWidth,
                    left: this.offsetLeft
                }, 420, "easeInOutCubic");
        }, noop);
        $('#nav_bar').hover(noop, function () {
            $('#nav_bar li.top').each(function () {
                $(this).dequeue();
            }).animate({
                    width: $('#nav_bar li.select').css('width'),
                    left: $('#nav_bar li.select').position().left
                }, 420, "easeInOutCubic");
        });
    },

    // nav custom ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    change_nav: function(app_id) {
        $('#nav_bar a[href^="/crash_groups"]').attr('href', '/crash_groups/' + app_id);
        $('#nav_bar a[href^="/exception_groups"]').attr('href', '/exception_groups/' + app_id);
        $('#nav_bar a[href^="/log_groups"]').attr('href', '/log_groups/' + app_id);
    },

    // events of views ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    register_event_account: {
        update_profile: function () {
            // update profile
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_profile', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'put', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            KNotification.pop({ 'title': 'Success!', 'message': 'Data had be Saved.' });
                            $('#name').val(result.name);
                            $($('.profile p')[0]).text(result.name);
                        }
                        else {
                            KNotification.pop({ 'title': 'Failed!', 'message': 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        }
    },
    register_event_application: {
        invite_user: function () {
            // invite a user with the application
            //  url = $(this).attr('href')
            //  email = $(this).closest('.input-append').find('input[type=text]')
            $(document).on('click', 'a.invite', function () {
                if (!takanashi.validation($(this).closest('.input-append'))) { return false; }

                var $application_form = $(this).closest('form');
                var $invite_email = $(this).closest('.input-append').find('input[type=text]');

                $.ajax({ type: 'post', url: $(this).attr('href'), dataType: 'json', cache: false,
                    data: { email: $invite_email.val() },
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            $($application_form).modal('hide');
                            KNotification.pop({ 'title': 'Success!', 'message': $invite_email.val() + ' will get a invited email.' });
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            $invite_email.closest('.control-group').addClass('error');
                        }
                    }
                });

                return false;
            });
            $(document).on('keypress', 'input.invite', function (e) {
                if (e.keyCode == 13) {
                    $('a.invite').click();
                    return false;
                }
            });
        },
        delete_viewer: function () {
            // delete a viewer in an application
            //  url = $(this).attr('href')
            $(document).on('click', 'a.delete_viewer', function () {
                var $member_div = $(this).closest('div');

                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            $member_div.remove();
                        }
                    }
                });

                return false;
            });
        },
        show_modal_for_add_application: function () {
            // show adding application modal
            $(document).on('keypress', 'input.appended_input_application', function (e) {
                if (e.keyCode == 13) {
                    $(this).parent().find('a').click();
                    return false;
                }
            });
            $(document).on('click', 'a[href="#form_add_application"]', function () {
                $('#name').val($('.appended_input_application').val());
                setTimeout("$('#name').focus();", 500);
            });
        },
        add_application: function () {
            // add an application
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_add_application', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'post', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        },
        update_application: function () {
            // update the application
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form.form_application', function () {
                if (!takanashi.validation($(this).find('.modal-body'))) { return false; }

                $.ajax({ type: 'put', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ 'title': 'Failed!', 'message': 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        },
        delete_application: function () {
            // delete the application
            //  url = $(this).attr('href')
            //  application_id = $(this).attr('application_id')
            //  application_name = $(this).attr('application_name')
            $(document).on('click', 'a.delete_application', function () {
                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    data: { id: $(this).attr('document_id') },
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        }
    },
    register_event_user: {
        add_user: function () {
            // add a new user to Takanashi
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_add_user', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'post', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        },
        delete_user: function () {
            // delete the user
            //  url = $(this).attr('href')
            $(document).on('click', 'a.delete_user', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        }
    },
    register_event_document: {
        click_document_group: function () {
            // click document group then go to documents view
            //  url = $(this).attr('href')
            $(document).on('click', 'tr.document_group', function () {
                takanashi.miko({ 'href': $(this).attr('href') }, true);
                return false;
            });
        }
    },
    setup_events: function () {
        // all setup event object should be a member in takanashi{}, and name 'register_event_xxxx'
        // all functions in setup event objects will be execute on document.ready()
        for (var member in takanashi) {
            if (member.indexOf('register_event_') == 0) {
                for (var fn in takanashi[member]) {
                    if (typeof takanashi[member][fn] == "function") {
                        // execute
                        takanashi[member][fn]();
                    }
                }
            }
        }
    }
};
takanashi.is_ie = navigator.userAgent.toLowerCase().indexOf('msie') != -1;

$(document).ready(function () {
    takanashi.setup_nav();
    takanashi.setup_link();

    // set up events of views
    takanashi.setup_events();

    // that will be execute after miko call
    // set up datetime display
    takanashi.setup_datetime();
    takanashi.setup_focus();
    takanashi.setup_tooltip();
});