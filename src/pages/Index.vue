<template>
  <Layout>
    <button @click.prevent="shufflelista()">Shuffle</button>
    <br>
    <div
      v-masonry
      transition-duration="0.3s"
      item-selector=".grid-item"
      gutter="10"
      horizontal-order="true"
      class="grid">
      <div v-masonry-tile v-for="({node: card}, index) in $page.cards.edges" :key="card.id" class="grid-item" >
        <img :src="card.image" :alt="card.title" class="grid-item-img">
        <div class="grid-item-centered">
          <span>{{card.title}}</span></br>
          <span>{{printags(card)}}</span>
        </div>
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
        image (width: 300, quality: 90)
        path
        tags
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
    shufflelista: function(){
      var vthis = this;
      this.$page.cards.edges = _.shuffle(this.$page.cards.edges);
      this.$nextTick(function () {
        this.$redrawVueMasonry()
      });
    },
    printags: function(card){
      return _.join(card.tags, ', ');
    }
  },
  computed: {

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
  display: none;
  font-family: Fira Sans;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: black;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
}
.grid-item:hover .grid-item-centered {
  display: block;
}

</style>
