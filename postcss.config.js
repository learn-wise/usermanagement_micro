const PresetEnv         = require('postcss-preset-env'),
    fontMagic           = require('postcss-font-magician'),
    Normalize           = require('postcss-normalize'),
    flexBoxFixes        = require('postcss-flexbugs-fixes'),
    cssNano             = require('cssnano'),
    autoPrefixer        = require('autoprefixer'),
    nested              = require('postcss-nested'),
    resembleImage       = require('postcss-resemble-image').default,
    mediaQueryPacker    = require("css-mqpacker"),
    pxtorem             = require('postcss-pxtorem');

const isEnvProduction = process.env.NODE_ENV === 'production' ? true : false ;

module.exports = {
    plugins: [
        PresetEnv({ stage: 3, }),
        fontMagic({ foundries: ['google'] }),
        flexBoxFixes(),
        Normalize(),
        isEnvProduction && cssNano(),
        resembleImage(),
        pxtorem(),
        isEnvProduction && mediaQueryPacker(),
        autoPrefixer({flexbox: 'no-2009'}),
        isEnvProduction && nested()
    ].filter(Boolean)
}