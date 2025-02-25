<template>
  <!-- Main container with full width and minimum screen height -->
  <div class="w-full min-h-screen bg-gray-100 flex justify-center">
    <div class="w-full">  
      <!-- Home component rendering -->
      <Home />  
    </div>
  </div>
</template>

<script>
import Home from './views/Home.vue';
 
  export default {
    components: { Home }, // Registering Home component
  };
</script>