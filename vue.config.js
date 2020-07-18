const pwa = {
  name: 'VseTut менеджер',
  shortName: 'Всё Тут',
  themeColor: '#FF9800',
  bgColor: '#F2D811',
};

module.exports = {
  pwa: {
    name: pwa.name,
    themeColor: pwa.themeColor,
    msTileColor: pwa.themeColor,
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: pwa.name,
      short_name: pwa.shortName,
      start_url: '.',
      display: 'standalone',
      theme_color: pwa.themeColor,
      background_color: pwa.bgColor,
    }
  }
};
