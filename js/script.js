
function Pizzaria() {
  this.pizzasMade = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20};
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, mushrooms: 1};

  this.orderUp = [];
}

Pizzaria.prototype.newPie = function(size) {
  // this.pizzasMade++;
  this.orderUp.push(new Pizza(this.pizzasMade++,size));
  // this.currentOrder = new Pizza(this.pizzasMade,size);


}

function Pizza(id,size) {
  this.size = size;
  this.pizzaId = id;

  this.toppings = [];
}

Pizza.prototype.addToppings = function(topping) {
  this.toppings.push(topping)
}



Pizza.prototype.display = function() {
  return this
}

$(function() {
  var pizzaria1 = new Pizzaria()

  // uiSizes();

  console.log(pizzaria1.pizzaToppingsPrice)
  console.log(pizzaria1.pizzaSizesPrice)

  for (let prop in pizzaria1.pizzaSizesPrice) {
    $("#pizzeria-sizes").append(`
      <label class="btn btn-secondary">
        <input type="radio" name="pizza-size" id="${prop}" autocomplete="off">${prop}
      </label>`);
    }



  // pizzaria1.pizzaSizesPrice
  //
  // uiSizes()


  $("#buildpie").click(function(){
    var pizzaSize;

    $("input[name=pizza-size]:checked").length ? (pizzaSize = $("input[name=pizza-size]:checked").prop("id")) : (pizzaSize = "small")

    pizzaria1.newPie(pizzaSize)

    var currentPizza = pizzaria1.orderUp[pizzaria1.orderUp.length-1];

    currentPizza.addToppings("cheese")
    currentPizza.addToppings("pepperoni")
    currentPizza.addToppings("mushrooms")

    console.log(currentPizza)



    // var output = pizzaria1.orderUp[pizzaria1.orderUp.length-1].display()
    // console.log(output.size, output.toppings)

    // console.log(output)



    $("#pizza-details").text(currentPizza.size +" pizza \n with: " +currentPizza.toppings.join(", "))


  })
})
