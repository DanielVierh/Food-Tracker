// Projekt erstellt am 13.05.2021
import { showMessage } from "./modules/message.js";
import { addZero } from "./modules/helperfunctions.js";

// Variabeln
const buttonAdd = document.getElementById('btnAdd');
const buttonScroll_Up = document.getElementById('btnscrl_Up');
let today_Steps = 0;
let array_Food_DB = [];
let today_eaten = [];
let my_Statistics = [];
let additional_Targets = [];
let my_History = [];
let bodyWeight = 78;
let kcal_Ziel = 2000;
let kcal_Requirement = 2000;

let selected_Food = '';
let selectedFoodIndex = 0;
let foodFromToday = false;

let eaten_Kcal = 0;
let eaten_Carbs = 0.0;
let eaten_Sugar = 0.0;
let eaten_Protein = 0.0;
let eaten_Fat = 0.0;
let eaten_Salt = 0.0;
let eaten_Fiber = 0.0;
let eaten_Amount = 0.0;
let burned_Kcal = 0;
let effective_Kcal = 0;
let form_is_Invisible = false;
let diff = 0;
let changeProduct = false;
let old_Quantity = 0;
let max_Sugar = 50;
let max_Salt = 7;
let min_Protein = 90;
let min_Fiber = 30;
let min_Steps = 10000;
let des_Fat = 80;
let des_Carbs = 150;
let new_Water = 0.25;
let today_Water = 0;
let originDB = [];
let exp_New_Prod = [];
let selectedDateIndex = 0;
let selectedDate = '';
let lastWater = '';
let spezDiet_Visible = false;
let isKeto = false;

let countedPercentNumber = 0;
let originalPercentValue = 0;

let fetched_barcode = '';
let fetched_product_image = '';
let is_fetched_Data = false;

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
const burned_Kcal_Label = document.getElementById('output_Burned');
const messageContainer = document.getElementById("messageContainer");
const message = document.getElementById("message");
const lbl_todayNutri = document.getElementById("lbl_todayNutri");
const outp_nutriScore = document.getElementById("outp_nutriScore");
const foodAmountSingleView = document.getElementById("invisible_ChangeSection_HeuteGegessen");
const modal_new_food = document.getElementById('modal_new_food');
const btn_close_modal = document.getElementById('btn_close_modal');
const btn_close_foodModal = document.getElementById('btn_close_foodModal');
const body = document.getElementById('bdy');
const macro_prev = document.getElementById('macro_prev');
const btn_Save_to_TodayEaten = document.getElementById('btn_Save_to_TodayEaten');
const btn_ChangeMacros = document.getElementById('btn_ChangeMacros');
const btn_openNewModal = document.getElementById('btn_openNewModal');
const btn_gotoPlaner = document.getElementById('btn_gotoPlaner');
const btn_closeDay = document.getElementById('btn_closeDay');
const output_Burned = document.getElementById('output_Burned');
const btnDeleteFoodFromToday = document.getElementById('btnDeleteFoodFromToday');
const btnChangeQuantity = document.getElementById('btnChangeQuantity');
const btn_blendOut_MengeAendern = document.getElementById('btn_blendOut_MengeAendern');
const btn_water_spin_down = document.getElementById('btn_water_spin_down');
const outpWaterButton = document.getElementById('outpWaterButton');
const btn_water_spin_up = document.getElementById('btn_water_spin_up');
const btn_open_scanner = document.getElementById('btn_open_scanner');
const btnStatEffektKcal = document.getElementById('btnStatEffektKcal');
const btnStatSteps = document.getElementById('btnStatSteps');
const btnStatBurnedKcal = document.getElementById('btnStatBurnedKcal');
const btnStatSugar = document.getElementById('btnStatSugar');
const btnStatWater = document.getElementById('btnStatWater');
const btnCarbs = document.getElementById('btnCarbs');
const btnStatFat = document.getElementById('btnStatFat');
const btnStatBallast = document.getElementById('btnStatBallast');
const btnStatProtein = document.getElementById('btnStatProtein');
const btn_send_day = document.getElementById('btn_send_day');
const btn_close_newProd_modal = document.getElementById('btn_close_newProd_modal');
const btn_del_food_from_db = document.getElementById('btn_del_food_from_db');
const btn_add_new_food = document.getElementById('btn_add_new_food');
const inv_Button = document.getElementById('inv_Button');
const btn_makeFieldsInvisible = document.getElementById('btn_makeFieldsInvisible');
const btn_define_Kcal_Target = document.getElementById('btn_define_Kcal_Target');
const btn_define_additional_Target = document.getElementById('btn_define_additional_Target');
const btn_expFoodDB = document.getElementById('btn_expFoodDB');
const btn_export_FoodDB_All = document.getElementById('btn_export_FoodDB_All');
const btn_deleteDayWithoutHistory = document.getElementById('btn_deleteDayWithoutHistory');
const btn_deleteDHistory = document.getElementById('btn_deleteDHistory');
const btn_deleteStatistics = document.getElementById('btn_deleteStatistics');
const submitDiet = document.getElementById('submitDiet');
const modal_load_animation = document.getElementById('modal_load_animation');


let scann_obj = {
    "scann_time": undefined,
    "barcode": ""
}

let weights_obj = {
    last_update: undefined,
    tracks: [],
}

//====================================================================================
//NOTE -   Init
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

function check_Scan() {
    if (localStorage.getItem('storedScan') === null) {
        console.log('storedScan = null');
    } else {
        scann_obj = JSON.parse(localStorage.getItem('storedScan'));
        document.getElementById('inp_Barcode').value = scann_obj.barcode;
        checking_barcode();
    }
}


//====================================================================================
//NOTE -   EventListener
//====================================================================================
// TODO: In Variablen packen und auf Vorhandenheit abfragen
//buttonAdd.addEventListener('click', addProduct); //NOTE - old event listener
buttonAdd.addEventListener('click', () => {
    setTimeout(() => {
        modal_new_food.classList.add('active');
        body.classList.add('prevent-scroll');
    }, 200);
});
btn_close_modal.addEventListener('click', () => {
    modal_new_food.classList.remove('active');
    body.classList.remove('prevent-scroll');
})
btn_close_foodModal.addEventListener('click', () => {
    modal_new_food.classList.remove('active');
    body.classList.remove('prevent-scroll');
})
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
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch((error) => {
            //console.log(error);
        });
    }
}

document.addEventListener('dblclick', () => {
    toggleFullScreen();
});

btn_openNewModal.addEventListener('click', () => {
    open_new_modal();
});

btn_gotoPlaner.addEventListener('click', () => {
    goto_Planer();
});

btn_closeDay.addEventListener('click', () => {
    close_Day();
});

output_Burned.addEventListener('click', () => {
    recordKcal();
});

btnDeleteFoodFromToday.addEventListener('click', () => {
    delete_from_today();
});

btnChangeQuantity.addEventListener('click', () => {
    change_Food_to_TodayList();
});

btn_blendOut_MengeAendern.addEventListener('click', () => {
    blendOut_MengeAendern();
});

btn_water_spin_down.addEventListener('click', () => {
    water_Spin_Down()
});

outpWaterButton.addEventListener('click', () => {
    take_Over_Water()
});

btn_water_spin_up.addEventListener('click', () => {
    water_Spin_Up()
});

btn_open_scanner.addEventListener('click', () => {
    open_scanner()
});

btnStatEffektKcal.addEventListener('click', () => {
    show_EffectKcal()
});

btnStatSteps.addEventListener('click', () => {
    show_Steps()
});

btnStatBurnedKcal.addEventListener('click', () => {
    show_BurnedKcal()
});

btnStatSugar.addEventListener('click', () => {
    show_Sugar()
});

btnStatWater.addEventListener('click', () => {
    show_Water()
});

btnCarbs.addEventListener('click', () => {
    show_Carbs()
});

btnStatFat.addEventListener('click', () => {
    show_Fat()
});

btnStatBallast.addEventListener('click', () => {
    show_Ballast()
});

btnStatProtein.addEventListener('click', () => {
    show_Protein()
});

btn_send_day.addEventListener('click', () => {
    sendThisDay()
});

btn_close_newProd_modal.addEventListener('click', () => {
    close_new_modal()
});

btn_del_food_from_db.addEventListener('click', () => {
    delete_Food_from_DB()
});

btn_add_new_food.addEventListener('click', () => {
    add_new_Food()
});

inv_Button.addEventListener('click', () => {
    calc_Kcal_Goal()
});

btn_makeFieldsInvisible.addEventListener('click', () => {
    makeFieldsInvisible()
});

btn_define_Kcal_Target.addEventListener('click', () => {
    define_Kcal_Target()
});

btn_define_additional_Target.addEventListener('click', () => {
    define_additional_Target()
});

btn_expFoodDB.addEventListener('click', () => {
    export_FoodDB()
});

btn_export_FoodDB_All.addEventListener('click', () => {
    export_FoodDB_All()
});

btn_deleteDayWithoutHistory.addEventListener('click', () => {
    deleteDayWithoutHistory()
});

btn_deleteDHistory.addEventListener('click', () => {
    deleteDHistory()
});

btn_deleteStatistics.addEventListener('click', () => {
    deleteStatistics()
});

submitDiet.addEventListener('click', () => {
    selectDiet()
});



//====================================================================================
//NOTE -   Save,  Load or create DB
//====================================================================================
// Save Food-DB
function saveFood_DB() {
    localStorage.setItem('storedFoodDB', JSON.stringify(array_Food_DB));
}

//Load Food-DB
function loadFood_DB() {
    array_Food_DB = JSON.parse(localStorage.getItem('storedFoodDB'));
    array_Food_DB.sort((a, b) => (a.productName > b.productName ? 1 : -1));
    console.log('array_Food_DB', array_Food_DB);
    createTable_FoodDB();
    check_Scan();
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
        burned_Kcal_Label.innerHTML = burned_Kcal + ' Kcal';
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

    // Gewichte
    if (localStorage.getItem('stored_weights') === null) {
    } else {
        weights_obj = JSON.parse(localStorage.getItem('stored_weights'));
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

    const confirm_save = window.confirm('Soll das Gewicht zum tracken gespeichert werden?')
    if(confirm_save) {
        const new_updateTime = current_timeStamp(new Date());
        const new_weight = new Weight(bodyWeight, new_updateTime);

        if(new_updateTime === weights_obj.last_update) {
            showMessage('Das Gewicht wurde bereits für heute erfasst. Soll der Wert überschrieben werden?', 5000, 'Alert');
            setTimeout(() => {
                const confirm_overwriting = window.confirm("Soll das gespeicherte Gewicht von heute überschrieben werden?");
                if(confirm_overwriting) {
                    //* - Überschreiben
                    const last_index_of_weights = weights_obj.tracks.length - 1;
                    weights_obj.tracks.splice(last_index_of_weights, 1);
                    weights_obj.tracks.push(new_weight);
                    weights_obj.last_update = new_updateTime;
                    localStorage.setItem('stored_weights', JSON.stringify(weights_obj));
                    showMessage('Gewicht gespeichert', 3000, 'Info');
                }
            }, 6000);
        }else {
            weights_obj.tracks.push(new_weight);
            weights_obj.last_update = new_updateTime;
            localStorage.setItem('stored_weights', JSON.stringify(weights_obj));
            showMessage('Gewicht gespeichert', 3000, 'Info');
        }
    }
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
//NOTE -   Scroll Section
//====================================================================================
function scroll_UP() {
    window.scrollTo(0, 0);
    messageContainer.classList.remove("active")
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
    inp.focus();
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
    foodAmountSingleView.classList.remove("active");
    // Disable Schaltflächen
    document.getElementById('btnChangeQuantity').disabled = true;
    document.getElementById('btnDeleteFoodFromToday').disabled = true;
    document.getElementById('foodAmound_Change').disabled = true;

    // Disable SpezDiet
    document.getElementById('spezDietDiv').style.opacity = '0';
    document.getElementById('diet_List').disabled = true;
    submitDiet.disabled = true;
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
    btn_ChangeMacros.disabled = true;
}

//NOTE -   Klasse für Lebensmittel

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
        barcode,
        product_image,
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
        this.barcode = barcode;
        this.product_image = product_image;
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

//NOTE -   Klasse für my_Statistics
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
        repository_Carbs,
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
        this.repository_Carbs = repository_Carbs;
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


class Weight {
    constructor(_weight, _date) {
        this._weight = _weight;
        this._date = _date;
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

function show_Carbs() {
    show_Statisitcs('show_Carbs');
    all_Statistics_Button_UnselectColor('btnCarbs');
}
function show_Ballast() {
    show_Statisitcs('show_Ballast');
    all_Statistics_Button_UnselectColor('btnStatBallast');
}

function show_BurnedKcal() {
    show_Statisitcs('show_BurndedKcal');
    all_Statistics_Button_UnselectColor('btnStatBurnedKcal');
}
function show_Protein() {
    show_Statisitcs('show_Protein');
    all_Statistics_Button_UnselectColor('btnStatProtein');
}

function show_Fat() {
    show_Statisitcs('show_Fat');
    all_Statistics_Button_UnselectColor('btnStatFat');
}

//NOTE - selektieren Button färben
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
    document.getElementById('btnCarbs').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatFat').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatBallast').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById('btnStatProtein').style.backgroundColor =
        'rgb(10, 10, 46)';
    document.getElementById(selectedButtonColorize).style.backgroundColor =
        'rgb(24, 24, 236)';

}

//NOTE -   Erstelle Statistik
function show_Statisitcs(val) {
    let height_Col_1 = 0;
    let height_Col_2 = 0;
    let height_Col_3 = 0;
    let height_Col_4 = 0;
    let height_Col_5 = 0;
    let height_Col_6 = 0;
    let height_Col_7 = 0;
    let zielLatte = kcal_Ziel;
    let currProzent = 0;
    let statistik_Count = my_Statistics.length;
    let val_to_DayBefore = 0;
    let lastDayVal = 0;
    let currentVal = 0;
    let fatSum = 0;

    //Statistik Effektive Kcal
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
        //NOTE - Statistik SCHRITTE
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

        //NOTE - Statistik Zucker
        // >>> Zucker <<<
    } else if (val == 'show_Sugar') {
        document.getElementById('valDescription').innerHTML = 'Zucker';
        document.getElementById('UeberschriftStatisik').innerHTML = 'Zucker -- (Ziel: ' + max_Sugar + ' g)';
        fillingTable("repository_Sugar", max_Sugar, "maxGoal");

        //NOTE - Statistik Kohlenhydr
    } else if (val === "show_Carbs") {
        document.getElementById('valDescription').innerHTML = 'KH';
        document.getElementById('UeberschriftStatisik').innerHTML = 'Kohlenhydrate -- (Ziel: ' + des_Carbs + ' g)';
        fillingTable("repository_Carbs", des_Carbs, "maxGoal");

        //NOTE - Statistik Fett
    } else if (val === 'show_Fat') {
        document.getElementById('valDescription').innerHTML = 'Fett';
        document.getElementById('UeberschriftStatisik').innerHTML = 'Fett -- (Ziel: ' + des_Fat + ' g)';
        fillingTable("repository_Fat", des_Fat, "maxGoal");

        //NOTE - Statistik Ballaststoffe
        // >>> Ballaststoffe <<<
    } else if (val === 'show_Ballast') {
        document.getElementById('valDescription').innerHTML = 'Ballast.';
        document.getElementById('UeberschriftStatisik').innerHTML = 'Ballaststoffe -- (Ziel: Min ' + min_Fiber + ' g)';
        fillingTable("repository_Fiber", min_Fiber, "minGoal");

        //NOTE - Statistik Protein
        // >>> Protein <<<
    } else if (val === 'show_Protein') {
        document.getElementById('valDescription').innerHTML = 'Eiweiß';
        document.getElementById('UeberschriftStatisik').innerHTML = 'Eiweiß -- (Ziel: Min ' + min_Protein + ' g)';
        fillingTable("repository_Protein", min_Protein, "minGoal");

        //NOTE - Statistik Wasser
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

        //NOTE - Statistik Verbrannte KCAL
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
            //animate_StatisticCol(colHeightInPixel, colName);

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

//######################################################################
//NOTE - Funktion um Tabelle mit Werten zu befüllen
//######################################################################

function fillingTable(repositoryPos, goal, min_max_goal) {

    let valueCounter = 0;
    let statistik_Count = my_Statistics.length;
    let currentVal = 0;
    let val_to_DayBefore = 0;
    let lastDayVal = 0;
    let currProzent = 0;

    document.getElementById('valDescrFett').innerHTML = '';
    document.getElementById('outputFatSum').innerHTML = '';

    //NOTE -  Fett ausblenden
    for (let i = 0; i < statistik_Count; i++) {
        document.getElementById('fettInGramm_Col_' + i).innerHTML = '-';
        document.getElementById('fettInGramm_Col_' + i).style.color =
            'white';
    }
    //NOTE - Schleife Werte & Datum
    for (let i = 0; i < statistik_Count; i++) {
        document.getElementById('datum_Col_' + i).innerHTML =
            my_Statistics[i].repository_date
        currentVal = parseFloat(my_Statistics[i][repositoryPos]);
        console.log('Val', my_Statistics[i][repositoryPos]);
        document.getElementById('val_Col_' + i).innerHTML = currentVal;
        valueCounter += currentVal;
        //NOTE + - zum Vortag
        if (i > 0) {
            val_to_DayBefore =
                parseFloat(my_Statistics[i][repositoryPos]) -
                parseFloat(lastDayVal);
            document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                val_to_DayBefore.toFixed(1) + ' g';
            lastDayVal = parseFloat(my_Statistics[i][repositoryPos]);
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
            lastDayVal = parseFloat(my_Statistics[i][repositoryPos]);
            document.getElementById('change_DayBefore_Col_' + i).innerHTML =
                val_to_DayBefore;
        }

        // Diagramm
        currProzent = (parseFloat(my_Statistics[i][repositoryPos]) * 100) / goal;
        let colHeightInPixel = (currProzent * 500) / 100;
        if (colHeightInPixel > 1000) {
            document.getElementById('COL_Dia_' + i).style.height = '1000px';
            document.getElementById('COL_Dia_' + i).innerText = my_Statistics[i][repositoryPos] + ' 🚀';
        } else {
            document.getElementById('COL_Dia_' + i).style.height = colHeightInPixel + 'px';
            document.getElementById('COL_Dia_' + i).innerText = my_Statistics[i][repositoryPos]
        }

        if (min_max_goal === "minGoal") {
            // Balken färben
            if (currentVal < goal && currentVal < goal * 1.1) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor = 'yellow';
            } else if (currentVal < goal) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor = 'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor = 'rgb(43, 161, 43)';
            }
        } else {
            // Balken färben
            if (currentVal > goal && currentVal < goal * 1.1) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'yellow';
            } else if (currentVal > goal) {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'red';
            } else {
                document.getElementById('COL_Dia_' + i).style.backgroundColor =
                    'rgb(43, 161, 43)';
            }
        }

    }

    document.getElementById('outputFatSum').innerHTML =
        valueCounter.toFixed(1) +
        'g (' +
        (valueCounter / statistik_Count).toFixed(1) +
        'g/Tag)';
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
        showMessage('Wassermenge um 0,25 L korrigiert', 5000)
    } else {
        showMessage(`${new_Water} L Wasser wurden hinzugefügt`, 5000)
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
//NOTE -  Schritte PopUp
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
        save_Today_Steps();
    } catch (error) {
        showMessage('Nur Zahlen eingeben', 5000, 'Alert');
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
    burned_Kcal_Label.innerHTML = burned_Kcal + ' Kcal';
    calc_Values();
}

//============================================================================
//NOTE -   Kcal manuell eintragen
//============================================================================
function recordKcal() {
    var new_Kcal = Number(window.prompt("Trage hier abweichende Kcal ein:", burned_Kcal));

    if (new_Kcal && new_Kcal !== isNaN) {
        if (new_Kcal != burned_Kcal) {
            burned_Kcal = parseInt(new_Kcal);
            burned_Kcal_Label.innerHTML = burned_Kcal + ' Kcal';
            save_Burned_Kcal();
            calc_Values();
        }
    }
}

//============================================================================
//NOTE -   Food Datenbank Tabelle
//============================================================================

function createTable_FoodDB() {
    // CREATE HTML TABLE OBJECT
    var perrow = 1, // 1 CELLS PER ROW
        table = document.createElement('table'),
        row = table.insertRow();
    // LOOP THROUGH ARRAY AND ADD TABLE CELLS
    for (var i = 0; i < array_Food_DB.length; i++) {
        // ADD "BASIC" CELL
        const short_product_name = cut_product_name(array_Food_DB[i].productName, 45)
        var cell = row.insertCell();
        cell.innerHTML = short_product_name;

        // Anzahl der Produkte
        let anzProd = array_Food_DB.length;
        document.getElementById('titleDatenbank').innerHTML =
            'Datenbank (' + anzProd + ')';

        // ATTACH A RUNNING NUMBER OR CUSTOM DATA
        cell.dataset.id = i;

        // Produktauswahl
        cell.addEventListener('click', function () {
            foodFromToday = false;
            macro_prev.innerHTML = '';
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
//NOTE -   Suche
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
            const short_product_name = cut_product_name(data[i].productName, 45)
            var cell = row.insertCell();
            cell.innerHTML = short_product_name;

            // Für Auswahl
            cell.dataset.id = i;

            cell.addEventListener('click', function () {
                foodFromToday = false;
                macro_prev.innerHTML = '';
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
    inputField_EatenFood_in_Gramm.value = ''
    btn_ChangeMacros.disabled = false;
}


//============================================================================
//NOTE -  Nutri Score
//============================================================================

function show_NutriScore(choosenProduct) {
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
    let badPoints = 0;
    let goodPoints = 0;
    let calcAmound = 100;
    let check_Kcal = parseInt((calcAmound * selected_Food.kcal) / 100);
    let check_Sugar = parseFloat((calcAmound * selected_Food.sugar) / 100);
    let check_Salt = parseFloat((calcAmound * selected_Food.salt) / 100);
    let check_Protein = parseFloat((calcAmound * selected_Food.protein) / 100);
    let check_Fiber = parseFloat((calcAmound * selected_Food.fiber) / 100);
    let check_Carbs = parseFloat((calcAmound * selected_Food.carbs) / 100); // Not for nutri score, but for product hints 

    //* Product hint on product select
    product_hints(check_Carbs, check_Sugar, check_Salt, check_Fiber, check_Protein);

    if (choosenProduct !== undefined) {
        check_Kcal = parseInt((calcAmound * choosenProduct.kcal) / 100);
        check_Sugar = parseFloat((calcAmound * choosenProduct.sugar) / 100);
        check_Salt = parseFloat((calcAmound * choosenProduct.salt) / 100);
        check_Protein = parseFloat((calcAmound * choosenProduct.protein) / 100);
        check_Fiber = parseFloat((calcAmound * choosenProduct.fiber) / 100);
    }

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
    let nutriScore = 0;
    let nutriScoreChar = '';
    let color = '';

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
        // optAreaDB.style.backgroundColor = 'rgb(87, 2, 2)';
    } else if (nutriScoreVal > 11) {
        nutriScore = 4;
        document.getElementById('C_D').style.height = '120px';
        nutriScoreChar = 'D';
        color = 'orange';
        // optAreaDB.style.backgroundColor = 'rgb(81, 54, 3)';
    } else if (nutriScoreVal > 3) {
        nutriScore = 3;
        document.getElementById('C_C').style.height = '120px';
        nutriScoreChar = 'C';
        color = 'yellow';
        // optAreaDB.style.backgroundColor = 'rgb(94, 94, 1)';
    } else if (nutriScoreVal >= 0) {
        nutriScore = 2;
        document.getElementById('C_B').style.height = '120px';
        nutriScoreChar = 'B';
        color = 'lightgreen';
        // optAreaDB.style.backgroundColor = 'rgb(60, 106, 60)';
    } else if (nutriScoreVal < 0) {
        nutriScore = 1;
        document.getElementById('C_A').style.height = '120px';
        nutriScoreChar = 'A';
        color = 'green';
        // optAreaDB.style.backgroundColor = 'rgb(2, 65, 2)';
    }

    return nutriScore;
}

//* ANCHOR - product_hints when selectign a product
function product_hints(carbs, sugar, salt, fiber, protein) {
    let hint_container = document.getElementById('hints');

    // Carbs
    let carbHint = document.createElement('div');
    carbHint.classList.add('hint-item');
    if (carbs > 20) {
        carbHint.innerHTML = 'Viel Kohlenhydrate';
        carbHint.style.backgroundColor = 'darkred'
    }
    if (carbs >= 3 && carbs <= 20) {
        carbHint.innerHTML = 'Low Carb geeignet';
        carbHint.style.backgroundColor = 'grey'
    }
    if (carbs < 3) {
        carbHint.innerHTML = 'Keto geeignet';
        carbHint.style.backgroundColor = 'green'
    }

    // Salt
    let saltHint = document.createElement('div');
    saltHint.classList.add('hint-item');
    if (salt > 0.6) {
        saltHint.innerHTML = 'Zu viel Salz';
        saltHint.style.backgroundColor = 'darkred'
    }
    if (salt >= 0.2 && salt <= 0.6) {
        saltHint.innerHTML = 'Mäßig gesalzen';
        saltHint.style.backgroundColor = 'grey'
    }
    if (salt < 0.2) {
        saltHint.innerHTML = 'Wenig Salz';
        saltHint.style.backgroundColor = 'green'
    }

    // Protein
    let proteinHint = document.createElement('div');
    proteinHint.classList.add('hint-item');
    if (protein > 10) {
        proteinHint.innerHTML = 'Viel Eiweiß';
        proteinHint.style.backgroundColor = 'green'
    }
    if (protein >= 5 && protein <= 10) {
        proteinHint.innerHTML = 'Mäßig Eiweiß';
        proteinHint.style.backgroundColor = 'grey'
    }
    if (protein < 5) {
        proteinHint.innerHTML = 'Wenig Eiweiß';
        proteinHint.style.backgroundColor = 'darkred'
    }

    // Fiber
    let fiberHint = document.createElement('div');
    fiberHint.classList.add('hint-item');
    if (fiber > 4) {
        fiberHint.innerHTML = 'Viel Ballaststoffe';
        fiberHint.style.backgroundColor = 'green'
    }
    if (fiber >= 2 && fiber <= 4) {
        fiberHint.innerHTML = 'Mäßig Ballaststoffe';
        fiberHint.style.backgroundColor = 'grey'
    }
    if (fiber < 2) {
        fiberHint.innerHTML = 'Wenig Ballaststoffe';
        fiberHint.style.backgroundColor = 'darkred'
    }

    // Sugar
    let sugarHint = document.createElement('div');
    sugarHint.classList.add('hint-item');
    if (sugar > 15) {
        sugarHint.innerHTML = 'Viel Zucker';
        sugarHint.style.backgroundColor = 'darkred'
    }
    if (sugar >= 5 && sugar <= 15) {
        sugarHint.innerHTML = 'Mäßig Zucker';
        sugarHint.style.backgroundColor = 'grey'
    }
    if (sugar < 5) {
        sugarHint.innerHTML = 'Wenig Zucker';
        sugarHint.style.backgroundColor = 'green'
    }

    hint_container.innerHTML = '';
    hint_container.appendChild(carbHint)
    hint_container.appendChild(saltHint)
    hint_container.appendChild(proteinHint)
    hint_container.appendChild(fiberHint)
    hint_container.appendChild(sugarHint)
}

//============================================================================
//NOTE -  Average Nutri Score
//============================================================================
function averageNutriScore() {
    let nutriArray = [];

    // Array mit Score Werten befüllen
    for (let i = 0; i < today_eaten.length; i++) {
        selectedFoodIndex = indexOfFood(today_eaten[i].intake_productName);
        selected_Food = array_Food_DB[selectedFoodIndex];
        nutriArray.push(show_NutriScore());
    }

    // Durchschnitt berechnen
    let averageVal = 0;
    let sum = 0;
    const nutriArrayAmount = nutriArray.length;
    for (let j = 0; j < nutriArray.length; j++) {
        sum += nutriArray[j];
    }
    averageVal = parseInt(sum / nutriArrayAmount);

    // Wert abbilden
    if (averageVal > 0) {
        lbl_todayNutri.classList.add("active");
        switch (averageVal) {
            case 1:
                outp_nutriScore.innerHTML = 'A';
                outp_nutriScore.style.backgroundColor = 'green';
                outp_nutriScore.style.color = 'white';
                break;
            case 2:
                outp_nutriScore.innerHTML = 'B';
                outp_nutriScore.style.backgroundColor = 'lightgreen';
                outp_nutriScore.style.color = 'black';
                break;
            case 3:
                outp_nutriScore.innerHTML = 'C';
                outp_nutriScore.style.backgroundColor = 'yellow';
                outp_nutriScore.style.color = 'black';
                break;
            case 4:
                outp_nutriScore.innerHTML = 'D';
                outp_nutriScore.style.backgroundColor = 'orange';
                outp_nutriScore.style.color = 'white';
                break;
            case 5:
                outp_nutriScore.innerHTML = 'E';
                outp_nutriScore.style.backgroundColor = 'red';
                outp_nutriScore.style.color = 'white';
                break;

            default:
                break;
        }
    }

    // Reset
    resetNutriScore();
}

function indexOfFood(food) {
    for (let i = 0; i < array_Food_DB.length; i++) {
        if (array_Food_DB[i].productName === food) {
            return i;
        }
    }
}

//============================================================================
//NOTE -  Reset Nutri Score
//============================================================================
function resetNutriScore() {
    selected_Food = '';
    document.getElementById('C_A').style.height = '60px';
    document.getElementById('C_B').style.height = '60px';
    document.getElementById('C_C').style.height = '60px';
    document.getElementById('C_D').style.height = '60px';
    document.getElementById('C_E').style.height = '60px';
}

//============================================================================
//NOTE -   Event Listener for Food Amount
//============================================================================
inputField_EatenFood_in_Gramm.addEventListener('input', () => {
    const current_Food = selected_Food;
    const quantity = inputField_EatenFood_in_Gramm.value;
    let macroArr = [];

    class MakroPrev {
        constructor(name, val) {
            this.name = name,
                this.val = val
        }
    }

    macroArr.push(new MakroPrev('Kcal: ', parseInt(quantity * current_Food.kcal / 100)))
    macroArr.push(new MakroPrev('Fett: ', parseFloat(quantity * current_Food.fat / 100).toFixed(1)))
    macroArr.push(new MakroPrev('KH: ', parseFloat(quantity * current_Food.carbs / 100).toFixed(1)))
    macroArr.push(new MakroPrev('Zck: ', parseFloat(quantity * current_Food.sugar / 100).toFixed(1)))
    macroArr.push(new MakroPrev('Bal.: ', parseFloat(quantity * current_Food.fiber / 100).toFixed(1)))
    macroArr.push(new MakroPrev('Eiw.: ', parseFloat(quantity * current_Food.protein / 100).toFixed(1)))
    macroArr.push(new MakroPrev('Salz: ', parseFloat(quantity * current_Food.salt / 100).toFixed(1)))

    macro_prev.innerHTML = '';
    macroArr.forEach((makro) => {
        let makro_bubble = document.createElement('div');
        makro_bubble.innerHTML = makro.name + ' ' + makro.val;
        makro_bubble.classList.add('makro-bubble');
        macro_prev.appendChild(makro_bubble);
    })


    product_hints(parseFloat(quantity * current_Food.carbs / 100).toFixed(1),
        parseFloat(quantity * current_Food.sugar / 100).toFixed(1),
        parseFloat(quantity * current_Food.salt / 100).toFixed(1),
        parseFloat(quantity * current_Food.fiber / 100).toFixed(1),
        parseFloat(quantity * current_Food.protein / 100).toFixed(1));

})

//============================================================================
//NOTE -   Food zu heute gegessen hinzufügen
//============================================================================
btn_Save_to_TodayEaten.addEventListener('click', () => {
    add_Food_to_TodayList();
});

function add_Food_to_TodayList() {
    //Produkt nicht "", also ausgewählt
    if (selected_Food != '') {
        if (inputField_EatenFood_in_Gramm.value == '') {
            showMessage(`Bitte eine Menge eingeben`, 10000, 'Alert')
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
                const intakeFoodInfo = `${newProduct} wurde hinzugefügt mit: <br> 
                    Kcal: ${kcal_Intake} Kcal <br>
                    Fett: ${parseInt(fat_Intake)}g <br>
                    Kohlenhydrate: ${parseInt(carb_Intake)}g <br> 
                    Zucker: ${parseInt(sugar_Intake)}g <br>
                    Ballaststoffe: ${parseInt(fiber_Intake)}g <br>
                    Eiweiss: ${parseInt(protein_Intake)}g <br>
                    Salz: ${parseInt(salt_Intake)}g <br> <br>`

                showMessage(`${intakeFoodInfo}`, 10000, 'Info');
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
            } catch (error) { }
        }
    } else {
        showMessage(`Konnte nicht gespeichert werden.  \n  1. Produkt auswählen.  \n  2. Eine Menge eingeben. \n  3. Auf speichern klicken`, 5000, 'Alert');
    }
    create_Table_TodayEaten();
    calc_Values();
}


//============================================================================
//NOTE -  Tabelle für Heute gegessen
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
        const short_product_name = cut_product_name(today_eaten[i].intake_productName, 40);
        var cell = row.insertCell();
        cell.innerHTML =
            short_product_name +
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
            foodAmountSingleView.classList.add("active");
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
                ' <br/>  Fett: ' +
                selected_Food.intake_fat.toFixed(1) +
                'g <br/>  Eiweiß: ' +
                selected_Food.intake_protein.toFixed(1) +
                'g <br/>  Kohlenhydrate: ' +
                selected_Food.intake_carbs.toFixed(1) +
                'g <br/>  Zucker: ' +
                selected_Food.intake_sugar.toFixed(1) +
                'g <br/>  Ballaststoffe: ' +
                selected_Food.intake_fiber.toFixed(1) +
                'g <br/>  Salz:  ' +
                selected_Food.intake_salt.toFixed(1) +
                'g';

            let nutri;
            for (let i = 0; i < array_Food_DB.length; i++) {
                if (array_Food_DB[i].productName === selected_Food.intake_productName) {
                    const choosenProduct = array_Food_DB[i];
                    nutri = show_NutriScore(choosenProduct);
                    if (nutri === 1) nutri = 'Nutriscore: A';
                    if (nutri === 2) nutri = 'Nutriscore: B';
                    if (nutri === 3) nutri = 'Nutriscore: C';
                    if (nutri === 4) nutri = 'Nutriscore: D';
                    if (nutri === 5) nutri = 'Nutriscore: E';
                    break;
                }
            }
            calcSingle = calcSingle + ' <br/> ' + nutri;
            document.getElementById('output_SingleMacros').innerHTML = calcSingle;
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

//* ANCHOR - Func to short string value
function cut_product_name(val, length) {
    let return_val = '';
    try {
        for (let i = 0; i < val.length; i++) {
            if (i < (length - 3)) {
                return_val = return_val + val[i];
            } else {
                return_val = return_val + '...';
                break
            }
        }

        return return_val;

    } catch (error) {
        console.log(error);
    }
}

//============================================================================
//NOTE -  Menge ändern
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
        showMessage(`Menge wurde geändert`, 3000, 'Info');
        blendOut_MengeAendern();
    }
}

//============================================================================
//NOTE -  Lösche Position
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
        showMessage(`Kein Produkt ausgewählt`, 4000, 'Alert');
    }
}

//============================================================================
//NOTE - Berechnung der Makros und Kcal Werte
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
    burned_Kcal_Label.innerHTML = burned_Kcal + ' Kcal';

    if (diff > 0) {
        document.getElementById('output_Diff').innerHTML =
            diff + ' Kcal übrig';
    } else {
        document.getElementById('output_Diff').innerHTML =
            Math.abs(diff) + ' Kcal zu viel';
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
    averageNutriScore();
}


//============================================================================
//NOTE -  Progress Bar
//============================================================================
let radius = progressCircle.r.baseVal.value;
let circumference = radius * 2 * Math.PI;
progressCircle.style.strokeDasharray = circumference;

function setProgress(percent) {
    progressCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
}

function initChangeProgress(originalPercentValue, circlePercentValue) {
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

function burned_Kcal_in_Fat() {
    // Fett in Gramm
    let trueDifferenz = kcal_Requirement - parseInt(effective_Kcal);
    let kcal_in_Gramm = parseInt((trueDifferenz * 1000) / 7000);
    let returnVal = '';
    if (kcal_in_Gramm < 0) {
        returnVal = '+' + Math.abs(kcal_in_Gramm) + ' g Fett';
    } else {
        returnVal = '-' + kcal_in_Gramm + ' g Fett';
    }

    return returnVal;
}

function showTargets() {
    // Blende die Ziele ein
    burned_Kcal_Label.innerHTML = burned_Kcal_in_Fat();
    carbLabel.innerHTML = `${eaten_Carbs.toFixed(1)} / Max ${des_Carbs}`;
    sugarLabel.innerHTML = `${eaten_Sugar.toFixed(1)} / Max ${max_Sugar}`;
    proteinLabel.innerHTML = `${eaten_Protein.toFixed(1)} / Min ${min_Protein}`;
    fatLabel.innerHTML = `${eaten_Fat.toFixed(1)} / Max ${des_Fat}`;
    fiberLabel.innerHTML = `${eaten_Fiber.toFixed(1)} / Min ${min_Fiber}`;
    saltLabel.innerHTML = `${eaten_Salt.toFixed(1)} / Max ${max_Salt}`;
}

//============================================================================
//NOTE -  Färbung der Label je nach Fortschritt
//============================================================================

function coloring_Labels() {
    step_Progress();
    if (theme !== "light") {
        effectiveKcal_Progress();
        kalorienBilanz_Progress();
        colorizeTargetProgress();
    }
    macro_progress();
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

    //* sugar
    if (eaten_Sugar >= max_Sugar) {
        sugarLabel.style.color = 'red';
    } else {
        sugarLabel.style.color = 'rgb(27, 206, 27)';
    }

    //* Salt salt_progress
    if (eaten_Salt >= max_Salt) {
        saltLabel.style.color = 'red';
    } else {
        saltLabel.style.color = 'rgb(27, 206, 27)';
    }

    //* protein_progress
    if (eaten_Protein < min_Protein) {
        proteinLabel.style.color = 'red';
    } else {
        proteinLabel.style.color = 'rgb(27, 206, 27)';
    }

    //* Fiber 
    if (eaten_Fiber < min_Fiber) {
        fiberLabel.style.color = 'red';
    } else {
        fiberLabel.style.color = 'rgb(27, 206, 27)';
    }

    //* Carbs
    if (eaten_Carbs > des_Carbs) {
        carbLabel.style.color = 'red';
    } else {
        carbLabel.style.color = 'rgb(27, 206, 27)';
    }

    //* Fat fat_progress

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

function macro_progress() {
    //* sugar
    const sugar_progress = eaten_Sugar * 100 / max_Sugar;
    document.getElementById('sugar_progress').style.width = `${sugar_progress}%`;

    //* Salt salt_progress
    const salt_progress = eaten_Salt * 100 / max_Salt;
    document.getElementById('salt_progress').style.width = `${salt_progress}%`;

    //* protein_progress
    const protein_progress = eaten_Protein * 100 / min_Protein;
    document.getElementById('protein_progress').style.width = `${protein_progress}%`;

    //* Fiber 
    const fiber_progress = eaten_Fiber * 100 / min_Fiber;
    document.getElementById('fiber_progress').style.width = `${fiber_progress}%`;

    //* Carbs
    const carb_progress = eaten_Carbs * 100 / des_Carbs;
    document.getElementById('carbs_progress').style.width = `${carb_progress}%`;

    //* Fat fat_progress
    const fat_progress = eaten_Fat * 100 / des_Fat;
    document.getElementById('fat_progress').style.width = `${fat_progress}%`;
}

//============================================================================
//NOTE -  Einstellungen
//============================================================================

//============================================================================
//NOTE -  Kcal Ziel berechnen
//============================================================================
function calc_Kcal_Goal() {
    let height = 0;
    let age = 0;
    let targetWeight = 0;
    let targetTime = 0;
    let heightForBmi = 0.0;
    let ausg = '';

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
        showMessage(`Bitte eine Auswahl bei Geschlecht treffen`, 4000, 'Alert');
    } else {
        // Gewicht
        if (document.getElementById('weight').value == '') {
            showMessage(`Bitte das Feld Gewicht ausfüllen`, 4000, 'Alert');
        } else {
            bodyWeight = document.getElementById('weight').value;
            save_BodyWeight();

            // Größe
            if (document.getElementById('height').value == '') {
                showMessage(`Bitte das Feld Größe ausfüllen`, 4000, 'Alert');
            } else {
                height = document.getElementById('height').value;
                // Aus Centimeter Meter erstellen
                for (let i = 0; i < height.length; i++) {
                    if (i === 1) {
                        heightForBmi = heightForBmi + '.';
                        heightForBmi = heightForBmi + height[i];
                    } else {
                        heightForBmi = heightForBmi + height[i];
                    }
                }
                heightForBmi = parseFloat(heightForBmi);

                // Alter
                if (document.getElementById('age').value == '') {
                    showMessage(`Bitte das Feld Alter ausfüllen`, 4000, 'Alert');
                } else {
                    age = document.getElementById('age').value;

                    // Zielgewicht
                    if (document.getElementById('target_Weight').value == '') {
                        showMessage(`Bitte das Feld Alter ausfüllen`, 4000, 'Alert');
                    } else {
                        targetWeight =
                            document.getElementById('target_Weight').value;

                        // Zielzeit
                        if (
                            document.getElementById('target_Time').value == ''
                        ) {
                            showMessage(`Bitte das Feld Zeitraum ausfüllen`, 4000, 'Alert');
                        } else {
                            targetTime =
                                document.getElementById('target_Time').value;

                            //! Berechnung Kalorienbedarf
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

                                ausg =
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

                                ausg =
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


                            //! BMI Berechnung
                            let heightTimes2 = heightForBmi * heightForBmi;
                            let bmi = parseFloat(bodyWeight / heightTimes2);

                            let bmi_result = '';

                            if (bmi >= 40) {
                                bmi_result = `Adipositas Grad 3 - BMI: ${parseInt(bmi)}`;
                            } else if (bmi >= 35 && bmi <= 39.9) {
                                bmi_result = `Adipositas Grad 2 - BMI: ${parseInt(bmi)}`;
                            } else if (bmi >= 30 && bmi <= 34.9) {
                                bmi_result = `Adipositas Grad 1 - BMI: ${parseInt(bmi)}`;
                            } else if (bmi >= 25 && bmi <= 29.9) {
                                bmi_result = `Übergewicht - BMI: ${parseInt(bmi)}`;
                            } else if (bmi >= 18.5 && bmi <= 24.9) {
                                bmi_result = `Normalgewichtig - BMI: ${parseInt(bmi)}`;
                            } else if (bmi < 18.5) {
                                bmi_result = `Untergewichtig - BMI: ${parseInt(bmi)}`;
                            }

                            ausg = ausg + '<br/>' + 'BMI Ergebnis:' + '<br/>' + bmi_result;
                            document.getElementById('output_Kcal_Req').innerHTML = 'Du hast einen Kalorienbedarf von ' + kcal_Requirement + ' Kcal pro Tag. ' + ausg;

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
        showMessage(`Kein Wert enthalten`, 4000, 'Alert');
    } else {
        kcal_Ziel = parseInt(document.getElementById('target_KcalZiel').value);
        save_kcalZiel();
        showMessage(`Kcal Ziel wurde übernommen`, 4000, 'Info');
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 4000);
        setTimeout(() => {
            location.reload();
        }, 6000);
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

    showMessage(`Ziele wurden übernommen`, 4000, 'Info');
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
        submitDiet.disabled = false;
        spezDiet_Visible = true;
    } else {
        document.getElementById('spezDietDiv').style.opacity = '0';
        document.getElementById('diet_List').disabled = true;
        submitDiet.disabled = true;
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
    console.log('Feffe');
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
        showMessage(`Es ist nicht unbedingt empfohlen, mehr als 1.5 g Protein pro Kg Körpergewicht zu essen. Mit: ' +
        protein_in_Gramm +
        ' g liegst du ' +
        proteinDiff +
        ' g darüber. Ich ändere die Eiweißmenge ab und schreibe dir ' +
        addedFat +
        ' g Fett gut :)`, 4000, 'Alert');
        document.getElementById('target_Fat').value = fat_in_Gramm;
        document.getElementById('target_Protein').value = protein_in_Gramm;
    }
}

//============================================================================
//NOTE -  Tag abschließen
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
                        todayCarbs,
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
                        todayCarbs,
                    ),
                );
                show_Statisitcs('show_Effekctive_Kcal');
            }

            // SPEICHERN DER WERTE
            save_Statistics();

            // RESET
            today_Steps = 0;
            today_eaten = [];
            today_Water = 2;
            burned_Kcal = 0;
            lastWater = '';
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

            showMessage(`Tag wurde erfolgreich zurückgesetzt. Die Werte kannst du Dir im Statistikbereich anschauen.`, 4000, 'Info');
            setTimeout(() => {
                location.reload();
            }, 2500);
        }
    }
}

//============================================================================
//NOTE -  Datum erzeugen
//============================================================================

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
        inv_Button.style.opacity = '1';
        form_is_Invisible = false;
    } else {
        document.getElementById('visibility').style.opacity = '0';
        inv_Button.style.opacity = '0';
        form_is_Invisible = true;
        // TODO SPEICHERN DES STATUS UND 78 KG GEWICHT SPEICHERN
        ///////////
    }
}

//* ANCHOR Open and close Modal for new Product
let modal_is_open = false;

function open_new_modal() {
    if (modal_is_open === false) {
        document.getElementById('modal_newProduct').classList.add('active');
        modal_is_open = true;
    }
}

function close_new_modal() {
    if (modal_is_open === true) {
        document.getElementById('modal_newProduct').classList.remove('active');
        modal_is_open = false;
    }
}

//============================================================================
//NOTE -   Neues Lebensmittel hinzufügen
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
    let new_barcode = null;
    let new_product_image = null;

    // Produktname
    if (document.getElementById('inp_Productname').value == '') {
        showMessage(`Bitte die Textbox für den Produktnamen ausfüllen`, 4000, 'Alert');
    } else {
        new_productName = document.getElementById('inp_Productname').value;

        // Kcal
        if (document.getElementById('inp_Kcal').value == '') {
            showMessage(`Bitte die Textbox für Kcal ausfüllen`, 4000, 'Alert');
        } else {
            new_Kcal = document.getElementById('inp_Kcal').value;

            // Fett
            if (document.getElementById('inp_Fat').value == '') {
                showMessage(`Bitte die Textbox für Fett ausfüllen`, 4000, 'Alert');
            } else {
                new_Fat = document.getElementById('inp_Fat').value;
                new_Fat.replace(',', '.');
                parseFloat(new_Fat);
                // Kohlenhydrate
                if (document.getElementById('inp_Carbs').value == '') {
                    showMessage(`Bitte die Textbox für Kohlenhydrate ausfüllen`, 4000, 'Alert');
                } else {
                    new_Carbs = document.getElementById('inp_Carbs').value;
                    new_Carbs.replace(',', '.');
                    parseFloat(new_Carbs);

                    // Zucker
                    if (document.getElementById('inp_Sugar').value == '') {
                        showMessage(`Bitte die Textbox für Zucker ausfüllen`, 4000, 'Alert');
                    } else {
                        new_Sugar = document.getElementById('inp_Sugar').value;
                        new_Sugar.replace(',', '.');
                        parseFloat(new_Sugar);

                        // Ballaststoffe
                        if (document.getElementById('inp_Fiber').value == '') {
                            showMessage(`Bitte die Textbox für Ballaststoffe ausfüllen`, 4000, 'Alert');
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
                                showMessage(`Bitte die Textbox für Eiweiß ausfüllen`, 4000, 'Alert');
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
                                    showMessage(`Bitte die Textbox für Salz ausfüllen`, 4000, 'Alert');
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
                                        showMessage(`Bitte die Textbox für Mengeneinheit ausfüllen`, 4000, 'Alert');
                                    } else {
                                        new_Unit =
                                            document.getElementById(
                                                'inp_Unit',
                                            ).value + '| Eintrag: ' + current_timeStamp();

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

                                        new_barcode = document.getElementById('inp_barcode').value;
                                        new_product_image = document.getElementById('inp_imgLink').value;

                                        //* For new Product Fields Barcode and img url
                                        if (is_fetched_Data === true) {
                                            is_fetched_Data = false;
                                            new_barcode = fetched_barcode;
                                            new_product_image = fetched_product_image;
                                        }


                                        //TODO - Speichern
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
                                                    new_barcode,
                                                    new_product_image,
                                                ),
                                            );

                                            showMessage(`Lebensmittel wurde gespeichert :)`, 4000, 'Info');
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
                                            //* SAVE
                                            // SAVE
                                            if (new_barcode.length > 7) {
                                                scann_obj.barcode = new_barcode;
                                                localStorage.setItem('storedScan', JSON.stringify(scann_obj));
                                            }
                                            saveFood_DB();

                                            //* Aufräumen
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
                                            setTimeout(() => {
                                                location.reload();
                                            }, 2500);
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
                                                        new_barcode,
                                                        new_product_image
                                                    ),
                                                );
                                                showMessage(`Lebensmittel wurde erfolgreich angepasst`, 4000, 'Info');
                                                // SAVE
                                                if (new_barcode.length > 7) {
                                                    scann_obj.barcode = new_barcode;
                                                    localStorage.setItem('storedScan', JSON.stringify(scann_obj));
                                                }
                                                saveFood_DB();

                                                setTimeout(() => {
                                                    location.reload();
                                                }, 2500);

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

function current_timeStamp() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const timestamp = `${addZero(day)}.${addZero(month)}.${year}`
    return timestamp;
}



//============================================================================
//NOTE -   Makros in der Datenbank ändern
//============================================================================

btn_ChangeMacros.addEventListener('click', () => {
    changeMacros();
});

function changeMacros() {
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
    if (selected_Food.barcode) {
        document.getElementById('inp_barcode').value = selected_Food.barcode;
    }
    document.getElementById('inp_imgLink').value = selected_Food.product_image;
    open_new_modal();
}

//============================================================================
//NOTE -   Produkt aus Datenbank löschen
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
            showMessage(`Lebensmittel wurde gelöscht`, 4000, 'Info');
            setTimeout(() => {
                location.reload();
            }, 4500);
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
    showMessage(`${text}`, 20000, 'Info');
    window.scrollTo(0, 12300);
}

//============================================================================
//NOTE -   Theme
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
//NOTE -   Exportiere Daten
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
            let potNewProduct = '';
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
    let potNewProduct = ''
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
//NOTE -   History
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
//NOTE -   Den ausgewählten Tag per Mail versenden
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

function deleteDayWithoutHistory() {
    today_Steps = 0;
    today_eaten = [];
    today_Water = 0;
    burned_Kcal = 0;
    lastWater = 'Gestern';
    save_Burned_Kcal();
    save_Last_Water();
    document.getElementById('btnSteps').innerHTML = today_Steps + ' &#128095';
    document.getElementById('lastWater').innerHTML = 'Zuletzt: ';
    coloring_Labels();
    steps_into_Kcal();
    calc_Values();
    save_Today_Steps();
    save_Today_Eaten();
    save_Today_Water();
    showMessage(`Tag wurde erfolgreich zurückgesetzt. Die Werte wurden nicht abgespeichert.`, 4000, 'Info');
    setTimeout(() => {
        location.reload();
    }, 4500);
}

//
//
function deleteDHistory() {
    const deleteRequest = window.confirm(
        'Soll die komplette Historie gelöscht werden?',
    );
    if (deleteRequest) {
        my_History = [];
        save_History();
        location.reload();
    }
}

function deleteStatistics() {
    const deleteRequest = window.confirm(
        'Soll die komplette Statistik gelöscht werden?',
    );
    if (deleteRequest) {
        my_Statistics = [];
        save_Statistics();
        location.reload();
    }
}






// Hide Messagebox on click
messageContainer.addEventListener('click', () => {
    messageContainer.classList.remove("active")
})

// setTimeout(() => {
//     showMessage(`Willkommen zurück 😀`, 3000, 'Info');
// }, 4000);


////////////////////////////////
//ANCHOR - Open Scanner
////////////////////////////////
function open_scanner() {
    window.location = 'scanner.html';
}

////////////////////////////////
//ANCHOR - API Fetch 
////////////////////////////////

const fetch_button = document.getElementById('submit_to_food_db');
const inp_Barcode = document.getElementById('inp_Barcode');

if (fetch_button) {
    fetch_button.addEventListener('click', () => {
        checking_barcode();
    })
}

function checking_barcode() {
    //* Show Animation
    modal_load_animation.classList.add('active');
    //* Remove transmitted barcode from local storage
    localStorage.removeItem('storedScan');
    //* If inputfield has value
    if (inp_Barcode.value !== '') {
        //* Check if barcode already exists
        let barcode_found_in_db = false;
        let productname = ''
        try {
            for (let i = 0; i < array_Food_DB.length; i++) {
                if (array_Food_DB[i].barcode === inp_Barcode.value) {
                    barcode_found_in_db = true;
                    productname = array_Food_DB[i].productName;
                    //* Remove Animation
                    modal_load_animation.classList.remove('active');
                    break;
                }
            }
        } catch (error) {
            console.log(error);
            //* Remove Animation
            modal_load_animation.classList.remove('active');
        }
        //* If barcode not found in DB - Fetch Data
        if (barcode_found_in_db === false) {
            fetchProductData(inp_Barcode.value);
        } else {
            //* Remove Animation
            modal_load_animation.classList.remove('active');
            close_new_modal();
            modal_new_food.classList.add('active');
            body.classList.add('prevent-scroll');
            document.getElementById('searchInput').value = productname;
            var searchterm = searchTable(document.getElementById('searchInput').value, array_Food_DB);
            buildTable(searchterm);
        }
    }
}

async function fetchProductData(ean_code) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${ean_code}.json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            //* Remove Animation
            modal_load_animation.classList.remove('active');
            throw new Error(`Fehler beim Abrufen der Daten. Statuscode: ${response.status}`);
        }

        //* Remove Animation
        modal_load_animation.classList.remove('active');
        const data = await response.json();
        console.log('Produktdaten:', data);

        inp_Productname.value = data.product.product_name + ' ' + data.product.brands;
        inp_Kcal.value = (data.product.nutriments["energy-kcal_100g"] !== undefined) ? data.product.nutriments["energy-kcal_100g"] : 0;
        inp_Fat.value = (data.product.nutriments.fat_100g !== undefined) ? data.product.nutriments.fat_100g : 0;
        inp_Carbs.value = (data.product.nutriments.carbohydrates_100g !== undefined) ? data.product.nutriments.carbohydrates_100g : 0;
        inp_Sugar.value = (data.product.nutriments.sugars_100g !== undefined) ? data.product.nutriments.sugars_100g : 0;
        inp_Fiber.value = (data.product.nutriments.fiber_100g !== undefined) ? data.product.nutriments.fiber_100g : 0;
        inp_Protein.value = (data.product.nutriments.proteins_100g !== undefined) ? data.product.nutriments.proteins_100g : 0;
        inp_Salt.value = (data.product.nutriments.salt_100g !== undefined) ? data.product.nutriments.salt_100g : 0;
        inp_Barcode.value = ean_code
        inp_Unit.value = (data.product.product_quantity + 'g') || 0;

        is_fetched_Data = true;
        fetched_barcode = data.product.code;
        fetched_product_image = data.product.image_front_small_url;
        open_new_modal();
        showMessage(`<img src="${fetched_product_image}" width=200 height=200/> </br> </br> Produkt wurde gefunden`, 8000, 'Info');

        // Clear Barcode input field
        inp_Barcode.value = '';
    } catch (error) {
        console.error('Fehler:', error.message);
        showMessage('Das Produkt wurde nicht gefunden', 4000, 'Alert');
    }
}



