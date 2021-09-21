/*
 * PhotoGridBox class
 */
function PhotoGridBox (insertPoint, imgs, imgOnClick, panelHTMLSetter, rowGap, colGap) {
  this.insertPoint = insertPoint
  this.imgLoader = new Image()
  this.dom = null
  this.imgs = []
  this.rowHeight = this._getRowHeight()
  this.rowGap = rowGap ? rowGap : 3
  this.colGap = colGap ? colGap : 3
  this.rowLength = 0
  this.showUnCompeleteRow = false
  this.compeleteIndex = -1  
  this.lastRenderedWindowOffsetWidth = window.innerWidth
  this.minImgWidth = this._getMinImgWidth()
 
  this._initDOM()
  if (imgOnClick) {
     this.imgOnClick = imgOnClick
  }
  if (panelHTMLSetter) {
    this.panelHTMLSetter = panelHTMLSetter
  }
  if (imgs) {
    this.appendImgs(imgs)
  }
}
PhotoGridBox.prototype._initDOM = function () {
  try {
    var uniqueClassName = 'photo-grid-box-' + +new Date()
    var className = 'photo-grid-box ' + uniqueClassName
    this.insertPoint.innerHTML = '<div class="'+ className +'"></div>'
    this.dom = document.querySelector('.' + uniqueClassName)
    this.dom.style.width = this.dom.offsetWidth + 'px'
  } catch (e) {
    console.error(e)
  }
}
PhotoGridBox.prototype._getRowHeight = function () {
  if (window.innerWidth <= 350) {
    return 200
  } else if (window.innerWidth <= 550) {
    return 250
  } else if (window.innerWidth <= 768) {
    return 270
  }
  return 280
}
PhotoGridBox.prototype._getMinImgWidth = function () {
  if (window.innerWidth <= 350) {
    return 130
  } else if (window.innerWidth <= 550) {
    return 150
  } else if (window.innerWidth <= 768) {
    return 180
  }
  return 200
}
PhotoGridBox.prototype.appendImgs = function (imgs) {
  if (Array.isArray(imgs) && imgs.length > 0) {
    var self = this
    imgs.map(function(img, index) {
      self.imgs.push(img)
    })
    this._render()
  } else {
    console.error('imgs should be an array with the elements of the src of the images(String).')
  }
}
PhotoGridBox.prototype._render = function () {
  var self = this
  if (!self.dom) self._initDOM()
  self._addWindowResizeEvent()
  var imgDOMs = document.querySelectorAll('.photo-block')
  var imgIndex = self.compeleteIndex + 1
  var imgsLength = self.imgs.length
  var imgLoader = self.imgLoader
  var tempRow = []
  var tempAccumulateWidth = 0
  imgLoader.onload = function () {
    var imgWidth = calcWidthByRowHeight(this.width, this.height)
    var imgAndGapWidth = imgWidth + self.colGap
    var element = createBlockElement(this.src, self.imgs[imgIndex], imgWidth, self.rowHeight, self.rowLength)
    var buffer = self.minImgWidth
    addElementToTempRow(element, imgAndGapWidth)
    if (tempAccumulateWidth + buffer >= self.dom.offsetWidth) {
      adjustImagesInTheRow()
      handleCompleteRow()
    }
    loadImage(++imgIndex, imgsLength)
  }
  imgLoader.onerror = function (e) {
    loadImage(++imgIndex, imgsLength)
  }
  loadImage(imgIndex, imgsLength)
  
  function loadImage(imgIndex, imgsLength) {
    removeIfImgBlockExist(imgIndex)
    if (imgIndex === imgsLength) {
      if (tempAccumulateWidth) {
        handleUnCompleteRow()
      }
      return
    }
    var imgSrc = self.imgs[imgIndex]
    if (imgSrc && typeof imgSrc === 'object') {
      if (imgSrc.src) {
        imgSrc = imgSrc.src
      } else {
        console.error('Invalid format: elements in imgs should be a string or an object with src attribute. Picture in index: ' + imgIndex + ' will not be shown.')
      }
    }
    imgLoader.src = imgSrc
  }
  function removeIfImgBlockExist(imgIndex) {
    if(imgDOMs[imgIndex]) {
      imgDOMs[imgIndex].remove()
    }
  }
  function calcWidthByRowHeight(width, height) {
    var ratio = self.rowHeight / height
    var result = Math.round(width * ratio)
    var buffer = 100
    if (result < self.minImgWidth + buffer) {
      result = self.minImgWidth
    }
    return result
  }
  function createBlockElement(imgSrc, imgConfig, imgWidth, imgHeight, rowIndex) {
    var element = document.createElement('div')
    var rowGap = self.rowGap * rowIndex
    var top = self.rowHeight * rowIndex + rowGap
    var left = tempAccumulateWidth
    element.style.backgroundImage = 'url('+ imgSrc +')'  
    element.className = 'photo-block'
    element.style.width = imgWidth + 'px'
    element.style.height = imgHeight + 'px'    
    element.style.top = top + 'px'
    element.style.left = left + 'px'
    if (self.imgOnClick) {
      element.onclick = function (e) {
        self.imgOnClick(e, imgConfig)
      }
      element.className += ' photo-block--clickable'
    }
    element.innerHTML = createBlockElementChildren(imgConfig)
    return element
  }
  function createBlockElementChildren(imgConfig) {
    var htmlString = '<div class="photo-block__panel">'
    if (self.panelHTMLSetter) {
      htmlString += self.panelHTMLSetter(imgConfig) 
    }
    htmlString += '</div>'
    return htmlString
  }
  function addElementToTempRow(element, imgAndGapWidth) {
    tempAccumulateWidth += imgAndGapWidth
    tempRow.push(element)
  }
  function adjustImagesInTheRow() {
    var pad = self.dom.offsetWidth - (tempAccumulateWidth - self.colGap)
    var adjustElementsIndex = []
    for (var i = 0; i < tempRow.length; i++) {
      if (pad > 0) {
        adjustElementsIndex.push(i)
      } else {
        var element = tempRow[i]
        var elementWidth = parseFloat(element.style.width.replace('px', ''))
        if (elementWidth > self.minImgWidth) {
          adjustElementsIndex.push(i)
        }
      }
    }
    var padPerBlock = pad / adjustElementsIndex.length
    var accumulateWidth = 0
    for (var i = 0; i < tempRow.length; i++) {
      var element = tempRow[i]
      var width = parseFloat(element.style.width.replace('px', ''))
      if (adjustElementsIndex.includes(i)) {
        width += padPerBlock
        element.style.width = width + 'px'
      }
      element.style.left = accumulateWidth + 'px'
      accumulateWidth += width + self.colGap
    }
  }
  function handleCompleteRow() {
    renderRow()
    resetTempForNextRow()
  }
  function handleUnCompleteRow() {
    if (self.showUnCompeleteRow || self.rowLength === 0) {
      renderRow(true)  
    }
    resetTempForNextRow()
  }
  function renderRow(isRowUnComplete) {
    var rowLength = 0
    if (!isRowUnComplete) {
      self.rowLength += 1
    } else {
      rowLength += 1
    }
    rowLength += self.rowLength
    var accumulateBlockHeight = self.rowHeight * rowLength + self.rowGap * (rowLength - 1)
    self.dom.style.height = parseFloat(accumulateBlockHeight) + 'px'
    tempRow.map(function(element) {
      self.dom.append(element)
      if (!isRowUnComplete) self.compeleteIndex += 1
    })
  }
  function resetTempForNextRow() {
    tempRow = []
    tempAccumulateWidth = 0
  }
}
PhotoGridBox.prototype.setImgOnClick = function (imgOnClick) {
  if (imgOnClick) {
    this.imgOnClick = imgOnClick    
  }
  this._rerender(this)
}
PhotoGridBox.prototype.setPanelHTMLSetter = function (panelHTMLSetter) {
  if (panelHTMLSetter) {
    this.panelHTMLSetter = panelHTMLSetter    
  }
  this._rerender(this)
}
PhotoGridBox.prototype.setShowUnCompleteRow = function (value) {
  if (typeof value === 'boolean') this.showUnCompeleteRow = value
}
PhotoGridBox.prototype._rerender = function (self) {
  this.rowLength = 0
  this.rowHeight = this._getRowHeight()
  this.minImgWidth = this._getMinImgWidth()
  this.compeleteIndex = -1
  self.dom.style.width = null
  this._render()
}
PhotoGridBox.prototype._addWindowResizeEvent = function () {
  if (this.isResizeEventAdded) return
  var self = this
  var delay = 300
  var timeout
  this._resizeEvent = function () {
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      if (self.lastRenderedWindowOffsetWidth !== window.innerWidth) {
        self._rerender(self)
        self.lastRenderedWindowOffsetWidth = window.innerWidth
      }      
    }, delay)
  }
  window.addEventListener('resize', this._resizeEvent)
  this.isResizeEventAdded = true
}
PhotoGridBox.prototype._removeWindowResizeEvent = function () {
  window.removeEventListener('resize', this._resizeEvent)
  this.isResizeEventAdded = false
}
PhotoGridBox.prototype.destroy = function () {
  this._removeWindowResizeEvent()
  this.rowLength = 0
  this.compeleteIndex = -1
  this.dom.remove()
  this.dom = null
  this.imgs = []
}

export default PhotoGridBox
