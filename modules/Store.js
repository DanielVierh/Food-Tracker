export let stored_planed_food = [];

//* get planed_food
function fetch_stored_planed_food() {
  // Planned Meal
  const item = localStorage.getItem("stored_Planned_Eaten");
  if (item === null) {
    stored_planed_food = [];
  } else {
    try {
      stored_planed_food = JSON.parse(item);
    } catch (e) {
      stored_planed_food = [];
    }
  }
  return stored_planed_food;
}

// Initialize from localStorage at module load
fetch_stored_planed_food();

//* Save planed_food
export function save_stored_planed_food(arr) {
  localStorage.setItem("stored_Planned_Eaten", JSON.stringify(arr));
}
