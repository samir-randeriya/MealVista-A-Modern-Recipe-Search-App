<template>
    <!-- Modal Container (Full-Screen Overlay) -->
    <div class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full sm:w-3/4 md:w-1/2 h-full sm:h-[90%] max-h-full sm:max-h-[90%] p-[45px_20px_30px_20px] rounded-lg shadow-lg relative flex flex-col overflow-hidden">
            
            <!-- Close Button -->
            <button class="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-sm cursor-pointer" @click="$emit('close')">
                ✖
            </button>

            <!-- Meal Details Section -->
            <div v-if="meal" class="flex flex-col space-y-4 overflow-y-auto p-2 flex-1">

                <!-- First Row: Meal Image & Basic Info -->
                <div class="flex flex-col md:flex-row">
                    <!-- Image (Left, Centered) -->
                    <div class="md:w-1/2 flex justify-center items-center">
                        <img :src="meal.strMealThumb" class="w-32 h-32 sm:w-44 sm:h-44 object-cover rounded-lg shadow-md" alt="Meal Image">
                    </div>

                    <!-- Meal Details (Right Side) -->
                    <div class="md:w-1/2 flex flex-col justify-center text-center md:text-left p-3">
                        <h2 class="text-base sm:text-lg font-semibold mb-1">{{ meal.strMeal }}</h2>
                        <p class="text-gray-600 text-xs sm:text-sm"><strong>Area:</strong> {{ meal.strArea }}</p>
                        <p class="text-gray-600 text-xs sm:text-sm"><strong>Category:</strong> {{ meal.strCategory }}</p>
                    </div>
                </div>

                <!-- Ingredients Section -->
                <div class="p-2 border-t text-xs sm:text-sm text-gray-700">
                    <h3 class="font-medium mb-2 text-center md:text-left">Ingredients:</h3>
                    <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                        <!-- Looping through ingredients and displaying them as tags -->
                        <span v-for="(ingredient, index) in getIngredients()" :key="index"
                            class="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full">
                            {{ ingredient }}
                        </span>
                    </div>
                </div>

                <!-- Instructions Section -->
                <div class="p-2 border-t text-xs sm:text-sm text-gray-700">
                    {{ meal.strInstructions }}
                </div>

                <!-- YouTube Link for Recipe Video -->
                <div v-if="meal.strYoutube" class="text-center mt-2">
                    <a :href="meal.strYoutube" target="_blank" class="text-blue-500 text-xs sm:text-sm underline">
                        Watch Recipe Video
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        meal: {
            type: Object,
            required: true
        }
    },
    methods: {
        /**
         * Extracts and formats the list of ingredients from the meal object.
         * Only includes ingredients that are not empty or null.
        */
        getIngredients() {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = this.meal[`strIngredient${i}`]; // Fetch ingredient
                const measure = this.meal[`strMeasure${i}`]; // Fetch corresponding measurement

                // Ensure ingredient is not empty before adding
                if (ingredient && ingredient.trim()) {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }
            return ingredients;
        }
    }
};
</script>