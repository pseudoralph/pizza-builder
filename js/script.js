
function Pizzaria() {
  this.tracker = 0;
  this.pizzaSizesPrice = {small: 10, medium: 15, large: 20};
  this.pizzaToppingsPrice = {cheese: 1, pepperoni: 1, ham:1, sausage: 1, mushroom: 1, onion: 1, garlic: 1, green_peppers: 1, pineapple: 1};

  this.orderUp = [];
}

Pizzaria.prototype.newPie = function(size) {
  this.orderUp.push(new Pizza(this.tracker++,size));
}

Pizzaria.prototype.calcPrice = function(pizza) {
  var basePrice = this.pizzaSizesPrice[pizza.size];
  var addedToppings = 0;

  pizza.toppings.forEach((function(topping) {
    addedToppings += this.pizzaToppingsPrice[topping];
  }).bind(this));

  pizza.price = basePrice + addedToppings;
}

function Pizza(id,size) {
  this.size = size;
  this.pizzaId = id;

  this.toppings = [];
  this.price = 0;

  this.delivery = 2;
}

Pizza.prototype.addToppings = function(topping) {
  this.toppings.push(topping);
}

// UI functions
function ui_makeFirstCharUpper(word) {
  const firstLetter = /\b\w/g;
  let newWord = word.replace(firstLetter, word[0].toUpperCase());

  return newWord.split("_").join(" ");
}

function ui_orderReset() {
  $("input").off('change');

  $("input").prop("disabled",false);
  $("input").prop("checked",false);

  $("#pizza-details").hide();
  $("#pizza-summary").empty();
  //
  // $("#review").removeClass("btn-secondary");
  // $("#review").addClass("btn-primary");
}

// page rendering functionality dependtend on pizzaria settings
function render_pizzaSizes(pizzaria1) {
  let htmlOutput = [];

  for (let prop in pizzaria1.pizzaSizesPrice) {
    htmlOutput.push(`<label class="btn btn-secondary">\n\t<input type="radio" name="pizza-size" id="${prop}" autocomplete="off">${ui_makeFirstCharUpper(prop)}</label>\n`);
    }
    return htmlOutput.join("");
  }

function render_pizzaToppings(pizzaria1) {
  let htmlOutput = [];

  for (let prop in pizzaria1.pizzaToppingsPrice){
    htmlOutput.push(`<div class="form-check">\n\t<input class="form-check-input" type="checkbox" value="${prop}" id="${prop}">\n\t<label class="form-check-label" for="${prop}">${ui_makeFirstCharUpper(prop)}</label>\n</div>\n`);
  }
  return htmlOutput.join("");
}

function piePreparer(pizzaria1) {
  var pizzaSize;

  $("input[name=pizza-size]:checked").length ? (pizzaSize = $("input[name=pizza-size]:checked").prop("id")) : (pizzaSize = "small");

  pizzaria1.newPie(pizzaSize);
  var currentPizza = pizzaria1.orderUp[pizzaria1.orderUp.length-1];

  $("input[type=checkbox]:checked").each(function(){
    var top = $(this).val();
    currentPizza.addToppings(top.toString());
  })

  pizzaria1.calcPrice(currentPizza);

  var pizzaSummary = `<p>One <span style="text-decoration: underline;">${currentPizza.size}</span> pizza with:</p>
  <ul>${listBuilder(currentPizza.toppings)}</ul>
  <p>Amount due: $<span id="is-delivered">${currentPizza.price}</span</p>`;

  return pizzaSummary;
}

function listBuilder(toppings) {
  let htmlOutput = []

  toppings.forEach(function(topping) {

    htmlOutput.push(`<li>${ui_makeFirstCharUpper(topping)}</li>`)
  })

  return htmlOutput.join("")
}

function pieViewer(pizzaria1) {
  // console.log(pizzaria1);
  let currentPizza = pizzaria1.orderUp[pizzaria1.orderUp.length-1]

  let htmlOutput = `<div class="card">
      <div class="card-header" id="pizzaHeading${currentPizza.pizzaId}">
        <h5 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapsePizza${currentPizza.pizzaId}" aria-expanded="false" aria-controls="collapsePizza${currentPizza.pizzaId}">🍕 ${currentPizza.size} pizza<span class="float-right">$${currentPizza.price}</span></button>
        </h5>
      </div>
      <div id="collapsePizza${currentPizza.pizzaId}" class="collapse hide" aria-labelledby="pizzaHeading${currentPizza.pizzaId}" data-parent="#all-pizza-orders">
        <div class="card-body">
          <p>One ${currentPizza.size} pizza with: </p>
          <ul>${listBuilder(currentPizza.toppings)}</ul>
          <div>
          <button type="button" class="btn btn-primary" id="delivery">
            Delivery <span class="badge badge-light">🚚</span>
          </button>

          <i class="fas fa-trash-alt float-right"></i>

          </div>

        </div>
      </div>
    </div>`;

  // let htmlOutput = `<li>${currentPizza.size} pizza\t\t\t\t$${currentPizza.price}</li>`

  return htmlOutput

}

$(function() {
  // onload
  // inits a new pizzaria
  var pizzaria1 = new Pizzaria();
  // builds dynamic UI elemnts
  $("#pizzeria-sizes").append(render_pizzaSizes(pizzaria1));
  $("#pizzeria-toppings").append(render_pizzaToppings(pizzaria1));

  $("#review").click(function(){
    $("#pizza-summary").html(piePreparer(pizzaria1));
    $("#pizza-details").show();

    console.log(pizzaria1)

    $("input#delivery").change(function() {
      $("input#delivery").prop("checked") ? ($("#is-delivered").text('1111')) : ($("#is-delivered").text('666'))


    })



    // $("input").change(function() {
    //   console.log('change')
    //   $("#cancel").click();
    // });

  });

  $("#bake").click(function() {

    $("#all-pizza-orders").append(pieViewer(pizzaria1));
    // $("#in-basket").append(pieViewer(pizzaria1));
    ui_orderReset();
  });

  $("#cancel").click(function() {
    ui_orderReset();
  });

  $("#all-pizza-orders").on('click','button.close', function() {
    const regex = /\d/g;
    // console.log()

    console.log(this.id.match(/\d+$/)[0])
  })




})
