// Projekt erstellt am 13.05.2021

// Variabeln
let buttonAdd = document.getElementById('btnAdd');
let buttonScroll_Up = document.getElementById('btnscrl_Up');
var haferflocken = '';
var today_Steps = 0;
var array_Food_DB = [];
var today_eaten = [];
var my_Statistics = [];
var additional_Targets = [];
var my_History = [];
var bodyWeight = 78;
var kcal_Ziel = 2000;
var kcal_Requirement = 2000;

var selected_Food = '';
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
var max_Sugar = 50;
var max_Salt = 7;
var min_Protein = 90;
var min_Fiber = 30;
var min_Steps = 10000;
var des_Fat = 80;
var des_Carbs = 150;
var new_Water = 0.25;
var today_Water = 0;
var originDB = [];
var exp_New_Prod = [];
var selectedDateIndex = 0;
var selectedDate = '';
var lastWater = '';
var spezDiet_Visible = false;
var isKeto = false;

let countedPercentNumber = 0;
let originalPercentValue = 0;

const inputField_EatenFood_in_Gramm = document.getElementById('foodAmound');
const progressCircle = document.querySelector('.progress');
const txtPercent = document.getElementById('txtPercent');
const circleAnimationArea = document.getElementById('circleAnimationArea');

const carbLabel = document.getElementById('output_Carbs');
const sugarLabel = document.getElementById('output_Sugar');
const proteinLabel = document.getElementById('output_Protein');
const fatLabel = document.getElementById('output_Fat');
const saltLabel = document.getElementById('output_Salt');
const fiberLabel = document.getElementById('output_Fiber');

//====================================================================================
// Init
//====================================================================================
document.addEventListener('DOMContentLoaded', loadCont);

// Load Content
function loadCont() {
    countingAnimation();
    blendOut_MengeAendern();
    blendOut_Eingabebereich_FoodDB();
    blendOut_HistoryButton();
    check_FoodDB();
    load_other_LocalStorage_Values();
    coloring_Labels();
    show_EffectKcal();
    calc_Values();
}

// Checke local Storage
function check_FoodDB() {
    if (localStorage.getItem('storedFoodDB') === null) {
        // DB aus JSON generieren
        fetch_Food_DB();
    } else {
        loadFood_DB();
    }
}

//====================================================================================
// EventListener
//====================================================================================
// TODO: In Variablen packen und auf Vorhandenheit abfragen
buttonAdd.addEventListener('click', addProduct);
buttonScroll_Up.addEventListener('click', scroll_UP);

// Damit gesuchtes Produkt direkt überschreibbar ist
document.getElementById('searchInput').addEventListener('click', selectWord);

document
    .getElementById('foodAmound_Change')
    .addEventListener('click', selectWord2);

document
    .getElementById('welcomeScrn')
    .addEventListener('click', hideWelcomeScreen);

function hideWelcomeScreen() {
    document.getElementById('welcomeScrn').style.opacity = '0';
    document.getElementById('welcomeScrn').style.zIndex = '-1';
}


// Fullscreen Mode
function toggleFullScreen() {
    if(document.fullscreenElement) {
        document.exitFullscreen();
    }else{
        document.documentElement.requestFullscreen().catch((error) => {
            //console.log(error);
        });
    }
}

document.addEventListener('dblclick', () => {
    toggleFullScreen();
});


//====================================================================================
// Save,  Load or create DB
//====================================================================================
// Save Food-DB
function saveFood_DB() {
    localStorage.setItem('storedFoodDB', JSON.stringify(array_Food_DB));
}

//Load Food-DB
function loadFood_DB() {
    array_Food_DB = JSON.parse(localStorage.getItem('storedFoodDB'));
    array_Food_DB.sort((a, b) => (a.productName > b.productName ? 1 : -1));
    createTable_FoodDB();
}

// Automatisches lesen des JSON Files
function fetch_Food_DB() {
    fetch('Food_DB_v2021_05.json')
        .then((response) => response.json())
        .then((data) => {
            array_Food_DB = data;
            saveFood_DB();
            createTable_FoodDB();
        });
}

// Andere abgespeicherte Werte
function load_other_LocalStorage_Values() {
    // Gewicht
    if (localStorage.getItem('stored_BodyWeight') === null) {
    } else {
        bodyWeight = JSON.parse(localStorage.getItem('stored_BodyWeight'));
        document.getElementById('weight').value = bodyWeight;
    }

    // Verbrannte Kcal
    if (localStorage.getItem('stored_burned_Kcal') === null) {
    } else {
        burned_Kcal = JSON.parse(localStorage.getItem('stored_burned_Kcal'));
        document.getElementById('output_Burned').innerHTML =
            burned_Kcal + ' Kcal';
        calc_Values();
    }

    // Schritte
    if (localStorage.getItem('stored_Today_Steps') === null) {
    } else {
        today_Steps = JSON.parse(localStorage.getItem('stored_Today_Steps'));
        document.getElementById('btnSteps').innerHTML =
            today_Steps + ' &#128095';
        steps_into_Kcal();
        coloring_Labels();
        calc_Values();
    }

    // Wasser today_Water
    if (localStorage.getItem('stored_Water') === null) {
    } else {
        today_Water = JSON.parse(localStorage.getItem('stored_Water'));
        document.getElementById('output_TodayDrank').innerHTML =
            today_Water + ' Liter';
    }

    // Zuletzt getrunken
    if (localStorage.getItem('stored_Last_Water') === null) {
    } else {
        lastWater = JSON.parse(localStorage.getItem('stored_Last_Water'));
        document.getElementById('lastWater').innerHTML =
            'Zuletzt: ' + lastWater;
    }

    // Kcal Ziel
    if (localStorage.getItem('stored_KcalZiel') === null) {
        // document.getElementById("welcomeScrn").style.opacity = "1";
        // document.getElementById("welcomeScrn").style.zIndex = "40";
        hideWelcomeScreen(); // Vorerst reingenommen, um Welcomescreen nicht mehr einzublenden
    } else {
        kcal_Ziel = JSON.parse(localStorage.getItem('stored_KcalZiel'));
        document.getElementById('target_KcalZiel').value = kcal_Ziel;
        document.getElementById('welcomeScrn').style.opacity = '0';
        document.getElementById('welcomeScrn').style.zIndex = '-1';
    }

    // Heute gegessen
    if (localStorage.getItem('stored_Today_Eaten') === null) {
    } else {
        today_eaten = JSON.parse(localStorage.getItem('stored_Today_Eaten'));
        create_Table_TodayEaten();
    }

    // Statistics
    if (localStorage.getItem('stored_Statistics') === null) {
    } else {
        my_Statistics = JSON.parse(localStorage.getItem('stored_Statistics'));
    }

    // Kcal_Requirement
    if (localStorage.getItem('stored_Kcal_Requirement') === null) {
    } else {
        kcal_Requirement = JSON.parse(
            localStorage.getItem('stored_Kcal_Requirement'),
        );
    }

    // Weitere Ziele
    if (localStorage.getItem('storedAdditionalTargets') === null) {
    } else {
        additional_Targets = JSON.parse(
            localStorage.getItem('storedAdditionalTargets'),
        );
        load_Additional_Targets();
    }

    // History
    if (localStorage.getItem('stored_History') === null) {
    } else {
        my_History = JSON.parse(localStorage.getItem('stored_History'));
        my_History.sort((a, b) => (a.history_date < b.history_date ? 1 : -1));
        create_MyHistory();
    }
}

// Speichere Wasser
function save_Today_Water() {
    localStorage.setItem('stored_Water', JSON.stringify(today_Water));
}
// Speichere zuletzt getrunken
function save_Last_Water() {
    localStorage.setItem('stored_Last_Water', JSON.stringify(lastWater));
}

// Speichere Today Eaten
function save_Today_Eaten() {
    localStorage.setItem('stored_Today_Eaten', JSON.stringify(today_eaten));
}

// Speichere Schritte
function save_Today_Steps() {
    localStorage.setItem('stored_Today_Steps', JSON.stringify(today_Steps));
}

// Speichere Gewicht
function save_BodyWeight() {
    localStorage.setItem('stored_BodyWeight', JSON.stringify(bodyWeight));
}

// Speichere KcalZiel
function save_kcalZiel() {
    localStorage.setItem('stored_KcalZiel', JSON.stringify(kcal_Ziel));
}

// Speichere Statistics
function save_Statistics() {
    localStorage.setItem('stored_Statistics', JSON.stringify(my_Statistics));
}

// Speichere Kcal_Requirement
function save_Kcal_Requirement() {
    localStorage.setItem(
        'stored_Kcal_Requirement',
        JSON.stringify(kcal_Requirement),
    );
}

// Speichere History
function save_History() {
    localStorage.setItem('stored_History', JSON.stringify(my_History));
}

// Speichere Verbrannte Kcal
function save_Burned_Kcal() {
    localStorage.setItem('stored_burned_Kcal', JSON.stringify(burned_Kcal));
}

//====================================================================================
// Scroll Section
//====================================================================================
function scroll_UP() {
    window.scrollTo(0, 0);
}

function mittig_halten() {
    window.scrollTo(0, 3300);
}

function goto_Settings() {
    window.scrollTo(0, 14700);
}

function goto_NewProduct() {
    window.scrollTo(0, 11800);
}

function goto_Statistic() {
    window.scrollTo(0, 6000);
}

function goto_Planer() {
    window.location = 'planer.html';
}

// Wort markieren
function selectWord() {
    const inp = document.getElementById('searchInput');
    inp.select();
}

function selectWord2() {
    old_Quantity = parseFloat(
        document.getElementById('foodAmound_Change').value,
    );
    const inp = document.getElementById('foodAmound_Change');
    inp.select();
}

// Textfeld und Button für Menge ändern ausblenden
function blendOut_MengeAendern() {
    document.getElementById(
        'invisible_ChangeSection_HeuteGegessen',
    ).hidden = true;
    // Disable Schaltflächen
    document.getElementById('btnChangeQuantity').disabled = true;
    document.getElementById('btnDeleteFoodFromToday').disabled = true;
    document.getElementById('foodAmound_Change').disabled = true;

    // Disable SpezDiet
    document.getElementById('spezDietDiv').style.opacity = '0';
    document.getElementById('diet_List').disabled = true;
    document.getElementById('submitDiet').disabled = true;
}

function blendOut_HistoryButton() {
    document.getElementsByClassName('buttonHistorie').disabled = true;
    document.getElementById('HistoryButtonContainer').style.opacity = '0';
}

function blendOut_Eingabebereich_FoodDB() {
    document.getElementById('optAreaDB').style.opacity = '0';
    // Disable Schaltflächen
    document.getElementById('btn_Save_to_TodayEaten').disabled = true;
    inputField_EatenFood_in_Gramm.disabled = true;
    document.getElementById('btn_ChangeMacros').disabled = true;
}

// Klasse für Lebensmittel

class Food {
    constructor(
        productName,
        kcal,
        fat,
        carbs,
        sugar,
        protein,
        salt,
        fiber,
        quantityUnit,
    ) {
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
    constructor(
        intake_productName,
        intake_amount,
        intake_kcal,
        intake_fat,
        intake_carbs,
        intake_sugar,
        intake_protein,
        intake_salt,
        intake_fiber,
    ) {
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
    constructor(
        repository_date,
        repository_EffectiveKcal,
        repository_Steps,
        repository_BurnedKCal,
        repository_Sugar,
        repository_Protein,
        repository_Fiber,
        repository_Fat,
        repository_Water,
    ) {
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

class History {
    constructor(history_date, history_Content) {
        this.history_date = history_date;
        this.history_Content = history_Content;
    }
}

class StoredTarget {
    constructor(targetName, targetVal) {
        this.targetName = targetName;
        this.targetVal = targetVal;
    }
}

function show_EffectKcal() {
    show_Statisitcs('show_Effekctive_Kcal');
    all_Statistics_Button_UnselectColor('btnStatEffektKcal');
}

function show_Steps() {
    show_Statisitcs('show_Steps');
    all_Statistics_Button_UnselectColor('btnStatSteps');
}

function show_Sugar() {
    show_Statisitcs('show_Sugar');
    all_Statistics_Button_UnselectColor('btnStatSugar');
}

function show_Water() {
    show_Statisitcs('show_Water');
    all_Statistics_Button_UnselectColor('btnStatWater');
}

function show_BurnedKcal() {
    show_Statisitcs('show_BurndedKcal');
    all_Statistics_Button_UnselectColor('btnStatBurnedKcal');
}

//  selektieren Button färben
function all_Statistics_Button_UnselectColor(selectedButtonColorize) {
    document.getElementById('btnStatEffektKcal').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatSteps').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatSugar').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatWater').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatBurnedKcal').style.backgroundColor =
        'rgb(10, 10, 46)';

    document.getElementById(selectedButtonColorize).style.backgroundColor =
        'rgb(24, 24, 236)';
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
    let statistik_Count = my_Statistics.length;
    var val_to_DayBefore = 0;
    var lastDayVal = 0;
    var currentVal = 0;
    var fatSum = 0;

    if (val == 'show_Effekctive_Kcal') {
        // >>> EFFEKTIVE KCAL <<<
        document.getElementById('valDescription').innerHTML = 'Effek. Kcal';
        document.getElementById('valDescrFett').innerHTML = 'Fett';
        document.getElementById('UeberschriftStatisik').innerHTML =
            'Effektive Kcal -- (Ziel: ' + kcal_Ziel + ' Kcal)';

        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('datum_Col_' + i).innerHTML =
                my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_EffectiveKcal;
            document.getElementById('val_Col_' + i).innerHTML = currentVal;

            // + - zum Vortag
            if (i > 0) {
                val_to_DayBefore =
                    parseInt(my_Statistics[i].repository_EffectiveKcal) -
                    parseInt(lastDayVal);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore + ' Kcal';
                lastDayVal = parseInt(
                    my_Statistics[i].repository_EffectiveKcal,
                );
                if (val_to_DayBefore < 0) {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'rgb(27, 206, 27)';
                } else {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'red';
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).innerHTML = '+' + val_to_DayBefore + ' Kcal';
                }
            } else {
                val_to_DayBefore = '-';
                lastDayVal = my_Statistics[i].repository_EffectiveKcal;
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore;
            }

            // Fett in Gramm
            let trueDifferenz = kcal_Requirement - parseInt(currentVal);
            let kcal_in_Gramm = parseInt((trueDifferenz * 1000) / 7000);
            fatSum += kcal_in_Gramm;
            if (kcal_in_Gramm < 0) {
                document.getElementById('fettInGramm_Col_' + i).innerHTML =
                    '+' + Math.abs(kcal_in_Gramm) + ' g';
            } else {
                document.getElementById('fettInGramm_Col_' + i).innerHTML =
                    '-' + kcal_in_Gramm + ' g';
            }

            // Diagramm
            currProzent =
                (parseInt(my_Statistics[i].repository_EffectiveKcal) * 100) /
                kcal_Ziel;
            let colHeightInPixel = (currProzent * 500) / 100;
            if (colHeightInPixel > 1000) {
                document.getElementById('COL_Dia_' + i).style.height = '1000px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_EffectiveKcal + ' kcal 🚀';
            } else {
                document.getElementById('COL_Dia_' + i).style.height =
                    colHeightInPixel + 'px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_EffectiveKcal + ' kcal';
            }

            // Balken färben
            if (currentVal > kcal_Ziel && currentVal < kcal_Requirement) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'yellow';
            } else if (currentVal > kcal_Ziel) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'rgb(43, 161, 43)';
            }

            if (kcal_in_Gramm >= 0) {
                document.getElementById('fettInGramm_Col_' + i).style.color =
                    'rgb(27, 206, 27)';
            } else {
                document.getElementById('fettInGramm_Col_' + i).style.color =
                    'red';
            }
        }

        // Ziel Latte
        let targetHeight = 500; // Mitte
        document.getElementById('eff_Goal').style.bottom = targetHeight + 'px';

        // Fettsumme anzeigen

        if (fatSum > 0) {
            document.getElementById('outputFatSum').innerHTML =
                '-' + fatSum + ' g';
            document.getElementById('outputFatSum').style.color =
                'rgb(27, 206, 27)';
        } else {
            document.getElementById('outputFatSum').innerHTML = fatSum + ' g';
            document.getElementById('outputFatSum').style.color = 'red';
        }

        // >>> SCHRITTE <<<
    } else if (val == 'show_Steps') {
        document.getElementById('valDescription').innerHTML = 'Schritte';
        document.getElementById('valDescrFett').innerHTML = '';
        document.getElementById('UeberschriftStatisik').innerHTML =
            'Schritte -- (Ziel: ' + min_Steps + ' Schr.)';
        document.getElementById('outputFatSum').innerHTML = '';
        var stepCounter = 0;
        // Fett ausblenden
        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = '-';
            document.getElementById('fettInGramm_Col_' + i).style.color =
                'white';
        }

        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('datum_Col_' + i).innerHTML =
                my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_Steps;
            document.getElementById('val_Col_' + i).innerHTML = currentVal;
            stepCounter += currentVal;
            // + - zum Vortag
            if (i > 0) {
                val_to_DayBefore =
                    parseInt(my_Statistics[i].repository_Steps) -
                    parseInt(lastDayVal);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore + ' Schr.';
                lastDayVal = parseInt(my_Statistics[i].repository_Steps);
                if (val_to_DayBefore > 0) {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).innerHTML = '+' + val_to_DayBefore + ' Schr.';
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'rgb(27, 206, 27)';
                } else {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'red';
                }
            } else {
                val_to_DayBefore = '-';
                lastDayVal = my_Statistics[i].repository_Steps;
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore;
            }

            // Diagramm
            currProzent =
                (parseInt(my_Statistics[i].repository_Steps) * 100) / min_Steps;
            let colHeightInPixel = (currProzent * 500) / 100;
            if (colHeightInPixel > 1000) {
                document.getElementById('COL_Dia_' + i).style.height = '1000px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Steps + ' 🚀';
            } else {
                document.getElementById('COL_Dia_' + i).style.height =
                    colHeightInPixel + 'px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Steps;
            }

            // Balken färben
            if (currentVal < min_Steps && currentVal > min_Steps * 0.9) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'yellow';
            } else if (currentVal < min_Steps) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'rgb(43, 161, 43)';
            }
        }
        document.getElementById('outputFatSum').innerHTML = stepCounter;

        // >>> Zucker <<<
    } else if (val == 'show_Sugar') {
        document.getElementById('valDescription').innerHTML = 'Zucker';
        document.getElementById('valDescrFett').innerHTML = '';
        document.getElementById('UeberschriftStatisik').innerHTML =
            'Zucker -- (Ziel: ' + max_Sugar + ' g)';
        document.getElementById('outputFatSum').innerHTML = '';
        var sugarCounter = 0;
        // Fett ausblenden
        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = '-';
            document.getElementById('fettInGramm_Col_' + i).style.color =
                'white';
        }

        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('datum_Col_' + i).innerHTML =
                my_Statistics[i].repository_date;
            currentVal = parseFloat(my_Statistics[i].repository_Sugar);
            document.getElementById('val_Col_' + i).innerHTML = currentVal;
            sugarCounter += currentVal;
            // + - zum Vortag
            if (i > 0) {
                val_to_DayBefore =
                    parseFloat(my_Statistics[i].repository_Sugar) -
                    parseFloat(lastDayVal);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore.toFixed(1) + ' g';
                lastDayVal = parseFloat(my_Statistics[i].repository_Sugar);
                if (val_to_DayBefore < 0) {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'rgb(27, 206, 27)';
                } else {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'red';
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).innerHTML = '+' + val_to_DayBefore.toFixed(1) + ' g';
                }
            } else {
                val_to_DayBefore = '-';
                lastDayVal = parseFloat(my_Statistics[i].repository_Sugar);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore;
            }

            // Diagramm
            currProzent =
                (parseFloat(my_Statistics[i].repository_Sugar) * 100) /
                max_Sugar;
            let colHeightInPixel = (currProzent * 500) / 100;
            if (colHeightInPixel > 1000) {
                document.getElementById('COL_Dia_' + i).style.height = '1000px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Sugar + ' 🚀';
            } else {
                document.getElementById('COL_Dia_' + i).style.height =
                    colHeightInPixel + 'px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Sugar;
            }

            // Balken färben
            if (currentVal > max_Sugar && currentVal < max_Sugar * 1.1) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'yellow';
            } else if (currentVal > max_Sugar) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'rgb(43, 161, 43)';
            }
        }

        document.getElementById('outputFatSum').innerHTML =
            sugarCounter.toFixed(1) +
            'g (' +
            (sugarCounter / statistik_Count).toFixed(1) +
            'g/Tag)';

        // >>> Wasser <<<
    } else if (val == 'show_Water') {
        document.getElementById('valDescription').innerHTML = 'Wasser';
        document.getElementById('valDescrFett').innerHTML = '';
        document.getElementById('UeberschriftStatisik').innerHTML =
            'Wasser -- (Ziel: 2 L)';
        document.getElementById('outputFatSum').innerHTML = '';
        var waterCounter = 0.0;
        // Fett ausblenden
        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = '-';
            document.getElementById('fettInGramm_Col_' + i).style.color =
                'white';
        }

        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('datum_Col_' + i).innerHTML =
                my_Statistics[i].repository_date;
            currentVal = parseFloat(my_Statistics[i].repository_Water);
            waterCounter += currentVal;
            document.getElementById('val_Col_' + i).innerHTML = currentVal;

            // + - zum Vortag
            if (i > 0) {
                val_to_DayBefore =
                    parseFloat(my_Statistics[i].repository_Water) -
                    parseFloat(lastDayVal);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore + ' L';
                lastDayVal = parseFloat(my_Statistics[i].repository_Water);
                if (val_to_DayBefore > 0) {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).innerHTML = '+' + val_to_DayBefore + ' L';
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'rgb(27, 206, 27)';
                } else {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'red';
                }
            } else {
                val_to_DayBefore = '-';
                lastDayVal = parseFloat(my_Statistics[i].repository_Water);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore;
            }

            // Diagramm
            currProzent =
                (parseFloat(my_Statistics[i].repository_Water) * 100) / 2;
            let colHeightInPixel = (currProzent * 500) / 100;
            if (colHeightInPixel > 1000) {
                document.getElementById('COL_Dia_' + i).style.height = '1000px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Water + 'L 🚀';
            } else {
                document.getElementById('COL_Dia_' + i).style.height =
                    colHeightInPixel + 'px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_Water + ' L';
            }

            // Balken färben
            if (currentVal < 2) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    '#41e6fc';
            }
        }

        document.getElementById('outputFatSum').innerHTML = waterCounter + ' L';

        // Verbrannte KCAL
    } else if (val == 'show_BurndedKcal') {
        // >>> Verbrannte KCAL <<<
        const kcalVal = 6.5;
        const diviVal = 10000;
        let burnedKcalGoal = parseInt(
            (min_Steps * kcalVal * bodyWeight) / diviVal,
        );
        document.getElementById('valDescription').innerHTML = 'Verbrannte Kcal';
        document.getElementById('valDescrFett').innerHTML = '';
        document.getElementById('UeberschriftStatisik').innerHTML =
            'Verbrannte Kcal -- (Ziel: ' + burnedKcalGoal + ' Kcal)';
        document.getElementById('outputFatSum').innerHTML = '';

        // Fett ausblenden
        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('fettInGramm_Col_' + i).innerHTML = '-';
            document.getElementById('fettInGramm_Col_' + i).style.color =
                'white';
        }

        for (var i = 0; i < statistik_Count; i++) {
            document.getElementById('datum_Col_' + i).innerHTML =
                my_Statistics[i].repository_date;
            currentVal = my_Statistics[i].repository_BurnedKCal;
            document.getElementById('val_Col_' + i).innerHTML = currentVal;

            // + - zum Vortag
            if (i > 0) {
                val_to_DayBefore =
                    parseInt(my_Statistics[i].repository_BurnedKCal) -
                    parseInt(lastDayVal);
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore + ' Kcal';
                lastDayVal = parseInt(my_Statistics[i].repository_BurnedKCal);
                if (val_to_DayBefore < 0) {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'red';
                } else {
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).style.color = 'rgb(27, 206, 27)';
                    document.getElementById(
                        'change_DayBefore_Col_' + i,
                    ).innerHTML = '+' + val_to_DayBefore + ' Kcal';
                }
            } else {
                val_to_DayBefore = '-';
                lastDayVal = my_Statistics[i].repository_BurnedKCal;
                document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                    val_to_DayBefore;
            }

            // Diagramm
            currProzent =
                (parseInt(my_Statistics[i].repository_BurnedKCal) * 100) /
                burnedKcalGoal;
            let colHeightInPixel = (currProzent * 500) / 100;
            let colName = 'COL_Dia_' + i;
            if (colHeightInPixel > 1000) {
                document.getElementById('COL_Dia_' + i).style.height = '1000px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_BurnedKCal + ' kcal 🚀';
            } else {
                document.getElementById('COL_Dia_' + i).style.height =
                    colHeightInPixel + 'px';
                document.getElementById('COL_Dia_' + i).innerText =
                    my_Statistics[i].repository_BurnedKCal + ' kcal';
            }
            animate_StatisticCol(colHeightInPixel, colName);

            // Balken färben
            if (currentVal < burnedKcalGoal) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'rgb(43, 161, 43)';
            }
        }

        // Ziel Latte
        let targetHeight = 500; // Mitte
        document.getElementById('eff_Goal').style.bottom = targetHeight + 'px';
    }
}

// Animation
function animate_StatisticCol(progrsVal, colName) {
    // var keyframes = "@keyframes progressbar-move{ 0%{heigth:0px;} 100%{heigth:" + parseInt(progrsVal) + "px;} }";
    // var s = document.createElement("style");
    // s.innerHTML = keyframes;
    // document.getElementsByClassName("container_Kcal_Diagram")[0].appendChild(s);
    // var el = document.getElementById(colName);
    // el.style.animation = "progressbar-move ease-in-out 1.5s forwards normal";
}

//============================================================================
// Wasser tracken
//============================================================================
function water_Spin_Up() {
    if (new_Water <= 0) {
        new_Water = 0;
    }
    if (new_Water < 4.0) {
        new_Water += 0.25;
        document.getElementById('outpWaterButton').innerText = new_Water + ' L';
    }
}

function water_Spin_Down() {
    new_Water -= 0.25;
    if (new_Water <= 0) {
        new_Water = -0.25;
        document.getElementById('outpWaterButton').innerText = new_Water + ' L';
    } else if (new_Water > 0) {
        //new_Water -= 0.25;
        document.getElementById('outpWaterButton').innerText = new_Water + ' L';
    }
}

function take_Over_Water() {
    today_Water += new_Water;
    save_Today_Water();
    if (new_Water == -0.25) {
        alert('Wassermenge um 0,25 L korrigiert');
    } else {
        alert(new_Water + ' L Wasser wurden hinzugefügt');
        last_Water();
        document.getElementById('lastWater').innerHTML =
            'Zuletzt: ' + lastWater;
    }
    document.getElementById('output_TodayDrank').innerHTML =
        today_Water + ' Liter';
    new_Water = 0.25;
    document.getElementById('outpWaterButton').innerText = new_Water + ' L';
}

function last_Water() {
    var currentTime = new Date();
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    currentTime = hour + ':' + minute + ' Uhr';
    lastWater = new_Water + ' L um ' + currentTime;

    save_Last_Water();
    //return currentTime;
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

openModalButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

closeModalButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal_Steps');
        closeModal(modal);
    });
});

function openModal(modal) {
    if (modal == null) return;
    document.getElementById('inp_Steps').value = today_Steps;
    modal.classList.add('active');
    overlay.classList.add('active');
    const inp = document.getElementById('inp_Steps');
    inp.select();
}

function closeModal(modal) {
    if (modal == null) return;
    get_new_Steps();
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function get_new_Steps() {
    try {
        today_Steps = parseInt(document.getElementById('inp_Steps').value);
        document.getElementById('btnSteps').innerHTML =
            today_Steps + ' &#128095';
        coloring_Labels();
        steps_into_Kcal();
        // TODO-- Persistent speichern
        save_Today_Steps();
    } catch (error) {
        alert('Nur Zahlen eingeben');
    }
}

function steps_into_Kcal() {
    const kcalVal = 6.5;
    const diviVal = 10000;
    let kcal_from_Steps = parseInt(
        (today_Steps * kcalVal * bodyWeight) / diviVal,
    );
    if (kcal_from_Steps > burned_Kcal) {
        burned_Kcal = kcal_from_Steps;
        save_Burned_Kcal();
    }
    document.getElementById('output_Burned').innerHTML = burned_Kcal + ' Kcal';
    calc_Values();
}

//============================================================================
// Kcal manuell eintragen
//============================================================================
function recordKcal() {
    var new_Kcal = window.prompt(
        'Trage hier abweichende Kcal ein:',
        burned_Kcal,
    );
    if (new_Kcal) {
        if (new_Kcal != burned_Kcal) {
            burned_Kcal = parseInt(new_Kcal);
            document.getElementById('output_Burned').innerHTML =
                burned_Kcal + ' Kcal';
            save_Burned_Kcal();
            calc_Values();
        }
    }
}

//============================================================================
// Food Datenbank Tabelle
//============================================================================

function createTable_FoodDB() {
    // CREATE HTML TABLE OBJECT
    var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement('table'),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < array_Food_DB.length; i++) {
        // ADD "BASIC" CELL
        var cell = row.insertCell();
        cell.innerHTML = array_Food_DB[i].productName;

        // Anzahl der Produkte
        let anzProd = array_Food_DB.length;
        document.getElementById('titleDatenbank').innerHTML =
            'Datenbank (' + anzProd + ')';

        // ATTACH A RUNNING NUMBER OR CUSTOM DATA
        cell.dataset.id = i;

        // Produktauswahl
        cell.addEventListener('click', function () {
            foodFromToday = false;
            selectedFoodIndex = this.dataset.id;
            selected_Food = array_Food_DB[selectedFoodIndex];
            let calories = selected_Food.kcal;
            let quantity = selected_Food.quantityUnit;
            document.getElementById('statusX').innerHTML = '';
            document.getElementById('selectedFoodAnzeige').innerHTML =
                selected_Food.productName;
            document.getElementById('selectedFoodMakros').innerHTML =
                'Mengeneinheit: ' + quantity;
            // Nutri Score
            show_NutriScore();

            blendIn_FoodActionArea();
            // Fokus auf Textfeld setzen
            inputField_EatenFood_in_Gramm.focus();
        });

        // BREAK INTO NEXT ROW
        var next = i + 1;
        if (next % perrow == 0 && next != array_Food_DB.length) {
            row = table.insertRow();
        }
    }

    // ATTACH TABLE TO CONTAINER
    document.getElementById('containerTabelle').appendChild(table);
}

//============================================================================
// Suche
//============================================================================

$('#searchInput').on('keyup', function () {
    var value = $(this).val();
    var data = searchTable(value, array_Food_DB);
    buildTable(data);
});

buildTable(array_Food_DB);

function searchTable(value, data) {
    var filteredData = [];

    for (var i = 0; i < data.length; i++) {
        value = value.toLowerCase();
        var name = data[i].productName.toLowerCase();

        if (name.includes(value)) {
            filteredData.push(data[i]);
        }
    }

    return filteredData;
}

function buildTable(data) {
    var table = document.getElementById('containerTabelle');

    table.innerHTML = '';
    table = document.createElement('table');
    row = table.insertRow();
    for (var i = 0; i < data.length; i++) {
        var perrow = 1, // 1 CELLS pro ROW
            table = document.createElement('table'),
            row = table.insertRow();
        // FPR Schleife
        for (var i = 0; i < data.length; i++) {
            // Füge "BASIC" CELL hinzu
            var cell = row.insertCell();
            cell.innerHTML = data[i].productName;

            // Für Auswahl
            cell.dataset.id = i;

            cell.addEventListener('click', function () {
                foodFromToday = false;
                selectedFoodIndex = this.dataset.id;
                selected_Food = data[selectedFoodIndex];
                let quantity = selected_Food.quantityUnit;
                document.getElementById('statusX').innerHTML = '';
                document.getElementById('selectedFoodAnzeige').innerHTML =
                    selected_Food.productName;
                document.getElementById('selectedFoodMakros').innerHTML =
                    'Mengeneinheit: ' + quantity;
                blendIn_FoodActionArea();
                // Nutri Score
                show_NutriScore();
                // Fokus auf Textfeld setzen
                inputField_EatenFood_in_Gramm.focus();
            });

            var next = i + 1;
            if (next % perrow == 0 && next != data.length) {
                row = table.insertRow();
            }
        }

        // Füge Tabelle zu Container hinzu
        document.getElementById('containerTabelle').appendChild(table);

        // Immer Position beibehalten
        //mittig_halten();

        // Anzahl der Produkte
        let anzProd = data.length;
        document.getElementById('titleDatenbank').innerHTML =
            'Datenbank (' + anzProd + ')';
    }
}

function blendIn_FoodActionArea() {
    document.getElementById('optAreaDB').style.opacity = '1';
    // Disable Schaltflächen
    document.getElementById('btn_Save_to_TodayEaten').disabled = false;
    inputField_EatenFood_in_Gramm.disabled = false;
    document.getElementById('btn_ChangeMacros').disabled = false;
}

function show_NutriScore() {
    /*
    Menge 100 g
    kcal in KJ umwandeln
    Punkte        Energie (Kcal)        Zucker      Salz
      0               <= 81          <= 4,5      <=0,09
      1               >81            >4,5        >0,09
      2               >160            >9          >0,18
      3               >240           >13,5       >0,27
      4               >320           >18         >0,36
      5               >400           >22,5       >0,45
      6               >480           >27         >0,54
      7               >560           >31         >0,63
      8               >641           >36         >0,72
      9               >721           >40         >0,81
      10              >801           >45         >0,9


    */
    var badPoints = 0;
    var goodPoints = 0;
    let calcAmound = 100;
    let check_Kcal = parseInt((calcAmound * selected_Food.kcal) / 100);
    let check_Sugar = parseFloat((calcAmound * selected_Food.sugar) / 100);
    let check_Salt = parseFloat((calcAmound * selected_Food.salt) / 100);
    let check_Protein = parseFloat((calcAmound * selected_Food.protein) / 100);
    let check_Fiber = parseFloat((calcAmound * selected_Food.fiber) / 100);

    // Check Kcal
    if (check_Kcal < 40) {
        badPoints += -1;
    } else if (check_Kcal <= 81) {
        badPoints += 0;
    } else if (check_Kcal > 801) {
        badPoints += 10;
    } else if (check_Kcal > 721) {
        badPoints += 9;
    } else if (check_Kcal > 641) {
        badPoints += 8;
    } else if (check_Kcal > 560) {
        badPoints += 7;
    } else if (check_Kcal > 480) {
        badPoints += 6;
    } else if (check_Kcal > 400) {
        badPoints += 5;
    } else if (check_Kcal > 320) {
        badPoints += 4;
    } else if (check_Kcal > 240) {
        badPoints += 3;
    } else if (check_Kcal > 160) {
        badPoints += 2;
    } else if (check_Kcal > 81) {
        badPoints += 1;
    }

    // Check Zucker
    if (check_Sugar > 45) {
        badPoints += 10;
    } else if (check_Sugar > 40) {
        badPoints += 9;
    } else if (check_Sugar > 36) {
        badPoints += 8;
    } else if (check_Sugar > 31) {
        badPoints += 7;
    } else if (check_Sugar > 27) {
        badPoints += 6;
    } else if (check_Sugar > 22.5) {
        badPoints += 5;
    } else if (check_Sugar > 18) {
        badPoints += 4;
    } else if (check_Sugar > 13.5) {
        badPoints += 3;
    } else if (check_Sugar > 9) {
        badPoints += 2;
    } else if (check_Sugar > 4.5) {
        badPoints += 1;
    } else if (check_Sugar < 2) {
        badPoints += -1;
    } else if (check_Sugar <= 4.5) {
        badPoints += 0;
    }

    // Salz
    if (check_Salt <= 0.09) {
        badPoints += 0;
    } else if (check_Salt > 0.9) {
        badPoints += 10;
    } else if (check_Salt > 0.81) {
        badPoints += 9;
    } else if (check_Salt > 0.71) {
        badPoints += 8;
    } else if (check_Salt > 0.63) {
        badPoints += 7;
    } else if (check_Salt > 0.54) {
        badPoints += 6;
    } else if (check_Salt > 0.45) {
        badPoints += 5;
    } else if (check_Salt > 0.36) {
        badPoints += 4;
    } else if (check_Salt > 0.27) {
        badPoints += 3;
    } else if (check_Salt > 0.18) {
        badPoints += 2;
    } else if (check_Salt > 0.09) {
        badPoints += 1;
    }

    // Eiweiß
    if (check_Protein > 8) {
        goodPoints += 5;
    } else if (check_Protein > 6.4) {
        goodPoints += 4;
    } else if (check_Protein > 4.8) {
        goodPoints += 3;
    } else if (check_Protein > 3.2) {
        goodPoints += 2;
    } else if (check_Protein > 1.6) {
        goodPoints += 1;
    } else if (check_Protein <= 1.6) {
        goodPoints += 0;
    }

    // Ballaststoffe
    if (check_Fiber > 4.7) {
        goodPoints += 5;
    } else if (check_Fiber > 3.7) {
        goodPoints += 4;
    } else if (check_Fiber > 2.8) {
        goodPoints += 3;
    } else if (check_Fiber > 1.9) {
        goodPoints += 2;
    } else if (check_Fiber > 0.9) {
        goodPoints += 1;
    } else if (check_Fiber <= 0.9) {
        goodPoints += 0;
    }

    let nutriScoreVal = badPoints - goodPoints;
    var nutriScore = 0;
    var nutriScoreChar = '';
    var color = '';

    // Reset NutriScoreLabel
    document.getElementById('C_A').style.height = '80px';
    document.getElementById('C_B').style.height = '80px';
    document.getElementById('C_C').style.height = '80px';
    document.getElementById('C_D').style.height = '80px';
    document.getElementById('C_E').style.height = '80px';

    if (nutriScoreVal > 19) {
        nutriScore = 5;
        document.getElementById('C_E').style.height = '120px';
        nutriScoreChar = 'E';
        color = 'red';
    } else if (nutriScoreVal > 11) {
        nutriScore = 4;
        document.getElementById('C_D').style.height = '120px';
        nutriScoreChar = 'D';
        color = 'orange';
    } else if (nutriScoreVal > 3) {
        nutriScore = 3;
        document.getElementById('C_C').style.height = '120px';
        nutriScoreChar = 'C';
        color = 'yellow';
    } else if (nutriScoreVal >= 0) {
        nutriScore = 2;
        document.getElementById('C_B').style.height = '120px';
        nutriScoreChar = 'B';
        color = 'lightgreen';
    } else if (nutriScoreVal < 0) {
        nutriScore = 1;
        document.getElementById('C_A').style.height = '120px';
        nutriScoreChar = 'A';
        color = 'green';
    }
}

//============================================================================
// Prüfbutton für ausgewähltes Lebensmittel und Menge
//============================================================================
function checkButton() {
    if (selected_Food != '') {
        if (inputField_EatenFood_in_Gramm.value == '') {
            alert('Bitte eine Menge eingeben');
        } else {
            let newProduct = selected_Food.productName;
            var selectedAmount = parseFloat(
                inputField_EatenFood_in_Gramm.value,
            );

            // Produkt hinzufügen
            try {
                let kcal_Intake = parseInt(
                    (selectedAmount * selected_Food.kcal) / 100,
                );
                let fat_Intake = parseFloat(
                    (selectedAmount * selected_Food.fat) / 100,
                );
                let carb_Intake = parseFloat(
                    (selectedAmount * selected_Food.carbs) / 100,
                );
                let sugar_Intake = parseFloat(
                    (selectedAmount * selected_Food.sugar) / 100,
                );
                let protein_Intake = parseFloat(
                    (selectedAmount * selected_Food.protein) / 100,
                );
                let salt_Intake = parseFloat(
                    (selectedAmount * selected_Food.salt) / 100,
                );
                let fiber_Intake = parseFloat(
                    (selectedAmount * selected_Food.fiber) / 100,
                );

                // Anzeigen, dass Produkt eingetragen wurde
                let intakeFoodInfo =
                    selectedAmount +
                    ' Gramm ' +
                    newProduct +
                    ' hätte folgende Werte: \n Kcal: ' +
                    kcal_Intake +
                    ' \n Kohlenhydrate: ' +
                    parseInt(carb_Intake) +
                    ' g \n Zucker: ' +
                    parseInt(sugar_Intake) +
                    ' g \n Eiweiss: ' +
                    parseInt(protein_Intake) +
                    ' g \n Fett: ' +
                    parseInt(fat_Intake) +
                    ' g \n Ballaststoffe: ' +
                    parseInt(fiber_Intake) +
                    ' g \n Salz: ' +
                    salt_Intake +
                    ' g';
                alert(intakeFoodInfo);
            } catch (error) {}
        }
    } else {
        alert(
            'Konnte nicht berechnet werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf Lupe klicken',
        );
    }
}

//============================================================================
// Food zu heute gegessen hinzufügen
//============================================================================
function add_Food_to_TodayList() {
    //Produkt nicht "", also ausgewählt
    if (selected_Food != '') {
        if (inputField_EatenFood_in_Gramm.value == '') {
            alert('Bitte eine Menge eingeben');
        } else {
            let newProduct = selected_Food.productName;
            var alreadyTracked = false;
            var todayEatenIndex = 3000;
            var selectedAmount = parseFloat(
                inputField_EatenFood_in_Gramm.value,
            );

            // Checke ob bereits vorhanden
            for (var i = 0; i < today_eaten.length; i++) {
                if (today_eaten[i].intake_productName == newProduct) {
                    alreadyTracked = true;
                    todayEatenIndex = i;
                    break;
                }
            }
            if (alreadyTracked == false) {
            } else {
                // Fragen, ob addiert werden soll
                var addRequest = window.confirm(
                    newProduct +
                        ' ist bereits in Deiner Liste vorhanden. Soll der Wert dazu addiert werden?',
                );

                // WENN ADDIERT WERDEN SOLL...
                if (addRequest) {
                    // old_Quantity ermitteln
                    old_Quantity = today_eaten[todayEatenIndex].intake_amount;
                    // Neuen Wert eintragen alt + neu
                    selectedAmount = selectedAmount + old_Quantity;
                    // Altes Produkt löschen
                    if (todayEatenIndex != 3000) {
                        today_eaten.splice(todayEatenIndex, 1);
                    }
                    // Letzte Aktionen
                    todayEatenIndex = 3000;
                } else {
                    createTable_FoodDB();
                    blendOut_Eingabebereich_FoodDB();
                    return;
                }
            }

            // Produkt hinzufügen
            try {
                let kcal_Intake = parseInt(
                    (selectedAmount * selected_Food.kcal) / 100,
                );
                let fat_Intake = parseFloat(
                    (selectedAmount * selected_Food.fat) / 100,
                );
                let carb_Intake = parseFloat(
                    (selectedAmount * selected_Food.carbs) / 100,
                );
                let sugar_Intake = parseFloat(
                    (selectedAmount * selected_Food.sugar) / 100,
                );
                let protein_Intake = parseFloat(
                    (selectedAmount * selected_Food.protein) / 100,
                );
                let salt_Intake = parseFloat(
                    (selectedAmount * selected_Food.salt) / 100,
                );
                let fiber_Intake = parseFloat(
                    (selectedAmount * selected_Food.fiber) / 100,
                );

                today_eaten.push(
                    new TodayEatenFood(
                        newProduct,
                        selectedAmount,
                        kcal_Intake,
                        fat_Intake,
                        carb_Intake,
                        sugar_Intake,
                        protein_Intake,
                        salt_Intake,
                        fiber_Intake,
                    ),
                );

                // Anzeigen, dass Produkt eingetragen wurde
                let intakeFoodInfo =
                    newProduct +
                    ' wurde zur Liste Heute Gegessen hinzugefügt mit: \n Kcal: ' +
                    kcal_Intake +
                    ' \n Kohlenhydrate: ' +
                    parseInt(carb_Intake) +
                    ' g \n Zucker: ' +
                    parseInt(sugar_Intake) +
                    ' g \n Eiweiss: ' +
                    parseInt(protein_Intake) +
                    ' g \n Fett: ' +
                    parseInt(fat_Intake) +
                    ' g \n Ballaststoffe: ' +
                    parseInt(fiber_Intake) +
                    ' g \n Salz: ' +
                    parseInt(salt_Intake) +
                    ' g';
                alert(intakeFoodInfo);
                document.getElementById('statusX').innerHTML =
                    selected_Food.productName + ' wurde eingetragen';
                // Speichern
                save_Today_Eaten();
                // Aufräumen
                inputField_EatenFood_in_Gramm.value = '';
                selected_Food = '';
                selectedFoodIndex = -1;
                document.getElementById('selectedFoodAnzeige').innerHTML = '';
                document.getElementById('selectedFoodMakros').innerHTML = '';
                blendOut_Eingabebereich_FoodDB();
                blendOut_MengeAendern();
            } catch (error) {}
        }
    } else {
        alert(
            'Konnte nicht gespeichert werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf speichern klicken',
        );
    }
    create_Table_TodayEaten();
    calc_Values();
}

//============================================================================
// Tabelle für Heute gegessen
//============================================================================

function create_Table_TodayEaten() {
    // Reset der Tabelle
    document.getElementById('containerTabelle_Today').innerHTML = '';

    // CREATE HTML TABLE OBJECT
    var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement('table'),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < today_eaten.length; i++) {
        // ADD "BASIC" CELL
        var cell = row.insertCell();
        cell.innerHTML =
            today_eaten[i].intake_productName +
            ' --\n ' +
            today_eaten[i].intake_amount +
            'g  = ' +
            today_eaten[i].intake_kcal +
            ' Kcal';

        // ATTACH A RUNNING NUMBER OR CUSTOM DATA
        cell.dataset.id = i;

        // Produktauswahl
        cell.addEventListener('click', function () {
            foodFromToday = true;
            selectedFoodIndex = this.dataset.id;
            selected_Food = today_eaten[selectedFoodIndex];
            document.getElementById('sel_change_Prod').innerHTML =
                selected_Food.intake_productName;
            document.getElementById('foodAmound_Change').value =
                selected_Food.intake_amount;
            // Sichbar machen
            document.getElementById(
                'invisible_ChangeSection_HeuteGegessen',
            ).hidden = false;
            // Enable Schaltflächen
            document.getElementById('btnChangeQuantity').disabled = false;
            document.getElementById('btnDeleteFoodFromToday').disabled = false;
            document.getElementById('foodAmound_Change').disabled = false;
            blendOut_Eingabebereich_FoodDB();

            var prozentFromDay =
                (selected_Food.intake_kcal * 100) /
                (kcal_Ziel + parseInt(burned_Kcal));
            let calcSingle =
                'Makros: (' +
                selected_Food.intake_kcal +
                ' Kcal = ' +
                prozentFromDay.toFixed(0) +
                '%)' +
                ' | Fett. ' +
                selected_Food.intake_fat.toFixed(1) +
                'g | Eiw. ' +
                selected_Food.intake_protein.toFixed(1) +
                'g | Kh. ' +
                selected_Food.intake_carbs.toFixed(1) +
                'g | Zkr. ' +
                selected_Food.intake_sugar.toFixed(1) +
                'g | Bal. ' +
                selected_Food.intake_fiber.toFixed(1) +
                'g | Slz:  ' +
                selected_Food.intake_salt.toFixed(1) +
                'g';
            document.getElementById('output_SingleMacros').innerHTML =
                calcSingle;
        });

        // BREAK INTO NEXT ROW
        var next = i + 1;
        if (next % perrow == 0 && next != today_eaten.length) {
            row = table.insertRow();
        }
    }

    // ATTACH TABLE TO CONTAINER
    document.getElementById('containerTabelle_Today').appendChild(table);
}

//============================================================================
// Menge ändern
//============================================================================
function change_Food_to_TodayList() {
    let selectedAmount = parseFloat(
        document.getElementById('foodAmound_Change').value,
    );
    if (selectedAmount == '') {
    } else {
        let productNme = selected_Food.intake_productName;
        let kcal_Intake = parseInt(
            (selectedAmount * selected_Food.intake_kcal) / old_Quantity,
        );
        let fat_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_fat) / old_Quantity,
        );
        let carb_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_carbs) / old_Quantity,
        );
        let sugar_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_sugar) / old_Quantity,
        );
        let protein_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_protein) / old_Quantity,
        );
        let salt_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_salt) / old_Quantity,
        );
        let fiber_Intake = parseFloat(
            (selectedAmount * selected_Food.intake_fiber) / old_Quantity,
        );

        // Löschen
        today_eaten.splice(selectedFoodIndex, 1);

        today_eaten.push(
            new TodayEatenFood(
                productNme,
                selectedAmount,
                kcal_Intake,
                fat_Intake,
                carb_Intake,
                sugar_Intake,
                protein_Intake,
                salt_Intake,
                fiber_Intake,
            ),
        );

        create_Table_TodayEaten();
        calc_Values();
        //Speichern
        save_Today_Eaten();
        alert('Menge wurde geändert');
        blendOut_MengeAendern();
    }
}

//============================================================================
// Lösche Position
//============================================================================
function delete_from_today() {
    if (foodFromToday == true) {
        const decision = window.confirm(
            'Möchtest du < ' +
                selected_Food.intake_productName +
                '> wirklich von der heutigen Liste löschen?',
        );
        if (decision) {
            today_eaten.splice(selectedFoodIndex, 1);
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
    } else {
        alert('Kein Produkt ausgewählt');
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

    // Summen bilden
    for (var i = 0; i < today_eaten.length; i++) {
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
    diff = parseInt(kcal_Ziel + burned_Kcal - eaten_Kcal);
    // Output
    document.getElementById('output_Eaten').innerHTML = eaten_Kcal + ' Kcal';
    document.getElementById('output_EffectiveBurned').innerHTML =
        effective_Kcal + ' Kcal';

    if (diff > 0) {
        document.getElementById('output_Diff').innerHTML =
            diff + ' Kcal übrig &#128512';
    } else {
        document.getElementById('output_Diff').innerHTML =
            Math.abs(diff) + ' Kcal zu viel &#128577';
    }

    carbLabel.innerHTML = eaten_Carbs.toFixed(1) + ' g';
    sugarLabel.innerHTML = eaten_Sugar.toFixed(1) + ' g';
    proteinLabel.innerHTML = eaten_Protein.toFixed(1) + ' g';
    fatLabel.innerHTML = eaten_Fat.toFixed(1) + ' g';
    saltLabel.innerHTML = eaten_Salt.toFixed(1) + ' g';
    fiberLabel.innerHTML = eaten_Fiber.toFixed(1) + ' g';
    document.getElementById('output_Gramm').innerHTML =
        parseInt(eaten_Amount) + ' g gegessen';

    // Progress Bar
    let progressValKcal = (eaten_Kcal * 100) / (burned_Kcal + kcal_Ziel);
    let originProgressVal = progressValKcal;
    // Wenn berechneter Wert über 200 dann 200
    if (progressValKcal >= 100) {
        progressValKcal = 100;
        progressCircle.style.stroke = 'red';
        // document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(167, 4, 4), rgb(221, 22, 22))";
    } else {
        progressCircle.style.stroke = 'rgb(12, 255, 12)';
        // document.getElementById('progress_Bar').style.background = "linear-gradient(to right, rgb(4, 167, 4), rgb(22, 221, 22))";
    }
    // document.getElementById('progress_Bar').style.width = progressValKcal + "%";
    // document.getElementById('progress_Bar').innerHTML = Math.round(originProgressVal) + "%";

    //animate_ProgressBar(progressValKcal);
    originalPercentValue = Math.round(originProgressVal);
    initChangeProgress(originalPercentValue, progressValKcal);
    countedPercentNumber = 0;
    countingAnimation(originalPercentValue);
    coloring_Labels();
}

// function animate_ProgressBar(prgrssVal) {
//     var keyframes = "@keyframes progressbar-move{ 0%{width:0%;} 100%{width:" + parseInt(prgrssVal) + "%;} }";
//     var s = document.createElement("style");
//     s.innerHTML = keyframes;
//     document.getElementsByClassName("fullCell")[0].appendChild(s);
//     var el = document.getElementById("progress_Bar");
//     el.style.animation = "progressbar-move ease-in-out 1.5s forwards normal";
// }

//============================================================================
// Progress Bar
//============================================================================
let radius = progressCircle.r.baseVal.value;
let circumference = radius * 2 * Math.PI;
progressCircle.style.strokeDasharray = circumference;

function setProgress(percent) {
    progressCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
}

function initChangeProgress(originalPercentValue, circlePercentValue) {
    // const roundedPercentOutputVal = Math.round(originalPercentValue);
    txtPercent.innerHTML = under10(originalPercentValue) + '%';
    setProgress(circlePercentValue);
}

function under10(val) {
    if (val < 10) {
        val = '0' + val;
    }
    return val;
}

circleAnimationArea.addEventListener('click', () => {
    resetProgressCircle();
    showTargets();
});

function resetProgressCircle() {
    countedPercentNumber = 0;
    initChangeProgress(0, 0);
    setTimeout(() => {
        calc_Values();
    }, 4000);
}

function countingAnimation() {
    if (countedPercentNumber < originalPercentValue) {
        txtPercent.innerHTML = under10(countedPercentNumber) + '%';
        countedPercentNumber++;
        setTimeout(countingAnimation, 15);
    }
}

function showTargets() {
    // Blende die Ziele ein
    carbLabel.innerHTML = `${eaten_Carbs.toFixed(1)} / Max ${des_Carbs}`;
    sugarLabel.innerHTML = `${eaten_Sugar.toFixed(1)} / Max ${max_Sugar}`;
    proteinLabel.innerHTML = `${eaten_Protein.toFixed(1)} / Min ${min_Protein}`;
    fatLabel.innerHTML = `${eaten_Fat.toFixed(1)} / Max ${des_Fat}`;
    fiberLabel.innerHTML = `${eaten_Fiber.toFixed(1)} / Min ${min_Fiber}`;
    saltLabel.innerHTML = `${eaten_Salt.toFixed(1)} / Max ${max_Salt}`;
}

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
function step_Progress() {
    if (today_Steps <= min_Steps / 2) {
        document.getElementById('btnSteps').style.color = 'red';
    } else if (today_Steps < min_Steps) {
        document.getElementById('btnSteps').style.color = 'orange';
    } else {
        document.getElementById('btnSteps').style.color = 'rgb(27, 206, 27)';
    }
}

// Effektive Kcal
function effectiveKcal_Progress() {
    if (effective_Kcal > kcal_Ziel) {
        document.getElementById('output_EffectiveBurned').style.color = 'red';
    } else {
        document.getElementById('output_EffectiveBurned').style.color =
            'rgb(27, 206, 27)';
    }
}

// Kalorienbilanz
function kalorienBilanz_Progress() {
    if (diff > 0) {
        document.getElementById('output_Diff').style.color = 'rgb(27, 206, 27)';
    } else {
        document.getElementById('output_Diff').style.color = 'red';
    }
}

// Weitere Ziele

function colorizeTargetProgress() {
    let shouldMinVal = [min_Protein, min_Fiber, min_Steps];
    let isMinVal = [eaten_Protein, eaten_Fiber, today_Steps];

    if (eaten_Sugar >= max_Sugar) {
        sugarLabel.style.color = 'red';
    } else {
        sugarLabel.style.color = 'rgb(27, 206, 27)';
    }

    if (eaten_Salt >= max_Salt) {
        saltLabel.style.color = 'red';
    } else {
        saltLabel.style.color = 'rgb(27, 206, 27)';
    }

    if (eaten_Protein < min_Protein) {
        proteinLabel.style.color = 'red';
    } else {
        proteinLabel.style.color = 'rgb(27, 206, 27)';
    }

    if (eaten_Fiber < min_Fiber) {
        fiberLabel.style.color = 'red';
    } else {
        fiberLabel.style.color = 'rgb(27, 206, 27)';
    }

    if (eaten_Carbs > des_Carbs) {
        carbLabel.style.color = 'red';
    } else {
        carbLabel.style.color = 'rgb(27, 206, 27)';
    }

    if (isKeto == true) {
        if (eaten_Fat > des_Fat) {
            fatLabel.style.color = 'rgb(27, 206, 27)';
        } else {
            fatLabel.style.color = 'red';
        }
    } else {
        if (eaten_Fat < des_Fat) {
            fatLabel.style.color = 'rgb(27, 206, 27)';
        } else {
            fatLabel.style.color = 'red';
        }
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
    if (selectedGender == undefined) {
        alert('Bitte eine Auswahl bei Geschlecht treffen');
    } else {
        // Gewicht
        if (document.getElementById('weight').value == '') {
            alert('Bitte das Feld Gewicht ausfüllen');
        } else {
            bodyWeight = document.getElementById('weight').value;
            save_BodyWeight();

            // Größe
            if (document.getElementById('height').value == '') {
                alert('Bitte das Feld Größe ausfüllen');
            } else {
                height = document.getElementById('height').value;

                // Alter
                if (document.getElementById('age').value == '') {
                    alert('Bitte das Feld Alter ausfüllen');
                } else {
                    age = document.getElementById('age').value;

                    // Zielgewicht
                    if (document.getElementById('target_Weight').value == '') {
                        alert('Bitte das Feld Alter ausfüllen');
                    } else {
                        targetWeight =
                            document.getElementById('target_Weight').value;

                        // Zielzeit
                        if (
                            document.getElementById('target_Time').value == ''
                        ) {
                            alert('Bitte das Feld Zeitraum ausfüllen');
                        } else {
                            targetTime =
                                document.getElementById('target_Time').value;

                            // Berechnung Kalorienbedarf
                            if (selectedGender == 'male') {
                                // Mann
                                // 66,47 + (13,7 * Körpergewicht in kg) + (5 * Körpergröße in cm) – (6,8 * Alter in Jahren)
                                kcal_Requirement = parseInt(
                                    66.47 +
                                        13.7 * bodyWeight +
                                        5 * height -
                                        6.8 * age,
                                );
                                save_Kcal_Requirement();

                                let kcal_Differenz = bodyWeight - targetWeight;
                                let tage = targetTime * 30;
                                let abnehmBerg = kcal_Differenz * 7000;
                                let zielEinsparung_pro_Tag = abnehmBerg / tage;
                                let recommended_Kcal = parseInt(
                                    kcal_Requirement - zielEinsparung_pro_Tag,
                                );

                                let ausg =
                                    'Wenn du Dein Zielgewicht von ' +
                                    targetWeight +
                                    '  kg in ' +
                                    targetTime +
                                    ' Monat(en) erreichen möchtest, würde dein Kcal-Ziel bei: ' +
                                    recommended_Kcal +
                                    ' Kcal liegen';
                                document.getElementById(
                                    'output_Kcal_Req',
                                ).innerHTML =
                                    'Du hast einen Kalorienbedarf von ' +
                                    kcal_Requirement +
                                    ' Kcal pro Tag. ' +
                                    ausg;
                                document.getElementById(
                                    'target_KcalZiel',
                                ).value = recommended_Kcal;
                            } else {
                                // Formel für KCAL Bedarf FRAU
                                //655,1 + (9,6 * Körpergewicht in kg) + (1,8 * Körpergröße in cm) – (4,7 * Alter in Jahren)
                                kcal_Requirement = parseInt(
                                    655.1 +
                                        9.6 * bodyWeight +
                                        1.8 * height -
                                        4.7 * age,
                                );

                                let kcal_Differenz = bodyWeight - targetWeight;
                                let tage = targetTime * 30;
                                let abnehmBerg = kcal_Differenz * 7000;
                                let zielEinsparung_pro_Tag = abnehmBerg / tage;
                                let recommended_Kcal = parseInt(
                                    kcal_Requirement - zielEinsparung_pro_Tag,
                                );

                                let ausg =
                                    'Wenn du Dein Zielgewicht von ' +
                                    targetWeight +
                                    '  kg in ' +
                                    targetTime +
                                    ' Monat(en) erreichen möchtest, würde dein Kcal-Ziel bei: ' +
                                    recommended_Kcal +
                                    ' Kcal liegen';
                                document.getElementById(
                                    'output_Kcal_Req',
                                ).innerHTML =
                                    'Du hast einen Kalorienbedarf von ' +
                                    kcal_Requirement +
                                    ' Kcal pro Tag. ' +
                                    ausg;
                                document.getElementById(
                                    'target_KcalZiel',
                                ).value = recommended_Kcal;
                            }

                            // Aufräumen
                            document.getElementById('height').value = '';
                            document.getElementById('age').value = '';
                            document.getElementById('target_Weight').value = '';
                            document.getElementById('target_Time').value = '';

                            //window.scrollTo(0, 13600);
                        }
                    }
                }
            }
        }
    }
}

// kcal_Ziel
function define_Kcal_Target() {
    if (document.getElementById('target_KcalZiel').value == '') {
        alert('Kein Wert enthalten');
    } else {
        kcal_Ziel = parseInt(document.getElementById('target_KcalZiel').value);
        save_kcalZiel();
        alert('Kcal Ziel wurde übernommen');
        window.scrollTo(0, 0);
        location.reload();
    }
}

// Weitere Ziele
function define_additional_Target() {
    additional_Targets = [];

    if (document.getElementById('target_Sugar').value != '') {
        max_Sugar = document.getElementById('target_Sugar').value;
        let varName = 'tSugar';
        additional_Targets.push(new StoredTarget(varName, max_Sugar));
    }

    if (document.getElementById('target_Salt').value != '') {
        max_Salt = document.getElementById('target_Salt').value;
        let varName = 'tSalt';
        additional_Targets.push(new StoredTarget(varName, max_Salt));
    }

    if (document.getElementById('target_Protein').value != '') {
        min_Protein = document.getElementById('target_Protein').value;
        let varName = 'tProtein';
        additional_Targets.push(new StoredTarget(varName, min_Protein));
    }

    if (document.getElementById('target_Fiber').value != '') {
        min_Fiber = document.getElementById('target_Fiber').value;
        let varName = 'tFiber';
        additional_Targets.push(new StoredTarget(varName, min_Fiber));
    }

    if (document.getElementById('target_Steps').value != '') {
        min_Steps = document.getElementById('target_Steps').value;
        let varName = 'tSteps';
        additional_Targets.push(new StoredTarget(varName, min_Steps));
    }

    if (document.getElementById('target_Fat').value != '') {
        des_Fat = document.getElementById('target_Fat').value;
        let varName = 'tFat';
        additional_Targets.push(new StoredTarget(varName, des_Fat));
    }

    if (document.getElementById('target_Carbs').value != '') {
        des_Carbs = document.getElementById('target_Carbs').value;
        let varName = 'tCarbs';
        additional_Targets.push(new StoredTarget(varName, des_Carbs));
    }

    let varName = 'tKeto';
    additional_Targets.push(new StoredTarget(varName, isKeto));

    // Save
    localStorage.setItem(
        'storedAdditionalTargets',
        JSON.stringify(additional_Targets),
    );

    alert('Ziele wurden übernommen');
    calc_Values();
    show_Statisitcs('show_Effekctive_Kcal');
}

function load_Additional_Targets() {
    for (var i = 0; i < additional_Targets.length; i++) {
        if (additional_Targets[i].targetName == 'tSugar') {
            max_Sugar = additional_Targets[i].targetVal;
            document.getElementById('target_Sugar').value = max_Sugar;
        }
        if (additional_Targets[i].targetName == 'tSalt') {
            max_Salt = additional_Targets[i].targetVal;
            document.getElementById('target_Salt').value = max_Salt;
        }
        if (additional_Targets[i].targetName == 'tProtein') {
            min_Protein = additional_Targets[i].targetVal;
            document.getElementById('target_Protein').value = min_Protein;
        }
        if (additional_Targets[i].targetName == 'tFiber') {
            min_Fiber = additional_Targets[i].targetVal;
            document.getElementById('target_Fiber').value = min_Fiber;
        }
        if (additional_Targets[i].targetName == 'tSteps') {
            min_Steps = additional_Targets[i].targetVal;
            document.getElementById('target_Steps').value = min_Steps;
        }
        if (additional_Targets[i].targetName == 'tFat') {
            des_Fat = additional_Targets[i].targetVal;
            document.getElementById('target_Fat').value = des_Fat;
        }
        if (additional_Targets[i].targetName == 'tCarbs') {
            des_Carbs = additional_Targets[i].targetVal;
            document.getElementById('target_Carbs').value = des_Carbs;
        }
        if (additional_Targets[i].targetName == 'tKeto') {
            isKeto = additional_Targets[i].targetVal;
        }
    }
}

// Spezielle Ernährungsweise ein / ausblenden je nach Toggle Wert
let toggleBtn_SpezDiet = document.getElementById('spez_Diet_ToggleButton');
toggleBtn_SpezDiet.addEventListener('click', showDietMethods);

function showDietMethods() {
    if (spezDiet_Visible == false) {
        document.getElementById('spezDietDiv').style.opacity = '1';
        document.getElementById('diet_List').disabled = false;
        document.getElementById('submitDiet').disabled = false;
        spezDiet_Visible = true;
    } else {
        document.getElementById('spezDietDiv').style.opacity = '0';
        document.getElementById('diet_List').disabled = true;
        document.getElementById('submitDiet').disabled = true;
        spezDiet_Visible = false;
    }
}

// Bei Klick auf das Drop Down Feld Liste leeren
let dietList = document.getElementById('diet_List');
dietList.addEventListener('click', function () {
    dietList.value = '';
});

// Diet auswählen

function selectDiet() {
    const prevDiet = document.getElementById('diet_List').value;
    let limitFat = 0;
    let limitProtein = 0;
    let limitCarbs = 0;
    let maxProtein = bodyWeight * 1.5;

    if (prevDiet == 'Keto') {
        limitFat = 78;
        limitProtein = 19;
        limitCarbs = 3;
        isKeto = true;
    } else if (prevDiet == 'Low Carb') {
        limitFat = 50;
        limitProtein = 30;
        limitCarbs = 20;
        isKeto = false;
    } else if (prevDiet == 'Moderat') {
        limitFat = 40;
        limitProtein = 30;
        limitCarbs = 30;
        isKeto = false;
    }

    const desired_Fat = (limitFat * kcal_Ziel) / 100;
    const desired_Protein = (limitProtein * kcal_Ziel) / 100;
    const desired_Carbs = (limitCarbs * kcal_Ziel) / 100;

    let fat_in_Gramm = parseInt(desired_Fat / 9.3);
    let protein_in_Gramm = parseInt(desired_Protein / 4.1);
    const carbs_in_Gramm = parseInt(desired_Carbs / 4.1);

    document.getElementById('target_Fat').value = fat_in_Gramm;
    document.getElementById('target_Protein').value = protein_in_Gramm;
    document.getElementById('target_Carbs').value = carbs_in_Gramm;
    document.getElementById('target_Sugar').value = parseInt(
        carbs_in_Gramm * 0.5,
    );

    if (protein_in_Gramm > maxProtein) {
        const proteinDiff = parseInt(protein_in_Gramm % maxProtein);
        const protein_Diff_in_Kcal = proteinDiff * 4.1;
        const addedFat = parseInt(protein_Diff_in_Kcal / 9.3);

        protein_in_Gramm = parseInt(protein_in_Gramm - proteinDiff);
        fat_in_Gramm = parseInt(fat_in_Gramm + addedFat);
        alert(
            'Es ist nicht unbedingt empfohlen, mehr als 1.5 g Protein pro Kg Körpergewicht zu essen. Mit: ' +
                protein_in_Gramm +
                ' g liegst du ' +
                proteinDiff +
                ' g darüber. Ich ändere die Eiweißmenge ab und schreibe dir ' +
                addedFat +
                ' g Fett gut :)',
        );
        document.getElementById('target_Fat').value = fat_in_Gramm;
        document.getElementById('target_Protein').value = protein_in_Gramm;
    }
}

//============================================================================
// Tag abschließen
//============================================================================

function close_Day() {
    const req = window.confirm('Soll der Tag wirklich zurückgesetzt werden?');
    if (req) {
        var currDate = window.prompt(
            'Bestätige oder ändere das Datum',
            get_today(),
        );
        if (currDate) {
            var realKcal = window.prompt(
                'Kcal bestätigen oder abändern',
                burned_Kcal,
            );
            if (realKcal) {
                burned_Kcal = parseInt(realKcal);
                calc_Values();
            }
            let todaySugar = parseFloat(sugarLabel.innerHTML);
            let todayFat = parseFloat(fatLabel.innerHTML);
            let todayFiber = parseFloat(fiberLabel.innerHTML);
            let todayProtein = parseFloat(proteinLabel.innerHTML);
            let todayCarbs = parseFloat(carbLabel.innerHTML);
            let todayGramm = parseFloat(
                document.getElementById('output_Gramm').innerHTML,
            );
            let todaySalt = parseFloat(saltLabel.innerHTML);
            let todayDiff =
                parseInt(kcal_Requirement) +
                parseInt(burned_Kcal) -
                parseInt(eaten_Kcal); //parseInt(document.getElementById('output_Diff').innerHTML);
            let todayKeto = 'Keto: Nein';
            if (isKeto == true) {
                todayKeto = 'Keto: Ja';
            }
            let placeHolder = ' | ';
            let placeHolderGramm = ' g | ';
            let einleitung = 'Am ' + currDate + ' wurde folgendes erfasst: ';
            let goalDiff =
                parseInt(kcal_Ziel) +
                parseInt(burned_Kcal) -
                parseInt(eaten_Kcal);
            let targets =
                'Ziel_Eiweiss:' + min_Protein + ' | Ziel_Zucker: ' + max_Sugar;
            // Hinzufügen von MyHistory String
            let new_Day_for_my_History =
                einleitung +
                'Kcal: ' +
                parseInt(eaten_Kcal) +
                ' Kcal' +
                placeHolder +
                'Verbrannt: ' +
                burned_Kcal +
                ' Kcal' +
                placeHolder +
                'Übrig: ' +
                todayDiff +
                placeHolder +
                'Effektive Kcal: ' +
                effective_Kcal +
                placeHolder +
                'Schritte: ' +
                today_Steps +
                ' Schr.' +
                placeHolder +
                todayKeto +
                ' | Makros--> Fett: ' +
                todayFat +
                placeHolder +
                'Eiweiss: ' +
                todayProtein +
                placeHolderGramm +
                'Kohlenhydrate: ' +
                todayCarbs +
                placeHolderGramm +
                'Zucker: ' +
                todaySugar +
                placeHolderGramm +
                'Salz: ' +
                todaySalt +
                placeHolderGramm +
                'Ballaststoffe: ' +
                todayFiber +
                placeHolder +
                'Gramm: ' +
                todayGramm +
                placeHolderGramm +
                'Diff zum Ziel: ' +
                goalDiff +
                ' Kcal' +
                placeHolder +
                'Wasser: ' +
                parseFloat(today_Water) +
                ' L' +
                placeHolder +
                targets;

            // Dem History Array hinzufügen
            my_History.push(new History(currDate, new_Day_for_my_History));

            // Save History
            save_History();

            // Hinzufügen der Tageswerte in Statistik
            let length_Of_Statistic_Array = my_Statistics.length;
            if (length_Of_Statistic_Array >= 7) {
                // Wenn alle Plätze schon belegt, erste löschen
                let oldarr = my_Statistics;
                my_Statistics = [];

                for (var i = 1; i < oldarr.length; i++) {
                    my_Statistics.push(oldarr[i]);
                }

                my_Statistics.push(
                    new RepositoryLast7Days(
                        currDate,
                        effective_Kcal,
                        today_Steps,
                        burned_Kcal,
                        todaySugar,
                        todayProtein,
                        todayFiber,
                        todayFat,
                        today_Water,
                    ),
                );
                show_Statisitcs('show_Effekctive_Kcal');
            } else {
                my_Statistics.push(
                    new RepositoryLast7Days(
                        currDate,
                        effective_Kcal,
                        today_Steps,
                        burned_Kcal,
                        todaySugar,
                        todayProtein,
                        todayFiber,
                        todayFat,
                        today_Water,
                    ),
                );
                show_Statisitcs('show_Effekctive_Kcal');
            }

            // SPEICHERN DER WERTE
            save_Statistics();

            // RESET
            today_Steps = 0;
            today_eaten = [];
            today_Water = 0;
            burned_Kcal = 0;
            lastWater = 'Gestern';
            save_Burned_Kcal();
            save_Last_Water();
            document.getElementById('btnSteps').innerHTML =
                today_Steps + ' &#128095';
            document.getElementById('lastWater').innerHTML = 'Zuletzt: ';
            coloring_Labels();
            steps_into_Kcal();
            calc_Values();
            save_Today_Steps();
            save_Today_Eaten();
            save_Today_Water();
            alert(
                'Tag wurde erfolgreich zurückgesetzt. Die Werte kannst du Dir im Statistikbereich anschaunen.',
            );
            location.reload();
        }
    }
}

// Datum erzeugen
function get_today() {
    var today = new Date();

    var day = today.getDate(); // Tag

    // Monatsangabe startet bei 0!
    var month = today.getMonth() + 1; // Monat

    var year = today.getFullYear(); // Jahr
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    today = day + '.' + month + '.' + year;

    return today;
}

//============================================================================
// Form unsichtbar machen
//============================================================================
function makeFieldsInvisible() {
    if (form_is_Invisible == true) {
        document.getElementById('visibility').style.opacity = '1';
        document.getElementById('inv_Button').style.opacity = '1';
        form_is_Invisible = false;
    } else {
        document.getElementById('visibility').style.opacity = '0';
        document.getElementById('inv_Button').style.opacity = '0';
        form_is_Invisible = true;
        // TODO SPEICHERN DES STATUS UND 78 KG GEWICHT SPEICHERN
        ///////////
    }
}

//============================================================================
// Neues Lebensmittel hinzufügen
//============================================================================

function add_new_Food() {
    var new_productName = '';
    var new_Kcal = 0;
    var new_Fat = 0;
    var new_Carbs = 0;
    var new_Sugar = 0;
    var new_Fiber = 0;
    var new_Protein = 0;
    var new_Salt = 0;
    var new_Unit = 0;

    // Produktname
    if (document.getElementById('inp_Productname').value == '') {
        alert('Bitte die Textbox für den Produktnamen ausfüllen');
    } else {
        new_productName = document.getElementById('inp_Productname').value;

        // Kcal
        if (document.getElementById('inp_Kcal').value == '') {
            alert('Bitte die Textbox für Kcal ausfüllen');
        } else {
            new_Kcal = document.getElementById('inp_Kcal').value;

            // Fett
            if (document.getElementById('inp_Fat').value == '') {
                alert('Bitte die Textbox für Fett ausfüllen');
            } else {
                new_Fat = document.getElementById('inp_Fat').value;
                new_Fat.replace(',', '.');
                parseFloat(new_Fat);

                // Kohlenhydrate
                if (document.getElementById('inp_Carbs').value == '') {
                    alert('Bitte die Textbox für Kohlenhydrate ausfüllen');
                } else {
                    new_Carbs = document.getElementById('inp_Carbs').value;
                    new_Carbs.replace(',', '.');
                    parseFloat(new_Carbs);

                    // Zucker
                    if (document.getElementById('inp_Sugar').value == '') {
                        alert('Bitte die Textbox für Zucker ausfüllen');
                    } else {
                        new_Sugar = document.getElementById('inp_Sugar').value;
                        new_Sugar.replace(',', '.');
                        parseFloat(new_Sugar);

                        // Ballaststoffe
                        if (document.getElementById('inp_Fiber').value == '') {
                            alert(
                                'Bitte die Textbox für Ballaststoffe ausfüllen',
                            );
                        } else {
                            new_Fiber =
                                document.getElementById('inp_Fiber').value;
                            new_Fiber.replace(',', '.');
                            parseFloat(new_Fiber);

                            // Eiweiß
                            if (
                                document.getElementById('inp_Protein').value ==
                                ''
                            ) {
                                alert('Bitte die Textbox für Eiweiß ausfüllen');
                            } else {
                                new_Protein =
                                    document.getElementById(
                                        'inp_Protein',
                                    ).value;
                                new_Protein.replace(',', '.');
                                parseFloat(new_Protein);

                                // Salz
                                if (
                                    document.getElementById('inp_Salt').value ==
                                    ''
                                ) {
                                    alert(
                                        'Bitte die Textbox für Salz ausfüllen',
                                    );
                                } else {
                                    new_Salt =
                                        document.getElementById(
                                            'inp_Salt',
                                        ).value;
                                    new_Salt.replace(',', '.');
                                    parseFloat(new_Salt);

                                    // Mengeneinheit
                                    if (
                                        document.getElementById('inp_Unit')
                                            .value == ''
                                    ) {
                                        alert(
                                            'Bitte die Textbox für Mengeneinheit ausfüllen',
                                        );
                                    } else {
                                        new_Unit =
                                            document.getElementById(
                                                'inp_Unit',
                                            ).value;

                                        let checkedNewFood =
                                            new_productName.toLowerCase();
                                        var comp_Food = '';
                                        var existTwice = false;
                                        // Check Produktname
                                        for (
                                            var i = 0;
                                            i < array_Food_DB.length;
                                            i++
                                        ) {
                                            comp_Food =
                                                array_Food_DB[
                                                    i
                                                ].productName.toLowerCase();

                                            if (comp_Food == checkedNewFood) {
                                                existTwice = true;
                                                break;
                                            }
                                        }

                                        if (existTwice == false) {
                                            // Produkt anlegen
                                            array_Food_DB.push(
                                                new Food(
                                                    new_productName,
                                                    new_Kcal,
                                                    new_Fat,
                                                    new_Carbs,
                                                    new_Sugar,
                                                    new_Protein,
                                                    new_Salt,
                                                    new_Fiber,
                                                    new_Unit,
                                                ),
                                            );
                                            alert(
                                                'Lebensmittel wurde gespeichert :)',
                                            );
                                            document.getElementById(
                                                'Status_New_Food',
                                            ).innerHTML =
                                                'Lebensmittel: ' +
                                                new_productName +
                                                ' wurde zur Datenbank hinzugefügt.';
                                            document.getElementById(
                                                'Status_New_Food',
                                            ).style.color = 'green';
                                            createTable_FoodDB();
                                            // SAVE
                                            saveFood_DB();

                                            // Aufräumen
                                            document.getElementById(
                                                'inp_Productname',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Kcal',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Fat',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Carbs',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Sugar',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Fiber',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Protein',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Salt',
                                            ).value = '';
                                            document.getElementById(
                                                'inp_Unit',
                                            ).value = '';
                                            changeProduct = false;
                                        } else {
                                            if (changeProduct == true) {
                                                // Makros werden angepasst
                                                // Produkt löschen und anlegen
                                                let spliceIndex =
                                                    indexErmittler(
                                                        selected_Food.productName,
                                                    );
                                                array_Food_DB.splice(
                                                    spliceIndex,
                                                    1,
                                                );
                                                array_Food_DB.push(
                                                    new Food(
                                                        new_productName,
                                                        new_Kcal,
                                                        new_Fat,
                                                        new_Carbs,
                                                        new_Sugar,
                                                        new_Protein,
                                                        new_Salt,
                                                        new_Fiber,
                                                        new_Unit,
                                                    ),
                                                );
                                                // SAVE
                                                saveFood_DB();
                                                alert(
                                                    'Lebensmittel wurde erfolgreich angepasst',
                                                );
                                                location.reload();
                                            } else {
                                                document.getElementById(
                                                    'Status_New_Food',
                                                ).innerHTML =
                                                    'Lebensmittel: ' +
                                                    new_productName +
                                                    ' exisitert bereits.';
                                                document.getElementById(
                                                    'Status_New_Food',
                                                ).style.color = 'red';
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
    document.getElementById('inp_Productname').value =
        selected_Food.productName;
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
    if (checkVal == '') {
    } else {
        var deleteDecision = window.confirm(
            'Soll das Lebensmittel: <' +
                selected_Food.productName +
                '> wirklich für immer aus der Datenbank gelöscht werden?',
        );
        if (deleteDecision) {
            let spliceIndex = indexErmittler(selected_Food.productName);
            array_Food_DB.splice(spliceIndex, 1);
            saveFood_DB();
            alert('Lebensmittel wurde gelöscht');
            location.reload();
        }
    }
}

function indexErmittler(searchWord) {
    for (var i = 0; i < array_Food_DB.length; i++) {
        if (array_Food_DB[i].productName == searchWord) {
            return i;
        }
    }
}

//====================================================================================
// Welcome
//====================================================================================

function welcome_Func() {
    let text =
        'Willkommen beim Food-Tracker. \n \n 1. Das kleine Formular ausfüllen. \n 2. Setzte deine weiteren Ziele und schon kann es losgehen. \n Die Daten kannst du jederzeit abändern. \n \n * Die Daten werden nur auf deinem Gerät gespeichert. Weitere Infos sind unten vermerkt.';
    alert(text);
    window.scrollTo(0, 12300);
}

//============================================================================
// Theme
//============================================================================

//  Lade Theme
let theme = localStorage.getItem('theme');
if (theme === null) {
    setTheme('dark');
} else {
    setTheme(theme);
}

// Schleife für angeklickten Theme Button
let themeDots = document.getElementsByClassName('theme-dot');

for (var i = 0; themeDots.length > i; i++) {
    themeDots[i].addEventListener('click', function () {
        let mode = this.dataset.mode;
        setTheme(mode);
    });
}

// Theme ändern
function setTheme(mode) {
    if (mode == 'light') {
        document.getElementById('theme-style').href = 'style.css';
    }
    if (mode == 'dark') {
        document.getElementById('theme-style').href = 'dark.css';
    }
    if (mode == 'green') {
        document.getElementById('theme-style').href = 'green.css';
    }
    if (mode == 'ocean') {
        document.getElementById('theme-style').href = 'ocean.css';
    }
    if (mode == 'lightBlue') {
        document.getElementById('theme-style').href = 'lightBlue.css';
    }
    if (mode == 'Linear') {
        document.getElementById('theme-style').href = 'Linear.css';
    }
    // Save  Theme
    localStorage.setItem('theme', mode);
}

//====================================================================================
// Exportiere Daten
//====================================================================================

// location.href = "mailto:"+emailTo+'?cc='+emailCC+'&subject='+emailSub+'&body='+emailBody;
function export_FoodDB() {
    // Daten aus originaler DB in Array laden
    fetch_Food_DB_Origin();
}

// Originale Datenbank ziehen und Vergleich anstoßen
function fetch_Food_DB_Origin() {
    fetch('Food_DB_v2021_05.json')
        .then((response) => response.json())
        .then((data) => {
            originDB = data;
            var potNewProduct = '';
            for (var i = 0; i < array_Food_DB.length; i++) {
                potNewProduct = array_Food_DB[i].productName;
                if (checkProductInOldDB(potNewProduct) === false) {
                    let exp_Product = potNewProduct;
                    let exp_kcal = array_Food_DB[i].kcal;
                    let exp_Fat = array_Food_DB[i].fat;
                    let exp_Carbs = array_Food_DB[i].carbs;
                    let exp_Sugar = array_Food_DB[i].sugar;
                    let exp_Fiber = array_Food_DB[i].fiber;
                    let exp_Protein = array_Food_DB[i].protein;
                    let exp_Salt = array_Food_DB[i].salt;
                    let exp_Quantity = array_Food_DB[i].quantityUnit;
                    let expItem =
                        exp_Product +
                        ';' +
                        exp_kcal +
                        ';' +
                        exp_Fat +
                        ';' +
                        exp_Carbs +
                        ';' +
                        exp_Sugar +
                        ';' +
                        exp_Protein +
                        ';' +
                        exp_Salt +
                        ';' +
                        exp_Fiber +
                        ';' +
                        exp_Quantity +
                        '; | ';
                    exp_New_Prod.push(expItem);
                }
            }
            let emailTo = '';
            let emailCC = '';
            let emailSub = 'Export Food DB';

            // E-Mail öffnen -- Problem ist, dass der Text auf eine bestimmte Anzahl an Zeichen limitiert ist
            // Deshalb wird dieser in Textbox ausgegeben
            document.getElementById('txtArea').innerHTML = '';
            document.getElementById('txtArea').innerHTML = exp_New_Prod;
            //document.getElementById("txtArea").select();
            //document.execCommand('copy');
            let mailText = '';
            location.href =
                'mailto:' +
                emailTo +
                '?cc=' +
                emailCC +
                '&subject=' +
                emailSub +
                '&body=' +
                mailText;
        });
}

// Suche gleichen Wert
function checkProductInOldDB(oldProd) {
    var found = false;
    var verglProd = '';
    for (var j = 0; j < originDB.length; j++) {
        verglProd = originDB[j].productName;
        if (verglProd == oldProd) {
            found = true;
            break;
        }
    }
    if (found == false) {
        return false;
    }
}

// Exportiert alle Produkte
function export_FoodDB_All() {
    for (var i = 0; i < array_Food_DB.length; i++) {
        potNewProduct = array_Food_DB[i].productName;
        let exp_Product = potNewProduct;
        let exp_kcal = array_Food_DB[i].kcal;
        let exp_Fat = array_Food_DB[i].fat;
        let exp_Carbs = array_Food_DB[i].carbs;
        let exp_Sugar = array_Food_DB[i].sugar;
        let exp_Fiber = array_Food_DB[i].fiber;
        let exp_Protein = array_Food_DB[i].protein;
        let exp_Salt = array_Food_DB[i].salt;
        let exp_Quantity = array_Food_DB[i].quantityUnit;
        let expItem =
            exp_Product +
            ';' +
            exp_kcal +
            ';' +
            exp_Fat +
            ';' +
            exp_Carbs +
            ';' +
            exp_Sugar +
            ';' +
            exp_Protein +
            ';' +
            exp_Salt +
            ';' +
            exp_Fiber +
            ';' +
            exp_Quantity +
            '; | ';
        exp_New_Prod.push(expItem);
    }
    let emailTo = '';
    let emailCC = '';
    let emailSub = 'Export Food DB';
    // E-Mail öffnen -- Problem ist, dass der Text auf eine bestimmte Anzahl an Zeichen limitiert ist
    // Deshalb wird dieser in Textbox ausgegeben
    document.getElementById('txtArea').innerHTML = '';
    document.getElementById('txtArea').innerHTML = exp_New_Prod;
    //document.getElementById("txtArea").select();
    //document.execCommand('copy');
    let mailText = '';
    location.href =
        'mailto:' +
        emailTo +
        '?cc=' +
        emailCC +
        '&subject=' +
        emailSub +
        '&body=' +
        mailText;
}

//====================================================================================
// History
//====================================================================================

function create_MyHistory() {
    // Reset der Tabelle
    document.getElementById('containerTabelle_History').innerHTML = '';

    // CREATE HTML TABLE OBJECT
    var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement('table'),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < my_History.length; i++) {
        // ADD "BASIC" CELL
        var cell = row.insertCell();
        cell.innerHTML = my_History[i].history_date;

        // ATTACH A RUNNING NUMBER OR CUSTOM DATA
        cell.dataset.id = i;

        // Auswahl des Tages
        cell.addEventListener('click', function () {
            selectedDateIndex = this.dataset.id;
            selectedDate = my_History[selectedDateIndex];
            document.getElementById('output_History').innerHTML =
                selectedDate.history_Content;
            // Sichbar machen
            document.getElementById('HistoryButtonContainer').style.opacity =
                '1';
            // Enable Schaltflächen
            document.getElementsByClassName('buttonHistorie').disabled = false;
        });

        // BREAK INTO NEXT ROW
        var next = i + 1;
        if (next % perrow == 0 && next != my_History.length) {
            row = table.insertRow();
        }
    }

    // ATTACH TABLE TO CONTAINER
    document.getElementById('containerTabelle_History').appendChild(table);
}

//====================================================================================
// Den ausgewählten Tag per Mail versenden
//====================================================================================
function sendThisDay() {
    let emailTo = '';
    let emailCC = '';
    let emailSub = 'Food-Tracker: ' + selectedDate.history_date;
    let bodyContent = selectedDate.history_Content;
    location.href =
        'mailto:' +
        emailTo +
        '?cc=' +
        emailCC +
        '&subject=' +
        emailSub +
        '&body=' +
        bodyContent;
}