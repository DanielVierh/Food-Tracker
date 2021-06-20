// Variablen
var array_Food_DB = [];
var planned_Meal = [];
var additional_Targets = [];
var selected_Food = "";
var selectedFoodIndex = 0;
var foodFromToday = false;
var kcal_Ziel = 1;
var max_Sugar = 0;
var max_Salt = 0;
var min_Protein = 0;
var min_Fiber = 0;
var planned_Kcal = 0;
var planned_Carbs = 0.0;
var planned_Sugar = 0.0;
var planned_Protein = 0.0;
var planned_Fat = 0.0;
var planned_Salt = 0.0;
var planned_Fiber = 0.0;
var old_Quantity = 0;





document.addEventListener('DOMContentLoaded', loadCont);

// Load Content
function loadCont() {
    loadFood_DB();
    load_other_LocalStorage_Values();
    create_Planer_Table();
    blendOut_MengeAendern();
}



// Lade FoodDB
function loadFood_DB() {
    if(localStorage.getItem('storedFoodDB') === null) {
        console.log("Food_DB konnte nicht geladen werden");
    }else{
        array_Food_DB = JSON.parse(localStorage.getItem("storedFoodDB"));
        array_Food_DB.sort((a, b) => (a.productName > b.productName) ? 1 : -1)
        createTable_FoodDB();
    }
}

function load_other_LocalStorage_Values() {
        // Planned Meal
        if(localStorage.getItem('stored_Planned_Eaten') === null) {
            console.log("PlannedMeal konnte nicht geladen werden");
        }else{
            planned_Meal = JSON.parse(localStorage.getItem("stored_Planned_Eaten"));
            create_Planer_Table();
            console.log("PlannedMeal wurde geladen");
        }

        // Kcal Ziel
        if(localStorage.getItem('stored_KcalZiel') === null) {
            console.log("Kcal-Ziel konnte nicht geladen werden");
        }else{
            kcal_Ziel = JSON.parse(localStorage.getItem("stored_KcalZiel"));
            document.getElementById('target_KcalZiel').innerHTML = "Kcal Ziel <br>" + kcal_Ziel;
        }

        // Weitere Ziele
        if(localStorage.getItem('storedAdditionalTargets') === null) {
            console.log("Weitere Ziele konnten nicht geladen werden");
        }else{
            additional_Targets = JSON.parse(localStorage.getItem("storedAdditionalTargets"));
            load_Additional_Targets();
        }
}

function load_Additional_Targets() {

    console.log("additional_Targets: " + additional_Targets);
    for(var i = 0; i < additional_Targets.length; i++) {
        if(additional_Targets[i].targetName == "tSugar") {
            max_Sugar = additional_Targets[i].targetVal;
        }
        if(additional_Targets[i].targetName == "tSalt") {
            max_Salt = additional_Targets[i].targetVal;
        }
        if(additional_Targets[i].targetName == "tProtein") {
            min_Protein = additional_Targets[i].targetVal;
        }
        if(additional_Targets[i].targetName == "tFiber") {
            min_Fiber = additional_Targets[i].targetVal;
        }
    }
}


function save_planned_Meal() {
    // localStorage.setItem("stored_Planned_Eaten", JSON.stringify(planned_Meal));
    // console.log("planned_eaten gespeichert");
}



class TodayPlannedFood {
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


//====================================================================================
// Planer
//====================================================================================
function create_Planer_Table() {
    // Todo
    //Richtiges Array erstellen und ausgeben
    
    // containerTabelle_Planer
         // Reset der Tabelle
         document.getElementById("containerTabelle_Planer").innerHTML = "";
    
         // CREATE HTML TABLE OBJECT
         var perrow = 1, // 1 CELLS PER ROW
         table = document.createElement("table"),
         row = table.insertRow();
     // LOOP THROUGH ARRAY AND ADD TABLE CELLS
     for (var i = 0; i < planned_Meal.length; i++) {
       // ADD "BASIC" CELL
       var cell = row.insertCell();
       cell.innerHTML = planned_Meal[i].intake_productName + " --\n " + planned_Meal[i].intake_amount +
                      "g  = " + planned_Meal[i].intake_kcal + " Kcal" ;
    
       // ATTACH A RUNNING NUMBER OR CUSTOM DATA
      cell.dataset.id = i;
    
         // Produktauswahl
       cell.addEventListener("click", function(){
         foodFromToday = true;
         selectedFoodIndex = this.dataset.id;  
         selected_Food = planned_Meal[selectedFoodIndex];
         document.getElementById('sel_change_Prod').innerHTML = selected_Food.intake_productName;
         document.getElementById('foodAmound_Change').value = selected_Food.intake_amount;
         // Sichbar machen
         document.getElementById("invisible_ChangeSection_HeuteGegessen").style.opacity = "1";
             // Enable Schaltflächen
         document.getElementById("btnChangeQuantity").disabled = false;
         document.getElementById("btnDeleteFoodFromToday").disabled = false;
         document.getElementById("foodAmound_Change").disabled = false;
         blendOut_Eingabebereich_FoodDB();
    
         var prozentFromDay = selected_Food.intake_kcal * 100 / kcal_Ziel;
         let calcSingle = "Makros: (" + selected_Food.intake_kcal + " Kcal = " + prozentFromDay.toFixed(0) + "%)" + " | Fett. " + selected_Food.intake_fat.toFixed(1) + "g | Eiw. " +  selected_Food.intake_protein.toFixed(1) + "g | Kh. " + selected_Food.intake_carbs.toFixed(1) + "g | Zkr. " +
         selected_Food.intake_sugar.toFixed(1) + "g | Bal. " + selected_Food.intake_fiber.toFixed(1) +   "g | Slz:  " + selected_Food.intake_salt.toFixed(1) + "g";
         document.getElementById("output_SingleMacros").innerHTML = calcSingle;
    
       });
    
    
       // BREAK INTO NEXT ROW
       var next = i + 1;
       if (next%perrow==0 && next!=planned_Meal.length) {
         row = table.insertRow();
       }
     }
    
     // ATTACH TABLE TO CONTAINER
     document.getElementById("containerTabelle_Planer").appendChild(table);
    }
    
    
    
//============================================================================
// Menge ändern
//============================================================================
function change_Food_to_TodayList() {
    
    let selectedAmount = parseFloat(document.getElementById('foodAmound_Change').value);
    if(selectedAmount == "") {
        console.log("Nichts ausgewählt");
    }else{
        let productNme = selected_Food.intake_productName; 
        let kcal_Intake = parseInt(selectedAmount * selected_Food.intake_kcal / old_Quantity);
        let fat_Intake = parseFloat(selectedAmount * selected_Food.intake_fat / old_Quantity);
        let carb_Intake = parseFloat(selectedAmount * selected_Food.intake_carbs / old_Quantity);
        let sugar_Intake = parseFloat(selectedAmount * selected_Food.intake_sugar / old_Quantity);
        let protein_Intake = parseFloat(selectedAmount * selected_Food.intake_protein / old_Quantity);
        let salt_Intake = parseFloat(selectedAmount * selected_Food.intake_salt / old_Quantity);
        let fiber_Intake = parseFloat(selectedAmount * selected_Food.intake_fiber / old_Quantity);

        // Löschen
        planned_Meal.splice(selectedFoodIndex, 1);

        planned_Meal.push(new TodayPlannedFood(productNme,
                                            selectedAmount,
                                            kcal_Intake,
                                            fat_Intake,
                                            carb_Intake,
                                            sugar_Intake,
                                            protein_Intake,
                                            salt_Intake,
                                            fiber_Intake
            ));

            create_Planer_Table();
            calc_Values();
            //Speichern
            save_planned_Meal();
            alert("Menge wurde geändert");
            blendOut_MengeAendern();
    }

}

//============================================================================
// Lösche Position  
//============================================================================
function delete_from_today() {
    if(foodFromToday == true) {
        const decision = window.confirm("Möchtest du < " + selected_Food.intake_productName + "> wirklich von der heutigen Liste löschen?");
        if(decision) {
            planned_Meal.splice(selectedFoodIndex, 1);
            console.log(planned_Meal);
            calc_Values();

            // Speichern
            save_planned_Meal();

            // Aufräumen und neu laden
            document.getElementById('foodAmound_Change').value = '';
            document.getElementById('sel_change_Prod').innerHTML = '';
            create_Planer_Table();
            blendOut_MengeAendern();
            coloring_Labels();
        }

    }else{
        alert("Kein Produkt ausgewählt");
    }
    
}




//============================================================================
//Berechnung der Makros und Kcal Werte
//============================================================================

function calc_Values() {
    planned_Kcal = 0;
    planned_Carbs = 0.0;
    planned_Sugar = 0.0;
    planned_Protein = 0.0;
    planned_Fat = 0.0;
    planned_Salt = 0.0;
    planned_Fiber = 0.0;

    for(var i = 0; i < planned_Meal.length; i++) {
        planned_Kcal += planned_Meal[i].intake_kcal;
        planned_Carbs += planned_Meal[i].intake_carbs;
        planned_Sugar += planned_Meal[i].intake_sugar;
        planned_Protein += planned_Meal[i].intake_protein;
        planned_Fat += planned_Meal[i].intake_fat;
        planned_Salt += planned_Meal[i].intake_salt;
        planned_Fiber += planned_Meal[i].intake_fiber;
    }


    diff = parseInt((kcal_Ziel) - planned_Kcal);
    // Output
    document.getElementById('output_Eaten').innerHTML = planned_Kcal + " Kcal";
    document.getElementById('output_EffectiveBurned').innerHTML = effective_Kcal + " Kcal";

    if(diff > 0) {
        document.getElementById('output_Diff').innerHTML = diff + " Kcal übrig &#128512";
    }else{
        document.getElementById('output_Diff').innerHTML = Math.abs(diff) + " Kcal zu viel &#128577";
    }
    

    document.getElementById('output_Carbs').innerHTML ="KH. <br>" +  planned_Carbs.toFixed(1) + " g";
    document.getElementById('output_Sugar').innerHTML ="Zck. <br>" +  planned_Sugar.toFixed(1) + " g";
    document.getElementById('output_Protein').innerHTML ="Eiw. <br>" +  planned_Protein.toFixed(1) + " g";
    document.getElementById('output_Fat').innerHTML ="Fett <br>" +  planned_Fat.toFixed(1) + " g";
    document.getElementById('output_Salt').innerHTML ="Salz <br>" +  planned_Salt.toFixed(1) + " g";
    document.getElementById('output_Fiber').innerHTML ="Ball. <br>" +  planned_Fiber.toFixed(1) + " g";


    // Progress Bar
        var progressValKcal = ((planned_Kcal * 100 / (kcal_Ziel))) 
        let originProgressVal = progressValKcal
        // Wenn berechneter Wert über 200 dann 200
        if (progressValKcal >= 100) {
            progressValKcal = 100
            document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(167, 4, 4), rgb(221, 22, 22))";
        }else {
            document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(4, 167, 4), rgb(22, 221, 22))";
        }
        document.getElementById('progress_Bar').style.width = progressValKcal + "%";
        document.getElementById('progress_Bar').innerHTML = Math.round(originProgressVal) + "%";

        coloring_Labels();
}


    
    
    // Delete from Planer
    
    
    // Übernehmen zu Heute Gegessen
    
    
    // Calc Planer
    
    
    // Add to Planer
    
    // Setzt einmalig den Wert auf true, wird dann in Planer eingetragen
    function foodForPlaner() {
    
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
    
            // Anzahl der Produkte
    let anzProd = array_Food_DB.length;
    document.getElementById('titleDatenbank').innerHTML = "Datenbank (" + anzProd + ")";

      // ATTACH A RUNNING NUMBER OR CUSTOM DATA
     cell.dataset.id = i;
   
        // Produktauswahl
      cell.addEventListener("click", function(){
        foodFromToday = false;
        selectedFoodIndex = this.dataset.id;  
        selected_Food = array_Food_DB[selectedFoodIndex];
        let calories = selected_Food.kcal;
        let quantity = selected_Food.quantityUnit;
        document.getElementById('statusX').innerHTML = "";
        document.getElementById('selectedFoodAnzeige').innerHTML = selected_Food.productName;
        document.getElementById('selectedFoodMakros').innerHTML = "Mengeneinheit: " + quantity;
        blendIn_FoodActionArea();
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
            foodFromToday = false;
            selectedFoodIndex = this.dataset.id;  
            selected_Food = data[selectedFoodIndex];
            let quantity = selected_Food.quantityUnit;
            document.getElementById('statusX').innerHTML = "";
            document.getElementById('selectedFoodAnzeige').innerHTML = selected_Food.productName;
            document.getElementById('selectedFoodMakros').innerHTML = "Mengeneinheit: " + quantity;
            blendIn_FoodActionArea();
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

      // Immer Position beibehalten
      //mittig_halten();

              // Anzahl der Produkte
    let anzProd = data.length;
    document.getElementById('titleDatenbank').innerHTML = "Datenbank (" + anzProd + ")";

      }
  }



  function blendIn_FoodActionArea() {
    document.getElementById("optAreaDB").style.opacity = "1";
    // Disable Schaltflächen
    document.getElementById("btn_Save_to_TodayEaten").disabled = false;
    document.getElementById("foodAmound").disabled = false;
  }



  
//============================================================================
  // Food zum Planer hinzufügen
  //============================================================================
  function add_Food_to_Planer() {
    //Produkt nicht "", also ausgewählt
  if(selected_Food != "") {
      if(document.getElementById('foodAmound').value == "") {
          alert("Bitte eine Menge eingeben");
      }else{

          
          let newProduct = selected_Food.productName;
          var alreadyTracked = false;
          var todayEatenIndex = 3000;
          var selectedAmount = parseFloat(document.getElementById('foodAmound').value);

          // Checke ob bereits vorhanden
          for(var i = 0; i < planned_Meal.length; i++) {
              if(planned_Meal[i].intake_productName == newProduct) {
                  alreadyTracked = true;
                  todayEatenIndex = i;
                  break;
              }
          }
          if(alreadyTracked == false) {
              console.log("Noch nicht vorhanden");
          }else{
              console.log("Bereits vorhanden");
              // Fragen, ob addiert werden soll
              var addRequest = window.confirm(newProduct + " ist bereits in Deiner Liste vorhanden. Soll der Wert dazu addiert werden?");
              
              // WENN ADDIERT WERDEN SOLL...
              if(addRequest) {
                  // old_Quantity ermitteln
                  old_Quantity = planned_Meal[todayEatenIndex].intake_amount;
                  // Neuen Wert eintragen alt + neu
                  selectedAmount = selectedAmount + old_Quantity;
                  // Altes Produkt löschen
                  if(todayEatenIndex != 3000) {
                    planned_Meal.splice(todayEatenIndex, 1);
                  }
                  // Letzte Aktionen
                  todayEatenIndex = 3000;
              }else{
                  createTable_FoodDB();
                  blendOut_Eingabebereich_FoodDB();
                  return;
              }
          }

          // Produkt hinzufügen
          try {
              let kcal_Intake = parseInt(selectedAmount * selected_Food.kcal / 100);
              let fat_Intake = parseFloat(selectedAmount * selected_Food.fat / 100);
              let carb_Intake = parseFloat(selectedAmount * selected_Food.carbs / 100);
              let sugar_Intake = parseFloat(selectedAmount * selected_Food.sugar / 100);
              let protein_Intake = parseFloat(selectedAmount * selected_Food.protein / 100);
              let salt_Intake = parseFloat(selectedAmount * selected_Food.salt / 100);
              let fiber_Intake = parseFloat(selectedAmount * selected_Food.fiber / 100);

              planned_Meal.push(new TodayPlannedFood(newProduct,
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
              let intakeFoodInfo = newProduct + " wurde zum Planer hinzugefügt mit: \n Kcal:" + kcal_Intake + " Kcal \n Kohlenhydrate: " + parseInt(carb_Intake) + " g \n Zucker: " + parseInt(sugar_Intake) + " g \n Eiweiss: " + parseInt(protein_Intake) + " g \n Fett: " + parseInt(fat_Intake) + " g \n Ballaststoffe: " + parseInt(fiber_Intake) + " g";
              alert(intakeFoodInfo);
              document.getElementById('statusX').innerHTML = selected_Food.productName + " wurde eingetragen";
              // Speichern
              save_planned_Meal();
              // Aufräumen
              document.getElementById('foodAmound').value = "";
              selected_Food = "";
              selectedFoodIndex = -1;
              document.getElementById('selectedFoodAnzeige').innerHTML = "";
              document.getElementById('selectedFoodMakros').innerHTML = "";
              blendOut_Eingabebereich_FoodDB();
              blendOut_MengeAendern();
              

          } catch (error) {
              console.log(error);
          }
      }
  }else{
      alert("Konnte nicht gespeichert werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf speichern klicken");
  }
  create_Planer_Table();
  calc_Values();
}

//============================================================================
//Berechnung der Makros und Kcal Werte
//============================================================================

function calc_Values() {
    planned_Kcal = 0;
    planned_Carbs = 0.0;
    planned_Sugar = 0.0;
    planned_Protein = 0.0;
    planned_Fat = 0.0;
    planned_Salt = 0.0;
    planned_Fiber = 0.0;
    planned_Amount = 0.0;

    for(var i = 0; i < planned_Meal.length; i++) {
        planned_Kcal += planned_Meal[i].intake_kcal;
        planned_Carbs += planned_Meal[i].intake_carbs;
        planned_Sugar += planned_Meal[i].intake_sugar;
        planned_Protein += planned_Meal[i].intake_protein;
        planned_Fat += planned_Meal[i].intake_fat;
        planned_Salt += planned_Meal[i].intake_salt;
        planned_Fiber += planned_Meal[i].intake_fiber;
        planned_Amount += planned_Meal[i].intake_amount;
    }

    diff = parseInt(kcal_Ziel - planned_Kcal);
    // Output
    document.getElementById('output_Planned_Eaten').innerHTML = "Gepl Kcal <br>" + planned_Kcal;


    if(diff > 0) {
        document.getElementById('output_Diff').innerHTML = "Diff <br>" + diff + " übrig";
    }else{
        document.getElementById('output_Diff').innerHTML ="Diff <br>" +  Math.abs(diff) + " zu viel";
    }
    

    document.getElementById('output_Carbs').innerHTML ="KH. <br>" +  planned_Carbs.toFixed(1) + " g";
    document.getElementById('output_Sugar').innerHTML ="Zck. <br>" +  planned_Sugar.toFixed(1) + " g";
    document.getElementById('output_Protein').innerHTML ="Eiw. <br>" +  planned_Protein.toFixed(1) + " g";
    document.getElementById('output_Fat').innerHTML ="Fett <br>" +  planned_Fat.toFixed(1) + " g";
    document.getElementById('output_Salt').innerHTML ="Salz <br>" +  planned_Salt.toFixed(1) + " g";
    document.getElementById('output_Fiber').innerHTML ="Ball. <br>" +  planned_Fiber.toFixed(1) + " g";


    // Progress Bar
        // var progressValKcal = ((planned_Kcal * 100 / (kcal_Ziel))) 
        // let originProgressVal = progressValKcal
        // // Wenn berechneter Wert über 200 dann 200
        // if (progressValKcal >= 100) {
        //     progressValKcal = 100
        //     document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(167, 4, 4), rgb(221, 22, 22))";
        // }else {
        //     document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(4, 167, 4), rgb(22, 221, 22))";
        // }
        // document.getElementById('progress_Bar').style.width = progressValKcal + "%";
        // document.getElementById('progress_Bar').innerHTML = Math.round(originProgressVal) + "%";

        // coloring_Labels();
}

//============================================================================
    // Theme
//============================================================================

//  Lade Theme
let theme = localStorage.getItem('theme');
if(theme == null){
    setTheme('light');
    console.log("nullColor");
}else{
    setTheme(theme);
    console.log("theme geladen " + theme);
}


// Schleife für angeklickten Theme Button
let themeDots = document.getElementsByClassName('theme-dot');

for (var i=0; themeDots.length > i; i++){
    themeDots[i].addEventListener('click', function(){
        let mode = this.dataset.mode;
        setTheme(mode);
        console.log("Option angeklickt", mode);
    })
}

// Theme ändern  
function setTheme(mode){
    if(mode == 'light'){
        document.getElementById('theme-style').href = 'style.css';
    }
    if(mode == 'dark'){
        document.getElementById('theme-style').href = 'dark.css';
    }
    if(mode == 'green'){
        document.getElementById('theme-style').href = 'green.css';
    }
    if(mode == 'ocean'){
        document.getElementById('theme-style').href = 'ocean.css';
    }
    if(mode == 'lightBlue'){
        document.getElementById('theme-style').href = 'lightBlue.css';
    }
    if(mode == 'Linear'){
        document.getElementById('theme-style').href = 'Linear.css';
    }
    console.log("COLOR");
    // Save  Theme
    localStorage.setItem('theme', mode);
    console.log('Saved Theme');
}
    

//============================================================================
// Zurück zur Hauptanwendung
//============================================================================
function goto_Main() {
    window.location = 'index.html';
}

function mittig_halten(){
    window.scrollTo(0, 4300);
}


//============================================================================
// Coloring Labels
//============================================================================

function coloring_Labels() {
    effectiveKcal_Progress();
    kalorienBilanz_Progress();
    colorizeTargetProgress();
}


// Effektive Kcal
function effectiveKcal_Progress() {
    if(effective_Kcal > kcal_Ziel) {
        document.getElementById("output_EffectiveBurned").style.color = "red";
    }else{
        document.getElementById("output_EffectiveBurned").style.color = "rgb(27, 206, 27)";
    }
}

// Kalorienbilanz
function kalorienBilanz_Progress() {
    if(diff > 0) {
        document.getElementById("output_Diff").style.color = "rgb(27, 206, 27)";
    }else{
        document.getElementById("output_Diff").style.color = "red";
    }
}

// Weitere Ziele

function colorizeTargetProgress() {
    let shouldMinVal = [min_Protein, min_Fiber, min_Steps];
    let isMinVal = [planned_Protein, planned_Fiber, today_Steps];

    if(planned_Sugar >= max_Sugar) {
        document.getElementById('output_Sugar').style.color = "red";
    }else{
        document.getElementById('output_Sugar').style.color = "rgb(27, 206, 27)";
    }

    if(planned_Salt >= max_Salt) {
        document.getElementById('output_Salt').style.color = "red";
    }else{
        document.getElementById('output_Salt').style.color = "rgb(27, 206, 27)";
    }

    if(planned_Protein < min_Protein) {
        document.getElementById('output_Protein').style.color = "red";
    }else{
        document.getElementById('output_Protein').style.color = "rgb(27, 206, 27)";
    }

    if(planned_Fiber < min_Fiber) {
        document.getElementById('output_Fiber').style.color = "red";
    }else{
        document.getElementById('output_Fiber').style.color = "rgb(27, 206, 27)";
    }


}


function addToPlaner() {
    mittig_halten();
    document.getElementById('searchInput').select();
}

// Textfeld und Button für Menge ändern ausblenden
function blendOut_MengeAendern() {
    document.getElementById("invisible_ChangeSection_HeuteGegessen").style.opacity = "0";
    // Disable Schaltflächen
    document.getElementById("btnChangeQuantity").disabled = true;
    document.getElementById("btnDeleteFoodFromToday").disabled = true;
    document.getElementById("foodAmound_Change").disabled = true;
    
}


function blendOut_Eingabebereich_FoodDB() {
    document.getElementById("optAreaDB").style.opacity = "0";
    // Disable Schaltflächen
    document.getElementById("btn_Save_to_TodayEaten").disabled = true;
    document.getElementById("foodAmound").disabled = true;
}