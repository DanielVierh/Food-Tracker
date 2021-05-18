// Variabeln 
let buttonAdd = document.getElementById('btnAdd');
let buttonScroll_Up = document.getElementById('btnscrl_Up');
var haferflocken = "";
var today_Steps = 0;
var array_Food_DB = [];
var today_eaten = [];
var selected_Food = "";
var selectedFoodIndex = 0;
//====================================================================================
// Upload Food DB
//====================================================================================

// let upload = document.getElementById('upload');
// let outputBx = document.getElementById('outputBx');

// upload.addEventListener('change', ()=> {
//     let fr = new FileReader();
//     fr.readAsText(upload.files[0]);
//     fr.onload = function() {
//         var dataObj = fr.result;
//         var obj = JSON.parse(dataObj);
//         let arrAmount = obj.length;
//         console.log(obj);
//         outputBx.innerHTML = arrAmount + " Produkte wurden geladen";
//     }
// })


// Automatisches lesen des JSON Files
function fetch_Food_DB() {
    fetch("Food_DB_v2021_05.json")
    .then(response => response.json())
    .then(data => {
        array_Food_DB = data;
        console.log(array_Food_DB);
        createTable_FoodDB();
    })
}

// Weg machen
fetch_Food_DB();


// Tabelle aller Lebensmittel




//====================================================================================
// EventListener
//====================================================================================

buttonAdd.addEventListener('click', addProduct);
buttonScroll_Up.addEventListener('click', scroll_UP);

// Damit gesuchtes Produkt direkt überschreibbar ist
document.getElementById('searchInput').addEventListener('click', selectWord);




// Scroll Section
function scroll_UP() {
    window.scrollTo(0, 0);
    console.log("ScrollUP");
}


// Wort markieren
function selectWord() {
    const inp = document.getElementById('searchInput');
    inp.select()
}


// Klasse für Lebensmittel

class Food {
    constructor(productName, kcal, fat, carbs, sugar, protein, salt, fiber, quantityUnit) {
        this.productName = productName;
        this.kcal = kcal;
        this.fat = fat;
        this.carbs = carbs;
        this.sugar = sugar;
        this.protein = protein;
        this.salt = salt;
        this.fiber = fiber;
        this.quantityUnit = quantityUnit;
    }
}

class TodayEatenFood {
    constructor(intake_productName, intake_amount, intake_kcal, intake_fat, intake_carbs, intake_sugar, intake_protein, intake_salt, intake_fiber) {
        this.intake_productName = intake_productName;
        this.intake_amount = intake_amount;
        this.intake_kcal = intake_kcal;
        this.intake_fat = intake_fat;
        this.intake_carbs = intake_carbs;
        this.intake_sugar = intake_sugar;
        this.intake_protein = intake_protein;
        this.intake_salt = intake_salt;
        this.intake_fiber = intake_fiber;
    }
}

// function addingPrototypeProduct() {
//     haferflocken = new Food("Haferflocken", 372.0, 0, 7.0, 58.7, 0.7, 13.5, 0, 10.0, "1EL = 10g")
    
// }


function addProduct() {
    alert("Muss noch gebaut werden");

}


//============================================================================
//  Schritte PopUp
//============================================================================
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal_Steps');
        closeModal(modal);
    })
})

function openModal(modal) {
    if(modal == null) return
    document.getElementById('inp_Steps').value = today_Steps;
    modal.classList.add('active');
    overlay.classList.add('active');
    const inp = document.getElementById('inp_Steps');
    inp.select()
}

function closeModal(modal) {
    if(modal == null) return
    get_new_Steps();
    modal.classList.remove('active');
    overlay.classList.remove('active');
}


function get_new_Steps() {
    try {
        today_Steps = parseInt(document.getElementById('inp_Steps').value);
        document.getElementById('btnSteps').innerHTML = today_Steps + " &#128095";
        coloring_Labels(); 
        // TODO-- Persistent speichern

    } catch (error) {
        alert("Nur Zahlen eingeben");
    }
}


//============================================================================
// Food Datenbank Tabelle 
//============================================================================

  function createTable_FoodDB() {
 
    // CREATE HTML TABLE OBJECT
    var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement("table"),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < array_Food_DB.length; i++) {
      // ADD "BASIC" CELL
      var cell = row.insertCell();
      cell.innerHTML = array_Food_DB[i].productName;
  
      // ATTACH A RUNNING NUMBER OR CUSTOM DATA
     cell.dataset.id = i;
   
        // Produktauswahl
      cell.addEventListener("click", function(){
        selectedFoodIndex = this.dataset.id;  
        selected_Food = array_Food_DB[selectedFoodIndex];
        let calories = selected_Food.kcal;
        let quantity = selected_Food.quantityUnit;
        document.getElementById('statusX').innerHTML = "";
        document.getElementById('selectedFoodAnzeige').innerHTML = selected_Food.productName;
        document.getElementById('selectedFoodMakros').innerHTML = "Kcal / 100g = " + calories + " // Mengeneinheit: " + quantity;
        // Fokus auf Textfeld setzen
        document.getElementById('foodAmound').focus();
      });
  
  
      // BREAK INTO NEXT ROW
      var next = i + 1;
      if (next%perrow==0 && next!=array_Food_DB.length) {
        row = table.insertRow();
      }
    }
  
    // ATTACH TABLE TO CONTAINER
    document.getElementById("containerTabelle").appendChild(table);
  }

//============================================================================
  // Suche 
//============================================================================

  $('#searchInput').on('keyup', function(){
      var value = $(this).val()
      //console.log('Value:', value)
      var data = searchTable(value, array_Food_DB)
      buildTable(data)
  })


  buildTable(array_Food_DB)

  function searchTable(value, data){
      var filteredData = []

      for (var i = 0; i < data.length; i++) {
          value = value.toLowerCase()
          var name = data[i].productName.toLowerCase()

          if(name.includes(value)){
              filteredData.push(data[i])
          }
      }

      return filteredData
  }


  function buildTable(data){
      var table = document.getElementById('containerTabelle'); 
      
      table.innerHTML = ''; 
      table = document.createElement("table")
      row = table.insertRow();
      for(var i = 0; i < data.length; i++) {  

        var perrow = 1, // 1 CELLS pro ROW
        table = document.createElement("table"),
        row = table.insertRow();
        // FPR Schleife
        for (var i = 0; i < data.length; i++) {
        // Füge "BASIC" CELL hinzu
        var cell = row.insertCell();
        cell.innerHTML = data[i].productName;
    
            // Für Auswahl
        cell.dataset.id = i;


        cell.addEventListener("click", function(){
            selectedFoodIndex = this.dataset.id;  
            selected_Food = data[selectedFoodIndex];
            let calories = selected_Food.kcal;
            let quantity = selected_Food.quantityUnit;
            document.getElementById('statusX').innerHTML = "";
            document.getElementById('selectedFoodAnzeige').innerHTML = selected_Food.productName;
            document.getElementById('selectedFoodMakros').innerHTML = "Kcal / 100g = " + calories + " // Mengeneinheit: " + quantity;
            // Fokus auf Textfeld setzen
            document.getElementById('foodAmound').focus();
          });

        var next = i + 1;
        if (next%perrow==0 && next!=data.length) {
          row = table.insertRow();
        }
      }
    
      // Füge Tabelle zu Container hinzu
      document.getElementById("containerTabelle").appendChild(table);

      }
  }





//============================================================================
  // Food zu heute gegessen hinzufügen
  //============================================================================
  function add_Food_to_TodayList() {
      //Produkt nicht "", also ausgewählt
    if(selected_Food != "") {
        if(document.getElementById('foodAmound').value == "") {
            alert("Bitte eine Menge eingeben");
        }else{
            // Produkt hinzufügen
            try {
                let selectedAmount = parseFloat(document.getElementById('foodAmound').value);
                let kcal_Intake = parseInt(selectedAmount * selected_Food.kcal / 100);
                let fat_Intake = parseFloat(selectedAmount * selected_Food.fat / 100);
                let carb_Intake = parseFloat(selectedAmount * selected_Food.carbs / 100);
                let sugar_Intake = parseFloat(selectedAmount * selected_Food.sugar / 100);
                let protein_Intake = parseFloat(selectedAmount * selected_Food.protein / 100);
                let salt_Intake = parseFloat(selectedAmount * selected_Food.salt / 100);
                let fiber_Intake = parseFloat(selectedAmount * selected_Food.fiber / 100);

                today_eaten.push(new TodayEatenFood(selected_Food.productName,
                                                    selectedAmount,
                                                    kcal_Intake,
                                                    fat_Intake,
                                                    carb_Intake,
                                                    sugar_Intake,
                                                    protein_Intake,
                                                    salt_Intake,
                                                    fiber_Intake
                     ));

                     // Anzeigen, dass Produkt eingetragen wurde
                document.getElementById('statusX').innerHTML = selected_Food.productName + " wurde eingetragen";
                // Aufräumen
                document.getElementById('foodAmound').value = "";
                selected_Food = "";
                selectedFoodIndex = -1;
                document.getElementById('selectedFoodAnzeige').innerHTML = "";
                document.getElementById('selectedFoodMakros').innerHTML = "";
                

            } catch (error) {
                console.log(error);
            }
        }
    }else{
        alert("Konnte nicht gespeichert werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf speichern klicken");
    }
    console.log(today_eaten);
    create_Table_TodayEaten();
  }



//============================================================================
  // Tabelle für Heute gegessen
//============================================================================

function create_Table_TodayEaten() {
    // Reset der Tabelle
    document.getElementById("containerTabelle_Today").innerHTML = "";

        // CREATE HTML TABLE OBJECT
        var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement("table"),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < today_eaten.length; i++) {
      // ADD "BASIC" CELL
      var cell = row.insertCell();
      cell.innerHTML = today_eaten[i].intake_productName + " | " + today_eaten[i].intake_kcal + " Kcal";
  
      // ATTACH A RUNNING NUMBER OR CUSTOM DATA
     cell.dataset.id = i;
   
        // Produktauswahl
      cell.addEventListener("click", function(){
        selectedFoodIndex = this.dataset.id;  
        selected_Food = today_eaten[selectedFoodIndex];
        let calories = selected_Food.intake_kcal;
        let quantity = selected_Food.quantityUnit;
        document.getElementById('sel_change_Prod').innerHTML = selected_Food.intake_productName;
        document.getElementById('foodAmound_Change').value = selected_Food.intake_amount;
      });
  
  
      // BREAK INTO NEXT ROW
      var next = i + 1;
      if (next%perrow==0 && next!=today_eaten.length) {
        row = table.insertRow();
      }
    }
  
    // ATTACH TABLE TO CONTAINER
    document.getElementById("containerTabelle_Today").appendChild(table);
}






//============================================================================
  // Färbung der Label je nach Fortschritt
//============================================================================

function coloring_Labels() {
    step_Progress();
}


// Schritte
function step_Progress(){
    if(today_Steps <= 4999) {
        document.getElementById('btnSteps').style.color = "red";
    }else if(today_Steps <= 9999) {
        document.getElementById('btnSteps').style.color = "orange";
    }else{
        document.getElementById('btnSteps').style.color = "rgb(27, 206, 27)";
    }
}