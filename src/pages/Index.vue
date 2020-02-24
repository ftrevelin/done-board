<template>
  <Layout>
    <div
      v-masonry
      transition-duration="0.3s"
      item-selector=".grid-item"
      gutter="10"
      class="grid">
      <div v-masonry-tile v-for="({node: card}) in dobraarray" :key="card.id" class="grid-item" >
        <img :src="card.image" :alt="card.title" class="grid-item-img">
        <span class="grid-item-centered">{{card.title}}</span>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query {
  cards: allCards {
    edges {
      node {
        title
        image
        path
      }
    }
  }
}
</page-query>

<script>
import Vue from 'vue'
import _ from 'lodash'

export default {
  metaInfo: {
    title: "Home"
  },
  methods: {
    randomaltura: function(){
      return (_.random(1, 4) * 100)+'px';
    },
  },
  computed: {
    dobraarray: function(){
      return _.concat(this.$page.cards.edges, this.$page.cards.edges, this.$page.cards.edges)
    },
  },
  beforeMount: function(){
    const VueMasonryPlugin = require('vue-masonry').VueMasonryPlugin
    Vue.use(VueMasonryPlugin)
    if (typeof this.$redrawVueMasonry === "function") {
      this.$redrawVueMasonry()
    }
  }
};
</script>

<style>

.grid-item {
  width: 300px;
  position: relative;
  text-align: center;
  /*color: white;*/
  margin-bottom: 10px;
}

.grid-item-img{
  width: 100%;
}

.grid-item-centered {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: black;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
}

</style>
