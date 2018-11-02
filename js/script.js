
function Pizzaria() {
  this.pizzasMade = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20}
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, mushrooms: 1}

  this.orderUp = []
}

Pizzaria.prototype.newPie = function(size) {
  this.pizzasMade++

  this.orderUp.push(new Pizza(this.pizzasMade,size))
  // this.currentOrder = new Pizza(this.pizzasMade,size);


}

function Pizza(id,size) {
  this.size = size,
  this.pizzaId = id++
}

Pizza.prototype.build = function(toppings) {
  this.toppings = toppings
}

Pizza.prototype.display = function() {
  console.log(this.size, this.id)
}



$(function() {


  var ralphspizzas = new Pizzaria()


  $("#newpie").click(function(){
    console.log('new pie click')
    ralphspizzas.newPie('small')
    console.log(ralphspizzas)


  })
})
