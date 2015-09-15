(function(){
    ajax = function(login, password, remember){
        $.ajax({
            url: 'http://informers.rambler.ru/login/?version=3.0',
            type: "POST",
            data: {login: login, password: password, remember: remember},
            success: function(){
                console.log(arguments);
                window.close();
            },
            error: function(xhr){
                if(xhr.status === 401){
                    document.getElementById('password').value = '';
                    var elem = ('<label for="password" id="password-error" class="b-error b-balloon b-balloon--error m-balloon__on"><i class="b-balloon--arrow"></i><span class="b-balloon--text">Неправильный&nbsp;логин (или&nbsp;пароль)</span></label>');
                    $('.m-login--form').eq(1).append(elem);
                }
                else {
                    $('.b-auth--container').addClass('b-wid_error');
                }
            }
        });
    }
    
    butt = function(){
        $('.b-wid_error').removeClass('b-wid_error');
        var fieldsets = $('.m-login--form');
        if(document.getElementById('login').value.length == 0){
            var elem = $('<label for="login" id="login-error" class="b-balloon b-balloon--error  m-balloon__on"><i class="b-balloon--arrow"></i><span class="b-balloon--text"><i class="i-img i-img--error m-img--balloon"></i>Введите ваш логин</span></label>');
            $('.r--group').addClass('r--input__error');
            fieldsets.eq(0).append(elem);
            $('.b-auth--container').removeClass('b-wid_loader');
        } else {
            var label = $('#login-error');
            if (label) { 
                label.remove();
                $('.r--group').removeClass('r--input__error');
            }
            
            if($('#password').val().length == 0){
                var elem = $('<label for="password" id="password-error" class="b-balloon b-balloon--error  m-balloon__on"><i class="b-balloon--arrow"></i><span class="b-balloon--text"><i class="i-img i-img--error m-img--balloon"></i>Введите ваш пароль</span></label>');
                $('#password').addClass('r--input__error');
                fieldsets.eq(1).append(elem);
            } else {
                label = $('#password-error');
                if (label) {
                    label.remove();
                    $('#password').removeClass('r--input__error');
                }
                ajax (
                    $('#login').val() + $('#select-domain-name').text(),
                    $('#password').val(),
                    ($('#long-session').prop('checked')) ? 1 : 0
                );
            }
            $('.b-auth--container').removeClass('b-wid_loader');
        }
    }
    
    $(document).on({
        click: function(){
            butt();
        }
    }, '.r--button_invisible');
    
    $(window).keypress (function(e){
            if (e.keyCode == 13) {
                butt();
        }
    });
    
    $(document).ready(function(){
        $("#login").focus();
        
        var evt = document.createEvent("KeyboardEvent");
            var a = evt.initKeyboardEvent("keypress", true, true, null, "Tab");
            
        var login = document.getElementById("login");
        
        login.dispatchEvent(evt);
        
        $("#login").focus();
    });
    
    $(document).on({
        click : function(){
            $('.b-auth--container').removeClass('b-wid_error');
            $('.b-auth--container').addClass('b-wid_loader');
            butt();
        }
    }, '.g-btn');
    
})();