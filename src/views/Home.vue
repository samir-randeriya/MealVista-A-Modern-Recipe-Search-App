<template>
  <div class="flex flex-col min-h-screen">
    
    <!-- Header Section with Search Functionality -->
    <div class="w-full">
      <Header @search="handleSearch" />
    </div>

    <!-- Main Content Section -->
    <div class="flex-grow w-full max-w-[1300px] mx-auto px-0 sm:px-0 md:px-0 lg:px-4">
      <!-- Filters Section for filtering and sorting food items -->
      <Filters @filter="handleFilterByArea" @sort="handleSort" />

      <!-- Display loader when data is being fetched -->
      <div v-if="loading" class="text-center my-6">
        <div class="loader"></div>
        <p class="text-gray-500 mt-2">Loading...</p>
      </div>

      <!-- Food list component to display food items -->
      <FoodList v-else :ingredients="foods" />
    </div>
      
    <!-- Footer Section -->
    <div class="w-full">
      <Footer />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Header from '../components/Header.vue';
import Filters from '../components/Filters.vue';
import FoodList from '../components/FoodList.vue';
import Footer from '../components/Footer.vue';

export default {
  components: { Header, Filters, FoodList, Footer },
  setup() {
    const store = useStore();
    const loading = ref(false); // Loading state
    const foods = ref([]);  // Stores filtered food list
    const originalFoods = ref([]); // Stores the original unfiltered food list

    // Fetch data from API when the component is mounted
    onMounted(async () => {
      loading.value = true;
      await store.dispatch('fetchFoods'); //  Fetch food data from API
      originalFoods.value = [...store.getters.getFoods]; // Store original list for reference
      foods.value = [...originalFoods.value]; // Set the displayed list
      loading.value = false;
    });

    // Handle search functionality
    const handleSearch = async (query) => {
      loading.value = true;
      if (!query.trim()) {
        foods.value = [...originalFoods.value]; // Reset to original list if search is empty
      } else {
        await store.dispatch('searchFoods', query); // Dispatch search action to Vuex store
        foods.value = [...store.getters.getFoods]; // Update displayed list with search results
      }
      loading.value = false;
    };

    // Filter food items by selected area
    const handleFilterByArea = async (selectedArea) => {
      await store.dispatch('updateAreaFilter', selectedArea);
      foods.value = [...store.getters.getFoods]; // Ensure updated data is displayed
    };

    const handleSort = async (sorting) => {
      await store.dispatch('updateSortFilter', sorting); // Dispatch filter action
      foods.value = [...store.getters.getFoods]; // Update displayed list
    };

    return { foods, loading, handleSearch, handleFilterByArea, handleSort };
  }
};
</script>