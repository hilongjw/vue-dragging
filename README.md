Vue-dragging
========

see demo: [http://hilongjw.github.io/vue-dragging/](http://hilongjw.github.io/vue-dragging/)

Makes your elements draggable in Vue. Some of goals of this project worth noting include:

* support desktop and mobile 
* Vue data-driven philosophy
* Supports both of Vue 1.0 and Vue 2.0

## Requirements

- Vue: ^1.0.0 or ^2.0.0 

## Install

From npm:

``` sh

$ npm install vue-dragging --save

```

## Usage

```javascript
//main.js

import VueDragging from 'vue-dragging'

Vue.use(VueDragging)
```

```html
<!--your.vue-->
<script>
export default {
  data () {
    return {
        colors: [{
            text: "Aquamarine"
        }, {
            text: "Hotpink"
        }, {
            text: "Gold"
        }, {
            text: "Crimson"
        }, {
            text: "Blueviolet"
        }, {
            text: "Lightblue"
        }, {
            text: "Cornflowerblue"
        }, {
            text: "Skyblue"
        }, {
            text: "Burlywood"
        }]
    }
  }
}
</script>

<template>
  <div class="color-list">
      <div 
          class="color-item" 
          v-for="color in colors" v-dragging="{ item: color, list: colors, group: 'color' }"
          :key="color.text"
      >{{color.text}}</div>
  </div>
</template>
```

# API

## Instance Methods

### `v-dragging="{ item: color, list: colors, group: 'color' }"`

#### Arguments:

 * `{item} Object`
 * `{list} Array`
 * `{group} String`

 `group` is unique key of dragable list.

#### Example

```html
<!-- Vue2.0 -->
<div class="color-list">
    <div 
        class="color-item" 
        v-for="color in colors" v-dragging="{ item: color, list: colors, group: 'color' }"
        :key="color.text"
    >{{color.text}}</div>
</div>

<!-- Vue1.0 -->
<div class="color-list">
    <div 
        class="color-item" 
        v-for="color in colors" v-dragging="{ item: color, list: colors, group: 'color' }"
        track-by="color.text"
    >{{color.text}}</div>
</div>
```



# License

[The MIT License](http://opensource.org/licenses/MIT)
