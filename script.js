let cart = []
let modalKey = 0
let modalQt = 1
pizzaJson.map((item, index) => {
  //Selecionando e clonando a div pizza-item
  let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)

  //adicionado as informações
  pizzaItem.setAttribute('data-key', index)
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
  pizzaItem.querySelector('a').addEventListener('click',(event)=>{
    event.preventDefault();
    //achar o elemento mais proximo do a com a classe .pizza-item'
    let key = event.target.closest('.pizza-item').getAttribute('data-key')
    modalQt = 1;
    modalKey = key

    document.querySelector('.pizzaBig img').src = pizzaJson[key].img
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

    document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
    document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=> {
      if(sizeIndex == 2){
        size.classList.add('selected')
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    })

    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    

    document.querySelector('.pizzaWindowArea').style.opacity = 0
    document.querySelector('.pizzaWindowArea').style.display = 'flex'
    setTimeout(()=> {
      document.querySelector('.pizzaWindowArea').style.opacity = 1
      }, 200)
    
  })
  //colocando o pizzaItem dentro da area
  document.querySelector('.pizza-area').append(pizzaItem) 
  
});

//função para fechar o modal
function closeModal(){
  document.querySelector('.pizzaWindowArea').style.opacity = 0
  setTimeout(()=>{
    document.querySelector('.pizzaWindowArea').style.display = 'none'
  },500)
}

//selecionando os botões e add o evento para fechar o modal 
document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal)
})

//ação do botão - (modal)
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
  if(modalQt > 1){
    modalQt--
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt  
  }
})

//ação do botão + (modal)
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=> {
  modalQt++
  document.querySelector('.pizzaInfo--qt').innerHTML = modalQt
})

//evento do click no tamanho da pizza (modal)
document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (event) => {
    document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
    size.classList.add('selected')
  })
})

//ação do btn add ao carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener('click',()=>{
  //pegando as info para add no carrinho
  //qual a pizza? && qual o tamanho da pizza? && quantas pizzas?
  let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'))
  
  let indenticador = pizzaJson[modalKey].id+'@'+size

  let key = cart.findIndex((item)=>item.indenticador == indenticador)

  if(key > -1){
    cart[key].qt += modalQt
  }else{  
    cart.push({
      indenticador,
      id:pizzaJson[modalKey].id,
      size,
      qt:modalQt
    })
  }
  updateCart()
  closeModal()
})

//carrinho
function updateCart() {
  if(cart.length > 0){
    document.querySelector('aside').classList.add('show')
    document.querySelector('.cart').innerHTML = ''

    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let i in cart){
      let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
      subtotal += pizzaItem.price * cart[i].qt

      let cartItem =  document.querySelector('.models .cart--item').cloneNode(true)

      let pizzaSizeName;
      switch(cart[i].size){
        case 0:
          pizzaSizeName = 'P'
          break;
        case 1:
          pizzaSizeName = 'M'
          break;
        case 2:
          pizzaSizeName = 'G'
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
          if(cart[i].qt > 1){
            cart[i].qt--
          }else{
            cart.splice(i, 1)
          }
          updateCart()
      })
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        cart[i].qt++
        updateCart()
      })

      document.querySelector('.cart').append(cartItem)
    }


    desconto = subtotal * 0.1
    total = subtotal - desconto

    document.querySelector('.subtotal  span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    document.querySelector('.desconto  span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    document.querySelector('.total  span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

  }else{
    document.querySelector('aside').classList.remove('show')
  }
}

