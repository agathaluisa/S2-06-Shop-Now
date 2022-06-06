const categories = {
    "Hortifruti"   : "fruta",
    "Laticinios"   : "leite",
    "Panificadora" : "pães"
}

const cart = []

//CRIA TAGS HTML DOS CARDS
function createTags (){
    let li      = document.createElement("li")
    let img     = document.createElement("img")
    let h3      = document.createElement("h3")
    let span    = document.createElement("span")
    let p       = document.createElement("p")
    let content = document.createElement("div")
    let ol      = document.createElement("ol")
    let div     = document.createElement("div")
    let button  = document.createElement("button")

    return {
        li,
        img,
        h3,
        p,
        content,
        span,
        ol,
        div,
        button
    }
}


//CALCULA A SOMA TOTAL DOS PRODUTOS DE CADA CATEGORIA
function sumValues (produtos){
    let total = produtos.reduce((total, produto) =>{
        return total + Number(produto.preco)
    }, 0)

    document.querySelector(".containerCart--total").style.display = "block"
    document.querySelector(".quantityPrice").innerText = `R$ ${total.toFixed(2)}`
    document.querySelector(".quantityProducts").innerText = produtos.length
}

//ATUALIZA O CARRINHO 
function updateCart (){
    sumValues(cart)

    document.querySelector(".listCart--products").innerHTML = ""

    cart.forEach((produto) =>{
        let {li, div: imgContainer, img, span: productTitle }            = createTags()
        let {div: containerContent, span: productCategory}               = createTags()
        let {div: containerSpan, span: productPrice, button, img: icon } = createTags() 

        li.classList.add("listCart--list")
        imgContainer.classList.add("listCart--img")
        img.classList.add("img--product")
        containerContent.classList.add("listCart--content")
        containerSpan.classList.add("listCart--span")
        productTitle.classList.add("span-title")
        productCategory.classList.add("span-category")
        productPrice.classList.add("span-price")
        button.classList.add("img-trash")

        img.setAttribute("src", produto.img)
        icon.setAttribute("src", "./src/img/trash.svg")
        productTitle.innerText    = produto.nome
        productCategory.innerText = produto.categoria
        productPrice.innerText    = produto.preco

        imgContainer.appendChild(img)
        containerSpan.appendChild(productTitle)
        containerSpan.appendChild(productCategory)
        containerSpan.appendChild(productPrice)
        button.appendChild(icon)
        containerContent.appendChild(containerSpan)
        containerContent.appendChild(button)
        li.appendChild(imgContainer)
        li.appendChild(containerContent)
        
        document.querySelector(".listCart--products").appendChild(li)

        button.setAttribute("data-id", produto.id)
        button.addEventListener('click', removeCart)


    })

    document.querySelector(".listCart--products").style.display        = "block"
    document.querySelector(".containerCart--noProducts").style.display = "none"
}

//ADICIONA OS PRODUTOS AO CARRINHO
function addCart (event){
    let id      = Number(event.target.getAttribute("data-id"))

    let produto = produtos.filter(produto => produto.id == id)[0]

    cart.push(produto)

    updateCart()
    
}

//REMOVE PRODUTOS DO CARRINHO
function removeCart (event){
    let id = Number(event.currentTarget.getAttribute("data-id"))

    cart.splice(cart.findIndex(produto => produto.id == id), 1)
    console.log(event.currentTarget)
    updateCart()

    if(cart.length === 0) {
        document.querySelector(".listCart--products").style.display        = "none"
        document.querySelector(".containerCart--noProducts").style.display = "flex"
        document.querySelector(".containerCart--total").style.display      = "none"
    }
}

//CRIA OS CARDS 
function renderItems (produtos){
    produtos.forEach((produto) =>{
        let {li, img, h3, p, content, span, ol, div, button} = createTags()
        let ul = document.querySelector(".listProdutos")

        img.setAttribute("src", produto.img)
        h3.innerText     = produto.nome
        span.innerText   = produto.secao
        p.innerText      = `R$ ${Number(produto.preco).toFixed(2)}`
        button.innerText = "Comprar"

        button.setAttribute("data-id", produto.id)
        button.addEventListener('click', addCart)

        produto.componentes.forEach((componente, index)=>{
            let {li} = createTags()
            li.innerHTML = `<span>${index+1}. ${componente}</span>`

            ol.appendChild(li)
        })

        li.classList.add("product-item")
        div.classList.add("price-button")
        content.classList.add("content-item")
        span.classList.add("span-category")


        div.appendChild(p)
        div.appendChild(button)
        li.appendChild(img)
        content.appendChild(h3)
        content.appendChild(span)
        content.appendChild(ol)
        li.appendChild(content)
        li.appendChild(div)

        

        ul.appendChild(li)
    })
}


//FILTRA PRODUTOS POR CATEGORIA
function filterCategory (event){
    let category = event.target.classList[1].split("--")[1].split("filtrar")[1]
    if(category == "Todos"){
        document.querySelector(".listProdutos").innerHTML = ""
        renderItems(produtos)
        return 
    }

    let filteredProducts      = produtos.filter(produto => {
        return produto.categoria.toLowerCase() == categories[category]
    }) 

    document.querySelector(".listProdutos").innerHTML = ""
    renderItems(filteredProducts)
}


//FILTRA PRODUTOS PELA BUSCA POR NOME
function searchName (event){
    let text             = event.target.value
    let filteredProducts = produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(text.toLowerCase()) || produto.secao.toLowerCase().includes(text.toLowerCase()) || produto.categoria.toLowerCase().includes(text.toLowerCase())
    })
    document.querySelector(".listProdutos").innerHTML = ""
    renderItems(filteredProducts)

}


//ADICIONA EVENTOS NO INPUT E NOS BOTÕES
document.querySelector(".campoBuscaPorNome").addEventListener("keyup", searchName)
document.querySelectorAll(".estiloGeralBotoes").forEach( botao => botao.addEventListener("click", filterCategory))
renderItems(produtos)






