function Pizzeria() {
  this.inventory = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20, xtra_large: 25};
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, ham:1, sausage: 1, mushroom: 1, onion: 1, garlic: 1, green_peppers: 1, pineapple: 1};
  this.orders = [];
}

Pizzeria.prototype.newPie = function(size) {
  this.orders.push(new Pizza(this.inventory++,size));
}

Pizzeria.prototype.removePie = function(pieId) {
  delete this.orders[pieId];
}

Pizzeria.prototype.calcPrice = function(pizza) {
  var basePrice = this.pizzaSizesPrice[pizza.size];
  var addedToppings = 0;

  pizza.toppings.forEach((function(topping) {
    addedToppings += this.pizzaToppingsPrice[topping];
  }).bind(this));

  pizza.price = basePrice + addedToppings + (pizza.delivery ? (2) : (0));
}

function Pizza(id,size) {
  this.pizzaId = id;
  this.size = size;
  this.toppings = [];
  this.delivery = false;
  this.price = 0;
}

Pizza.prototype.addToppings = function(toppings) {
  this.toppings = toppings;
}

// UI functions
function ui_prettifyVars(word) {
  // makes first word upper case and changes underscore to space
  let newWord = word.replace(/\b\w/g, word[0].toUpperCase());
  return newWord.split("_").join(" ");
}

function ui_render_listBuilder(toList) {
  let htmlOutput = [];

  toList.forEach(function(listItem) {
    htmlOutput.push(`<li>${ui_prettifyVars(listItem)}</li>`);
  })

  return htmlOutput.join("");
}

function ui_orderReset() {
  $("input").prop("checked",false);
  $("label").removeClass("active");

  $("#pizza-details").hide();
  $("#pizza-summary").empty();
}

function ui_render_pizzaSizes(pizzeria1) {
  let htmlOutput = [];

  for (let prop in pizzeria1.pizzaSizesPrice) {
    htmlOutput.push(`<label class="btn btn-secondary">\n\t<input type="radio" name="pizza-size" id="${prop}" autocomplete="off">${ui_prettifyVars(prop)}</label>\n`);
    }
    return htmlOutput.join("");
  }

function ui_render_pizzaToppings(pizzeria1) {
  let htmlOutput = [];

  for (let prop in pizzeria1.pizzaToppingsPrice){
    htmlOutput.push(`<div class="form-check">\n\t<input class="form-check-input" name="toppings" type="checkbox" value="${prop}" id="${prop}">\n\t<label class="form-check-label" for="${prop}">${ui_prettifyVars(prop)}</label>\n</div>\n`);
  }
  return htmlOutput.join("");
}

function bakePie(pizzeria1, size="small", toppings, deliver) {
  pizzeria1.newPie(size);

  let currentPizza = pizzeria1.orders[pizzeria1.orders.length-1];

  currentPizza.addToppings(toppings);
  currentPizza.delivery = deliver;
  pizzeria1.calcPrice(currentPizza);
}

function pieViewer(pizzeria1) {
  let currentPizza = pizzeria1.orders[pizzeria1.orders.length-1];

  let htmlOutput = `<div class="card" id="pizza-card-${currentPizza.pizzaId}">
      <div class="card-header" id="pizzaHeading${currentPizza.pizzaId}">
        <h5 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapsePizza${currentPizza.pizzaId}" aria-expanded="false" aria-controls="collapsePizza${currentPizza.pizzaId}">🍕 ${ui_prettifyVars(currentPizza.size)} pizza<span class="float-right">$${currentPizza.price}</span></button>
        </h5>
      </div>
      <div id="collapsePizza${currentPizza.pizzaId}" class="collapse hide" aria-labelledby="pizzaHeading${currentPizza.pizzaId}" data-parent="#all-pizza-orders">
        <div class="card-body">
          <p>One ${currentPizza.size} pizza with: </p>
          <ul>${ui_render_listBuilder(currentPizza.toppings)}</ul>
          <div>${currentPizza.delivery ? (`<button type="button" class="btn btn-primary" id="delivery">
            Delivery <span class="badge badge-light">🚚</span>
          </button>`):('')}
          <i class="fas fa-trash-alt float-right" id="pizza-id-${currentPizza.pizzaId}"></i>
          </div>
        </div>
      </div>
    </div>`;

  return htmlOutput;
}

$(function() {
  // inits pizzeria instance
  let pizzeria1 = new Pizzeria();
  // captures UI changes and stores them for pizza making
  let liveSize;
  let liveToppings;
  let liveDelivery;

  // builds dynamic UI elemnts
  $("#pizzeria-sizes").append(ui_render_pizzaSizes(pizzeria1));
  $("#pizzeria-toppings").append(ui_render_pizzaToppings(pizzeria1));

  $("input").change(function() {
    liveSize = $("input[name=pizza-size]:checked").prop("id");
    liveDelivery = $("input[name=delivery]:checked").val();
    liveToppings = [];

    $("input[name=toppings]:checked").each(function() {
      liveToppings.push(this.id);
    });
    let htmlOutput = `<p>One ${ui_prettifyVars(liveSize)}-sized pizza with: </p><ul>${ui_render_listBuilder(liveToppings)}</ul>`;

    $("#pizza-summary").html(htmlOutput);
  });

  $("#review").click(function(){
    $("#pizza-details").toggle();
  });

  $("#bake").click(function() {
    bakePie(pizzeria1, liveSize, liveToppings, liveDelivery);
    $("#all-pizza-orders").append(pieViewer(pizzeria1));

    liveSize=null;
    liveToppings=null;
    liveDelivery=null;

    ui_orderReset();
  });

  $("#cancel").click(function() {
    ui_orderReset();
  });

  $("#all-pizza-orders").on('click','i', function() {
    let pieToRemove = this.id.match(/\d+$/)[0];

    pizzeria1.removePie(pieToRemove);
    $("#pizza-card-"+pieToRemove).remove();

  });
});
