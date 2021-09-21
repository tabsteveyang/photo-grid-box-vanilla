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

const insertPoint = document.querySelector('#app');
const box = new PhotoGridBox(insertPoint, imgs);
```

## APIs
### constructor
- create the PhotoGridBox object with initial status.
```js
const box = new PhotoGridBox(
  insertPoint,        // the DOM to insert the elements created by the object
  imgs,               // the array for loading the initial batch of pictures
  imgOnClick,         // the onClick event handler for each block (optional)
  panelHTMLSetter,    // the function that returns a HTML string for adding the children on the panel (optional)
  rowGap,             // change the height between each row (optional)
  colGap              // change the width between each block (optional)
);
```
### appendImgs
- append and render a batch of images.
```js
box.appendImgs([
  {
    src: 'https://live.staticflickr.com/4654/39345481745_1be0a0098c.jpg',
    payload: {
      title: 'monkey'
    }
  }
  'https://live.staticflickr.com/4719/38432661400_f53017f598.jpg',
  'https://live.staticflickr.com/5704/22410267477_303a090dcd_n.jpg',
  'https://live.staticflickr.com/4665/38432665950_12d8d33002.jpg'
]);
```

### setImgOnClick
- update the onClick event handler for each block and rerender the view.
```js
box.setImgOnClick(function (e, imgConfig) {
  // use the parameter to reference the event object and the config you set
  // ... write some logic here
});
```

### setPanelHTMLSetter
- update the panelHTMLSetter callback (the callback function that returns a HTML string for adding the children on the panel) and rerender the view.
```js
box.setPanelHTMLSetter(function (imgConfig) {
  var htmlString = ''
  if (imgConfig && imgConfig.payload && imgConfig.payload.title) {  // use the parameter to reference the payload and create customized panel for each block
    htmlString += '<div class="photo-block__panel__title">'+ imgConfig.payload.title +'</div>'
  }
  return htmlString
});
```

### setShowUnCompleteRow
- In default, the PhotoGridBox will hide the last row if the last row is not complete; to make it looks more natural when loading pictures chunk by chunk. When there is no more picture to load, or for any reason, you can use the method to cancel the feature.
```js
box.setShowUnCompleteRow(true); // set as false in default.
```

### destroy
- Clean up the view and remove the resources in the PhotoGridBox object. You can make the object alive again by calling the appendImgs method after "destroying" the object.
```js
box.destroy();
```

## Demo
See the demonstration on codepen (https://codepen.io/tabsteveyang/pen/JjJYKzy)

## Links
1. https://codepen.io/tabsteveyang/pen/JjJYKzy
2. https://www.npmjs.com/package/photo-grid-box-vanilla
3. https://github.com/tabsteveyang/photo-grid-box-vanilla