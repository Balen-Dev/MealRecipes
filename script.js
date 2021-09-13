const open = document.getElementById("open");
const close = document.getElementById("close");
const container = document.querySelector(".container");

open.addEventListener("click", () => container.classList.add("show-nav"));
close.addEventListener("click", () => container.classList.remove("show-nav"));

// Meal App
const search = document.getElementById("search"),
submit = document.getElementById("submit"),
random = document.getElementById("random"),
mealsEl = document.getElementById("meals"),
resultHeading = document.getElementById("result-heading"),
single_mealEL = document.getElementById("single-meal");


// Search Meals and Fetch From API
function searchMeal (e) {
  e.preventDefault();

  // Clear Single Meal 
  single_mealEL.innerHTML = '';

  // Get Search Term
  const term = search.value;

  // Check If Empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {
      resultHeading.innerHTML = `<h4>Search results for '${term}': </h4>`;

      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search results for (${term}), try another serach term please! </p>`
      }
      else {
        mealsEl.innerHTML = data.meals.map(meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>            
            </div>
          </div>
        `)
        .join('');
      }
    });

    // Clear Search Text
    search.value = '';

  }
  else {
    alert("Please enter a search term!")
  }
}

// Load Initial Meals ( Filtered by Area => American )
function loadInitialMeals () {
     // Clear Single Meal 
     single_mealEL.innerHTML = '';

     fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=American`)
     .then(res => res.json())
     .then(data => {
       resultHeading.innerHTML = ``;
  
       if (data.meals === null) {
         resultHeading.innerHTML = `Error , Please refresh the page`
  
         mealsEl.innerHTML = '';
       }
       else {
         mealsEl.innerHTML = data.meals.map(meal => `
           <div class="meal">
             <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
             <div class="meal-info" data-mealID="${meal.idMeal}">
               <h3>${meal.strMeal}</h3>            
             </div>
           </div>
         `)
         .join('');
       }
     });
  
     // Clear Search Text
     search.value = '';
}

loadInitialMeals();

// Search Meals by Category 
function loadMealsByCategory (category) {
   // Clear Single Meal 
   single_mealEL.innerHTML = '';

   fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
   .then(res => res.json())
   .then(data => {
     resultHeading.innerHTML = `<h4>${category} Meals: </h4>`;

     if (data.meals === null) {
       resultHeading.innerHTML = `<p>(<strong>${category}</strong>) is not available at the moment, please try another category. </p>`

       mealsEl.innerHTML = '';
     }
     else {
       mealsEl.innerHTML = data.meals.map(meal => `
         <div class="meal">
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
           <div class="meal-info" data-mealID="${meal.idMeal}">
             <h3>${meal.strMeal}</h3>            
           </div>
         </div>
       `)
       .join('');
     }
   });

   // Clear Search Text
   search.value = '';
}

// Fetch Meal by ID
function getMealById (mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];

    addMealToDOM(meal);

  })
}

// Fetch Random Meal from API
function getRandomMeal () {
  // Clear Meals & Heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];

    addRandomMealToDOM(meal);
  });
}

// Add Meal to DOM
function addMealToDOM (meal) {
  const ingredients = [];

  for (let i=1; i<=20; ++i) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
    else {
      break;
    }
  }

  single_mealEL.innerHTML = `
  <hr/>
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info"> 
        ${meal.strCategory ? `<p><span class="categoryAndOrigin">Category:</span> ${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p><span class="categoryAndOrigin">Origin:</span> ${meal.strArea}</p>` : ''}
      </div>

      <div class="main"> 
        <p id="meal-making-instructions">${meal.strInstructions}</p>
        <hr/>
        <h2>Ingredients</h2>

        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>

    </div>
  `;

}

// Add Random Meal to DOM (Does not contain the hr)
function addRandomMealToDOM (meal) {
  const ingredients = [];

  for (let i=1; i<=20; ++i) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
    else {
      break;
    }
  }

  single_mealEL.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info"> 
        ${meal.strCategory ? `<p><span class="categoryAndOrigin">Category:</span> ${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p><span class="categoryAndOrigin">Origin:</span> ${meal.strArea}</p>` : ''}
      </div>

      <div class="main"> 
        <p id="meal-making-instructions">${meal.strInstructions}</p>
        <hr/>
        <h2>Ingredients</h2>

        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>

    </div>
  `;
}

// Scroll to Single Meal Info on Click
function scrollTo() {
  window.location = "#single-meal";
}


// Event Listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);


mealsEl.addEventListener("click", e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    }
    else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
 
  scrollTo("single-meal");
});

// Credits Modal 
const credsModal = document.querySelector(".bg-modal");
const credsBtn = document.getElementById("creds-modal-btn");
const closeModal = document.querySelector(".close");

credsBtn.addEventListener("click", () => {
  credsModal.style.display = 'flex';
});

closeModal.addEventListener("click", () => {
  credsModal.style.display = 'none';
});

// Category Modal
const categoryModal = document.querySelector(".bg-category");
const categoryModalBtn = document.getElementById("category-modal-btn");
const closeCategory = document.querySelector(".close-category");

categoryModalBtn.addEventListener("click", () => {
  categoryModal.style.display = 'flex';
});

closeCategory.addEventListener("click", () => {
  categoryModal.style.display = 'none';
});

const seafoodEl = document.getElementById("seafood-li"),
veganEl = document.getElementById("vegan-li"),
vegeterianEl = document.getElementById("vegeterian-li"),
breakfastEl = document.getElementById("breakfast-li"),
desertEl = document.getElementById("desert-li"),
starterEl = document.getElementById("starter-li"),
pastaEl = document.getElementById("pasta-li");

seafoodEl.addEventListener("click", () => {
  loadMealsByCategory('Seafood');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

veganEl.addEventListener("click", () => {
  loadMealsByCategory('Vegan');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

vegeterianEl.addEventListener("click", () => {
  loadMealsByCategory('Vegeterian');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

breakfastEl.addEventListener("click", () => {
  loadMealsByCategory('Breakfast');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

desertEl.addEventListener("click", () => {
  loadMealsByCategory('Desert');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

starterEl.addEventListener("click", () => {
  loadMealsByCategory('Starter');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});

pastaEl.addEventListener("click", () => {
  loadMealsByCategory('Pasta');
  categoryModal.style.display = 'none';
  container.classList.remove("show-nav");
});
