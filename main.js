//Capturo elementos del DOM
let gamesDOM = document.getElementById('games')
let select = document.getElementById("select1");
let findd = document.getElementById('search')
let coincidence = document.getElementById('found')
let cartModal = document.getElementById('modal-body-cart')
let modalBtn = document.getElementById('cartBtn')
let totalPrice = document.getElementById('totalPrice')
let purchaseBtn = document.getElementById('btnPurchase')
let loader = document.getElementById("loader")
let loaderTxt = document.getElementById("loaderTxt")

//Creo los arrays de games y los productos en el carrito
let games = []
let cartProducts 

//Creo la clase constructora
class Game{
  constructor(id, name, price, image){
    this.id = id,
    this.name = name,
    this.price = price
    this.image = image
  }
}

//Traigo los datos de games.json
const loadGames = async() => {
  const res = await fetch('./games.json')
  const data = await res.json()
  data.forEach(game => {
    let newGame = new Game(game.id, game.name, game.price, game.image)
    games.push(newGame)
  })
  localStorage.setItem('games', JSON.stringify(games))
}

//Agrego el array de games al localStorage
if(localStorage.getItem('games')){
  games = JSON.parse(localStorage.getItem('games'))
}else{
  loadGames()
}

//Agrego el array de cartProducts al localStorage
if(localStorage.getItem('cart')){
  cartProducts = JSON.parse(localStorage.getItem('cart'))
}else{
  cartProducts = []
  localStorage.setItem('cart', cartProducts)
}

//Funcion que muestra los objetos en el DOM
function showDOM(array){
  gamesDOM.innerHTML = ``
  for(let game of array ){
     let newGame = document.createElement("div")
     newGame.className = "cardd"
     newGame.innerHTML = `
       <img src="${game.image}" class="card-image" alt="${game.name}">
       <div class="card-body">
         <p class="card-text">${game.name}</p>
         <p class="card-text">$${game.price}</p>
         <button type="button" id="cartBtn${game.id}" class="button btn-primary">Purchase</button>
       </div>
   `
     gamesDOM.appendChild(newGame)
     let cartBtn = document.getElementById(`cartBtn${game.id}`)
     cartBtn.addEventListener('click', () => {
        addCart(game)
     })
  }
}

//Funcion que agrega los juegos al carrito
function addCart(game){
  let gameAdded = cartProducts.find((elem)=>elem.id === game.id)
  
  if(gameAdded === undefined) {
    cartProducts.push(game)
    console.log(cartProducts)
    localStorage.setItem('cart', JSON.stringify(cartProducts))
    Swal.fire({
      icon: 'success',
      text: `You added ${game.name} to the cart`,
      confirmButtonColor: '#7066e0'
     })
  }else{ 
    Swal.fire({
      icon: 'error',
      text: `The game '${game.name}' is out of stock`,
      confirmButtonColor: '#7066e0'
     })
  } 
}

//Funcion que muestra los juegos en el modal del carrito y tambien permite eliminarlos
function addCartModal(array){
  cartModal.innerHTML = ''

  array.forEach(product => {
    cartModal.innerHTML += `
    <div class="card border-primary mb-3" id ="product${product.id}" style="max-width: 540px;">
      <img class="card-img-top" height="300px" src="${product.image}" alt="${product.name}">
        <div class="card-body">
         <h4 class="card-title">${product.name}</h4>
         <p class="card-text">$${product.price}</p> 
         <button class= "btn btn-danger" id="deleteBtn${product.id}"><i class="fas fa-trash-alt"></i></button>
      </div>    
    </div>
`
  })

  array.forEach((product) => {
    document.getElementById(`deleteBtn${product.id}`).addEventListener("click", () => {
       let cartProduct = document.getElementById(`product${product.id}`)
       cartProduct.remove()
       let deleteProduct = array.find((game) => game.id == product.id)
       let position = array.indexOf(deleteProduct)
       array.splice(position, 1)
       localStorage.setItem("cart", JSON.stringify(array))
       calcTotal(array)
    })
 })
  calcTotal(array)
}

//Funcion que calcula el total de la compra
function calcTotal(array){
  let total = array.reduce((acc, cartProduct) => acc + cartProduct.price, 0)
  total === 0 ? totalPrice.innerHTML= 'Empty Cart' : totalPrice.innerHTML = `Total price: $${total}`
  return total
}

//Funcion que permite confirmar o cancelar la compra
function purchase(array){
    Swal.fire({
      title: 'Confirm Purchase',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'red',
      confirmButtonText: 'Confirm',
      confirmButtonColor: 'green'
    }).then((res) => {
      if (res.isConfirmed) {
        let totalPrice = calcTotal(array)
        Swal.fire({
          title: 'Purchase Confirmed',
          text: `The total is: $${totalPrice}`,
          icon: 'success',
          showConfirmButton: true
        })
        cartProducts = []
        localStorage.removeItem('cart')
      }else{
        Swal.fire({
          title: 'Purchase Cancelled',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
}

//Funcion que permite la busqueda de un juego, en caso de no encontrar muestra una imagen 404
function searching (search, array){
  let found = array.filter(
    (data) => data.name.toLowerCase().includes(search.toLowerCase()))
    found.length === 0 ? (coincidence.innerHTML = `<img src="./assets/404.png" alt="404 not found" class="not-found">`,
    showDOM(found)) : (coincidence.innerHTML = '',
    showDOM(found))
}

//Funciones de filtrado y evento --->
function highToLow(array){
  const highLow = [].concat(array)
  highLow.sort((a ,b) => b.price - a.price)
  showDOM(highLow)
}

function lowToHigh(array){
  const lowHigh = [].concat(array)
  lowHigh.sort((a,b) => a.price - b.price)
  showDOM(lowHigh)
}

function aZ(array){
  const aZ = [].concat(array)
  aZ.sort( (a,b) =>{
     if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {

        return -1
      }
      return 0
  })
  showDOM(aZ)
}

function zA(array){
  const zA = [].concat(array)
  zA.sort( (a,b) =>{
     if (a.name > b.name) {
        return -1
      }
      if (a.name < b.name) {

        return 1
      }
      return 0
  })
  showDOM(zA)
}

select.addEventListener("change", () => {
  switch(select.value) {
    case "1":
      highToLow(games)
      break;
    case "2":
      lowToHigh(games)
      break;
    case "3":
      aZ(games)
      break;
    case "4":
      zA(games)
      break;
    default:
      break;
  }
});
// <---

//Evento que permite mostrar el carrito al hacer click en el
modalBtn.addEventListener('click', () =>{
  addCartModal(cartProducts)
})

//Evento que captura el input del search
findd.addEventListener('input', () => {
  searching(findd.value, games)
})

//Evento que permite cancelar o realizar la compra al hacer click
purchaseBtn.addEventListener('click', () => {
  purchase(cartProducts)
})

//Simulador de carga de objetos en el DOM
setTimeout(()=>{
  loaderTxt.remove()
  loader.remove()
  showDOM(games)
},1000)
