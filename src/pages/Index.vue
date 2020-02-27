<template>
  <Layout>
    <div class="flex flex-wrap items-stretch">
      <select v-model="ordem" class="flex-1 appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 m-2">
        <option value="date|desc">Data ↓</option>
        <option value="date|asc">Data ↑</option>
        <option value="title|desc">Nome ↓</option>
        <option value="title|asc">Nome ↑</option>
      </select>
      <button class="btn btn-blue" @click.prevent="tag_filtro = ''" :class="{'ativo':tag_filtro == ''}">tudo</button>
      <button v-for="tag in tagsOrdenadas" class='btn btn-blue' @click.prevent="tag_filtro = tag" :class="{'ativo':tag_filtro == tag}">{{tag}}</button>
    </div>
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

/*
.btn {
background-color: #333; 
color: #fff;
cursor: pointer; 
padding: 10px 30px;
}

.btn:hover, .btn.ativo {
background-color: #fff;
color: #333; 
}
*/


  .btn {
    @apply flex-1 font-bold py-2 px-4 rounded m-2;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover, .btn-blue.ativo {
    @apply bg-blue-700;
  }


</style>
