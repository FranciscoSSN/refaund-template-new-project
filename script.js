// Selecionando os elementos do formulário.
const form = document.querySelector("form") // salvando submit do formulário
const amout = document.querySelector("#amount") // salvando o valor da dispesa
const expense = document.querySelector("#expense") // salvando nome da dispesa
const category = document.querySelector("#category") // salvando opção categoria

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

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

        // Adcionar nome e categoria na (div)
        expenseInfo.append(expenseName, expenseCategory)

        // Adiciona as informções no item (li)
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)

        // Adiciona o item na lista (ul)
        expenseList.append(expenseItem)

        // Limpar campos do formulário
        formClear()

        // Chamando função que atualiza os totais
        updateTotals()

        // Salvar no localStorage
        saveExpensesToLocalStorage()
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

// Atualizar os totais
function updateTotals() {
    try {
        // Recuperar todos os itens (li) da lista (ul)
        const items = expenseList.children
        
        // Atualizar a quantidade de items da lista
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Variável para incrementar o total
        let total = 0

        // Percorrer cada item (li) da lista (ul)
        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remover os não númericos e subistituir a vírgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Converter o valor para Float
            value = parseFloat(value)

            // Verificar se ele é um número valido
            if(isNaN(value)) {
                alert("Não foi possível calcular o total. O valor não parece ser um número")
            }

            // Incremento do valor total
            total += Number(value)
        }

        // Exibir o valor total
        // expensesTotal.textContent = total

        // Criar o span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remover o R$ que será exibido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpar o conteúdo do elemento
        expensesTotal.innerHTML = ""

        // Adiciona o símbolo da moeda e do falor formatado
        expensesTotal.append(symbolBRL, total)


    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os valores")
    }
}

// Evento que captura um click nos itens da lista
expenseList.addEventListener("click", (event) => {
    // Verificar se o elemento clicaldo é o ícone de remover
    if(event.target.classList.contains("remove-icon")) {
        // Obter o li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remover item da lista
        item.remove()
    }

    // Atualizar os totais
    updateTotals()
})

// Limpar os campos
function formClear() {
    // limpa campos do input
    amout.value = ""
    category.value = ""
    expense.value = ""

    // Foca no input expense depois de adicionar um item a lista
    expense.focus()
}

// Função para salvar as despesas no localStorage
function saveExpensesToLocalStorage() {
    try {
        // Obter todas as despesas da lista
        const items = [...expenseList.children].map((item) => {
            const expenseName = item.querySelector("strong").textContent;
            const categoryName = item.querySelector(".expense-info span").textContent;
            const categoryIconSrc = item.querySelector("img").getAttribute("src");
            const expenseAmount = item.querySelector(".expense-amount").textContent;

            return {
                expense: expenseName,
                category_name: categoryName,
                category_icon: categoryIconSrc,
                amount: expenseAmount,
            };
        });

        // Salvar os dados no localStorage como uma string JSON
        localStorage.setItem("expenses", JSON.stringify(items));
    } catch (error) {
        console.log("Erro ao salvar despesas no localStorage:", error);
    }
}