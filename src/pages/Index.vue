<template>
  <Layout>

    <div class="flex flex-wrap">
      <select v-model="ordem" class="appearance-none flex-none bg-gray-800 text-gray-200 px-4 py-2 rounded focus:outline-none focus:bg-gray-800 m-1">
        <option disabled>Ordenar por:</option>
        <option value="title|asc">Nome ↑</option>
        <option value="title|desc">Nome ↓</option>
        <option value="date|asc">Data ↑</option>
        <option value="date|desc">Data ↓</option>
      </select>
      <button class="btn" @click.prevent="tag_filtro = ''" :class="{'ativo':tag_filtro == ''}">todos</button>
      <button v-for="tag in tagsOrdenadas" class='btn whitespace-no-wrap' @click.prevent="tag_filtro = tag" :class="{'ativo':tag_filtro == tag}"># {{tag}}</button>
    </div>

    <div
      v-masonry
      transition-duration="0.3s"
      item-selector=".masonry-grid-item"
      horizontal-order="true"
      class="masonry-grid">

      <div v-masonry-tile class="w-full sm:w-1/3 lg:w-1/4 xl:w-1/6 overflow-hidden px-1 py-1 group masonry-grid-item"  v-for="(card, index) in cardsFiltrado" :key="index">
        <div class="relative">
          <img class="rounded w-full" :src="card.image" :alt="card.title">
          <div v-view class="rounded-b bg-gray-800 w-full absolute hidden group-hover:block bottom-0 px-4 py-2">
            <div class="text-gray-200 font-bold text-base mb-2">{{card.title}}</div>
            <div class="flex">
              <span class="flex-none text-sm font-semibold text-orange-400 cursor-pointer mr-2" v-for="tag in card.tags" @click.prevent="tag_filtro = tag"># {{tag}}</span>
              <div class="flex-auto text-gray-400 text-sm text-right">{{printdata(card.date)}}</div>
            </div>
          </div>
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
      var mdata = moment(data);
      return (mdata.year() == moment().year()) ? mdata.format('D [de] MMMM') : mdata.format('D [de] MMMM[ ]YYYY');
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
      // this.$nextTick(function () {
      //   this.$redrawVueMasonry()
      // });
      setTimeout(function(){ 
        if (typeof vthis.$redrawVueMasonry === "function") {
          vthis.$redrawVueMasonry()
        }
      }, 100);
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

/*.masonry-grid-item{
  width: 300px;
}*/

/*.grid-item {
  width: 300px;
  position: relative;
  text-align: center;
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
}*/

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
    @apply appearance-none bg-gray-700 text-orange-400 px-4 py-2 font-semibold rounded m-1;
  }
  .btn:hover, .btn.ativo {
    @apply bg-gray-800;
  }


</style>
