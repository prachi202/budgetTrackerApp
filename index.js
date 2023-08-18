(function(){
    console.clear();
    "use strict";
    function budgetTracker() {
        let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
        let addForm = document.querySelector(".cmp-budgetTracker__container__transactionControl__actions__add"); 
        let errorMessage = document.querySelector(".cmp-budgetTracker__container__transactionControl__actions__add--errorText");       
        let incomeList = document.querySelector(".cmp-budgetTracker__container__transactionHistory__record__income__incomeList");
        let expenseList = document.querySelector(".cmp-budgetTracker__container__transactionHistory__record__expense__expenseList");
        let balance = document.getElementById("cmp-budgetTracker__container__balance");
        let income = document.getElementById("cmp-budgetTracker__container__income");
        let expense =  document.getElementById("cmp-budgetTracker__container__expense");

        function updateStatistics() {
            const updateIncome = transactions
                                    .filter(transaction => transaction.amount > 0)
                                    .reduce((total, transaction) => total += transaction.amount, 0);

            const updateExpense = transactions
                                    .filter(transaction => transaction.amount < 0)
                                    .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);
            updateBalance = updateIncome - updateExpense;
            balance.textContent = updateBalance;
            income.textContent = updateIncome;
            expense.textContent = updateExpense;
        } 
        updateStatistics();                       
        function generateTemplate(id, source, amount, time) {
            return ` <li class="cmp-budgetTracker__container__transactionHistory__record__list" data-id="${id}">
                        <p class="cmp-budgetTracker__container__transactionHistory__record__list__para">
                            <span>${source}</span>
                            <span class="cmp-budgetTracker__container__transactionHistory__record__list--time">${time}</span>
                        </p>
                        $<span>${Math.abs(amount)}</span>
                        <i class="fa-solid fa-trash-can cmp-budgetTracker__container__transactionHistory__record__list--delete"></i>
                    </li>`;            
        }
        function addTransactionDOM(id, source, amount, time) {
            if(amount > 0){
                incomeList.innerHTML += generateTemplate(id, source, amount, time);
                // let recordList = document.querySelector(".cmp-budgetTracker__container__transactionHistory__record__list");
                // console.log(recordList);
                // recordList.style.borderColor = "green";     
            }
            else{
                expenseList.innerHTML += generateTemplate(id, source, amount, time);
                // let recordList = document.querySelector(".cmp-budgetTracker__container__transactionHistory__record__list");
                // console.log(recordList);
                // recordList.style.borderColor = "red";           
            }            
        }
        function addTransaction(source, amount) {
            let time = new Date();
            const transaction = {
                id: Math.floor(Math.random()*100000),
                source: source,
                amount: amount,
                time: `${time.toLocaleDateString()}, ${time.toLocaleTimeString()}`
            };
            transactions.push(transaction);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            addTransactionDOM(transaction.id, source, amount, transaction.time);            
        }
        addForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if(addForm.source.value.trim() === "" || addForm.amount.value === ""){
                errorMessage.textContent = "Please enter valid values!";
                return errorMessage;
            }
            addTransaction(addForm.source.value, Number(addForm.amount.value));
            updateStatistics();
            addForm.reset();            
        });
        function getTransaction() {
            transactions.forEach(transaction => {
                if(transaction.amount > 0){
                    incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
                }
                else{
                    expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
                }
            });
        }
        getTransaction();
        function deleteTransaction(id) {
            transactions = transactions.filter(transaction => {
                return transaction.id !== id;
            });
            localStorage.setItem("transactions", JSON.stringify(transactions));
        }
        incomeList.addEventListener("click", event => {
            if(event.target.classList.contains("cmp-budgetTracker__container__transactionHistory__record__list--delete")){
                event.target.parentElement.remove();
                deleteTransaction(Number(event.target.parentElement.dataset.id));
                updateStatistics();
            }
        });
        expenseList.addEventListener("click", event => {
            if(event.target.classList.contains("cmp-budgetTracker__container__transactionHistory__record__list--delete")){
                event.target.parentElement.remove();
                deleteTransaction(Number(event.target.parentElement.dataset.id));
                updateStatistics();
            }
        });  
    }
    budgetTracker();    
}());