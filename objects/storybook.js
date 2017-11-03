const glob = require('glob');
const ItemTemplate = require('../templates/item.js');
const path = require('path');
const express = require('express');
class Storybook {
    constructor({stories, storybookRoot = '', app, dir = __dirname, pathToElements='/elements', pathToPolyfills='/polyfills', stylesheet, inject, moduleType = 'js'}){
        this.getStories(stories).then((storyObjects) => {
            this.stories = storyObjects;
        });
        this.storybookRoot = this.trimSlash(storybookRoot);
        this.dir = this.trimSlash(dir);
        this.pathToElements = this.trimSlash(pathToElements);
        this.pathToPolyfills = this.trimSlash(pathToPolyfills);
        this.app = app;
        this.stylesheet = stylesheet;
        this.inject = inject;
        this.moduleType = moduleType;

        this.assignRoutes();
    }
    trimSlash(str){
        return str.endsWith('/') ? str.substring(0,str.length-1) : str;
    }
    getStories(stories){
        if(typeof stories === "string"){
            stories = [stories];
        }
        if(typeof stories[0] === "object"){
            return new Promise( (res, rej) => res(stories) );
        }


        let globs = stories.reduce(
            (a,n) => (
                [...a,
                new Promise( (res, rej) => {
                    glob(n, (err, files) => {
                        if(!err){
                            res(files);
                        }
                        else{
                            rej("there was an error in the glob");
                        }
                    });
                })]
        ),[]);

        return Promise.all(globs)
        .then(values => values.reduce( (a,n) => [...a,...n] ).map( storyPath => require(`${this.dir}/${storyPath}`)))
        .catch( (reason) => console.log(reason));
    }
    navigateToStory({elementName,currentStory,res}){
        let itemTemplate = new ItemTemplate({elementList: this.stories, elementName, currentStory, elementsRoot: this.pathToElements, storybookRoot: this.storybookRoot, polyfills: this.pathToPolyfills, stylesheet: this.stylesheet, inject: this.inject, moduleType: this.moduleType});
        res.send(itemTemplate.render());
    }
    assignRoutes(){
        let stivaPath = require.resolve('stiva');
        this.app.use(`${this.storybookRoot}/elements`, express.static( path.join(__dirname, '../client/elements') ));
        this.app.use(`${this.storybookRoot}/stiva.js`, express.static( require.resolve('stiva') ));
        this.app.get(`${this.storybookRoot}/:element`, (req, res) => {
            const {element} = req.params;
            this.navigateToStory({elementName: element, currentStory: 0, res});
        });
        this.app.get(`${this.storybookRoot}/:element/:story`, (req, res) => {
            const {element,story} = req.params;
            this.navigateToStory({elementName: element,currentStory: story,res});
        });
        this.app.get(`${this.storybookRoot}`, (req, res) => {
            if(this.stories.length === 0){
                res.send('you need some stories!');
            }
            else {
                res.redirect(`${this.storybookRoot}/${this.stories[0].name}`);
            }
        })
    }
}
module.exports = Storybook;
