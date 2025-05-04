import { quotes } from '../data/quotes';
import { jokes } from '../data/jokes';
import { fileSystem } from '../data/fileSystem';
import { weatherArt } from '../data/weatherArt';
// Import the Zork game module
import * as zorkGame from '../zork';

// Function to fetch weather data
const fetchWeather = async (location = 'new york') => {
  try {
    // Using OpenWeatherMap API with environment variable
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    // Check if API key is available
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return [
        `<span class="text-terminal-red">Weather API key not configured</span>`,
        `<span class="text-terminal-yellow">Please add your OpenWeatherMap API key to .env.local</span>`,
      ];
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [
          `<span class="text-terminal-red">Location not found: ${location}</span>`,
          `<span class="text-terminal-yellow">Usage: weather [city name]</span>`,
        ];
      }
      throw new Error(`Weather service error: ${response.status}`);
    }

    const data = await response.json();

    // Get the appropriate ASCII art based on weather condition
    let art = weatherArt.default;
    const weatherCondition = data.weather[0].main.toLowerCase();

    if (weatherCondition.includes('clear')) {
      art = weatherArt.clear;
    } else if (weatherCondition.includes('cloud')) {
      art = weatherArt.clouds;
    } else if (
      weatherCondition.includes('rain') ||
      weatherCondition.includes('drizzle')
    ) {
      art = weatherArt.rain;
    } else if (weatherCondition.includes('thunderstorm')) {
      art = weatherArt.thunderstorm;
    } else if (weatherCondition.includes('snow')) {
      art = weatherArt.snow;
    } else if (
      weatherCondition.includes('mist') ||
      weatherCondition.includes('fog') ||
      weatherCondition.includes('haze')
    ) {
      art = weatherArt.mist;
    }

    // Format the weather data in a terminal-friendly way with ASCII art
    return [
      `<span class="text-terminal-yellow">Weather for ${data.name}, ${data.sys.country}</span>`,
      art,
      `<span class="text-terminal-cyan">Temperature:</span> ${Math.round(
        data.main.temp
      )}°F (feels like ${Math.round(data.main.feels_like)}°F)`,
      `<span class="text-terminal-cyan">Conditions:</span> ${data.weather[0].description}`,
      `<span class="text-terminal-cyan">Humidity:</span> ${data.main.humidity}%`,
      `<span class="text-terminal-cyan">Wind:</span> ${Math.round(
        data.wind.speed
      )} mph`,
    ];
  } catch (error) {
    return [
      `<span class="text-terminal-red">Error fetching weather data: ${error.message}</span>`,
      `<span class="text-terminal-yellow">Usage: weather [location]</span> (e.g., weather london)`,
    ];
  }
};

// Add a state variable to track if we're in Blackjack mode
let inBlackjackMode = false;
// Blackjack game state
let blackjackGame = {
  player: [],
  dealer: [],
  deck: [],
  playerScore: 0,
  dealerScore: 0,
  playerTurn: true,
  gameOver: false,
  result: '',
};

// Add score values for specific items and actions
const SCORE_VALUES = {
  leaflet: 5,
  window_open: 10,
  leaves: 5,
  grating_revealed: 15,
  locations: {
    clearing: 10,
    behindHouse: 5,
  },
};

export const handleCommand = async (command, currentPath, setCurrentPath) => {
  const cmd = command.trim();
  const lowerCmd = cmd.toLowerCase();

  // Check if we're in Zork mode - if so, handle as Zork command
  if (zorkGame.inZorkMode && cmd !== 'quit') {
    return zorkGame.handleCommand(cmd);
  }

  // Check if we're in Blackjack mode - if so, handle as Blackjack command
  if (inBlackjackMode && !['quit', 'exit'].includes(lowerCmd)) {
    return handleBlackjackCommand(cmd);
  }

  // Parse command and arguments
  const args = cmd.split(' ');
  const mainCommand = args[0].toLowerCase();
  const arg = args.length > 1 ? args.slice(1).join(' ') : '';

  switch (mainCommand) {
    case 'help':
      return [
        '<span class="text-terminal-green">Available commands:</span>',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">help</span><span class="text-terminal-yellow">|</span> Show this message',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">clear</span><span class="text-terminal-yellow">|</span> Clear the terminal',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">cd</span><span class="text-terminal-yellow">|</span> Change directory <span class="text-terminal-cyan">(cd about, cd codex, etc)</span>',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">weather</span><span class="text-terminal-yellow">|</span> Show the weather <span class="text-terminal-cyan">(weather [location])</span>',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">sudo</span><span class="text-terminal-yellow">|</span> Attempt to gain admin privileges',
        '',
        '<span class="text-terminal-cyan" style="font-weight:bold">━━━ Categories ━━━</span>',
        '<span class="text-terminal-green" style="display:inline-block;width:110px;">movies</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-white">Quotes from cinematic universes</span>',
        '<span class="text-terminal-cyan" style="display:inline-block;width:110px;">wisdom</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-white">Words of wisdom from various sources</span>',
        '<span class="text-terminal-yellow" style="display:inline-block;width:110px;">jokes</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-white">Humor modules for entertainment</span>',
        '<span class="text-terminal-red" style="display:inline-block;width:110px;">games</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-white">Interactive games to play</span>',
      ];
    case 'games':
      return [
        '<span class="text-terminal-red" style="font-weight:bold">━━━ Available Games ━━━</span>',
        '<span class="text-terminal-green" style="display:inline-block;width:110px;">zork</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-green">Classic text adventure game</span>',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">blackjack</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-blue">Card game of 21</span>',
      ];
    case 'movies':
      return [
        '<span class="text-terminal-green" style="font-weight:bold">━━━ Movie Quote Archives ━━━</span>',
        '<span class="text-terminal-green" style="display:inline-block;width:110px;">matrix</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-green">Digital reality insights</span>',
        '<span class="text-terminal-red" style="display:inline-block;width:110px;">terminator</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-red">Messages from the future</span>',
        '<span class="text-terminal-red" style="display:inline-block;width:110px;">fightclub</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-red">Project Mayhem communications</span>',
        '<span class="text-terminal-yellow" style="display:inline-block;width:110px;">starwars</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-yellow">Galactic wisdom</span>',
        '<span class="text-terminal-green" style="display:inline-block;width:110px;">hitchhiker</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-green">Guide to the galaxy</span>',
      ];
    case 'wisdom':
      return [
        '<span class="text-terminal-cyan" style="font-weight:bold">━━━ Wisdom Archives ━━━</span>',
        '<span class="text-terminal-cyan" style="display:inline-block;width:110px;">grandma</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-cyan">JP\'s robot ears wisdom</span>',
        '<span class="text-terminal-green" style="display:inline-block;width:110px;">hitchhiker</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-green">Philosophical guidance for space travelers</span>',
        '<span class="text-terminal-yellow" style="display:inline-block;width:110px;">starwars</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-yellow">Ancient wisdom from distant stars</span>',
      ];
    case 'jokes':
      return [
        '<span class="text-terminal-yellow" style="font-weight:bold">━━━ Humor Modules ━━━</span>',
        '<span class="text-terminal-blue" style="display:inline-block;width:110px;">joke</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-blue">Programming humor protocol</span>',
        '<span class="text-terminal-yellow" style="display:inline-block;width:110px;">dadjoke</span><span class="text-terminal-yellow">|</span> <span class="text-terminal-yellow">Paternal humor database</span>',
      ];
    case 'clear':
      return [];
    case 'matrix':
      return [
        '<span class="text-terminal-green text-lg">' +
          quotes.matrix[Math.floor(Math.random() * quotes.matrix.length)] +
          '</span>',
      ];
    case 'terminator':
      return [
        '<span class="text-terminal-red text-lg">' +
          quotes.terminator[
            Math.floor(Math.random() * quotes.terminator.length)
          ] +
          '</span>',
      ];
    case 'grandma':
      return [
        '<span class="text-terminal-cyan text-lg">' +
          quotes.grandma[Math.floor(Math.random() * quotes.grandma.length)] +
          '</span>',
      ];
    case 'fightclub':
      return [
        '<span class="text-terminal-red text-lg">' +
          quotes.fightclub[
            Math.floor(Math.random() * quotes.fightclub.length)
          ] +
          '</span>',
      ];
    case 'starwars':
      return [
        '<span class="text-terminal-yellow text-lg">' +
          quotes.starwars[Math.floor(Math.random() * quotes.starwars.length)] +
          '</span>',
      ];
    case 'hitchhiker':
      return [
        '<span class="text-terminal-green text-lg">' +
          quotes.hitchhiker[
            Math.floor(Math.random() * quotes.hitchhiker.length)
          ] +
          '</span>',
      ];
    case 'joke':
      return [
        '<span class="text-terminal-blue text-lg">' +
          jokes.programming[
            Math.floor(Math.random() * jokes.programming.length)
          ] +
          '</span>',
      ];
    case 'dadjoke':
      return [
        '<span class="text-terminal-yellow text-lg">' +
          jokes.dad[Math.floor(Math.random() * jokes.dad.length)] +
          '</span>',
      ];
    case 'weather':
      return await fetchWeather(arg || 'new york');
    case 'sudo':
      return [
        'sudo: Permission denied. Trying to hack my portfolio? 😉',
        'YOU SHALL NOT PASS! 🔥 😈 🧙🏿‍♂️',
      ];
    case 'cd':
      return handleCdCommand(arg, currentPath, setCurrentPath);
    case 'zork':
      return [
        '<span class="text-terminal-yellow text-lg">ZORK</span>',
        'Welcome to ZORK.',
        "(Implementation inspired by DLzer's JavaScript Zork)",
        'Original game © 1981, 1982, 1983 Infocom Inc. All rights reserved.',
        '',
        '<span class="text-terminal-yellow">Loading game...</span>',
        '<span class="text-terminal-cyan">Type "zork-start" to begin your adventure</span>',
      ];
    case 'zork-start':
      return zorkGame.startGame();
    case 'zork-cmd':
      if (!arg) {
        return [
          '<span class="text-terminal-red">Please enter a command after "zork-cmd" or use "zork-start" to enter Zork mode</span>',
        ];
      }
      return zorkGame.handleCommand(arg);
    case 'blackjack':
      return [
        '<span class="text-terminal-blue text-lg">BLACKJACK</span>',
        'The classic card game of 21.',
        '',
        '<span class="text-terminal-yellow">Loading game...</span>',
        '<span class="text-terminal-cyan">Type "blackjack-start" to begin playing</span>',
      ];
    case 'blackjack-start':
      inBlackjackMode = true;
      initBlackjackGame();
      return displayBlackjackGame();
    case 'quit':
      if (zorkGame.inZorkMode) {
        return zorkGame.endGame();
      } else if (inBlackjackMode) {
        inBlackjackMode = false;
        return ['Thanks for playing Blackjack! Returning to terminal mode.'];
      } else {
        return ['No active game to quit.'];
      }
    case '':
      return [];
    default:
      // Handle not found
      if (zorkGame.inZorkMode) {
        return zorkGame.handleCommand(cmd);
      }
      return [`Command not found: ${cmd}. Type "help" for available commands.`];
  }
};

const handleCdCommand = (arg, currentPath, setCurrentPath) => {
  if (!arg || arg === '~') {
    setCurrentPath('~');
    return [`Changed directory to ~`];
  } else if (arg === '..') {
    if (currentPath === '~') {
      return [`Already at home directory`];
    }
    const newPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(newPath || '~');
    return [`Changed directory to ${newPath || '~'}`];
  } else {
    const targetPath =
      arg.startsWith('/') || arg.startsWith('~')
        ? arg
        : `${currentPath}/${arg}`;

    // Normalize path
    const normalizedPath = targetPath.replace(/\/+/g, '/');

    if (fileSystem[normalizedPath]) {
      setCurrentPath(normalizedPath);
      return [`Changed directory to ${normalizedPath}`];
    } else {
      return [`Directory not found: ${arg}`];
    }
  }
};

const handleLsCommand = (arg, currentPath) => {
  const dirToList = arg || currentPath;
  if (fileSystem[dirToList]) {
    return fileSystem[dirToList].length > 0
      ? fileSystem[dirToList]
      : ['Directory is empty'];
  } else {
    return [`Directory not found: ${dirToList}`];
  }
};

// Blackjack game functions
function initBlackjackGame() {
  // Reset game state
  blackjackGame = {
    player: [],
    dealer: [],
    deck: [],
    playerScore: 0,
    dealerScore: 0,
    playerTurn: true,
    gameOver: false,
    result: '',
  };

  // Create and shuffle deck
  createDeck();
  shuffleDeck();

  // Deal initial cards
  blackjackGame.player.push(drawCard());
  blackjackGame.dealer.push(drawCard());
  blackjackGame.player.push(drawCard());
  blackjackGame.dealer.push(drawCard());

  // Calculate scores
  blackjackGame.playerScore = calculateScore(blackjackGame.player);
  blackjackGame.dealerScore = calculateScore(blackjackGame.dealer);

  // Check for natural blackjack
  if (blackjackGame.playerScore === 21) {
    blackjackGame.playerTurn = false;
    dealerPlay();
  }
}

function createDeck() {
  const suits = ['♥', '♦', '♣', '♠'];
  const values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];

  blackjackGame.deck = [];

  for (const suit of suits) {
    for (const value of values) {
      blackjackGame.deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = blackjackGame.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blackjackGame.deck[i], blackjackGame.deck[j]] = [
      blackjackGame.deck[j],
      blackjackGame.deck[i],
    ];
  }
}

function drawCard() {
  if (blackjackGame.deck.length === 0) {
    createDeck();
    shuffleDeck();
  }
  return blackjackGame.deck.pop();
}

function calculateScore(cards) {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.value === 'A') {
      aces++;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  // Adjust aces if score is over 21
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function dealerPlay() {
  // Dealer draws until 17 or higher
  while (blackjackGame.dealerScore < 17) {
    blackjackGame.dealer.push(drawCard());
    blackjackGame.dealerScore = calculateScore(blackjackGame.dealer);
  }

  // Determine result
  blackjackGame.gameOver = true;

  if (blackjackGame.playerScore > 21) {
    blackjackGame.result = 'Bust! You lose.';
  } else if (blackjackGame.dealerScore > 21) {
    blackjackGame.result = 'Dealer busts! You win!';
  } else if (blackjackGame.playerScore > blackjackGame.dealerScore) {
    blackjackGame.result = 'You win!';
  } else if (blackjackGame.playerScore < blackjackGame.dealerScore) {
    blackjackGame.result = 'You lose.';
  } else {
    blackjackGame.result = "Push. It's a tie.";
  }
}

function formatCard(card) {
  const color = ['♥', '♦'].includes(card.suit) ? 'red' : 'black';
  return `<span class="text-terminal-${color}">${card.value}${card.suit}</span>`;
}

function displayBlackjackGame() {
  const output = [];

  output.push('<span class="text-terminal-blue text-lg">BLACKJACK</span>');

  // Display dealer's hand
  output.push('<span class="text-terminal-cyan">Dealer\'s hand:</span>');
  if (blackjackGame.playerTurn && !blackjackGame.gameOver) {
    // Only show first card during player's turn
    output.push(`${formatCard(blackjackGame.dealer[0])} [?]`);
  } else {
    output.push(blackjackGame.dealer.map(formatCard).join(' '));
    output.push(`Total: ${blackjackGame.dealerScore}`);
  }

  // Display player's hand
  output.push('<span class="text-terminal-green">Your hand:</span>');
  output.push(blackjackGame.player.map(formatCard).join(' '));
  output.push(`Total: ${blackjackGame.playerScore}`);

  // Display result if game is over
  if (blackjackGame.gameOver) {
    output.push(
      `<span class="text-terminal-yellow">${blackjackGame.result}</span>`
    );
    output.push(
      '<span class="text-terminal-cyan">Type "blackjack-start" to play again or "quit" to exit.</span>'
    );
  } else if (blackjackGame.playerTurn) {
    output.push(
      '<span class="text-terminal-cyan">Type "hit" to draw another card or "stand" to end your turn.</span>'
    );
  }

  return output;
}

function handleBlackjackCommand(command) {
  const cmd = command.toLowerCase().trim();

  if (blackjackGame.gameOver) {
    if (cmd === 'blackjack-start') {
      initBlackjackGame();
      return displayBlackjackGame();
    } else {
      return [
        'Game is over. Type "blackjack-start" to play again or "quit" to exit.',
      ];
    }
  }

  if (blackjackGame.playerTurn) {
    switch (cmd) {
      case 'hit':
        blackjackGame.player.push(drawCard());
        blackjackGame.playerScore = calculateScore(blackjackGame.player);

        if (blackjackGame.playerScore >= 21) {
          blackjackGame.playerTurn = false;
          dealerPlay();
        }
        return displayBlackjackGame();

      case 'stand':
        blackjackGame.playerTurn = false;
        dealerPlay();
        return displayBlackjackGame();

      default:
        return [
          'Invalid command. Type "hit" to draw another card or "stand" to end your turn.',
        ];
    }
  }

  return [
    'Invalid command. Type "blackjack-start" to play again or "quit" to exit.',
  ];
}
