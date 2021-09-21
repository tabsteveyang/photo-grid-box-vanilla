# photo-grid-box-vanilla
A Flickr-like photo array showcase module in vanilla JavaScript.<br/>

## Install
```shell
$ npm install photo-grid-box-vanilla
```

### HTML
#### There are two ways to get the files:
  1. Copy or reference the files under /node_modules/photo-grid-box-vanilla/dist/
  2. Download them from the dist folder in the GitHub repo
#### After getting the file, reference it in a HTML file
```html
<!Doctype html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="[pathToTheFilesFolder]/photo-grid-box-vanilla.min.css" />
  <script src="[pathToTheFilesFolder]/photo-grid-box-vanilla.min.js"></script>
...
```
### Babel
```js
import { PhotoGridBox } from 'photo-grid-box-vanilla';
```
### Browserify/Webpack
```js
const { PhotoGridBox } = require( "photo-grid-box-vanilla" );
```
- CSS file has to be referenced in HTML, no matter which way you decide to import the module.

## Usage
```js
const imgs = [
  // use an object as an element allows you to to build some customized feature
  {
    url: "https://c1.staticflickr.com/1/699/22812601591_12ca1ee7cf_n.jpg",
    payload: {  // you can carry more information in the payload
      title: 'mountain'
    }
  },
  {
    url: "https://c1.staticflickr.com/1/573/22409354059_ba46782c8f_n.jpg",
    payload: {
      title: 'wall'
    }
  },
  {
    url: "https://c1.staticflickr.com/6/5704/22410267477_303a090dcd_m.jpg",
    payload: {
      title: 'jet'
    }
  },
  "https://c1.staticflickr.com/1/683/22207558073_8ecdb7abc4_n.jpg"  // a string that point out the image's path is also acceptable
];

const insertPoint = document.querySelector('#app')
const box = new PhotoGridBox(insertPoint, imgs)
```

## Demo
See the demonstration on codepen (https://codepen.io/tabsteveyang/pen/JjJYKzy)

## Links
1. https://codepen.io/tabsteveyang/pen/JjJYKzy
2. https://www.npmjs.com/package/photo-grid-box-vanilla
3. https://github.com/tabsteveyang/photo-grid-box-vanilla