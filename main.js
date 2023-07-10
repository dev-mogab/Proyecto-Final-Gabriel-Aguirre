//Capturo elementos del DOM
let gamesDOM = document.getElementById('games')
let select = document.getElementById("select1");
let findd = document.getElementById('search')
let coincidence = document.getElementById('found')
let cartModal = document.getElementById('modal-body-cart')
let modalBtn = document.getElementById('cartBtn')
let totalPrice = document.getElementById('totalPrice')

//Creo la clase constructora
class Game{
  constructor(id, name, price, image){
    this.id = id,
    this.name = name,
    this.price = price
    this.image = image
  }
}

//Creo los objetos
//Nintendo 64 Games
const game1 = new Game(1, 'The Legend of Zelda: Ocarina of Time', 119, '/assets/games/game1.jpg');
const game2 = new Game(2, "The Legend of Zelda: Majora's Mask", 170, '/assets/games/game2.jpg');
const game3 = new Game(3, 'Super Mario 64', 119, '/assets/games/game3.jpg');
const game4 = new Game(4, 'Banjoo Kazooie', 102, '/assets/games/game4.png');
const game5 = new Game(5, 'Donkey Kong 64', 94, '/assets/games/game5.png');
const game6 = new Game(6, 'Goldeneye 007', 90, '/assets/games/game6.jpg');
//Playstation 1 Games
const game7 = new Game(7, 'Silent Hill', 179, '/assets/games/game7.png');
const game8 = new Game(8, 'Metal Gear Solid', 49, '/assets/games/game8.png');
const game9 = new Game(9, 'Resident Evil', 100, '/assets/games/game9.jpg');
const game10 = new Game(10, 'Final Fantasy VII', 34, '/assets/games/game10.jpg');
const game11 = new Game(11, 'Parasite Eve 1', 65, '/assets/games/game11.png');
const game12 = new Game(12, 'Parasite Eve 2', 103, '/assets/games/game12.jpg');
//Handled Games
const game13 = new Game(13, 'The Legend of Zelda: A Link to the Past', 89, '/assets/games/game13.png');
const game14 = new Game(14, 'Super Mario Bros. 3', 59, '/assets/games/game14.png');
const game15 = new Game(15, 'Metroid Fusion', 149, '/assets/games/game15.png');
const game16 = new Game(16, 'Pokemon Ruby', 247, '/assets/games/game16.png');
const game17 = new Game(17, 'Pokemon Emerald', 464, '/assets/games/game17.jpg');
const game18 = new Game(18, 'Mega Man Zero', 95, '/assets/games/game18.jpg');

//Creo los arrays de games y los productos en el carrito
let games = []
let cartProducts 

//Agrego el array de games al localStorage
if(localStorage.getItem('games')){
  games = JSON.parse(localStorage.getItem('games'))
}else{
  games.push(game1,game2,game3,game4,game5,game6,game7,game8,game9,game10,game11,game12,game13,game14,game15,game16,game17,game18)
  localStorage.setItem('games', JSON.stringify(games))
}

//Agrego el array de cartProducts al localStorage
if(localStorage.getItem('cart')){
  cartProducts = JSON.parse(localStorage.getItem('cart'))
}else{
  cartProducts = []
  localStorage.setItem('cart', cartProducts)
}

//Muestro por defecto los objetos en el DOM
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
showDOM(games)

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
modalBtn.addEventListener('click', ()=>{
  addCartModal(cartProducts)
})

//Evento que captura el input del search
findd.addEventListener('input', () => {
  searching(findd.value, games)
})