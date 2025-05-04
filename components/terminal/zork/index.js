// Zork game module

// Score values for specific items and actions
export const SCORE_VALUES = {
  leaflet: 5,
  window_open: 10,
  leaves: 5,
  grating_revealed: 15,
  locations: {
    clearing: 10,
    behindHouse: 5,
  },
};

// Game state
export let player = {
  currentRoom: 'westOfHouse',
  inventory: [],
  score: 0,
  moves: 0,
};

// Track if we're in Zork mode
export let inZorkMode = false;

// Game map
export const rooms = {
  westOfHouse: {
    name: 'West of House',
    description:
      'You are standing in an open field west of a white house, with a boarded front door.',
    exits: {
      north: 'northOfHouse',
      south: 'southOfHouse',
      east: 'behindHouse',
    },
    items: ['mailbox'],
  },
  northOfHouse: {
    name: 'North of House',
    description:
      'You are facing the north side of a white house. There is no door here, and all the windows are boarded up.',
    exits: {
      west: 'westOfHouse',
      east: 'behindHouse',
      north: 'forest',
    },
  },
  southOfHouse: {
    name: 'South of House',
    description:
      'You are facing the south side of a white house. There is no door here, and all the windows are boarded.',
    exits: {
      west: 'westOfHouse',
      east: 'behindHouse',
      south: 'forest',
    },
  },
  behindHouse: {
    name: 'Behind House',
    description:
      'You are behind the white house. A path leads into the forest to the east. In one corner of the house there is a small window which is slightly ajar.',
    exits: {
      west: 'westOfHouse',
      north: 'northOfHouse',
      south: 'southOfHouse',
      east: 'forest',
    },
    items: ['window'],
  },
  forest: {
    name: 'Forest',
    description:
      'This is a forest, with trees in all directions. To the east, there appears to be sunlight.',
    exits: {
      south: 'southOfHouse',
      north: 'northOfHouse',
      east: 'forestPath',
    },
  },
  forestPath: {
    name: 'Forest Path',
    description:
      'This is a path winding through a dimly lit forest. The path heads north-south here.',
    exits: {
      north: 'clearing',
      south: 'forest',
    },
  },
  clearing: {
    name: 'Clearing',
    description:
      'You are in a clearing, with a forest surrounding you on all sides. A path leads south.',
    exits: {
      south: 'forestPath',
    },
    items: ['leaves', 'grating'],
  },
};

// Game items
export const items = {
  mailbox: {
    name: 'small mailbox',
    description: "It's a small mailbox.",
    canTake: false,
    canOpen: true,
    isOpen: false,
    contains: ['leaflet'],
  },
  leaflet: {
    name: 'leaflet',
    description:
      'WELCOME TO ZORK!\nZORK is a game of adventure, danger, and low cunning.',
    canTake: true,
  },
  window: {
    name: 'window',
    description: 'The window is slightly ajar, but not enough to allow entry.',
    canTake: false,
    canOpen: true,
    isOpen: false,
  },
  leaves: {
    name: 'pile of leaves',
    description: 'A pile of leaves covering the forest floor.',
    canTake: true,
    reveals: 'grating',
  },
  grating: {
    name: 'grating',
    description: 'A steel grating locked with a rusty old lock.',
    canTake: false,
    canOpen: true,
    isOpen: false,
    hidden: true,
  },
};

// Helper function to render items in room
export const renderRoomItems = (room) => {
  if (!room.items || room.items.length === 0) {
    return '';
  }

  const visibleItems = room.items
    .filter((item) => !items[item].hidden)
    .map((item) => items[item].name);

  if (visibleItems.length === 0) {
    return '';
  }

  if (visibleItems.length === 1) {
    return `There is a ${visibleItems[0]} here.`;
  }

  const lastItem = visibleItems.pop();
  return `There is a ${visibleItems.join(', ')} and a ${lastItem} here.`;
};

// Reset the game state
export const resetGame = () => {
  player = {
    currentRoom: 'westOfHouse',
    inventory: [],
    score: 0,
    moves: 0,
  };

  // Reset any room or item state changes
  for (const roomKey in rooms) {
    rooms[roomKey].visited = false;
  }

  items.window.isOpen = false;
  items.window.pointsAwarded = false;
  items.mailbox.isOpen = false;
  items.grating.hidden = true;
  items.grating.isOpen = false;

  // Reset room items
  rooms.westOfHouse.items = ['mailbox'];
  rooms.behindHouse.items = ['window'];
  rooms.clearing.items = ['leaves', 'grating'];
};

// Start Zork mode
export const startGame = () => {
  inZorkMode = true;
  resetGame();

  return [
    '<span class="text-terminal-yellow">[ ZORK mode active ]</span> Type "help" for commands, "quit" to exit',
    '',
    '<span class="text-terminal-green">ZORK I: The Great Underground Empire</span>',
    '<span class="text-terminal-yellow">West of House</span>',
    'You are standing in an open field west of a white house, with a boarded front door.',
    'There is a small mailbox here.',
  ];
};

// End Zork mode
export const endGame = () => {
  const finalScore = player.score;
  const finalMoves = player.moves;

  inZorkMode = false;
  resetGame();

  return [
    '<span class="text-terminal-yellow">[ ZORK mode ended ]</span>',
    'Thanks for playing Zork!',
    `Your score was ${finalScore} in ${finalMoves} moves.`,
    '<span class="text-terminal-cyan">Type "zork-start" to play again.</span>',
  ];
};

// Zork command handler
export const handleCommand = (command) => {
  player.moves++;
  const cmd = command.toLowerCase().trim();

  // Parse for simple commands
  const words = cmd.split(' ');
  const action = words[0];
  const target = words.slice(1).join(' ');

  // Get current room
  const room = rooms[player.currentRoom];

  // Handle navigation
  if (['north', 'south', 'east', 'west', 'n', 's', 'e', 'w'].includes(action)) {
    // Normalize direction
    let direction = action;
    if (action === 'n') direction = 'north';
    if (action === 's') direction = 'south';
    if (action === 'e') direction = 'east';
    if (action === 'w') direction = 'west';

    // Check if exit exists
    if (room.exits[direction]) {
      const newRoomId = room.exits[direction];
      player.currentRoom = newRoomId;
      const newRoom = rooms[newRoomId];

      // Check if this is the first visit to award points
      if (!newRoom.visited && SCORE_VALUES.locations[newRoomId]) {
        player.score += SCORE_VALUES.locations[newRoomId];
        newRoom.visited = true;

        // Room description output with score
        return [
          `<span class="text-terminal-yellow">${newRoom.name}</span>`,
          newRoom.description,
          renderRoomItems(newRoom),
          `<span class="text-terminal-yellow">(+${SCORE_VALUES.locations[newRoomId]} points for first visit)</span>`,
        ].filter(Boolean);
      }

      // Room description output
      return [
        `<span class="text-terminal-yellow">${newRoom.name}</span>`,
        newRoom.description,
        renderRoomItems(newRoom),
      ].filter(Boolean);
    } else {
      return ["You can't go that way."];
    }
  }

  // Handle looking around
  if (action === 'look' || action === 'l') {
    return [
      `<span class="text-terminal-yellow">${room.name}</span>`,
      room.description,
      renderRoomItems(room),
    ].filter(Boolean);
  }

  // Handle inventory
  if (action === 'inventory' || action === 'i') {
    if (player.inventory.length === 0) {
      return ['You are not carrying anything.'];
    }

    return [
      'You are carrying:',
      ...player.inventory.map((item) => `- ${items[item].name}`),
    ];
  }

  // Handle taking items
  if (action === 'take' || action === 'get') {
    if (!target) {
      return ['What do you want to take?'];
    }

    // Check if item is in the room
    const itemInRoom =
      room.items &&
      room.items.find((item) =>
        items[item].name.toLowerCase().includes(target.toLowerCase())
      );

    if (!itemInRoom) {
      return ["You can't see that here."];
    }

    const item = items[itemInRoom];

    // Check if item is hidden
    if (item.hidden) {
      return ["You can't see that here."];
    }

    // Check if item can be taken
    if (!item.canTake) {
      return [`You can't take the ${item.name}.`];
    }

    // Add to inventory and remove from room
    player.inventory.push(itemInRoom);
    room.items = room.items.filter((i) => i !== itemInRoom);

    // Award points for taking items
    if (SCORE_VALUES[itemInRoom]) {
      player.score += SCORE_VALUES[itemInRoom];

      // If it's the leaflet, special message
      if (itemInRoom === 'leaflet') {
        return [
          `Taken.`,
          `<span class="text-terminal-yellow">(+${SCORE_VALUES[itemInRoom]} points)</span>`,
        ];
      }
    }

    // If taking leaves reveals something
    if (itemInRoom === 'leaves' && item.reveals) {
      // Find the item that was hidden and make it visible
      const hiddenItem = items[item.reveals];
      if (hiddenItem && hiddenItem.hidden) {
        hiddenItem.hidden = false;
        // Award points for revealing the grating
        player.score += SCORE_VALUES.grating_revealed;
        return [
          `Taken.`,
          `Moving the leaves reveals a ${hiddenItem.name}!`,
          `<span class="text-terminal-yellow">(+${
            SCORE_VALUES[itemInRoom] + SCORE_VALUES.grating_revealed
          } points)</span>`,
        ];
      }
    }

    return [
      `Taken.${
        SCORE_VALUES[itemInRoom]
          ? ` <span class="text-terminal-yellow">(+${SCORE_VALUES[itemInRoom]} points)</span>`
          : ''
      }`,
    ];
  }

  // Handle opening things
  if (action === 'open') {
    if (!target) {
      return ['What do you want to open?'];
    }

    // Check if item is in the room or inventory
    const itemInRoom =
      room.items &&
      room.items.find((item) =>
        items[item].name.toLowerCase().includes(target.toLowerCase())
      );

    const itemInInventory = player.inventory.find((item) =>
      items[item].name.toLowerCase().includes(target.toLowerCase())
    );

    const itemId = itemInRoom || itemInInventory;

    if (!itemId) {
      return ["You can't see that here."];
    }

    const item = items[itemId];

    // Check if item can be opened
    if (!item.canOpen) {
      return [`You can't open the ${item.name}.`];
    }

    // If already open
    if (item.isOpen) {
      return [`The ${item.name} is already open.`];
    }

    // Open the item
    item.isOpen = true;

    // Award points for opening the window
    if (itemId === 'window' && !item.pointsAwarded) {
      items[itemId].pointsAwarded = true;
      player.score += SCORE_VALUES.window_open;
      return [
        `You open the ${item.name}.`,
        `<span class="text-terminal-yellow">(+${SCORE_VALUES.window_open} points)</span>`,
      ];
    }

    // If it contains items
    if (item.contains && item.contains.length > 0) {
      // Add contained items to the room
      room.items = [...(room.items || []), ...item.contains];

      const containedItems = item.contains.map((i) => items[i].name).join(', ');
      return [
        `You open the ${item.name}.`,
        `There's ${containedItems} inside.`,
      ];
    }

    return [`You open the ${item.name}.`];
  }

  // Handle quitting
  if (action === 'quit' || action === 'q') {
    return endGame();
  }

  // Handle help
  if (action === 'help') {
    return [
      '<span class="text-terminal-yellow">Zork Help:</span>',
      '- Use compass directions (north, south, east, west) to move',
      '- "look" to examine your surroundings',
      '- "take [item]" to pick up objects',
      '- "inventory" to see what you\'re carrying',
      '- "open [item]" to open things',
      '- "quit" to end the game',
      '',
      '<span class="text-terminal-cyan">You are in Zork mode - commands are processed directly.</span>',
    ];
  }

  // Default response for unrecognized commands
  return ["I don't understand that command."];
};
