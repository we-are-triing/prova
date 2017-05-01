class BaseTemplate {
    constructor(){
        this.head = {};
    }
    render(){
        const body = `
            <main>
                ${this.page}
            </main>
        `;

        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">

                <meta property="og:site_name" content="Native Elements Starter">
                <title>${this.head.title}</title>
                ${this.head.content}
                <link rel="stylesheet" href="${this.elementsRoot}/index.css" />
                <link rel="stylesheet" href="${this.routeRoot}/elements/index.css" />
                <!-- TODO: where are these going to live, need to grab that -->
                <script src="${this.polyfills}/webcomponents-loader.js"></script>
                ${
                    this.parseElements(body).map( (name) => (
                        `<link rel="import" href="${this.routeRoot}/elements/${name}/${name}.html">`
                    )).join('')
                }
            </head>
            <body>
                ${body}
            </body>
        </html>
        `;
    }
    parseElements(str){
        const reg = /(?:<|is=")\w+?-[\w-]+(?:\s*?|>)/gi;
        return [...new Set(str.match(reg).map( (s) => s.replace(/^(<|is=")/gi,'') ))]
    }
}
module.exports = BaseTemplate;
