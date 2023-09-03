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
- Connect the controller to the ```update button``` in your front-end:
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
- As you can see the fetch function here sends a request to a ```book_path``` which is a simple get request in the routes ```get "book", to: "flats#book"``` redirecting to the followowing ```book``` action in the flats controller:

```ruby
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

