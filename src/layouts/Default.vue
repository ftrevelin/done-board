<template>
  <div class="layout">
    <slot/>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
body{
  @apply bg-gray-900;
  padding: 0;
  margin: 0;
}@media screen and (min-width: 992px) {
  .container {
    width: 60%;
    margin: 0 auto;
    padding: 30px 0px;
  }
}
</style>
