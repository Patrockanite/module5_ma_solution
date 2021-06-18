$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";


// Fonction  pour faciliter l'insertion de innerHTML dans les sélecteurs CSS
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Icone de chargement Ajax
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {




// ÉTAPE 0 : recherchez le code de
// *** démarrer ***
// à
// *** terminer *** au-dessous


// Nous avons modifié ce code pour récupérer toutes les catégories du serveur au lieu de
// demander simplement un extrait HTML d'accueil. 
// Nous avons maintenant aussi une autre fonction appelé buildAndShowHomeHTML qui recevra toutes les catégories du serveur
// et les traitera : choisissez une catégorie aléatoire, récupérez l'extrait HTML d'accueil, insérez-le
// catégorie aléatoire dans l'extrait HTML d'accueil, puis insérez cet extrait dans notre
// page principale (index.html).
//
// ETAPE 1 : Substituer [...] ci-dessous par la *valeur* de la fonction buildAndShowHomeHTML,
// afin qu'il puisse être appelé lorsque le serveur répond avec les données de catégories.

// *** démarrer ***
// *** start ***
// On first load, show home view

showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  function(request){
    buildAndShowHomeHTML(request);
    }, // ***** <---- TODO: STEP 1: Substitute [...] ******
  true); // Explicitly setting the flag to get JSON from server processed into an object literal
});
// *** finish **


// Builds HTML for the home page based on categories array
// returned from the server.
function buildAndShowHomeHTML(categories){
  // Load home snippet page
  $ajaxUtils.sendGetRequest(homeHtmlUrl,
    function(homeHtml){

      //ÉTAPE 2 : Ici, appelez chooseRandomCategory, en lui passant les « catégories » récupérées
       // Faites attention au type de données que la fonction renvoie par rapport à ce que le ChooseCategoryShortName
       // le nom de la variable implique qu'elle attend.
        var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
    
      // ÉTAPE 3 : Remplacez {{randomCategoryShortName}} dans l'extrait html d'accueil par le
      // catégorie choisie à partir de l'ÉTAPE 2. Utilisez la fonction insertProperty existante à cette fin.
      // Parcourez ce code pour un exemple d'utilisation de la fonction insertProperty.
      // ATTENTION! Vous insérez quelque chose qui devra se traduire par un Javascript valide
      // syntaxe car la substitution de {{randomCategoryShortName}} devient un argument
      // étant transmis à la fonction $dc.loadMenuItems. Réfléchissez à ce dont cet argument a besoin
      // ressembler à. Par exemple, un appel valide ressemblerait à ceci :
      // $dc.loadMenuItems('L')
      // Astuce : vous devez entourer le nom court de la catégorie choisie de quelque chose avant de l'insérer
      // dans l'extrait html d'accueil.
       var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName","'" + chosenCategoryShortName + "'");

      // ÉTAPE 4 : Insérez le HTML produit à l'ÉTAPE 3 dans la page principale
       // Utilisez la fonction insertHtml existante à cette fin. Regardez à travers ce code pour un exemple
       // de comment faire ça.
       // ....
       insertHtml("#main-content",homeHtmlToInsertIntoMainPage);
     },

    false); // False ici car nous n'obtenons que du HTML régulier du serveur, donc pas besoin de traiter JSON.
}


// Donne un tableau d'objets de catégorie, renvoie un objet de catégorie aléatoire.
function chooseRandomCategory (categories) {
  // Choisir un index aléatoire dans le tableau (de 0 inclus jusqu'à la longueur du tableau (exclusivement))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

  // return category object with that randomArrayIndex
  return categories[randomArrayIndex];
}


// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 !== 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
