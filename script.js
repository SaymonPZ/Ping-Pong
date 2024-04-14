const canvasEl = document.querySelector("canvas");
        const ctx = canvasEl.getContext("2d");  
        const gapX =  15;
        const mouse = {x: 0, y: 0};


        const field = { //desenha o campo
            w: window.innerWidth,
            h: window.innerHeight,
            draw: function(){ // desenha o fundo                
                ctx.fillStyle = "#101820";
                ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            }
        }
        const centerLine = { //desenha a linha central
            w: 15,
            h: window.innerHeight,
            x: (window.innerWidth / 2) - (15/2),
            y: 0,
            draw: function(){
                ctx.fillStyle = "white";
                ctx.fillRect(this.x, this.y, this.w, this.h);
            }
        }
        const player = { //propriedades do player
            w: centerLine.w, // largura
            x: gapX,
            y: 0, // inicio posição y
            h: 200, // atLineura
            draw: function(){
                ctx.fillStyle = "white";
                ctx.fillRect(this.x, this.y, this.w, this.h);
                this._move();
            },
            _move: function(){
                this.y = mouse.y - this.h / 2
            }
        }
        const rival = { //propriedades do bot
            w: centerLine.w, // largura
            x: window.innerWidth - centerLine.w - gapX,
            y: 0, // inicio posição y
            h: 200, // atLineura
            speed: 3,
            color: "white",
            draw: function(){
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.w, this.h);

                this._move();
            },
            _move: function(){
                if((this.y + this.h / 2 < ball.y + ball.r)){
                    this.y += this.speed;
                } else{
                    this.y -= this.speed;
                }
            },
            _speedUp: function(){
                if(this.speed < 10){
                    this.speed += 1;
                } else{
                    this.color = "#CE0058";
                }
            }
        }
        const ball = { //propredades da bola
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 20,
            color: "#91D6AC",
            speed: 2,
            directionY: Math.random() * 2 - 1,
            directionX: 1,
            draw: function(){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 2 * Math.PI, false);
                ctx.fill();
                this._move();
                this._calcPosition();
            },
            _calcPosition: function(){
                //verifica se a bolinha bateu nas pareces laterais superiores e inferiores

                if(((this.y > (field.h - this.r)) && this.directionY > 0)||((this.y < 0 + this.r) && this.directionY < 0)){
                    this._invertDirectionY();
                }

                //verifica se o jogador fez o ponto

                if(this.x > field.w - this.r - rival.w - gapX) {
                    if((this.y + this.r > rival.y) && (this.y - this.r < rival.y + rival.h)){;
                        this._invertDirectionX();
                        this._speedUp();
                    }
                    else {
                        placar._includPlayerPoint();
                        this._point();
                    }   

                } else if(this.x < this.r + player.w + gapX){
                    if((this.y + this.r > player.y) && (this.y - this.r < player.y + player.h)){;
                        this._invertDirectionX();
                        this._speedUp();
                        this._impactDirectionsPlayer();
                    }
                    else {
                        placar._includRivalPoint();
                        this._point();
                    }
                }
            },
            _invertDirectionY: function(){
                this.directionY *= -1;
            },
            _invertDirectionX: function(){
                this.directionX *= -1;
            },
            _move: function(){
                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;
            },
            _point: function(){
                this.x = window.innerWidth / 2;
                this.y = window.innerHeight / 2;
                this.speed = 2;
                this.color = "#91D6AC";
                rival.color = "white";
                rival._speedUp();
                this._randonDirection();
            },
            _speedUp: function(){
                if(this.speed < 15){
                    this.speed += 0.5;
                } else{
                    this.color = "#c82124";
                }
            },
            _randonDirection: function(){
                this.directionY = Math.random() * 2 - 1;
            },
            _impactDirectionsPlayer: function(){
                this.directionY = ((ball.y - player.y) - 100) / 100;
                this.directionX = math.cos
            }
        }
        const placar = { //desenha placar
            playerPoints: 0,
            rivalPoints: 0,
            draw: function(){
                ctx.font = "bold 72px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = "#01341D";
                ctx.fillText (this.playerPoints, window.innerWidth / 4, 20)
                ctx.fillText (this.rivalPoints, window.innerWidth / (4/3), 20)
        
            },
            _includPlayerPoint: function(){
                this.playerPoints++;
            },
            _includRivalPoint: function(){
                this.rivalPoints++;
            }
        }

        function setup(){
            canvasEl.width = ctx.width = window.innerWidth;
            canvasEl.height = ctx.height = window.innerHeight;
        }
        function draw(){
            field.draw()
            centerLine.draw()
            player.draw()
            rival.draw()
            ball.draw()
            placar.draw()
        }


        window.animateFrame = (function(){
            return (
                window.requestAnimationFrame || 
                window.webkitRequestAnimationFrameAnimation ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback){
                    return window.setTimeout(callback, 1000 / 60);
                }
            ) 
        })()

        function main(){
            animateFrame(main);
            draw();

        }

        setup();
        main();

        canvasEl.addEventListener("mousemove", function(e){
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });