<template>
    <!-- Header Section -->
    <header class="w-full bg-white shadow-md p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <!-- Left Side: Logo -->
        <div class="text-2xl md:text-3xl font-bold text-orange-500 text-center md:text-left">
            MealVista 🍽️
        </div>

         <!-- Right Side: Search Bar -->
        <div class="flex items-center relative w-full sm:w-80 md:w-72">
            <!-- Input field for searching food -->
            <input type="text" placeholder="Search for food..."
                class="border border-gray-300 bg-gray-100 rounded-lg py-2 pl-4 pr-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                v-model="query" />

            <!-- Search icon (magnifying glass) -->
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 1 0-12 0 6 6 0 0 0 12 0z" />
            </svg>
        </div>
    </header>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    emits: ['search'], // Emitting search event to the parent component
    setup(_, { emit }) {
        const query = ref(''); // Reactive search query
        let timeout = null; // Variable to store timeout for debouncing

        // Watch for changes in search query
        watch(query, (newQuery) => {
            clearTimeout(timeout); // Clear previous timeout

            timeout = setTimeout(() => {
                emit('search', newQuery); // Emit search event after 1s debounce
            }, 1000);
        });

        return { query };
    }
};
</script>
