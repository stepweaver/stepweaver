// ASCII art for different weather conditions
export const weatherArt = {
  // Clear sky
  clear: `<div class="ascii-art">
  <span class="text-terminal-yellow">    \\   /    </span>
  <span class="text-terminal-yellow">     .-.     </span>
  <span class="text-terminal-yellow">  ‒ (   ) ‒  </span>
  <span class="text-terminal-yellow">     \`-'     </span>
  <span class="text-terminal-yellow">    /   \\    </span>
</div>`,

  // Clouds
  clouds: `<div class="ascii-art">
  <span class="text-terminal-blue">     .--.    </span>
  <span class="text-terminal-blue">  .-(    ).  </span>
  <span class="text-terminal-blue"> (___.__)__) </span>
  <span class="text-terminal-blue">            </span>
  <span class="text-terminal-blue">            </span>
</div>`,

  // Rain
  rain: `<div class="ascii-art">
  <span class="text-terminal-blue">     .-.    </span>
  <span class="text-terminal-blue">    (   ).  </span>
  <span class="text-terminal-blue">   (___(___)</span>
  <span class="text-terminal-cyan">    ' ' ' ' </span>
  <span class="text-terminal-cyan">   ' ' ' '  </span>
</div>`,

  // Thunderstorm
  thunderstorm: `<div class="ascii-art">
  <span class="text-terminal-blue">     .-.    </span>
  <span class="text-terminal-blue">    (   ).  </span>
  <span class="text-terminal-blue">   (___(___)</span>
  <span class="text-terminal-cyan">  ⚡' '⚡' </span>
  <span class="text-terminal-cyan">   ' ' ' '  </span>
</div>`,

  // Snow
  snow: `<div class="ascii-art">
  <span class="text-terminal-blue">     .-.    </span>
  <span class="text-terminal-blue">    (   ).  </span>
  <span class="text-terminal-blue">   (___(___)</span>
  <span class="text-white">    *  *  * </span>
  <span class="text-white">   *  *  *  </span>
</div>`,

  // Mist/Fog
  mist: `<div class="ascii-art">
  <span class="text-gray-400"> _ - _ - _ </span>
  <span class="text-gray-400">  _ - _ -  </span>
  <span class="text-gray-400"> _ - _ - _ </span>
  <span class="text-gray-400">  _ - _ -  </span>
  <span class="text-gray-400"> _ - _ - _ </span>
</div>`,

  // Default
  default: `<div class="ascii-art">
  <span class="text-terminal-yellow">    \\   /    </span>
  <span class="text-terminal-yellow">     .-.     </span>
  <span class="text-terminal-yellow">  ‒ (   ) ‒  </span>
  <span class="text-terminal-yellow">     \`-'     </span>
  <span class="text-terminal-yellow">    /   \\    </span>
</div>`,
};
