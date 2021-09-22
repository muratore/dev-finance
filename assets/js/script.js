// Open and close Modal

const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};
// Modal Close
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },

  income() {
    let incomeBalance = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        incomeBalance += transaction.amount;
      }
    });
    // console.log(incomeBalance);
    return incomeBalance;
    // somar as entradas positivas
    // armazenar em um variavel
  },
  expenses() {
    let expenseBalance = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenseBalance += transaction.amount;
      }
    });
    console.log(expenseBalance);
    return expenseBalance;
    // console.log(expenseBalance);
    // somar os gatos e atribuir o valor a uma variável
  },
  total() {
    let totalBalance = Transaction.income() + Transaction.expenses();
    console.log(totalBalance);
    return totalBalance;
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLtransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLtransaction(transaction, index) {
    const classAmount = transaction.amount < 0 ? "expense" : "income";
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${classAmount}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td> <img onclick="Transaction.remove(${index})" src="./assets/images/minus.svg" alt="Remover Transação"></td>
  </tr>`;
    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.income()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransations() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmout(value) {
    value = Number(value.replace(/\,\./g, ""));
    console.log(value);
    return value;
  },
  formatDate(date) {
    const formatDateBRL = date
      .split("-")
      .reverse()
      .toLocaleString()
      .replace(/,/g, "/");

    return formatDateBRL;
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/-/, "");
    value = Number(value);
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  // Selecionar os campos do Form
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (
      // description.trim() === "" ||
      // amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Favor preencher todos os dados!");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmout(amount);
    date = Utils.formatDate(date);
    // console.log(amount);
    return {
      description,
      amount,
      date,
    };
  },
  clearFields() {
    Form.description = "";
    Form.amount = "";
    Form.date = "";
  },

  submit(event) {
    event.preventDefault();
    try {
      // Validar dados
      Form.validateFields();
      // Formatar dados para salvar
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      // salvar
      Form.clearFields();
      // apagar os dado do formulário
      Modal.close();
      // fechar o modal
    } catch (error) {
      alert(error.message);
    }
  },
};

// console.log(Form.getValues());
const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransations();
    App.init();
  },
};

App.init();
