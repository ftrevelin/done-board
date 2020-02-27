<template>
  <Layout>
    <select v-model="ordem">
      <option value="date|desc">Data ↓</option>
      <option value="date|asc">Data ↑</option>
      <option value="title|desc">Nome ↓</option>
      <option value="title|asc">Nome ↑</option>
    </select>
    <span class='btn' @click.prevent="tag_filtro = ''" :class="{'ativo':tag_filtro == ''}">Todas</span>
    <span v-for="tag in tagsOrdenadas" class='btn' @click.prevent="tag_filtro = tag" :class="{'ativo':tag_filtro == tag}">{{tag}}</span>
    <br>
    <div
      v-masonry
      transition-duration="0.3s"
      item-selector=".grid-item"
      gutter="10"
      horizontal-order="true"
      class="grid">
      <div v-masonry-tile v-for="(card, index) in cardsFiltrado" :key="index" class="grid-item" >
        <img :src="card.image" :alt="card.title" class="grid-item-img">
        <div class="grid-item-text">
          <span>{{card.title}} - {{printdata(card.date)}}</span>
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
        date
        image
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

import moment from 'moment';
moment.locale('pt'); // setar o locale para "pt" (Português)
moment.updateLocale('pt', {
  months : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
});

export default {
  metaInfo: {
    title: "Home"
  },
  data () {
    return {
      ordem: 'date|desc',
      tag_filtro: '',
    }
  },
  methods: {
    printags: function(card){
      return _.join(card.tags, ', ');
    },
    printdata: function(data) {
      return moment(data).format('D [de] MMMM')
    },
  },
  computed: {
    cardsMapa: function() {
      return _.map(this.$page.cards.edges,'node');
    },
    cardsFiltrado: function() {
      var vthis = this;
      var ordemsplit = this.ordem.split("|");
      var retorno = _.orderBy(this.cardsMapa, ordemsplit[0], ordemsplit[1]);
      if (this.tag_filtro){
        var retorno = _.filter(retorno, function(o){
          return _.includes(o.tags, vthis.tag_filtro);
        });
      }
      this.$nextTick(function () {
        this.$redrawVueMasonry()
      });
      return retorno;
    },
    tagsOrdenadas: function() {
      var qntd = _.reduce(this.cardsMapa, function(result, value, key) {
        _.forEach(value.tags, function(o){
          result[o] = result[o] || 0;
          result[o]++;
        })
        return result;
      }, {});
      return _.reverse(_.sortBy(_.keys(qntd), function(o){
        return qntd[o];
      }));
    }
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

.grid-item-text {
  display: none;
  font-family: Fira Sans;
  position: absolute;
  background-color: black;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  bottom: 20px;
  right: 20px;
}
.grid-item:hover .grid-item-text {
  display: block;
}

.btn {
background-color: #333; /* adds a background colour to the button */
color: #fff; /* changes the text colour */
cursor: pointer; /* changes the mouse on hover */
padding: 10px 30px; /* adds 10px of space to top and bottom of text and 30px of space on either side */ 
}

.btn:hover, .btn.ativo {
background-color: #fff; /* adds a background hover colour to the button */
color: #333; /* changes the text colour on hover */
}

</style>
