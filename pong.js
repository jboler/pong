'use strict';

(function (window, document) {

class Bat {
  constructor(ctx, data, gameWidth, batY) {
    this.ctx = ctx;
    this.data = data;
    this.gameWidth = gameWidth;
    this.width = gameWidth / 10;
    this.height = 2;
    this.x = 0;
    this.y = batY - this.height - 2;
    this.isTopBat = this.y < 10;
  }
  
  draw() {
    this.x = this.gameWidth * this.data.batX - this.width / 2;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  hitsBall(ball) {
    const x2 = this.x + this.width;
    return ball.x >= this.x && ball.x <= x2 && this.hitsBallY(ball);
  }
  
  hitsBallY(ball) {
    if (this.isTopBat) {
      return ball.y <= this.y && ball.y >= this.y - 2;
    } else {
      return ball.y >= this.y && ball.y <= this.y + 2;
    }
  }
}

class Swiper {
  constructor(playerData, id) {
    this.playerData = playerData;
    this.element = document.getElementById(id);
    this.rect = this.element.getBoundingClientRect();
    
    this.element.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.updateBatPos(e.targetTouches[0].pageX);
    });
  }
  
  updateBatPos(touchX) {
    this.playerData.batX = (touchX - this.rect.left) / this.rect.width;
  }
  
  updateScore() {
    this.element.textContent = this.playerData.score;
  }
}

class Ball {
  constructor(ctx, maxX, maxY, game) {
    this.ctx = ctx;
    this.maxX = maxX - 1;
    this.maxY = maxY - 1;
    this.game = game;
    this.xDir = 1;
    this.yDir = 1;
    this.reset();
  }
  
  draw() {
    this.ctx.fillRect(this.x, this.y, 2, 2);
  }
  
  move() {
    if (this.x >= this.maxX || this.x <= 0) this.xDir *= -1;
    if (this.game.batA.hitsBall(this) || this.game.batB.hitsBall(this)) {
      this.yDir *= -1;
      this.speed += 0.1;
    }
    if (this.y <= 0) this.score(this.game.playerBData);
    if (this.y >= this.maxY) this.score(this.game.playerAData);
    this.x += this.xDir * this.speed;
    this.y += this.yDir * this.speed;
  }
  
  score(playerData) {
    playerData.score += 1;
    this.game.updateScores();
    this.reset();
  }
  
  reset() {
    this.speed = 1;
    this.x = this.maxX / 2;
    this.y = this.maxY / 2;
  }
}

class Game {
  constructor(id = 'game') {
    this.element = document.getElementById(id);
    this.ctx = this.element.getContext('2d');
    this.ctx.fillStyle = 'white';
    this.width = this.element.width;
    this.height = this.element.height;
    this.playerAData = { batX: 0.5, score: 0 };
    this.playerBData = { batX: 0.5, score: 0 };
    this.swiperA = new Swiper(this.playerAData, 'swiperA');
    this.swiperB = new Swiper(this.playerBData, 'swiperB');
    this.batA = new Bat(this.ctx, this.playerAData, this.width, 6);
    this.batB = new Bat(this.ctx, this.playerBData, this.width, this.height);
    this.ball = new Ball(this.ctx, this.width, this.height, this);
    this.run();
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.batA.draw();
    this.batB.draw();
    this.ball.move();
    this.ball.draw();
    this.run();
  }
  
  updateScores() {
    this.swiperA.updateScore();
    this.swiperB.updateScore();
  }
  
  run() {
    window.requestAnimationFrame(() => this.draw());
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  const game = new Game();
});

})(window, document);
