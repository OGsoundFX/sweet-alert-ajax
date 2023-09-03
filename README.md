# Implementing Sweet Alert2 with ajax in Rails 7

Here you can find the source page of **[Sweet Alert2](https://sweetalert2.github.io/)**

### 1- Introduction
  - We will assume that you already have a rails app setup
  - You can use this repo to test and explore the implementation:
    - clone this repo in the desired folder ```git clone git@github.com:OGsoundFX/sweet-alert-ajax.git```
    - implement the DB and seed it ```rails db:create db:migrate db:seed```
    - run the app and play around ```rails s```
  - In this example we have a single ```flats``` table with a ```status``` column, being either ```available``` or ```booked```
  - We will use Sweet Alert2 for the booking of a flat process which in the backend will update the flat's status from ```available``` to ```booked```
  - We will implement some ```ajax``` on top of Sweet Alert2 in order to update the booking status in the database and display it on the page without a refresh or redirect

### 2- Setup
Pin the javascript package to your ```importmap.rb``` file by:
  - running the following command in your terminal:
    ```shell
    importmap pin sweetalert2
    ```
  - OR by copy pasting the following line in sour ```importmap.rb``` file manually:
    ```ruby
    pin "sweetalert2", to: "https://ga.jspm.io/npm:sweetalert2@11.7.27/dist/sweetalert2.all.js"
    ```

### 2- Scenario 1: Have a Sweet Alert popup to ask confirmation to the user to book a flat:
  - generate the stimulus controller:
   ```shell
   rails g stimulus flat
   ```
  - implement following code in the stimulus controller just created
   ```javascript
  // javascript/controllers/flat_controller.js
  
  import { Controller } from "@hotwired/stimulus"
  import Swal from "sweetalert2"
  
  export default class extends Controller {
    static values = { 
      icon: String, 
      title: String, 
      html: String,
      confirmButtonText: String,
      showCancelButton: Boolean,
      cancelButtonText: String
    }
    
    initSweetalert(event) {
      event.preventDefault();
      console.log(event)
      Swal.fire({
        icon: this.iconValue, 
        title: this.titleValue, 
        html: this.htmlValue,
        footer: '<a href="/info">Need more information?</a>',
        confirmButtonText: this.confirmButtonTextValue, 
        showCancelButton: this.showCancelButtonValue, 
        cancelButtonText: this.cancelButtonTextValue, 
        reverseButtons: true
      }).then((action) => {
        if (action.isConfirmed) {
          fetch(event.target.href, {headers: { "Accept": "text/plain" }})
            .then(response => response.text())
            .then((data) => {
              event.target.parentElement.outerHTML = data
            })
        }
      }).catch(event.preventDefault())
    }
  }
   ```
   





[!NOTE] You don't have to pass the values from the html file to the stimulus controller if they are not dynamic values, you can directly hard-code them in the stimuls controller like so:
```javascript
import { Controller } from "@hotwired/stimulus"
import Swal from "sweetalert2"

export default class extends Controller {
  static values = { 
    icon: String, 
    title: String, 
    html: String,
    confirmButtonText: String,
    showCancelButton: Boolean,
    cancelButtonText: String
  }
  
  initSweetalert(event) {
    event.preventDefault();
    console.log(event)
    Swal.fire({
      icon: this.iconValue, 
      title: this.titleValue, 
      html: this.htmlValue,
      footer: '<a href="/info">Need more information?</a>',
      confirmButtonText: this.confirmButtonTextValue, 
      showCancelButton: this.showCancelButtonValue, 
      cancelButtonText: this.cancelButtonTextValue, 
      reverseButtons: true
    }).then((action) => {
      if (action.isConfirmed) {
        fetch(event.target.href, {headers: { "Accept": "text/plain" }})
          .then(response => response.text())
          .then((data) => {
            event.target.parentElement.outerHTML = data
          })
      }
    }).catch(event.preventDefault())
  }
}
```

