
function Pizzaria() {
  this.pizzasMade = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20};
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, ham:1, sausage: 1, mushroom: 1, onion: 1, garlic: 1, green_peppers: 1, pineapple: 1};

  this.orderUp = [];
}

Pizzaria.prototype.newPie = function(size) {
  this.orderUp.push(new Pizza(this.pizzasMade++,size));
}

function Pizza(id,size) {
  this.size = size;
  this.pizzaId = id;

  this.toppings = [];
}

Pizza.prototype.addToppings = function(topping) {
  this.toppings.push(topping)
}

Pizza.prototype.calcPrice = function() {

}

Pizza.prototype.display = function() {
  return this
}

$(function() {
  var pizzaria1 = new Pizzaria()

  // renders pizza sizes and prices based on pizzaria constructor
  for (let prop in pizzaria1.pizzaSizesPrice) {
    $("#pizzeria-sizes").append(`
      <label class="btn btn-secondary">
        <input type="radio" name="pizza-size" id="${prop}" autocomplete="off">${prop}
      </label>`);
    }

  // renders pizza toppings based on pizzaria constructor
  for (let prop in pizzaria1.pizzaToppingsPrice){

    $("#pizzeria-toppings").append(`
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${prop}" id="${prop}">
        <label class="form-check-label" for="${prop}">
          ${prop}
        </label>
      </div>`);
    }

  $("#buildpie").click(function(){
    var pizzaSize;

    $("input[name=pizza-size]:checked").length ? (pizzaSize = $("input[name=pizza-size]:checked").prop("id")) : (pizzaSize = "small")

    pizzaria1.newPie(pizzaSize)

    var currentPizza = pizzaria1.orderUp[pizzaria1.orderUp.length-1];

    $("input[type=checkbox]:checked").each(function(){
      var top = $(this).val();
      currentPizza.addToppings(top.toString());
    })

    console.log(currentPizza)

    // display pizza details
    $("#order-details").show();
    $("#pizza-details").text(currentPizza.size +" pizza \n with: " +currentPizza.toppings.join(", "))


  })
})
