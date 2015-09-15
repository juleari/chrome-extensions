(function(){
    var _playerId = 0;

    window.RL = window.RL || {};

    /**
     * @constructor
     **/
    window.RL.MP3layer = function(params){
        var self =  this,
            callbacks = {},
            _runCallbacks,
            playerId = ++_playerId;
        
        this._audioElement = document.createElement('audio');
        this._audioElement.preload = 'auto';
        this.type = 'html5';
        this.i = 0;

        document.body.appendChild( this._audioElement );

        this.bind = function(evtName, callback){
            this._audioElement.addEventListener(evtName, callback);
        };

        this.bind('error', function(evt){
            window.isErr = 1;
            console.log(evt, 'isErr: ', window.isErr);
            window.radio.refresh();
        });
        
        this.rem = function(evtName){
            this._audioElement.removeEventListener(evtName, this);
        }
    }

    window.RL.MP3layer.prototype = {
        play: function(){
            this._audioElement.play();
            return this;
        }, 
        stop: function(){
            this._audioElement.pause();
            return this;
        },
        setUrl: function(url){
            this._audioElement.src = url;
            return this;
        },
        setVolume: function(volume){
            this._audioElement.volume = volume/100;
            return this;
        }
    };
})();