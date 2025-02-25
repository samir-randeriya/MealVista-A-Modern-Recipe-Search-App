import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        foods: [],        // All meals (full list)
        sortedFoods: [],  // Displayed meals (filtered & sorted)
        initialLoaded: false,
        areas: [],
        selectedArea: "Indian", // Default selected area
        selectedSortOption: "relevance", // Default sorting option
        mealDetails: null, // Stores details of selected meal
        isModalOpen: false // Modal state
    },
    mutations: {
        setFoods(state, foods) {
            state.foods = foods;  // Store all fetched meals
            state.sortedFoods = [...foods]; // Keep same list, let component handle pagination
            state.initialLoaded = true;
        },
        addMoreFoods(state, newMeals) {
            state.foods = [...state.foods, ...newMeals]; // Append new meals to existing list
            state.sortedFoods = [...state.foods]; // Keep all meals available
        },
        setFilteredFoods(state, filteredFoods) {
            state.sortedFoods = [...filteredFoods]; // Update filtered meal list
        },
        setAreas(state, areas) {
            state.areas = areas; // Store available meal areas
        },
        setSelectedArea(state, area) {
            state.selectedArea = area; // Update selected area filter
        },
        setSelectedSort(state, sortOption) {
            state.selectedSortOption = sortOption; // Update selected sorting option
        },
        applyFilters(state) {
            let filtered = [...state.foods];

            // Apply area filter if selected
            if (state.selectedArea) {
                filtered = filtered.filter(meal => meal.strArea === state.selectedArea);
            }

            // Apply sorting filter
            switch (state.selectedSortOption) {
                case "rating-asc":
                    filtered.sort((a, b) => a.rating - b.rating);
                    break;
                case "rating-desc":
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case "alpha-asc":
                    filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
                    break;
                case "alpha-desc":
                    filtered.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
                    break;
                default:
                    break;
            }

            state.sortedFoods = filtered;
        },
        setMealDetails(state, meal) {
            state.mealDetails = meal; // Store selected meal details
        },
        setModalOpen(state, isOpen) {
            state.isModalOpen = isOpen; // Control modal visibility
        }
    },
    actions: {
        async fetchFoods({ commit }) {
            try {
                const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''); // Full alphabet
                const firstBatchLetters = ['a', 'b'];  // Fetch 'a' and 'b' first
                let allMeals = [];
        
                // Fetch 'a' and 'b' first for immediate display
                for (const letter of firstBatchLetters) {
                    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
                    if (response.data.meals) {
                        const mealsWithRatings = response.data.meals.map(meal => ({
                            ...meal,
                            rating: Math.floor(Math.random() * 5) + 1 // Assign random rating
                        }));
                        allMeals = [...allMeals, ...mealsWithRatings];
                    }
                }
        
                // Commit first batch for instant display
                commit('setFoods', allMeals);
        
                // Fetch remaining letters in the background
                for (const letter of alphabet.filter(l => !firstBatchLetters.includes(l))) {
                    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
                    const response = await axios.get(url);
        
                    if (response.data.meals) {
                        const mealsWithRatings = response.data.meals.map(meal => ({
                            ...meal,
                            rating: Math.floor(Math.random() * 5) + 1 // Assign random rating
                        }));
                        commit('addMoreFoods', mealsWithRatings); // Add data dynamically
                    }
                }
                
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        },        
        searchFoods({ commit, state }, query) {
            if (!query) {
                commit('resetFoods'); // Reset to all meals if query is empty
                return;
            }
        
            const filteredMeals = state.foods.filter(meal =>
                meal.strMeal.toLowerCase().includes(query.toLowerCase())
            );
        
            commit('setFilteredFoods', filteredMeals); // Update filtered meals
        },
        async fetchAreas({ commit }) {
            try {
                const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
                if (response.data.meals) {
                    const areas = response.data.meals.map(meal => meal.strArea);
                    commit('setAreas', areas); // Store fetched areas
                }
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        },
        updateAreaFilter({ commit, dispatch }, area) {
            commit('setSelectedArea', area); // Set area filter
            dispatch('applyFilters'); // Apply updated filters
        },
        updateSortFilter({ commit, dispatch }, sortOption) {
            commit('setSelectedSort', sortOption); // Set sorting option
            dispatch('applyFilters'); // Apply updated sorting
        },
        applyFilters({ commit }) {
            commit('applyFilters'); // Trigger filtering logic
        },
        async fetchMealDetails({ commit }, mealId) {
            try {
                const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                if (response.data.meals) {
                    commit('setMealDetails', response.data.meals[0]); // Store meal details
                    commit('setModalOpen', true); // Open the modal
                }
            } catch (error) {
                console.error('Error fetching meal details:', error);
            }
        },
        closeModal({ commit }) {
            commit('setModalOpen', false); // Close modal
            commit('setMealDetails', null); // Reset meal details
        }
    },
    getters: {
        getFoods: (state) => state.sortedFoods, // Return sorted meals
        getAreas: (state) => state.areas, // Return available areas
        getMealDetails: (state) => state.mealDetails, // Return meal details
        isModalOpen: (state) => state.isModalOpen // Return modal state
    },
});

