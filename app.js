// Variabeln 
let buttonAdd = document.getElementById('btnAdd');
let buttonScroll_Up = document.getElementById('btnscrl_Up');
var haferflocken = "";
var today_Steps = 0;
var array_Food_DB = [];
 var today_eaten = [];
var bodyWeight = 78; 
var kcal_Ziel = 0;
var kcal_Requirement = 2500;

var selected_Food = "";
var selectedFoodIndex = 0;
var foodFromToday = false;

var eaten_Kcal = 0;
var eaten_Carbs = 0.0;
var eaten_Sugar = 0.0;
var eaten_Protein = 0.0;
var eaten_Fat = 0.0;
var eaten_Salt = 0.0;
var eaten_Fiber = 0.0;
var eaten_Amount = 0.0;
var burned_Kcal = 0;
var effective_Kcal = 0;


//====================================================================================
// Init
//====================================================================================
document.addEventListener('DOMContentLoaded', loadCont);


// Load Content
function loadCont() {
    check_FoodDB();
    load_other_LocalStorage_Values();
}


// Checke local Storage
function check_FoodDB(){
    if(localStorage.getItem('storedFoodDB') === null) {
        console.log("Food-Datenbank ist leer");
        // DB aus JSON generieren
        fetch_Food_DB();
    }else {
        console.log("DB wird geladen");
        loadFood_DB();
    }
}



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




//====================================================================================
// EventListener
//====================================================================================

buttonAdd.addEventListener('click', addProduct);
buttonScroll_Up.addEventListener('click', scroll_UP);

// Damit gesuchtes Produkt direkt überschreibbar ist
document.getElementById('searchInput').addEventListener('click', selectWord);







//====================================================================================
// Save,  Load or create DB
//====================================================================================
// Save Food-DB
function saveFood_DB() {
    localStorage.setItem("storedFoodDB", JSON.stringify(array_Food_DB));
    console.log("DB saved");
}
//Load Food-DB
function loadFood_DB() {
    array_Food_DB = JSON.parse(localStorage.getItem("storedFoodDB"));
    createTable_FoodDB();
    console.log("DB loaded");
}


// Automatisches lesen des JSON Files
function fetch_Food_DB() {
    fetch("Food_DB_v2021_05.json")
    .then(response => response.json())
    .then(data => {
        array_Food_DB = data;
        console.log(array_Food_DB);
        saveFood_DB();
        createTable_FoodDB();
    })
}


// Andere abgespeicherte Werte
function load_other_LocalStorage_Values(){
    // Kcal Ziel
    if(localStorage.getItem('stored_KcalZiel') === null) {
            console.log("Kcal-Ziel konnte nicht geladen werden");
    }else{
            kcal_Ziel = JSON.parse(localStorage.getItem("stored_KcalZiel"));
            document.getElementById('target_KcalZiel').value = kcal_Ziel;
    }

    // Heute gegessen
    if(localStorage.getItem('stored_Today_Eaten') === null) {
        console.log("Today Eaten konnte nicht geladen werden");
    }else{
        today_eaten = JSON.parse(localStorage.getItem("stored_Today_Eaten"));
        create_Table_TodayEaten();
    }

    // Schritte
    if(localStorage.getItem('stored_Today_Steps') === null) {
        console.log("Scritte konnten nicht geladen werden");
    }else{
        today_Steps = JSON.parse(localStorage.getItem("stored_Today_Steps"));
        document.getElementById('btnSteps').innerHTML = today_Steps + " &#128095";
        coloring_Labels();
        steps_into_Kcal(); 
        calc_Values();
    }

    // Gewicht
    if(localStorage.getItem('stored_BodyWeight') === null) {
        console.log("Gewicht konnte nicht geladen werden");
    }else{
        bodyWeight = JSON.parse(localStorage.getItem("stored_BodyWeight"));
        document.getElementById('weight').value = bodyWeight;
    }
}

// Speichere Today Eaten
function save_Today_Eaten() {
    localStorage.setItem("stored_Today_Eaten", JSON.stringify(today_eaten));
    console.log("today_eaten gespeichert");
}

// Speichere Schritte
function save_Today_Steps() {
    localStorage.setItem("stored_Today_Steps", JSON.stringify(today_Steps));
    console.log("today_Steps gespeichert");
}

// Speichere Gewicht
function save_BodyWeight() {
    localStorage.setItem("stored_BodyWeight", JSON.stringify(bodyWeight));
    console.log("bodyWeight gespeichert");
}

// Speichere KcalZiel
function save_kcalZiel() {
    localStorage.setItem("stored_KcalZiel", JSON.stringify(kcal_Ziel));
    console.log("kcal_Ziel gespeichert");
}


//====================================================================================
// Scroll Section
//====================================================================================
function scroll_UP() {
    window.scrollTo(0, 0);
    console.log("ScrollUP");
}

function mittig_halten(){
    window.scrollTo(0, 3300);
}

function goto_Settings() {
    window.scrollTo(0, 9800);
    console.log("ScrollToSettings");
}

//====================================================================================
// Zoom
//====================================================================================
function zoom() {
    document.body.style.zoom = "90%"; 
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


// Neues Lebensmittel hinzufügen
function addProduct() {
    mittig_halten();
    document.getElementById('searchInput').select();
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
        steps_into_Kcal(); 
        calc_Values();
        // TODO-- Persistent speichern
        save_Today_Steps();

    } catch (error) {
        alert("Nur Zahlen eingeben");
    }
}


function steps_into_Kcal() {
    const kcalVal = 6;
    const diviVal = 10000;
    burned_Kcal = parseInt((today_Steps * kcalVal * bodyWeight) / (diviVal));
    document.getElementById('output_Burned').innerHTML = burned_Kcal + " Kcal";
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
            foodFromToday = false;
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

      // Immer Position beibehalten
      //mittig_halten();

              // Anzahl der Produkte
    let anzProd = data.length;
    document.getElementById('titleDatenbank').innerHTML = "Datenbank (" + anzProd + ")";

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
                // Speichern
                save_Today_Eaten();
                // Aufräumen
                document.getElementById('foodAmound').value = "";
                selected_Food = "";
                selectedFoodIndex = -1;
                document.getElementById('selectedFoodAnzeige').innerHTML = "";
                document.getElementById('selectedFoodMakros').innerHTML = "";
                zoom();
                

            } catch (error) {
                console.log(error);
            }
        }
    }else{
        alert("Konnte nicht gespeichert werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf speichern klicken");
    }
    create_Table_TodayEaten();
    calc_Values();
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
        foodFromToday = true;
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


function change_Food_to_TodayList() {
    alert("Wird noch gebaut.");
}

//============================================================================
// Lösche Position  
//============================================================================
function delete_from_today() {
    if(foodFromToday == true) {
        const decision = window.confirm("Möchtest du < " + selected_Food.intake_productName + "> wirklich von der heutigen Liste löschen?");
        if(decision) {
            today_eaten.splice(selectedFoodIndex, 1);
            console.log(today_eaten);
            calc_Values();

            // Speichern
            save_Today_Eaten();

            // Aufräumen und neu laden
            document.getElementById('foodAmound_Change').value = '';
            document.getElementById('sel_change_Prod').innerHTML = '';
            create_Table_TodayEaten();
        }

    }else{
        alert("Kein Produkt ausgewählt");
    }
    
}




//============================================================================
//Berechnung der Makros und Kcal Werte
//============================================================================

function calc_Values() {
    eaten_Kcal = 0;
    eaten_Carbs = 0.0;
    eaten_Sugar = 0.0;
    eaten_Protein = 0.0;
    eaten_Fat = 0.0;
    eaten_Salt = 0.0;
    eaten_Fiber = 0.0;
    eaten_Amount = 0.0;

    for(var i = 0; i < today_eaten.length; i++) {
        eaten_Kcal += today_eaten[i].intake_kcal;
        eaten_Carbs += today_eaten[i].intake_carbs;
        eaten_Sugar += today_eaten[i].intake_sugar;
        eaten_Protein += today_eaten[i].intake_protein;
        eaten_Fat += today_eaten[i].intake_fat;
        eaten_Salt += today_eaten[i].intake_salt;
        eaten_Fiber += today_eaten[i].intake_fiber;
        eaten_Amount += today_eaten[i].intake_amount;
    }

    // Effektive Kcal und Differenz berechnen
    effective_Kcal = parseInt(eaten_Kcal - burned_Kcal);
    let diff = parseInt((kcal_Ziel + burned_Kcal) - eaten_Kcal);
    // Output
    document.getElementById('output_Eaten').innerHTML = eaten_Kcal + " Kcal";
    document.getElementById('output_EffectiveBurned').innerHTML = effective_Kcal + " Kcal";

    if(diff > 0) {
        document.getElementById('output_Diff').innerHTML = diff + " Kcal übrig &#128512";
    }else{
        document.getElementById('output_Diff').innerHTML = Math.abs(diff) + " Kcal zu viel &#128577";
    }
    

    document.getElementById('output_Carbs').innerHTML = eaten_Carbs.toFixed(1) + " g";
    document.getElementById('output_Sugar').innerHTML = eaten_Sugar.toFixed(1) + " g";
    document.getElementById('output_Protein').innerHTML = eaten_Protein.toFixed(1) + " g";
    document.getElementById('output_Fat').innerHTML = eaten_Fat.toFixed(1) + " g";
    document.getElementById('output_Salt').innerHTML = eaten_Salt.toFixed(1) + " g";
    document.getElementById('output_Fiber').innerHTML = eaten_Fiber.toFixed(1) + " g";
    document.getElementById('output_Gramm').innerHTML = parseInt(eaten_Amount) + " g gegessen";


    // Progress Bar
        var progressValKcal = ((eaten_Kcal * 100 / (burned_Kcal + kcal_Ziel))) 
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
}



calc_Values();













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



//============================================================================
// Einstellungen
//============================================================================

//============================================================================
// Kcal Ziel berechnen
//============================================================================
function calc_Kcal_Goal() {
    var height = 0;
    var age = 0;
    var targetWeight = 0;
    var targetTime = 0;

    // Gender Auswahl herausfinden
    const gender = document.querySelectorAll('input[name="gender"]');
    let selectedGender;
    for (const x of gender) {
        if (x.checked) {
            selectedGender = x.value;
            break;
        }
    }
    // Check ob Auswahl getroffen
    if(selectedGender == undefined) {
        alert("Bitte eine Auswahl bei Geschlecht treffen");
    }else{
        // Gewicht
        if(document.getElementById('weight').value == "") {
            alert("Bitte das Feld Gewicht ausfüllen"); 
        }else{
            bodyWeight = document.getElementById('weight').value;
            save_BodyWeight();

            // Größe
            if(document.getElementById('height').value == "") {
                alert("Bitte das Feld Größe ausfüllen");
            }else{
                height = document.getElementById('height').value;

                // Alter
                if(document.getElementById('age').value == "") {
                    alert("Bitte das Feld Alter ausfüllen");
                }else{
                    age = document.getElementById('age').value;

                    // Zielgewicht
                    if(document.getElementById('target_Weight').value == "") {
                        alert("Bitte das Feld Alter ausfüllen");
                    }else{
                        targetWeight = document.getElementById('target_Weight').value;

                        // Zielzeit
                        if(document.getElementById('target_Time').value == "") {
                            alert("Bitte das Feld Zeitraum ausfüllen");
                        }else{
                            targetTime = document.getElementById('target_Time').value;

                            // Berechnung Kalorienbedarf
                            if(selectedGender == "male") {
                                // Mann
                                // 66,47 + (13,7 * Körpergewicht in kg) + (5 * Körpergröße in cm) – (6,8 * Alter in Jahren)
                                kcal_Requirement = parseInt(66.47 + (13.7 * bodyWeight) + (5 * height) - (6.8 * age));
                                
                                let kcal_Differenz = bodyWeight - targetWeight;
                                let tage = targetTime * 30;
                                let abnehmBerg = kcal_Differenz * 7000;
                                let zielEinsparung_pro_Tag = abnehmBerg / tage;
                                let recommended_Kcal = parseInt(kcal_Requirement - zielEinsparung_pro_Tag);

                                let ausg = "Wenn du Dein Zielgewicht von " + targetWeight + "  kg in " + targetTime + 
                                " Monat(en) erreichen möchtest, läg dein Kcal-Ziel bei: " + recommended_Kcal + " Kcal";
                                document.getElementById('output_Kcal_Req').innerHTML = "Du hast einen Kalorienbedarf von " + kcal_Requirement + " Kcal pro Tag. " + ausg;
                                document.getElementById('target_KcalZiel').value = recommended_Kcal;

                            }else{
                                // Formel für KCAL Bedarf FRAU
                                //655,1 + (9,6 * Körpergewicht in kg) + (1,8 * Körpergröße in cm) – (4,7 * Alter in Jahren)
                                kcal_Requirement = parseInt(655.1 + (9.6 * bodyWeight) + (1.8 * height) - (4.7 * age));
                                
                                let kcal_Differenz = bodyWeight - targetWeight;
                                let tage = targetTime * 30;
                                let abnehmBerg = kcal_Differenz * 7000;
                                let zielEinsparung_pro_Tag = abnehmBerg / tage;
                                let recommended_Kcal = parseInt(kcal_Requirement - zielEinsparung_pro_Tag);

                                let ausg = "Wenn du Dein Zielgewicht von " + targetWeight + "  kg in " + targetTime + 
                                " Monat(en) erreichen möchtest, läg dein Kcal-Ziel bei: " + recommended_Kcal + " Kcal";
                                document.getElementById('output_Kcal_Req').innerHTML = "Du hast einen Kalorienbedarf von " + kcal_Requirement + " Kcal pro Tag. " + ausg;
                                document.getElementById('target_KcalZiel').value = recommended_Kcal;
                            }

                            // Aufräumen
                            document.getElementById('height').value = "";
                            document.getElementById('age').value = "";
                            document.getElementById('target_Weight').value = "";
                            document.getElementById('target_Time').value = "";

                            window.scrollTo(0, 11000);

                        }
                    }
                }
            }
        }
    }


}

// kcal_Ziel
function define_Kcal_Target() {
    if(document.getElementById('target_KcalZiel').value == "") {
        alert("Kein Wert enthalten");
    }else{
        kcal_Ziel = parseInt(document.getElementById('target_KcalZiel').value);
        save_kcalZiel();
        alert("Kcal Ziel wurde übernommen");
    }
}