// Selecionando os elementos do formulário.
const form = document.querySelector("form") // salvando submit do formulário
const amout = document.querySelector("#amount") // salvando o valor da dispesa
const expense = document.querySelector("#expense") // salvando nome da dispesa
const category = document.querySelector("#category") // salvando opção categoria

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")


// capturando evento do input de dispesa
amout.oninput = () => {
    // Substitui caractesres por somente números no input
    let value = amout.value.replace(/\D/g, "") 

    // Transformar o valor em centavos
    value = Number(value) / 100

    // Atualiza o valor do input
    amout.value = formatCurrencyBRL(value)
}

// Captura o event de submit do formulário para obter os valoes
form.onsubmit = (e) => {
    e.preventDefault() // previne o comportamento padrão de recarregar a página.

    // Cria um objeto com os detalhes da nova despesa
    const newExpense = { // objeto com todas as informações relacinadas a todas as despesas
        id: new Date().getTime(), // salvando o id através do tempo
        expense: expense.value, // salvando input do nome da dispesa
        category_id: category.value, // salvando o valor da categoria
        category_name: category.options[category.selectedIndex].text, // salvando a categoria selecionada
        amout: amout.value, // salvando o valor da dispesa
        created_at: new Date(), // salvando a data de criação
    }

    // Chamar a função que vai adicionar um item na lista
    expenseAdd(newExpense)
}

// Função que formata o valor da dispesa
function formatCurrencyBRL(value) {
    // formata no valor do padrão BRL
    value = value.toLocaleString("pt-BR",  {
        style: "currency",
        currency: "BRL",
    })

    // retorna valor formatado
    return value
}

// Criando função que vai adicionar um item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento de (li) para adicionar o item na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Criar info da dispesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da dispesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria o nome da categoria
        const expenseCategory =  document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Criar o valor da dispesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amout.toUpperCase().replace("R$", "")}`

        // Adicionar ícone de remover
        const expenseRemove = document.createElement("img")
        expenseRemove.classList.add("remove-icon")
        expenseRemove.setAttribute("src", "img/remove.svg")
        expenseRemove.setAttribute("alt", "remover")

        // Adcionar nome e categoria na div
        expenseInfo.append(expenseName, expenseCategory)

        // Adiciona as informções no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)

        // Adiciona o item na lista
        expenseList.append(expenseItem)


    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}