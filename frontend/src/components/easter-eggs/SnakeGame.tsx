// frontend/src/components/easter-eggs/SnakeGame.tsx
import React, { useEffect, useRef } from 'react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const COLS = 26;
    const ROWS = 26;
    const EMPTY = 0;
    const SNAKE = 1;
    const FRUIT = 2;
    const LEFT = 0;
    const UP = 1;
    const RIGHT = 2;
    const DOWN = 3;
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    
    let frames = 0;
    let score = 0;
    let keystate: {[key: number]: boolean} = {};
    
    // Grid object
    const grid = {
      width: COLS,
      height: ROWS,
      _grid: [] as number[][],
      
      init: function(d: number, c: number, r: number) {
        this.width = c;
        this.height = r;
        
        this._grid = [];
        for (let x = 0; x < c; x++) {
          this._grid.push([]);
          for (let y = 0; y < r; y++) {
            this._grid[x].push(d);
          }
        }
      },
      
      set: function(val: number, x: number, y: number) {
        this._grid[x][y] = val;
      },
      
      get: function(x: number, y: number): number {
        return this._grid[x][y];
      }
    };
    
    // Snake object
    type SnakeSegment = { x: number; y: number };
    
    const snake = {
      direction: UP,
      last: { x: 0, y: 0 } as SnakeSegment,
      _queue: [] as SnakeSegment[],
      
      init: function(d: number, x: number, y: number) {
        this.direction = d;
        
        this._queue = [];
        this.insert(x, y);
      },
      
      insert: function(x: number, y: number) {
        this._queue.unshift({ x, y });
        this.last = this._queue[0];
      },
      
      remove: function(): SnakeSegment {
        return this._queue.pop()!;
      }
    };
    
    // Set a food item at a random empty cell
    function setFood() {
      const empty: SnakeSegment[] = [];
      
      for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
          if (grid.get(x, y) === EMPTY) {
            empty.push({ x, y });
          }
        }
      }
      
      const randpos = empty[Math.floor(Math.random() * empty.length)];
      grid.set(FRUIT, randpos.x, randpos.y);
    }
    
    // Initialize game
    function init() {
      score = 0;
      
      grid.init(EMPTY, COLS, ROWS);
      
      const sp = { x: Math.floor(COLS / 2), y: ROWS - 1 };
      snake.init(UP, sp.x, sp.y);
      grid.set(SNAKE, sp.x, sp.y);
      
      setFood();
    }
    
    // Game loop update function
    function update() {
      frames++;
      
      // Check directional input
      if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
        snake.direction = LEFT;
      }
      if (keystate[KEY_UP] && snake.direction !== DOWN) {
        snake.direction = UP;
      }
      if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
        snake.direction = RIGHT;
      }
      if (keystate[KEY_DOWN] && snake.direction !== UP) {
        snake.direction = DOWN;
      }
      
      // Update snake position every 7 frames
      if (frames % 7 === 0) {
        let nx = snake.last.x;
        let ny = snake.last.y;
        
        // Update position based on direction
        switch (snake.direction) {
          case LEFT:
            nx--;
            break;
          case UP:
            ny--;
            break;
          case RIGHT:
            nx++;
            break;
          case DOWN:
            ny++;
            break;
        }
        
        // Check for collisions
        if (
          nx < 0 || nx >= grid.width ||
          ny < 0 || ny >= grid.height ||
          grid.get(nx, ny) === SNAKE
        ) {
          return init();
        }
        
        // If there's a fruit at the new position, increase score and add new food
        if (grid.get(nx, ny) === FRUIT) {
          score++;
          setFood();
        } else {
          // Otherwise, remove the snake's tail
          const tail = snake.remove();
          grid.set(EMPTY, tail.x, tail.y);
        }
        
        // Add the new head
        grid.set(SNAKE, nx, ny);
        snake.insert(nx, ny);
      }
    }
    
    // Draw function
    function draw() {
      if (!ctx) return;
      
      const tw = canvas.width / grid.width;
      const th = canvas.height / grid.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
          switch (grid.get(x, y)) {
            case EMPTY:
              ctx.fillStyle = "#fff";
              break;
            case SNAKE:
              ctx.fillStyle = "#333";
              break;
            case FRUIT:
              ctx.fillStyle = "#009BFF";
              break;
          }
          ctx.fillRect(x * tw, y * th, tw, th);
        }
      }
      
      // Draw score
      ctx.fillStyle = "#000";
      ctx.font = "12px Helvetica";
      ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
    }
    
    // Main game loop
    function loop() {
      update();
      draw();
      window.requestAnimationFrame(loop);
    }
    
    // Set up key listeners
    function setupKeyListeners() {
      document.addEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
      });
      
      document.addEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
      });
    }
    
    // Initialize the game
    function startGame() {
      // Set canvas dimensions
      canvas.width = COLS * 20;
      canvas.height = ROWS * 20;
      
      // Set up key listeners
      setupKeyListeners();
      
      // Initialize game and start loop
      init();
      loop();
    }
    
    // Start the game
    startGame();
    
    // Cleanup function
    return () => {
      document.removeEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
      });
      
      document.removeEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
      });
    };
  }, []);
  
  return (
    <div className="snake-game-container">
      <h2 className="text-xl font-bold mb-4 text-center">Online-Museum Snake Game</h2>
      <p className="mb-4 text-center text-gray-700">Benutze die Pfeiltasten zum Steuern!</p>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block',
          margin: '0 auto',
          border: '5px solid #009BFF'
        }}
      />
    </div>
  );
};

export default SnakeGame;