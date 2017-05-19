class BaseTemplate {
    constructor(){
        this.head = {};
        this.stiva = {};
    }
    render(){
        const body = `
            <main>
                ${this.page}
            </main>
        `;

        const elements = [
            'element-actions',
            'element-display',
            'element-item',
            'element-list',
            'element-properties',
            'element-story',
            'prop-item',
            'property-display'
        ]


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
                <link rel="stylesheet" href="${this.storybookRoot}/elements/index.css" />

                <script src="${this.storybookRoot}/stiva.js"></script>
                <script>
                    let stiva = new Stiva(${JSON.stringify(this.stiva)});
                    window.addEventListener('WebComponentsReady', (e) => {
                        console.log('web components ready');
                        setTimeout(() => stiva.dispatchAll(), 300);
                    });
                </script>

                <script src="${this.polyfills}/webcomponents-loader.js"></script>
                ${
                    elements.map( (name) => (
                        `<link rel="import" href="${this.storybookRoot}/elements/${name}/${name}.html">`
                    )).join('')
                }
            </head>
            <body>
                ${body}
                ${this.inject}
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
