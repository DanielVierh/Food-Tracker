// Projekt erstellt am 13.05.2021

// Variabeln 
let buttonAdd = document.getElementById('btnAdd');
let buttonScroll_Up = document.getElementById('btnscrl_Up');
var haferflocken = "";
var today_Steps = 0;
var array_Food_DB = [];
var today_eaten = [];
var my_Statistics = [];
var additional_Targets = [];
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
var form_is_Invisible = false;
var diff = 0;
var changeProduct = false;
var old_Quantity = 0;
var max_Sugar = 0;
var max_Salt = 0;
var min_Protein = 0;
var min_Fiber = 0;
var min_Steps = 10000;
var new_Water = 0.25;
var today_Water = 0;

//====================================================================================
// Init
//====================================================================================
document.addEventListener('DOMContentLoaded', loadCont);


// Load Content
function loadCont() {
    blendOut_MengeAendern();
    blendOut_Eingabebereich_FoodDB(); 
    check_FoodDB();
    load_other_LocalStorage_Values();
    coloring_Labels();
    show_EffectKcal();
    calc_Values();
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

document.getElementById('foodAmound_Change').addEventListener('click', selectWord2);





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
    array_Food_DB.sort((a, b) => (a.productName > b.productName) ? 1 : -1)
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
        // Gewicht
        if(localStorage.getItem('stored_BodyWeight') === null) {
            console.log("Gewicht konnte nicht geladen werden");
        }else{
            bodyWeight = JSON.parse(localStorage.getItem("stored_BodyWeight"));
            document.getElementById('weight').value = bodyWeight;
        }

        // Schritte
        if(localStorage.getItem('stored_Today_Steps') === null) {
            console.log("Scritte konnten nicht geladen werden");
        }else{
            today_Steps = JSON.parse(localStorage.getItem("stored_Today_Steps"));
            document.getElementById('btnSteps').innerHTML = today_Steps + " &#128095";
            steps_into_Kcal(); 
            coloring_Labels();
            calc_Values();
        }

    // Wasser today_Water
    if(localStorage.getItem('stored_Water') === null) {
        console.log("Wasser konnte nicht geladen werden");
    }else{
        today_Water = JSON.parse(localStorage.getItem("stored_Water"));
        document.getElementById('output_TodayDrank').innerHTML = today_Water + " Liter";
    }

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

    // Statistics
    if(localStorage.getItem('stored_Statistics') === null) {
        console.log("Statistik Werte konnten nicht geladen werden");
    }else{
        my_Statistics = JSON.parse(localStorage.getItem("stored_Statistics"));
    }

    // Kcal_Requirement
    if(localStorage.getItem('stored_Kcal_Requirement') === null) {
        console.log("stored_Kcal_Requirement konnten nicht geladen werden");
    }else{
        kcal_Requirement = JSON.parse(localStorage.getItem("stored_Kcal_Requirement"));
    }

    // Weitere Ziele
    if(localStorage.getItem('storedAdditionalTargets') === null) {
        console.log("Weitere Ziele konnten nicht geladen werden");
    }else{
        additional_Targets = JSON.parse(localStorage.getItem("storedAdditionalTargets"));
        load_Additional_Targets();
    }
}

// Speichere Wasser
function save_Today_Water() {
    localStorage.setItem("stored_Water", JSON.stringify(today_Water));
    console.log("stored_Water gespeichert");
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

// Speichere Statistics
function save_Statistics() {
    localStorage.setItem("stored_Statistics", JSON.stringify(my_Statistics));
    console.log("Statistics gespeichert");
}

// Speichere Kcal_Requirement
function save_Kcal_Requirement() {
    localStorage.setItem("stored_Kcal_Requirement", JSON.stringify(kcal_Requirement));
    console.log("kcal_Req gespeichert");
}


//====================================================================================
// Scroll Section
//====================================================================================
function scroll_UP() {
    window.scrollTo(0, 0);
}

function mittig_halten(){
    window.scrollTo(0, 3300);
}

function goto_Settings() {
    window.scrollTo(0, 12300);
}

function goto_NewProduct() {
    window.scrollTo(0, 9300);
}

function goto_Statistic() {
    window.scrollTo(0, 6000);
}

//====================================================================================
// Zoom
//====================================================================================
function zoom() {
    console.log("Zooming");
}


// Wort markieren
function selectWord() {
    const inp = document.getElementById('searchInput');
    inp.select()
}

function selectWord2() {
    old_Quantity = parseFloat(document.getElementById('foodAmound_Change').value);
    console.log("old_Quantity " + old_Quantity);
    const inp = document.getElementById('foodAmound_Change');
    inp.select();
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
    document.getElementById("btn_ChangeMacros").disabled = true;
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

// Klasse für my_Statistics
class RepositoryLast7Days {
    constructor(repository_date, repository_EffectiveKcal, repository_Steps, repository_BurnedKCal, repository_Sugar, repository_Protein, repository_Fiber, repository_Fat, repository_Water) {
        this.repository_date = repository_date;
        this.repository_EffectiveKcal = repository_EffectiveKcal;
        this.repository_Steps = repository_Steps;
        this.repository_BurnedKCal = repository_BurnedKCal;
        this.repository_Sugar = repository_Sugar;
        this.repository_Protein = repository_Protein;
        this.repository_Fiber = repository_Fiber;
        this.repository_Fat = repository_Fat;
        this.repository_Water = repository_Water;

    }
}

class StoredTarget {
    constructor(targetName, targetVal) {
        this.targetName = targetName;
        this.targetVal = targetVal
    }
}


function show_EffectKcal() {
    show_Statisitcs("show_Effekctive_Kcal");
    all_Statistics_Button_UnselectColor("btnStatEffektKcal");
}

function show_Steps() {
    show_Statisitcs("show_Steps");
    all_Statistics_Button_UnselectColor("btnStatSteps");
}

function show_Sugar(){
    show_Statisitcs("show_Sugar");
    all_Statistics_Button_UnselectColor("btnStatSugar");
}

function show_Water(){
    show_Statisitcs("show_Water");
    all_Statistics_Button_UnselectColor("btnStatWater");
}


//  selektieren Button färben
function all_Statistics_Button_UnselectColor(selectedButtonColorize) {
    document.getElementById('btnStatEffektKcal').style.backgroundColor = "rgb(10, 10, 46)";
    document.getElementById('btnStatSteps').style.backgroundColor = "rgb(10, 10, 46)";
    document.getElementById('btnStatSugar').style.backgroundColor = "rgb(10, 10, 46)";
    document.getElementById('btnStatWater').style.backgroundColor = "rgb(10, 10, 46)";

    document.getElementById(selectedButtonColorize).style.backgroundColor = "rgb(24, 24, 236)";

}


// Erstelle Statistik
function show_Statisitcs(val) {
    var height_Col_1 = 0;
    var height_Col_2 = 0;
    var height_Col_3 = 0;
    var height_Col_4 = 0;
    var height_Col_5 = 0;
    var height_Col_6 = 0;
    var height_Col_7 = 0;
    var zielLatte = kcal_Ziel;
    var currProzent = 0;

    // TESTDATEN
    // let day1 = new RepositoryLast7Days("21.05.2021", 1300, 12199, 769, 39, 141, 32, 102);
    // let day2 = new RepositoryLast7Days("22.05.2021", 1400, 10884, 686, 12, 129, 58, 89);
    // let day3 = new RepositoryLast7Days("23.05.2021", 1500, 9478, 597, 48, 65, 47, 125);
    // let day4 = new RepositoryLast7Days("24.05.2021", 1600, 9478, 597, 48, 65, 47, 125);
    // let day5 = new RepositoryLast7Days("25.05.2021", 1700, 9478, 597, 48, 65, 47, 125);
    // let day6 = new RepositoryLast7Days("26.05.2021", 1800, 9478, 597, 48, 65, 47, 125);
    // let day7 = new RepositoryLast7Days("27.05.2021", 3500, 9478, 597, 48, 65, 47, 125);
    // my_Statistics.push(day1);
    // my_Statistics.push(day2);
    // my_Statistics.push(day3);
    // my_Statistics.push(day4);
    // my_Statistics.push(day5);
    // my_Statistics.push(day6);
    // my_Statistics.push(day7);

    console.log("In Statistics" + my_Statistics);

    let statistik_Count = my_Statistics.length;
    var val_to_DayBefore = 0;
    var lastDayVal = 0;
    var currentVal = 0;
    var fatSum = 0;
    
    if(val == "show_Effekctive_Kcal") {
        // >>> EFFEKTIVE KCAL <<<  
        document.getElementById("valDescription").innerHTML = "Effek. Kcal";
        document.getElementById("valDescrFett").innerHTML = "Fett";
        document.getElementById("UeberschriftStatisik").innerHTML = "Effektive Kcal -- (Ziel: " + kcal_Ziel + " Kcal)";
        
        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById("datum_Col_" + i).innerHTML = my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_EffectiveKcal;
            document.getElementById("val_Col_" + i).innerHTML = currentVal;
            
            // + - zum Vortag
            if(i > 0) {
                val_to_DayBefore = parseInt(my_Statistics[i].repository_EffectiveKcal) - parseInt(lastDayVal);
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore + " Kcal";
                lastDayVal = parseInt(my_Statistics[i].repository_EffectiveKcal);
                if(val_to_DayBefore < 0) {
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "rgb(27, 206, 27)";
                }else{
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "red";
                    document.getElementById("change_DayBefore_Col_" + i).innerHTML = "+" + val_to_DayBefore + " Kcal";
                }
            }else{
                val_to_DayBefore = "-";
                lastDayVal = my_Statistics[i].repository_EffectiveKcal;
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore;
            }
    
            // Fett in Gramm
            let trueDifferenz = kcal_Requirement - parseInt(currentVal);
            let kcal_in_Gramm = parseInt(trueDifferenz * 1000 / 7000);
            fatSum += kcal_in_Gramm;
            if(kcal_in_Gramm < 0) {
                document.getElementById('fettInGramm_Col_' + i).innerHTML = "+" + Math.abs(kcal_in_Gramm) + " g";
            }else{
                document.getElementById('fettInGramm_Col_' + i).innerHTML = "-" + kcal_in_Gramm + " g";
            }
                
    
            // Diagramm
            currProzent = parseInt(my_Statistics[i].repository_EffectiveKcal) * 100 / kcal_Ziel;
            let colHeightInPixel = currProzent * 500 / 100;
            if(colHeightInPixel > 1000) {
                document.getElementById("COL_Dia_" + i).style.height = "1000px";
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_EffectiveKcal + ' kcal 🚀';
            }else {
                document.getElementById("COL_Dia_" + i).style.height = colHeightInPixel + 'px';
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_EffectiveKcal + ' kcal';
            }
    
            // Balken färben
            if(currentVal > kcal_Ziel) {
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "red";
            }else{
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "rgb(27, 206, 27)";
            }

            
            if(kcal_in_Gramm >= 0) {
                document.getElementById('fettInGramm_Col_' + i).style.color = "rgb(27, 206, 27)";
            }else{
                document.getElementById('fettInGramm_Col_' + i).style.color = "red";
            }
            
            
        }
    
            // Ziel Latte
                let targetHeight = 500; // Mitte
                document.getElementById("eff_Goal").style.bottom = targetHeight + "px";
    
            // Fettsumme anzeigen  
            
            if(fatSum > 0) {
                document.getElementById('outputFatSum').innerHTML = "-" + fatSum + " g";
                document.getElementById('outputFatSum').style.color = "rgb(27, 206, 27)";
            }else {
                document.getElementById('outputFatSum').innerHTML = fatSum + " g";
                document.getElementById('outputFatSum').style.color = "red";
            }




        // >>> SCHRITTE <<<
    }else if (val == "show_Steps") {
        
        document.getElementById("valDescription").innerHTML = "Schritte";
        document.getElementById("valDescrFett").innerHTML = "";
        document.getElementById("UeberschriftStatisik").innerHTML = "Schritte Ziel -- (Ziel: " + min_Steps + " Schr.)";
        document.getElementById('outputFatSum').innerHTML = "";
        // Fett ausblenden
        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = "-";
            document.getElementById('fettInGramm_Col_' + i).style.color = "white";
        }

        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById("datum_Col_" + i).innerHTML = my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_Steps;
            document.getElementById("val_Col_" + i).innerHTML = currentVal;
            
            // + - zum Vortag
            if(i > 0) {
                val_to_DayBefore = parseInt(my_Statistics[i].repository_Steps) - parseInt(lastDayVal);
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore + " Schr.";
                lastDayVal = parseInt(my_Statistics[i].repository_Steps);
                if(val_to_DayBefore > 0) {
                    document.getElementById("change_DayBefore_Col_" + i).innerHTML = "+" + val_to_DayBefore + " Schr.";
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "rgb(27, 206, 27)";
                }else{
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "red";
                }
            }else{
                val_to_DayBefore = "-";
                lastDayVal = my_Statistics[i].repository_Steps;
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore;
            }
    
            // Diagramm
            currProzent = parseInt(my_Statistics[i].repository_Steps) * 100 / min_Steps;
            let colHeightInPixel = currProzent * 500 / 100;
            if(colHeightInPixel > 1000) {
                document.getElementById("COL_Dia_" + i).style.height = "1000px";
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Steps + ' 🚀';
            }else {
                document.getElementById("COL_Dia_" + i).style.height = colHeightInPixel + 'px';
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Steps;
            }
    
            // Balken färben
            if(currentVal < min_Steps) {
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "red";
            }else{
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "rgb(27, 206, 27)";
            }
            
        }
        
        // >>> Zucker <<<
    }else if(val == "show_Sugar") {
        document.getElementById("valDescription").innerHTML = "Zucker";
        document.getElementById("valDescrFett").innerHTML = "";
        document.getElementById("UeberschriftStatisik").innerHTML = "Zucker -- (Ziel: " + max_Sugar + " g)";
        document.getElementById('outputFatSum').innerHTML = "";
        // Fett ausblenden
        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = "-";
            document.getElementById('fettInGramm_Col_' + i).style.color = "white";
        }

        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById("datum_Col_" + i).innerHTML = my_Statistics[i].repository_date;
            currentVal = parseFloat(my_Statistics[i].repository_Sugar);
            document.getElementById("val_Col_" + i).innerHTML = currentVal;
            
            // + - zum Vortag
            if(i > 0) {
                val_to_DayBefore = parseInt(my_Statistics[i].repository_Sugar) - parseInt(lastDayVal);
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore + " g";
                lastDayVal = parseInt(my_Statistics[i].repository_Sugar);
                if(val_to_DayBefore < 0) {
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "rgb(27, 206, 27)";
                }else{
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "red";
                    document.getElementById("change_DayBefore_Col_" + i).innerHTML = "+" + val_to_DayBefore + " g";
                }
            }else{
                val_to_DayBefore = "-";
                lastDayVal = my_Statistics[i].repository_Sugar;
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore;
            }
    
            // Diagramm
            currProzent = parseInt(my_Statistics[i].repository_Sugar) * 100 / max_Sugar;
            let colHeightInPixel = currProzent * 500 / 100;
            if(colHeightInPixel > 1000) {
                document.getElementById("COL_Dia_" + i).style.height = "1000px";
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Sugar + ' 🚀';
            }else {
                document.getElementById("COL_Dia_" + i).style.height = colHeightInPixel + 'px';
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Sugar;
            }
    
            // Balken färben
            if(currentVal > max_Sugar) {
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "red";
            }else{
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "rgb(27, 206, 27)";
            }
        }

        // >>> Wasser <<<
    }else if (val == "show_Water") {

        document.getElementById("valDescription").innerHTML = "Wasser";
        document.getElementById("valDescrFett").innerHTML = "";
        document.getElementById("UeberschriftStatisik").innerHTML = "Wasser -- (Ziel: 2 L)";
        document.getElementById('outputFatSum').innerHTML = "";
        var waterCounter = 0.0;
        // Fett ausblenden
        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = "-";
            document.getElementById('fettInGramm_Col_' + i).style.color = "white";
        }

        for(var i = 0; i < statistik_Count; i++) {
            document.getElementById("datum_Col_" + i).innerHTML = my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_Water;
            waterCounter += currentVal;
            document.getElementById('fettInGramm_Col_' + i).innerHTML = currentVal;
            document.getElementById("val_Col_" + i).innerHTML = currentVal;
            
            // + - zum Vortag
            if(i > 0) {
                val_to_DayBefore = parseInt(my_Statistics[i].repository_Water) - parseInt(lastDayVal);
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore + " L";
                lastDayVal = parseInt(my_Statistics[i].repository_Water);
                if(val_to_DayBefore > 0) {
                    document.getElementById("change_DayBefore_Col_" + i).innerHTML = "+" + val_to_DayBefore + " L";
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "rgb(27, 206, 27)";
                }else{
                    document.getElementById("change_DayBefore_Col_" + i).style.color = "red";
                }
            }else{
                val_to_DayBefore = "-";
                lastDayVal = my_Statistics[i].repository_Water;
                document.getElementById("change_DayBefore_Col_" + i).innerHTML = val_to_DayBefore;
            }
    
            // Diagramm
            currProzent = parseFloat(my_Statistics[i].repository_Water) * 100 / 2;
            let colHeightInPixel = currProzent * 500 / 100;
            if(colHeightInPixel > 1000) {
                document.getElementById("COL_Dia_" + i).style.height = "1000px";
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Water + 'L 🚀';
            }else {
                document.getElementById("COL_Dia_" + i).style.height = colHeightInPixel + 'px';
                document.getElementById("COL_Dia_" + i).innerText = my_Statistics[i].repository_Water + " L";
            }
    
            // Balken färben
            if(currentVal < 2) {
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "red";
                console.log(i);
            }else{
                document.getElementById("COL_Dia_" + i).style.backgroundColor = "#41e6fc";
                console.log(i);
            }
            
        }

            document.getElementById('outputFatSum').innerHTML = waterCounter + " L";


    }






}


//============================================================================
// Wasser tracken
//============================================================================
function water_Spin_Up() {
    if(new_Water < 4.00) {
        new_Water += 0.25;
        document.getElementById('outpWaterButton').innerText = new_Water + " L";
    }
}

function water_Spin_Down() {
    if(new_Water > -0.25) {
        new_Water -= 0.25;
        document.getElementById('outpWaterButton').innerText = new_Water + " L";
    }
}


function take_Over_Water() {
    today_Water += new_Water;
    save_Today_Water();
    alert(new_Water + " L Wasser wurden hinzugefügt");
    document.getElementById('output_TodayDrank').innerHTML = today_Water + " Liter";
    new_Water = 0.25;
    document.getElementById('outpWaterButton').innerText = new_Water + " L";

}





//============================================================================
// Neues Lebensmittel hinzufügen
//============================================================================
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
        // TODO-- Persistent speichern
        save_Today_Steps();

    } catch (error) {
        alert("Nur Zahlen eingeben");
    }
}


function steps_into_Kcal() {

    const kcalVal = 6.5;
    const diviVal = 10000;
    burned_Kcal = parseInt((today_Steps * kcalVal * bodyWeight) / (diviVal));
    document.getElementById('output_Burned').innerHTML = burned_Kcal + " Kcal";
    calc_Values();
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
    document.getElementById("btn_ChangeMacros").disabled = false;
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

            
            let newProduct = selected_Food.productName;
            var alreadyTracked = false;
            var todayEatenIndex = 3000;
            var selectedAmount = parseFloat(document.getElementById('foodAmound').value);

            // Checke ob bereits vorhanden
            for(var i = 0; i < today_eaten.length; i++) {
                if(today_eaten[i].intake_productName == newProduct) {
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
                    old_Quantity = today_eaten[todayEatenIndex].intake_amount;
                    // Neuen Wert eintragen alt + neu
                    selectedAmount = selectedAmount + old_Quantity;
                    // Altes Produkt löschen
                    if(todayEatenIndex != 3000) {
                        today_eaten.splice(todayEatenIndex, 1);
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

                today_eaten.push(new TodayEatenFood(newProduct,
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
                blendOut_Eingabebereich_FoodDB();
                blendOut_MengeAendern();
                

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
        document.getElementById('sel_change_Prod').innerHTML = selected_Food.intake_productName;
        document.getElementById('foodAmound_Change').value = selected_Food.intake_amount;
        // Sichbar machen
        document.getElementById("invisible_ChangeSection_HeuteGegessen").style.opacity = "1";
            // Enable Schaltflächen
        document.getElementById("btnChangeQuantity").disabled = false;
        document.getElementById("btnDeleteFoodFromToday").disabled = false;
        document.getElementById("foodAmound_Change").disabled = false;
        blendOut_Eingabebereich_FoodDB();

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
        today_eaten.splice(selectedFoodIndex, 1);

        today_eaten.push(new TodayEatenFood(productNme,
                                            selectedAmount,
                                            kcal_Intake,
                                            fat_Intake,
                                            carb_Intake,
                                            sugar_Intake,
                                            protein_Intake,
                                            salt_Intake,
                                            fiber_Intake
            ));

            create_Table_TodayEaten();
            calc_Values();
            //Speichern
            save_Today_Eaten();
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
            today_eaten.splice(selectedFoodIndex, 1);
            console.log(today_eaten);
            calc_Values();

            // Speichern
            save_Today_Eaten();

            // Aufräumen und neu laden
            document.getElementById('foodAmound_Change').value = '';
            document.getElementById('sel_change_Prod').innerHTML = '';
            create_Table_TodayEaten();
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
    diff = parseInt((kcal_Ziel + burned_Kcal) - eaten_Kcal);
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

        coloring_Labels();
}



//calc_Values();













//============================================================================
  // Färbung der Label je nach Fortschritt
//============================================================================

function coloring_Labels() {
    step_Progress();
    effectiveKcal_Progress();
    kalorienBilanz_Progress();
    colorizeTargetProgress();
}


// Schritte
function step_Progress(){
    if(today_Steps <= (min_Steps / 2)) {
        document.getElementById('btnSteps').style.color = "red";
    }else if(today_Steps < min_Steps) {
        document.getElementById('btnSteps').style.color = "orange";
    }else{
        document.getElementById('btnSteps').style.color = "rgb(27, 206, 27)";
    }
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
    let isMinVal = [eaten_Protein, eaten_Fiber, today_Steps];

    if(eaten_Sugar >= max_Sugar) {
        document.getElementById('output_Sugar').style.color = "red";
    }else{
        document.getElementById('output_Sugar').style.color = "rgb(27, 206, 27)";
    }

    if(eaten_Salt >= max_Salt) {
        document.getElementById('output_Salt').style.color = "red";
    }else{
        document.getElementById('output_Salt').style.color = "rgb(27, 206, 27)";
    }

    if(eaten_Protein < min_Protein) {
        document.getElementById('output_Protein').style.color = "red";
    }else{
        document.getElementById('output_Protein').style.color = "rgb(27, 206, 27)";
    }

    if(eaten_Fiber < min_Fiber) {
        document.getElementById('output_Fiber').style.color = "red";
    }else{
        document.getElementById('output_Fiber').style.color = "rgb(27, 206, 27)";
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
                                save_Kcal_Requirement();
                                
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
                                " Monat(en) erreichen möchtest, würde dein Kcal-Ziel bei: " + recommended_Kcal + " Kcal liegen";
                                document.getElementById('output_Kcal_Req').innerHTML = "Du hast einen Kalorienbedarf von " + kcal_Requirement + " Kcal pro Tag. " + ausg;
                                document.getElementById('target_KcalZiel').value = recommended_Kcal;
                            }

                            // Aufräumen
                            document.getElementById('height').value = "";
                            document.getElementById('age').value = "";
                            document.getElementById('target_Weight').value = "";
                            document.getElementById('target_Time').value = "";

                            window.scrollTo(0, 13600);

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
        window.scrollTo(0, 0);
        location.reload();
    }
}


// Weitere Ziele
function define_additional_Target() {

    additional_Targets = [];

    if(document.getElementById('target_Sugar').value != "") {
        max_Sugar = document.getElementById('target_Sugar').value;
        let varName = "tSugar";
        additional_Targets.push(new StoredTarget(varName, max_Sugar));
    }

    if(document.getElementById('target_Salt').value != "") {
        max_Salt = document.getElementById('target_Salt').value;
        let varName = "tSalt";
        additional_Targets.push(new StoredTarget(varName, max_Salt));
    }

    if(document.getElementById('target_Protein').value != "") {
        min_Protein = document.getElementById('target_Protein').value;
        let varName = "tProtein";
        additional_Targets.push(new StoredTarget(varName, min_Protein));
    }

    if(document.getElementById('target_Fiber').value != "") {
        min_Fiber = document.getElementById('target_Fiber').value;
        let varName = "tFiber";
        additional_Targets.push(new StoredTarget(varName, min_Fiber));
    }

    if(document.getElementById('target_Steps').value != "") {
        min_Steps = document.getElementById('target_Steps').value;
        let varName = "tSteps";
        additional_Targets.push(new StoredTarget(varName, min_Steps));
    }
    console.log("additional_Targets " + additional_Targets);
    // Save
    localStorage.setItem("storedAdditionalTargets", JSON.stringify(additional_Targets));

    alert("Ziele wurden übernommen");
    calc_Values();
    show_Statisitcs("show_Effekctive_Kcal");

}

function load_Additional_Targets() {

    console.log("additional_Targets: " + additional_Targets);
    for(var i = 0; i < additional_Targets.length; i++) {
        if(additional_Targets[i].targetName == "tSugar") {
            max_Sugar = additional_Targets[i].targetVal;
            document.getElementById('target_Sugar').value = max_Sugar;
        }
        if(additional_Targets[i].targetName == "tSalt") {
            max_Salt = additional_Targets[i].targetVal;
            document.getElementById('target_Salt').value = max_Salt;
        }
        if(additional_Targets[i].targetName == "tProtein") {
            min_Protein = additional_Targets[i].targetVal;
            document.getElementById('target_Protein').value = min_Protein;
        }
        if(additional_Targets[i].targetName == "tFiber") {
            min_Fiber = additional_Targets[i].targetVal;
            document.getElementById('target_Fiber').value = min_Fiber;
        }
        if(additional_Targets[i].targetName == "tSteps") {
            min_Steps = additional_Targets[i].targetVal;
            document.getElementById('target_Steps').value = min_Steps;
        }
    }
}

//============================================================================
// Tag abschließen
//============================================================================

function close_Day() {
    const req = window.confirm("Soll der Tag wirklich zurückgesetzt werden?");
    if (req) {
       
        var currDate = window.prompt("Bestätige oder ändere das Datum",get_today());
        if(currDate) {
            var realKcal = window.prompt("Kcal bestätigen oder abändern", burned_Kcal);
            if(realKcal) {
                burned_Kcal = parseInt(realKcal);
                calc_Values();
            }
            let todaySugar = document.getElementById('output_Sugar').innerHTML;
            let todayFat = document.getElementById('output_Fat').innerHTML;
            let todayFiber = document.getElementById('output_Fiber').innerHTML;
            let todayProtein = document.getElementById('output_Protein').innerHTML;
    
            // Hinzufügen der Tageswerte in Statistik
            let length_Of_Statistic_Array = my_Statistics.length;
            if(length_Of_Statistic_Array >= 7) {
                // Wenn alle Plätze schon belegt, erste löschen
                let oldarr = my_Statistics;
                my_Statistics = [];
                
                for (var i = 1; i < oldarr.length; i++) {
                    my_Statistics.push(oldarr[i]);
                }
    
                my_Statistics.push(new RepositoryLast7Days(currDate, effective_Kcal, today_Steps, burned_Kcal, todaySugar, todayProtein, todayFiber, todayFat, today_Water));
                console.log(my_Statistics);
                show_Statisitcs("show_Effekctive_Kcal");
            }else{
                my_Statistics.push(new RepositoryLast7Days(currDate, effective_Kcal, today_Steps, burned_Kcal, todaySugar, todayProtein, todayFiber, todayFat, today_Water));
                console.log(my_Statistics);
                show_Statisitcs("show_Effekctive_Kcal");
            }
    
            // SPEICHERN DER WERTE
            save_Statistics();
    
            // Test Mail
            // TODO MAIL VERSENDEN
            ///////////////
            //window.open('mailto:test@example.com');
    
            
            // RESET
            today_Steps = 0;
            today_eaten = [];
            today_Water = 0;
            document.getElementById('btnSteps').innerHTML = today_Steps + " &#128095";
                coloring_Labels();
                steps_into_Kcal(); 
                calc_Values();
                save_Today_Steps();
                save_Today_Eaten();
                save_Today_Water();
                alert("Tag wurde erfolgreich zurückgesetzt. Die Werte kannst du Dir im Statistikbereich anschaunen.")
                location.reload();
        }           
    }
}


// Datum erzeugen
function get_today(){
    var today = new Date();

    var day = today.getDate(); // Tag

    // Monatsangabe startet bei 0!
    var month = today.getMonth()+1; // Monat

    var year = today.getFullYear(); // Jahr
    if(day < 10) {
            day = '0'+ day;
    } 
    if(month < 10) {
            month = '0'+ month;
    } 
    today = day + '.' + month + '.' + year;

    return today;
}

//============================================================================
// Form unsichtbar machen
//============================================================================
function makeFieldsInvisible() {
    if(form_is_Invisible == true) {
        document.getElementById('visibility').style.opacity = "1";
        document.getElementById('inv_Button').style.opacity = "1";
        form_is_Invisible = false;
    }else{
        document.getElementById('visibility').style.opacity = "0";
        document.getElementById('inv_Button').style.opacity = "0";
        form_is_Invisible = true;
        // TODO SPEICHERN DES STATUS UND 78 KG GEWICHT SPEICHERN
        ///////////
    }
}


//============================================================================
// Neues Lebensmittel hinzufügen  
//============================================================================

function add_new_Food() {
    var new_productName = "";
    var new_Kcal = 0;
    var new_Fat = 0;
    var new_Carbs = 0;
    var new_Sugar = 0;
    var new_Fiber = 0;
    var new_Protein = 0;
    var new_Salt = 0;
    var new_Unit = 0;
    

    // Produktname
    if(document.getElementById('inp_Productname').value == "") {
        alert("Bitte die Textbox für den Produktnamen ausfüllen");
    }else{
        new_productName = document.getElementById('inp_Productname').value;

        // Kcal
        if(document.getElementById('inp_Kcal').value == "") {
            alert("Bitte die Textbox für Kcal ausfüllen");
        }else{
            new_Kcal = document.getElementById('inp_Kcal').value;

            // Fett
            if(document.getElementById('inp_Fat').value == "") {
                alert("Bitte die Textbox für Fett ausfüllen");
            }else{
                new_Fat = document.getElementById('inp_Fat').value;
                new_Fat.replace(",",".");
                parseFloat(new_Fat);

                // Kohlenhydrate
                if(document.getElementById('inp_Carbs').value == "") {
                    alert("Bitte die Textbox für Kohlenhydrate ausfüllen");
                }else{
                    new_Carbs = document.getElementById('inp_Carbs').value;
                    new_Carbs.replace(",",".");
                    parseFloat(new_Carbs);

                    // Zucker
                    if(document.getElementById('inp_Sugar').value == "") {
                        alert("Bitte die Textbox für Zucker ausfüllen");
                    }else{
                        new_Sugar = document.getElementById('inp_Sugar').value;
                        new_Sugar.replace(",",".");
                        parseFloat(new_Sugar);

                        // Ballaststoffe
                        if(document.getElementById('inp_Fiber').value == "") {
                            alert("Bitte die Textbox für Ballaststoffe ausfüllen");
                        }else{
                            new_Fiber = document.getElementById('inp_Fiber').value;
                            new_Fiber.replace(",",".");
                            parseFloat(new_Fiber);

                            // Eiweiß
                            if(document.getElementById('inp_Protein').value == "") {
                                alert("Bitte die Textbox für Eiweiß ausfüllen");
                            }else{
                                new_Protein = document.getElementById('inp_Protein').value;
                                new_Protein.replace(",",".");
                                parseFloat(new_Protein);

                                // Salz
                                if(document.getElementById('inp_Salt').value == "") {
                                    alert("Bitte die Textbox für Salz ausfüllen");
                                }else{
                                    new_Salt = document.getElementById('inp_Salt').value;
                                    new_Salt.replace(",",".");
                                    parseFloat(new_Salt);

                                    // Mengeneinheit
                                    if(document.getElementById('inp_Unit').value == "") {
                                        alert("Bitte die Textbox für Mengeneinheit ausfüllen");
                                    }else{
                                        new_Unit = document.getElementById('inp_Unit').value;

                                        let checkedNewFood = new_productName.toLowerCase();
                                        var comp_Food = "";
                                        var existTwice = false;
                                        // Check Produktname
                                        for(var i = 0; i < array_Food_DB.length; i++) {
                                            comp_Food = array_Food_DB[i].productName.toLowerCase();

                                            if(comp_Food == checkedNewFood) {
                                                existTwice = true;
                                                break;
                                            }
                                        }

                                        if(existTwice == false) {
                                            console.log("Neues Produkt wird angelegt");
                                            // Produkt anlegen
                                            array_Food_DB.push(new Food(new_productName, new_Kcal, new_Fat, new_Carbs, new_Sugar, new_Protein, new_Salt, new_Fiber, new_Unit));
                                            document.getElementById("Status_New_Food").innerHTML = "Lebensmittel: " + new_productName + " wurde zur Datenbank hinzugefügt.";
                                            document.getElementById("Status_New_Food").style.color  = "green";
                                            createTable_FoodDB();
                                            // SAVE
                                            saveFood_DB();

                                            // Aufräumen
                                            document.getElementById('inp_Productname').value = '';
                                            document.getElementById('inp_Kcal').value = '';
                                            document.getElementById('inp_Fat').value = '';
                                            document.getElementById('inp_Carbs').value = '';
                                            document.getElementById('inp_Sugar').value = '';
                                            document.getElementById('inp_Fiber').value = '';
                                            document.getElementById('inp_Protein').value = '';
                                            document.getElementById('inp_Salt').value = '';
                                            document.getElementById('inp_Unit').value = '';
                                            changeProduct = false;

                                        }else{
                                            if(changeProduct == true) {
                                                // Makros werden angepasst
                                                // Produkt löschen und anlegen
                                                let spliceIndex = indexErmittler(selected_Food.productName);
                                                array_Food_DB.splice(spliceIndex, 1);
                                                array_Food_DB.push(new Food(new_productName, new_Kcal, new_Fat, new_Carbs, new_Sugar, new_Protein, new_Salt, new_Fiber, new_Unit));
                                                // SAVE
                                                saveFood_DB();
                                                alert("Lebensmittel wurde erfolgreich angepasst");
                                                location.reload();

                                            }else{
                                                console.log("Neues Produkt wird NICHT angelegt");
                                                document.getElementById("Status_New_Food").innerHTML = "Lebensmittel: " + new_productName + " exisitert bereits.";
                                                document.getElementById("Status_New_Food").style.color  = "red";
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


//============================================================================
// Makros in der Datenbank ändern
//============================================================================


function changeMacros() {
    goto_NewProduct();
    changeProduct = true;
    // Content laden
    document.getElementById('inp_Productname').value = selected_Food.productName; 
    document.getElementById('inp_Kcal').value = selected_Food.kcal;
    document.getElementById('inp_Fat').value = selected_Food.fat;
    document.getElementById('inp_Carbs').value = selected_Food.carbs;
    document.getElementById('inp_Sugar').value = selected_Food.sugar;
    document.getElementById('inp_Fiber').value = selected_Food.fiber;
    document.getElementById('inp_Protein').value = selected_Food.protein;
    document.getElementById('inp_Salt').value = selected_Food.salt;
    document.getElementById('inp_Unit').value = selected_Food.quantityUnit;


}

//============================================================================
// Produkt aus Datenbank löschen
//============================================================================
function delete_Food_from_DB() {
    
    let checkVal = document.getElementById('inp_Productname').value;
    if(checkVal == "") {
        console.log("Kein Produkt in der Pipe");
    }else{
        var deleteDecision = window.confirm("Soll das Lebensmittel: <" + selected_Food.productName + "> wirklich für immer aus der Datenbank gelöscht werden?")
        if(deleteDecision) {
            let spliceIndex = indexErmittler(selected_Food.productName);
            array_Food_DB.splice(spliceIndex, 1);
            saveFood_DB();
            alert("Lebensmittel wurde gelöscht");
            location.reload();
        }
    }
}


function indexErmittler(searchWord) {
    for(var i = 0; i< array_Food_DB.length; i++) {
        if (array_Food_DB[i].productName == searchWord) {
            return i;
        }
    }
}


//====================================================================================
// Welcome 
//====================================================================================

function welcome_Func() {
    let text = "Willkommen beim Food-Tracker. \n \n 1. Das kleine Formular ausfüllen. \n 2. Setzte deine weiteren Ziele und schon kann es losgehen. \n Die Daten kannst du jederzeit abändern. \n \n * Die Daten werden nur auf deinem Gerät gespeichert. Weitere Infos sind unten vermerkt.";
    alert(text);
    window.scrollTo(0, 12300);
}