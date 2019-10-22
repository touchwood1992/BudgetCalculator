//This will be user Interface UI controller
const uiController = (function() {
	//Set All ui Elements Selectors
	const uiComponentsObj = {
		addBtn: '#record-add',
		type: '#budget-type',		
        value: '#budget-value',
        description: '#budget-description',
		incContainer: '#income-container tbody',
        expContainer: '#expense-container tbody',
        incTotalContainer:".total-income-amount",
        expTotalContainer:".total-expense-amount"
	};

	//Return Object with all necessory arguments
	return {
		uiComponents: function() {
			return uiComponentsObj;
		},

		getValues: function() {
			return {
				type: document.querySelector(uiComponentsObj.type).value,
				value: document.querySelector(uiComponentsObj.value).value,
				description: document.querySelector(uiComponentsObj.description).value
			};
		},

		addItemUi: function({id,type,desc,val}) {
			
			if (type === 'inc') {
				container = document.querySelector(uiComponentsObj.incContainer);
				item = document.createElement('tr');
				item.innerHTML = `<td>${val}</td><td>${desc}</td><td><i class="fa fa-remove" data-id=${id}></i></td>`;
			} else if (type === 'exp') {
				container = document.querySelector(uiComponentsObj.expContainer);
				item = document.createElement('tr');
				item.innerHTML = `<td>${val}</td><td>${desc}</td><td><i class="fa fa-remove" data-id=${id}></i></td>`;
			}
			container.insertAdjacentElement('beforeend', item);
		},

		resetValuesOfboxes: function() {
			const allSelector = document.querySelectorAll(
				`${uiComponentsObj.type} , ${uiComponentsObj.description} , ${uiComponentsObj.value}`
			);

			Array.prototype.slice.call(allSelector).forEach(function(element) {
				element.value = '';
			});
        },
        showTotal:function(type,total)
        {
                document.querySelector(uiComponentsObj[`${type}TotalContainer`]).innerHTML = "$"+total;
        },
        removeItem:function(type,element)
        {
            element.parentElement.parentElement.remove();
        }
	};
})();

//This will be user Budget Data Storage controller
const budgetController = (function() {
	//All data with object
	const data = {
		inc: [],
		exp: [],
		totalinc: 0,
		totalexp: 0
	};

	//Income functional Constructor
	const IncomeObj = function(id,type, val, desc) {
        this.id = id;
		this.type = type;
		this.val = val;
		this.desc = desc;
	};

	//Expense functional Constructor
	const ExpenseObj = function(id,type, val, desc) {
        this.id = id;
		this.type = type;
		this.val = val;
		this.desc = desc;
	};

	return {
		addItem: function({ type, value, description }) {
			let newDataObj;
            
			if (type === 'inc') {
                const id = data.inc.length === 0 ? 1 : data.inc[data.inc.length - 1].id + 1;
				newDataObj = new IncomeObj(id, type, value, description);
			} else {
                const id = data.exp.length === 0 ? 1 : data.exp[data.exp.length - 1].id + 1;
				newDataObj = new ExpenseObj(id, type, value, description);
			}

            data[type].push(newDataObj);
			return newDataObj;
        },
       calculatetotal:function(type)
       {
            let sum;
            sum = 0;
            data[type].forEach((item) => {return sum += item.val} );
            return sum;
       },
       removeItem:function(type,id)
       {     
           const indexToRemove = data[type].findIndex(function(item){return item.id === Number(id)});
           
           if(indexToRemove !== -1)
           {
                data[type].splice(indexToRemove,1);
           }
       }
	};
})();

//This will be user Interface Coding controller
const appController = (function(uiControllerGet, budgetControllerGet) {
	const saveData = function() {
		const inputValues = uiControllerGet.getValues();

		//Check for empty Values.
		if (inputValues.type !== '' && !isNaN(inputValues.value) && inputValues.description !== '') {
			//Adding item to budget Controller.
			//Converting to number before adding into object.
			inputValues.value = Number(inputValues.value);
			const addedItemtoObject = budgetControllerGet.addItem(inputValues);

			//Adding item to ui controller.
			uiControllerGet.addItemUi(addedItemtoObject);

			//Make empty values to the Ui controller
            uiControllerGet.resetValuesOfboxes();
            
            //Show Total Expense and Income
            updateTotals()
        }
        else{
            alert("Enter Valid Values."); return false;
        }

	};
    
        const updateTotals = function()
        {
                    const incomeTotal = budgetControllerGet.calculatetotal("inc");
                    uiControllerGet.showTotal("inc" , incomeTotal);
                    const expenseTotal = budgetControllerGet.calculatetotal("exp");            
                    uiControllerGet.showTotal("exp", expenseTotal);
        }

    const removeIncome = function(e)
    {     
        e.preventDefault();        
        if(e.target.classList.contains("fa-remove"))
        {
            removeItemCommon("inc" , e.target);
        }
    }
    const removeExpense = function(e)
    {       
        e.preventDefault();        
        if(e.target.classList.contains("fa-remove"))
        {
            removeItemCommon("exp" , e.target);
        }
    }
    const removeItemCommon = function(type,element)
    {
             //Remove From UI
             uiControllerGet.removeItem (type , element);            
             //Remove From Array
             budgetControllerGet.removeItem (type , element.getAttribute("data-id"));
             //Update Total
             updateTotals();
    }

	const setInitialCode = function() {
		const allUiComponents = uiControllerGet.uiComponents();
        document.querySelector(allUiComponents.addBtn).addEventListener('click', saveData);
        document.querySelector(allUiComponents.incContainer).addEventListener("click",removeIncome)
        document.querySelector(allUiComponents.expContainer).addEventListener("click",removeExpense)
        
	};
	return {
		init: function() {
			setInitialCode();
		}
	};
})(uiController, budgetController);
appController.init();