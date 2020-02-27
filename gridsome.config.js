// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Done Board',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'cards/**/*.md',
        typeName: 'Cards',
        remark: {}
      }
    },
    {
      use: 'gridsome-plugin-netlify-cms',
      options: {
        publicPath: '/cms'
      },
    },
    {
      use: 'gridsome-plugin-tailwindcss',
    },
  ],
  transformers: {
    remark: {}
  }
}
