document.addEventListener("DOMContentLoaded", () => {
    setBurgerMenu();

    document.querySelector('.footer-container').addEventListener('click', (event) => {
        console.log();
        if (window.innerWidth <= 1020 && event.target.classList.contains('footer-additional_information-group-title')) {
            event.target.classList.toggle('active');
        }
    });

    const directionsInputs = document.querySelectorAll('.header-form-direction .header-form-input');
    const autocompleteDialog = document.querySelector('.form-direction-autocomplete');

    document.querySelector('.header-form-btn_swap').addEventListener('click', swapDirections);

    directionsInputs.forEach((directionInput) => {
        directionInput.addEventListener('click', () => {
            directionsInputs.forEach((input => input.parentElement.classList.remove('active')));
            directionInput.parentElement.classList.add('active');
            directionsAutocomplete(directionInput)
        });

        directionInput.addEventListener('input', () => {
            directionsAutocomplete(directionInput);
            showOrHideSubscription(directionInput);
        });
    })

    autocompleteDialog.querySelector('.form-direction-autocomplete-selected_city-clear').addEventListener('click', () => {
        const input = document.querySelector('.header-form-input-box.active').querySelector('.header-form-input');
        input.value = '';
        directionsAutocomplete(input);
        showOrHideSubscription(input);
    })

    const dateInputs = Array.from(document.querySelectorAll('.header-form-date .header-form-input'));
    const calendarContainer = document.querySelector('.calendar-container');
    setCalendar(dateInputs, calendarContainer);
    

    let passengerForm = document.querySelector('.header-form-passengers');
    const inputPas = document.querySelector(".header-form-passengers .header-form-input");
    const passengerDialog = new PassengerDialog(document.querySelector('.header-passengers-inputs'), inputPas);  
    
    inputPas.addEventListener('click', () => {
        if (!passengerDialog.isOpen()) {
            passengerDialog.showDialog();
        }
    })

    document.addEventListener('click', (event) => {
        if ( !Array.from(directionsInputs).some(input => input.contains(event.target)) && !autocompleteDialog.contains(event.target)) {
            // autocompleteDialog.style.display = 'none';
            autocompleteDialog.close()
            directionsInputs.forEach(input => {
                showOrHideSubscription(input)
                input.parentElement.classList.remove('active');
            });
        }

        if ( !Array.from(dateInputs).some(input => input.contains(event.target)) && !calendarContainer.contains(event.target)) {
            calendarContainer.style.display = 'none';
            dateInputs.forEach(input => input.parentElement.classList.remove('active'))
        }

        if(!passengerForm.contains(event.target)) {
            passengerDialog.closeDialog();
        }
    });
})       

function setBurgerMenu() {
    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector('.header-nav');

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active");
        offScreenMenu.classList.toggle("active");
        console.log(offScreenMenu);
      })
}


function swapDirections() {
    let directionsInputs = document.querySelectorAll('.header-form-direction .header-form-input');

    let tempValue = directionsInputs[0].value;
    directionsInputs[0].value = directionsInputs[1].value;
    directionsInputs[1].value = tempValue;

    showOrHideSubscription(directionsInputs[0]);
    showOrHideSubscription(directionsInputs[1]);
}

function showOrHideSubscription(input) {
    input.previousElementSibling.style.display = input.value ? "block" : "none";
}

function directionsAutocomplete(directionInput) {
    const airports = {
        nearestАirports : [
            { name: "Балице", code: "KRK" },
            { name: "Москва", code: "SVO" }
        ],
        cities : [
            { name: "Варшава", code: "WAW" },
            { name: "Кишинев", code: "RMO" },
            { name: "Минск", code: "MSQ" }
        ]
    }

    let showAutoComplete = false;
    const autoCompleteContainer = document.querySelector('.form-direction-autocomplete');
    const selectedCity = document.querySelector('.form-direction-autocomplete-city');
    const selectedCode = document.querySelector('.form-direction-autocomplete-code');
    const autocompleteItems = document.querySelectorAll('.form-direction-autocomplete-item');

    // Если город ранее был выбран, то выводим его
    if ( directionInput.value != '' && selectedCity && selectedCity.textContent == directionInput.value ) {       
        autocompleteItems[0].style.display = 'block';
        showAutoComplete = true;
    } else {
        selectedCity.textContent = '';
        autocompleteItems[0].style.display = 'none';
    }

    if ( airports.nearestАirports.length > 0 ) {
        autocompleteItems[1].children[1].innerHTML = '';
        autocompleteItems[1].style.display = 'block';
        addAirportToAutocomplete(autocompleteItems[1].children[1], airports.nearestАirports, autoCompleteContainer, directionInput, selectedCity, selectedCode)
        showAutoComplete = true;
    } else {
        autocompleteItems[1].style.display = 'none';
    }

    if ( airports.cities.length > 0 ) {
        let filteredCities = [];

        if (directionInput.value == '') {
            filteredCities = airports.cities;
        } else {
            filteredCities = airports.cities.filter(city => city.name.toLowerCase().includes(directionInput.value.toLowerCase()));
        }
        
        if (filteredCities && filteredCities.length > 0) {
            autocompleteItems[2].children[1].innerHTML = '';
            autocompleteItems[2].style.display = 'block';

            addAirportToAutocomplete(autocompleteItems[2].children[1], filteredCities, autoCompleteContainer, directionInput, selectedCity, selectedCode);
            showAutoComplete = true;
        } else {
            autocompleteItems[2].style.display = 'none';
        }
    }
    
    if( showAutoComplete ) {
        autoCompleteContainer.show();
    } else {
        autoCompleteContainer.close();
    }


    // autoCompleteContainer.style.display = showAutoComplete ? "block" : "none";
}

function addAirportToAutocomplete(autoCompleteList, cities, autoCompleteContainer, directionInput, selectedCity, selectedCode) {
    
    cities.forEach(city => {
        let spanCity = document.createElement('span');
        spanCity.textContent = city.name;
        spanCity.classList.add('form-direction-autocomplete-city');

        let spanCode = document.createElement('span');
        spanCode.textContent = city.code;
        spanCode.classList.add('form-direction-autocomplete-code');

        let div = document.createElement('div');
        div.classList.add('form-direction-autocomplete-airport');
        div.appendChild(spanCity);
        div.appendChild(spanCode)

        let li = document.createElement("li");
        li.classList.add('form-direction-autocomplete-airports_item');
        li.appendChild(div);

        li.addEventListener('click', () => {
            selectedCity.textContent = directionInput.value = city.name;
            selectedCode.textContent = city.code;
            autoCompleteContainer.close();
            showOrHideSubscription(directionInput);
            // autoCompleteContainer.style.display = 'none';
        })

        autoCompleteList.appendChild(li);
    })
}

function setCalendar(dateInputs, calendarContainer) {
    const formDateCOntainer = document.querySelector('.header-form-date');
    const calendars = calendarContainer.querySelector(".calendars-container");

    const calendar = new Calendar(dateInputs, calendarContainer, calendars)

    formDateCOntainer.addEventListener('click', (event) => {
        const currentInput = event.target.closest('.header-form-input');
        if(!currentInput) {
            return;
        }

        calendar.setCurrentInput(currentInput);

        if (!calendar.isCalendarRendered()) { 
            calendar.renderCalendar();
            calendar.showCalendar();
        } else {
            calendar.showCalendar();
        }
    })
}

class PassengerDialog {
    #maxPassengers = 9;
    #totalPassengers = 1;
    #dialogContainer;
    #mainInput;
    #checkBoxes;
    
    // #passengersInputs;
    #counterButtons;
    
    constructor(dialogContainer, mainInput) {
        this.#dialogContainer = dialogContainer;
        this.#mainInput = mainInput;

        // this.#passengersInputs = this.#dialogContainer.querySelectorAll('.passengers-input');
        this.#counterButtons = Array.from(this.#dialogContainer.querySelectorAll('.passengers-inputs-button'));
        this.#checkBoxes = Array.from(this.#dialogContainer.querySelectorAll('.passengers-checkbox'));

        dialogContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('passengers-inputs-button')) {
                this.#changeCount(event.target);
                this.#activateOrDeactivateCounterButtons();
                this.#setMainInputValue();
            } else if(event.target.classList.contains('header-form-passengers-button')) {
                this.closeDialog();
            } else if(event.target.classList.contains('passengers-checkbox')) {
                this.#setMainInputValue();
            } 
        })
    }

    #activateInputFocus() {
        this.#mainInput.parentElement.classList.add('active');
    }

    #deactivateInputFocus() {
        this.#mainInput.parentElement.classList.remove('active');
    }

    #changeCount(button) {
        let delta = button.classList.contains('button-plus')? 1 : -1;

        console.log(delta)

        const input = this.#getButtonInput(button);
        input.value = parseInt(input.value) + delta;

        this.#totalPassengers += delta;
    }

    #getButtonInput(button) {
        return button.closest('.passengers-inputs-input_container').querySelector('.passengers-input');
    }

    #activateOrDeactivateCounterButtons() {
        this.#counterButtons.forEach(button => {
            let input = this.#getButtonInput(button);

            if( button.classList.contains('button-plus') ) {
                button.disabled = this.#totalPassengers >= this.#maxPassengers;
            } else {
                button.disabled = parseInt(input.value) <= parseInt(input.min);
            }
        })
    }

    closeDialog() {
        this.#dialogContainer.close();
        this.#deactivateInputFocus();
    }

    isOpen() {
        return this.#dialogContainer.open;
    }

    showDialog() {
        this.#dialogContainer.show();
        this.#activateInputFocus();
    }
    
    #setMainInputValue() {
        let passText;

        if(this.#totalPassengers == 1) {
            passText = 'пассажир';
        } else if(this.#totalPassengers > 1 && this.#totalPassengers < 5) {
            passText = 'пассажира';
        } else {
            passText = 'пассажиров';
        }

        this.#mainInput.value = `${this.#totalPassengers} ${passText}, ${this.#checkBoxes.find(checkBox => checkBox.checked).value}`;
    }
}

class Calendar {
    #isCalendarRendered = false;
    #inputThere;
    #inputBackward;
    #currentMonth;
    #calendarContainer;
    #oneWayButton;
    #calendars;
    #currentInput;
    #calendarsDays = [];
    #calendarTemplate = document.getElementById('calendar-template');
    #prevMonth;
    #nextMonth;
 
    constructor(dateInputs, calendarContainer, calendars) {
        this.#inputThere = dateInputs[0];
        this.#inputBackward = dateInputs[1];
        this.#calendarContainer = calendarContainer
        this.#calendars = calendars;
        
        this.#currentMonth = new Date();
        this.#currentMonth.setHours(0, 0, 0, 0);

        this.#oneWayButton = calendarContainer.querySelector('.calendar-container-header_button');
        this.#prevMonth = calendarContainer.querySelector('.prevMonth');
        this.#nextMonth = calendarContainer.querySelector('.nextMonth');

        this.#prevMonth.addEventListener('click', () => {
            this.#currentMonth.setMonth(this.#currentMonth.getMonth() - 1);
            this.renderCalendar();
        });

        this.#nextMonth.addEventListener('click', () => {
            this.#currentMonth.setMonth(this.#currentMonth.getMonth() + 1);
            this.renderCalendar();
        })

        this.#oneWayButton.addEventListener('click', () => {
            this.#inputBackward.value = '';
            this.hideCalendar();
            this.#showOrHideSubscription(this.#inputBackward);
            this.#inputBackward.parentElement.classList.remove('active');
            this.#inputThere.parentElement.classList.remove('active');
            this.#redefineStyles();
        })
    }

    renderCalendar(calendarCounts = 2) {
        this.#isCalendarRendered = true;

        this.#calendars.innerHTML = '';
        // this.#calendars.querySelectorAll('calendar').forEach(el => el.remove());

        for(let i = 0; i < calendarCounts; i++) {
            let monthDate = new Date(this.#currentMonth);
            monthDate.setMonth(monthDate.getMonth() + i)
    
            this.#fillCalendar(monthDate);
        }

        this.#redefineStyles();
    }

    #redefineStyles() {
        let dates = this.#getDates();

        this.#prevMonth.disabled = dates[0].getTime() == this.#currentMonth.getTime();

        this.#calendarsDays.forEach(day => {
            this.#setCalendarDayStyle(day, ...dates);
        })
    }

    #fillCalendar(date) {
        const calendar = this.#calendarTemplate.content.cloneNode(true);
        this.#calendars.appendChild(calendar);
    
        const calendarGrid = this.#calendars.lastElementChild.querySelector('.calendar-grid')

        calendarGrid.innerHTML = "";
    
        this.#setMonth(date);
        
        let days = this.#getCalendarDays(date);
        this.#addElementsToCalendar(calendarGrid, days);

        this.#calendarsDays.push(...days);

        calendarGrid.addEventListener('click', (event) => {
            const dayElement = event.target.closest('.day');
            if (dayElement && !dayElement.classList.contains('pastDay')) {
                let clickedDay = days.find(day => day.day == dayElement.textContent);


                //Запрещаем вводить дату ТУДА позже ОБРАТНО и наоборот
                if( this.#currentInput === this.#inputBackward 
                    && this.#inputThere.value 
                    && clickedDay.date.getTime() < new Date(this.#inputThere.value.split(".").reverse().map(v => v)).getTime()) {
                    this.#inputBackward.value = this.#inputThere.value;
                    this.#inputThere.value = clickedDay.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
                } else if ( this.#currentInput === this.#inputThere
                    && this.#inputBackward.value 
                    && clickedDay.date.getTime() > new Date(this.#inputBackward.value.split(".").reverse().map(v => v)).getTime()) {
                    
                    if (!this.#inputThere.value) {
                        this.#inputThere.value = this.#inputBackward.value;
                    }
                    this.#inputBackward.value = clickedDay.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
                } else {
                    this.#currentInput.value = clickedDay.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
                }

                this.#redefineStyles();

                //Если оба инпута введены, то закрываем календарь, иначе переключаемся на другой инпут
                if (this.#inputBackward.value && this.#inputThere.value) {
                    this.#currentInput.parentElement.classList.remove('active');
                    this.hideCalendar();
                } else if(this.#currentInput == this.#inputThere) {
                    this.setCurrentInput(this.#inputBackward);
                } else {
                    this.setCurrentInput(this.#inputThere);
                }

                this.#showOrHideSubscription(this.#inputThere);
                this.#showOrHideSubscription(this.#inputBackward);
            }
        })
    }

    #setMonth(date) {
        const currentMonthElement = this.#calendars.lastElementChild.querySelector(".calendar-current_month"); 
    
        let monthText = date.toLocaleString("ru-RU", { month: "long", year: "numeric" });
        monthText = monthText.charAt(0).toUpperCase() + monthText.slice(1);
        currentMonthElement.textContent = monthText.slice(0, -3);
    }

    #getCalendarDays(date) {
        let days = [];
    
        const firstWeekday =  new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        //Добавим в календарь пустые дни, если он начинается не с понедельника
        for (let i = firstWeekday - 1; i > 0; i--) {
            days.push({ day: '', isEmpty: true });
        }
    
        // Дни указанного месяца
        for (let i = 1; i <= lastDate; i++) {
            const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
    
            days.push({ 
                day: i, 
                date: dayDate,
            });
        }
    
        return days;
    }

    #addElementsToCalendar(calendarGrid, days) {
        days.forEach(day => {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day.day;
        
            const dayContainer = document.createElement("div");
            dayContainer.classList.add('day_container');
            if (day.isToday) {
                dayContainer.classList.add("today");
            }

            if( day.isThereDay && day.isBackwardDay) {
                dayContainer.classList.add("chosen");
                    dayContainer.style.setProperty("--before-content", '"Туда/Обратно"');
            } else {
                if (day.isThereDay) {
                    dayContainer.classList.add("chosenThere");
                    dayContainer.style.setProperty("--before-content", '"Туда"');
                }
        
                if(day.isBackwardDay) {
                    dayContainer.classList.add("chosenBackward");
                    dayContainer.style.setProperty("--before-content", '"Обратно"');
                }
            }

            dayContainer.appendChild(dayElement);
            calendarGrid.appendChild(dayContainer);

            day.dayContainer = dayContainer;
            day.dayElement   = dayElement;
        })
    }    

    #getDates() {
        let thereDate, backwardDate;
    
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (this.#inputThere.value) {
            thereDate = new Date(this.#inputThere.value.split(".").reverse().map(v => v)); //((v, i) => i === 1 ? v - 1 : v));
        }
    
        if (this.#inputBackward.value) {
            backwardDate = new Date(this.#inputBackward.value.split(".").reverse().map(v => v)); //((v, i) => i === 1 ? v - 1 : v));
        }
    
        return [today, thereDate, backwardDate];
    }

    #setCalendarDayStyle(day, today, thereDate, backwardDate) {
    
        day.dayContainer.classList.remove("today", "chosen");
        day.dayElement.classList.remove("pastDay", "betweenDay");
    
        if (day.isEmpty) {
            day.dayElement.classList.add("pastDay");
            return;
        }
    
        if (day.date.getTime() < today.getTime()) {
            day.dayElement.classList.add("pastDay");
        }
    
        if (day.date.getTime() === today.getTime()) {
            day.dayContainer.classList.add("today");
        }
    
        if (thereDate && backwardDate && day.date.getTime() > thereDate.getTime() && day.date.getTime() < backwardDate.getTime()) {
            day.dayElement.classList.add("betweenDay")
        }

        if(thereDate && backwardDate && day.date.getTime() === thereDate.getTime() && day.date.getTime() === backwardDate.getTime()) {
                day.dayContainer.classList.add("chosen");
                day.dayContainer.style.setProperty("--before-content", '"Туда/Обратно"');
        } else {
            if (thereDate && day.date.getTime() === thereDate.getTime()) {
                day.dayContainer.classList.add("chosen");
                day.dayContainer.style.setProperty("--before-content", '"Туда"');
            }
    
            if(backwardDate && day.date.getTime() === backwardDate.getTime()) {
                day.dayContainer.classList.add("chosen");
                day.dayContainer.style.setProperty("--before-content", '"Обратно"');
            }
        }
    }

    hideCalendar() {
        this.#calendarContainer.style.display = 'none';
    }

    showCalendar() {
        this.#calendarContainer.style.display = 'flex';
    }

    setCurrentInput(input) {
        if (this.#currentInput) {
            this.#currentInput.parentElement.classList.remove('active');
        }

        this.#currentInput = input;
        this.#currentInput.parentElement.classList.add('active');

        if(this.#inputBackward.value || this.#currentInput === this.#inputBackward) {
            this.#oneWayButton.style.display = 'block';
        } else {
            this.#oneWayButton.style.display = 'none';
        }
    }

    isCalendarRendered() {
        return this.#isCalendarRendered;
    }

    #showOrHideSubscription(input) {
        input.previousElementSibling.style.display = input.value ? "block" : "none";
    }
}