export const themes = {
  classicLight: {
    name: 'Classic Light',
    colors: {
      background: '#FFFFFF',
      text: '#222222',
      title: '#0A0A0A',
      accent: '#007BFF',
      linkHover: '#0056B3'
    }
  },

  elegantDark: {
    name: 'Elegant Dark',
    colors: {
      background: '#121212',
      text: '#E0E0E0',
      title: '#FFFFFF',
      accent: '#BB86FC',
      linkHover: '#985EFF'
    }
  },

  gentleNature: {
    name: 'Gentle Nature',
    colors: {
      background: '#F4F9F4',
      text: '#2E3D2F',
      title: '#1E5631',
      accent: '#A4DE02',
      linkHover: '#76B947'
    }
  },

  warmEnergy: {
    name: 'Warm Energy',
    colors: {
      background: '#FFF6E5',
      text: '#4A2C2A',
      title: '#E76F51',
      accent: '#F4A261',
      linkHover: '#E9C46A'
    }
  }
}
export const getThemeByName = (name) => {
  switch (name) {
    case 'classicLight':
      return themes.classicLight
    case 'elegantDark':
      return themes.elegantDark
    case 'gentleNature':
      return themes.gentleNature
    case 'warmEnergy':
      return themes.warmEnergy
    default:
      return themes.classicLight
  }
}
