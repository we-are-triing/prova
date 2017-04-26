const glob = require('glob');
class Storybook {
    constructor({stories, root = '', app, dir = ''}){
        this.getStories(stories).then((storyObjects) => {
            this.stories = storyObjects;
        });
        this.root = this.trimSlash(root);
        this.dir = this.trimSlash(dir);
        this.app = app;

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
    assignRoutes(){
        this.app.get(`${this.root}/:element`, (req, res) => {
            const {element} = req.params;
            res.send('hi from storybook');
        });
        this.app.get(`${this.root}`, (req, res) => {
            if(this.stories.length === 0){
                res.send('you need some elements!');
            }
            else {
                res.redirect(`http://localhost:8080/${this.root}/${this.stories[0].name}`);
            }
        })
    }
}
module.exports = Storybook;

/* get the config file if there is one, if not, then define some defaults

    what is in the config,
        - Config the storybook
            - get a list of story files.
            - what port to run on
            - stylesheet to use to style storybook

        - Config the elements
            - global stylesheets to use for the elements
*/

// I want to have the server get to any page, but I do I want to have all changes go through the server, I could make the request super fast?
// app.get('/:component', (req,res) => {
//     // check to see if the component is in the component list, if not go to the home page.
// });


//look for the elements story book file.
    // allow for a custom index.html File.
    // allow allow a glob pattern to be specified in the config to load in.
    // use custom elements to build it with.
    // one of the things that makes this different from react is that I want to encourage DOM usage.
    // we can also assume that because this is custom elements, everything is a string. And can have an easy interface to modify properties.
    // Do I want to have some sort of check as to the values that are allowed? probably not.

// Set of the server and render the storybook interface.
