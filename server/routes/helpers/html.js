import React from 'react';

export default ({content,client:{cache}})=>(
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/stylesheets/main.css" rel="stylesheet"/>
            <title>Administrator</title>
        </head>
        <body>
            <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
            <script
                charSet="UTF-8"
                dangerouslySetInnerHTML={{
                __html: `window.__APOLLO_STATE__=${JSON.stringify(cache.extract())};`,
                }}
            />
            <script src="/public-bundle.js" type="text/javascript" />
            <script src="/public-bundle.chunk.js" type="text/javascript" />
        </body>
    </html>
)