# Implementing Sweet Alert2 with ajax in Rails 7

### Resources
- The **[Le Wagon Tutorial for Sweet Alert2](https://kitt.lewagon.com/knowledge/tutorials/sweetalert)** (without the ajax part)
- The source page of **[Sweet Alert2](https://sweetalert2.github.io/)**

### Introduction
  - We will assume that you already have a rails app setup
  - You can use this repo to test and explore the implementation:
    - clone this repo in the desired folder ```git clone git@github.com:OGsoundFX/sweet-alert-ajax.git```
    - implement the DB and seed it ```rails db:create db:migrate db:seed```
    - run the app and play around ```rails s```
  - In this example we have a single ```flats``` table with a ```status``` column, being either ```available``` or ```booked```
  - We will use Sweet Alert2 for the booking of a flat process which in the backend will update the flat's status from ```available``` to ```booked```
  - We will implement some ```ajax``` on top of Sweet Alert2 in order to update the booking status in the database and display it on the page without a refresh or redirect

### Setup
Pin the javascript package to your ```importmap.rb``` file by:
  - running the following command in your terminal:
    ```shell
    importmap pin sweetalert2
    ```
  - OR by copy pasting the following line in sour ```importmap.rb``` file manually:
    ```ruby
    pin "sweetalert2", to: "https://ga.jspm.io/npm:sweetalert2@11.7.27/dist/sweetalert2.all.js"
    ```
<br><br>
## Scenario 1: Have a Sweet Alert popup to ask confirmation to the user to book a flat:
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
- Connect the controller to the ```book``` button in your front-end:

```ruby
# views/flats/_flat.html.erb

<%= flat.name %>
<% if flat.status == "booked" %>
  <span><strong style="color: #a5dc86">booked</strong></span>
<% else %>
  <%= link_to "book", book_path(flat_id: flat), data: { 
    controller: "alert",
    alert_icon_value: "warning",
    alert_title_value: "Are your sure?",
    alert_html_value: "You are about to book this place",
    alert_confirm_button_text_value: "Confirm!",
    alert_show_cancel_button_value: true,
    alert_cancel_button_text_value: "Cancel",
    action: "click->alert#initSweetalert", 
    turbo: false 
  } %>
<% end %>

```   

> **Note:** You don't have to pass the values from the html file to the stimulus controller if they are not dynamic values, you can directly hard-code them in the stimuls controller like so:

```javascript
// javascript/controllers/flat_controller.js

import { Controller } from "@hotwired/stimulus"
import Swal from "sweetalert2"

export default class extends Controller {
  
  initSweetalert(event) {
    event.preventDefault();
    console.log(event)
    Swal.fire({
      icon: "warning", 
      title: "Are you sure?", 
      html: "You are about to book this place",
      confirmButtonText: "Confirm!", 
      showCancelButton: true, 
      cancelButtonText: "Cancel", 
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
- As you can see the fetch function here sends a request to a ```book_path``` which is a simple get request implemented in the routes ```get "book", to: "flats#book"``` redirecting to the following ```book``` action in the flats controller:

```ruby
# controllers/flats_controller.rb

  def book
    flat = Flat.find(params[:flat_id])
    flat.status = 1
    flat.save
    respond_to do |format|
      format.html { redirect_to root_path }
      format.text { render partial: "flat", locals: {flat: flat}, formats: [:html] }
    end
  end
```

- And the result should look like this:
    - First the sweet alert pops up to ask confirmation
    - If confirmed, then the **ajax request** is triggered and sent to the ruby controller
<img width="1439" alt="Screenshot 2023-09-03 at 16 34 02" src="https://github.com/OGsoundFX/sweet-alert-ajax/assets/32952612/3083d830-e82e-415f-bc28-0262577f3ca9">

<br><br>

## Scenario 2: Have a Sweet Alert popup after flat status update:
  - generate the stimulus controller:
   ```shell
   rails g stimulus flat2
   ```
  - implement following code in the stimulus controller just created

```javascript
// javascript/controllers/alert2_controller.js

import { Controller } from "@hotwired/stimulus"
import Swal from "sweetalert2"

export default class extends Controller {
  static values = { 
    flatName: String
  }
  
  initSweetalert(event) {
    event.preventDefault();
    fetch(event.target.href, {headers: { "Accept": "text/plain" }})
      .then(response => response.text())
      .then((data) => {
        event.target.parentElement.outerHTML = data
      }).then(
        Swal.fire({
          icon: "success", 
          title: "Congratulations", 
          html: `<h3>Your booking for <strong style="color: #a5dc86">${this.flatNameValue}</strong> is confirmed</h3>`,
          showConfirmButton: false,
          timer: 1800
        })
      )
  }
}
```

- Connect the controller to the ```book``` button in your front-end:
```ruby
# views/flats/_flat2.html.erb

<%= flat.name %>
<% if flat.status == "booked" %>
  <span><strong style="color: #a5dc86">booked</strong></span>
<% else %>
  <%= link_to "book", book_alt_path(flat_id: flat), data: { 
    controller: "alert2",
    alert2_flat_name_value: flat.name,
    action: "click->alert2#initSweetalert", 
    turbo: false 
  } %>
<% end %>
```
- The fetch function here sends a request to a ```book_alt_path``` which is a simple get request implemented in the routes ```get "book_alt", to: "flats#book_alt"``` redirecting to the following ```book_alt``` action in the flats controller:

```ruby
# controllers/flats_controller.rb

  def book
    flat = Flat.find(params[:flat_id])
    flat.status = 1
    flat.save
    respond_to do |format|
      format.html { redirect_to root_path }
      format.text { render partial: "flat", locals: {flat: flat}, formats: [:html] }
    end
  end
```
- And the result should look like this:
  - First the **ajax request** is triggered and sent to the ruby controller
  - Then the sweet alert pops up to announce confirmation
<img width="1439" alt="Screenshot 2023-09-03 at 16 51 15" src="https://github.com/OGsoundFX/sweet-alert-ajax/assets/32952612/cd53c5a8-8742-4617-b856-3cd526654342">
<br>

### Hope this helps!!! 🙌
