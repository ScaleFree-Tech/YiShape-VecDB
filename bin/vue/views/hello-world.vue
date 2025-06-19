<template id="hello-world">
  <h1 class="hello-world">Hello, World!</h1>
  <br />
  <el-button>{{ message }}</el-button>


</template>
<script>

const App2 = {
  data() {
    return {
      message: "Hello Element Plus",
    };
  },
  template: "#hello-world"
};


console.log("aabb");

app.component("hello-world", App2);
</script>
<style>
.hello-world {
  color: goldenrod;
}
</style>
