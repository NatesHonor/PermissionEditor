function translateColorCodes(text) {
    const formatMap = {
      '&0': { color: '#000000', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&1': { color: '#0000AA', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&2': { color: '#00AA00', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&3': { color: '#00AAAA', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&4': { color: '#AA0000', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&5': { color: '#AA00AA', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&6': { color: '#FFAA00', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&7': { color: '#AAAAAA', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&8': { color: '#555555', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&9': { color: '#5555FF', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&a': { color: '#55FF55', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&b': { color: '#55FFFF', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&c': { color: '#FF5555', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&d': { color: '#FF55FF', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&e': { color: '#FFFF55', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&f': { color: '#FFFFFF', 'font-weight': 'normal', 'text-decoration': 'none' },
      '&l': { 'font-weight': 'bold' },
      '&o': { 'font-style': 'italic' },
      '&m': { 'text-decoration': 'line-through' },
      '&n': { 'text-decoration': 'underline' },
      '&r': { color: 'inherit', 'font-weight': 'inherit', 'font-style': 'inherit', 'text-decoration': 'none' }
    };

    return text.replace(/([&§])[0-9a-fA-Fg-oG-O]/g, (match, codeIndicator) => {
        const style = formatMap[codeIndicator + match.slice(1)];
        if (style) {
          const styleList = Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ');
          return `<span style="${styleList}">`;
        } else {
          return '';
        }
      });
    }
    
    module.exports = translateColorCodes;