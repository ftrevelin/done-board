<template>
  <Layout>
<!--     <div class="container">
      <h1>List cards</h1>
      <div v-for="card in $page.cards.edges" :key="card.id" class="card d-flex">
        <div class="card__img"
             :style="{ 'background-image': 'url(' + card.node.image + ')' }"></div>
        <div class="card__body">
          <g-link :to="card.node.path" class="card__link"></g-link>
          <h1 class="card__title">{{card.node.title}}</h1>
        </div>
      </div>
    </div> -->
    <div class="grid">
      <div v-for="card in $page.cards.edges.concat($page.cards.edges,$page.cards.edges)" :key="card.id" class="grid-item" :style="{ 'background-image': 'url(' + card.node.image + ')' }">{{card.node.title}}</div>
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
export default {
  metaInfo: {
    title: "Home"
  }
};
</script>

<style>

.grid-item {
  float: left;
  width: 80px;
  height: 60px;
  border: 2px solid hsla(0, 0%, 0%, 0.5);
}

.grid-item--width2 { width: 160px; }
.grid-item--height2 { height: 140px; }

/*.card {
  display: flex;
  align-items: center;
  box-shadow: 5px 5px 11px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  position: relative;
  margin-top: 50px;
  background-color: #fff;
}
@media screen and (max-width: 992px) {
  .card {
    display: block;
  }
}
.card__title {
  margin-top: 0;
}
.card__body {
  padding: 15px 30px;
}
.card__link {
  position: absolute;
  top: 0;
  right: 0;
  left: 0; 
  bottom: 0;
}
.card__img {
  width: 250px;
  height: 140px; 
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-right: 15px;
}@media screen and (max-width: 992px) {
  .card__img {
    width: 100%;
    height: 180px;
  }
}*/
</style>
