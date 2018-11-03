
function Pizzeria() {
  this.tracker = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20, giant: 25};
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, ham:1, sausage: 1, mushroom: 1, onion: 1, garlic: 1, green_peppers: 1, pineapple: 1};

  this.orderUp = [];
}

Pizzeria.prototype.newPie = function(size) {
  this.orderUp.push(new Pizza(this.tracker++,size));
}

Pizzeria.prototype.calcPrice = function(pizza) {
  var basePrice = this.pizzaSizesPrice[pizza.size];
  var addedToppings = 0;

  pizza.toppings.forEach((function(topping) {
    addedToppings += this.pizzaToppingsPrice[topping];
  }).bind(this));

  pizza.price = basePrice + addedToppings + (pizza.delivery ? (2) : (0));
}

Pizzeria.prototype.removePie = function(pieId) {
  delete this.orderUp[pieId];
  console.log(this.orderUp)
}

function Pizza(id,size) {
  this.size = size;
  this.pizzaId = id;

  this.toppings = [];
  this.price = 0;

  this.delivery = false;
}

Pizza.prototype.addToppings = function(toppings) {
  this.toppings = toppings;
}

// UI functions
function ui_makeFirstCharUpper(word) {
  // makes first word upper case and changes _ character to space
  const firstLetter = /\b\w/g;
  let newWord = word.replace(firstLetter, word[0].toUpperCase());

  return newWord.split("_").join(" ");
}

function ui_orderReset() {
  // $("input").off('change');

  // $("input").prop("disabled",false);
  $("input").prop("checked",false);

  $("#pizza-details").hide();
  $("#pizza-summary").empty();

}

// page rendering functionality dependtend on pizzaria settings
function render_pizzaSizes(pizzeria1) {
  let htmlOutput = [];

  for (let prop in pizzeria1.pizzaSizesPrice) {
    htmlOutput.push(`<label class="btn btn-secondary">\n\t<input type="radio" name="pizza-size" id="${prop}" autocomplete="off">${ui_makeFirstCharUpper(prop)}</label>\n`);
    }
    return htmlOutput.join("");
  }

function render_pizzaToppings(pizzeria1) {
  let htmlOutput = [];

  for (let prop in pizzeria1.pizzaToppingsPrice){
    htmlOutput.push(`<div class="form-check">\n\t<input class="form-check-input" name="toppings" type="checkbox" value="${prop}" id="${prop}">\n\t<label class="form-check-label" for="${prop}">${ui_makeFirstCharUpper(prop)}</label>\n</div>\n`);
  }
  return htmlOutput.join("");
}

function bakePie(pizzeria1, size="small", toppings, deliver) {
  pizzeria1.newPie(size);
  var currentPizza = pizzeria1.orderUp[pizzeria1.orderUp.length-1];
  currentPizza.addToppings(toppings);
  currentPizza.delivery = deliver;
  pizzeria1.calcPrice(currentPizza);
  // 
  // var pizzaSummary = `<p>One <span style="text-decoration: underline;">${currentPizza.size}</span> pizza with:</p>
  // <ul>${listBuilder(currentPizza.toppings)}</ul>
  // <p>Amount due: $<span id="is-delivered">${currentPizza.price}</span</p>`;
  //
  // return pizzaSummary;
}

function listBuilder(toppings) {
  let htmlOutput = []

  toppings.forEach(function(topping) {
    htmlOutput.push(`<li>${ui_makeFirstCharUpper(topping)}</li>`)
  })

  return htmlOutput.join("")
}

function pieViewer(pizzeria1) {
  let currentPizza = pizzeria1.orderUp[pizzeria1.orderUp.length-1]

  let htmlOutput = `<div class="card" id="pizza-card-${currentPizza.pizzaId}">
      <div class="card-header" id="pizzaHeading${currentPizza.pizzaId}">
        <h5 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapsePizza${currentPizza.pizzaId}" aria-expanded="false" aria-controls="collapsePizza${currentPizza.pizzaId}">🍕 ${currentPizza.size} pizza<span class="float-right">$${currentPizza.price}</span></button>
        </h5>
      </div>
      <div id="collapsePizza${currentPizza.pizzaId}" class="collapse hide" aria-labelledby="pizzaHeading${currentPizza.pizzaId}" data-parent="#all-pizza-orders">
        <div class="card-body">
          <p>One ${currentPizza.size} pizza with: </p>
          <ul>${listBuilder(currentPizza.toppings)}</ul>
          <div>${currentPizza.delivery ? (`<button type="button" class="btn btn-primary" id="delivery">
            Delivery <span class="badge badge-light">🚚</span>
          </button>`):('')}
          <i class="fas fa-trash-alt float-right" id="pizza-id-${currentPizza.pizzaId}"></i>
          </div>
        </div>
      </div>
    </div>`;

  return htmlOutput
}

$(function() {

  // inits pizzeria instance
  var pizzeria1 = new Pizzeria();
  // captures UI changes and stores them for pizza making
  var liveSize;
  var liveToppings;
  var liveDelivery;

  // builds dynamic UI elemnts
  $("#pizzeria-sizes").append(render_pizzaSizes(pizzeria1));
  $("#pizzeria-toppings").append(render_pizzaToppings(pizzeria1));

  $("input").change(function() {
    liveSize = $("input[name=pizza-size]:checked").prop("id")
    liveDelivery = $("input[name=delivery]:checked").val()
    liveToppings = [];

    $("input[name=toppings]:checked").each(function() {
      liveToppings.push(this.id)
    });

    var htmlOutput = `<p>One ${liveSize}-sized pizza with: </p><ul>${listBuilder(liveToppings)}</ul>`
    $("#pizza-summary").html(htmlOutput)

  });

  $("#review").click(function(){
    $("#pizza-details").toggle();
    console.log(pizzeria1)
  });

  $("#bake").click(function() {
    $("#pizza-summary").html(bakePie(pizzeria1, liveSize,liveToppings, liveDelivery));
    $("#all-pizza-orders").append(pieViewer(pizzeria1));

    ui_orderReset();
  });

  $("#cancel").click(function() {
    ui_orderReset();
  });

  $("#all-pizza-orders").on('click','i', function() {
    let pieToRemove = this.id.match(/\d+$/)[0]

    pizzeria1.removePie(pieToRemove);
    $("#pizza-card-"+pieToRemove).remove()

  })




})
